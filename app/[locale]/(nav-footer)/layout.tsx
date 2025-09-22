import React from "react";
import TopNav from "@/components/nav";
import Footer from "@/components/footer";
import { setRequestLocale } from "next-intl/server";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopNav />
      {children}
      <Footer />
    </>
  );
}
