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
  tone?: 'available' | 'adopted';
  onClick?: () => void;
}
