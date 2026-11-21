"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  LoaderCircle,
  LockKeyhole,
  X,
} from "lucide-react";
import {
  AccessErrors,
  AccessRequest,
  employeeOptions,
  providerOptions,
  validateAccessRequest,
} from "@/lib/early-access";
import { Brand } from "./brand";

export type DialogKind =
  "access" | "demo" | "contact" | "signin" | "privacy" | "terms" | "about";

const information: Partial<
  Record<DialogKind, { title: string; paragraphs: string[] }>
> = {
  signin: {
    title: "Your next workspace is on its way.",
    paragraphs: [
      "Go Mail is in development. Account sign-in and connected mailboxes are not available in this product preview.",
      "Join early access to express interest in a future pilot for your team. You will keep your existing email provider and addresses.",
    ],
  },
  about: {
    title: "Thoughtfully built by GoGentik.",
    paragraphs: [
      "Go Mail is GoGentik’s vision for a clearer, more connected business inbox. It brings organization-based navigation, conversation context, and security awareness into one experience.",
      "Our goal is to improve the way businesses work with their existing email infrastructure, without asking them to start over. This website demonstrates the intended experience; integrations and deployment editions are in development.",
    ],
  },
  privacy: {
    title: "Privacy in this preview.",
    paragraphs: [
      "This preview does not connect to your mailbox, access your contacts, or send email. All conversations, names, and security examples in the demo are illustrative.",
      "Demo replies and form entries are held in browser memory and disappear when the page is refreshed. No analytics or advertising trackers are included. Your hosting provider may record standard technical access logs.",
      "If request collection is not configured, your form is not transmitted or saved. If the site operator enables the request endpoint, the form clearly indicates that submission is available; your submitted contact and company details are then forwarded to the configured request service.",
      "A full privacy policy, including the legal operator, processors, retention periods, and privacy contact, must be published before public collection of personal data. Do not enter sensitive or confidential information in this preview.",
    ],
  },
  terms: {
    title: "Product preview terms.",
    paragraphs: [
      "Go Mail is a pre-release product concept by GoGentik. This interactive website is provided for evaluation and does not provide a production email service.",
      "Product features, integrations, availability, pricing, and deployment editions may change. Security examples are illustrative, not security advice or a guarantee of threat detection. Lookalike domains alone do not prove malicious intent.",
      "Do not enter sensitive information or rely on this preview for business-critical communications. Requesting early access does not create an account or guarantee a place in a pilot.",
      "These preview notices are not a substitute for final commercial terms. Formal service terms, support commitments, and data-processing agreements will be provided before production onboarding.",
    ],
  },
};

