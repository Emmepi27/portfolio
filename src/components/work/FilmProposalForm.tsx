"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type Props = {
  emailHref: string;
};

function fieldValue(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export default function FilmProposalForm({ emailHref }: Props) {
  const [status, setStatus] = useState<string>("");
  const emailAddress = useMemo(() => emailHref.replace(/^mailto:/i, ""), [emailHref]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailAddress) {
      setStatus("Email non configurata: usa la pagina contatti.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const name = fieldValue(data, "name");
    const email = fieldValue(data, "email");
    const project = fieldValue(data, "project");
    const projectUrl = fieldValue(data, "projectUrl");
    const materials = fieldValue(data, "materials");
    const audio = fieldValue(data, "audio");
    const notes = fieldValue(data, "notes");

    const subject = `Proposta film cinema - ${project || name || "nuovo progetto"}`;
    const body = [
      "Proposta film per ManuDesign Cinema",
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      `Progetto: ${project}`,
      `URL progetto: ${projectUrl || "non indicato"}`,
      `Offerta: offerta libera`,
      `Audio: ${audio || "da valutare"}`,
      "",
      "Link materiali:",
      materials || "non indicati",
      "",
      "Note:",
      notes || "nessuna nota",
      "",
      "Nota: nessun file e stato caricato dal sito. I materiali sono solo link o descrizioni inserite nel form.",
    ].join("\n");

    const href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus("Bozza email preparata. Controlla il client email prima di inviare.");
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
          Nome
          <input
            name="name"
            required
            autoComplete="name"
            className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
        Nome progetto
        <input
          name="project"
          required
          className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
        URL progetto
        <input
          name="projectUrl"
          type="url"
          placeholder="https://..."
          className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
        Link materiali
        <textarea
          name="materials"
          rows={4}
          placeholder="Drive, demo pubblica, screenshot gia approvati, note asset..."
          className="rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 py-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
          Audio
          <select
            name="audio"
            defaultValue="Da valutare"
            className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
          >
            <option>Da valutare</option>
            <option>Ho gia una traccia</option>
            <option>Serve sound design</option>
            <option>Senza audio</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
          Offerta
          <input
            name="offer"
            value="offerta libera"
            readOnly
            className="min-h-[46px] rounded-md border border-[color:var(--ds-border)] bg-[color:color-mix(in_srgb,var(--ds-surface-1)_72%,var(--ds-bg-base))] px-3 text-base text-[color:var(--ds-text-secondary)] outline-none"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[color:var(--ds-text-primary)]">
        Note
        <textarea
          name="notes"
          rows={5}
          placeholder="Obiettivo del film, tono, pubblico, parti da evitare, asset con diritti incerti..."
          className="rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-3 py-3 text-base text-[color:var(--ds-text-primary)] outline-none transition-colors focus:border-[color:var(--ds-border-strong)] focus:ring-2 focus:ring-[color:var(--ds-focus-ring)]"
        />
      </label>

      <div className="rounded-md border border-[color:var(--ds-border)] bg-[color:color-mix(in_srgb,var(--ds-surface-1)_58%,var(--ds-bg-base))] p-4 text-sm leading-[1.6] text-[color:var(--ds-text-secondary)]">
        Nessun file viene caricato dal sito. Inserisci solo link o descrizioni di materiali che puoi condividere. Audio e diritti restano da confermare prima della pubblicazione.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="ds-btn-primary px-6">
          Prepara email
        </button>
        {status ? (
          <p className="text-sm leading-[1.6] text-[color:var(--ds-text-secondary)]" role="status">
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}
