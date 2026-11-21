"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  FileText,
  Inbox,
  LockKeyhole,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Star,
  X,
} from "lucide-react";
import { Brand, CompanyMark } from "./brand";

type Organization = "GoGentik" | "Google" | "Microsoft" | "Amazon";
type Folder =
  | "Inbox"
  | "Starred"
  | "Sent"
  | "Drafts"
  | "Other Organizations"
  | "Unknown Senders"
  | "Suspicious Emails";
type Thread = {
  company: Organization;
  title: string;
  subtitle: string;
  people: string[];
  sender: string;
  email: string;
  time: string;
  messages: string[];
  response: string;
  attachment: string;
  preview: string;
};

const threads: Record<Organization, Thread> = {
  GoGentik: {
    company: "GoGentik",
    title: "Website launch planning",
    subtitle: "Let’s make something great together.",
    people: ["Shahadat", "Sarah", "Ahmed"],
    sender: "Shahadat",
    email: "shahadat@gogentik.com",
    time: "10:42 AM",
    messages: [
      "Hey team! The updated brand assets are ready. Sharing the final direction for the website launch.",
      "The new direction looks great! The cleaner layout really brings the product to life.",
    ],
    response:
      "Love this direction. Let’s align on the timeline and get this ready for launch.",
    attachment: "Brand guidelines.pdf",
    preview: "The updated brand assets are ready.",
  },
  Google: {
    company: "Google",
    title: "Workspace integration",
    subtitle: "A more connected way to work.",
    people: ["John", "Michael"],
    sender: "John",
    email: "john@google.com",
    time: "10:18 AM",
    messages: [
      "Hi team, sharing the proposed Workspace integration milestones for your review.",
      "We’ve outlined the authorization requirements. Happy to walk through the scope together.",
    ],
    response:
      "Thanks, John. We’ll review the access requirements with our IT team before moving forward.",
    attachment: "Integration overview.pdf",
    preview: "Sharing the proposed integration milestones.",
  },
  Microsoft: {
    company: "Microsoft",
    title: "Microsoft 365 rollout",
    subtitle: "Getting the details right, together.",
    people: ["David", "Emily"],
    sender: "David",
    email: "david@microsoft.com",
    time: "9:54 AM",
    messages: [
      "Good morning! Here’s the draft plan for the Microsoft 365 pilot environment.",
      "The identity and access checklist is included. Let’s confirm the pilot group this week.",
    ],
    response:
      "Received, thank you. I’m adding our security team to the review before we confirm the pilot.",
    attachment: "Pilot deployment plan.pdf",
    preview: "Here’s the draft plan for the pilot.",
  },
  Amazon: {
    company: "Amazon",
    title: "Infrastructure review",
    subtitle: "Built around your environment.",
    people: ["James"],
    sender: "James",
    email: "james@amazon.com",
    time: "9:30 AM",
    messages: [
      "Hi Alex, I’ve attached the infrastructure discussion notes from our call.",
      "We can review the proposed storage boundaries and access policies in our next session.",
    ],
    response:
      "Perfect. Let’s include our infrastructure lead and confirm the requirements together.",
    attachment: "Infrastructure notes.pdf",
    preview: "The notes from our infrastructure review.",
  },
};

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const photo =
    name === "Sarah" || name === "Emily"
      ? "sarah"
      : name === "Alex" || name === "Michael"
        ? "alex"
        : "shahadat";
  return (
    <span className={`avatar ${small ? "avatar-small" : ""}`}>
      <Image src={`/avatar-${photo}.jpg`} alt={name} width={36} height={36} />
    </span>
  );
}

