import { ReactNode } from 'react';

/**
 * Modal — centered dialog. Primary use: the donation pop-up that appears
 * on the homepage banner (one-time / monthly donation).
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
