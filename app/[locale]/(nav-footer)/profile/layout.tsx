import { ReactNode } from "react";
import { Sidebar } from "./components/sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/5">
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
