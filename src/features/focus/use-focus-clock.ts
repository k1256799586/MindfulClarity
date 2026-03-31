import { useEffect, useMemo, useState } from 'react';

import type { FocusSession } from '@/types/models';

function getRemainingSeconds(session?: FocusSession) {
  if (!session) {
    return 0;
  }

  if (session.status === 'completed' || session.status === 'abandoned') {
    return 0;
  }

  if (session.status === 'paused') {
    return session.remainingSeconds;
  }

  if (session.endsAt) {
    const diff = Math.ceil(
      (new Date(session.endsAt).getTime() - Date.now()) / 1000
    );

    return Math.max(diff, 0);
  }

  return session.remainingSeconds;
}

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainder}`;
}

export function useFocusClock(session?: FocusSession) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    getRemainingSeconds(session)
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(session));
  }, [session?.endsAt, session?.pausedAt, session?.remainingSeconds, session?.status]);

  useEffect(() => {
    if (!session || session.status !== 'active') {
      return undefined;
    }

    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(session));
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const timeLabel = useMemo(
    () => formatRemaining(remainingSeconds),
    [remainingSeconds]
  );

  return {
    remainingSeconds,
    timeLabel,
  };
}
