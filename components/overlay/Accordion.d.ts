/**
 * Accordion — expandable Q&A list, used on Preguntas Frecuentes.
 */
export interface AccordionItem {
  q: string;
  a: string;
}
export interface AccordionProps {
  items: AccordionItem[];
}
