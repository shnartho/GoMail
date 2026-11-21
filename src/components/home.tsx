"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  Cloud,
  Eye,
  Fingerprint,
  Layers3,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Network,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Brand, CompanyMark } from "./brand";
import { InboxDemo } from "./inbox-demo";
import { DialogKind, RequestDialog } from "./request-dialog";

const navigation = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For Business", href: "#enterprise" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -35px 0px" }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
}) {
  return (
    <Reveal className={`section-heading ${centered ? "centered" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

function MiniOrganization() {
  const [active, setActive] = useState("Google");
  return (
    <div className="mini-organizations">
      <div className="mini-org-menu">
        <span className="mini-label">YOUR ORGANIZATIONS</span>
        {["GoGentik", "Google", "Microsoft", "Amazon"].map((company, index) => (
          <button
            key={company}
            className={active === company ? "active" : ""}
            onClick={() => setActive(company)}
          >
            <CompanyMark company={company} />
            <span>{company}</span>
            <small>{[4, 3, 2, 1][index]}</small>
          </button>
        ))}
      </div>
      <div className="mini-org-content">
        <div className="mini-org-title">
          <CompanyMark company={active} />
          <span>
            {active}
            <small>Everything in its right place.</small>
          </span>
          <ShieldCheck size={14} />
        </div>
        {["Project updates", "A quick follow-up", "Next steps, together"].map(
          (title, index) => (
            <div className="mini-email" key={title}>
              <span className={`mini-person person-${index}`}>
                <Users size={12} />
              </span>
              <span>
                {title}
                <i style={{ width: `${80 - index * 12}%` }} />
              </span>
              <small>{["10:42", "9:30", "Yesterday"][index]}</small>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function FeatureConversation() {
  return (
    <div className="mini-conversation">
      <span className="mini-conversation-date">Today, 10:42 AM</span>
      <div className="mini-chat-row">
        <Image
          src="/avatar-sarah.jpg"
          alt="Illustrative team member"
          width={27}
          height={27}
        />
        <p>The proposal is ready for your review.</p>
      </div>
      <div className="mini-chat-row right">
        <p>
          Looks great. Let’s move it forward.
          <CheckCheck size={12} />
        </p>
        <Image
          src="/avatar-alex.jpg"
          alt="Illustrative team member"
          width={27}
          height={27}
        />
      </div>
      <div className="mini-chat-reply">
        <span>Keep the conversation going...</span>
        <ArrowUpRight size={14} />
      </div>
    </div>
  );
}

function FeatureSecurity() {
  return (
    <div className="mini-security">
      <div>
        <span className="security-icon green">
          <ShieldCheck size={18} />
        </span>
        <span>
          <strong>shahadat@gogentik.com</strong>
          <small>Verified organization</small>
        </span>
        <span className="mini-safe-label">Trusted</span>
      </div>
      <div>
        <span className="security-icon red">
          <ShieldAlert size={18} />
        </span>
        <span>
          <strong>
            security@gog<span className="red-text">a</span>ntik.com
          </strong>
          <small>Potential domain impersonation</small>
        </span>
        <span className="mini-risk-label">Review</span>
      </div>
      <p>
        <ArrowDown size={12} /> Automatically separated for a closer look
      </p>
    </div>
  );
}

function FeatureVisibility() {
  return (
    <div className="mini-visibility">
      <div className="visibility-subject">
        <span className="feature-file-icon">
          <MessageSquare size={18} />
        </span>
        <span>
          Launch plan, ready for review<small>Shared with your team</small>
        </span>
        <span className="visibility-check">
          <CheckCheck size={16} />
        </span>
      </div>
      {[
        { name: "Sarah", time: "Seen at 10:44 AM", photo: "sarah" },
        { name: "Ahmed", time: "Seen at 10:46 AM", photo: "shahadat" },
        { name: "Alex", time: "Replied at 10:48 AM", photo: "alex" },
      ].map((person) => (
        <div className="visibility-person" key={person.name}>
          <Image
            src={`/avatar-${person.photo}.jpg`}
            alt={person.name}
            width={27}
            height={27}
          />
          <strong>{person.name}</strong>
          <span>{person.time}</span>
          <CheckCheck size={13} />
        </div>
      ))}
    </div>
  );
}

export function Home({ submissionsEnabled }: { submissionsEnabled: boolean }) {
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [securitySelection, setSecuritySelection] = useState<
    "trusted" | "suspicious"
  >("suspicious");
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const decorationY = useTransform(scrollY, [0, 900], [0, 65]);

  function openDialog(kind: DialogKind) {
    setMenuOpen(false);
    setDialog(kind);
  }

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-container">
          <a href="#" className="brand-link" aria-label="Go Mail home">
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="sign-in" onClick={() => openDialog("signin")}>
              Sign in <ArrowUpRight size={12} />
            </button>
            <button
              className="button button-secondary nav-demo"
              onClick={() => openDialog("demo")}
            >
              Request a demo
            </button>
            <button
              className="button button-primary nav-access"
              onClick={() => openDialog("access")}
            >
              Get early access <ArrowUpRight size={13} />
            </button>
            <button
              className="mobile-menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={15} />
              </a>
            ))}
            <button onClick={() => openDialog("signin")}>
              Sign in <ArrowUpRight size={15} />
            </button>
            <button onClick={() => openDialog("demo")}>
              Request a demo <ArrowUpRight size={15} />
            </button>
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero" id="product">
          <motion.div
            className="hero-grid"
            aria-hidden="true"
            style={{ y: decorationY }}
          />
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.6 }}
            >
              <a href="#experience" className="announcement">
                <span className="announcement-icon">
                  <Sparkles size={12} />
                </span>
                Same email. A whole new possibility.
                <ChevronRight size={13} />
              </a>
              <h1>
                <span className="hero-product-name">GO MAIL, BY GOGENTIK</span>
                Email, reimagined
                <br />
                <span className="hero-blue">for business.</span>
              </h1>
              <p className="hero-description">
                Your inbox should do more than deliver messages. Bring organized
                <br className="desktop-break" /> conversations, clearer security
                signals, and your team together.
                <br className="desktop-break" />
                <strong>
                  Your email stays where it is. Everything gets better.
                </strong>
              </p>
              <div className="hero-actions">
                <button
                  className="button button-primary button-large"
                  onClick={() => openDialog("access")}
                >
                  Get early access <ArrowUpRight size={17} />
                </button>
                <a
                  href="#experience"
                  className="button button-secondary button-large"
                >
                  Explore the experience <ArrowDown size={15} />
                </a>
              </div>
              <p className="hero-trust">
                <ShieldCheck size={14} /> Works with your existing email
                infrastructure.<span>No migration. No starting over.</span>
              </p>
            </motion.div>
          </div>
          <div className="wide-container">
            <InboxDemo />
          </div>
        </section>

        <section
          className="compatibility-section"
          aria-labelledby="compatibility-heading"
        >
          <div className="container compatibility-inner">
            <p id="compatibility-heading">
              A new experience.
              <br />
              <strong>The email you already trust.</strong>
            </p>
            <div className="provider-wordmark">
              <CompanyMark company="Google" />
              <span>Google Workspace</span>
            </div>
            <div className="provider-wordmark">
              <CompanyMark company="Microsoft" />
              <span>Microsoft 365</span>
            </div>
            <div className="provider-wordmark">
              <span className="email-provider-icon">
                <Mail size={24} />
              </span>
              <span>Your existing email</span>
            </div>
            <span className="compatibility-note">
              Designed to connect.
              <br />
              Built to fit your business.
            </span>
          </div>
          <p className="integration-footnote">
            Planned integrations. Provider names identify compatibility goals,
            not partnerships or endorsements.
          </p>
        </section>

        <section className="problem-section section-space" id="the-problem">
          <div className="container">
            <div className="split-heading">
              <SectionHeading
                eyebrow="SOUND FAMILIAR?"
                title={
                  <>
                    Business email wasn’t built
                    <br />
                    for the way we work now.
                  </>
                }
              />
              <Reveal className="split-heading-description">
                <p>
                  More messages. More tools. Less clarity.
                  <br />
                  The problem isn’t your team. It’s an inbox that hasn’t kept
                  up.
                </p>
              </Reveal>
            </div>
            <div className="problem-grid">
              {[
                {
                  icon: Layers3,
                  title: "Everything, everywhere.",
                  text: "Clients, partners, and internal teams, all mixed into one crowded inbox.",
                },
                {
                  icon: ShieldAlert,
                  title: "Familiar isn’t always safe.",
                  text: "A lookalike address can hide in plain sight among people you trust.",
                },
                {
                  icon: Search,
                  title: "Important gets buried.",
                  text: "The conversation you need is somewhere under everything else.",
                },
                {
                  icon: Eye,
                  title: "Sent. But seen?",
                  text: "You’re left wondering who’s read the message and who needs a follow-up.",
                },
                {
                  icon: MessageCircle,
                  title: "Another tool. Again.",
                  text: "Conversations leave email because working together shouldn’t be this hard.",
                },
              ].map(({ icon: Icon, title, text }, index) => (
                <Reveal
                  className="problem-item"
                  key={title}
                  delay={index * 0.04}
                >
                  <span className="problem-icon">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="problem-bottom">
              <span>Email can do better.</span>
              <ArrowDown size={16} />
            </Reveal>
          </div>
        </section>

        <section className="features-section section-space" id="features">
          <div className="container">
            <SectionHeading
              centered
              eyebrow="MEET YOUR NEW WORKFLOW"
              title={
                <>
                  One inbox. Every organization.
                  <br />
                  <span className="muted-heading">Complete clarity.</span>
                </>
              }
              description="Less searching. Less second-guessing. More meaningful conversations."
            />
            <div className="features-grid">
              <Reveal className="feature-card organization-feature">
                <div className="feature-copy">
                  <span className="feature-icon">
                    <Building2 size={19} />
                  </span>
                  <span className="feature-number">01 / ORGANIZATION</span>
                  <h3>A place for every company.</h3>
                  <p>
                    Conversations grouped by organization and email domain. Go
                    straight to the people and businesses that matter.
                  </p>
                </div>
                <MiniOrganization />
                <a className="feature-link" href="#experience">
                  Find your focus <ArrowUpRight size={14} />
                </a>
              </Reveal>
              <Reveal className="feature-card security-feature" delay={0.06}>
                <div className="feature-copy">
                  <span className="feature-icon">
                    <ShieldCheck size={19} />
                  </span>
                  <span className="feature-number">
                    02 / SECURITY AWARENESS
                  </span>
                  <h3>Familiar names. Clearer signals.</h3>
                  <p>
                    Spot lookalike domains and unfamiliar senders, with
                    important warnings right where the conversation happens.
                  </p>
                </div>
                <FeatureSecurity />
                <a className="feature-link" href="#security">
                  See the difference <ArrowUpRight size={14} />
                </a>
              </Reveal>
              <Reveal className="feature-card conversation-feature">
                <div className="feature-copy">
                  <span className="feature-icon">
                    <MessageSquare size={19} />
                  </span>
                  <span className="feature-number">
                    03 / NATURAL CONVERSATIONS
                  </span>
                  <h3>Less thread. More conversation.</h3>
                  <p>
                    A familiar messaging experience for business email. Follow
                    the flow without untangling quoted replies.
                  </p>
                </div>
                <FeatureConversation />
                <a className="feature-link" href="#experience">
                  Keep things moving <ArrowUpRight size={14} />
                </a>
              </Reveal>
              <Reveal className="feature-card visibility-feature" delay={0.06}>
                <div className="feature-copy">
                  <span className="feature-icon">
                    <Users size={19} />
                  </span>
                  <span className="feature-number">04 / TEAM VISIBILITY</span>
                  <h3>On the same page. Finally.</h3>
                  <p>
                    Shared context, conversation activity, and read visibility
                    help your team stay aligned without another follow-up.
                  </p>
                </div>
                <FeatureVisibility />
                <span className="feature-link feature-disclaimer">
                  Read visibility depends on integration and team settings.
                </span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="security-section section-space" id="security">
          <div className="container">
            <div className="security-layout">
              <div>
                <SectionHeading
                  eyebrow="A LITTLE MORE PEACE OF MIND"
                  title={
                    <>
                      Know who you’re
                      <br />
                      talking to.
                    </>
                  }
                  description="Not every email that looks familiar comes from someone you trust. Get the context to pause, check, and make a more informed decision."
                />
                <div className="security-capabilities">
                  {[
                    { icon: Search, text: "Domain similarity analysis" },
                    { icon: ShieldCheck, text: "Sender verification" },
                    { icon: Layers3, text: "Suspicious sender separation" },
                    {
                      icon: Fingerprint,
                      text: "Unknown sender identification",
                    },
                    {
                      icon: Network,
                      text: "Communication relationship awareness",
                    },
                    {
                      icon: ShieldAlert,
                      text: "Security warnings inside the inbox",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text}>
                      <Icon size={16} />
                      {text}
                    </span>
                  ))}
                </div>
                <p className="section-caveat">
                  Designed capabilities, demonstrated here with example data. No
                  claim of certified or proven threat protection.
                </p>
              </div>
              <Reveal className="security-dashboard">
                <div className="security-dashboard-top">
                  <span>
                    <ShieldCheck size={17} /> Sender intelligence
                  </span>
                  <span className="concept-badge">CONCEPT PREVIEW</span>
                </div>
                <div className="security-dashboard-subtitle">
                  <h3>One character. A different story.</h3>
                  <p>The details deserve a second look.</p>
                </div>
                <div className="sender-options">
                  <button
                    className={`sender-option ${securitySelection === "trusted" ? "active" : ""}`}
                    onClick={() => setSecuritySelection("trusted")}
                    aria-pressed={securitySelection === "trusted"}
                  >
                    <span className="security-icon green">
                      <ShieldCheck size={20} />
                    </span>
                    <span>
                      <strong>finance@google.com</strong>
                      <small>Verified organization</small>
                    </span>
                    <CircleCheck size={16} className="green-text" />
                  </button>
                  <button
                    className={`sender-option risky ${securitySelection === "suspicious" ? "active" : ""}`}
                    onClick={() => setSecuritySelection("suspicious")}
                    aria-pressed={securitySelection === "suspicious"}
                  >
                    <span className="security-icon red">
                      <ShieldAlert size={20} />
                    </span>
                    <span>
                      <strong>
                        finance@goog<span className="domain-highlight">1</span>
                        e.com
                      </strong>
                      <small>Potential domain impersonation</small>
                    </span>
                    <ShieldAlert size={16} className="red-text" />
                  </button>
                </div>
                <div
                  className={`sender-analysis ${securitySelection}`}
                  aria-live="polite"
                >
                  {securitySelection === "suspicious" ? (
                    <>
                      <div>
                        <ShieldAlert size={18} />
                        <h4>A familiar-looking domain. Not the same sender.</h4>
                      </div>
                      <p>
                        <strong>goog1e.com</strong> uses the number “1” in place
                        of the letter “l”. Confirm this sender through a known,
                        trusted channel before opening links or attachments.
                      </p>
                      <span>
                        <Layers3 size={13} /> Separated into Suspicious Emails{" "}
                        <ArrowRight size={13} />
                      </span>
                    </>
                  ) : (
                    <>
                      <div>
                        <ShieldCheck size={18} />
                        <h4>A recognized organization in this example.</h4>
                      </div>
                      <p>
                        <strong>google.com</strong> matches the expected
                        organization domain. Domain matching is one signal, not
                        a guarantee that a message is safe.
                      </p>
                      <span>
                        <Building2 size={13} /> Grouped with Google
                        conversations <Check size={13} />
                      </span>
                    </>
                  )}
                </div>
                <div className="security-dashboard-footer">
                  <LockKeyhole size={12} /> A signal to investigate. Never a
                  substitute for judgment.
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          className="integration-section section-space"
          id="how-it-works"
        >
          <div className="container">
            <SectionHeading
              centered
              eyebrow="BETTER TOGETHER"
              title={
                <>
                  Keep your email.
                  <br />
                  <span className="muted-heading">
                    Upgrade your experience.
                  </span>
                </>
              }
              description="No new address. No mailbox migration. Just an intelligent layer that makes the infrastructure you already have work better for your team."
            />
            <Reveal className="integration-diagram">
              <div className="integration-sources">
                <div>
                  <CompanyMark company="Google" />
                  <span>Google Workspace</span>
                </div>
                <div>
                  <CompanyMark company="Microsoft" />
                  <span>Microsoft 365</span>
                </div>
                <div>
                  <Mail size={20} />
                  <span>Existing email infrastructure</span>
                </div>
              </div>
              <div className="connection-path">
                <span />
                <ArrowRight size={18} />
              </div>
              <div className="integration-core">
                <Brand compact />
                <span>Your intelligent interface</span>
              </div>
              <div className="connection-path">
                <span />
                <ArrowRight size={18} />
              </div>
              <div className="integration-outcomes">
                <span>
                  <Building2 size={17} /> Organized by business
                </span>
                <span>
                  <ShieldCheck size={17} /> Clearer security context
                </span>
                <span>
                  <Users size={17} /> More connected teams
                </span>
              </div>
            </Reveal>
            <div className="integration-benefits">
              {[
                "Keep your email addresses",
                "Keep your mailboxes",
                "No forced migration",
                "Customer-controlled options",
              ].map((text) => (
                <span key={text}>
                  <Check size={14} />
                  {text}
                </span>
              ))}
            </div>
            <p className="section-caveat centered">
              Integrations are in development. Provider compatibility and
              deployment options will depend on your product edition.
            </p>
          </div>
        </section>

        <section className="enterprise-section section-space" id="enterprise">
          <div className="container enterprise-layout">
            <div>
              <SectionHeading
                eyebrow="BUILT FOR YOUR BUSINESS"
                title={
                  <>
                    Your infrastructure.
                    <br />
                    Your data. Your control.
                  </>
                }
                description="A better email experience shouldn’t mean giving up control. Our enterprise vision brings Go Mail into the environment your business trusts."
              />
              <div className="enterprise-benefits">
                {[
                  "Run in your AWS, Azure, or private infrastructure",
                  "Greater control over where your data lives",
                  "Connect with existing identity and access systems",
                  "Reduce dependency on third-party application hosting",
                ].map((text) => (
                  <span key={text}>
                    <Check size={15} />
                    {text}
                  </span>
                ))}
              </div>
              <button
                className="button button-white"
                onClick={() => openDialog("demo")}
              >
                Let’s talk enterprise <ArrowUpRight size={15} />
              </button>
              <p className="enterprise-caveat">
                Customer-managed deployment is a planned capability.
                <br />
                Availability and configuration depend on the selected edition.
              </p>
            </div>
            <Reveal className="enterprise-diagram">
              <div className="environment-label">
                <LockKeyhole size={13} /> YOUR CONTROLLED ENVIRONMENT <span />
              </div>
              <div className="environment-top">
                <span>
                  <Cloud size={18} /> AWS
                </span>
                <span>
                  <Layers3 size={18} /> Azure
                </span>
                <span>
                  <Server size={18} /> Private cloud
                </span>
              </div>
              <div className="environment-line vertical-line" />
              <div className="environment-app">
                <Brand compact />
                <span>Intelligent business communication</span>
              </div>
              <div className="environment-split">
                <span />
                <span />
              </div>
              <div className="environment-bottom">
                <div>
                  <Fingerprint size={23} />
                  <span>Your identity provider</span>
                  <small>Identity & access</small>
                </div>
                <div>
                  <Server size={23} />
                  <span>Your email infrastructure</span>
                  <small>Mailboxes & storage</small>
                </div>
              </div>
              <div className="environment-footer">
                <ShieldCheck size={14} /> Your boundary. Your policies. Your
                choice.
              </div>
            </Reveal>
          </div>
        </section>

        <section className="comparison-section section-space" id="why-go-mail">
          <div className="container comparison-layout">
            <SectionHeading
              eyebrow="THE DIFFERENCE IS CLARITY"
              title={
                <>
                  Not another inbox.
                  <br />A better way to work.
                </>
              }
              description="Everything you value about email, with a more thoughtful experience built around the needs of your business."
            />
            <Reveal className="comparison-table-wrap">
              <table className="comparison-table">
                <caption className="sr-only">
                  Traditional email experiences and planned Go Mail capabilities
                </caption>
                <thead>
                  <tr>
                    <th scope="col">The everyday experience</th>
                    <th scope="col">Traditional email</th>
                    <th scope="col">
                      <Brand compact />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Organization-based navigation",
                      "Limited",
                      "Built around organizations",
                    ],
                    [
                      "Messenger-style conversations",
                      "Limited",
                      "A natural conversation flow",
                    ],
                    [
                      "Suspicious domain awareness",
                      "Provider dependent",
                      "Integrated experience",
                    ],
                    [
                      "Team read visibility",
                      "Limited",
                      "Enhanced, where supported",
                    ],
                    [
                      "Existing email compatibility",
                      "Yes",
                      "Yes, through integrations",
                    ],
                  ].map(([capability, traditional, gomail]) => (
                    <tr key={capability}>
                      <th scope="row">{capability}</th>
                      <td>{traditional}</td>
                      <td>
                        <Check size={14} />
                        <span>{gomail}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-note">
                A general comparison, not a claim about a specific provider. Go
                Mail capabilities shown reflect the product vision and depend on
                integrations.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="final-cta">
          <div className="container">
            <Reveal className="final-cta-inner">
              <span className="cta-symbol">
                <Mail size={28} />
                <ArrowUpRight size={17} />
              </span>
              <span className="eyebrow">LESS NOISE. MORE POSSIBILITY.</span>
              <h2>
                Your business deserves
                <br />a better inbox.
              </h2>
              <p>
                Make every conversation clearer, safer, and easier to manage.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-primary button-large"
                  onClick={() => openDialog("access")}
                >
                  Get early access <ArrowUpRight size={17} />
                </button>
                <button
                  className="button button-secondary button-large"
                  onClick={() => openDialog("contact")}
                >
                  Talk to our team <ArrowRight size={15} />
                </button>
              </div>
              <span className="cta-note">
                <Check size={13} /> Your email stays. Your experience evolves.
              </span>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#" aria-label="Go Mail home">
                <Brand />
              </a>
              <p>Business email. Beautifully connected.</p>
              <span>An intelligent email experience by GoGentik.</span>
            </div>
            <div className="footer-column">
              <h3>Go Mail</h3>
              <a href="#product">Product</a>
              <a href="#features">Features</a>
              <a href="#security">Security</a>
              <a href="#how-it-works">How it works</a>
            </div>
            <div className="footer-column">
              <h3>For your business</h3>
              <a href="#enterprise">Enterprise</a>
              <button onClick={() => openDialog("demo")}>Request a demo</button>
              <button onClick={() => openDialog("access")}>
                Early access <ArrowUpRight size={11} />
              </button>
            </div>
            <div className="footer-column">
              <h3>GoGentik</h3>
              <button onClick={() => openDialog("about")}>
                About GoGentik
              </button>
              <button onClick={() => openDialog("contact")}>Contact</button>
              <button onClick={() => openDialog("privacy")}>
                Privacy policy
              </button>
              <button onClick={() => openDialog("terms")}>
                Terms of service
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 GoGentik. All rights reserved.</span>
            <span>
              <span className="live-dot" /> Thoughtfully built. Currently in
              development.
            </span>
            <a href="#">
              Back to top <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </footer>
      <RequestDialog
        kind={dialog}
        onClose={() => setDialog(null)}
        onChange={setDialog}
        submissionsEnabled={submissionsEnabled}
      />
    </MotionConfig>
  );
}
