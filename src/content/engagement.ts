/**
 * Engagement / pricing for agency collaborations.
 * Only set fields when real; otherwise UI shows "su richiesta".
 */
export type Engagement = {
  /** Optional: hourly rate in EUR. */
  hourlyRateEUR?: number;
  /** Optional: e.g. "10–20". */
  retainerHoursRange?: string;
  /** Optional: e.g. "4–6". */
  sprintDurationWeeks?: string;
};

export const agencyEngagement: Engagement = {
  // Leave empty to show "Modalità e tariffa: su richiesta (preventivo rapido 24–48h)"
};
