import { ReactNode } from 'react';

/**
 * Badge — small status/attribute pill. Used for adoption status, energy
 * level, compatibility, and dog attribute tags.
 */
export interface BadgeProps {
  children: ReactNode;
  tone?: 'success' | 'info' | 'warning' | 'neutral';
  /** Optional lucide icon name. */
  icon?: string;
}
