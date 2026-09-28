import { useEffect } from "react";
import { Link } from "wouter";
import "@/styles/offer.css";
import { ArrowLeft } from "lucide-react";
import { GOVERNING_CITY, INSTAGRAM_URL, SITE_URL } from "@/lib/offer-config";

/** A body block is a paragraph, or an array of items rendered as a bullet list. */
type Block = string | string[];
type Clause = { title: string; body: Block[] };

/* ---------------------------------------------------------------------------
 * LLP Act 2008 s.21 compliance — statutory, not cosmetic. Every LLP's
 * "invoices, official correspondence and publications" must carry: (a) the
 * LLP's name, (b) the address of its registered office, (c) its LLPIN, and
 * (d) a statement that it is registered with limited liability. A public T&C
 * page behind a ₹25,000 payment is squarely a "publication".
 *
 * All four are present: clause 1 (all four), clause 17 (name + LLPIN +
 * address, for service of notice) and the page footer (all four).
 * LLPIN ACW-3552, supplied by Fatema 13 Aug 2026. If it ever changes, those
 * are the three places.
 *
 * NOTE on spelling: the registered address says "Bangalore" because that is
 * how the LLP is registered; clause 19 says "Bengaluru" via GOVERNING_CITY.
 * Both are correct. Do not harmonise them.
 * ------------------------------------------------------------------------- */

