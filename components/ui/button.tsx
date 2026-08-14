import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-forest text-cream hover:bg-forest/90 focus-visible:outline-forest",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-brass focus-visible:outline-brass",
  ghost: "bg-transparent text-ink hover:text-forest focus-visible:outline-forest",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  href?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: Props) {
  const classes = `inline-flex min-h-11 items-center justify-center px-5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
