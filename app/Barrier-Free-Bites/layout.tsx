import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "无障碍友好美食指南",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}