const CLAUSES: Clause[] = [
  {
    title: "1. Who we are, and what these terms cover",
    body: [
      "These Terms & Conditions (“Terms”) govern the website design, copywriting and development engagement offered by The Story Shapers Collective LLP, a limited liability partnership registered in India under the Limited Liability Partnership Act, 2008 with LLP identification number ACW-3552 and registered with limited liability, whose registered office is at 15, Raam Durg, 3rd Main, Jayamahal Extension, Benson Town, Bangalore – 560046, Karnataka, India (“The Story Shapers”, “we”, “us”), under its website offer (the “Offer”) to the person or entity that applies for and confirms a slot (the “Client”, “you”).",
      "Submitting an application is not a booking, and we are not obliged to accept it. The alignment call commits neither of us. A contract to deliver the Offer comes into existence only when we confirm a slot to you in writing and your booking fee reaches us in cleared funds, as set out in clause 5.",
      "From that point, these Terms and the written scope note issued after the alignment call together form the whole agreement between us. Where the scope note and these Terms conflict, the scope note prevails on matters of scope alone, for that engagement only, and only where you have confirmed it in writing. The scope note cannot change the fee, the refund position, the intellectual property terms, the limits on our liability or the governing law. Those change only by a written amendment under clause 20.",
    ],
  },
  {
    title: "2. The Offer",
    body: [
      "The Offer comprises: website copywriting; design and development of a website of up to five (5) pages; mobile-responsive implementation; meta and Open Graph tags; image compression; and functional contact or enquiry forms. We test what we deliver on the release versions current at your kickoff date of Chrome, Safari, Firefox and Edge, on desktop, and on current iOS and Android devices.",
      "“Website copywriting” means writing and editing the copy that appears on the pages we build for you, shaped from the information, materials and answers you supply. Working out what the website should say is part of it, and is what the alignment call and our questions are for.",
      "It does not include: brand strategy, positioning or messaging work produced as a standalone deliverable; naming of any kind, including company, product, service or campaign names; market, category or competitor research; case studies, whitepapers, blog articles or other long-form content; or copy for anything other than the website itself, such as decks, brochures, email campaigns, advertising or social media.",
      "We write from what you give us. Where the information you supply is not enough for us to write a page properly, we will tell you in writing and ask for more; we are not obliged to research, source or invent it, and time spent waiting for it is a delay on your side for the purposes of clause 6. Clause 8 sets out your responsibility for the accuracy of what you supply.",
      "₹80,000 (Indian Rupees eighty thousand) is the complete professional fee payable to The Story Shapers for the included scope. Third-party costs and excluded services described in these Terms are not included. If our tax registration position changes later, the fee for slots already confirmed does not change.",
      "“Up to five pages” is a ceiling, not a target. If your website needs fewer, the fee is the same, and unused pages cannot be carried forward, exchanged for other work, or given to anyone else.",
      "The Offer covers one website for one brand. A slot covers a single brand. Where you own or operate more than one brand, business or trading name, each requires its own slot at its own fee, and a single website covering several brands is outside the Offer. A slot is personal to you and cannot be sold, transferred or shared.",
      "We run a limited number of builds at a time, so slots are scheduled in the order in which booking fees are received. Your kickoff date is confirmed in writing before you pay the booking fee. The ten (10) working days are then counted from the start of the clock described in clause 6, which follows your kickoff.",
      "We reserve the right to decline any application at our discretion, including after the alignment call, and to withdraw or modify the Offer for applications not yet confirmed. Withdrawal or modification will not affect slots already confirmed by payment.",
    ],
  },
  {
    title: "3. Definition of a “page”",
    body: [
      "For the purposes of this engagement, a “page” means a single URL comprising a hero section and approximately three to four further content sections, with one primary call to action. The About page on storyshaperscollective.com is the agreed reference for scale, as that page appears on the date your slot is confirmed. We will record that reference in the scope note, so that neither of us later relies on a page that has since changed.",
      "Content materially exceeding this scale — for example an About page of approximately 3,000 words across six or more sections — will be counted as more than one page. Any such assessment will be made and communicated in writing during or immediately after the alignment call, before development begins.",
      "If the content you supply after that assessment grows beyond the agreed scale, we will tell you in writing before we build it. You may then trim it, or commission the additional page as separate work at separate cost.",
    ],
  },
  {
    title: "4. Exclusions",
    body: [
      "The following are expressly outside the scope of the Offer:",
      [
        "e-commerce functionality of any kind, including carts, product catalogues, payment gateways and Shopify or equivalent platforms;",
        "a blog, content management system or any self-editing publishing interface;",
        "catalogues of products or listings;",
        "custom photography, videography, illustration or 3D work;",
        "brand identity creation, including logo design, palette and type system development;",
        "writing beyond the website copy defined in clause 2, including brand strategy and naming, market or competitor research, case studies and long-form content, and copy for channels other than the website;",
        "search engine optimisation beyond the meta and Open Graph tags described in clause 2;",
        "analytics, tag management and conversion tracking of any kind, including Google Analytics, Google Tag Manager, Meta Pixel and equivalents;",
        "integrations with third-party systems, such as CRMs, booking or scheduling tools and marketing automation;",
        "migration of an existing website, or of its content, from another platform;",
        "email hosting, mailbox setup and email deliverability configuration;",
        "privacy policies, terms of use, cookie notices and other legal or statutory text for your website;",
        "testing or certification against a formal accessibility standard;",
        "domain, hosting and third-party subscription costs, which are dealt with in clause 9;",
        "ongoing content production;",
        "paid media setup or management; and",
        "multilingual or localised versions of the website.",
      ],
      "This list is illustrative, not exhaustive. Anything not expressly included in clause 2 is outside the scope of the Offer.",
      "Any of the above may be quoted and undertaken as a separate engagement at separate cost, on separate terms.",
    ],
  },
  {
    title: "5. Fees, booking fee and payment",
    body: [
      "The total fee is ₹80,000 payable in Indian Rupees in two instalments: (a) a booking fee of ₹25,000 (Indian Rupees twenty-five thousand), and (b) the balance of ₹55,000 (Indian Rupees fifty-five thousand), payable before deployment, transfer or publication as set out below.",
      "A slot is confirmed only on receipt of the booking fee in cleared funds. A payment link will be issued after the alignment call. Slots are allocated in the order in which booking fees are received.",
      "The booking fee is credited in full against the total fee and is not an additional charge. It is payable in consideration of reserving production capacity for your engagement and the onboarding, planning and preparatory work that begins once your slot is confirmed. Except for the cancellation right expressly set out in clause 12, the booking fee is non-refundable if you cancel or do not proceed. This is because, once your slot is confirmed, we reserve writing, design and development capacity for you and may decline other work for that period.",
      "The balance of ₹55,000 falls due once the included scope and the included revision rounds have been completed, and is payable before deployment, transfer or publication of the website. We will notify you in writing when the completed website is ready for final review and deployment. “launch” means the date of that notification, whether or not you have then paid, approved or published the website. Where we cannot issue it because you have not provided the domain, hosting or access we asked for, launch is the date we notify you in writing that the website is finished and waiting on you.",
      "No final files, code repository, credentials, production deployment or transfer of intellectual property rights are provided until the balance reaches us in cleared funds, and no rights in the deliverables pass to you before then; see clause 10.",
      "Invoices are payable within seven (7) days of issue. Amounts unpaid after fourteen (14) days may attract simple interest at 1.5% per month, or the highest rate permitted by law if that is lower. While any amount is overdue we may suspend work, withhold deployment and withhold transfer of the deliverables, and no rights in them pass to you; see clause 10.",
      "Bank charges, gateway fees and, for international Clients, currency conversion costs are payable by you. Where you are required by law to deduct tax at source, you may deduct it from the amount payable and will issue the relevant certificate promptly; the amount deducted counts towards the fee and does not increase what you owe.",
    ],
  },
  {
    title: "6. Timeline and the working-days clock",
    body: [
      "Delivery is ten (10) working days from the start of the clock described below. Working days exclude weekends and public holidays observed by The Story Shapers in India. The ten working days are a commitment we make on the condition that you meet the response times in this clause. The clock does not run while we are waiting on you.",
      "The clock starts on the first working day after we receive all assets and information listed in the asset checklist issued at kickoff. It does not start on the date the booking fee is paid.",
      "We will confirm to you in writing that the checklist is complete and that the clock has started, and that written confirmation is the record of the start date and of the delivery date it produces. Where something on the checklist is outstanding, we will tell you what is missing, and the clock does not start until it reaches us.",
      "You agree to provide all assets within forty-eight (48) hours of kickoff and feedback at each review round within twenty-four (24) hours. Each working day of delay in providing assets, feedback or approvals extends the delivery date by an equivalent period, and where a delay costs us your production window, until the next window we are able to offer you. Delays exceeding ten (10) working days in aggregate entitle us to reschedule your slot to the next available window, and the ten-working-day delivery commitment then no longer applies to that engagement.",
      "The ten working days also exclude delay caused by third parties or by matters outside our reasonable control, including domain transfer and DNS propagation, hosting provisioning, platform, payment-gateway or app-store approvals, third-party service outages, and the turnaround times of any provider you have appointed. The delivery date extends by the length of the delay. This is separate from clause 14, which deals with events that prevent performance altogether.",
      // Lawyer's three-limb deemed-acceptance test, converted into the
      // document's register (you / deliverables / scope note) with Fatema's
      // approval, 13 Aug. Substance unchanged from her wording.
      "The deliverables will be deemed accepted on the earliest of: (a) your written approval; (b) your publication or use of any deliverable; (c) expiry of three working days after we notify you that the deliverables are ready for final review without you identifying a material non-conformity with the agreed scope note.",
      "A subjective preference, change of mind or request for work outside the agreed scope is not a material non-conformity.",
      "The engagement runs in stages, identified in the scope note and ordinarily copy, then design, then build. Each stage is approved before the next begins, and the test above applies to each stage as it does to the deliverables as a whole.",
      "An approved stage is closed. Work you have approved, or that has been treated as accepted, is not reopened by a later revision round. Returning to a closed stage is not a revision, does not draw on the rounds included in clause 7, and is additional work that will be quoted and agreed in writing before we undertake it. The delivery date extends accordingly.",
      "If a project is inactive on your side for thirty (30) consecutive days, we may treat the engagement as suspended, invoice for work completed to date, and require a fresh slot allocation to resume. Resumption is subject to our availability at the time and to our rates then in force; the Offer price does not survive suspension. If the engagement remains inactive for ninety (90) consecutive days we may treat it as closed by written notice, and clause 12 then applies as though you had cancelled.",
    ],
  },
  {
    title: "7. Revisions",
    body: [
      "The fee includes two (2) rounds of revisions on copy and one (1) round of revisions on design, counted across the website as a whole and not per page. A round means a single consolidated set of comments from your named decision-maker, sent at one time. Further comments that arrive after a round has been actioned count as the next round.",
      "A revision is a refinement within the agreed scope, direction and structure. A change of direction, structure, page count, positioning or brand approach after approval is not a revision and will be quoted separately. Additional rounds beyond those included are chargeable at our then-current rates, quoted to you and agreed in writing before the work is undertaken.",
      "Revision rounds belong to the build. Changes requested after launch are new work, other than the defect corrections described in clause 13.",
    ],
  },
  {
    title: "8. Your responsibilities",
    body: [
      "You agree to: nominate a single decision-maker with authority to give feedback and final approval, and to route all instructions through that person; provide accurate, complete and lawful content, images, product information and brand material; and respond within the timelines set out in clause 6. You represent and warrant that you own, or have obtained all necessary rights, licences, releases, consents and permissions to allow us to use, reproduce, edit, adapt and publish every asset or piece of material you supply or instruct us to use. We are entitled to rely on that warranty and are not required to independently verify ownership or licensing.",
      // ⚠️ TODO — the lawyer's note ended mid-sentence at "Any delay caused while
      // you replace or obtain permission for such". The closing words below are
      // MINE, written to the obviously intended effect. Confirm with the lawyer
      // before launch.
      "We may refuse to use, or remove, any material that we reasonably believe may be unlawful, infringing, misleading or inadequately licensed. Any delay caused while you replace or obtain permission for such material is a delay on your side for the purposes of clause 6.",
      "You grant us a non-exclusive, royalty-free licence to store, use, reproduce and adapt the material you supply, for the purpose of delivering this engagement and, subject to clause 11, of showing the finished work. Keep your own copies of everything you send us. We are not your archive.",
      "You are responsible for the accuracy of factual claims, pricing, statutory disclosures, product descriptions and any regulated content on the website, and for any privacy policy, terms of use, cookie notice or other statement your website is required by law to carry. We may raise questions but do not verify your claims.",
      "Where the material you supply is insufficient to complete the agreed scope, we will tell you in writing and propose options. We are not obliged to source, licence, create or purchase substitute assets within the fee.",
      "You will indemnify us against any third-party claim, and any loss, cost or expense we reasonably incur as a result, arising from the material you supply to us or from your use of the website — including claims of intellectual property infringement, misleading advertising, or breach of statutory disclosure requirements. This does not apply to the extent the claim arises from our own breach of these Terms.",
      "If a third-party claim covered by this indemnity is made or threatened, we will notify you within a reasonable time after becoming aware of it and provide reasonable cooperation in responding to it. You will reimburse our reasonable costs, including legal costs, arising from the claim to the extent covered by the indemnity. Neither party may settle a claim in a manner that imposes liability, an admission or a continuing obligation on the other without that party's written consent.",
    ],
  },
  {
    title: "9. Domain, hosting and third-party services",
    body: [
      "Domain registration and hosting are purchased and held in your name and remain your property and your ongoing cost. We will specify what to purchase and may deploy on your behalf where you grant access. We are not responsible for the availability, performance, pricing, terms or security of third-party providers, including domain registrars, hosting platforms, analytics providers, form services, font licensors and stock asset libraries.",
      "Third-party licence fees, including fonts, plugins, stock imagery and subscription services, are excluded from the fee unless expressly stated in the scope note. Where we take out such a licence on your instruction, we take it in your name wherever the licensor permits that.",
      "Where you give us credentials or account access, we use them only for this engagement and only for as long as we need them. Change them after launch; from that point their security is yours.",
    ],
  },
  {
    title: "10. Intellectual property",
    body: [
      "Until the balance is paid in full, all copy, design files, code and other deliverables remain our property, and any access granted to you is a limited licence for review purposes only. If the full fee is never paid, no rights pass to you and you may not use, publish, adapt or authorise anyone else to use the deliverables.",
      "Before payment in full, drafts and review versions may be supplied through password-protected, watermarked, restricted or non-production environments. We may restrict or withdraw access to those versions following cancellation or non-payment. You may not copy, reproduce, publish, deploy, adapt, instruct another provider to recreate, or otherwise use any unpaid deliverable or substantial part of it. Review access does not constitute delivery or transfer of ownership.",
      "On receipt of the full fee in cleared funds, we assign to you all right, title and interest in the final delivered copy, design and build — worldwide, for the full term of copyright and any renewals or extensions of it. We claim no rights in the material you supplied to us, which remains yours throughout, subject only to the licences you grant us in clauses 8 and 11.",
      "On full payment you receive the completed website, deployed to the domain and hosting held in your name under clause 9, together with the copy and design as delivered. The source code repository forms part of what you have paid for: we will transfer it to you on written request, at no additional cost, within a reasonable time of that request. We are not obliged to retain a copy of it more than twelve (12) months after launch. Changes, additions and upgrades to the website after launch are new work under clause 7.",
      "That assignment cannot and does not cover third-party or open-source material used in or by the website, such as fonts, stock imagery, plugins, code libraries and hosted services. Those are not ours to assign and reach you on their own licensors' terms.",
      "We retain ownership of our pre-existing intellectual property, including our methods, frameworks, internal templates, component libraries, tooling and know-how, and of concepts, drafts and routes not selected by you. Nothing in these Terms prevents us from reusing that pre-existing intellectual property on other engagements. Where any of it is embedded in what we deliver, you have a perpetual, worldwide, royalty-free licence to use it as part of your website.",
      "So far as we are aware, the copy, design and code we create for you are our original work and do not infringe anyone else's rights. That statement does not extend to material you supply or to the third-party material described above, and it is subject to the limits in clause 14.",
    ],
  },
  {
    title: "11. Portfolio and credit",
    body: [
      "You grant us the right to display the completed website, screenshots of it, and a description of our contribution in our portfolio, on our website, in decks, in case studies and on social media, and to identify you as a client, from the date of launch as defined in clause 5 or the date you first publish the website, whichever is earlier. We will not disclose your confidential commercial information in doing so.",
      "If you require confidentiality for a defined period, tell us in writing before kickoff and we will agree a hold period. We may include a discreet credit and link in the website footer; we will remove it on written request.",
    ],
  },
  {
    title: "12. Cancellation",
    body: [
      "You may cancel at any time by written notice. If you cancel within twenty-four (24) hours of paying the booking fee, and before kickoff, we will refund it in full. After that period, the booking fee is non-refundable if you cancel or do not proceed, for the reasons set out in clause 5.",
      "If you cancel after work has commenced, the booking fee remains non-refundable and will be applied towards the value of work undertaken. For this purpose, work is valued by reference to the stage the engagement has reached, including discovery and planning, copy development, design development and website development, and not merely by the number of pages completed. We will provide you with a written statement of the work completed. If the value of work completed exceeds the booking fee, we may invoice you for the difference, up to the total fee. No further work will be undertaken after cancellation.",
      "Cancellation transfers no rights in work in progress. Clause 10 continues to apply: nothing passes to you unless the full fee is paid.",
      "We may cancel if you materially breach these Terms, including sustained non-response or non-payment, or if the engagement requires content that is unlawful, misleading, infringing or inconsistent with our professional standards; in that case the booking fee is not refunded. Where we cancel for any other reason, including where we are unable to deliver, we will refund the booking fee in full, together with any amounts paid in excess of work completed to the date of cancellation.",
    ],
  },
  {
    title: "13. Post-launch support",
    body: [
      "We will correct defects in our build — errors, broken links and functional faults in what we delivered — reported in writing within fourteen (14) days of launch, at no charge. That period runs from launch as defined in clause 5, whether or not you have published the website by then.",
      "This does not include new content, new sections, new features, design changes, behaviour on browsers or devices outside those listed in clause 2, changes caused by you or by third parties editing the site or its hosting, or failures of third-party services. Ongoing maintenance and content updates are available as a separate retained engagement.",
    ],
  },
  {
    title: "14. Warranties, liability and events outside our control",
    body: [
      "We will perform the engagement with reasonable skill and care. We do not warrant any commercial outcome, including traffic, search ranking, conversion, enquiries or revenue, and no such outcome is a condition of payment. We do not warrant that the website will be free of every defect or uninterrupted in operation; clause 13 sets out your remedy for defects in our build.",
      "To the maximum extent permitted by law, our total aggregate liability arising out of or in connection with this engagement, whether in contract, tort, including negligence, or otherwise, is limited to the total fee actually paid by you. We are not liable for indirect, incidental, special or consequential loss, or for loss of profit, revenue, business, goodwill, data or anticipated savings.",
      "Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law, including liability for fraud, fraudulent misrepresentation or wilful misconduct.",
      "Neither party is liable for delay or failure to perform caused by events beyond its reasonable control, including acts of God, illness, civil disruption, statutory restriction, and failures of internet, power or third-party platforms. The affected party will tell the other promptly, and obligations are suspended for the duration of the event. If it continues for more than thirty (30) days, either party may cancel on written notice and we will invoice for work completed to that date.",
    ],
  },
  {
    title: "15. Confidentiality and your data",
    body: [
      "Each party will keep the other's non-public business information confidential and use it only for the purposes of this engagement, except where disclosure is required by law. This obligation continues for two (2) years after the engagement ends.",
      "Information submitted through the application form on the offer page is collected to assess applications, contact you and administer the Offer. It is stored securely, and shared only with members of The Story Shapers and the service providers we use to run the form and our email. It is not sold, published, used to train any model, or used for unrelated marketing. We keep application data for twelve (12) months from submission unless you become a Client, in which case we keep it for the duration of the engagement and for as long as tax and accounting law requires.",
      "You may withdraw your consent at any time, though if you withdraw it before your slot is confirmed we will not be able to process your application. Write to hello@storyshaperscollective.com to withdraw consent, to request access to, correction of, or deletion of your application data, or to raise a concern about how it has been handled. That address is our point of contact for any grievance about personal data, and we will respond within thirty (30) days.",
    ],
  },
  {
    title: "16. Independent contractor status",
    body: [
      "We act as an independent service provider. Nothing in these Terms creates an employment, partnership, agency or joint venture relationship. We determine our own working methods, personnel and hours, and may use vetted collaborators, remaining responsible for their work.",
      "We may use professional software, automation and AI-assisted tools as part of our internal working process, while remaining responsible for the work we deliver to you. We will not knowingly submit your confidential information to a third-party AI service for model training. Where you specifically instruct us to use material through a particular third-party or AI service, you are responsible for ensuring that you have the right to provide that material for that purpose.",
      "During the engagement, and for twelve (12) months after it ends, you will not directly engage or employ anyone we introduced to you in the course of this work without our written consent. Responding to a public job advertisement is not covered by this.",
    ],
  },
  {
    title: "17. Notices",
    body: [
      "Notices under these Terms — including cancellation under clause 12, confidentiality requests and requests to remove our footer credit under clause 11, and data requests under clause 15 — must be in writing and sent by email: to us at hello@storyshaperscollective.com, and to you at the email address given in your application or any address you later notify to us in writing.",
      "A notice is treated as received on the next working day after it is sent, unless the sender receives a delivery failure message.",
      "Formal legal notice may also be served on us by post at our registered office: The Story Shapers Collective LLP (LLPIN ACW-3552), 15, Raam Durg, 3rd Main, Jayamahal Extension, Benson Town, Bangalore – 560046, Karnataka, India. A notice sent by post is treated as received on the third working day after it is posted.",
      "Where these Terms require something to be recorded, agreed or confirmed in writing, email is sufficient. A message on WhatsApp, Instagram or any other channel is not.",
    ],
  },
  {
    title: "18. Severability, waiver, assignment and survival",
    body: [
      "If any provision of these Terms is held to be invalid or unenforceable, it will be modified to the minimum extent necessary to make it enforceable or, where that is not possible, severed. The remaining provisions continue in full force.",
      "A failure or delay in enforcing any provision is not a waiver of it, and waiving it on one occasion does not waive it on any other.",
      "Neither party may assign or transfer this agreement without the other's written consent, which will not be unreasonably withheld. Our use of vetted collaborators under clause 16 is not an assignment.",
      "Nothing in these Terms gives any right to anyone who is not a party to them.",
      "Clauses 5, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18 and 19 survive the end of the engagement, however it ends.",
    ],
  },
  {
    title: "19. Governing law and jurisdiction",
    body: [
      `These Terms are governed by the laws of India. The courts at ${GOVERNING_CITY} have exclusive jurisdiction over any dispute arising out of or in connection with them.`,
      "The parties will attempt in good faith to resolve any dispute by discussion, over a period of no less than thirty (30) days from written notice of the dispute, before commencing proceedings. Nothing in this clause prevents either party from applying to a court for urgent interim relief at any time.",
    ],
  },
  {
    title: "20. Entire agreement and amendments",
    body: [
      "These Terms, together with the scope note issued after the alignment call, constitute the entire agreement between the parties in respect of the engagement and supersede prior discussions, proposals and representations. Nothing in this clause limits liability for fraudulent misrepresentation.",
      "Amendments are valid only if recorded in writing and confirmed by both parties, including by email.",
      "We may update these Terms for future applicants. The version in force at the date your slot is confirmed governs your engagement, and we will keep a copy of that version.",
    ],
  },
];

