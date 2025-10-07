'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';

export default function ThemeToggle() {
  // Default to 'dark' and update after component mounts
  const [theme, setTheme] = useState('dark');

  // On mount, check for saved theme in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  // Render a button to toggle the theme
  return (
    <Button onClick={toggleTheme} variant="primary">
      {theme === 'dark' ? '🌞' : '🌙'}
    </Button>
  );
}
