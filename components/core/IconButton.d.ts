/**
 * IconButton — circular icon-only control for nav utilities (search, menu,
 * share, close).
 */
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label (not visible). */
  label: string;
  size?: number;
  tone?: 'default' | 'brand';
  onClick?: () => void;
}
