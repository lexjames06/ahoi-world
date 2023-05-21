"use client";
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';

type Props = {
  children: React.ReactNode;
}

export default function Ahoi({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
