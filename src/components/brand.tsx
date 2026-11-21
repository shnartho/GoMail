import { ArrowUpRight, Mail } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-symbol">
        <Mail size={23} strokeWidth={2.2} />
        <ArrowUpRight className="brand-arrow" size={13} strokeWidth={3} />
      </span>
      <span className="brand-name">
        Go Mail{!compact && <span className="brand-parent">by GoGentik</span>}
      </span>
    </span>
  );
}

export function CompanyMark({ company }: { company: string }) {
  if (company === "GoGentik")
    return (
      <span className="company-mark gogentik-mark">
        <Mail size={13} />
      </span>
    );
  if (company === "Microsoft")
    return (
      <span className="company-mark microsoft-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  if (company === "Google")
    return <span className="company-mark google-mark">G</span>;
  if (company === "Amazon")
    return (
      <span className="company-mark amazon-mark">
        a<span />
      </span>
    );
  return (
    <span className="company-mark neutral-mark">{company.slice(0, 1)}</span>
  );
}
