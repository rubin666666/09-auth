import type { ReactNode } from "react";
import css from "./Modal.module.css";

type ModalProps = Readonly<{
  children: ReactNode;
}>;

export function Modal({ children }: ModalProps) {
  return (
    <div className={css.backdrop}>
      <div className={css.content}>{children}</div>
    </div>
  );
}
