"use client";

import type { MouseEvent, ReactNode } from "react";
import css from "./Modal.module.css";

type ModalProps = Readonly<{
  children: ReactNode;
  onClose: () => void;
}>;

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className={css.backdrop} onClick={onClose}>
      <div
        className={css.content}
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        <button type="button" className={css.closeButton} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
