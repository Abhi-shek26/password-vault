'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Slider from '../ui/Slider';
import Button from '../ui/Button';
import { useClipboard } from '../../lib/hooks/useClipboard';

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [password, setPassword] = useState('');
  
  const generatePassword = useCallback(() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbersChars = '0123456789';
    const symbolsChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const lookAlikeRegex = /[O0Il]/g;

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
  const { isCopied, copy } = useClipboard({ onCopyEnd: generatePassword });

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <pre className="flex-grow p-3 bg-gray-900 text-green-400 rounded-md font-mono text-lg overflow-x-auto break-all">
          {password}
        </pre>
        {/* The onClick handler is now just a direct call to the hook's copy function. */}
        <Button onClick={() => copy(password)} disabled={isCopied}>
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-white">
          <label>Password Length</label>
          <span className="font-bold">{length}</span>
        </div>
        
        <Slider min={8} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value, 10))} />
        
        <div className="flex flex-col gap-3 text-gray-300">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
              Include Numbers (e.g. 123456)
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
              Include Symbols (e.g. @#$%)
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={excludeLookAlikes} onChange={() => setExcludeLookAlikes(!excludeLookAlikes)} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
              Exclude Look-Alikes (O, 0, I, l)
            </label>
        </div>
        <Button onClick={generatePassword} className="w-full !mt-6">
          Generate New Password
        </Button>
      </div>
    </div>
  );
}
