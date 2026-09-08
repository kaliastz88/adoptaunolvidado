/**
 * StatCounter — big impact number ("+60 perritos con hogar") used on the
 * homepage to build trust at a glance.
 */
export interface StatCounterProps {
  value: string;
  label: string;
  tone?: 'brand' | 'neutral';
}
