"use client";

import { useState } from "react";

type Props = {
  caseId: string;
  hospitalId: string;
};

export function RequestButton({ caseId, hospitalId }: Props) {
  const [done, setDone] = useState(false);

  async function sendRequest() {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, hospitalId }),
    });
    setDone(response.ok);
  }

  return (
    <button
      type="button"
      onClick={sendRequest}
      className="rounded bg-sky-700 px-3 py-1.5 text-xs text-white"
    >
      {done ? "要請送信済み" : "受入要請を送信"}
    </button>
  );
}
