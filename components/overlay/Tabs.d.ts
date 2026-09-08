/**
 * Tabs — segmented control, e.g. "Dona una vez" / "Mensual" on the donation
 * popup.
 */
export interface TabsProps {
  options: string[];
  value: string;
  onChange?: (value: string) => void;
}
