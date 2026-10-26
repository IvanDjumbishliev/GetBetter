import { useEffect, useState } from 'react';

import { TOAST_EVENT } from '@/lib/toast';

export function ToastViewport() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onToast = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setMessage(null), 5_000);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!message) return null;
  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border bg-card p-4 text-sm shadow-lg"
    >
      {message}
    </div>
  );
}