export function InboxDemo() {
  const [organization, setOrganization] = useState<Organization>("GoGentik");
  const [expanded, setExpanded] = useState<string[]>(["GoGentik"]);
  const [folder, setFolder] = useState<Folder>("Inbox");
  const [query, setQuery] = useState("");
  const [mobileThread, setMobileThread] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [starred, setStarred] = useState<string[]>(["GoGentik"]);
  const [notice, setNotice] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const thread = threads[organization];
  const suspicious = folder === "Suspicious Emails";
  const emptyFolder =
    folder === "Other Organizations" || folder === "Unknown Senders";
  const draft = drafts[organization] ?? "";
  const visibleThreads = Object.values(threads).filter((item) => {
    if (folder === "Starred" && !starred.includes(item.company)) return false;
    if (folder === "Sent" && !sent[item.company]?.length) return false;
    if (folder === "Drafts" && !drafts[item.company]?.trim()) return false;
    return `${item.title} ${item.company} ${item.sender}`
      .toLowerCase()
      .includes(query.toLowerCase());
  });
  const selectedVisible =
    !emptyFolder &&
    visibleThreads.some((item) => item.company === organization);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !document.querySelector("dialog[open]")
      ) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  function chooseOrganization(company: Organization) {
    setOrganization(company);
    setFolder("Inbox");
    setQuery("");
    setMobileThread(true);
    setNotice("");
    if (!expanded.includes(company)) setExpanded([...expanded, company]);
  }

  function chooseFolder(value: Folder) {
    setFolder(value);
    setMobileThread(false);
    setNotice("");
  }

  function sendMessage() {
    if (!draft.trim()) return;
    setSent({
      ...sent,
      [organization]: [...(sent[organization] ?? []), draft.trim()],
    });
    setDrafts({ ...drafts, [organization]: "" });
    setNotice("Reply added to this demo only. No email was sent.");
  }

  return (
    <div className="product-wrap" id="experience">
      <div className="product-window">
        <div className="app-topbar">
          <div className="app-brand">
            <Brand compact />
            <span className="workspace-label">
              Workspace <ChevronDown size={11} />
            </span>
          </div>
          <label className="app-search">
            <Search size={14} />
            <input
              ref={searchInput}
              aria-label="Search demo conversations"
              placeholder="Search conversations, people, or companies..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setMobileThread(false);
              }}
            />
            <span>⌘ K</span>
          </label>
          <div className="app-top-actions">
            <span className="demo-chip">Interactive preview</span>
            <button
              aria-label="View demo notifications"
              title="Notifications"
              onClick={() =>
                setNotice(
                  "You’re all caught up. There are no new notifications in this preview.",
                )
              }
            >
              <Bell size={16} />
            </button>
            <Avatar name="Alex" small />
          </div>
        </div>
        <div className={`app-body ${mobileThread ? "mobile-thread-open" : ""}`}>
          <aside className="app-sidebar" aria-label="Demo mail navigation">
            <button
              className="compose-button"
              onClick={() => {
                chooseOrganization(organization);
                setNotice("Write a reply below. Messages stay in this demo.");
                composer.current?.focus();
              }}
            >
              <MessageSquare size={14} /> Compose <span>+</span>
            </button>
            <div className="folder-list">
              {(
                [
                  { name: "Inbox", icon: Inbox, count: "12" },
                  { name: "Starred", icon: Star, count: starred.length || "" },
                  { name: "Sent", icon: Send, count: "" },
                  {
                    name: "Drafts",
                    icon: FileText,
                    count: Object.values(drafts).filter(Boolean).length || "",
                  },
                ] as const
              ).map(({ name, icon: Icon, count }) => (
                <button
                  key={name}
                  className={`sidebar-item ${folder === name ? "selected" : ""}`}
                  onClick={() => chooseFolder(name)}
                >
                  <Icon size={15} />
                  <span>{name}</span>
                  <small>{count}</small>
                </button>
              ))}
            </div>
            <div className="sidebar-label">
              ORGANIZATIONS <Building2 size={11} />
            </div>
            <div className="organization-list">
              {Object.values(threads).map((item) => (
                <div className="organization-group" key={item.company}>
                  <div
                    className={`organization-heading ${item.company === organization && folder === "Inbox" ? "active-org" : ""}`}
                  >
                    <button
                      className="org-select"
                      onClick={() => chooseOrganization(item.company)}
                    >
                      <CompanyMark company={item.company} />
                      <span>{item.company}</span>
                      {item.company === "GoGentik" && (
                        <span className="org-count">4</span>
                      )}
                    </button>
                    <button
                      className="org-toggle"
                      aria-label={`${expanded.includes(item.company) ? "Collapse" : "Expand"} ${item.company}`}
                      aria-expanded={expanded.includes(item.company)}
                      onClick={() =>
                        setExpanded(
                          expanded.includes(item.company)
                            ? expanded.filter((name) => name !== item.company)
                            : [...expanded, item.company],
                        )
                      }
                    >
                      <ChevronDown
                        size={12}
                        className={
                          expanded.includes(item.company) ? "" : "collapsed"
                        }
                      />
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded.includes(item.company) && (
                      <motion.div
                        className="org-members"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.2 }}
                      >
                        {item.people.map((person, index) => (
                          <button
                            key={person}
                            onClick={() => chooseOrganization(item.company)}
                          >
                            <span
                              className={`presence-dot ${index === 2 ? "away" : ""}`}
                            />
                            {person}
                            {index === 0 && <span>2</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="secondary-folders">
              <button
                className={`sidebar-item ${folder === "Other Organizations" ? "selected" : ""}`}
                onClick={() => chooseFolder("Other Organizations")}
              >
                <Building2 size={14} />
                <span>Other Organizations</span>
              </button>
              <button
                className={`sidebar-item ${folder === "Unknown Senders" ? "selected" : ""}`}
                onClick={() => chooseFolder("Unknown Senders")}
              >
                <CircleHelp size={14} />
                <span>Unknown Senders</span>
                <small>0</small>
              </button>
              <motion.button
                className={`sidebar-item suspicious-nav ${suspicious ? "selected" : ""}`}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reducedMotion ? 0 : 0.8 }}
                onClick={() => {
                  chooseFolder("Suspicious Emails");
                  setMobileThread(true);
                }}
              >
                <ShieldAlert size={14} />
                <span>Suspicious Emails</span>
                <small>1</small>
              </motion.button>
            </div>
            <div className="sidebar-bottom">
              <span className="secure-dot" />
              <span>Your email. Better connected.</span>
              <LockKeyhole size={12} />
            </div>
          </aside>
          <div className="thread-list">
            <div className="thread-list-heading">
              <div>
                <h3>{folder === "Inbox" ? "Your conversations" : folder}</h3>
                <span>
                  {suspicious
                    ? "Separated for your review"
                    : "A little less noise. A lot more clarity."}
                </span>
              </div>
              <button
                title="Show newest conversations"
                aria-label="Show newest conversations"
                onClick={() =>
                  setNotice("Conversations are sorted newest first.")
                }
              >
                <Settings2 size={15} />
              </button>
            </div>
            <div className="inbox-filter">
              <span>
                {suspicious ? "Needs review" : "All conversations"}
                <ChevronDown size={11} />
              </span>
              <small>
                {emptyFolder ? 0 : suspicious ? 1 : visibleThreads.length}
              </small>
            </div>
            {suspicious ? (
              <button
                className="thread-item warning-thread"
                onClick={() => setMobileThread(true)}
              >
                <span className="warning-avatar">
                  <ShieldAlert size={17} />
                </span>
                <span className="thread-summary">
                  <strong>
                    Account security notice <time>10:45</time>
                  </strong>
                  <span>security@gogantik.com</span>
                  <p>Potential domain impersonation</p>
                </span>
              </button>
            ) : emptyFolder || !visibleThreads.length ? (
              <div className="empty-inbox">
                <Inbox size={25} />
                <p>
                  {query
                    ? "No matching conversations"
                    : `No ${folder.toLowerCase()} yet`}
                </p>
                <small>
                  {folder === "Drafts"
                    ? "Start a reply to save a local draft."
                    : "Your demo conversations will appear here."}
                </small>
              </div>
            ) : (
              visibleThreads.map((item, index) => (
                <button
                  key={item.company}
                  className={`thread-item ${organization === item.company ? "active-thread" : ""}`}
                  onClick={() => {
                    setOrganization(item.company);
                    setMobileThread(true);
                    setNotice("");
                  }}
                >
                  <Avatar name={item.sender} />
                  <span className="thread-summary">
                    <strong>
                      {item.sender}
                      <time>{item.time.replace(" AM", "")}</time>
                    </strong>
                    <span>{item.title}</span>
                    <p>{item.preview}</p>
                    <span className="thread-company">
                      <CompanyMark company={item.company} />
                      {item.company}
                      {index === 0 && <span className="unread-dot" />}
                    </span>
                  </span>
                </button>
              ))
            )}
            <div className="list-bottom">
              <ShieldCheck size={14} />
              <span>A clearer inbox starts here.</span>
            </div>
          </div>
          <section
            className="conversation-panel"
            aria-label="Selected conversation"
          >
            {suspicious ? (
              <div className="suspicious-conversation">
                <button
                  className="mobile-back"
                  onClick={() => setMobileThread(false)}
                >
                  <ArrowLeft size={16} /> Back to inbox
                </button>
                <div className="security-message-header">
                  <span className="warning-avatar">
                    <ShieldAlert size={22} />
                  </span>
                  <div>
                    <h3>Account security notice</h3>
                    <p>security@gogantik.com</p>
                  </div>
                </div>
                <div className="security-warning" role="alert">
                  <ShieldAlert size={25} />
                  <h3>Potential Domain Impersonation</h3>
                  <p>
                    This sender uses a domain that closely resembles
                    gogentik.com. Verify the sender before opening links or
                    attachments.
                  </p>
                  <div className="domain-diff">
                    <span>
                      Expected <strong>gogentik.com</strong>
                    </span>
                    <span>
                      Received{" "}
                      <strong>
                        gog<span>a</span>ntik.com
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="suspicious-content">
                  <p>Hi Alex,</p>
                  <p>
                    Please review your account security settings. A new sign-in
                    needs your attention.
                  </p>
                  <span className="blocked-link">
                    <LockKeyhole size={13} /> Links and attachments are not
                    active in this demo
                  </span>
                </div>
                <p className="security-caveat">
                  A similar domain is a reason to check, not proof of malicious
                  intent. This example is illustrative.
                </p>
                <button
                  className="button button-secondary"
                  onClick={() => chooseOrganization("GoGentik")}
                >
                  Return to verified conversation <ArrowUpRight size={14} />
                </button>
              </div>
            ) : !selectedVisible ? (
              <div className="conversation-empty">
                <Mail size={32} />
                <h3>A little room to focus.</h3>
                <p>Select a conversation from your inbox.</p>
              </div>
            ) : (
              <>
                <header className="conversation-header">
                  <button
                    className="mobile-back"
                    aria-label="Back to inbox"
                    onClick={() => setMobileThread(false)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h3>{thread.title}</h3>
                    <div className="conversation-participants">
                      {thread.people.join(", ")} <span>+ You</span>
                      <span className="verified-inline">
                        <ShieldCheck size={11} /> Verified organization
                      </span>
                    </div>
                  </div>
                  <button
                    className={
                      starred.includes(organization) ? "star-active" : ""
                    }
                    title={
                      starred.includes(organization)
                        ? "Unstar conversation"
                        : "Star conversation"
                    }
                    aria-label={
                      starred.includes(organization)
                        ? "Unstar conversation"
                        : "Star conversation"
                    }
                    onClick={() =>
                      setStarred(
                        starred.includes(organization)
                          ? starred.filter(
                              (company) => company !== organization,
                            )
                          : [...starred, organization],
                      )
                    }
                  >
                    <Star
                      size={16}
                      fill={
                        starred.includes(organization) ? "currentColor" : "none"
                      }
                    />
                  </button>
                  <button
                    title="Conversation details"
                    aria-label="Conversation details"
                    onClick={() =>
                      setNotice(
                        `${thread.email} · ${thread.people.join(", ")} · Illustrative conversation; verification is simulated.`,
                      )
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </header>
                <AnimatePresence mode="wait">
                  <motion.div
                    className="messages"
                    key={organization}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  >
                    <div className="day-separator">
                      <span />
                      Today, November 16
                      <span />
                    </div>
                    <div className="message incoming">
                      <Avatar name={thread.sender} />
                      <div className="message-content">
                        <div className="message-meta">
                          <strong>{thread.sender}</strong>
                          <ShieldCheck size={11} />
                          <time>10:42 AM</time>
                        </div>
                        <div className="bubble">
                          <p>{thread.messages[0]}</p>
                          <button
                            className="attachment"
                            onClick={() => setAttachmentOpen(true)}
                          >
                            <span className="pdf-icon">
                              <FileText size={17} />
                            </span>
                            <span>
                              <strong>{thread.attachment}</strong>
                              <small>PDF document · 2.4 MB</small>
                            </span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="message incoming second-message">
                      <Avatar name={thread.people[1] ?? "James"} />
                      <div className="message-content">
                        <div className="message-meta">
                          <strong>{thread.people[1] ?? "James"}</strong>
                          <time>10:44 AM</time>
                        </div>
                        <div className="bubble">
                          <p>{thread.messages[1]}</p>
                        </div>
                      </div>
                    </div>
                    <div className="message outgoing">
                      <div className="message-content">
                        <div className="message-meta">
                          <strong>You</strong>
                          <time>10:46 AM</time>
                        </div>
                        <div className="bubble">
                          <p>{thread.response}</p>
                        </div>
                        <div className="read-receipt">
                          <CheckCheck size={12} />
                          <span>
                            Seen by {thread.people.slice(-2).join(" and ")}
                          </span>
                        </div>
                      </div>
                      <Avatar name="Alex" />
                    </div>
                    {(sent[organization] ?? []).map((text, index) => (
                      <motion.div
                        className="message outgoing sent-message"
                        key={`${organization}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="message-content">
                          <div className="bubble">
                            <p>{text}</p>
                          </div>
                          <div className="read-receipt">
                            <Check size={12} /> Added to preview
                          </div>
                        </div>
                        <Avatar name="Alex" />
                      </motion.div>
                    ))}
                    <div className="typing-indicator">
                      <Avatar name={thread.people[1] ?? "James"} small />
                      <span>
                        <i />
                        <i />
                        <i />
                      </span>
                      <small>{thread.people[1] ?? "James"} is typing</small>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <form
                  className="reply-composer"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >
                  <textarea
                    ref={composer}
                    aria-label="Write a demo reply"
                    placeholder={`Reply to ${thread.people.join(", ")}...`}
                    value={draft}
                    onChange={(event) =>
                      setDrafts({
                        ...drafts,
                        [organization]: event.target.value,
                      })
                    }
                    maxLength={2000}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <div className="composer-toolbar">
                    <span>
                      <button
                        type="button"
                        title="Attach demo document"
                        aria-label="Attach demo document"
                        onClick={() => setAttachmentOpen(true)}
                      >
                        <Paperclip size={15} />
                      </button>
                      <button
                        type="button"
                        title="Add a smile"
                        aria-label="Add a smile"
                        onClick={() =>
                          setDrafts({
                            ...drafts,
                            [organization]: `${draft} :)`,
                          })
                        }
                      >
                        <Smile size={15} />
                      </button>
                      <span className="composer-divider" />
                      <span className="format-label">Aa</span>
                    </span>
                    <button
                      className="send-button"
                      type="submit"
                      disabled={!draft.trim()}
                    >
                      Send <Send size={12} />
                    </button>
                  </div>
                </form>
              </>
            )}
            {notice && (
              <div className="demo-notice" role="status">
                {notice}
                <button
                  aria-label="Dismiss notification"
                  onClick={() => setNotice("")}
                >
                  <X size={13} />
                </button>
              </div>
            )}
            {attachmentOpen && (
              <div
                className="attachment-preview"
                role="region"
                aria-label="Attachment preview"
              >
                <button
                  className="attachment-close"
                  aria-label="Close attachment preview"
                  onClick={() => setAttachmentOpen(false)}
                >
                  <X size={17} />
                </button>
                <FileText size={34} />
                <span className="eyebrow">DOCUMENT PREVIEW</span>
                <h3>{thread.attachment}</h3>
                <p>Clear communication. Shared context.</p>
                <div className="document-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <small>
                  Illustrative attachment. No file is downloaded or uploaded.
                </small>
              </div>
            )}
          </section>
        </div>
        <div className="app-statusbar">
          <span>
            <span className="secure-dot" /> All conversations up to date
          </span>
          <span>
            <LockKeyhole size={10} /> Product concept preview{" "}
            <span className="status-divider">|</span> Built by GoGentik
          </span>
        </div>
      </div>
      <div className="demo-caption">
        <span>
          <span className="live-dot" /> A familiar inbox. An entirely new
          experience.
        </span>
        <a href="#security">
          A little more peace of mind <ShieldCheck size={14} />
        </a>
      </div>
    </div>
  );
}
