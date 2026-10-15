import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, CloudSun, Compass, Sparkles } from 'lucide-react';

export const CalcuttaTimeWatcher: React.FC = () => {
  const [kolkataTime, setKolkataTime] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [bengaliDigits, setBengaliDigits] = useState<string>('');

  const toBengaliNumerals = (str: string) => {
    const bengaliMap: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
      ':': ':',
    };
    return str.split('').map((char) => bengaliMap[char] || char).join('');
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate IST time (UTC+5:30)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '00';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'PM';

      const timeStr = `${hour}:${minute}`;
      setKolkataTime(timeStr);
      setPeriod(dayPeriod);
      setBengaliDigits(toBengaliNumerals(timeStr));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/95 border border-[#C5A25A]/60 shadow-[0_4px_16px_rgba(197,162,90,0.15)] text-xs font-sans text-[#351E1A] backdrop-blur-md">
      {/* Brass Dial Emblem */}
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C5A25A] to-[#8E6C2E] flex items-center justify-center shadow-inner shrink-0">
        <Clock className="w-3 h-3 text-[#FFF8EF]" />
      </div>

      {/* Kolkata Time */}
      <div className="flex items-baseline gap-1">
        <span className="font-mono font-bold text-xs tracking-wider text-[#351E1A]">
          {kolkataTime || '05:30'}
        </span>
        <span className="text-[10px] font-sans font-semibold text-[#C6532B]">
          {period || 'IST'}
        </span>
        <span className="font-bengali text-[11px] text-[#582822]/70 ml-0.5 hidden md:inline">
          ({bengaliDigits})
        </span>
      </div>

      <span className="text-[#E8D5C2] hidden sm:inline">&bull;</span>

      {/* Golden Hour / Sunset window alert */}
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#582822]">
        <Sunset className="w-3.5 h-3.5 text-[#C6532B] animate-pulse" />
        <span className="font-serif italic">
          Golden Hour: <strong>4:45 &ndash; 5:40 PM</strong>
        </span>
      </div>

      <span className="text-[#E8D5C2] hidden lg:inline">&bull;</span>

      {/* Weather */}
      <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#351E1A]/80">
        <CloudSun className="w-3.5 h-3.5 text-[#C5A25A]" />
        <span>Kolkata 28&deg;C &bull; Gentle River Breeze</span>
      </div>
    </div>
  );
};
