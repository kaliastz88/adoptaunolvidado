import { ReactNode } from 'react';

/**
 * Button — primary interactive control across the site: donate, adopt,
 * sponsor, and secondary/ghost actions.
 */
export interface ButtonProps {
  children: ReactNode;
  /** Visual style. `cta` = terracotta donate/adopt, `sponsor` = amber apadrina. */
  variant?: 'primary' | 'cta' | 'sponsor' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name shown before the label. */
  icon?: string;
  /** Plays a gentle wag rotation on the icon when hovered — use on the Donar CTA. */
  wag?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
