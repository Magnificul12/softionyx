import { type CSSProperties, type ReactNode, type ElementType } from 'react';
import { useInView } from '../hooks/useInView';

type RevealVariant = 'fade-up' | 'fade-in' | 'fade-scale' | 'slide-left' | 'slide-right';

interface RevealProps {
  children: ReactNode;
  /** Animation style. Maps to a keyframe defined in index.css. */
  variant?: RevealVariant;
  /** Delay in ms before the animation starts after entering the viewport. */
  delay?: number;
  /** Duration override in ms. Defaults to the variant's default. */
  duration?: number;
  /** Element tag to render. Defaults to <div>. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Disable reveal — useful for above-the-fold hero content that must be
   *  instantly visible for best LCP score. */
  disabled?: boolean;
}

const variantClass: Record<RevealVariant, string> = {
  'fade-up': 'animate-in',
  'fade-in': 'animate-fade-in',
  'fade-scale': 'animate-fade-scale',
  'slide-left': 'animate-slide-left',
  'slide-right': 'animate-slide-right',
};

/**
 * Reveal a child element once it scrolls into view. Uses the global keyframe
 * utilities from index.css (animate-in, animate-fade-in, …) and the existing
 * reduced-motion handling — users with `prefers-reduced-motion` bypass the
 * animation entirely.
 *
 * Example:
 *   <Reveal variant="fade-up" delay={200}>
 *     <h2>Section title</h2>
 *   </Reveal>
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration,
  as: Tag = 'div',
  className = '',
  style,
  disabled = false,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true });

  if (disabled) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const animationClass = inView ? variantClass[variant] : '';
  const combined = `${className} ${animationClass}`.trim();

  const composedStyle: CSSProperties = {
    ...(style || {}),
    // Hide content until it becomes visible, then let the keyframe drive opacity.
    opacity: inView ? undefined : 0,
    animationDelay: inView && delay ? `${delay}ms` : undefined,
    animationDuration: inView && duration ? `${duration}ms` : undefined,
  };

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={combined} style={composedStyle}>
      {children}
    </Tag>
  );
}