export function RequestDialog({
  kind,
  onClose,
  onChange,
  submissionsEnabled,
}: {
  kind: DialogKind | null;
  onClose: () => void;
  onChange: (kind: DialogKind) => void;
  submissionsEnabled: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<AccessRequest>({
    name: "",
    email: "",
    company: "",
    employees: "",
    provider: "",
    message: "",
    intent: "access",
  });
  const [errors, setErrors] = useState<AccessErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "prepared" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const info = kind ? information[kind] : undefined;

  useEffect(() => {
    if (kind) {
      dialog.current?.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    dialog.current?.close();
  }, [kind]);

  function close() {
    if (status === "loading") return;
    onClose();
    setStatus("idle");
    setErrors({});
    setStatusMessage("");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const request = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      intent: kind ?? "access",
    };
    const validation = validateAccessRequest(request);
    setErrors(validation);
    if (Object.keys(validation).length) {
      const firstField = Object.keys(validation)[0];
      dialog.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
      return;
    }
    if (!submissionsEnabled) {
      setStatus("prepared");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error ?? "We couldn’t send your request. Please try again.",
        );
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again.",
      );
    }
  }

  function downloadRequest() {
    const content = `Go Mail ${kind === "demo" ? "demo" : "early access"} request\n\nFull name: ${values.name}\nWork email: ${values.email}\nCompany: ${values.company}\nEmployees: ${values.employees}\nEmail provider: ${values.provider}\nMessage: ${values.message || "None"}\n\nPrepared locally. This request has not been submitted to GoGentik.`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "go-mail-request.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <dialog
      ref={dialog}
      className="request-dialog"
      aria-labelledby="dialog-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog-inner">
        <button
          className="dialog-close"
          aria-label="Close dialog"
          onClick={close}
          disabled={status === "loading"}
        >
          <X size={20} />
        </button>
        <Brand compact />
        {info ? (
          <div className="information-dialog">
            <span className="eyebrow">GO MAIL BY GOGENTIK</span>
            <h2 id="dialog-title">{info.title}</h2>
            {info.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {(kind === "signin" || kind === "about") && (
              <button
                className="button button-primary"
                onClick={() => onChange("access")}
              >
                Get early access <ArrowRight size={16} />
              </button>
            )}
          </div>
        ) : status === "prepared" || status === "success" ? (
          <div className="request-result">
            <span className="result-icon">
              {status === "success" ? (
                <CheckCircle2 size={30} />
              ) : (
                <Check size={30} />
              )}
            </span>
            <span className="eyebrow">
              {status === "success" ? "REQUEST RECEIVED" : "PREVIEW MODE"}
            </span>
            <h2 id="dialog-title">
              {status === "success"
                ? "A clearer inbox is worth a conversation."
                : "Your request is ready. Not sent."}
            </h2>
            <p>
              {status === "success"
                ? "Your details were delivered to our request service. Thank you for your interest in Go Mail."
                : "Request collection hasn’t been connected yet. Your details have not been transmitted or saved. You can download a copy for your records."}
            </p>
            {status === "prepared" && (
              <button
                className="button button-primary"
                onClick={downloadRequest}
              >
                <Download size={16} /> Download my request
              </button>
            )}
            <button className="text-button" onClick={() => setStatus("idle")}>
              Back to my details <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="dialog-heading">
              <span className="eyebrow">A BETTER INBOX STARTS HERE</span>
              <h2 id="dialog-title">
                {kind === "demo"
                  ? "Let’s find your better workflow."
                  : kind === "contact"
                    ? "Let’s talk about your team."
                    : "Be first to a clearer inbox."}
              </h2>
              <p>
                {kind === "demo"
                  ? "Tell us a little about your team and the experience you’re looking for."
                  : "Meet a more organized, connected way to work with the email you already use."}
              </p>
            </div>
            <form className="access-form" noValidate onSubmit={submit}>
              <div className="form-grid">
                {(
                  [
                    {
                      name: "name",
                      label: "Full name",
                      placeholder: "Alex Morgan",
                      autoComplete: "name",
                    },
                    {
                      name: "email",
                      label: "Work email",
                      placeholder: "alex@company.com",
                      autoComplete: "email",
                    },
                    {
                      name: "company",
                      label: "Company name",
                      placeholder: "Your company",
                      autoComplete: "organization",
                    },
                  ] as const
                ).map((field) => (
                  <label
                    key={field.name}
                    className={field.name === "company" ? "full-field" : ""}
                  >
                    {field.label}
                    <input
                      name={field.name}
                      type={field.name === "email" ? "email" : "text"}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      required
                      maxLength={
                        field.name === "email"
                          ? 254
                          : field.name === "company"
                            ? 150
                            : 100
                      }
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={
                        errors[field.name] ? `${field.name}-error` : undefined
                      }
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [field.name]: event.target.value,
                        })
                      }
                    />
                    {errors[field.name] && (
                      <span className="field-error" id={`${field.name}-error`}>
                        {errors[field.name]}
                      </span>
                    )}
                  </label>
                ))}
                <label>
                  Number of employees
                  <select
                    name="employees"
                    value={values.employees}
                    required
                    aria-invalid={Boolean(errors.employees)}
                    aria-describedby={
                      errors.employees ? "employees-error" : undefined
                    }
                    onChange={(event) =>
                      setValues({ ...values, employees: event.target.value })
                    }
                  >
                    <option value="">Select company size</option>
                    {employeeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  {errors.employees && (
                    <span className="field-error" id="employees-error">
                      {errors.employees}
                    </span>
                  )}
                </label>
                <label>
                  Current email provider
                  <select
                    name="provider"
                    value={values.provider}
                    required
                    aria-invalid={Boolean(errors.provider)}
                    aria-describedby={
                      errors.provider ? "provider-error" : undefined
                    }
                    onChange={(event) =>
                      setValues({ ...values, provider: event.target.value })
                    }
                  >
                    <option value="">Select email provider</option>
                    {providerOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  {errors.provider && (
                    <span className="field-error" id="provider-error">
                      {errors.provider}
                    </span>
                  )}
                </label>
                <label className="full-field">
                  Anything else? <span className="optional">Optional</span>
                  <textarea
                    name="message"
                    placeholder="Tell us what a better inbox would mean for your team."
                    value={values.message}
                    maxLength={2000}
                    onChange={(event) =>
                      setValues({ ...values, message: event.target.value })
                    }
                  />
                </label>
              </div>
              <p className="form-disclosure">
                <LockKeyhole size={13} />
                {submissionsEnabled
                  ? "Your details will be shared with our team to respond to your request."
                  : "Preview mode: request collection is not connected. Nothing will be sent or stored."}
              </p>
              {status === "error" && (
                <p className="form-error" role="alert">
                  {statusMessage}
                </p>
              )}
              <button
                type="submit"
                className="button button-primary form-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle size={16} className="loading-spinner" />{" "}
                    Sending request
                  </>
                ) : (
                  <>
                    {submissionsEnabled
                      ? kind === "demo"
                        ? "Request a demo"
                        : "Request early access"
                      : "Prepare my request"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="form-privacy">
                By continuing, you acknowledge our{" "}
                <button type="button" onClick={() => onChange("privacy")}>
                  preview privacy notice
                </button>
                .
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
