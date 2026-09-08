/**
 * Checkbox — used for adoption-form consent and filter toggles.
 */
export interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
