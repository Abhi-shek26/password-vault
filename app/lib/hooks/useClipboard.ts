'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
interface UseClipboardOptions {
  timeout?: number;
  onCopyEnd?: () => void;
}

export function useClipboard({ timeout = 15000, onCopyEnd }: UseClipboardOptions = {}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback((text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
      
      setIsCopied(true);

      copyTimeout.current = setTimeout(() => {
        setIsCopied(false);
        if (onCopyEnd) {
          onCopyEnd();
        }
      }, timeout);
    });
  }, [timeout, onCopyEnd]);
  
  useEffect(() => {
    return () => {
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
    };
  }, []);

  return { isCopied, copy };
}
