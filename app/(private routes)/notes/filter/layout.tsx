import type { ReactNode } from "react";

type NotesFilterLayoutProps = Readonly<{
  children: ReactNode;
  sidebar: ReactNode;
}>;

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <>
      {sidebar}
      {children}
    </>
  );
}
