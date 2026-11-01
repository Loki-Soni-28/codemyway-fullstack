import { useEffect, useState } from 'react';
import { api } from './api';

export interface Offer {
  active: boolean;
  endsAt: string | null;
  percent: number;
}

// The early-bird offer comes from the backend. null while loading or if it can't be
// reached, so offer UI stays hidden rather than showing something that may not be honoured.
export function useOffer(): Offer | null {
  const [offer, setOffer] = useState<Offer | null>(null);
  useEffect(() => {
    api<Offer>('/public/offer').then(setOffer).catch(() => setOffer(null));
  }, []);
  return offer;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Counts down to a real deadline; null when there is no deadline or it has passed.
export function useCountdown(endsAt: string | null | undefined): TimeLeft | null {
  const compute = (): TimeLeft | null => {
    if (!endsAt) return null;
    const diff = new Date(endsAt).getTime() - Date.now();
    if (!Number.isFinite(diff) || diff <= 0) return null;
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  };
  const [left, setLeft] = useState<TimeLeft | null>(compute);
  useEffect(() => {
    setLeft(compute());
    if (!endsAt) return;
    const timer = setInterval(() => setLeft(compute()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);
  return left;
}
