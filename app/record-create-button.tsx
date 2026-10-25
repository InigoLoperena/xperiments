import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { BarChart3, BookOpen, Compass, Flag, FlaskConical, LayoutGrid, Lightbulb, Microscope, Search, Target } from "lucide-react";
import type { Kind } from "@/lib/model";

const identities = {
  project: { icon: LayoutGrid, color: "var(--lime)" },
  north_star: { icon: Compass, color: "var(--blue-text)" },
  goal: { icon: Target, color: "var(--objective-accent)" },
  opportunity: { icon: Search, color: "var(--red-text)" },
  hypothesis: { icon: Lightbulb, color: "var(--hypothesis-accent)" },
  idea: { icon: Lightbulb, color: "var(--hypothesis-accent)" },
  experiment: { icon: FlaskConical, color: "var(--experiment-accent)" },
  research: { icon: Microscope, color: "#75c1ff" },
  learning: { icon: BookOpen, color: "var(--blue-text)" },
  objective: { icon: Target, color: "var(--objective-accent)" },
  kr: { icon: BarChart3, color: "var(--blue-text)" },
};

export function RecordCreateButton({ kind, principal = false, inputMetric = false, icon, accent, className = "", style, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
  kind: Kind; principal?: boolean; inputMetric?: boolean; icon?: ReactNode; accent?: string;
}) {
  const identity = principal ? { icon: Flag, color: "var(--red-text)" } : inputMetric ? identities.kr : identities[kind];
  const Icon = identity.icon;
  return <button {...props} type={props.type || "button"} className={`record-create-button ${className}`} style={{ "--create-accent": accent || identity.color, ...style } as CSSProperties}>
    {icon || <Icon size={24} aria-hidden="true" />}{children}
  </button>;
}
