import { useState, useEffect } from "react";
import type { EventSummary } from "../api";
import { Check, X } from "lucide-react";

function Notice({
  text,
  kind = "error",
}: {
  text: string;
  kind?: "error" | "success";
}) {
  return (
    <div className={`notice ${kind}`}>
      {kind === "error" ? <X /> : <Check />}
      {text}
    </div>
  );
}

export default Notice;
