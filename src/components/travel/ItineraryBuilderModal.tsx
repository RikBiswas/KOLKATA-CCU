import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, Footprints, Train, Utensils, Download, Copy, Check, Sparkles, MapPin, X, Loader2 } from 'lucide-react';
import { travelData } from '../../config/travel.config';
import { downloadItineraryPDF } from '../../utils/pdfGenerator';

interface ItineraryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ItineraryBuilderModal: React.FC<ItineraryBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [duration, setDuration] = useState<'half-day' | 'full-day' | 'three-day'>('full-day');
  const [pace, setPace] = useState<'walking' | 'transit' | 'foodie'>('walking');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Plan generation logic based on user preferences
  const getPlanDetails = () => {
    if (duration === 'half-day') {
      if (pace === 'foodie') {
        return {
          title: 'Half-Day Calcutta Gastronomy Sprint (4 Hours)',
          timeEstimate: '8:00 AM – 1:00 PM',
          budget: '₹350 – ₹600 per traveler',
          stops: [
            { time: '08:00 AM', spot: 'Tiretta Bazaar (Old Chinatown)', note: 'Steamed pork/chicken momos, fish ball soup & prawn wafers' },
            { time: '10:00 AM', spot: 'College Street & Indian Coffee House', note: 'Cold coffee with cream, infused mutton cutlet, second-hand books' },
            { time: '11:45 AM', spot: 'Girish Chandra Dey & Nakur Chandra Nandy', note: 'Warm Jalbhara Sandesh & Mousumi Sandesh fresh from brass tray' },
            { time: '12:45 PM', spot: 'Vivekananda Park or Russell Street Puchka', note: 'Kashmiri puchka with mint gandharaj curd' },
          ],
          transitTips: 'Take Green Line underwater metro to Sealdah, then auto-rickshaw to College Street.',
        };
      } else if (pace === 'transit') {
        return {
          title: 'Hooghly Water & Heritage Tramway Loop (4 Hours)',
          timeEstimate: '3:00 PM – 7:30 PM',
          budget: '₹120 – ₹250 (Ferry & Tram passes)',
          stops: [
            { time: '03:15 PM', spot: 'Esplanade Tram Depot', note: 'Board vintage green electric tram along the Maidan meadows' },
            { time: '04:30 PM', spot: 'Princep Ghat & Strand Road', note: 'Gothic Palladian monument & river bank breeze' },
            { time: '05:45 PM', spot: 'River Ferry across the Hooghly', note: 'Take ₹6 public river launch toward Howrah under the bridge silhouette' },
            { time: '07:00 PM', spot: 'Mallick Ghat Flower Market', note: 'Asia’s largest wholesale marigold & lotus flower river market' },
          ],
          transitTips: 'Use Metro Blue Line from Esplanade to Maidan, then board Tram 24/29.',
        };
      } else {
        return {
          title: 'White City Colonial Core Walking Trail (4 Hours)',
          timeEstimate: '7:30 AM – 11:30 AM',
          budget: '₹80 – ₹200 (Heritage permits & chai)',
          stops: [
            { time: '07:30 AM', spot: 'St. John’s Churchyard & Charnock Mausoleum', note: 'Johann Zoffany’s "The Last Supper" painting and peaceful quad' },
            { time: '08:45 AM', spot: 'Writers’ Building & Lal Dighi', note: 'Greco-Roman terracotta facades overlooking the freshwater tank' },
            { time: '10:00 AM', spot: 'General Post Office (GPO) Brass Rotunda', note: 'Magnificent Ionic colonnade and Black Hole memorial plaque' },
            { time: '11:00 AM', spot: 'St. Paul’s Cathedral & Victoria North Gate', note: 'Indo-Gothic stained-glass windows by Sir Edward Burne-Jones' },
          ],
          transitTips: 'Start from Central Metro Station (Gate 4), walk south along Council House Street.',
        };
      }
    } else if (duration === 'full-day') {
      if (pace === 'foodie') {
        return {
          title: 'From Dawn Momos to Nizam’s Rolls: Full-Day Calcutta Foodie Pilgrimage',
          timeEstimate: '7:00 AM – 9:30 PM',
          budget: '₹800 – ₹1,400',
          stops: [
            { time: '07:00 AM', spot: 'Tiretta Bazaar Chinatown Street Breakfast', note: 'Baozi, soup dumplings, and sweet sesame balls' },
            { time: '09:30 AM', spot: 'College Street Dilkhusha Cabin & Coffee House', note: 'Kabiraji cutlet with spicy kasundi mustard' },
            { time: '01:00 PM', spot: 'Arsalan or Royal India Hotel (Chitpur)', note: 'Awadhi Kolkata mutton biryani with potato & Chaap' },
            { time: '04:00 PM', spot: 'Nahoum & Sons, New Market', note: '1902 Jewish bakery: Rich fruit cake & lemon puffs' },
            { time: '06:00 PM', spot: 'Princep Ghat Clay Pot Chai Stall', note: 'Ginger masala doodh cha with hot singara by the river' },
            { time: '08:30 PM', spot: 'Nizam’s or Kusum Rolls on Park Street', note: 'Original 1932 kathi roll wrapped in layered flaky paratha' },
          ],
          transitTips: 'Combine Metro Line 1 with brief walking segments. Save river ferry for sunset.',
        };
      } else if (pace === 'transit') {
        return {
          title: 'Vintage Transit Expedition: 1873 Trams, Underwater Metro & Hooghly Ferry Cruising',
          timeEstimate: '8:00 AM – 8:30 PM',
          budget: '₹220 – ₹480 (Tram passes, Metro tokens & Ferry fares)',
          stops: [
            { time: '08:00 AM', spot: 'Esplanade Tram Concourse to Maidan Loop', note: 'Board wooden electric Tram Route 24/29 gliding across green Maidan tracks' },
            { time: '10:30 AM', spot: 'Green Line Underwater Metro to Howrah Station', note: 'Experience India’s deepest underwater metro cruising 32m beneath the Hooghly riverbed' },
            { time: '12:45 PM', spot: 'Classic Yellow Ambassador Cab to College Street', note: 'Iconic yellow taxi ride through Central Avenue’s historic tram overhead wire web' },
            { time: '03:15 PM', spot: 'Nonapukur Tram Workshop & Depot', note: 'Witness active heritage articulated rail coach restoration and wooden woodwork' },
            { time: '05:00 PM', spot: 'Armenian Ghat to Fairlie Ghat River Launch', note: 'Scenic ₹6 sunset passenger ferry traversing right under Howrah Bridge’s cantilever span' },
            { time: '07:00 PM', spot: 'Circular Railway to Princep Ghat Promenade', note: 'Heritage riverside commuter train ride terminating beside the Palladian monument' },
          ],
          transitTips: 'Grab Metro smart tokens at Esplanade; river launches depart every 15 mins from Fairlie and Howrah Ghats.',
        };
      } else {
        return {
          title: 'Colonial Footsteps & North Calcutta Mansions: Full-Day Heritage Walking Odyssey',
          timeEstimate: '7:30 AM – 7:30 PM',
          budget: '₹350 – ₹650',
          stops: [
            { time: '07:30 AM', spot: 'B.B.D. Bagh & Lal Dighi Colonial Core', note: 'Walk through St. John’s Churchyard, Charnock Mausoleum, and the GPO Brass Rotunda' },
            { time: '10:00 AM', spot: 'Chitpur Road & Nakhoda Mosque Arcades', note: 'Kolkata’s oldest arterial road: explore century-old ittar perfumeries and wooden jharokhas' },
            { time: '12:30 PM', spot: 'Marble Palace & Jorasanko Thakurbari', note: 'Tagore family ancestral courtyards and Victorian neoclassical sculpture halls' },
            { time: '03:00 PM', spot: 'College Street Boi Para (Book Colony)', note: 'Walk among thousands of vintage wooden book stalls and second-hand paper archives' },
            { time: '05:00 PM', spot: 'Kumartuli Clay Idol Sculptors Alleys', note: 'Navigate narrow river mud lanes observing artisans shaping sacred straw and clay figures' },
            { time: '06:45 PM', spot: 'Sovabazar Rajbari Thakur Dalan', note: 'Historic 1757 palace courtyard illuminated under evening brass lanterns' },
          ],
          transitTips: '100% pedestrian-focused route through historical quarters with shaded colonnades. Wear comfortable walking shoes.',
        };
      }
    } else {
      // 3 Days Heritage
      if (pace === 'transit') {
        return {
          title: '3-Day Vintage Transit & Riverway Odyssey: Trams, Ferries, Underground Metro & Circular Rail',
          timeEstimate: '3 Full Days (Public Transit Explorer)',
          budget: '₹800 – ₹1,800 (Tokens, Passes & Launch tickets)',
          stops: [
            { time: 'Day 1: Historic Tramways & Maidan', spot: 'Esplanade Depot, Tram Route 24 through Maidan meadows, Nonapukur heritage works & Gariahat loop', note: 'Ride Asia’s oldest operating electric tram network with conductors issuing paper tickets' },
            { time: 'Day 2: The Great Hooghly Riverways', spot: 'Fairlie Ghat to Howrah Ferry, Bagbazar Ghat river launch, Dakshineswar river cruiser & Belur Math boat', note: 'Traverse the lifeline river under the soaring cantilevers of Howrah and Vidyasagar Setu bridges' },
            { time: 'Day 3: Underwater Metro & Vintage Cabs', spot: 'Green Line underwater tunnel, classic Ambassador yellow cab ride, and Circular Railway sunset loop', note: 'Experience Kolkata’s futuristic sub-river metro alongside century-old commuter transit marvels' },
          ],
          transitTips: 'Get an unlimited 3-day Metro smart card and keep small rupee change for river ferries.',
        };
      } else if (pace === 'foodie') {
        return {
          title: '3-Day Bengal Gastronomic Grand Tour: Street Stalls, Anglo-Indian Feasts & Royal Awadhi Biryani',
          timeEstimate: '3 Full Days (Culinary Immersion)',
          budget: '₹2,500 – ₹4,500',
          stops: [
            { time: 'Day 1: Street Food Icons & Old Chinatown', spot: 'Tiretta Chinese breakfast, College Street Kabiraji, Russell Street puchka & Nizam’s kathi rolls', note: 'From steaming pork baozi at 6 AM to crisp ghee paratha rolls on historic Park Street' },
            { time: 'Day 2: Colonial Tearooms & Sweetmeat Masters', spot: 'Flurys breakfast, Peter Cat chelo kebab, Girish Chandra Dey sandesh & K.C. Das rasgulla', note: 'Heritage tea room confectionery, Persian-style buttered skewers, and warm syrupy mishti' },
            { time: 'Day 3: Royal Mughlai & Bengali Feasts', spot: 'Chitpur Royal India Chaap, 6 Ballygunge Place mustard hilsa, and sweet bhapa doi adda', note: '1856 exiled Nawab Wajid Ali Shah’s fragrant biryani and authentic zamindari dining' },
          ],
          transitTips: 'Plan meals around 3 key clusters: Chinatown & Chitpur (North), Park Street (Central), and Ballygunge (South).',
        };
      } else {
        return {
          title: '3-Day Calcutta Walking Pilgrimage: Rajbari Mansions, Dalhousie Core & Heritage Ghats',
          timeEstimate: '3 Full Days (Pedestrian Pace)',
          budget: '₹1,200 – ₹2,500',
          stops: [
            { time: 'Day 1: North Kolkata Rajbari Trail', spot: 'Sovabazar Rajbari, Kumartuli, Jorasanko Thakurbari & Chitpur Road', note: 'Centuries-old thakur dalans, clay artisans, and vintage mansions' },
            { time: 'Day 2: Riverfront & Colonial Core', spot: 'B.B.D. Bagh, St. John’s Church, Howrah Bridge, Armenian Ghat & Victoria Memorial Grounds', note: 'The historical seat of the British Raj, neoclassical architecture, and sacred Ganges ghats' },
            { time: 'Day 3: South Kolkata, Gastronomy & Artisans', spot: 'Kalighat Temple lanes, South Park Street Cemetery, Bhowanipore heritage houses & Park Street', note: 'Atmospheric tombs, terracotta textiles, and grand colonial dining' },
          ],
          transitTips: 'Cover 8–12 km daily on foot along shaded pavements and verandahs. Use early morning hours before traffic peaks.',
        };
      }
    }
  };

  const plan = getPlanDetails();

  const handleCopyPlan = () => {
    const text = `
=== ${plan.title} ===
Duration & Timing: ${plan.timeEstimate}
Estimated Budget: ${plan.budget}
Transit Recommendations: ${plan.transitTips}

SCHEDULE:
${plan.stops.map((s) => `• ${s.time} — ${s.spot}\n  Notes: ${s.note}`).join('\n\n')}

Curated with love by WANDER CCU (https://wanderccu.local)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      downloadItineraryPDF(plan, { duration, pace });
    } catch (err) {
      console.error('Failed to generate Itinerary PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FFF8EF] rounded-3xl border-2 border-[#E8D5C2] shadow-[0_24px_60px_rgba(53,30,26,0.25)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with archival deckle border */}
        <div className="p-3.5 sm:p-5 bg-[#F7EBDD] border-b border-[#E8D5C2] flex items-start justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C6532B]" />
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-[#C6532B]">
                Interactive Itinerary Planner
              </span>
            </div>
            <h3 id="itinerary-modal-title" className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A]">
              Design Your Day in Kolkata
            </h3>
            <p className="font-sans text-[11px] sm:text-xs text-[#351E1A]/80">
              Customize duration and pacing to generate a verified, self-guided route.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A]/70 hover:text-[#351E1A] flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Close itinerary planner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Controls: Duration Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-[#582822] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C6532B]" />
              <span>1. How much time do you have?</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {[
                { id: 'half-day', label: 'Half Day', sub: '4 Hours' },
                { id: 'full-day', label: '1 Full Day', sub: '8–12 Hours' },
                { id: 'three-day', label: '3 Days', sub: 'Deep Heritage' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDuration(opt.id as typeof duration)}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer ${
                    duration === opt.id
                      ? 'bg-[#351E1A] text-[#FFF8EF] border-[#351E1A] shadow-xs'
                      : 'bg-[#FFF8EF] text-[#351E1A] border-[#E8D5C2] hover:bg-[#F7EBDD]'
                  }`}
                >
                  <p className="font-serif font-bold text-[11px] sm:text-sm">{opt.label}</p>
                  <p className={`text-[9px] sm:text-[10px] font-sans ${duration === opt.id ? 'text-[#D9A38E]' : 'text-[#351E1A]/60'}`}>
                    {opt.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Pace & Style Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold text-[#582822] flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-[#C6532B]" />
              <span>2. Choose your preferred exploration pace:</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {[
                { id: 'walking', label: 'Walking', icon: <Footprints className="w-3.5 h-3.5" /> },
                { id: 'transit', label: 'Transit', icon: <Train className="w-3.5 h-3.5" /> },
                { id: 'foodie', label: 'Foodie', icon: <Utensils className="w-3.5 h-3.5" /> },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPace(opt.id as typeof pace)}
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all flex flex-col gap-0.5 sm:gap-1 cursor-pointer items-start ${
                    pace === opt.id
                      ? 'bg-[#C6532B] text-[#FFF8EF] border-[#C6532B] shadow-xs'
                      : 'bg-[#FFF8EF] text-[#351E1A] border-[#E8D5C2] hover:bg-[#F7EBDD]'
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {opt.icon}
                    <span className="font-serif font-bold text-[11px] sm:text-xs">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generated Itinerary Card */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-3 sm:space-y-4">
            <div className="border-b border-[#E8D5C2] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6532B] font-bold">
                Tailored Recommendation
              </span>
              <h4 className="font-serif text-lg font-bold text-[#351E1A] mt-0.5">
                {plan.title}
              </h4>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] font-sans text-[#351E1A]/80">
                <span>⏱ {plan.timeEstimate}</span>
                <span>&bull;</span>
                <span>💰 {plan.budget}</span>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-3">
              {plan.stops.map((stop, i) => (
                <div key={i} className="flex items-start gap-3 text-xs font-sans">
                  <div className="w-16 shrink-0 font-mono font-bold text-[#582822] text-[11px] pt-0.5">
                    {stop.time}
                  </div>
                  <div className="flex-1 pb-2 border-b border-[#E8D5C2]/50 last:border-0">
                    <p className="font-serif font-bold text-sm text-[#351E1A]">{stop.spot}</p>
                    <p className="text-[#351E1A]/70 text-[11px] mt-0.5 leading-relaxed">{stop.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#FFF8EF] border border-[#E8D5C2] text-[11px] font-sans text-[#582822]">
              <strong>Transit Tip:</strong> {plan.transitTips}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3.5 sm:p-5 bg-[#F7EBDD] border-t border-[#E8D5C2] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <button
            onClick={onClose}
            className="py-2 text-xs font-sans font-semibold text-[#351E1A]/70 hover:text-[#351E1A] cursor-pointer text-center sm:text-left"
          >
            Close
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-full border border-[#C5A25A] bg-[#FFF8EF] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
              title="Download neat, structured day plan as PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 text-[#C6532B] animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#C6532B]" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download Plan (PDF)'}</span>
            </button>

            <button
              onClick={handleCopyPlan}
              className="px-5 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C5A25A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Plan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
