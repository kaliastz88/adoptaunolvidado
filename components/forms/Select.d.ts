/**
 * Select — dropdown used for catalog filters (especie, tamaño, edad) and forms.
 */
export interface SelectProps {
  label?: string;
  options?: string[];
  value?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
}
