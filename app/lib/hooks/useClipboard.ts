'use client';

import { useState, useCallback, useEffect } from 'react';

export function useClipboard(timeout = 15000) { // Timeout set to 15 seconds
  const [isCopied, setIsCopied] = useState(false);
  let copyTimeout: NodeJS.Timeout | null = null;

  const copy = useCallback((text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }

      copyTimeout = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  }, [timeout]);
  
  useEffect(() => {
    return () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };
  }, [copyTimeout]);

  return { isCopied, copy };
}
