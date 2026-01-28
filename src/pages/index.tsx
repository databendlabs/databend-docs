import React from "react";
import { Redirect } from "@docusaurus/router";

// Fallback redirect for non-Vercel environments (local dev, other hosts).
// On Vercel, the rewrite in vercel.json handles / -> /guides/ without URL change.
export default function Home() {
  return <Redirect to="/guides/" />;
}
