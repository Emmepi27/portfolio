"use client";

import * as React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-6 px-5 py-16">
      <h1 className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)]">
        Qualcosa non ha funzionato
      </h1>
      <p className="text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">
        Si è verificato un errore nel caricamento di questa pagina. Puoi riprovare: spesso basta un
        aggiornamento. Se il problema persiste, apri la console del browser (F12) per i dettagli
        tecnici.
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <pre className="max-h-40 overflow-auto rounded-md border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] p-3 text-xs text-[color:var(--ds-text-muted)]">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="ds-btn-primary inline-flex w-fit justify-center px-6 py-2.5 text-sm font-medium"
      >
        Riprova
      </button>
    </div>
  );
}