export default function OfferTermsPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Website offer terms | The Story Shapers";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="offer-page min-h-screen px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto w-full max-w-[820px]">
        <Link
          href="/offer"
          className="inline-flex items-center gap-2 text-[13px] text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back to the offer
        </Link>

        <p className="o-eyebrow mt-14 text-white/35">TERMS &amp; CONDITIONS</p>
        <h1 className="o-display mt-6 text-[32px] leading-[1.14] sm:text-[42px]">
          The website offer,{" "}
          <span className="font-body font-light text-white/70">in full.</span>
        </h1>
        <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[1.6px] text-white/35">
          Last updated 28 September 2026 · The Story Shapers Collective LLP
        </p>

        <div className="mt-16 space-y-12">
          {CLAUSES.map((clause) => (
            <section key={clause.title}>
              <h2 className="o-display text-[19px] leading-snug sm:text-[21px]">
                {clause.title}
              </h2>
              <div className="mt-4 space-y-4">
                {clause.body.map((block) =>
                  Array.isArray(block) ? (
                    /* Long exclusion lists read as a wall in prose form. */
                    <ul
                      key={block[0].slice(0, 40)}
                      className="ml-5 list-disc space-y-2 text-[14.5px] leading-[1.85] text-white/70 marker:text-white/30"
                    >
                      {block.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      key={block.slice(0, 40)}
                      className="text-[14.5px] leading-[1.85] text-white/70"
                    >
                      {block}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 border-t border-white/8 pt-8">
          {/* LLP Act 2008 s.21 disclosure: name, LLPIN, registered office and
              the limited-liability statement. All four required. */}
          <p className="text-[13px] leading-[1.8] text-white/40">
            The Story Shapers Collective LLP (LLPIN ACW-3552) is registered in
            India with limited liability. Registered office: 15, Raam Durg, 3rd
            Main, Jayamahal Extension, Benson Town, Bangalore – 560046,
            Karnataka, India.
          </p>
          <p className="mt-4 text-[13px] leading-[1.8] text-white/40">
            Questions on any of the above? Ask before you pay, not after —{" "}
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 underline decoration-magenta-lift decoration-2 underline-offset-4"
            >
              storyshaperscollective.com
            </a>{" "}
            or{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 underline decoration-magenta-lift decoration-2 underline-offset-4"
            >
              @thestoryshapers
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
