'use client';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import CSS của AOS
import { useEffect } from 'react';

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 0,
    });
  }, []);

  return null;
};
