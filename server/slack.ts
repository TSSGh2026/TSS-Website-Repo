import { OFFER_FIELDS, offerFlags } from "./email";

/**
 * Posts new form submissions to a Slack channel through an incoming webhook.
 *
 * This exists because email is the fragile channel: it needs a paid sending
 * service, a verified sender and working deliverability, and when any of those
 * lapse the failure is silent. A webhook needs none of that — it is one POST to
 * a URL, free on every Slack plan, and it lands where the team already is.
 *
 * Email and Slack are independent. Configure either, both, or neither; each
 * checks its own configuration and stays quiet if it is missing.
 */

/* Every form on the site posts to the one webhook, so the message itself has to say
   which form it was. Slack shows every message under the webhook app's name,
   whatever that app happens to be called, so the heading and the page carry it. */
const TITLES: Record<string, string> = {
  offer: "Website offer: new application",
  join: "Join the collective: new application",
  talk: "Contact: new enquiry",
  books: "Books & Keepsakes: new enquiry",
};

/** The page each form lives on, shown under the heading. */
const PAGES: Record<string, string> = {
  offer: "/offer",
  join: "/contact",
  talk: "/contact",
  books: "/books",
};

/** Slack renders text as mrkdwn, so the few characters it treats as markup go. */
function clean(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 700);
}

export async function sendSlackNotification(
  formType: string,
  data: Record<string, string>,
): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[slack] SLACK_WEBHOOK_URL not set — skipping notification");
    return;
  }

  const isOffer = formType === "offer";

  /* Offer submissions get the curated field order shared with the email
     notifier; everything else just lists whatever keys it sent. */
  const entries: Array<[string, string]> = isOffer
    ? OFFER_FIELDS.filter(([key]) => key in data).map(([key, label]) => [
        label,
        data[key] || "—",
      ])
    : Object.entries(data).map(([key, value]) => [key, value || "—"]);

  const flags = isOffer ? offerFlags(data) : [];

  const headline = data.brand
    ? `*${clean(data.brand)}* — ${clean(data.name || "no name given")}`
    : `*${clean(data.name || "New submission")}*`;

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: TITLES[formType] || "New submission" },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: `From www.storyshaperscollective.com${PAGES[formType] ?? ""}` },
      ],
    },
    { type: "section", text: { type: "mrkdwn", text: headline } },
  ];

  if (flags.length) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `:warning: *${flags.map(clean).join("*\n:warning: *")}*` },
    });
  }

  /* Slack caps a section's fields array at 10, so the rest go into one block
     below rather than being silently dropped. */
  const fieldPairs = entries.slice(0, 10).map(([label, value]) => ({
    type: "mrkdwn",
    text: `*${clean(label)}*\n${clean(value)}`,
  }));
  if (fieldPairs.length) {
    blocks.push({ type: "section", fields: fieldPairs });
  }
  const overflow = entries.slice(10);
  if (overflow.length) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: overflow.map(([l, v]) => `*${clean(l)}*: ${clean(v)}`).join("\n"),
      },
    });
  }

  if (data.email) {
    blocks.push({
      type: "context",
      elements: [{ type: "mrkdwn", text: `Reply to ${clean(data.email)}` }],
    });
  }

  const payload = {
    // Fallback for notifications and screen readers, which ignore blocks.
    text: `${TITLES[formType] || "New submission"}: ${data.brand || data.name || ""}`.trim(),
    blocks,
  };

  await postWithRetry(webhook, payload);
}

/* Slack is a single point of failure: email notifications are off, so a lost
   webhook call means a lead sits in the database with nobody told. A blip or a
   rate-limit therefore gets retried.

   The budget is tight on purpose. This call is awaited before the form
   response is sent — it has to be, or Vercel can freeze the instance and kill
   it mid-flight — so every second here is a second the applicant stares at a
   pending button. Worst case is ~6.8s (three 2s attempts plus backoff), which
   stays clear of the function timeout. The normal case is one attempt, ~200ms.

   Permanent rejections are not retried. A revoked or malformed webhook returns
   4xx and will return it three times, so it fails on the first. */
const RETRY_BACKOFF_MS = [250, 500];
const ATTEMPT_TIMEOUT_MS = 2000;

async function postWithRetry(webhook: string, payload: unknown): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= RETRY_BACKOFF_MS.length; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS[attempt - 1]));
      console.warn(`[slack] retrying webhook, attempt ${attempt + 1}`);
    }

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });

      if (response.ok) return;

      const body = await response.text();
      lastError = new Error(
        `Slack webhook returned ${response.status}: ${body}`,
      );

      /* 429 and 5xx are worth another go; every other 4xx is our problem to
         fix, not the network's, so stop and surface it. */
      const worthRetrying = response.status === 429 || response.status >= 500;
      if (!worthRetrying) break;
    } catch (error) {
      // Network failure or the per-attempt timeout firing. Both are retryable.
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Slack webhook failed for an unknown reason");
}
