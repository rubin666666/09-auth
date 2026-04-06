import type { ReactNode } from "react";

type PrivateLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return children;
}
