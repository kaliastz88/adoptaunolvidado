/**
 * DogCard — catalog card for an adoptable/adopted dog: photo, name, age,
 * size, adoption status. The core visual unit of the Adopta catalog page.
 */
export interface DogCardProps {
  name: string;
  age: string;
  size: string;
  /** Image URL — omitted shows a placeholder paw icon. */
  photo?: string;
  /**
   * CSS background-position for the photo, e.g. '50% 25%'. Defaults to
   * 'center'. Portrait photos crop badly from the centre because the dog's
   * face sits near the top, so each dog stores its own focal point.
   */
  photoPos?: string;
  tone?: 'available' | 'adopted';
  onClick?: () => void;
}
