"use client";

import dynamic from "next/dynamic";

export const HomePage = dynamic(
  () => import("@/app/home-client").then((mod) => mod.HomeClient),
  { ssr: false }
);
