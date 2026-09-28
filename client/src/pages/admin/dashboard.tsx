import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogPost, BlogCategory, Author, EmailSubscriber } from "@shared/schema";
import { uploadImage as uploadImageFile } from "@/lib/image-upload";
const RichTextEditor = lazy(() => import("@/components/admin/rich-text-editor"));

type Tab = "submissions" | "settings" | "ourstory" | "joinpage" | "contactpage" | "blogpage" | "blogcategories" | "blogposts" | "authors" | "subscribers" | "portfolios" | "security";

const tabLabels: Record<Tab, string> = {
  submissions: "Form Entries",
  settings: "Site Settings",
  ourstory: "Our Story",
  joinpage: "Join Page",
  contactpage: "Contact Page",
  blogpage: "Blog Page",
  blogcategories: "Blog Categories",
  blogposts: "Blog Posts",
  authors: "Authors",
  subscribers: "Subscribers",
  portfolios: "Portfolios",
  security: "Security",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Switzer', sans-serif",
  fontSize: "0.85rem",
  color: "#FFFFFF",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
  padding: "0.7rem 0.85rem",
  width: "100%",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "80px",
  resize: "vertical",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Switzer', sans-serif",
  fontSize: "0.55rem",
  color: "rgba(255,255,255,0.5)",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "0.35rem",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const btnPrimary: React.CSSProperties = {
  fontFamily: "'Switzer', sans-serif",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  color: "#FFFFFF",
  backgroundColor: "#7B1E7A",
  border: "none",
  borderRadius: "6px",
  padding: "0.6rem 1.25rem",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  ...btnPrimary,
  backgroundColor: "rgba(220,50,50,0.3)",
  fontSize: "0.55rem",
};

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}
      data-testid="button-save"
    >
      {saving ? "SAVING..." : "SAVE CHANGES"}
    </button>
  );
}

function SuccessMessage({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      style={{
        fontFamily: "'Switzer', sans-serif",
        fontSize: "0.75rem",
        color: "#4ade80",
        marginLeft: "0.75rem",
      }}
    >
      Saved!
    </span>
  );
}

/* There was no way to change the admin password before this — only log in and
   log out. The password the repo shipped with is in public git history, so it
   could never be rotated. */
function SecurityPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ kind: "error", text: "The two new passwords do not match." });
      return;
    }
    if (newPassword.length < 12) {
      setStatus({ kind: "error", text: "Use at least 12 characters." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ kind: "error", text: body.message || "Could not change the password." });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus({
        kind: "ok",
        text: body.otherSessionsCleared
          ? "Password changed. Every other signed-in session has been logged out."
          : "Password changed — but other sessions could not be cleared. Check the logs.",
      });
    } catch {
      setStatus({ kind: "error", text: "Network error. Nothing was changed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...cardStyle, maxWidth: "460px" }}>
      <p style={{ ...labelStyle, marginBottom: "0.75rem" }}>Change admin password</p>
      <p
        style={{
          fontFamily: "'Switzer', sans-serif",
          fontSize: "0.75rem",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.55)",
          marginBottom: "1.25rem",
        }}
      >
        This admin panel is on the public domain. Changing the password here also
        signs out every other session, so anyone already logged in is removed.
      </p>

      <form onSubmit={submit}>
        {/* autoComplete hints keep a password manager from filing the new
            password under the wrong field. */}
        <div style={{ marginBottom: "0.9rem" }}>
          <label style={labelStyle} htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={inputStyle}
            data-testid="input-current-password"
          />
        </div>
        <div style={{ marginBottom: "0.9rem" }}>
          <label style={labelStyle} htmlFor="new-password">New password (12+ characters)</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            data-testid="input-new-password"
          />
        </div>
        <div style={{ marginBottom: "1.1rem" }}>
          <label style={labelStyle} htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            data-testid="input-confirm-password"
          />
        </div>

        {status && (
          <p
            role="status"
            style={{
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
              color: status.kind === "error" ? "#FF8080" : "#7ED9A5",
            }}
            data-testid="text-password-status"
          >
            {status.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          style={{
            ...btnPrimary,
            opacity: saving || !currentPassword || !newPassword || !confirmPassword ? 0.5 : 1,
          }}
          data-testid="button-change-password"
        >
          {saving ? "CHANGING…" : "CHANGE PASSWORD"}
        </button>
      </form>
    </div>
  );
}

function SubmissionsViewer() {
  const queryClient = useQueryClient();
  const { data: submissions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/cms/submissions"],
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;
  if (!submissions || submissions.length === 0) {
    return <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem" }}>No form submissions yet.</p>;
  }

  const markRead = async (id: number, read: boolean) => {
    await fetch(`/api/cms/submissions/${id}/read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/submissions"] });
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/cms/submissions/${id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/submissions"] });
    if (expandedId === id) setExpandedId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const fieldLabels: Record<string, string> = {
    name: "Name",
    email: "Email",
    linkedin: "LinkedIn",
    portfolio: "Portfolio",
    superpower: "Superpower",
    workstyle: "Work Style",
    company: "Company",
    message: "Message",
    // /offer application fields
    brand: "Brand",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    website: "Current Site",
    whatYouDo: "What They Do",
    stage: "Stage",
    needsStore: "Needs Store",
    assetsIn48h: "Assets in 48h",
    decisionMaker: "Decision Maker",
    liveBy: "Live By",
    whatsBroken: "What's Broken",
    priceAcknowledged: "Agreed Terms",
    referrer: "Referrer",
  };

  const BADGE: Record<string, { label: string; color: string; bg: string }> = {
    join: { label: "JOIN", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
    talk: { label: "TALK", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
    offer: { label: "OFFER", color: "#f0abfc", bg: "rgba(240,171,252,0.14)" },
    books: { label: "BOOKS", color: "#fcd34d", bg: "rgba(252,211,77,0.12)" },
  };

  const offerFlags = (data: Record<string, string>) => {
    const flags: string[] = [];
    if (data.needsStore === "Yes") flags.push("NEEDS A STORE — primary disqualifier");
    if (data.needsStore === "Not sure") flags.push("Unsure about commerce — probe on the call");
    return flags;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {submissions.map((sub: any) => {
        const isExpanded = expandedId === sub.id;
        const data = sub.data as Record<string, string>;
        return (
          <div
            key={sub.id}
            style={{
              backgroundColor: sub.read ? "rgba(255,255,255,0.03)" : "rgba(123,30,122,0.08)",
              border: `1px solid ${sub.read ? "rgba(255,255,255,0.06)" : "rgba(123,30,122,0.25)"}`,
              borderRadius: "8px",
              overflow: "hidden",
            }}
            data-testid={`submission-${sub.id}`}
          >
            <div
              onClick={() => {
                setExpandedId(isExpanded ? null : sub.id);
                if (!sub.read) markRead(sub.id, true);
              }}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              {!sub.read && (
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  backgroundColor: "#7B1E7A", flexShrink: 0,
                }} />
              )}
              <span
                style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: (BADGE[sub.formType] ?? BADGE.talk).color,
                  backgroundColor: (BADGE[sub.formType] ?? BADGE.talk).bg,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              >
                {(BADGE[sub.formType] ?? BADGE.talk).label}
              </span>
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.8rem",
                color: "#FFFFFF", flex: 1,
                fontWeight: sub.read ? 400 : 600,
              }}>
                {data.name || "—"}
              </span>
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}>
                {data.email || ""}
              </span>
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem",
                color: "rgba(255,255,255,0.3)", flexShrink: 0,
              }}>
                {formatDate(sub.createdAt)}
              </span>
            </div>

            {isExpanded && (
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "1rem",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.5rem 1rem" }}>
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ display: "contents" }}>
                      <span style={{
                        fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem",
                        letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase", paddingTop: "0.15rem",
                      }}>
                        {fieldLabels[key] || key}
                      </span>
                      <span style={{
                        fontFamily: "'Switzer', sans-serif", fontSize: "0.8rem",
                        color: "#FFFFFF", whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
                {sub.formType === "offer" && offerFlags(data).length > 0 && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "0.75rem 0.9rem",
                    backgroundColor: "rgba(123,30,122,0.14)",
                    borderLeft: "3px solid #7B1E7A",
                    borderRadius: "4px",
                  }}>
                    <span style={{
                      fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem",
                      letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)",
                      textTransform: "uppercase",
                    }}>
                      Flags
                    </span>
                    <ul style={{
                      margin: "0.4rem 0 0", paddingLeft: "1.1rem",
                      fontFamily: "'Switzer', sans-serif", fontSize: "0.78rem",
                      lineHeight: 1.7, color: "#FFFFFF",
                    }}>
                      {offerFlags(data).map((flag) => (
                        <li key={flag}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => markRead(sub.id, !sub.read)}
                    style={{
                      ...btnPrimary,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      fontSize: "0.55rem",
                    }}
                    data-testid={`button-toggle-read-${sub.id}`}
                  >
                    {sub.read ? "MARK UNREAD" : "MARK READ"}
                  </button>
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    style={btnDanger}
                    data-testid={`button-delete-submission-${sub.id}`}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SettingsEditor() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const saveSection = async (key: string) => {
    setSaving(true);
    await fetch(`/api/cms/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData[key]),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
    setSaving(false);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const sections = [
    {
      key: "hero",
      title: "Hero Section",
      // The animated lines are written into the Hero component, not here. These
      // are the parts around the film: the headline search engines read, and
      // the one button it rests on. The secondary button's fields were removed
      // with the rest of the dead surfaces — the hero has had a single call to
      // action since v4, and nothing rendered them.
      fields: [
        { name: "heading", label: "Headline, line 1 (for search engines)", type: "text" },
        { name: "headingLine2", label: "Headline, line 2 (for search engines)", type: "text" },
        { name: "subheading", label: "Subheading (for search engines)", type: "textarea" },
        { name: "ctaText", label: "Primary button text", type: "text" },
        { name: "ctaLink", label: "Primary button link", type: "text" },
      ],
    },
    /* The "Services Section" block (settings.services: label + heading) was
       removed on 26 Aug. Both strings are constants in Services.tsx now, so
       editing them here changed nothing on the page. */
  ];

  return (
    <div>
      {sections.map((section) => (
        <div key={section.key} style={cardStyle}>
          <h3
            style={{
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#FFFFFF",
              marginBottom: "1rem",
            }}
          >
            {section.title}
          </h3>
          {section.fields.map((field) => (
            <div key={field.name} style={{ marginBottom: "0.75rem" }}>
              <label style={labelStyle}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[section.key]?.[field.name] || ""}
                  onChange={(e) => updateField(section.key, field.name, e.target.value)}
                  style={textareaStyle}
                  data-testid={`input-settings-${section.key}-${field.name}`}
                />
              ) : field.type === "brands" ? (
                <input
                  type="text"
                  value={(formData[section.key]?.[field.name] || []).join(", ")}
                  onChange={(e) =>
                    updateField(
                      section.key,
                      field.name,
                      e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)
                    )
                  }
                  style={inputStyle}
                  data-testid={`input-settings-${section.key}-${field.name}`}
                />
              ) : (
                <input
                  type="text"
                  value={formData[section.key]?.[field.name] || ""}
                  onChange={(e) => updateField(section.key, field.name, e.target.value)}
                  style={inputStyle}
                  data-testid={`input-settings-${section.key}-${field.name}`}
                />
              )}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center" }}>
            <SaveButton onClick={() => saveSection(section.key)} saving={saving} />
            <SuccessMessage show={saved === section.key} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ServicesEditor was removed on 26 Aug. The homepage section it fed reads
   constants in Services.tsx now, so an editor here would have written to a
   table nothing renders — worse than no editor, because it looks like it
   works. The rows, the table and the storage methods all survive. */

function OurStoryEditor() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (settings?.ourStory) setFormData(settings.ourStory);
  }, [settings]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const save = async () => {
    setSaving(true);
    setSaveError(false);
    const res = await fetch("/api/cms/settings/ourStory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    if (!res.ok) { setSaveError(true); return; }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const storyFields = [
    { key: "label", label: "Section Label", multiline: false },
    { key: "headingMain", label: "Heading (main)", multiline: false },
    { key: "headingItalic", label: "Heading (italic part)", multiline: false },
    { key: "opening", label: "Opening paragraph", multiline: true },
    { key: "misplacedVoice", label: "Misplaced voice paragraph", multiline: true },
    { key: "photocopy", label: "Photocopy paragraph", multiline: true },
    { key: "person1", label: "Person 1 (writer)", multiline: true },
    { key: "person2", label: "Person 2 (pitch deck)", multiline: true },
    { key: "person3", label: "Person 3 (smartest person)", multiline: true },
    { key: "notBoardroom", label: "Not a boardroom", multiline: true },
    { key: "slowlyThenAtOnce", label: "Slowly then at once", multiline: true },
    { key: "notJustHer", label: "Not just her", multiline: false },
    { key: "sameWeight", label: "Same quiet weight", multiline: true },
    { key: "stoppedWaiting", label: "Stopped waiting", multiline: true },
    { key: "noAgency", label: "No agency", multiline: true },
    { key: "threeHumans", label: "Three humans", multiline: true },
    { key: "bigQuestion", label: "The big question", multiline: true },
    { key: "notBornFromBusiness", label: "Not born from business", multiline: true },
    { key: "collectiveExhale", label: "Collective exhale", multiline: false },
    { key: "interdisciplinary", label: "Interdisciplinary", multiline: true },
    { key: "nowTheyDo", label: "Now they do", multiline: true },
    { key: "dontClaimAnswers", label: "Don't claim answers", multiline: true },
    { key: "closing", label: "Closing line", multiline: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {storyFields.map((f) => (
        <div key={f.key}>
          <label style={labelStyle}>{f.label}</label>
          {f.multiline ? (
            <textarea
              style={{ ...inputStyle, minHeight: "80px" }}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              data-testid={`input-ourstory-${f.key}`}
            />
          ) : (
            <input
              style={inputStyle}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              data-testid={`input-ourstory-${f.key}`}
            />
          )}
        </div>
      ))}
      {saveError && <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", color: "#f87171" }}>Save failed. Please try again.</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function JoinPageEditor() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (settings?.join) setFormData(settings.join);
  }, [settings]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const save = async () => {
    setSaving(true);
    setSaveError(false);
    const res = await fetch("/api/cms/settings/join", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    if (!res.ok) { setSaveError(true); return; }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field: string, index: number, prop: string, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = { ...arr[index], [prop]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: string, template: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const renderListEditor = (field: string, label: string, hasLabel = false) => {
    const items = formData[field] || [];
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ ...labelStyle, fontSize: "0.7rem", marginBottom: "0.75rem" }}>{label}</label>
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            {hasLabel && (
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={labelStyle}>Badge Label</label>
                <input
                  style={inputStyle}
                  value={item.label || ""}
                  onChange={(e) => updateArrayItem(field, idx, "label", e.target.value)}
                />
              </div>
            )}
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Title</label>
              <input
                style={inputStyle}
                value={item.title || ""}
                onChange={(e) => updateArrayItem(field, idx, "title", e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: "60px" }}
                value={item.body || ""}
                onChange={(e) => updateArrayItem(field, idx, "body", e.target.value)}
              />
            </div>
            <button onClick={() => removeArrayItem(field, idx)} style={btnDanger}>REMOVE</button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem(field, hasLabel ? { label: "", title: "", body: "" } : { title: "", body: "" })}
          style={{ ...btnPrimary, fontSize: "0.55rem" }}
        >
          + ADD ITEM
        </button>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={labelStyle}>Section Label</label>
        <input style={inputStyle} value={formData.label || ""} onChange={(e) => update("label", e.target.value)} data-testid="input-join-label" />
      </div>
      <div>
        <label style={labelStyle}>Heading (main)</label>
        <input style={inputStyle} value={formData.headingMain || ""} onChange={(e) => update("headingMain", e.target.value)} data-testid="input-join-headingMain" />
      </div>
      <div>
        <label style={labelStyle}>Heading (italic)</label>
        <input style={inputStyle} value={formData.headingItalic || ""} onChange={(e) => update("headingItalic", e.target.value)} data-testid="input-join-headingItalic" />
      </div>
      <div>
        <label style={labelStyle}>Intro Paragraphs (one per line)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "100px" }}
          value={(formData.introParagraphs || []).join("\n\n")}
          onChange={(e) => update("introParagraphs", e.target.value.split("\n\n").filter((s: string) => s.trim()))}
          data-testid="input-join-introParagraphs"
        />
      </div>
      <div>
        <label style={labelStyle}>"Third space" line</label>
        <input style={inputStyle} value={formData.thirdSpace || ""} onChange={(e) => update("thirdSpace", e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Operating Principles (comma-separated)</label>
        <input
          style={inputStyle}
          value={(formData.principles || []).join(", ")}
          onChange={(e) => update("principles", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
          data-testid="input-join-principles"
        />
      </div>

      {renderListEditor("collectiveAdvantages", "Collective Advantages")}
      
      <div>
        <label style={labelStyle}>Benefits Intro</label>
        <textarea style={{ ...inputStyle, minHeight: "60px" }} value={formData.benefitsIntro || ""} onChange={(e) => update("benefitsIntro", e.target.value)} />
      </div>

      {renderListEditor("memberBenefits", "Member Benefits")}

      <div>
        <label style={labelStyle}>Levels Intro</label>
        <input style={inputStyle} value={formData.levelsIntro || ""} onChange={(e) => update("levelsIntro", e.target.value)} />
      </div>

      {renderListEditor("levels", "Membership Levels", true)}

      <div>
        <label style={labelStyle}>Levels Footer</label>
        <input style={inputStyle} value={formData.levelsFooter || ""} onChange={(e) => update("levelsFooter", e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>How to Join Intro</label>
        <textarea style={{ ...inputStyle, minHeight: "60px" }} value={formData.howToJoinIntro || ""} onChange={(e) => update("howToJoinIntro", e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>How to Join Button Text</label>
        <input style={inputStyle} value={formData.howToJoinButton || ""} onChange={(e) => update("howToJoinButton", e.target.value)} />
      </div>

      {saveError && <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", color: "#f87171" }}>Save failed. Please try again.</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function BlogPageEditor() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (settings?.blog) setFormData(settings.blog);
  }, [settings]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const save = async () => {
    setSaving(true);
    setSaveError(false);
    const res = await fetch("/api/cms/settings/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    if (!res.ok) { setSaveError(true); return; }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={labelStyle}>Section Label</label>
        <input style={inputStyle} value={formData.label || ""} onChange={(e) => update("label", e.target.value)} placeholder="Blog" data-testid="input-blog-label" />
      </div>
      <div>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={formData.heading || ""} onChange={(e) => update("heading", e.target.value)} placeholder="Notes from the Margins" data-testid="input-blog-heading" />
      </div>
      <div>
        <label style={labelStyle}>Subtext</label>
        <textarea style={{ ...inputStyle, minHeight: "70px" }} value={formData.subtext || ""} onChange={(e) => update("subtext", e.target.value)} placeholder="Because good brands are built on thinking, not just things to post." data-testid="input-blog-subtext" />
      </div>

      {saveError && <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", color: "#f87171" }}>Save failed. Please try again.</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function ContactPageEditor() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery<Record<string, any>>({
    queryKey: ["/api/cms/settings"],
  });
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (settings?.contact) setFormData(settings.contact);
  }, [settings]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const save = async () => {
    setSaving(true);
    setSaveError(false);
    const res = await fetch("/api/cms/settings/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSaving(false);
    if (!res.ok) { setSaveError(true); return; }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactFields = [
    { key: "joinHeadingMain", label: "Join Section — Heading (main)" },
    { key: "joinHeadingItalic", label: "Join Section — Heading (italic)" },
    { key: "joinIntro", label: "Join Section — Intro text", multiline: true },
    { key: "joinSuccessTitle", label: "Join Section — Success title" },
    { key: "joinSuccessBody", label: "Join Section — Success body" },
    { key: "talkHeadingMain", label: "Talk Section — Heading (main)" },
    { key: "talkHeadingItalic", label: "Talk Section — Heading (italic)" },
    { key: "talkIntro", label: "Talk Section — Intro text", multiline: true },
    { key: "talkSuccessTitle", label: "Talk Section — Success title" },
    { key: "talkSuccessBody", label: "Talk Section — Success body" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {contactFields.map((f) => (
        <div key={f.key}>
          <label style={labelStyle}>{f.label}</label>
          {f.multiline ? (
            <textarea
              style={{ ...inputStyle, minHeight: "80px" }}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              data-testid={`input-contact-${f.key}`}
            />
          ) : (
            <input
              style={inputStyle}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              data-testid={`input-contact-${f.key}`}
            />
          )}
        </div>
      ))}
      {saveError && <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", color: "#f87171" }}>Save failed. Please try again.</span>}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SaveButton onClick={save} saving={saving} />
        <SuccessMessage show={saved} />
      </div>
    </div>
  );
}

function BlogCategoriesEditor() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery<BlogCategory[]>({
    queryKey: ["/api/cms/blog/categories"],
  });
  const [editData, setEditData] = useState<Record<number, Partial<BlogCategory>>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    if (categories.length) {
      const map: Record<number, Partial<BlogCategory>> = {};
      categories.forEach((c) => (map[c.id] = { ...c }));
      setEditData(map);
    }
  }, [categories]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const saveCategory = async (id: number) => {
    setSaving(id);
    const res = await fetch(`/api/cms/blog/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData[id]),
    });
    setSaving(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Save failed" }));
      alert(err.message || "Failed to save category");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/categories"] });
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/cms/blog/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Delete failed" }));
      alert(err.message || "Failed to delete category");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/categories"] });
  };

  const addCategory = async () => {
    await fetch("/api/cms/blog/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `New Category ${Date.now()}`,
        description: "",
        sortOrder: categories.length,
      }),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/categories"] });
  };

  const updateField = (id: number, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  return (
    <div>
      {categories.map((c) => (
        <div key={c.id} style={cardStyle}>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={editData[c.id]?.name || ""}
                onChange={(e) => updateField(c.id, "name", e.target.value)}
                style={inputStyle}
                data-testid={`input-blog-category-name-${c.id}`}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Slug</label>
              <input
                type="text"
                value={editData[c.id]?.slug || ""}
                onChange={(e) => updateField(c.id, "slug", e.target.value)}
                style={inputStyle}
                data-testid={`input-blog-category-slug-${c.id}`}
              />
            </div>
            <div style={{ width: "80px" }}>
              <label style={labelStyle}>Order</label>
              <input
                type="number"
                value={editData[c.id]?.sortOrder ?? 0}
                onChange={(e) => updateField(c.id, "sortOrder", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={editData[c.id]?.description || ""}
              onChange={(e) => updateField(c.id, "description", e.target.value)}
              style={textareaStyle}
              data-testid={`input-blog-category-desc-${c.id}`}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <SaveButton onClick={() => saveCategory(c.id)} saving={saving === c.id} />
            <SuccessMessage show={saved === c.id} />
            <button onClick={() => deleteCategory(c.id)} style={btnDanger} data-testid={`button-delete-category-${c.id}`}>DELETE</button>
          </div>
        </div>
      ))}
      <button onClick={addCategory} style={btnPrimary} data-testid="button-add-blog-category">
        + ADD CATEGORY
      </button>
    </div>
  );
}

function BlogPostsEditor() {
  const queryClient = useQueryClient();
  const { data: postsData, isLoading } = useQuery<{ posts: BlogPost[]; total: number; page: number; totalPages: number }>({
    queryKey: ["/api/cms/blog/posts"],
  });
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/cms/blog/categories"],
  });
  const { data: authorsList = [] } = useQuery<Author[]>({
    queryKey: ["/api/cms/authors"],
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [featuring, setFeaturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const posts = postsData?.posts || [];

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "—";
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "—";
  };

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "—";
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const startEditing = async (postId: number) => {
    const res = await fetch(`/api/cms/blog/posts/${postId}`);
    if (!res.ok) {
      alert("Failed to load post");
      return;
    }
    const post = await res.json();
    setEditingPost({ ...post });
    setEditingPostId(postId);
    setSeoOpen(false);
  };

  const createNewPost = async () => {
    const res = await fetch("/api/cms/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Untitled Post",
        slug: `untitled-${Date.now()}`,
        content: "",
        excerpt: "",
        status: "draft",
        authorName: "The Story Shapers",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Create failed" }));
      alert(err.message || "Failed to create post");
      return;
    }
    const post = await res.json();
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/posts"] });
    setEditingPost({ ...post });
    setEditingPostId(post.id);
    setSeoOpen(false);
  };

  const savePost = async () => {
    if (!editingPost) return;
    setSaving(true);
    const res = await fetch(`/api/cms/blog/posts/${editingPostId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPost),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Save failed" }));
      alert(err.message || "Failed to save post");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/posts"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/cms/blog/posts/${id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/posts"] });
    if (editingPostId === id) {
      setEditingPostId(null);
      setEditingPost(null);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadImageFile(file);
      setEditingPost((prev) => prev ? { ...prev, featuredImage: url } : prev);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const updatePostField = (field: string, value: string | number | null) => {
    setEditingPost((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  if (editingPost) {
    return (
      <div>
        <button
          onClick={() => { setEditingPostId(null); setEditingPost(null); }}
          style={{
            ...btnPrimary,
            backgroundColor: "rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
            fontSize: "0.55rem",
          }}
          data-testid="button-back-to-posts"
        >
          &larr; BACK TO LIST
        </button>

        <div style={cardStyle}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={editingPost.title || ""}
              onChange={(e) => {
                updatePostField("title", e.target.value);
                if (!editingPost.slug || editingPost.slug === generateSlug(editingPost.title || "") || editingPost.slug.startsWith("untitled-")) {
                  updatePostField("slug", generateSlug(e.target.value));
                }
              }}
              style={inputStyle}
              data-testid="input-post-title"
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Slug</label>
            <input
              type="text"
              value={editingPost.slug || ""}
              onChange={(e) => updatePostField("slug", e.target.value)}
              style={{ ...inputStyle, fontSize: "0.75rem" }}
              data-testid="input-post-slug"
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Author Name</label>
              <input
                type="text"
                value={editingPost.authorName || ""}
                onChange={(e) => updatePostField("authorName", e.target.value)}
                style={inputStyle}
                data-testid="input-post-author"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Author Profile</label>
              <select
                value={editingPost.authorId || ""}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value) : null;
                  const author = authorsList.find((a) => a.id === id);
                  updatePostField("authorId", id);
                  if (author) updatePostField("authorName", author.name);
                }}
                style={inputStyle}
                data-testid="select-post-author-id"
              >
                <option value="">No linked profile</option>
                {authorsList.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <select
                value={editingPost.categoryId || ""}
                onChange={(e) => updatePostField("categoryId", e.target.value ? parseInt(e.target.value) : null)}
                style={inputStyle}
                data-testid="select-post-category"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Status</label>
              <select
                value={editingPost.status || "draft"}
                onChange={(e) => updatePostField("status", e.target.value)}
                style={inputStyle}
                data-testid="select-post-status"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Publish Date</label>
              <input
                type="date"
                value={editingPost.publishedAt ? new Date(editingPost.publishedAt).toISOString().split("T")[0] : ""}
                onChange={(e) => updatePostField("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
                style={inputStyle}
                data-testid="input-post-publish-date"
              />
            </div>
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Featured Image</label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                value={editingPost.featuredImage || ""}
                onChange={(e) => updatePostField("featuredImage", e.target.value)}
                style={{ ...inputStyle, fontSize: "0.75rem" }}
                placeholder="Image URL or upload"
                data-testid="input-post-featured-image"
              />
              <label
                style={{
                  ...btnPrimary,
                  fontSize: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  whiteSpace: "nowrap",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? "..." : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                  data-testid="input-post-upload-image"
                />
              </label>
            </div>
            {editingPost.featuredImage && (
              <div style={{ marginTop: "0.5rem", maxWidth: "200px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={editingPost.featuredImage} alt="" style={{ width: "100%", height: "auto" }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              value={editingPost.excerpt || ""}
              onChange={(e) => updatePostField("excerpt", e.target.value)}
              style={textareaStyle}
              placeholder="Brief summary of the post..."
              data-testid="input-post-excerpt"
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>Content</label>
            <Suspense fallback={<div style={{ color: "rgba(255,255,255,0.5)", padding: "1rem" }}>Loading editor...</div>}>
              <RichTextEditor
                content={editingPost.content || ""}
                onChange={(html) => updatePostField("content", html)}
              />
            </Suspense>
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <button
              onClick={() => setSeoOpen(!seoOpen)}
              style={{
                ...btnPrimary,
                backgroundColor: "rgba(255,255,255,0.06)",
                fontSize: "0.55rem",
                width: "100%",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              data-testid="button-toggle-seo"
            >
              <span>SEO SETTINGS</span>
              <span>{seoOpen ? "▲" : "▼"}</span>
            </button>

            {seoOpen && (
              <div style={{ ...cardStyle, marginTop: "0.5rem", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    value={editingPost.metaTitle || ""}
                    onChange={(e) => updatePostField("metaTitle", e.target.value)}
                    style={inputStyle}
                    placeholder="Custom page title for search engines"
                    data-testid="input-post-meta-title"
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea
                    value={editingPost.metaDescription || ""}
                    onChange={(e) => updatePostField("metaDescription", e.target.value)}
                    style={{ ...textareaStyle, minHeight: "60px" }}
                    placeholder="Description shown in search results"
                    data-testid="input-post-meta-description"
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>OG Image URL</label>
                  <input
                    type="text"
                    value={editingPost.ogImage || ""}
                    onChange={(e) => updatePostField("ogImage", e.target.value)}
                    style={inputStyle}
                    placeholder="Image URL for social sharing"
                    data-testid="input-post-og-image"
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>Focus Keyword</label>
                  <input
                    type="text"
                    value={editingPost.focusKeyword || ""}
                    onChange={(e) => updatePostField("focusKeyword", e.target.value)}
                    style={inputStyle}
                    placeholder="Primary keyword for SEO"
                    data-testid="input-post-focus-keyword"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Canonical URL</label>
                  <input
                    type="text"
                    value={editingPost.canonicalUrl || ""}
                    onChange={(e) => updatePostField("canonicalUrl", e.target.value)}
                    style={inputStyle}
                    placeholder="https://..."
                    data-testid="input-post-canonical-url"
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <SaveButton onClick={savePost} saving={saving} />
            <SuccessMessage show={saved} />
            <button
              onClick={async () => {
                if (!editingPostId) return;
                if (!confirm("Set this as the featured post? The current featured post will be unfeatured.")) return;
                setFeaturing(true);
                const res = await fetch(`/api/cms/blog/posts/${editingPostId}/feature`, { method: "POST" });
                setFeaturing(false);
                if (res.ok) {
                  queryClient.invalidateQueries({ queryKey: ["/api/cms/blog/posts"] });
                  setEditingPost((prev) => prev ? { ...prev, featured: true } : prev);
                } else {
                  alert("Failed to set featured post");
                }
              }}
              disabled={featuring}
              style={{
                ...btnPrimary,
                backgroundColor: editingPost?.featured ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.08)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: editingPost?.featured ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.15)",
                fontSize: "0.55rem",
                opacity: featuring ? 0.6 : 1,
              }}
              data-testid="button-feature-post"
            >
              {editingPost?.featured ? "★ FEATURED" : "☆ SET AS FEATURED"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={createNewPost} style={btnPrimary} data-testid="button-add-blog-post">
          + NEW POST
        </button>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem" }}>No blog posts yet. Create your first post above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                ...cardStyle,
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
              }}
              onClick={() => startEditing(post.id)}
              data-testid={`post-row-${post.id}`}
            >
              <span
                style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: post.status === "published" ? "#4ade80" : "#fbbf24",
                  backgroundColor: post.status === "published" ? "rgba(74,222,128,0.12)" : "rgba(251,191,36,0.12)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {post.status}
              </span>
              {post.featured && (
                <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", color: "#fbbf24", flexShrink: 0 }} title="Featured post">★</span>
              )}
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem",
                color: "#FFFFFF", flex: 1, fontWeight: 500,
              }}>
                {post.title}
              </span>
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)", flexShrink: 0,
              }}>
                {getCategoryName(post.categoryId)}
              </span>
              <span style={{
                fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem",
                color: "rgba(255,255,255,0.3)", flexShrink: 0,
              }}>
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
                style={{ ...btnDanger, flexShrink: 0 }}
                data-testid={`button-delete-post-${post.id}`}
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthorsEditor() {
  const queryClient = useQueryClient();
  const { data: authorsList = [], isLoading } = useQuery<Author[]>({
    queryKey: ["/api/cms/authors"],
  });
  const [editData, setEditData] = useState<Record<number, Partial<Author>>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    if (authorsList.length) {
      const map: Record<number, Partial<Author>> = {};
      authorsList.forEach((a) => (map[a.id] = { ...a }));
      setEditData(map);
    }
  }, [authorsList]);

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const saveAuthor = async (id: number) => {
    setSaving(id);
    const res = await fetch(`/api/cms/authors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData[id]),
    });
    setSaving(null);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Save failed" }));
      alert(err.message || "Failed to save");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/authors"] });
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const deleteAuthor = async (id: number) => {
    if (!confirm("Delete this author?")) return;
    const res = await fetch(`/api/cms/authors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete author");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/authors"] });
  };

  const addAuthor = async () => {
    const res = await fetch("/api/cms/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Author", slug: `new-author-${Date.now()}`, sortOrder: authorsList.length }),
    });
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    if (!res.ok) { alert("Failed to create author"); return; }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/authors"] });
  };

  const uploadPhoto = async (id: number, file: File) => {
    setUploading(id);
    try {
      const { url } = await uploadImageFile(file);
      setEditData((prev) => ({ ...prev, [id]: { ...prev[id], photo: url } }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const updateField = (id: number, field: string, value: string | number | null) => {
    setEditData((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  return (
    <div>
      {authorsList.map((a) => (
        <div key={a.id} style={cardStyle}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0 }}>
              {editData[a.id]?.photo ? (
                <img src={editData[a.id]?.photo || ""} alt={a.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(167,139,250,0.3)" }} />
              ) : (
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(167,139,250,0.1)", border: "2px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.25rem" }}>👤</span>
                </div>
              )}
              <label style={{ ...btnPrimary, display: "block", fontSize: "0.45rem", padding: "0.3rem 0.4rem", marginTop: "0.35rem", textAlign: "center", opacity: uploading === a.id ? 0.6 : 1 }}>
                {uploading === a.id ? "..." : "PHOTO"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(a.id, f); }} />
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Name</label>
                  <input type="text" value={editData[a.id]?.name || ""} onChange={(e) => updateField(a.id, "name", e.target.value)} style={inputStyle} data-testid={`input-author-name-${a.id}`} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Slug</label>
                  <input type="text" value={editData[a.id]?.slug || ""} onChange={(e) => updateField(a.id, "slug", e.target.value)} style={{ ...inputStyle, fontSize: "0.75rem" }} data-testid={`input-author-slug-${a.id}`} />
                </div>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={labelStyle}>Bio</label>
                <textarea value={editData[a.id]?.bio || ""} onChange={(e) => updateField(a.id, "bio", e.target.value)} style={textareaStyle} rows={3} data-testid={`input-author-bio-${a.id}`} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input type="text" value={editData[a.id]?.linkedin || ""} onChange={(e) => updateField(a.id, "linkedin", e.target.value)} style={inputStyle} placeholder="https://linkedin.com/in/..." data-testid={`input-author-linkedin-${a.id}`} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Twitter/X URL</label>
                  <input type="text" value={editData[a.id]?.twitter || ""} onChange={(e) => updateField(a.id, "twitter", e.target.value)} style={inputStyle} placeholder="https://x.com/..." data-testid={`input-author-twitter-${a.id}`} />
                </div>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={labelStyle}>Website</label>
                <input type="text" value={editData[a.id]?.website || ""} onChange={(e) => updateField(a.id, "website", e.target.value)} style={inputStyle} placeholder="https://..." data-testid={`input-author-website-${a.id}`} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <SaveButton onClick={() => saveAuthor(a.id)} saving={saving === a.id} />
            <SuccessMessage show={saved === a.id} />
            <button onClick={() => deleteAuthor(a.id)} style={btnDanger} data-testid={`button-delete-author-${a.id}`}>DELETE</button>
          </div>
        </div>
      ))}
      <button onClick={addAuthor} style={btnPrimary} data-testid="button-add-author">+ ADD AUTHOR</button>
    </div>
  );
}

function SubscribersEditor() {
  const queryClient = useQueryClient();
  const { data: subscribers = [], isLoading } = useQuery<EmailSubscriber[]>({
    queryKey: ["/api/cms/subscribers"],
  });

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  const unsubscribe = async (id: number) => {
    if (!confirm("Mark this subscriber as unsubscribed?")) return;
    await fetch(`/api/cms/subscribers/${id}/unsubscribe`, { method: "PUT" });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/subscribers"] });
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm("Delete this subscriber record?")) return;
    await fetch(`/api/cms/subscribers/${id}`, { method: "DELETE" });
    queryClient.invalidateQueries({ queryKey: ["/api/cms/subscribers"] });
  };

  const formatDate = (d: string | Date) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const active = subscribers.filter((s) => s.status === "active");
  const inactive = subscribers.filter((s) => s.status !== "active");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <p style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          <span style={{ color: "#4ade80", fontWeight: 600 }}>{active.length}</span> active · {inactive.length} unsubscribed
        </p>
        <a
          href="/api/cms/subscribers/export"
          download
          style={{
            ...btnPrimary,
            textDecoration: "none",
            fontSize: "0.55rem",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          data-testid="link-export-subscribers"
        >
          EXPORT CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem" }}>No subscribers yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              style={{
                ...cardStyle,
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
              }}
              data-testid={`subscriber-row-${sub.id}`}
            >
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", letterSpacing: "0.08em", color: sub.status === "active" ? "#4ade80" : "rgba(255,255,255,0.3)", backgroundColor: sub.status === "active" ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)", padding: "0.15rem 0.45rem", borderRadius: "4px", flexShrink: 0, textTransform: "uppercase" }}>
                {sub.status}
              </span>
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem", color: "#FFFFFF", flex: 1 }} data-testid={`text-subscriber-email-${sub.id}`}>
                {sub.email}
              </span>
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                {sub.source}
              </span>
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                {formatDate(sub.createdAt)}
              </span>
              {sub.status === "active" && (
                <button onClick={() => unsubscribe(sub.id)} style={{ ...btnDanger, fontSize: "0.5rem", flexShrink: 0 }} data-testid={`button-unsubscribe-${sub.id}`}>
                  UNSUB
                </button>
              )}
              <button onClick={() => deleteSubscriber(sub.id)} style={{ ...btnDanger, fontSize: "0.5rem", flexShrink: 0 }} data-testid={`button-delete-subscriber-${sub.id}`}>
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortfoliosEditor() {
  const queryClient = useQueryClient();
  const { data: portfolios, isLoading } = useQuery<any[]>({ queryKey: ["/api/cms/portfolios"] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditing(JSON.parse(JSON.stringify(p)));
  };

  const updateField = (path: string[], value: any) => {
    setEditing((prev: any) => {
      if (!prev) return prev;
      const next = { ...prev };
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = { ...(cur[path[i]] || {}) };
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (section: string, key: string, idx: number, field: string, value: any) => {
    setEditing((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      const arr = [...(sec[key] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      sec[key] = arr;
      return { ...prev, [section]: sec };
    });
  };

  const addArrayItem = (section: string, key: string, blank: any) => {
    setEditing((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      sec[key] = [...(sec[key] || []), blank];
      return { ...prev, [section]: sec };
    });
  };

  const removeArrayItem = (section: string, key: string, idx: number) => {
    setEditing((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      sec[key] = (sec[key] || []).filter((_: any, i: number) => i !== idx);
      return { ...prev, [section]: sec };
    });
  };

  const updateTopArray = (key: string, idx: number, field: string, value: any) => {
    setEditing((prev: any) => {
      const arr = [...(prev[key] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  const addTopArrayItem = (key: string, blank: any) => {
    setEditing((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), blank] }));
  };

  const removeTopArrayItem = (key: string, idx: number) => {
    setEditing((prev: any) => ({ ...prev, [key]: (prev[key] || []).filter((_: any, i: number) => i !== idx) }));
  };

  const upload = async (file: File, onUrl: (u: string) => void) => {
    setUploading(true);
    try {
      const { url } = await uploadImageFile(file);
      onUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally { setUploading(false); }
  };

  const save = async () => {
    if (!editing || !editingId) return;
    setSaving(true);
    const r = await fetch(`/api/cms/portfolios/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (!r.ok) {
      alert("Failed to save");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["/api/cms/portfolios"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>;

  if (editing) {
    const sectionHeader: React.CSSProperties = {
      fontFamily: "'Switzer', sans-serif",
      fontSize: "0.65rem",
      letterSpacing: "0.2em",
      color: "#FFAEDA",
      textTransform: "uppercase",
      marginTop: "1.5rem",
      marginBottom: "0.75rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    };
    const subRow: React.CSSProperties = { display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" };
    const smallBtn: React.CSSProperties = { ...btnPrimary, fontSize: "0.5rem", padding: "0.4rem 0.7rem" };

    const ImageInput = ({ value, onChange, testid }: { value: string; onChange: (v: string) => void; testid: string }) => (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, fontSize: "0.75rem" }} placeholder="Image URL" data-testid={testid} />
        <label style={{ ...smallBtn, opacity: uploading ? 0.6 : 1, cursor: "pointer", whiteSpace: "nowrap" }}>
          {uploading ? "..." : "UPLOAD"}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, onChange); }} />
        </label>
      </div>
    );

    return (
      <div>
        <button onClick={() => { setEditingId(null); setEditing(null); }} style={{ ...btnPrimary, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "1rem", fontSize: "0.55rem" }} data-testid="button-back-portfolios">
          ← BACK TO LIST
        </button>

        <div style={cardStyle}>
          <h3 style={{ fontFamily: "'Zodiak', serif", fontSize: "1.1rem", color: "#fff", marginBottom: "1rem" }}>
            {editing.name} <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>/{editing.slug}</span>
          </h3>

          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Display Name</label>
            <input style={inputStyle} value={editing.name || ""} onChange={(e) => updateField(["name"], e.target.value)} data-testid="input-portfolio-name" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Meta Title</label>
            <input style={inputStyle} value={editing.metaTitle || ""} onChange={(e) => updateField(["metaTitle"], e.target.value)} data-testid="input-portfolio-meta-title" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Meta Description</label>
            <textarea style={textareaStyle} value={editing.metaDescription || ""} onChange={(e) => updateField(["metaDescription"], e.target.value)} data-testid="input-portfolio-meta-description" />
          </div>

          {/* HERO */}
          <div style={sectionHeader}>Hero</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Eyebrow (optional)</label>
            <input style={inputStyle} value={editing.hero?.eyebrow || ""} onChange={(e) => updateField(["hero", "eyebrow"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Headline Line 1</label>
            <input style={inputStyle} value={editing.hero?.headlineLine1 || ""} onChange={(e) => updateField(["hero", "headlineLine1"], e.target.value)} data-testid="input-hero-line1" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Headline Line 2</label>
            <input style={inputStyle} value={editing.hero?.headlineLine2 || ""} onChange={(e) => updateField(["hero", "headlineLine2"], e.target.value)} data-testid="input-hero-line2" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <input type="checkbox" checked={!!editing.hero?.headlineLine2Italic} onChange={(e) => updateField(["hero", "headlineLine2Italic"], e.target.checked)} />
              <span>Italic accent on Line 2</span>
            </label>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Subtext</label>
            <textarea style={textareaStyle} value={editing.hero?.subtext || ""} onChange={(e) => updateField(["hero", "subtext"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Portrait Image</label>
            <ImageInput value={editing.hero?.portrait || ""} onChange={(v) => updateField(["hero", "portrait"], v)} testid="input-hero-portrait" />
          </div>
          <label style={labelStyle}>Hero CTAs</label>
          {(editing.hero?.ctas || []).map((c: any, i: number) => (
            <div key={i} style={subRow}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={c.label || ""} onChange={(e) => updateArrayItem("hero", "ctas", i, "label", e.target.value)} />
              <input style={{ ...inputStyle, flex: 2 }} placeholder="URL" value={c.href || ""} onChange={(e) => updateArrayItem("hero", "ctas", i, "href", e.target.value)} />
              <button style={btnDanger} onClick={() => removeArrayItem("hero", "ctas", i)}>×</button>
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("hero", "ctas", { label: "", href: "" })}>+ ADD CTA</button>

          {/* BRANDS */}
          <div style={sectionHeader}>Brands strip</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={editing.brands?.title || ""} onChange={(e) => updateField(["brands", "title"], e.target.value)} />
          </div>
          {(editing.brands?.items || []).map((b: any, i: number) => (
            <div key={i} style={subRow}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Brand name" value={b.name || ""} onChange={(e) => updateArrayItem("brands", "items", i, "name", e.target.value)} />
              <input style={{ ...inputStyle, flex: 2 }} placeholder="Logo URL (optional)" value={b.logo || ""} onChange={(e) => updateArrayItem("brands", "items", i, "logo", e.target.value)} />
              <button style={btnDanger} onClick={() => removeArrayItem("brands", "items", i)}>×</button>
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("brands", "items", { name: "", logo: "" })}>+ ADD BRAND</button>

          {/* STATS */}
          <div style={sectionHeader}>Stats</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Eyebrow Label</label>
            <input style={inputStyle} value={editing.stats?.label || ""} onChange={(e) => updateField(["stats", "label"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={editing.stats?.title || ""} onChange={(e) => updateField(["stats", "title"], e.target.value)} />
          </div>
          {(editing.stats?.items || []).map((s: any, i: number) => (
            <div key={i} style={{ ...cardStyle, padding: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={subRow}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Value (e.g. 5M+)" value={s.value || ""} onChange={(e) => updateArrayItem("stats", "items", i, "value", e.target.value)} />
                <input style={{ ...inputStyle, flex: 2 }} placeholder="Label" value={s.label || ""} onChange={(e) => updateArrayItem("stats", "items", i, "label", e.target.value)} />
                <button style={btnDanger} onClick={() => removeArrayItem("stats", "items", i)}>×</button>
              </div>
              <textarea style={{ ...textareaStyle, minHeight: "50px" }} placeholder="Context (optional)" value={s.context || ""} onChange={(e) => updateArrayItem("stats", "items", i, "context", e.target.value)} />
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("stats", "items", { value: "", label: "", context: "" })}>+ ADD STAT</button>

          {/* CASE STUDIES */}
          <div style={sectionHeader}>Case Studies</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Eyebrow Label</label>
            <input style={inputStyle} value={editing.caseStudies?.label || ""} onChange={(e) => updateField(["caseStudies", "label"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={editing.caseStudies?.title || ""} onChange={(e) => updateField(["caseStudies", "title"], e.target.value)} />
          </div>
          {(editing.caseStudies?.items || []).map((c: any, i: number) => (
            <div key={i} style={{ ...cardStyle, padding: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>CASE #{i + 1}</span>
                <button style={btnDanger} onClick={() => removeArrayItem("caseStudies", "items", i)}>REMOVE</button>
              </div>
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Tag (e.g. Headout · Content Leadership)" value={c.tag || ""} onChange={(e) => updateArrayItem("caseStudies", "items", i, "tag", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Card Title" value={c.cardTitle || ""} onChange={(e) => updateArrayItem("caseStudies", "items", i, "cardTitle", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Modal Title (optional, defaults to card title)" value={c.modalTitle || ""} onChange={(e) => updateArrayItem("caseStudies", "items", i, "modalTitle", e.target.value)} />
              <label style={labelStyle}>Case Image (optional)</label>
              <div style={{ marginBottom: "0.4rem" }}>
                <ImageInput value={c.image || ""} onChange={(v) => updateArrayItem("caseStudies", "items", i, "image", v)} testid={`input-case-image-${i}`} />
              </div>
              <textarea style={{ ...textareaStyle, marginBottom: "0.4rem" }} placeholder="The situation" value={c.situation || ""} onChange={(e) => updateArrayItem("caseStudies", "items", i, "situation", e.target.value)} />
              <label style={labelStyle}>What I built (rich text)</label>
              <div style={{ marginBottom: "0.4rem" }}>
                <Suspense fallback={<div style={{ color: "rgba(255,255,255,0.5)", padding: "0.5rem" }}>Loading editor...</div>}>
                  <RichTextEditor content={c.whatIBuilt || ""} onChange={(html) => updateArrayItem("caseStudies", "items", i, "whatIBuilt", html)} />
                </Suspense>
              </div>
              <textarea style={{ ...textareaStyle, marginBottom: "0.4rem" }} placeholder="What changed" value={c.whatChanged || ""} onChange={(e) => updateArrayItem("caseStudies", "items", i, "whatChanged", e.target.value)} />
              <label style={labelStyle}>Metrics</label>
              {(c.metrics || []).map((m: any, mi: number) => (
                <div key={mi} style={subRow}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Value" value={m.value || ""} onChange={(e) => {
                    const newMetrics = [...(c.metrics || [])];
                    newMetrics[mi] = { ...newMetrics[mi], value: e.target.value };
                    updateArrayItem("caseStudies", "items", i, "metrics", newMetrics);
                  }} />
                  <input style={{ ...inputStyle, flex: 2 }} placeholder="Label" value={m.label || ""} onChange={(e) => {
                    const newMetrics = [...(c.metrics || [])];
                    newMetrics[mi] = { ...newMetrics[mi], label: e.target.value };
                    updateArrayItem("caseStudies", "items", i, "metrics", newMetrics);
                  }} />
                  <button style={btnDanger} onClick={() => {
                    const newMetrics = (c.metrics || []).filter((_: any, x: number) => x !== mi);
                    updateArrayItem("caseStudies", "items", i, "metrics", newMetrics);
                  }}>×</button>
                </div>
              ))}
              <button style={smallBtn} onClick={() => {
                const newMetrics = [...(c.metrics || []), { value: "", label: "" }];
                updateArrayItem("caseStudies", "items", i, "metrics", newMetrics);
              }}>+ METRIC</button>
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("caseStudies", "items", { tag: "", cardTitle: "", modalTitle: "", situation: "", whatIBuilt: "", whatChanged: "", metrics: [] })}>+ ADD CASE STUDY</button>

          {/* TESTIMONIALS */}
          <div style={sectionHeader}>Testimonials</div>
          {(editing.testimonials || []).map((t: any, i: number) => (
            <div key={i} style={{ ...cardStyle, padding: "1rem", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>QUOTE #{i + 1}</span>
                <button style={btnDanger} onClick={() => removeTopArrayItem("testimonials", i)}>REMOVE</button>
              </div>
              <textarea style={{ ...textareaStyle, marginBottom: "0.4rem" }} placeholder="Quote" value={t.quote || ""} onChange={(e) => updateTopArray("testimonials", i, "quote", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Name" value={t.name || ""} onChange={(e) => updateTopArray("testimonials", i, "name", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Role · Org" value={t.role || ""} onChange={(e) => updateTopArray("testimonials", i, "role", e.target.value)} />
              <label style={labelStyle}>Avatar</label>
              <ImageInput value={t.avatar || ""} onChange={(v) => updateTopArray("testimonials", i, "avatar", v)} testid={`input-testimonial-avatar-${i}`} />
            </div>
          ))}
          <button style={smallBtn} onClick={() => addTopArrayItem("testimonials", { quote: "", name: "", role: "", avatar: "" })}>+ ADD TESTIMONIAL</button>

          {/* ABOUT */}
          <div style={sectionHeader}>About</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Eyebrow Label</label>
            <input style={inputStyle} value={editing.about?.label || ""} onChange={(e) => updateField(["about", "label"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={editing.about?.title || ""} onChange={(e) => updateField(["about", "title"], e.target.value)} />
          </div>
          <label style={labelStyle}>Paragraphs</label>
          {(editing.about?.paragraphs || []).map((p: string, i: number) => (
            <div key={i} style={subRow}>
              <textarea style={{ ...textareaStyle, flex: 1, minHeight: "70px" }} value={p} onChange={(e) => {
                const arr = [...(editing.about?.paragraphs || [])];
                arr[i] = e.target.value;
                updateField(["about", "paragraphs"], arr);
              }} />
              <button style={btnDanger} onClick={() => {
                const arr = (editing.about?.paragraphs || []).filter((_: any, x: number) => x !== i);
                updateField(["about", "paragraphs"], arr);
              }}>×</button>
            </div>
          ))}
          <button style={smallBtn} onClick={() => updateField(["about", "paragraphs"], [...(editing.about?.paragraphs || []), ""])}>+ PARAGRAPH</button>

          <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Pull Quote (optional)</label>
            <textarea style={textareaStyle} placeholder="A short standout quote rendered between paragraphs" value={editing.about?.pullQuote || ""} onChange={(e) => updateField(["about", "pullQuote"], e.target.value)} data-testid="input-about-pullquote" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Photo</label>
            <ImageInput value={editing.about?.photo || ""} onChange={(v) => updateField(["about", "photo"], v)} testid="input-about-photo" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Secondary Photo (optional)</label>
            <ImageInput value={editing.about?.secondaryPhoto || ""} onChange={(v) => updateField(["about", "secondaryPhoto"], v)} testid="input-about-secondary-photo" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input style={inputStyle} value={(editing.about?.tags || []).join(", ")} onChange={(e) => updateField(["about", "tags"], e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
          </div>

          {/* WORK WITH ME */}
          <div style={sectionHeader}>Work With Me</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={editing.workWithMe?.title || ""} onChange={(e) => updateField(["workWithMe", "title"], e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Subtitle</label>
            <textarea style={textareaStyle} value={editing.workWithMe?.subtitle || ""} onChange={(e) => updateField(["workWithMe", "subtitle"], e.target.value)} />
          </div>
          {(editing.workWithMe?.cards || []).map((card: any, i: number) => (
            <div key={i} style={{ ...cardStyle, padding: "1rem", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>OFFER #{i + 1}</span>
                <button style={btnDanger} onClick={() => removeArrayItem("workWithMe", "cards", i)}>REMOVE</button>
              </div>
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Eyebrow (e.g. Start here)" value={card.eyebrow || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "eyebrow", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Title" value={card.title || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "title", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="Price (e.g. ₹3,000 / 30 min)" value={card.price || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "price", e.target.value)} />
              <textarea style={{ ...textareaStyle, marginBottom: "0.4rem" }} placeholder="Description" value={card.description || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "description", e.target.value)} />
              <input style={{ ...inputStyle, marginBottom: "0.4rem" }} placeholder="CTA Label" value={card.ctaLabel || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "ctaLabel", e.target.value)} />
              <input style={inputStyle} placeholder="CTA URL" value={card.ctaHref || ""} onChange={(e) => updateArrayItem("workWithMe", "cards", i, "ctaHref", e.target.value)} />
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("workWithMe", "cards", { eyebrow: "", title: "", price: "", description: "", ctaLabel: "", ctaHref: "" })}>+ ADD OFFER</button>

          {/* FOOTER */}
          <div style={sectionHeader}>Footer</div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Tagline (italic line under logo)</label>
            <input style={inputStyle} value={editing.footer?.tagline || ""} onChange={(e) => updateField(["footer", "tagline"], e.target.value)} data-testid="input-footer-tagline" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Contact Email</label>
            <input style={inputStyle} placeholder="hello@storyshaperscollective.com" value={editing.footer?.email || ""} onChange={(e) => updateField(["footer", "email"], e.target.value)} data-testid="input-footer-email" />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Copyright Line</label>
            <input style={inputStyle} placeholder="© 2026 The Story Shapers. All rights reserved." value={editing.footer?.copyright || ""} onChange={(e) => updateField(["footer", "copyright"], e.target.value)} data-testid="input-footer-copyright" />
          </div>
          <label style={labelStyle}>Links</label>
          {(editing.footer?.links || []).map((l: any, i: number) => (
            <div key={i} style={subRow}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Label" value={l.label || ""} onChange={(e) => updateArrayItem("footer", "links", i, "label", e.target.value)} />
              <input style={{ ...inputStyle, flex: 2 }} placeholder="URL" value={l.href || ""} onChange={(e) => updateArrayItem("footer", "links", i, "href", e.target.value)} />
              <button style={btnDanger} onClick={() => removeArrayItem("footer", "links", i)}>×</button>
            </div>
          ))}
          <button style={smallBtn} onClick={() => addArrayItem("footer", "links", { label: "", href: "" })}>+ ADD LINK</button>

          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <SaveButton onClick={save} saving={saving} />
            <SuccessMessage show={saved} />
            <a href={`/${editing.slug}`} target="_blank" rel="noreferrer" style={{ ...btnPrimary, backgroundColor: "rgba(255,255,255,0.08)", textDecoration: "none", display: "inline-block" }}>
              VIEW PAGE →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {(portfolios || []).length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Switzer', sans-serif", fontSize: "0.85rem" }}>No portfolios yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(portfolios || []).map((p: any) => (
            <div key={p.id} style={{ ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }} onClick={() => startEdit(p)} data-testid={`portfolio-row-${p.slug}`}>
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.95rem", color: "#FFFFFF", flex: 1, fontWeight: 500 }}>
                {p.name}
              </span>
              <span style={{ fontFamily: "'Switzer', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>
                /{p.slug}
              </span>
              <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} style={{ ...btnPrimary, fontSize: "0.55rem" }} data-testid={`button-edit-portfolio-${p.slug}`}>
                EDIT
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("submissions");
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
  const { data: submissions } = useQuery<any[]>({
    queryKey: ["/api/cms/submissions"],
    enabled: !!user,
  });
  const unreadCount = submissions?.filter((s: any) => !s.read).length || 0;

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/admin/login");
    }
  }, [isLoading, error, user, setLocation]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Switzer', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  /* Kept in step with `tabLabels` by hand — this list drives the sidebar, and
     `Tab[]` accepts a subset, so leaving one out compiles cleanly and simply
     makes that panel unreachable. Add to both. */
  const tabs: Tab[] = ["submissions", "settings", "ourstory", "joinpage", "contactpage", "blogpage", "blogcategories", "blogposts", "authors", "subscribers", "portfolios", "security"];

  return (
    <div style={{ backgroundColor: "#0C0A3E", minHeight: "100vh" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          backgroundColor: "#0C0A3E",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <h1
            style={{
              fontFamily: "'Zodiak', serif",
              fontSize: "1rem",
              color: "#FFFFFF",
            }}
          >
            CMS
          </h1>
          <a
            href="/"
            target="_blank"
            style={{
              fontFamily: "'Switzer', sans-serif",
              fontSize: "0.55rem",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              letterSpacing: "0.1em",
            }}
          >
            VIEW SITE →
          </a>
        </div>
        <button
          onClick={handleLogout}
          style={{
            fontFamily: "'Switzer', sans-serif",
            fontSize: "0.55rem",
            color: "rgba(255,255,255,0.5)",
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            letterSpacing: "0.1em",
          }}
          data-testid="button-admin-logout"
        >
          LOGOUT
        </button>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
        <div
          style={{
            width: "200px",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            padding: "1rem 0",
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "'Switzer', sans-serif",
                fontSize: "0.8rem",
                color: activeTab === tab ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                backgroundColor: activeTab === tab ? "rgba(123,30,122,0.2)" : "transparent",
                borderLeft: activeTab === tab ? "2px solid #7B1E7A" : "2px solid transparent",
                border: "none",
                borderLeftWidth: "2px",
                borderLeftStyle: "solid",
                borderLeftColor: activeTab === tab ? "#7B1E7A" : "transparent",
                padding: "0.65rem 1.25rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              data-testid={`tab-${tab}`}
            >
              {tabLabels[tab]}
              {tab === "submissions" && unreadCount > 0 && (
                <span style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#7B1E7A",
                  color: "#FFFFFF",
                  fontSize: "0.55rem",
                  fontFamily: "'Switzer', sans-serif",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "10px",
                  minWidth: "18px",
                  textAlign: "center",
                  display: "inline-block",
                }} data-testid="badge-unread-count">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: "1.5rem", maxWidth: "800px" }}>
          <h2
            style={{
              fontFamily: "'Zodiak', serif",
              fontSize: "1.25rem",
              color: "#FFFFFF",
              marginBottom: "1.5rem",
            }}
          >
            {tabLabels[activeTab]}
          </h2>

          {activeTab === "submissions" && <SubmissionsViewer />}
          {activeTab === "settings" && <SettingsEditor />}
          {activeTab === "ourstory" && <OurStoryEditor />}
          {activeTab === "joinpage" && <JoinPageEditor />}
          {activeTab === "contactpage" && <ContactPageEditor />}
          {activeTab === "blogpage" && <BlogPageEditor />}
          {activeTab === "blogcategories" && <BlogCategoriesEditor />}
          {activeTab === "blogposts" && <BlogPostsEditor />}
          {activeTab === "authors" && <AuthorsEditor />}
          {activeTab === "subscribers" && <SubscribersEditor />}
          {activeTab === "portfolios" && <PortfoliosEditor />}
          {activeTab === "security" && <SecurityPanel />}
        </div>
      </div>
    </div>
  );
}
