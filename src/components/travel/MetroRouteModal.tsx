import React, { useState, useEffect } from 'react';
import { X, Clock, Train, MapPin, ArrowRight, Compass, Search, AlertCircle, Sparkles, Navigation, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TransitRoute } from '../../types/travel';

interface MetroRouteModalProps {
  route: TransitRoute | null;
  transitModeName: string;
  onClose: () => void;
}

export const MetroRouteModal: React.FC<MetroRouteModalProps> = ({
  route,
  transitModeName,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'timings' | 'guide'>('stations');
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!route) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [route, onClose]);

  if (!route) return null;

  const stations = route.stations || [];
  const timings = route.timings;
  const lineColor = route.lineColor || '#C6532B';

  const filteredStations = stations.filter((st) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.name.toLowerCase().includes(q) ||
      (st.bengaliName && st.bengaliName.includes(q)) ||
      (st.landmark && st.landmark.toLowerCase().includes(q)) ||
      (st.interchangeWith && st.interchangeWith.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#351E1A]/75 backdrop-blur-sm"
        />

        {/* Modal Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-3xl bg-[#FFF8EF] rounded-3xl shadow-[0_25px_60px_rgba(53,30,26,0.35)] border border-[#E8D5C2] overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
        >
          {/* Top Line Color Banner */}
          <div
            className="h-2.5 w-full shrink-0"
            style={{ backgroundColor: lineColor }}
          />

          {/* Modal Header */}
          <div className="p-5 sm:p-7 border-b border-[#E8D5C2] bg-[#FFF8EF] shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-mono font-bold text-white shadow-xs"
                    style={{ backgroundColor: lineColor }}
                  >
                    {route.name}
                  </span>
                  <span className="text-xs font-mono text-[#351E1A]/60 uppercase tracking-wider">
                    {transitModeName}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A] leading-snug">
                  <span dangerouslySetInnerHTML={{ __html: route.stops }} />
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
                  {route.note}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F7EBDD] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#351E1A] hover:text-[#FFF8EF] flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-90"
                aria-label="Close metro line modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
              <div className="p-2.5 rounded-xl bg-[#F7EBDD]/80 border border-[#E8D5C2] text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#351E1A]/60 block font-semibold">
                  Total Stations
                </span>
                <span className="text-sm font-sans font-bold text-[#351E1A]">
                  {stations.length} Stops
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7EBDD]/80 border border-[#E8D5C2] text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#351E1A]/60 block font-semibold">
                  Peak Frequency
                </span>
                <span className="text-sm font-sans font-bold text-[#C6532B]">
                  {timings?.peakFrequency || 'Every 5–7 mins'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7EBDD]/80 border border-[#E8D5C2] text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#351E1A]/60 block font-semibold">
                  Operating Hours
                </span>
                <span className="text-sm font-sans font-bold text-[#351E1A]">
                  {route.operatingHours || '06:45 AM – 10:00 PM'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7EBDD]/80 border border-[#E8D5C2] text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#351E1A]/60 block font-semibold">
                  Fare Range
                </span>
                <span className="text-sm font-sans font-bold text-[#582822]">
                  {route.fareInfo || '₹5 – ₹30'}
                </span>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div className="flex items-center gap-2 mt-5 border-b border-[#E8D5C2]/60 pb-1">
              <button
                onClick={() => setActiveTab('stations')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'stations'
                    ? 'bg-[#351E1A] text-[#FFF8EF] shadow-xs'
                    : 'bg-[#F7EBDD] text-[#351E1A]/75 hover:bg-[#E8D5C2]'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Station List ({stations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('timings')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'timings'
                    ? 'bg-[#351E1A] text-[#FFF8EF] shadow-xs'
                    : 'bg-[#F7EBDD] text-[#351E1A]/75 hover:bg-[#E8D5C2]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Train Timings</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'guide'
                    ? 'bg-[#351E1A] text-[#FFF8EF] shadow-xs'
                    : 'bg-[#F7EBDD] text-[#351E1A]/75 hover:bg-[#E8D5C2]'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Tips &amp; Ticketing</span>
              </button>
            </div>
          </div>

          {/* Modal Body Content (Scrollable) */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: STATIONS & INTERCHANGES */}
            {activeTab === 'stations' && (
              <div className="space-y-4">
                {/* Station Search Input */}
                {stations.length > 5 && (
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#351E1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search station name, landmark, or interchange..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-hidden focus:border-[#C6532B] transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[11px] font-mono text-[#C6532B] absolute right-3.5 top-1/2 -translate-y-1/2 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}

                {/* Stations Timeline */}
                <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:rounded-full before:bg-[#E8D5C2]">
                  {filteredStations.map((st, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className="absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 border-[#FFF8EF] shadow-xs flex items-center justify-center transition-transform group-hover:scale-125"
                        style={{ backgroundColor: st.isInterchange ? '#C6532B' : lineColor }}
                      >
                        {st.isInterchange && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Station Box */}
                      <div
                        className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                          st.isInterchange
                            ? 'bg-[#FFF8EF] border-[#C6532B]/50 shadow-xs'
                            : 'bg-[#F7EBDD]/60 border-[#E8D5C2] hover:bg-[#F7EBDD]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#351E1A]/40 w-5">
                              {idx + 1}.
                            </span>
                            <span className="font-serif text-base font-bold text-[#351E1A]">
                              {st.name}
                            </span>
                            {st.bengaliName && (
                              <span className="font-bengali text-xs font-medium text-[#582822]">
                                {st.bengaliName}
                              </span>
                            )}
                          </div>

                          {/* Interchange Badge */}
                          {st.isInterchange && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#C6532B]/15 text-[#C6532B] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                              <Navigation className="w-2.5 h-2.5" />
                              <span>Interchange: {st.interchangeWith}</span>
                            </span>
                          )}
                        </div>

                        {/* Landmark / Highlights */}
                        {st.landmark && (
                          <div className="mt-1.5 text-[11px] font-sans text-[#351E1A]/70 flex items-center gap-1.5 pl-7">
                            <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
                            <span>{st.landmark}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredStations.length === 0 && (
                    <div className="p-8 text-center text-xs font-sans text-[#351E1A]/60">
                      No stations found matching &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TIMINGS & FREQUENCIES */}
            {activeTab === 'timings' && (
              <div className="space-y-6">
                {/* First and Last Trains Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Direction A */}
                  <div className="p-5 rounded-2xl bg-[#F7EBDD]/80 border border-[#E8D5C2] space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5C2]">
                      <Train className="w-4 h-4 text-[#C6532B]" />
                      <h4 className="font-serif text-sm font-bold text-[#351E1A]">
                        From {timings?.terminalA || 'Terminal 1'}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-[#351E1A]/70">First Train Departure:</span>
                      <span className="font-mono font-bold text-[#C6532B] bg-[#FFF8EF] px-2 py-0.5 rounded-md border border-[#E8D5C2]">
                        {timings?.firstTrainA || '06:50 AM'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-[#351E1A]/70">Last Train Departure:</span>
                      <span className="font-mono font-bold text-[#351E1A] bg-[#FFF8EF] px-2 py-0.5 rounded-md border border-[#E8D5C2]">
                        {timings?.lastTrainA || '09:40 PM'}
                      </span>
                    </div>
                  </div>

                  {/* Direction B */}
                  <div className="p-5 rounded-2xl bg-[#F7EBDD]/80 border border-[#E8D5C2] space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E8D5C2]">
                      <Train className="w-4 h-4 text-[#C6532B]" />
                      <h4 className="font-serif text-sm font-bold text-[#351E1A]">
                        From {timings?.terminalB || 'Terminal 2'}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-[#351E1A]/70">First Train Departure:</span>
                      <span className="font-mono font-bold text-[#C6532B] bg-[#FFF8EF] px-2 py-0.5 rounded-md border border-[#E8D5C2]">
                        {timings?.firstTrainB || '06:50 AM'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="text-[#351E1A]/70">Last Train Departure:</span>
                      <span className="font-mono font-bold text-[#351E1A] bg-[#FFF8EF] px-2 py-0.5 rounded-md border border-[#E8D5C2]">
                        {timings?.lastTrainB || '09:30 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frequency Intervals */}
                <div className="p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#351E1A] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#582822]" />
                    <span>Train Frequency Schedule</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-[#F7EBDD]/60 border border-[#E8D5C2]">
                      <span className="font-bold text-[#351E1A] block mb-1">
                        Peak Rush Hours (09:00 AM – 11:30 AM &amp; 05:00 PM – 08:00 PM)
                      </span>
                      <span className="text-[#C6532B] font-mono font-bold">
                        {timings?.peakFrequency || 'Every 5 to 6 minutes'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F7EBDD]/60 border border-[#E8D5C2]">
                      <span className="font-bold text-[#351E1A] block mb-1">
                        Off-Peak Hours (Midday &amp; Late Night)
                      </span>
                      <span className="text-[#582822] font-mono font-bold">
                        {timings?.offPeakFrequency || 'Every 8 to 12 minutes'}
                      </span>
                    </div>
                  </div>

                  {/* Sunday Timing Alert */}
                  <div className="mt-2 p-3.5 rounded-xl bg-[#582822]/10 border border-[#582822]/20 flex items-start gap-2.5 text-xs text-[#582822]">
                    <AlertCircle className="w-4 h-4 text-[#582822] shrink-0 mt-0.5" />
                    <span>
                      <strong>Sunday &amp; Gazetted Holidays:</strong>{' '}
                      {timings?.sundayTimings || 'Services commence at 09:00 AM with 10–15 minute intervals throughout the afternoon.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMMUTER TIPS & TICKETING */}
            {activeTab === 'guide' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#351E1A] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C6532B]" />
                    <span>Smart Ticketing &amp; Token Protocols</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-sans text-[#351E1A]/80 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B] shrink-0 mt-1.5" />
                      <span>
                        <strong>Smart Contactless Tokens:</strong> Buy single journey RFID tokens at automated vending kiosks or manned booking windows. Tap on the sensor gate upon entry, and deposit the token into the gate slot upon exit.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B] shrink-0 mt-1.5" />
                      <span>
                        <strong>Kolkata Metro Smart Card:</strong> If staying for multiple days, purchase a rechargeable Smart Card (₹100 refundable deposit + travel credit) to save 10% on every ride and skip all ticket counter queues.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B] shrink-0 mt-1.5" />
                      <span>
                        <strong>QR Ticketing via UTS Mobile App:</strong> Digital QR tickets can also be booked on the Indian Railways UTS application.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Key Highlights */}
                {route.highlights && route.highlights.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] space-y-3">
                    <h4 className="font-serif text-sm font-bold text-[#351E1A] flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#582822]" />
                      <span>Route Highlights &amp; Curiosities</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                      {route.highlights.map((hl, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#F7EBDD]/50 border border-[#E8D5C2] flex items-start gap-2">
                          <span className="text-[#C6532B] font-bold">&bull;</span>
                          <span className="text-[#351E1A]/85 leading-relaxed">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-[#E8D5C2] bg-[#F7EBDD]/50 flex items-center justify-between gap-4 shrink-0">
            <span className="text-xs font-sans text-[#351E1A]/70">
              Kolkata Metro Rail Corporation (KMRC) &bull; Metro Railway Kolkata
            </span>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Close Codex
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
