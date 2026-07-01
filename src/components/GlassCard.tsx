import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  glow?: boolean;
  className?: string;
};

export function GlassCard({ children, glow = false, className, ...rest }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass relative rounded-2xl p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(96,165,250,0.35)]",
        className,
      )}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--neon-cyan) 40%, transparent), transparent 40%, color-mix(in oklab, var(--neon-purple) 40%, transparent))",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
