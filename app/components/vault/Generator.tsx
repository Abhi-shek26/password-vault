'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import { useClipboard } from '../../lib/hooks/useClipboard';

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [password, setPassword] = useState('');
  const { isCopied, copy } = useClipboard();

  const generatePassword = useCallback(() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbersChars = '0123456789';
    const symbolsChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const lookAlikeRegex = /[O0Il1]/g;

    let charset = letters;
    if (includeNumbers) charset += numbersChars;
    if (includeSymbols) charset += symbolsChars;

    if (excludeLookAlikes) {
      charset = charset.replace(lookAlikeRegex, '');
    }
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  }, [length, includeNumbers, includeSymbols, excludeLookAlikes]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-mono text-green-400 break-all">{password}</span>
        <Button onClick={() => copy(password)}>
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label>Password Length</label>
          <span className="font-bold">{length}</span>
        </div>
        <Slider min={8} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value))} />
        
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
              Include Numbers (e.g. 123456)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
              Include Symbols (e.g. @#$%)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={excludeLookAlikes} onChange={() => setExcludeLookAlikes(!excludeLookAlikes)} />
              Exclude Look-Alikes (O, 0, I, l, 1)
            </label>
        </div>
        <Button onClick={generatePassword} className="w-full">
          Generate New Password
        </Button>
      </div>
    </div>
  );
}
