/**
 * Input — labeled text field for forms (adoption form, sponsor sign-up).
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: any) => void;
  error?: string;
}
