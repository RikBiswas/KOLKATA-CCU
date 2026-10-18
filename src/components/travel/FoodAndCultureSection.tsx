import React, { useState, useEffect, useRef } from 'react';
import { Utensils, MapPin, ChevronLeft, ChevronRight, Sparkles, Compass, Play, Pause, Search, LayoutGrid, X, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { CulinaryDetailModal } from './CulinaryDetailModal';

interface FoodAndCultureSectionProps {
  onExploreFoodTrail?: () => void;
  onBookmarkCulinary?: (item: CulinaryItem) => void;
  isBookmarked?: (id: string) => boolean;
}

export interface CulinaryItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  region: 'all' | 'north' | 'central' | 'south' | 'sweets' | 'east' | 'outer' | string;
  regionLabel: string;
  category?: 'cabins-fries' | 'mughlai-biryani' | 'street-bites' | 'sweets-desserts' | 'tea-breakfast' | string;
  categories?: string[];
  timing: string;
  description: string;
  quote: string;
  tag: string;
  image: string;
  bengaliTitle?: string;
  priceRange?: string;
  heritageLore?: string;
  famousStalls?: { name: string; address: string; landmark?: string; mapUrl?: string }[];
  signatureItems?: string[];
  nativeTips?: string[];
  transitGuide?: string;
  atmosphere?: string;
}

const ITEMS_PER_PAGE = 4;

const STORY_CATEGORIES: Record<string, string[]> = {
  'puchka-alchemy': ['street-bites', 'fast-food-restaurant', 'bengali-restaurant'],
  'kathi-rolls-nizam': ['street-bites', 'fast-food-restaurant', 'mughlai-restaurant', 'indian-restaurant'],
  'dacres-lane-stew': ['cabins-fries', 'bistro', 'continental-restaurant', 'fast-food-restaurant'],
  'mitra-cafe-kabiraji': ['cabins-fries', 'bengali-restaurant', 'fast-food-restaurant', 'indian-restaurant'],
  'awadhi-calcutta-biryani': ['mughlai-biryani', 'biryani-restaurant', 'mughlai-restaurant', 'indian-restaurant'],
  'anadi-cabin-mughlai': ['cabins-fries', 'mughlai-restaurant', 'fast-food-restaurant', 'indian-restaurant'],
  'college-st-coffee-house': ['tea-breakfast', 'cafe', 'coffee-shop', 'bistro'],
  'paramount-daab-sarbat': ['tea-breakfast', 'cafe', 'dessert-restaurant', 'fast-food-restaurant'],
  'putiram-hing-kochuri': ['tea-breakfast', 'north-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
  'jhalmuri-telebhaja': ['street-bites', 'fast-food-restaurant', 'bengali-restaurant'],
  'flurys-tearoom': ['sweets-desserts', 'bakery', 'cafe', 'coffee-shop', 'continental-restaurant', 'dessert-restaurant', 'bistro'],
  'amrita-mishti-doi': ['sweets-desserts', 'dessert-restaurant', 'bengali-restaurant'],
  'tiretta-chinese-breakfast': ['tea-breakfast', 'chinese-restaurant', 'asian-restaurant', 'fast-food-restaurant'],
  'golbari-kosha-mangsho': ['cabins-fries', 'bengali-restaurant', 'indian-restaurant'],
  'peter-cat-chelo-kebab': ['cabins-fries', 'continental-restaurant', 'bar-grill', 'bistro'],
  'kalika-telebhaja': ['street-bites', 'fast-food-restaurant', 'bengali-restaurant'],
  'balwant-singh-doodh-cola': ['tea-breakfast', 'coffee-shop', 'cafe', 'north-indian-restaurant', 'fast-food-restaurant'],
  'nakur-nandy-sandesh': ['sweets-desserts', 'dessert-restaurant', 'bengali-restaurant'],
  'apanjan-fish-fry': ['cabins-fries', 'bengali-restaurant', 'fast-food-restaurant'],
  'bhim-chandra-nag-ledikeni': ['sweets-desserts', 'dessert-restaurant', 'bengali-restaurant'],
  'allen-kitchen-prawn-cutlet': ['cabins-fries', 'bengali-restaurant', 'fast-food-restaurant'],
  'dilkhusha-cabin-dimer-devil': ['cabins-fries', 'bengali-restaurant', 'fast-food-restaurant'],
  'adi-haridas-modak-luchi': ['tea-breakfast', 'bengali-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
  'chhangani-club-kachori': ['street-bites', 'north-indian-restaurant', 'fast-food-restaurant', 'indian-restaurant'],
  'nahoum-sons-bakery': ['sweets-desserts', 'bakery', 'dessert-restaurant', 'cafe'],
  'mocambo-devilled-crab': ['cabins-fries', 'continental-restaurant', 'bar-grill', 'bistro', 'italian-restaurant'],
  'royal-indian-hotel-chaap': ['mughlai-biryani', 'mughlai-restaurant', 'biryani-restaurant', 'indian-restaurant', 'north-indian-restaurant'],
  'shiraz-mutton-biryani': ['mughlai-biryani', 'biryani-restaurant', 'mughlai-restaurant', 'indian-restaurant'],
  'campari-gariahhat-fish-roll': ['cabins-fries', 'fast-food-restaurant', 'bengali-restaurant'],
  'balaram-mullick-baked-rosogolla': ['sweets-desserts', 'dessert-restaurant', 'bengali-restaurant'],
  'maharaja-maharani-kachori': ['tea-breakfast', 'north-indian-restaurant', 'fast-food-restaurant', 'indian-restaurant'],
  'kasturi-kochu-pata-chingri': ['mughlai-biryani', 'bengali-restaurant', 'biryani-restaurant', 'indian-restaurant'],
  'fire-and-ice-pizzeria': ['italian-restaurant', 'pizza-restaurant', 'bistro', 'continental-restaurant'],
  'tangra-chinatown-golden-joy': ['chinese-restaurant', 'asian-restaurant', 'fast-food-restaurant', 'bar-grill'],
  'anand-restaurant-russell-st': ['south-indian-restaurant', 'indian-restaurant', 'cafe', 'fast-food-restaurant'],
  'olypub-park-street': ['pub', 'bar-grill', 'bistro', 'continental-restaurant'],
  'the-dhaba-ballygunge': ['north-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
  'roastery-coffee-house-kolkata': ['coffee-shop', 'cafe', 'bistro', 'dessert-restaurant'],
  'trincas-park-street': ['pub', 'bar-grill', 'bistro', 'continental-restaurant'],
  'someplace-else-the-park': ['pub', 'bar-grill', 'bistro'],
  'broadway-hotel-bar': ['pub', 'bistro', 'continental-restaurant'],
  'the-grid-brewery': ['pub', 'bar-grill', 'bistro', 'pizza-restaurant'],
  'fabbrica-della-pizza': ['pizza-restaurant', 'italian-restaurant', 'bistro'],
  'sorano-ho-chi-minh': ['italian-restaurant', 'bistro', 'continental-restaurant'],
  'sienna-cafe-hindustan-park': ['cafe', 'bistro', 'coffee-shop', 'continental-restaurant'],
  'eau-chew-chimney-soup': ['chinese-restaurant', 'asian-restaurant', 'fast-food-restaurant'],
  'beijing-restaurant-tangra': ['chinese-restaurant', 'asian-restaurant', 'bar-grill'],
  'banana-leaf-south-indian': ['south-indian-restaurant', 'indian-restaurant', 'cafe'],
  'ramkrishna-lunch-home': ['south-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
  'kookie-jar-rawdon': ['bakery', 'cafe', 'dessert-restaurant', 'fast-food-restaurant'],
  'saldanha-bakery-wellesley': ['bakery', 'sweets-desserts', 'fast-food-restaurant'],
  'mrs-magpie-southern-ave': ['cafe', 'bakery', 'dessert-restaurant', 'coffee-shop'],
  'dada-boudi-biryani-barrackpore': ['biryani-restaurant', 'mughlai-biryani', 'mughlai-restaurant', 'indian-restaurant'],
  'india-restaurant-kidderpore': ['biryani-restaurant', 'mughlai-biryani', 'mughlai-restaurant', 'north-indian-restaurant'],
  'oudh-1590-deshapriya': ['mughlai-biryani', 'biryani-restaurant', 'mughlai-restaurant', 'indian-restaurant'],
  'ballygunge-place-heritage': ['bengali-restaurant', 'indian-restaurant', 'bistro'],
  'azad-hind-dhaba-ballygunge': ['north-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant', 'mughlai-restaurant'],
  'eighth-day-cafe-bakery': ['coffee-shop', 'cafe', 'bakery', 'bistro'],
};

export const FoodAndCultureSection: React.FC<FoodAndCultureSectionProps> = ({
  onExploreFoodTrail,
  onBookmarkCulinary,
  isBookmarked,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<CulinaryItem | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // User-friendly Category Browsing & Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [modalCategorySearch, setModalCategorySearch] = useState<string>('');
  const [modalGroupFilter, setModalGroupFilter] = useState<string>('all');
  const modalSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCategoryModalOpen) setIsCategoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryModalOpen]);

  const culinaryStories: CulinaryItem[] = [
    {
      id: 'puchka-alchemy',
      title: 'The Sacred Alchemy of Kolkata Puchka',
      subtitle: 'Gandharaj Lime, Roasted Cumin & Tamarind Water',
      bengaliTitle: 'কলকাতার পুঁচকা',
      location: 'Vivekananda Park & Southern Avenue',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'street-bites',
      timing: 'Best: 5:00 PM – 8:30 PM',
      priceRange: '₹30 – ₹60 for 6–8 pcs',
      description: 'Unlike generic pani puri, Kolkata puchka is an explosive craft: paper-thin semolina spheres filled with warm spiced potato mash, black chickpeas, crushed green chilies, and iced water infused with fragrant Gandharaj lemon juice.',
      heritageLore: 'Unlike Delhi Golgappa or Mumbai Pani Puri, Kolkata puchka is an explosive street craft with zero compromises. The spherical shells are made with a delicate blend of semolina (suji) and whole-wheat flour, fried until paper-thin and brittle. Inside rests warm mashed potatoes churned with soaked black gram (chhola), freshly roasted bhaja moshla (cumin, coriander, and dried red chilies roasted on cast-iron), and finely minced fiery green chilies. The crowning glory is iced water infused with fragrant Gandharaj lebu (king lime) juice, crushed mint, rock salt, and old tamarind pulp steeped for hours.',
      quote: '“One does not simply eat a puchka; one surrenders to its tart, fiery grace.”',
      tag: 'Street Gastronomy',
      image: '/images/stories/puchka.jpg',
      famousStalls: [
        { name: "Dilip Da's Puchka", address: "Vivekananda Park Gate 2, Southern Avenue", landmark: "Near Southern Avenue Lake walkway" },
        { name: "Pravesh Puchkawala", address: "1 Russell Street (Near Park Street crossing)", landmark: "Opposite Anand Restaurant" },
        { name: "Dakshinapan Stalls", address: "Gariahat Roundabout & Dakshinapan Complex", landmark: "South Kolkata shopping hub" },
        { name: "Kripanath Sen Lane Puchka", address: "Sovabazar, North Kolkata", landmark: "Near Sutanuti Ghat" }
      ],
      signatureItems: [
        'Classic Tok-Jhal Puchka with iced Gandharaj water',
        'Doi Puchka topped with thick sweetened curd, roasted cumin & sweet tamarind chutney',
        'Churmur (crushed crunchy puchka shells tossed with spicy aloo mash, lime & tamarind)'
      ],
      nativeTips: [
        'Never bite a puchka in half—pop the entire fragile sphere into your mouth in one single motion to avoid a tamarind flood!',
        'Always request "Jhal-Tok" for the fiery authentic kick, or "Misti-Tok" if you prefer a sweeter profile.',
        'The Phao Rule: When finished with your round, hold out your leaf bowl (shalpata)—the vendor will give you a complimentary dry, crisp papri loaded with spiced potato mash without water.'
      ],
      transitGuide: 'Take the Blue Line Metro to Rabindra Sarobar Station, followed by a 5-minute auto-rickshaw down Southern Avenue.',
      atmosphere: 'Vibrant evening street adda, laughter echoing under banyan trees, and the constant rhythmic crunch of crisp shells.'
    },
    {
      id: 'kathi-rolls-nizam',
      title: 'The Original Kathi Roll at Nizam’s & Kusum',
      subtitle: 'Charcoal-Grilled Kebabs Rolled in Flaky Paratha',
      bengaliTitle: 'নিজাম ও কুসুমের কাঠি রোল',
      location: 'New Market & Park Street',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'street-bites',
      timing: 'Best: 6:00 PM – 10:30 PM',
      priceRange: '₹70 – ₹180 per roll',
      description: 'Invented at Nizam’s in 1932 to let British sahibs eat kebabs without greasing their hands. Tender charcoal-skewered mutton and spiced onions wrapped in crisp egg-layered paratha.',
      heritageLore: 'In 1932, at Nizam Restaurant in the heart of British Calcutta’s New Market, office babus and British colonials loved charcoal-grilled seekh and boti kebabs. However, eating oily kebabs while hurrying to meetings stained their crisp white suits and paperwork. The head chef devised a brilliant solution: wrap tender, smoky kebabs and sliced raw red onions in a multi-layered, flaky, pan-fried paratha lined with a whisked egg. In 1964, heavy iron skewers were replaced with slender bamboo sticks ("kathi"), forever creating the global phenomenon of the Kathi Roll.',
      quote: '“The birthplace of the world’s rolls—crisp, charred, and infinitely imitated.”',
      tag: 'Iconic Street Classic',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Kolkata_Rolls.jpg/500px-Kolkata_Rolls.jpg',
      famousStalls: [
        { name: "Nizam Restaurant", address: "21, 22 Hogg Street, New Market", landmark: "Beside New Market Clock Tower (Est. 1932)" },
        { name: "Kusum Rolls", address: "21 Park Street, Karnani Mansion", landmark: "Park Street nightlife boulevard" },
        { name: "Hot Kathi Roll", address: "Park Center, 24 Park Street", landmark: "Midway through Park Street" },
        { name: "Campari", address: "Gariahat Road", landmark: "Known for giant roll platters" }
      ],
      signatureItems: [
        'Double Egg Double Mutton Kathi Roll',
        'Charcoal-Grilled Chicken Tikka & Cheese Roll',
        'Nizam Special Mutton Boti Roll in handmade ghee paratha',
        'Paneer Kathi Roll with roasted capsicum and chaat masala'
      ],
      nativeTips: [
        'Real Kolkata rolls never use mayonnaise or ketchup. Strictly say "Shudhu lebu, pyaj aar lonka" (Only lime, sliced onion, and chopped green chilies).',
        'Ask for "Porota crunchy koro" if you love a blistered, crisp outer crust.'
      ],
      transitGuide: 'Take Metro to Esplanade Station (Gate 6) and walk 3 minutes past Grand Hotel into Hogg Street.',
      atmosphere: 'Whiffs of charcoal smoke, clattering heavy iron tawas, and rolls wrapped lightning-fast in greaseproof wax paper.'
    },
    {
      id: 'dacres-lane-stew',
      title: 'Chitto Da’s Chicken Stew & Butter Toast',
      subtitle: 'The Colonial Office Alley Feasting Babu & Diplomat Alike',
      bengaliTitle: 'ডেকার্স লেনের চিকেন স্টু',
      location: 'Dacres Lane (James Hickey Sarani)',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 12:30 PM – 3:30 PM Lunch',
      priceRange: '₹80 – ₹170 per meal',
      description: 'Since colonial times, Dacres Lane has fed Kolkata’s Secretariat. Chitto Da’s aromatic, hearty pepper-spiced chicken stew with thick slices of butter-toasted pav and fish roll is a rite of passage.',
      heritageLore: 'James Hickey Sarani—universally known as Dacres Lane after Philip Milner Dacres, British Collector of Calcutta in the 1770s—is a narrow cobblestone culinary corridor where class hierarchies vanish. Since the 19th century, Writers’ Building secretaries, high court barristers, tram conductors, and diplomats have sat shoulder-to-shoulder on wooden benches. Chitto Da’s famous Chicken Stew is a legendary Anglo-Indian comfort broth: light, peppery, simmered for hours with chunky carrots, papaya, whole baby potatoes, and clove-spiced chicken, accompanied by thick slices of butter-toasted loaf bread.',
      quote: '“A narrow colonial lane where high court judges and tram conductors share the same bench.”',
      tag: 'Secretariat Heritage',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Chittobaburdokan.jpg/500px-Chittobaburdokan.jpg',
      famousStalls: [
        { name: "Chitto Babur Dokan", address: "13 James Hickey Sarani (Dacres Lane)", landmark: "Beside Peerless Inn Hotel" },
        { name: "Suruchee Restora", address: "Dacres Lane mid-corridor", landmark: "Opposite Calcutta Secretariat back exit" },
        { name: "Apanjan Fish Stall", address: "Dacres Lane Corner", landmark: "Famous for Diamond Fish Fry" }
      ],
      signatureItems: [
        'Chitto Da’s Chicken Stew with Two Slices of Butter Toast',
        'Kolkata Diamond Bhetki Fish Fry with fiery Kasundi mustard',
        'Mutton Rezala and Luchi breakfast platters'
      ],
      nativeTips: [
        'Arrive between 12:45 PM and 2:00 PM to catch the stew piping hot from the massive aluminum degchis.',
        'Dip the warm butter-soaked toast directly into the aromatic pepper broth for the definitive Calcuttan secret.'
      ],
      transitGuide: 'Alight at Chandni Chowk or Esplanade Metro, walk 200m towards the Waterloo Street crossing.',
      atmosphere: 'Fast-paced, colonial secretariat bustle with steaming ladles and lively office adda.'
    },
    {
      id: 'mitra-cafe-kabiraji',
      title: 'Diamond Fish Kabiraji Cutlet',
      subtitle: 'Crisp Golden Egg-Lace Net Enclosing Tender Bhetki',
      bengaliTitle: 'মিত্র ক্যাফের কবিরাজি কাটলেট',
      location: 'Mitra Cafe, Sovabazar & Shyambazar',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 5:00 PM – 9:00 PM Evening Adda',
      priceRange: '₹140 – ₹240',
      description: 'Born in Edwardian Calcutta (from "coverage" -> Kabiraji). A tender bhetki fish fillet marinated in ginger-garlic and green chili, plunged into boiling oil wrapped in an intricate spun egg-net canopy.',
      heritageLore: 'In the late 19th and early 20th centuries, North Kolkata’s "cabins" (quaint eateries divided with wooden panels or curtains) offered discreet privacy for Indian freedom fighters and intellectuals. The word "Kabiraji" is a phonetic Bengali adaptation of the English word "Coverage". Legendary Bengali playwright Girish Chandra Ghosh and filmmaker Satyajit Ray relished this dish. A prime fillet of fresh Hooghly Bhetki fish is marinated with green chilies, ginger, and garlic, crusted in breadcrumbs, and dropped into smoking oil while a master chef whips egg yolk through outstretched fingers, creating a spinning golden lace web that completely wraps the cutlet.',
      quote: '“The delicate egg mesh crackles at first bite, yielding to fresh Hooghly bhetki.”',
      tag: 'Edwardian Cabin Craft',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG/500px-Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG',
      famousStalls: [
        { name: "Mitra Cafe (Main Branch)", address: "47 Jatindra Mohan Avenue, Sovabazar", landmark: "Directly opposite Sovabazar Metro Gate 1 (Est. 1910)" },
        { name: "Allen Kitchen", address: "40/1 Jatindra Mohan Avenue", landmark: "Famous for 130-year-old Prawn Cutlets in pure ghee" },
        { name: "Basanta Cabin", address: "53 College Street", landmark: "Opposite Presidency University (Est. 1931)" }
      ],
      signatureItems: [
        'Diamond Fish Kabiraji Cutlet (Hooghly Bhetki in spun golden egg net)',
        'Mutton Brain Chop',
        'Fowl Cutlet (heritage chicken cutlet)',
        'Mutton Kosha with Butter Pav'
      ],
      nativeTips: [
        'Kabiraji must be savored immediately while the egg mesh crackles. A 10-minute delay turns the crisp lace soggy.',
        'Lather generously with native fermented mustard (Kasundi) and thin-sliced sweet red onions.'
      ],
      transitGuide: 'Sovabazar Sutanuti Metro Station. Exit Gate 1 and walk 10 paces across the tram tracks.',
      atmosphere: 'Nostalgic wooden partitions, marble-top tables, brass ceiling fans, and vintage 1920s Calcutta ambience.'
    },
    {
      id: 'kolkata-biryani-arsalan',
      title: 'Awadhi-Calcutta Biryani with Aloo & Egg',
      subtitle: 'Wajid Ali Shah’s Saffron-Soaked Fragrant Masterpiece',
      bengaliTitle: 'কলকাতার ঐতিহ্যবাহী বিরিয়ানি',
      location: 'Park Circus, Shiraz & Arsalan',
      region: 'south',
      regionLabel: 'Central-South',
      category: 'mughlai-biryani',
      timing: 'Best: 1:00 PM Lunch & 8:30 PM Dinner',
      priceRange: '₹220 – ₹420',
      description: 'Brought to Metiabruz by the exiled Nawab of Awadh in 1856. Fragrant long-grain basmati cooked in dum with ghee, kewra, saffron, tender meat, and the legendary golden potato that absorbs every ounce of rich broth.',
      heritageLore: 'When Nawab Wajid Ali Shah of Awadh was exiled by the British in 1856 to Metiabruz, his royal bawarchis brought the refined culinary traditions of Lucknow. Contrary to the myth that potatoes were introduced due to royal bankruptcy, the potato was actually a prized exotic vegetable recently imported by Portuguese and British traders. The Nawab’s chefs discovered that the golden potato soaked up the delicate mutton broth, saffron, kewra water, and ghee far better than rice or meat alone. Today, a Kolkata biryani without its meltingly tender spiced potato is considered culinary blasphemy.',
      quote: '“In Kolkata, the potato in the biryani is sacred—often cherished even more than the meat.”',
      tag: 'Royal Heritage',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolkata_mutton_biryani.jpg/500px-Kolkata_mutton_biryani.jpg',
      famousStalls: [
        { name: "Arsalan (Park Circus Flagship)", address: "191 Marina Garden Court, Park Street & 7-Point Crossing", landmark: "Near Park Circus Maidan" },
        { name: "Shiraz Golden Restaurant", address: "135 Park Street & Mullick Bazar Crossing", landmark: "Famous for Awadhi dum cooking since 1941" },
        { name: "Royal Indian Hotel", address: "147 Rabindra Sarani, Chitpur", landmark: "Est. 1905 by the royal bawarchis of Lucknow" },
        { name: "Aminia Restaurant", address: "6A SN Banerjee Road, New Market", landmark: "Beside Kolkata Municipal Corporation" }
      ],
      signatureItems: [
        'Kolkata Special Mutton Biryani (2 succulent meat pieces, 1 golden dum potato & 1 egg)',
        'Mutton Chaap slow-cooked in rich poppy seed & charmagaz gravy',
        'Shahi Firni served chilled in unglazed earthen pots'
      ],
      nativeTips: [
        'The golden potato should be eaten with fingers; it should yield like butter without requiring a knife.',
        'Kolkata biryani is subtly scented and light—do not drown it in raita; enjoy the aromatic basmati grains on their own.'
      ],
      transitGuide: 'Take a yellow taxi to Park Circus 7-Point Crossing or take the metro to Rabindra Sadan.',
      atmosphere: 'Aromatic clouds of kewra, saffron, and ghee billowing from giant copper handis sealed with wheat dough.'
    },
    {
      id: 'anadi-cabin-mughlai',
      title: 'Anadi Cabin’s Crispy Mughlai Paratha',
      subtitle: 'Deep-Fried Flaky Paratha Stuffed with Minced Keema & Eggs',
      bengaliTitle: 'অনাদি কেবিনের মোগলাই পরোটা',
      location: 'Esplanade & Jawaharlal Nehru Road',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 4:30 PM – 9:00 PM',
      priceRange: '₹80 – ₹170',
      description: 'Operating for over a century near Esplanade, Anadi Cabin masters the Mughlai paratha: paper-thin dough folded into envelopes of spiced duck eggs, minced mutton keema, and deep-fried to crisp perfection.',
      heritageLore: 'Tucked near the historic Esplanade tram terminus, Anadi Cabin was founded in 1925 by Balaram Dey and named after his son Anadi. During the independence movement, the partitioned cabins allowed freedom fighters like Netaji Subhas Chandra Bose’s associates to hold covert discussions while savoring crispy Mughlai Parathas. The paratha is made by rolling kneaded dough into a transparent sheet, folding duck eggs, minced mutton keema, green chilies, and garam masala into a neat square envelope, and shallow-frying it to blistering golden perfection on a massive black iron tawa.',
      quote: '“Served with dry alur dom, salad, and a mustard kick that defines old Calcutta teatime.”',
      tag: 'Heritage Cabin',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Moglai_Porota.jpg/500px-Moglai_Porota.jpg',
      famousStalls: [
        { name: "Anadi Cabin", address: "9 Jawaharlal Nehru Road, Esplanade", landmark: "Opposite Metro Cinema Hall (Est. 1925)" },
        { name: "Dilkhusha Cabin", address: "88 College Street", landmark: "Near Presidency College gate" },
        { name: "Apanjan", address: "Sadananda Road, Kalighat", landmark: "South Kolkata cabin landmark" }
      ],
      signatureItems: [
        'Special Dimer Mughlai Paratha (Double Duck Egg)',
        'Mutton Keema Mughlai Paratha with rich aloo dom gravy',
        'Chicken Kosha and crisp vegetable chops'
      ],
      nativeTips: [
        'Always opt for duck egg (hasher dim) over chicken egg—it provides a far richer, creamier yolk and unmistakable flaky crust.',
        'Dip each crisp square into the dry aloor dom curry and fresh sliced cucumber-onion salad.'
      ],
      transitGuide: 'Esplanade Metro Station. Walk 2 minutes down Jawaharlal Nehru Road toward Dharmatala.',
      atmosphere: 'Old Calcutta nostalgia, wooden booths, ceiling fans, and the rhythmic sizzle of frying paratha envelopes.'
    },
    {
      id: 'coffee-house-infusion',
      title: 'Coffee House Adda & Cold Infusion',
      subtitle: 'Where Nobel Laureates & Poets Debated for Hours',
      bengaliTitle: 'কলেজ স্ট্রিট কফি হাউস',
      location: 'College Street Boi Para (Est. 1876)',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 2:00 PM – 5:30 PM',
      priceRange: '₹25 – ₹110',
      description: 'Under massive 30-foot ceilings and slowly whirring fans, generations of Calcuttans have discussed French cinema, Marxism, and modern poetry over ₹25 cups of black Infusion coffee and crisp mutton kobiraji cutlets.',
      heritageLore: 'Originally built in 1876 as Albert Hall, the College Street Coffee House has been the intellectual brain of Bengal for 150 years. Nobel Laureate Amartya Sen, filmmakers Satyajit Ray, Mrinal Sen, and Ritwik Ghatak, and poet Sunil Gangopadhyay spent entire days here engaged in passionate Adda (unstructured intellectual debate). Under towering 30-foot ceilings with whirring antique fans, waiters in white uniforms and red turbans weave between tables stacked with vintage books and steaming cups of ₹25 black coffee Infusion.',
      quote: '“The table here belongs to whoever can argue the longest.”',
      tag: 'Intellectual Lore',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTih--Ql_lON9n4I_SsPFtmX1XzqrUM_Jkibh7t4GKPaEFamaxY7cCW6Ng&s=10',
      famousStalls: [
        { name: "Indian Coffee House (Main Floor & Balcony)", address: "15 Bankim Chatterjee Street, College Street Boi Para", landmark: "Opposite Presidency University (Est. 1876)" },
        { name: "Jadavpur Coffee House", address: "84 Central Road, Jadavpur", landmark: "South Kolkata student hub" }
      ],
      signatureItems: [
        'Black Coffee Infusion (Signature ₹25 drip brewed coffee)',
        'Mutton Kobiraji Cutlet & Kasundi',
        'Chicken Afghani & Buttered Toast',
        'Cold Coffee with Cream'
      ],
      nativeTips: [
        'Sit on the upper mezzanine balcony for the best panoramic view of the animated adda tables below.',
        'Pick up a second-hand paperback book from College Street’s footpath stalls right before climbing the stairs.'
      ],
      transitGuide: 'MG Road or Central Metro Station. Or board the historic College Street electric tram.',
      atmosphere: 'Echoing debates on world cinema, literature, and politics, cigarette smoke, and the clinking of porcelain cups.'
    },
    {
      id: 'paramount-daab-sarbat',
      title: 'Paramount’s Cold Daab Sarbat & Malai',
      subtitle: 'Secret Swadeshi Rendezvous Since 1918',
      bengaliTitle: 'প্যারামাউন্টের ডাব সরবত',
      location: 'College Square & Boi Para',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 11:30 AM – 7:30 PM',
      priceRange: '₹60 – ₹140 per glass',
      description: 'Frequented by Subhas Chandra Bose and Satyajit Ray, this 100-year-old heritage sherbet shop serves its legendary Daab Sarbat—a revitalising chilled concoction of tender green coconut water, scraped malai, and secret herbal syrup.',
      heritageLore: 'Founded in 1918 by Nihar Ranjan Majumdar as "Paradise", Paramount was established with guidance from legendary scientist Acharya Prafulla Chandra Ray to create indigenous, chemical-free herbal sherbets. During British rule, it was a secret sanctuary for the revolutionary Anushilan Samiti. A discreet rear doorway allowed Netaji Subhas Chandra Bose and fellow revolutionaries to slip away into College Square whenever British police raided. The third generation still guards the proprietary blend of cold tender coconut water, scraped malai, and herbal essence.',
      quote: '“Revolutionaries planned India’s freedom right here over tumblers of iced green coconut.”',
      tag: 'Historic Sharbat',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Daab_Sharbat_-_Tender_Coconut_Drink.JPG/500px-Daab_Sharbat_-_Tender_Coconut_Drink.JPG',
      famousStalls: [
        { name: "Paramount Sherbets & Syrups", address: "1/1/1D Bankim Chatterjee Street, College Square", landmark: "Near College Square Swimming Pool (Est. 1918)" }
      ],
      signatureItems: [
        'Signature Daab Sarbat (Tender green coconut water, malai & secret herbal syrup)',
        'Cocoa Malai Sherbet (Rich chocolate-coconut cream concoction)',
        'Kaju Draksha (Cashew-grape cooling nectar)',
        'Green Mango (Aam Pora) Sherbet (Summer seasonal)'
      ],
      nativeTips: [
        'Stir the glass with the provided wooden stick so the chilled coconut malai shreds blend with the sweet herbal base.',
        'Pair your drink with an afternoon stroll around the leafy water tank of College Square.'
      ],
      transitGuide: 'Take Metro to Mahatma Gandhi Road, walk 5 minutes toward the University of Calcutta.',
      atmosphere: 'Historic wooden benches, sepia-toned framed photos of Bengali icons, and revitalizing chilled elixirs.'
    },
    {
      id: 'hing-kochuri-alur-dom',
      title: 'Hing Kochuri, Chholar Dal & Radhaballabhi',
      subtitle: 'Morning Puffed Puris with Sweet-Spicy Asafoetida Gravy',
      bengaliTitle: 'হিঙের কচুরি ও আলুর দম',
      location: 'Putiram (College St) & Mohan Bhandar',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 7:00 AM – 10:30 AM Morning',
      priceRange: '₹35 – ₹75',
      description: 'The definitive Bengali morning breakfast: piping hot club kachoris stuffed with fragrant hing (asafoetida) paste or lentil urad dal, paired with spicy alur dom, rich chholar dal with coconut bits, and syrupy jalebi.',
      heritageLore: 'The heartbeat of a traditional North Kolkata morning starts with the bubbling roar of giant iron kadais filled with boiling mustard oil. At Putiram, established in 1852 during the British Raj, generations have begun their day standing on the pavement. The Hing Kochuri features golden fried puris stuffed with an aromatic paste of asafoetida (hing) and urad dal, served on dried sal-leaf plates with spicy, dark, cumin-rich aloor dom and sweet-savory chholar dal studded with crunchy bits of fried fresh coconut.',
      quote: '“Morning in North Kolkata starts when the kadai of boiling mustard oil begins to hiss.”',
      tag: 'Traditional Breakfast',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Kachori-sabzi.jpg/500px-Kachori-sabzi.jpg',
      famousStalls: [
        { name: "Putiram Sweets", address: "12A Surya Sen Street, College Street", landmark: "Near College Street crossing (Est. 1852)" },
        { name: "Mohan Bhandar", address: "SN Banerjee Road, Esplanade", landmark: "Famous for morning Club Kachoris" },
        { name: "Bipin Behari Das", address: "Hatibagan Market, North Kolkata", landmark: "Century-old breakfast stall" },
        { name: "Tasty Corner", address: "Mandeville Gardens, Ballygunge", landmark: "South Kolkata favorite for Radhaballabhi" }
      ],
      signatureItems: [
        'Hing Kochuri with Hing-spiced Alur Dom (Sal-leaf plate serving)',
        'Radhaballabhi stuffed with spiced lentils & Chholar Dal with coconut chips',
        'Piping hot fresh Ghee Jalebi and hot baked rasgullas'
      ],
      nativeTips: [
        'Arrive between 7:30 AM and 9:30 AM before the morning batches sell out.',
        'Eat standing by the wooden counter for the authentic street breakfast experience.'
      ],
      transitGuide: 'Mahatma Gandhi Road Metro Station. Walk 4 minutes east down Surya Sen Street.',
      atmosphere: 'Morning newspaper vendors, tram bells chiming in the background, and the irresistible scent of mustard oil.'
    },
    {
      id: 'jhalmuri-telebhaja',
      title: 'Street-Corner Jhalmuri & Telebhaja Adda',
      subtitle: 'Fiery Mustard Oil Puffed Rice & Golden Beguni Fritters',
      bengaliTitle: 'ঝালমুড়ি ও তেলেভাজা',
      location: 'Gariahat, Princep Ghat & Dhiren Cabin',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'street-bites',
      timing: 'Best: 4:30 PM – 7:30 PM Sunset',
      priceRange: '₹20 – ₹45',
      description: 'Crisp puffed rice thrown into a tin can with boiled potatoes, raw coconut slices, roasted cumin, black salt, and a pungent splash of raw mustard oil. Accompanied by batter-fried beguni (eggplant) and alur chop.',
      heritageLore: 'Jhalmuri is Kolkata’s great equalizer—eaten with equal relish by college students, rickshaw pullers, and High Court judges. Inside a cylindrical tin container, crisp puffed rice (muri) is furiously shaken with boiled potato cubes, sprouted brown gram, roasted peanuts, diced raw coconut, chopped green chilies, fresh coriander, and a pungent pour of cold-pressed raw kachi ghani mustard oil. Paired with Telebhaja—thinly sliced eggplant (beguni) and spiced potato patties (alur chop) dipped in gram flour batter and deep-fried to amber crunchiness.',
      quote: '“The crackle of paper thonga bags and the unmistakable sting of cold-pressed mustard oil.”',
      tag: 'Evening Street Snack',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Chop_moori.jpg/500px-Chop_moori.jpg',
      famousStalls: [
        { name: "Princep Ghat Riverside Muri Vendors", address: "Strand Road, Hooghly riverbank", landmark: "Beside the Greco-Roman Princep Memorial" },
        { name: "Kalika Mukhorochok Telebhaja", address: "29 Surya Sen Street, College Square", landmark: "North Kolkata institution since 1965" },
        { name: "Dhiren Cabin", address: "Shobhabazar Crossing", landmark: "Famous for Mochar Chop & Beguni" },
        { name: "Dakshinapan Jhalmuri Stall", address: "Jodhpur Park / Gariahat", landmark: "South Kolkata evening hub" }
      ],
      signatureItems: [
        'Classic Special Jhalmuri in folded newspaper thonga with Gondhoraj lime',
        'Crisp Golden Beguni (sliced eggplant fritters)',
        'Mochar Chop (banana flower spiced cutlet)',
        'Aloo Chop and Piyaji (onion fritters)'
      ],
      nativeTips: [
        'Use the stiff cardboard scrap provided as an edible spoon to scoop the muri.',
        'Ask for extra "Kacha Narkol" (fresh raw coconut shavings) and "Jhal Beshi" for an eye-watering mustard kick.'
      ],
      transitGuide: 'Take the Circular Railway or yellow taxi to Princep Ghat, or take the metro to Sovabazar for Kalika.',
      atmosphere: 'Sunset breezes blowing off the Hooghly river, passing river ferries, and the rustle of newsprint paper cones.'
    },
    {
      id: 'flurys-tearoom',
      title: 'Park Street Tea Rooms & Rum Balls',
      subtitle: 'Colonial Elegance & Anglo-Indian Bakery Craft',
      bengaliTitle: 'ফ্লুরিজ টি রুম ও রাম বল',
      location: 'Park Street Boulevard (Est. 1927)',
      region: 'central',
      regionLabel: 'Park Street',
      category: 'sweets-desserts',
      timing: 'Best: 8:00 AM Breakfast / 4:00 PM High Tea',
      priceRange: '₹250 – ₹650 per person',
      description: 'Founded by Mr. and Mrs. J. Flury in 1927, this tearoom remains Kolkata’s most cherished morning ritual. Enjoy classic English breakfast platters, chocolate boat pastries, and legendary dark rum balls.',
      heritageLore: 'Founded in 1927 by Swiss expat couple Mr. Joseph and Mrs. Frieda Flury, this Park Street tearoom introduced Kolkata to European pastry making, chocolate confectionery, and English afternoon tea. Through World War II, Indian independence, and Kolkata’s swinging sixties, Flurys was the playground of royalty, British governors, and cinephiles like Satyajit Ray. Even today, Sunday morning breakfast at Flurys remains the premier Park Street tradition.',
      quote: '“A taste of 1920s Calcutta elegance preserved in every silver teapot.”',
      tag: 'Heritage Confectionery',
      image: 'https://ishitaunblogged.com/wp-content/uploads/2014/08/20140801_153531-copy.jpg?w=674',
      famousStalls: [
        { name: "Flurys Park Street (Flagship)", address: "18 Park Street, Kolkata 700071", landmark: "Opposite Stephen Court (Est. 1927)" },
        { name: "Nahoum & Sons Bakery", address: "F-20 New Market (Sir Stuart Hogg Market)", landmark: "120-year-old Jewish bakery famous for Rich Fruit Cake" }
      ],
      signatureItems: [
        'The English Breakfast (Poached/Fried eggs, bacon, sausage, baked beans, toast & grilled tomato)',
        'Signature Chocolate Boat Pastry',
        'Dark Rum Ball soaked in Jamaican rum and chocolate vermicelli',
        'First Flush Single-Estate Darjeeling Tea served in sterling silver pots'
      ],
      nativeTips: [
        'Book or arrive before 9:00 AM on weekends to skip the sidewalk waiting queue along Park Street.',
        'Grab a window table to watch morning tram cars and life unfold along the fashionable avenue.'
      ],
      transitGuide: 'Park Street Metro Station. Exit and walk 100 meters east down Park Street.',
      atmosphere: 'Plush colonial tea salon with soft piano tunes, silver teapots, and the aroma of freshly baked butter pastries.'
    },
    {
      id: 'clay-pot-mishti',
      title: 'Mishti Doi & Baked Rosogolla in Clay',
      subtitle: 'Centuries of Bengal Milk Confectionery & Nolen Gur',
      bengaliTitle: 'মাটির ভাঁড়ের মিষ্টি দই ও রসগোল্লা',
      location: 'Balaram Mullick, K.C. Das & Nakur Nandy',
      region: 'central',
      regionLabel: 'Central & Esplanade',
      category: 'sweets-desserts',
      timing: 'Best: Anytime after morning prayers',
      priceRange: '₹25 – ₹70 per piece',
      description: 'Bengal is the world capital of sweetcraft. From slow-steamed caramelised Mishti Doi served in porous earthenware pots that cool the curd naturally, to warm spongy baked Rosogolla and seasonal winter Nolen Gur Sandesh.',
      heritageLore: 'Bengal’s sweetmakers (Moyras) elevated milk curdling into an exquisite culinary science. Unlike northern India where split milk was historically considered inauspicious, Bengali artisans embraced chhana (fresh cottage cheese), giving birth to the spongy Rosogolla (perfected by Nobin Chandra Das in 1868). In unglazed red terracotta pots (bhaars), creamy buffalo milk is slow-reduced with caramelized sugar and cultured into Mishti Doi; the porous clay naturally absorbs excess whey water, creating an impossibly dense, silky caramel custard. In winter, golden date-palm jaggery (Nolen Gur) infuses Sandesh with butterscotch magic.',
      quote: '“Earthenware clay absorbs excess whey, leaving only sweet, silky perfection.”',
      tag: 'Living Tradition',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Mishti_Doi.jpg/500px-Mishti_Doi.jpg',
      famousStalls: [
        { name: "Girish Chandra Dey & Nakur Chandra Nandy", address: "56 Ramdulal Sarkar Street, Hedua", landmark: "Near Girish Park (Est. 1844, Kings of Sandesh)" },
        { name: "Balaram Mullick & Radharaman Mullick", address: "2 Jadunath Dey Road & Bhowanipore", landmark: "Pioneers of Baked Rosogolla since 1885" },
        { name: "K.C. Das Sweets", address: "11 Esplanade East", landmark: "Home of the original canned Rossogolla since 1868" },
        { name: "Chittaranjan German Mishti", address: "Shyambazar Five-Point Crossing", landmark: "Renowned for soft white spongy Rosogolla" }
      ],
      signatureItems: [
        'Caramelized Earthen-Pot Mishti Doi (dense and thick)',
        'Baked Rosogolla served warm with caramelized rabri coating',
        'Jolbhora Nolen Gur Sandesh (contains molten liquid date-palm jaggery center)',
        'Parijat & Kacha Golla sweets'
      ],
      nativeTips: [
        'When biting into a Jolbhora Sandesh, tilt your head slightly back—the molten liquid Nolen Gur core will burst out with sublime sweetness!',
        'Eat Mishti Doi with a small unglazed clay or wooden paddle rather than metal, preserving the earthy fragrance (shondha gondho).'
      ],
      transitGuide: 'Take Metro to Girish Park for Nakur Nandy, or Netaji Bhavan Metro for Balaram Mullick.',
      atmosphere: 'Century-old marble sweet counters, brass trays lined with seasonal confectionery, and fragrant earthen pots.'
    },
    {
      id: 'tiretta-bazaar-breakfast',
      title: 'Tiretta Bazaar Early Morning Chinese Breakfast',
      subtitle: 'Steaming Dumplings, Fishball Broth & Pork Baos',
      bengaliTitle: 'টায়ারটি বাজারের চাইনিজ প্রাতরাশ',
      location: 'Sun Yat Sen Street, Old Chinatown',
      region: 'central',
      regionLabel: 'Central Chinatown',
      category: 'tea-breakfast',
      timing: 'Best: 6:00 AM – 8:30 AM (Dawn Only)',
      priceRange: '₹40 – ₹120 per plate',
      description: 'Every dawn since the 19th century, Kolkata’s Hakka and Cantonese community transforms Sun Yat Sen Street into a bustling open-air breakfast feast of steaming wontons, sweet pork baozi, and fish-meatball soup.',
      heritageLore: 'Kolkata is home to India’s only historical Chinatown. Starting in the late 18th century when Chinese businessman Tong Achew landed near the Hooghly river, Hakka and Cantonese immigrants established thriving leather, dental, and culinary crafts. Before the morning sun clears the rooftops of Poddar Court, elderly Chinese women and home cooks set up wooden tables serving piping hot pork and chicken dumplings with chili-garlic oil, delicate fishball noodle broth, sesame sweet rice balls, and crisp prawn crackers.',
      quote: '“Dawn arrives in Central Calcutta with the clatter of bamboo steam baskets on Sun Yat Sen Street.”',
      tag: 'Historic Chinatown',
      image: 'https://assets.telegraphindia.com/telegraph/DSC_1922.jpg',
      famousStalls: [
        { name: "Hap Hoi Chinese Association Porch", address: "Sun Yat Sen Street, Tiretta Bazaar", landmark: "Near Poddar Court" },
        { name: "Seav Voi Yuen Food Corner", address: "Sun Yat Sen St & Blackwood Square", landmark: "Opposite Sea Ip Church" },
        { name: "Ah Leung", address: "Tangra Chinatown (Evening outlet)", landmark: "Famous for Cantonese wonton broth" }
      ],
      signatureItems: [
        'Steamed Pork & Chicken Momos with pickled chili vinegar',
        'Clear Fishball & Meatball Soup with scallions and spring onions',
        'Sweet Roasted Char Siu Baozi (steamed stuffed pork buns)',
        'Deep-fried Prawn Spring Rolls and Sesame Coconut Puffs'
      ],
      nativeTips: [
        'Arrive sharp by 6:30 AM on Sunday morning; by 8:15 AM, the best bamboo steamers are completely scraped clean!',
        'Visit the adjacent 1905 Sea Ip Church afterwards to smell sandalwood incense and see vintage Chinese warrior tapestries.'
      ],
      transitGuide: 'Take Blue Line Metro to Chandni Chowk or Central Station, walk 400m towards Poddar Court.',
      atmosphere: 'Wreaths of fragrant steam in dawn mist, Cantonese greetings, and steaming steel ladles.'
    },
    {
      id: 'golbari-kosha-mangsho',
      title: 'Golbari’s Velvet Kosha Mangsho & Luchi',
      subtitle: 'Centuries-Old Pitch-Black Spicy Mutton Stew',
      bengaliTitle: 'গোলবাড়ির কষা মাংস',
      location: 'Shyambazar Five-Point Crossing',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 12:30 PM Lunch / 7:00 PM Dinner',
      priceRange: '₹220 – ₹380',
      description: 'Operating for over a century inside a semi-circular heritage cabin at Shyambazar 5-point, Golbari creates Kolkata’s most intense, deeply caramelized black mutton Kosha Mangsho.',
      heritageLore: 'Officially named the New Punjabi Hotel, locals affectionately christened it "Golbari" (the round house) due to the semicircular facade of the building facing Netaji Subhas Chandra Bose’s bronze equestrian statue at Shyambazar. The secret to their midnight-black gravy lies in slow-braising tender mutton pieces in iron cauldrons for five hours with caramelized onions, curd, crushed bay leaves, cloves, and a proprietary dark spice paste that coats each meat fiber in velvet richness.',
      quote: '“A black gravy so rich and glossy, you can almost see your reflection in the plate.”',
      tag: 'Heritage Cabin Meat',
      image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "New Punjabi Hotel (Golbari)", address: "2 Acharya Prafulla Chandra Rd, Shyambazar", landmark: "Facing Shyambazar 5-Point Crossing (Est. 1922)" },
        { name: "Koshe Kosha", address: "Shyambazar & Ripon St branches", landmark: "Modern tribute to traditional slow-braised kosha" }
      ],
      signatureItems: [
        'Golbari Special Kosha Mangsho (thick, rich spicy black gravy with 4 mutton cuts)',
        'Warm triangle Maida Parathas / Hand-rolled fluffy Luchis',
        'Tamarind Chutney and raw sliced red onion salad'
      ],
      nativeTips: [
        'Tear a piece of hot paratha and wrap it around the dark meat—the gravy is fiery and thick enough to cling without dripping.',
        'Wash down the spicy pepper heat with sweet Mishti Doi from the nearby Chittaranjan confectionery.'
      ],
      transitGuide: 'Shyambazar Metro Station. Exit Gate 1 and walk 30 meters right onto APC Road.',
      atmosphere: 'Vintage neon sign, narrow historic eating hall, and the heady aroma of cardamom, cloves, and clarified ghee.'
    },
    {
      id: 'peter-cat-chelo-kebab',
      title: 'Peter Cat’s Chelo Kebab & Sizzlers',
      subtitle: 'Charcoal Skewered Kebabs on Buttered Rice with Poached Egg',
      bengaliTitle: 'পিটার ক্যাটের চেলো কাবাব',
      location: '18A Park Street',
      region: 'central',
      regionLabel: 'Park Street Boulevard',
      category: 'cabins-fries',
      timing: 'Best: 12:30 PM Lunch / 7:30 PM Dinner',
      priceRange: '₹350 – ₹650 per person',
      description: 'Kolkata’s culinary temple on Park Street since 1975, where tender charcoal-broiled Iranian-style kebabs rest on steaming fragrant basmati rice crowned with melting butter and a golden poached egg.',
      heritageLore: 'Founded in 1975 by Nitin Kothari, Peter Cat transformed the Iranian national dish of Chelo Kebab into Kolkata’s most fiercely protected culinary obsession. Dim amber lamps, brass menus, red damask upholstery, and waiters dressed in regal Rajasthani turbans and angrakhas transport guests to mid-century elegance. The dish features charcoal-grilled minced mutton seekh kebabs and tender chicken boti kebabs served atop a mountain of buttered basmati rice, adorned with a roasted tomato and an oozing poached egg yolk.',
      quote: '“Every Calcuttan remembers their first Chelo Kebab under Peter Cat’s warm amber glow.”',
      tag: 'Park Street Icon',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Peter Cat", address: "18A Park Street, Kolkata 700071", landmark: "Beside Flurys & Oxford Bookstore (Est. 1975)" },
        { name: "Mocambo Restaurant", address: "25B Park Street", landmark: "Sister heritage continental restaurant (Est. 1956)" }
      ],
      signatureItems: [
        'The Original Chelo Kebab (Minced mutton seekh, chicken boti, buttered rice & egg)',
        'Mocambo Devilled Crab baked in real crab shells with cheese',
        'Chicken Tetrazzini and Baked Alaska'
      ],
      nativeTips: [
        'The Golden Ritual: While the rice is scalding hot, immediately mix the raw butter pat and oozing poached egg yolk deep into the rice grains for unbelievable creaminess.',
        'Walk in 15 minutes before 12:30 PM or 7:00 PM to beat the famous Park Street sidewalk waiting queue.'
      ],
      transitGuide: 'Park Street Metro Station. Walk 2 minutes down Park Street towards Free School Street.',
      atmosphere: 'Warm amber lantern light, jazz melodies, clinking cutlery, and timeless Anglo-Indian hospitality.'
    },
    {
      id: 'kalika-evening-telebhaja',
      title: 'Kalika’s 60-Year-Old Evening Telebhaja',
      subtitle: 'Beguni, Dimer Devil & Fiery Fish Chop in Mustard Oil',
      bengaliTitle: 'কালিকার তেলেভাজা ও ডিমের ডেভিল',
      location: 'Surya Sen Street, College Square',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'street-bites',
      timing: 'Best: 4:30 PM – 8:00 PM Evening',
      priceRange: '₹15 – ₹45 per piece',
      description: 'Since 1965, students, bookbinders, and professors have flocked to this tiny hole-in-the-wall near College Square for crackling golden fritters straight out of smoking mustard oil.',
      heritageLore: 'Telebhaja is Kolkata’s premier evening tea companion. Kalika Mukhorochok Telebhaja, founded in 1965 by Sukumar Dutta, is regarded as the temple of this craft. Giant cast-iron kadai bubble over roaring gas flames with pure cold-pressed mustard oil. The menu is an ode to Bengali snackery: wafer-thin eggplant slices (beguni) dipped in spiced chickpea batter, mutton keema chop, duck egg devil encased in spiced potato mash, and seasonal phoolkopir chop (cauliflower florets).',
      quote: '“Rainy afternoons in Calcutta are incomplete without the sizzle of Kalika’s boiling kadai.”',
      tag: 'Heritage Street Fry',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Kalika Mukhorochok Telebhaja", address: "29 Surya Sen Street, College Square", landmark: "Opposite College Square swimming pool" },
        { name: "Mouchak Telebhaja Stall", address: "Gariahat Roundabout", landmark: "South Kolkata fry stop" },
        { name: "Laxmi Narayan Shaw & Sons", address: "158 Bidhan Sarani, Hatibagan", landmark: "Est. 1918, Netaji Subhas Bose’s favorite telebhaja shop" }
      ],
      signatureItems: [
        'Beguni (Paper-thin crispy eggplant fritter with nigella seeds)',
        'Dimer Devil (Spiced potato-keema shell wrapping half a boiled duck egg)',
        'Mochar Chop (Spicy spiced banana blossom cutlet with coconut bits)',
        'Mutton Keema Chop dusted with black rock salt (bit noon)'
      ],
      nativeTips: [
        'Buy a ₹10 newspaper cone of muri (puffed rice) from the adjacent cart to eat alongside the scalding hot fritters.',
        'Sprinkle extra bit noon (black sulfur salt) and crushed green chilies for peak street authenticity.'
      ],
      transitGuide: 'Mahatma Gandhi Road Metro. Walk 5 minutes into Surya Sen Street.',
      atmosphere: 'The crackle of boiling mustard oil, students arguing over literature, and paper bags soaked in aromatic oil.'
    },
    {
      id: 'balwant-singh-doodh-cola',
      title: 'Balwant Singh’s Doodh Cola & Kesar Chai',
      subtitle: 'Late-Night Adda, Saffron Tea & Fizzy Milk Cola',
      bengaliTitle: 'বলবন্ত সিংয়ের দুধ কোলা ও কেশর চা',
      location: 'Harish Mukherjee Road, Bhowanipore',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 6:00 AM Morning & 10:00 PM – 2:00 AM Late Night',
      priceRange: '₹40 – ₹130',
      description: 'Kolkata’s legendary nocturnal hotspot where night owls, drivers, and midnight travelers gather on the sidewalk for clay cups of saffron tea, club kachoris, and the world-famous Doodh Cola.',
      heritageLore: 'Started in the 1920s as a humble tea stall by Balwant Singh near the Gurdwara in Bhowanipore, this joint invented a drink that sounds bizarre until you take the first sip: Doodh Cola. In giant aluminum churns, ice-cold buffalo milk is blended with Thums Up or Coca-Cola, creating a frothy, chocolate-caramel malted cream drink. During early mornings and midnight hours, luxury sedans and yellow cabs park bumper-to-bumper while servers deliver boiling scalding earthen cups (matka) of Kesar milk tea directly to your window.',
      quote: '“When the rest of Calcutta sleeps, Harish Mukherjee Road is wide awake with scalding clay cups of saffron tea.”',
      tag: 'Midnight Adda',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Balwant Singh Eating House", address: "10/1 Harish Mukherjee Rd, Bhowanipore", landmark: "Beside Sant Kuti Gurdwara (Open 20+ hours daily)" },
        { name: "Sharma Tea House", address: "Ashutosh Mukherjee Rd, Bhowanipore", landmark: "Famous for morning kachori & jalebi" }
      ],
      signatureItems: [
        'The Original Doodh Cola (Chilled milk churned with fizzy cola in tall 1-liter jugs)',
        'Matka Kesar Chai (Clay cup scalding tea steeped with royal Kashmiri saffron strands)',
        'Club Kachori with spicy Hing Aloo Sabzi and green chili pickle',
        'Hot Malpua and crispy Ghee Jalebi'
      ],
      nativeTips: [
        'Order the 1-liter jug of Doodh Cola to share among 3 friends—it is rich, creamy, and surprisingly revitalizing!',
        'Midnight drive-in tip: Just roll down your car window and flash your headlights; a server will jog over with a steaming tray of clay cups.'
      ],
      transitGuide: 'Netaji Bhavan Metro Station. Walk 4 minutes down Harish Mukherjee Road.',
      atmosphere: 'Bustling nighttime curbside banter, roaring motorcycles, and the sweet aroma of boiled milk, saffron, and tea leaves.'
    },
    {
      id: 'nakur-nandy-sandesh',
      title: 'Girish & Nakur Nandy’s Artisanal Sandesh',
      subtitle: 'Over 180 Years of Bengal’s Highest Sweetcraft',
      bengaliTitle: 'গিরিশচন্দ্র দে ও নকুড়চন্দ্র নন্দীর সন্দেশ',
      location: '56 Ramdulal Sarkar Street, Hedua',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'sweets-desserts',
      timing: 'Best: 7:00 AM – 11:00 AM & 4:30 PM – 9:00 PM',
      priceRange: '₹20 – ₹60 per piece',
      description: 'Established in 1844, Nakur Nandy is the undisputed royal court of Bengali Sandesh, where chhana (cottage cheese) is sculpted into melt-in-the-mouth Parijat, Monohora, and seasonal Nolen Gur masterpieces.',
      heritageLore: 'Founded in 1844 by Girish Chandra Dey and his son-in-law Nakur Chandra Nandy in the aristocratic neighborhood of Hedua, this tiny shop has fed five generations of poets, industrialists, and Nobel laureates. Unlike commercial sweetshops that use flour or preservatives, Nakur uses only pure hand-kneaded cows milk chhana, fine cane sugar or winter date-palm jaggery (Nolen Gur). Their signature invention is the "Jolbhora Sandesh"—a talismanic diamond-shaped sweet containing a hidden reservoir of fragrant liquid date-palm syrup that gushes into the mouth.',
      quote: '“A single Nakur sandesh dissolves on the tongue like a sweet whisper from 19th-century Calcutta.”',
      tag: 'Heritage Sweetcraft',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Girish Chandra Dey & Nakur Chandra Nandy", address: "56 Ramdulal Sarkar Street, Hedua", landmark: "Near Hedua Park / Girish Park (Est. 1844)" },
        { name: "Bhim Chandra Nag", address: "5 Nirmal Chandra St, Bowbazar", landmark: "Inventors of the Ledikeni sweet for Lady Canning in 1858" }
      ],
      signatureItems: [
        'Jolbhora Nolen Gur Talsash (Liquid jaggery-filled winter sweet)',
        'Parijat Sandesh (Fragrant floral delicate chhana patty)',
        'Chocolate Souffle Sandesh & Butterscotch Sandesh (Famous modern innovations)',
        'Monohora (Cardamom chhana wrapped in a thin crystalline sugar crust)'
      ],
      nativeTips: [
        'Winter visit is mandatory: From November to February, the fresh Nolen Gur (date-palm syrup harvested at sunrise) produces magical seasonal sweets.',
        'Never keep Nakur sandesh in the fridge for more than 48 hours—it is crafted fresh without additives and meant to be eaten immediately.'
      ],
      transitGuide: 'Take Blue Line Metro to Girish Park Station, walk 500m towards Hedua Park.',
      atmosphere: 'Sepia-toned wooden display cases, marble floors, and the divine aroma of cardamom, saffron, and fresh chhana.'
    },
    {
      id: 'apanjan-fish-fry',
      title: 'Apanjan’s Diamond Bhetki Fish Fry',
      subtitle: 'Crisp Golden Crust Enclosing Tender Calcutta Bhetki',
      bengaliTitle: 'আপনজনের ডায়মন্ড ফিশ ফ্রাই',
      location: 'Sadananda Road, Kalighat',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 5:00 PM – 9:00 PM Evening',
      priceRange: '₹140 – ₹220',
      description: 'A timeless South Kolkata institution near Kalighat temple, frying the definitive Diamond-cut fresh Hooghly Bhetki fish fry with pungent fermented Kasundi and shredded salad.',
      heritageLore: 'The Kolkata "Fish Fry" is an exquisite legacy of colonial club culture, adapted by Bengali cooks into street perfection. At Apanjan on Sadananda Road, the fish fry is cut into an unmistakable diamond silhouette. A thick, juicy fillet of prime Kolkata Bhetki is steeped in an emerald green marinade of coriander leaves, green chilies, garlic, and fresh mint, rolled in crisp breadcrumbs, and deep-fried in golden oil. The crust crackles under teeth, giving way to flaky, sweet, tender river fish.',
      quote: '“The crackle of the golden crumb yields to the tender soul of Bengal’s beloved Bhetki.”',
      tag: 'South Heritage Fry',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Apanjan", address: "50 Sadananda Road, Kalighat", landmark: "Near Hazra crossing & Kalighat Metro" },
        { name: "Bijoli Grill", address: "Southern Avenue & Bhawanipore", landmark: "Pioneers of Kolkata wedding-style fish fry" }
      ],
      signatureItems: [
        'Diamond Bhetki Fish Fry with fiery home-brewed Kasundi',
        'Mutton Pasinda (Spiced tenderized mutton escalope fry)',
        'Devilled Crab with melted cheese stuffing',
        'Chhanar Chop (Paneer cutlet with raisins and roasted cumin)'
      ],
      nativeTips: [
        'Never use tomato ketchup on a heritage fish fry—authentic Calcuttans use only sharp, nostril-clearing Kasundi (Bengali fermented mustard sauce).',
        'Eat it straight away off the paper plate while the fish is steaming hot.'
      ],
      transitGuide: 'Kalighat Metro Station. Walk 2 minutes down Sadananda Road towards Hazra.',
      atmosphere: 'Evening crowd of neighborhood cinephiles, families, and the scent of freshly fried fish and Kasundi mustard.'
    },
    {
      id: 'bhim-chandra-nag-ledikeni',
      title: 'Bhim Chandra Nag’s Royal Ledikeni & Sandesh',
      subtitle: 'Invented in 1858 for Viceroy Lady Charlotte Canning',
      bengaliTitle: 'ভীমচন্দ্র নাগের লেডিকেনি ও মিষ্টি',
      location: '5 Nirmal Chandra Street, Bowbazar',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'sweets-desserts',
      timing: 'Best: 8:00 AM – 8:30 PM',
      priceRange: '₹25 – ₹60 per piece',
      description: 'Operating continuously since 1826 in the gold quarter of Bowbazar, Bhim Chandra Nag invented the historical "Ledikeni" sweet to honor Governor-General Lord Canning’s wife in 1858.',
      heritageLore: 'In 1858, when India transitioned to direct British Crown rule, Viceroy Lord Canning and his wife Lady Charlotte Canning arrived in Calcutta. To welcome her birthday, master confectioner Bhim Chandra Nag created a special golden-brown fried chhana sweet steeped in cardamom syrup. Lady Canning fell in love with it, and Calcuttans immediately christened the sweet "Ledikeni" (Bengali pronunciation of Lady Canning). Inside the shop still hangs a giant antique mechanical grandfather clock with Bengali numerals on the dial, custom-built by London clockmaker Cooke & Kelvey in 1858!',
      quote: '“Two centuries of sweet history, where British Viceroys and Bengali freedom fighters shared the same sweet tooth.”',
      tag: 'Living Heritage Sweet',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',

      famousStalls: [
        { name: "Bhim Chandra Nag", address: "5 Nirmal Chandra Street, Bowbazar", landmark: "Near Bowbazar Crossing & College Street (Est. 1826)" },
        { name: "Sen Mahasay", address: "Fariapukur & Shyambazar", landmark: "Famous for Mihidana & Sitabhog" }
      ],
      signatureItems: [
        'The Original Ledikeni (Reddish-brown fried chhana sweet infused with cardamom)',
        'Manohara (Melt-in-the-mouth sweet encased in crystalline sugar)',
        'Ashomoye Nolen Gur Sandesh',
        'Abar Khabo Sandesh (Literally "I will eat it again!")'
      ],
      nativeTips: [
        'Take a moment to look up at the Cooke & Kelvey grandfather clock on the wall—it has been keeping accurate time since 1858 with Bengali numerals!',
        'Try the "Abar Khabo" sweet—legend says the Maharani of Burdwan exclaimed the phrase upon her first bite!'
      ],
      transitGuide: 'Central Metro Station. Walk 3 minutes east into Nirmal Chandra Street.',
      atmosphere: 'Historic wooden cabinetry, antique brass scales, and a 200-year-old aroma of cardamom syrup.'
    },
    {
      id: 'allen-kitchen-prawn-cutlet',
      title: 'Allen Kitchen’s 130-Year Pure Ghee Prawn Cutlet',
      subtitle: 'Flattened King Tiger Prawns Fried in Pure Clarified Ghee',
      bengaliTitle: 'অ্যালেন কিচেনের স্পেশাল প্রন কাটলেট',
      location: '40/1 Jatindra Mohan Avenue, Shobhabazar',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 4:30 PM – 8:30 PM Evening',
      priceRange: '₹180 – ₹290 per cutlet',
      description: 'Founded in the 1880s by a Scottish gentleman named Mr. Allen and inherited by Jiban Krishna Saha, Allen Kitchen is famous across Bengal for frying colossal flattened tiger prawns exclusively in pure clarified cow ghee.',
      heritageLore: 'In the late 19th century, British merchant Mr. Allen set up a small eatery near Shobhabazar serving Anglo-Scottish cutlets. When he departed India, he handed the kitchen to his trusted Bengali cook, Jiban Krishna Saha. Unlike typical fish fries cooked in mustard or refined oil, Allen Kitchen uses exclusively pure fragrant desi ghee. A whole king tiger prawn is de-veined, butterflied, gently tenderized with green chili, garlic, and mint, dipped in egg wash, and rolled in fine breadcrumbs before being sizzled in a bubbling pool of smoking ghee. The aroma of boiling ghee wafts across Jatindra Mohan Avenue every single evening.',
      quote: '“Fried in pure golden ghee, the prawn cutlet of Allen Kitchen is the aristocrat of North Calcutta cabins.”',
      tag: '130-Year Ghee Fry',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Allen Kitchen (Original Heritage Branch)", address: "40/1 Jatindra Mohan Avenue, Shobhabazar", landmark: "Opposite Shobhabazar Metro Gate 2 (Est. 1880s)" }
      ],
      signatureItems: [
        'Special Prawn Cutlet in Pure Ghee (King tiger prawn butterflied and ghee-fried)',
        'Fish Roll & Diamond Bhetki Fry',
        'Mutton Steak Cutlet & Kasundi',
        'Mughlai Chicken Cutlet'
      ],
      nativeTips: [
        'Eat it piping hot the second it lands on your table; the rich clarified ghee fragrance is at its absolute peak in the first 5 minutes.',
        'The owner still sits at the vintage teak cash counter—ask about the framed certificate from the British era.'
      ],
      transitGuide: 'Shobhabazar Sutanuti Metro Station. Exit Gate 2 and walk 40 meters south on Jatindra Mohan Avenue.',
      atmosphere: 'Sepia-toned walls, antique marble tabletops, rhythmic clanking of cast-iron spatulas, and the intoxicating perfume of sizzling cow ghee.'
    },
    {
      id: 'dilkhusha-cabin-dimer-devil',
      title: 'Dilkhusha Cabin’s Freedom-Era Dimer Devil & Mutton Cutlet',
      subtitle: 'Where Revolutionaries & Poets Plotted Over Duck Egg Devils',
      bengaliTitle: 'দিলখুশা কেবিনের ডিমের ডেভিল',
      location: '88 College Street (Est. 1907)',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 3:30 PM – 8:30 PM',
      priceRange: '₹40 – ₹130',
      description: 'Over 115 years old, Dilkhusha Cabin was the secretive gathering place of freedom fighters, Netaji Subhas Chandra Bose, and poet Kazi Nazrul Islam over duck egg devils and crispy Kabirajis.',
      heritageLore: 'Established in 1907 by Trailokyanath Dey, Dilkhusha Cabin sits right at the College Street and MG Road intersection. In pre-independence India, British CID spies hovered outside while revolutionaries like Rash Behari Bose and Netaji Subhas Chandra Bose sat behind wooden curtain partitions ("cabins") planning resistance movements. Their Dimer Devil remains legendary: a hard-boiled duck egg enveloped in rich, aromatic minced mutton keema and spiced potato mash, double-dipped in batter, and fried to a deep golden amber.',
      quote: '“Behind these wooden partitions, revolutions were scripted over cups of tea and spicy duck egg devils.”',
      tag: 'Swadeshi Era Cabin',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Dilkhusha Cabin", address: "88 Mahatma Gandhi Road & College Street", landmark: "Near Presidency University & College Square (Est. 1907)" }
      ],
      signatureItems: [
        'Signature Dimer Devil (Spiced keema & duck egg cutlet with fermented kasundi)',
        'Mutton Kabiraji Cutlet wrapped in gossamer egg net',
        'Doi Chicken (Light curd chicken curry with parathas)',
        'Fish Roll with fresh bhetki'
      ],
      nativeTips: [
        'Ask for their home-pounded Kasundi; it is fermented with green mangoes and clears the sinuses instantly.',
        'Combine your snack with an afternoon book hunt across the pavement stalls of College Street.'
      ],
      transitGuide: 'Mahatma Gandhi Road Metro Station. Walk 2 minutes east towards the College Street crossing.',
      atmosphere: 'Century-old wooden booths, historic mirrors, students debating history, and the crunch of freshly fried cutlets.'
    },
    {
      id: 'adi-haridas-modak-luchi',
      title: 'Adi Haridas Modak’s 200-Year Sal-Pata Luchi & Chholar Dal',
      subtitle: 'Two Centuries of Puffed Breakfast Puris on Fresh Forest Leaves',
      bengaliTitle: 'আদি হরিদাস মোদকের শালপাতার লুচি',
      location: 'Shyambazar 5-Point Crossing',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 6:30 AM – 10:00 AM Dawn Breakfast',
      priceRange: '₹25 – ₹60 for full plate',
      description: 'Operating continuously since 1818 (over 200 years!), Adi Haridas Modak serves hand-rolled puffed luchis on dried Sal leaf plates with sweet-savory coconut chholar dal and hot rasgullas.',
      heritageLore: 'Before modern roads and tramlines were laid at Shyambazar, Haridas Modak founded this breakfast haven in 1818 to feed horse-carriage travelers arriving from northern Bengal. For over two centuries, little has changed in their morning preparation. The luchis are kneaded by hand with fine maida, rolled into translucent rounds, and dropped into smoking iron cauldrons where they puff into pristine white clouds in seconds. They are plated on traditional dried green Sal tree leaves (sal pata) alongside slow-cooked Chholar Dal flavored with fried coconut chips, ginger, and cumin.',
      quote: '“Over two hundred years of Calcuttans have started their morning with hot luchis on fresh Sal leaves.”',
      tag: 'Two-Century Breakfast',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Adi Haridas Modak", address: "220 Acharya Prafulla Chandra Rd, Shyambazar", landmark: "Facing Shyambazar Five-Point crossing (Est. 1818)" }
      ],
      signatureItems: [
        'Four Fluffy Luchis served on Sal Pata with Chholar Dal & Aloo Dom',
        'Nolen Gur Rosogolla (Warm seasonal date-palm syrup rasgulla)',
        'Singara (Bengali samosa stuffed with spicy cauliflower & potatoes)',
        'Mishti Doi in mini clay pots'
      ],
      nativeTips: [
        'Arrive before 8:30 AM; on Sunday mornings the queue extends down the pavement towards Shyambazar metro.',
        'The Sal leaf infuses the warm luchi and dal with a subtle earthy forest aroma that paper plates can never match.'
      ],
      transitGuide: 'Shyambazar Metro Station. Exit Gate 1, directly adjacent to the crossing.',
      atmosphere: 'Clanging tram bells, morning commuters reading the morning Anandabazar Patrika, and boiling pots of fresh chholar dal.'
    },
    {
      id: 'chhangani-club-kachori',
      title: 'Chhangani’s Fiery Burrabazar Club Kachori & Jalebi',
      subtitle: 'Coin-Sized Puffed Kachoris Drowned in Peppery Hing Aloo Sabzi',
      bengaliTitle: 'ছাঙ্গানির ক্লাব কচুরি ও জিলাপি',
      location: 'C.I.T. Road & Burrabazar Trading Quarter',
      region: 'north',
      regionLabel: 'North Kolkata',
      category: 'street-bites',
      timing: 'Best: 7:00 AM – 11:30 AM Morning Only',
      priceRange: '₹30 – ₹60 for 4 pcs + sabzi',
      description: 'The bustling trading alleys of Burrabazar run on Chhangani’s bite-sized, deep-fried club kachoris, swimming in a fiery, peppery, black-gram aloo sabzi served on leaf thongas with smoking-hot crispy jalebis.',
      heritageLore: 'In the heart of Kolkata’s legendary trading quarter Burrabazar, Chhangani Club Kachori has fueled bullion merchants, cloth traders, and dock workers for decades. Unlike large inflated kachoris, their "Club Kachoris" are tiny, coin-sized discs stuffed with urad dal and hing, fried ultra-crisp. A generous ladle of dark, spicy potato sabzi—cooked without onion or garlic but loaded with crushed black pepper, cloves, and asafoetida—is poured on top, accompanied by a spoonful of spicy pickled green chilies and followed by giant swirls of syrup-drenched crispy jalebis.',
      quote: '“A fiery, pepper-spiced morning punch that awakens the senses faster than double-shot espresso.”',
      tag: 'Burrabazar Street Legend',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Chhangani Club Kachori", address: "C.I.T. Scheme VII-M, Kankurgachi / Burrabazar", landmark: "Near Cotton Street & Burrabazar wholesale bazaar" },
        { name: "Tewari Brothers Confectioners", address: "225 C.R. Avenue, Burrabazar", landmark: "Renowned for pure ghee samosas & motichoor laddoos" }
      ],
      signatureItems: [
        'Plate of 4 Mini Club Kachoris drenched in peppery Hing Aloo Sabzi',
        'Fresh Ghee Jalebis straight from the sizzling kadai',
        'Kashmiri Malai Toast with saffron rabri',
        'Spicy Chana Chaat with lime'
      ],
      nativeTips: [
        'Be prepared to eat standing up on the bustling footpath shoulder-to-shoulder with merchants.',
        'The aloo sabzi is fiery hot—always pair your plate with at least two warm jalebis to balance the spice!'
      ],
      transitGuide: 'Mahatma Gandhi Road Metro Station. Walk 500m west into the Burrabazar bazaar lanes.',
      atmosphere: 'Whistling hand-pulled carts, traders haggling over textiles, sizzling oil vats, and mouth-watering asafoetida steam.'
    },
    {
      id: 'nahoum-sons-bakery',
      title: 'Nahoum & Sons’ 120-Year Jewish Rich Fruit Cake & Lemon Puffs',
      subtitle: 'Edwardian Teak Counters Holding Kolkata’s Last Baghdadi Jewish Bakery',
      bengaliTitle: 'নাহুমের ঐতিহ্যবাহী প্লাম কেক ও লেমন পাফ',
      location: 'F-20 Sir Stuart Hogg Market (New Market)',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'sweets-desserts',
      timing: 'Best: 10:00 AM – 8:00 PM Daily',
      priceRange: '₹40 – ₹350',
      description: 'Kolkata’s last surviving Baghdadi Jewish bakery since 1902. Teakwood glass cabinets hold legendary rum-soaked Rich Fruit Cakes, crumbly lemon puffs, almond macaroons, and Jewish baklava.',
      heritageLore: 'Founded in 1902 by Nahoum Israel Mordecai, a Baghdadi Jew who immigrated to Calcutta, Nahoum & Sons is an irreplaceable living artifact of Kolkata’s multicultural soul. Housed inside the sprawling Victorian brick corridors of New Market, the bakery’s original Belgian glass display cases, polished Burma teak counters, and cash drawers remain intact from the Edwardian era. Generations of Calcuttans, from Archbishop of Calcutta to former chief ministers and film stars, consider Christmas incomplete without standing in hour-long queues for Nahoum’s rum-infused Rich Fruit Cake and crispy layered Lemon Puffs.',
      quote: '“Walking into Nahoum is stepping straight into an Edwardian confectionery parlor where time stood still.”',
      tag: '1902 Jewish Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Nahoum & Sons Bakery", address: "F-20 Sir Stuart Hogg Market (New Market), Lindsay Street", landmark: "Central corridor inside New Market (Est. 1902)" },
        { name: "Saldanha Bakery", address: "19 Nawab Abdur Rahman Street", landmark: "Century-old Goan family bakery famous for Walnut Cake" }
      ],
      signatureItems: [
        'Rich Plum Fruit Cake (Infused with rum, candied peel & raisins)',
        'Flaky Lemon Puffs filled with tangy citrus curd',
        'Almond & Cashew Macaroons',
        'Chocolate Fudge Brownies and Chicken Patties'
      ],
      nativeTips: [
        'During the December Christmas week, order or visit early in the morning—the fruit cake sells out by 2:00 PM daily!',
        'Take home a box of their crumbly cheese straws for evening tea.'
      ],
      transitGuide: 'Esplanade Metro Interchange. Exit towards Lindsay Street and enter New Market Gate 1.',
      atmosphere: 'Aromatic vanilla, cinnamon, and baked butter pastry under century-old teak cabinetry in the Victorian market.'
    },
    {
      id: 'mocambo-devilled-crab',
      title: 'Mocambo’s 1950s Devilled Crab & Chicken Tetrazzini',
      subtitle: 'Mid-Century Italian Red Booth Glamour on Park Street',
      bengaliTitle: 'মোকাম্বোর ডেভিলড ক্র্যাব ও টেট্রাজিনি',
      location: '25B Park Street (Est. 1956)',
      region: 'central',
      regionLabel: 'Park Street Boulevard',
      category: 'cabins-fries',
      timing: 'Best: 12:30 PM Lunch / 7:30 PM Dinner',
      priceRange: '₹450 – ₹850 per person',
      description: 'Opened in 1956 as Kolkata’s first premier European nightclub with a live Italian jazz band, Mocambo remains the supreme temple of retro Continental dining, famed for Devilled Crab baked in real shells and Chicken Tetrazzini.',
      heritageLore: 'Founded in 1956 by Shivji V. Kothari with interior design by legendary Italian architect Antonio Prandhe, Mocambo was the glamorous epicenter of Calcutta’s jazz age. Legendary crooners like Pam Crain sang on its glass dance floor while waiters in immaculate white jackets served British-Continental and Russian delicacies. Mocambo’s Devilled Crab is an all-time classic: succulent fresh river crab meat sautéed with mustard, white wine, cream, and green chilies, stuffed back into the natural crab carapace, blanketed with English cheddar cheese, and baked until the crust bubbles and turns golden brown.',
      quote: '“Dim lamps, red booths, and bubbling cheddar cheese—Park Street’s mid-century culinary time machine.”',
      tag: '1956 Continental Legend',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Mocambo Restaurant", address: "25B Park Street, Kolkata 700016", landmark: "Near Free School Street intersection (Est. 1956)" },
        { name: "Peter Cat", address: "18A Park Street", landmark: "Sister heritage establishment famous for Chelo Kebab" }
      ],
      signatureItems: [
        'Devilled Crab (Fresh crab meat baked in real shell with bubbling cheese)',
        'Chicken Tetrazzini (Rich creamy baked spaghetti casserole with chicken)',
        'Fish Florentine with spinach and Mornay sauce',
        'Baked Alaska flambéed with rum at your table'
      ],
      nativeTips: [
        'Ask for a booth table on the ground floor for the most nostalgic, ambient dining experience.',
        'Always save room for their dramatic Baked Alaska—the waiter ignites the rum-soaked meringue right at your table!'
      ],
      transitGuide: 'Park Street Metro Station. Walk 200m down Park Street towards Free School Street.',
      atmosphere: 'Plush crimson armchairs, soft vintage lighting, attentive tuxedo-clad stewards, and sizzling sizzler platters.'
    },
    {
      id: 'royal-indian-hotel-chaap',
      title: 'Royal Indian Hotel’s 1905 Mutton Chaap & Pasinda',
      subtitle: 'Imperial Awadhi Royalty Simmered Opposite Nakhoda Mosque',
      bengaliTitle: 'রয়্যাল ইন্ডিয়ান হোটেলের মাটন চাপ',
      location: '147 Rabindra Sarani, Chitpur',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'mughlai-biryani',
      timing: 'Best: 12:30 PM – 4:00 PM & 7:00 PM – 11:00 PM',
      priceRange: '₹220 – ₹450',
      description: 'Founded in 1905 by Ahmed Hussain, royal bawarchi of the exiled Nawab of Awadh. Famous for its pristine Lucknowi mutton biryani without potato and slow-roasted, velvety Mutton Chaap simmered in pure ghee and poppy seed paste.',
      heritageLore: 'When Nawab Wajid Ali Shah passed away in Metiabruz, his royal culinary descendants preserved the unadulterated Awadhi cooking tradition. Ahmed Hussain opened Royal Indian Hotel in 1905 opposite Nakhoda Mosque in Chitpur. While the rest of Kolkata embraced the potato in biryani, Royal fiercely adhered to the imperial Lucknow recipe—steaming long-grain basmati with melt-in-the-mouth mutton pieces, saffron, and ghee, completely potato-free. Their crowning achievement is the Mutton Chaap: rib chops marinated for hours in crushed brown onions, poppy seeds (posto), charmagaz, and mace, slow-roasted on giant flat cast-iron lagans until the ghee separates into an aromatic, glossy pool.',
      quote: '“Over a century of imperial Awadhi royalty, simmering on Chitpur’s most historic boulevard.”',
      tag: '1905 Royal Bawarchi',
      image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Royal Indian Hotel", address: "147 Rabindra Sarani, Chitpur", landmark: "Directly opposite Nakhoda Grand Mosque (Est. 1905)" },
        { name: "Nafees Restaurant", address: "Park Circus", landmark: "Awadhi specialities" }
      ],
      signatureItems: [
        'Royal Special Mutton Chaap (Slow-roasted rib cutlet in Posto-Charmagaz ghee gravy)',
        'Traditional Lucknowi Mutton Biryani (Potato-free with tender spiced goat meat)',
        'Mutton Pasinda (Flattened marinated escalopes grilled in ghee)',
        'Shahi Tukda (Crisp fried bread steeped in saffron rabri & pistachios)'
      ],
      nativeTips: [
        'Order one Mutton Chaap with crisp Rumali Roti to dip before tackling your biryani plate.',
        'Take a quiet moment on the first-floor balcony to gaze across the majestic minarets of Nakhoda Mosque.'
      ],
      transitGuide: 'Central or Mahatma Gandhi Road Metro Station. Take a 5-minute cycle rickshaw down Rabindra Sarani.',
      atmosphere: 'Aroma of rosewater, kewra, roasting meat, and the majestic evening call to prayer echoing across Chitpur.'
    },
    {
      id: 'shiraz-mutton-biryani',
      title: 'Shiraz Golden Restaurant’s Awadhi Dum Biryani & Rezala',
      subtitle: 'The 1941 Citadel of Sealed Copper Handi Biryani & Silky White Rezala',
      bengaliTitle: 'সিরাজের বিরিয়ানি ও মটন রেজালা',
      location: '135 Park Street & Mullick Bazar Crossing',
      region: 'central',
      regionLabel: 'Central-South',
      category: 'mughlai-biryani',
      timing: 'Best: 12:30 PM – 3:30 PM & 7:30 PM – 11:30 PM',
      priceRange: '₹200 – ₹420',
      description: 'Operating since 1941 at the Mullick Bazar crossing, Shiraz is Kolkata’s undisputed titan of Awadhi Biryani and aromatic Mutton Rezala simmered in yogurt, cashew paste, and whole dried red chilies.',
      heritageLore: 'Founded in 1941 by Arshad Ali and Mohammad Hussain, Shiraz Golden Restaurant popularized the royal dum-cooked biryani among middle-class Calcuttans and visiting dignitaries. Their massive copper degchis are sealed with wet flour dough (dum pukht) and placed over smoldering coal embers. The rice grains remain distinct, translucent, and fragrant with saffron and cardamom. Alongside their biryani, Shiraz perfected the Kolkata "Rezala"—an exquisite, silky white stew made from tender goat shank braised in thick yogurt, cashew paste, makhana (foxnuts), and whole Kashmiri dried red chilies.',
      quote: '“The fragrance of Shiraz’s sealed copper handis has welcomed night wanderers since 1941.”',
      tag: '1941 Biryani Citadel',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolkata_mutton_biryani.jpg/500px-Kolkata_mutton_biryani.jpg',
      famousStalls: [
        { name: "Shiraz Golden Restaurant", address: "135 Park Street, Mullick Bazar Crossing", landmark: "Near Park Circus approach (Est. 1941)" },
        { name: "Aliah Hotel", address: "Bentinck Street, Esplanade", landmark: "Heritage colonial Mughlai outlet" }
      ],
      signatureItems: [
        'Shiraz Special Mutton Biryani with tender dum potato and spiced boiled egg',
        'Mutton Rezala (Aromatic white yogurt stew with whole dry chilies & makhana)',
        'Chicken Tikka Butter Masala with garlic naan',
        'Shahi Firni served cold in traditional unglazed clay cups'
      ],
      nativeTips: [
        'Always order a bowl of Mutton Rezala alongside your biryani; spooning the aromatic white gravy over the saffron rice is a culinary revelation.',
        'Late-night diners: Shiraz stays open past 11:30 PM, making it the ideal post-cinema dinner stop.'
      ],
      transitGuide: 'Park Street Metro or take a yellow taxi directly to Mullick Bazar crossing on Park Street.',
      atmosphere: 'Sprawling multi-level dining hall, bustling families, clattering brass plates, and rich aromas of dum-sealed biryani.'
    },
    {
      id: 'campari-gariahhat-fish-roll',
      title: 'Campari’s Legendary Fish Roll & Mutton Cutlet',
      subtitle: 'South Kolkata’s Revered Gariahat Evening Frying Pavilion',
      bengaliTitle: 'কাম্পারির ফিশ রোল ও মাটন কাটলেট',
      location: '155B Rash Behari Avenue, Gariahat',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'cabins-fries',
      timing: 'Best: 4:30 PM – 9:00 PM Evening',
      priceRange: '₹90 – ₹180 per roll/cutlet',
      description: 'South Kolkata’s most beloved evening snack institution since 1979. Known for its colossal Fish Roll—a whole fillet of fresh Hooghly Bhetki wrapped around spicy minced fish stuffing, crusted in crisp crumbs.',
      heritageLore: 'Founded in 1979 in the pulsing shopping hub of Gariahat, Campari redefined Kolkata’s deep-fried street culture for South Calcuttans. While Gariahat is famous for silk sarees and street markets, the evening pilgrimage inevitably ends on Campari’s pavement. Their iconic "Fish Roll" is an engineering marvel: a prime, delicate fillet of fresh Bhetki fish is marinated in coriander and green chili paste, rolled snugly around a spicy, aromatic fish-keema stuffing, encased in coarse golden breadcrumbs, and deep-fried to a crackling crunch. Paired with fiery homemade Kasundi, it is the quintessential South Kolkata treat.',
      quote: '“After an evening of haggling for sarees at Gariahat, nothing rewards the soul like Campari’s steaming fish roll.”',
      tag: 'Gariahat Street Legend',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Campari", address: "155B Rash Behari Avenue, Gariahat", landmark: "Near Gariahat Crossing & Gariahat Police Station (Est. 1979)" },
        { name: "Bedwin", address: "Gariahat Flyover", landmark: "Famous for South Kolkata kathi rolls" }
      ],
      signatureItems: [
        'Special Fish Roll (Fresh Bhetki fillet wrapped around spicy fish keema)',
        'Mutton Cutlet & Kasundi mustard',
        'Chicken Roll in flaky laccha paratha',
        'Fish Kobiraji with golden egg mesh'
      ],
      nativeTips: [
        'There are no seats—join the lively sidewalk crowd, eat standing up, and watch the yellow double-decker buses and trams rattle down Rash Behari Avenue.',
        'Ask for extra sliced red onions and raw green chilies.'
      ],
      transitGuide: 'Kalighat Metro Station, followed by a 5-minute auto down Rash Behari Avenue to Gariahat crossing.',
      atmosphere: 'Vibrant South Calcutta retail energy, clinking tongs, crackling oil, and laughter under the streetlamps.'
    },
    {
      id: 'balaram-mullick-baked-rosogolla',
      title: 'Balaram Mullick’s Artisanal Baked Rosogolla & Nolen Gur Soufflé',
      subtitle: 'Pioneers Who Reinvented Bengal Confectionery in 1885',
      bengaliTitle: 'বলরাম মল্লিকের বেকড রসগোল্লা ও নলেন গুড়',
      location: '2 Jadunath Dey Rd & Bhowanipore (Est. 1885)',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'sweets-desserts',
      timing: 'Best: 8:00 AM – 9:30 PM',
      priceRange: '₹30 – ₹80 per piece',
      description: 'Operating since 1885 in aristocratic Bhowanipore, Balaram Mullick & Radharaman Mullick revolutionized Bengal confectionery by inventing the warm, caramelized Baked Rosogolla and silky Nolen Gur Soufflé.',
      heritageLore: 'Founded in 1885 by Ganesh Chandra Mullick, who migrated to Calcutta from Konnagar, this confectionery house has delighted sweet-lovers for over 140 years. While respecting traditional Sandesh craftsmanship, the family became famous for pioneering modern dessert hybrids. In the 1990s, they invented the "Baked Rosogolla": fresh spongy cottage-cheese balls steeped in thick, saffron-infused reduced rabri, baked inside clay terracotta bowls in high-temperature ovens until the crown caramelizes into a golden, smoky brûlée crust.',
      quote: '“Where traditional Bengali chhana meets French patisserie innovation.”',
      tag: '1885 Artisanal Pioneer',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Mishti_Doi.jpg/500px-Mishti_Doi.jpg',
      famousStalls: [
        { name: "Balaram Mullick & Radharaman Mullick (Flagship)", address: "2 Jadunath Dey Road, Bhowanipore", landmark: "Near Bhowanipore Police Station (Est. 1885)" },
        { name: "Ganguram Sweets", address: "Bowbazar & Gariahat", landmark: "Famous for classic Mishti Doi" }
      ],
      signatureItems: [
        'Baked Rosogolla (Served warm in clay cup with caramelized rabri crust)',
        'Nolen Gur Soufflé (Whipped date-palm jaggery mousse)',
        'Mango Gelato Sandesh & Chocolate Mudpie Sandesh',
        'Classic Kacha Golla and Chhanar Jilipi'
      ],
      nativeTips: [
        'Always eat the Baked Rosogolla warm—the contrast between the piping hot spongy center and the cold creamy rabri is extraordinary.',
        'In winter (Dec–Feb), try their fresh Jalbhara Sandesh made with morning-tapped date-palm sap.'
      ],
      transitGuide: 'Netaji Bhavan Metro Station. Walk 300m down Ashutosh Mukherjee Road into Bhowanipore.',
      atmosphere: 'Gleaming brass display cases, heritage portraits, aroma of reduced condensed milk, and neighborhood families picking up sweet boxes.'
    },
    {
      id: 'maharaja-maharani-kachori',
      title: 'Maharaja & Maharani’s Morning Club Kachori & Malpua',
      subtitle: 'The Epic South Kolkata Breakfast Rivalry Across Sarat Bose Road',
      bengaliTitle: 'মহারাজা ও মহারানীর ক্লাব কচুরি',
      location: 'Sarat Bose Road, Southern Avenue',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'tea-breakfast',
      timing: 'Best: 6:30 AM – 10:30 AM Morning',
      priceRange: '₹30 – ₹70 per plate',
      description: 'The twin institutions facing each other across Sarat Bose Road where morning joggers, doctors, and south Kolkata intellectuals congregate under rain trees for hot club kachoris, spicy chana sabzi, and syrupy malpua.',
      heritageLore: 'Sitting opposite each other on Sarat Bose Road, "Maharaja" and "Maharani" form South Kolkata’s most fiercely contested morning breakfast rivalry. Starting at dawn, morning walkers from the nearby Rabindra Sarobar Lake arrive in tracksuits to join college students and elderly intellectuals. The breakfast is legendary: four small, blistered, golden-crisp club kachoris stuffed with urad dal paste, floating on an earthy, aromatic curry of diced potatoes and black chickpeas seasoned with dry roasted spices, topped with fiery mango-chili pickle and followed by hot, soft, syrup-dripping malpua.',
      quote: '“Morning joggers from the Lake invariably abandon their diet at the hypnotic aroma of Maharaja’s boiling kachori vats.”',
      tag: 'South Morning Ritual',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Kachori-sabzi.jpg/500px-Kachori-sabzi.jpg',
      famousStalls: [
        { name: "Maharaja Snack Bar", address: "196 Sarat Bose Road, Deshapriya Park", landmark: "Opposite Deshapriya Park & Southern Avenue (Morning hotspot)" },
        { name: "Maharani Sweets", address: "174 Sarat Bose Road", landmark: "Facing Maharaja across the avenue" }
      ],
      signatureItems: [
        'Club Kachori Plate (4 golden puffed kachoris with hing aloo sabzi & pickle)',
        'Warm Ghee Malpua steeped in cardamom syrup',
        'Kesariya Jalebi straight from the frying kadai',
        'Kulhad Masala Chai (Clay cup spiced tea)'
      ],
      nativeTips: [
        'Debate the eternal South Calcutta question with the locals: Is Maharaja better or Maharani? (Try two kachoris at each to decide!)',
        'Follow your breakfast with a tranquil stroll under the canopy of giant mahogany trees around Rabindra Sarobar Lake.'
      ],
      transitGuide: 'Kalighat or Jatin Das Park Metro Station. Walk 500m east to the Sarat Bose Road intersection.',
      atmosphere: 'Morning birds chirping, lively political discussions on the pavement, clinking earthen tea cups, and bubbling oil cauldrons.'
    },
    {
      id: 'kasturi-kochu-pata-chingri',
      title: 'Kasturi’s Dhakai Kacchi Biryani & Kochu Pata Chingri',
      subtitle: 'Steamed Prawns in Taro Leaves & Heritage Opar Bangla Cooking',
      bengaliTitle: 'কস্তুরীর ঢাকাই কাচ্চি ও কচুপাতা চিংড়ি',
      location: 'Ballygunge & Hindustan Park',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'mughlai-biryani',
      timing: 'Best: 12:30 PM – 4:00 PM & 7:30 PM – 10:30 PM',
      priceRange: '₹260 – ₹550 per person',
      description: 'Pioneers of authentic Dhakai Bangladeshi heritage cuisine in Kolkata since 1994. Celebrated for its sublime Kochu Pata Chingri (sweet river prawns steamed in taro leaves with mustard) and slow-cooked Dhakai Kacchi Biryani.',
      heritageLore: 'Founded in 1994, Kasturi brought the soulful, piquant flavors of undivided Bengal’s eastern culinary heritage (Dhakai and Opar Bangla cooking) into mainstream Kolkata restaurant lore. Their signature creation, Kochu Pata Chingri, is a revered culinary masterclass: succulent river prawns (Chingri) are folded into tender young green taro leaves (kochu pata), ground mustard seed paste (shorshe bata), grated fresh coconut, green chilies, and cold-pressed mustard oil, and gently steamed inside banana leaf parcels until the leaves melt into a rich, savory emerald puree.',
      quote: '“A nostalgic ode to the kitchens of old Dhaka, steamed inside tender green leaves with cold-pressed mustard oil.”',
      tag: 'Dhakai Heritage',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: "Kasturi Restaurant (Hindustan Park Branch)", address: "11A Hindustan Road, Gariahat", landmark: "Near Gariahat Crossing & Fabindia (Est. 1994)" },
        { name: "Bhojohori Manna", address: "Ekdalia Rd, Ballygunge", landmark: "Traditional Bengali home-style cuisine" }
      ],
      signatureItems: [
        'Kochu Pata Chingri Bhapa (Prawns steamed in taro leaves with mustard & coconut)',
        'Dhakai Kacchi Biryani (Slow-cooked dum biryani with marinated mutton)',
        'Bhetki Paturi (Fish fillet steamed in charred banana leaves)',
        'Chitol Machher Muitha (Featherback fish dumplings in rich gravy)'
      ],
      nativeTips: [
        'Mix the emerald Kochu Pata Chingri directly with steaming hot Gobindobhog white rice and a squeeze of fresh Gandharaj lime.',
        'Try the Bhetki Paturi—unwrap the fragrant charred banana leaf parcel carefully to release the warm mustard steam.'
      ],
      transitGuide: 'Take Blue Line Metro to Kalighat, followed by a 5-minute auto to Hindustan Park / Gariahat.',
      atmosphere: 'Comfortable, warm heritage dining room filled with families and the pungent, appetizing fragrance of mustard and steamed banana leaves.'
    },
    {
      id: 'fire-and-ice-pizzeria',
      title: 'Fire and Ice Pizzeria’s Woodfired Thin Crust & Ravioli',
      subtitle: 'Kolkata’s Iconic Italian Trattoria on Chowringhee',
      bengaliTitle: 'ফায়ার অ্যান্ড আইস পিজ্জারিয়া',
      location: 'Kanak Building, 41 Chowringhee Road (Near Park Street)',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'italian-restaurant',
      categories: ['italian-restaurant', 'pizza-restaurant', 'bistro', 'continental-restaurant'],
      timing: 'Best: 12:30 PM – 4:00 PM & 7:00 PM – 11:00 PM',
      priceRange: '₹800 – ₹1,600 for two',
      description: 'Founded in 2005 by Italian native Annamaria Forgione, Fire and Ice brought authentic wood-fired Neapolitan pizza, handmade spinach ricotta ravioli, and Quattro Formaggi to Kolkata’s heart.',
      heritageLore: 'Tucked inside the neoclassical Kanak Building right at the intersection of Chowringhee and Park Street, Fire and Ice Pizzeria introduced Calcuttans to authentic Italian culinary standards. Annamaria Forgione imported the traditional wood-fired brick oven and stone-ground flour to replicate Napoli crusts—crisp, blistered, yet tenderly chewy. The "Fire of Bengal" pizza boldly marries Italian San Marzano tomato sauce, fresh mozzarella, and fiery local bird\'s-eye chilies, creating a beloved cross-continental masterpiece.',
      quote: '“The blistered crackle of true Neapolitan dough meeting Kolkata’s fiery soul.”',
      tag: 'Authentic Italian',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Fire and Ice Pizzeria', address: 'Kanak Building, 41 Chowringhee Rd', landmark: 'Opposite Jeevan Deep building / Park Street Metro (Est. 2005)' },
        { name: 'Fabbrica Della Pizza', address: '8A Allenby Road, Elgin', landmark: 'Renowned for sourdough Neapolitan pizza' }
      ],
      signatureItems: [
        'Fire of the Bengal Pizza (Fiery local chillies, roasted garlic & melted mozzarella)',
        'Quattro Formaggi (Four cheese woodfired blistered pizza)',
        'Spinach & Ricotta Ravioli in Sage Butter',
        'Classic Italian Tiramisu steeped with espresso & mascarpone'
      ],
      nativeTips: [
        'Book a table in advance on weekend evenings as the woodfired oven draws pizza lovers from across the city.',
        'Try their homemade chili-infused olive oil drizzled right on the blistered crust.'
      ],
      transitGuide: 'Park Street Metro Station Gate 1. Walk 50 meters north on Chowringhee Road into Kanak Building.',
      atmosphere: 'Warm rustic brick walls, aromatic burning oak wood, Italian opera melodies, and clinking wine glasses.'
    },
    {
      id: 'tangra-chinatown-golden-joy',
      title: 'Golden Joy & Beijing: Tangra Chinatown Hakka Feasts',
      subtitle: 'The Birthplace of Indian Chinese Cuisine in East Kolkata',
      bengaliTitle: 'ট্যাংরা চায়নাটাউনের গোল্ডেন জয়',
      location: 'Matheswartala Road, Tangra Chinatown',
      region: 'central',
      regionLabel: 'East-Central Tangra',
      category: 'chinese-restaurant',
      categories: ['chinese-restaurant', 'asian-restaurant', 'fast-food-restaurant', 'bar-grill'],
      timing: 'Best: 12:30 PM – 3:30 PM & 6:30 PM – 11:30 PM',
      priceRange: '₹600 – ₹1,200 for two',
      description: 'The beating heart of India’s only Chinatown. Tangra’s legendary family kitchens dish out colossal platters of Hakka Chili Chicken, Golden Fried Prawns, and Crispy Pepper Squid.',
      heritageLore: 'When Hakka Chinese migrants settled in Kolkata during the late 18th century, they established tanneries in Tangra. Soon, home kitchens began serving fellow workers with ancestral recipes adapted with local fiery green chilies, dark soy sauce, and garlic. Golden Joy and Beijing Restaurant pioneered the globally adored "Indo-Chinese" genre. The woks roar over high-pressure jet flames, tossing noodles and dumplings in seconds.',
      quote: '“Where century-old Hakka family recipes met Bengal’s insatiable love for heat.”',
      tag: 'Tangra Chinatown Legend',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Golden Joy Restaurant', address: 'Matheswartala Road, Tangra Chinatown', landmark: 'Chinatown main strip' },
        { name: 'Beijing Restaurant', address: '77/1 Christopher Road, Tangra', landmark: 'Known for Peking delicacies and golden prawns' }
      ],
      signatureItems: [
        'Tangra Style Dry Chili Chicken with crunchy spring onions',
        'Crispy Golden Fried Tiger Prawns with hot garlic sauce',
        'Hakka Pork Chowmein tossed on smoking wok',
        'Steamed Chicken Wantons in chili garlic oil'
      ],
      nativeTips: [
        'Tangra portions are famously massive—always order family-style to share among friends.',
        'Visit during Chinese New Year in January/February for dazzling lion and dragon dances on the street.'
      ],
      transitGuide: 'Take taxi or auto from Science City or Sealdah Station down the EM Bypass to Matheswartala Road.',
      atmosphere: 'Red festive lanterns, crackling high-flame woks, joyful multi-generation family gatherings, and aroma of toasted sesame.'
    },
    {
      id: 'anand-restaurant-russell-st',
      title: 'Anand Restaurant’s Paper Butter Dosa & Filter Kaapi',
      subtitle: 'Russell Street’s Pure-Ghee Temple of South Indian Craft',
      bengaliTitle: 'আনন্দ রেস্তোরাঁর সাউথ ইন্ডিয়ান ধোসা',
      location: '19 Russell Street (Near Park Street)',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'south-indian-restaurant',
      categories: ['south-indian-restaurant', 'indian-restaurant', 'cafe', 'fast-food-restaurant'],
      timing: 'Best: 8:00 AM – 11:00 AM Breakfast & 4:30 PM – 9:00 PM Tiffin',
      priceRange: '₹120 – ₹300 for two',
      description: 'Since the 1960s, Anand on Russell Street has been the gold standard of authentic South Indian vegetarian cuisine in Kolkata—famous for 2-foot long golden Paper Butter Dosas and frothy brass-tumbler Filter Coffee.',
      heritageLore: 'Founded in the 1960s by South Indian culinary migrants on quiet Russell Street right behind Park Street, Anand became the cherished morning ritual for Kolkata’s corporate executives, lawyers, and food connoisseurs. Every dosa is poured from perfectly fermented urad dal and parboiled rice batter onto giant circular iron griddles seasoned with pure cow ghee. The sambar is slow-cooked with fresh drumsticks, shallots, and hand-ground spices, accompanied by fresh coconut chutney ground every morning.',
      quote: '“Two feet of paper-thin golden crunch dunked in scalding drumstick sambar.”',
      tag: 'Pure South Indian',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Anand Restaurant', address: '19 Russell Street, Park Street area', landmark: 'Opposite Russell Exchange / Near Bengal Club (Est. 1960s)' },
        { name: 'Banana Leaf', address: 'Lake Market, Southern Avenue', landmark: 'Famous for authentic banana-leaf South Indian thalis' }
      ],
      signatureItems: [
        'Special Paper Butter Masala Dosa with spiced aloo filling',
        'Steaming Idli-Vada Combo submerged in hot sambar',
        'Crisp Rava Onion Dosa with green chili chutney',
        'South Indian Filter Kaapi served in traditional brass dabara'
      ],
      nativeTips: [
        'Pour the filter coffee back and forth between the brass tumbler and dabara to generate a velvety layer of froth before drinking.',
        'The Onion Rava Dosa arrives laced with roasted cashews and cumin—order it extra crisp!'
      ],
      transitGuide: 'Park Street Metro Station. Walk 2 minutes down Park Street and turn into Russell Street.',
      atmosphere: 'Bustling breakfast hum, aroma of roasted cumin, asafoetida, ghee, and steaming filter coffee in gleaming brass cups.'
    },
    {
      id: 'olypub-park-street',
      title: 'Olypub’s 1947 Heritage Beef Steak & Chilled Beer Adda',
      subtitle: 'Kolkata’s Timeless Democratic Park Street Watering Hole',
      bengaliTitle: 'অলি পাবের ঐতিহাসিক বিয়ার ও আড্ডা',
      location: '21 Park Street (Est. 1947)',
      region: 'central',
      regionLabel: 'Park Street Boulevard',
      category: 'pub',
      categories: ['pub', 'bar-grill', 'bistro', 'continental-restaurant'],
      timing: 'Best: 12:00 PM – 11:00 PM Daily',
      priceRange: '₹300 – ₹700 for two',
      description: 'Established in 1947 as Olympia Bar, "Oly" is Park Street’s legendary democratic institution. Famous for dark mahogany booths, chilled beer, Chateaubriand steak, and unending intellectual debates.',
      heritageLore: 'While glamorous neon lounges come and go on Park Street, Olypub has stood stubbornly timeless since 1947. Founded as Olympia Bar, it democratized Kolkata’s nightlife by providing affordable beers and legendary European grills to university scholars, journalists, artists, and working Calcuttans. Its signature Chateaubriand steak—tenderized fillet sizzled with onions, crushed black pepper, boiled butter veggies, and French fries—is legendary across Bengal.',
      quote: '“Where poets, professors, and bohemians have debated the fate of the world over cold pints since 1947.”',
      tag: '1947 Heritage Tavern',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Olypub (Olympia Bar)', address: '21 Park Street, Karnani Mansion', landmark: 'Right beside Kusum Rolls on Park Street (Est. 1947)' },
        { name: 'Someplace Else', address: 'The Park Hotel, 17 Park Street', landmark: 'Iconic British pub known for live rock bands' }
      ],
      signatureItems: [
        'Chateaubriand Steak with fried egg and mashed potatoes',
        'Chicken Steak in rich brown pepper jus',
        'Crispy Fish Finger with pungent Kasundi mustard',
        'Chilled Draught Pitchers with spicy fried peanuts'
      ],
      nativeTips: [
        'Grab a wooden booth on the ground floor to immerse yourself in decades of Calcutta intellectual adda.',
        'Order the steak medium-well with an extra sunny-side-up egg on top.'
      ],
      transitGuide: 'Park Street Metro Station. Walk 100 meters east down Park Street, right next to Karnani Mansion.',
      atmosphere: 'Dark mahogany booths, low ambient lighting, clinking beer glasses, and passionate debates spanning football, politics, and literature.'
    },
    {
      id: 'the-dhaba-ballygunge',
      title: 'The Dhaba’s 1945 Ballygunge Tadka Dal & Keema Naan',
      subtitle: 'Generations of Late-Night Smoky Highway Flavors in the Heart of South Kolkata',
      bengaliTitle: 'বালিগঞ্জের ঐতিহ্যবাহী ধাবার তরকা ডাল',
      location: '54 Ballygunge Circular Road (Est. 1945)',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'north-indian-restaurant',
      categories: ['north-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
      timing: 'Best: 12:00 PM – 3:30 PM & 7:00 PM – 1:30 AM Late Night',
      priceRange: '₹250 – ₹600 for two',
      description: 'Founded right after World War II in 1945, The Dhaba on Ballygunge Phari pioneered North Indian highway food in Kolkata, famous for its smoky charcoal-cooked Egg Tadka Dal, Butter Chicken, and stuffed kulchas.',
      heritageLore: 'When Punjabi transporters and families settled in South Calcutta in the 1940s, The Dhaba brought authentic charcoal clay-tandoor cooking to Ballygunge Circular Road. Its most iconic contribution to Kolkata’s culinary vernacular is "Egg Tadka"—green whole moong dal slow-cooked overnight on charcoal embers, finished on a screaming-hot iron skillet with scrambled eggs, butter, roasted cumin, and ginger. Generations of Calcuttans make midnight car drives to Ballygunge Phari solely for hot rumali rotis and piping egg tadka.',
      quote: '“The smoky perfume of charcoal tandoor and butter tadka comforting nocturnal Kolkata since 1945.”',
      tag: '1945 Highway Legend',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'The Dhaba', address: '54 Ballygunge Circular Road, Ballygunge Phari', landmark: 'Ballygunge Phari crossing (Est. 1945)' },
        { name: 'Honey Da Dhaba', address: 'VIP Road, Kankurgachi', landmark: 'Late-night Punjabi dining' }
      ],
      signatureItems: [
        'Special Mutton Keema Tadka Dal with scrambled eggs',
        'Smoky Butter Chicken in velvety tomato gravy',
        'Tandoori Garlic Naan straight from clay oven',
        'Kolkata Style Reshmi Kebab with fresh mint chutney'
      ],
      nativeTips: [
        'Ask for "Double Dimer Tadka" (double egg) for an extra rich and creamy texture.',
        'Late-night adda tip: Park outside after midnight for steaming aluminum foil packages delivered right to your car.'
      ],
      transitGuide: 'Netaji Bhavan Metro Station, followed by a 7-minute cab ride down Ballygunge Circular Road.',
      atmosphere: 'Aroma of charcoal tandoor, melting dollops of white butter, roaring engines, and bustling midnight supper crowds.'
    },
    {
      id: 'roastery-coffee-house-kolkata',
      title: 'Roastery Coffee House’s Heritage Bungalow & Specialty Brews',
      subtitle: 'Artisanal Pour-Overs & Cold Brews in a 19th-Century South Calcutta Courtyard',
      bengaliTitle: 'রোস্টারি কফি হাউস ও স্পেশালিটি কফি',
      location: '70B Hindustan Park, Gariahat',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'coffee-shop',
      categories: ['coffee-shop', 'cafe', 'bistro', 'dessert-restaurant'],
      timing: 'Best: 8:00 AM – 10:30 PM Daily',
      priceRange: '₹350 – ₹750 for two',
      description: 'Set inside a vintage colonial bungalow with a verdant courtyard in Hindustan Park, Roastery Coffee House represents Kolkata’s specialty coffee renaissance—serving precision single-origin pour-overs, Cascara brews, and artisanal platters.',
      heritageLore: 'Kolkata’s storied coffee culture, long centered around the nostalgic debates of College Street Coffee House, found its contemporary revival at Roastery Coffee House in Hindustan Park. Situated inside an aristocratic heritage mansion with red-oxide floors, checkerboard verandahs, and banyan foliage, Roastery sources single-estate beans from Indian plantations in Chikmagalur and Araku Valley. Skilled baristas prepare manual pour-overs using V60, Aeropress, and Syphon brewers.',
      quote: '“Where slow-dripped single origin coffees brew beneath century-old banyan boughs.”',
      tag: 'Specialty Coffee Sanctuary',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Roastery Coffee House', address: '70B Hindustan Park, Gariahat', landmark: 'Inside vintage bungalow, near Gariahat Post Office' },
        { name: 'Sienna Store & Cafe', address: '49/1 Hindustan Park', landmark: 'Artisanal ceramics and slow food cafe' }
      ],
      signatureItems: [
        'Specialty Cold Brew Coffee poured over crystal ice balls',
        'Monsoon Malabar Manual Pour-Over (V60)',
        'Cranberry Coffee Sparkler',
        'Artisanal Onion Rings & Cheesy Macaroni Sizzler'
      ],
      nativeTips: [
        'Sit in the outdoor garden courtyard during winter afternoons for soft sunlight filtering through vintage trees.',
        'Try their Cascara iced tea brewed from sun-dried coffee cherry skins.'
      ],
      transitGuide: 'Kalighat Metro Station. Walk 8 minutes east down Rash Behari Avenue into Hindustan Park.',
      atmosphere: 'Chirping songbirds in courtyard trees, aroma of freshly roasted Arabica beans, soft indie jazz, and relaxed creative conversations.'
    },
    {
      id: 'trincas-park-street',
      title: 'Trincas & The Golden Era of Park Street Live Jazz & Sizzlers',
      subtitle: 'The 1959 Birthplace of Indian Pop Music, Sizzling Steaks & Nightlife',
      bengaliTitle: 'ট্রিঙ্কাস ও পার্ক স্ট্রিটের লাইভ জ্যাজ',
      location: '17 Park Street, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Park Street',
      category: 'pub',
      categories: ['pub', 'bar-grill', 'bistro', 'continental-restaurant'],
      timing: 'Best: 12:00 PM – 11:30 PM (Live Music: 6:00 PM onwards)',
      priceRange: '₹800 – ₹1,500 for two',
      description: 'The legendary birthplace of Park Street nightlife since 1959. Usha Uthup began her career here. Sip chilled draughts and cocktails under amber chandeliers while savoring classic mixed sizzlers and listening to live retro pop and jazz.',
      heritageLore: 'Originally established in 1939 as a tea room by Swiss confectioner Mr. Trinca, it was bought in 1959 by Om Prakash Puri and Ellis Joshua, who converted it into a live music restaurant. Trincas became the epicenter of India’s swinging sixties. Iconic singers like Usha Uthup, Biddu, and Eve performed here before jam-packed crowds of diplomats, movie stars, and jazz aficionados. The old-world hospitality, deep mahogany arches, and live band stage remain entirely preserved.',
      quote: '“Park Street’s original stage where Calcutta learned to swing, dine, and dance.”',
      tag: 'Heritage Live Pub',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Trincas (Main Dining & Tavern)', address: '17 Park Street', landmark: 'Opposite Stephen Court' },
        { name: 'The Other Room at Trincas', address: '17 Park Street (Annex)', landmark: 'Intimate cocktail lounge' }
      ],
      signatureItems: [
        'Classic Tenderloin Steak Sizzler with herb butter & grilled onions',
        'Shredded Crispy Lamb with dry chilies & scallions',
        'Signature Trincas Gin Tonic & draught ale'
      ],
      nativeTips: [
        'Book or walk in by 6:30 PM on weekends to grab a table right in front of the live music bandstand.',
        'Order their sizzlers—the cast iron sizzler platter arrives billowing with fragrant, buttery steam.'
      ],
      transitGuide: 'Park Street Metro Station. Walk 2 minutes east along Park Street.',
      atmosphere: 'Amber lights, live saxophone melodies, clinking beer mugs, and nostalgic Park Street glamour.'
    },
    {
      id: 'someplace-else-the-park',
      title: 'Someplace Else & Classic British Pub Rock',
      subtitle: 'India’s Most Iconic Live Blues & Rock Sanctuary Since 1994',
      bengaliTitle: 'সামপ্লেস এলস লাইভ রক পাব',
      location: 'The Park Hotel, 17 Park Street, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Park Street',
      category: 'pub',
      categories: ['pub', 'bar-grill', 'bistro'],
      timing: 'Best: 4:30 PM – Midnight (Live bands start around 8:00 PM)',
      priceRange: '₹1,200 – ₹2,200 for two',
      description: 'A dark, wood-paneled British pub nestled inside The Park. Famous as India’s longest-running live rock venue, where top independent bands perform blues, classic rock, and alternative tracks every single evening.',
      heritageLore: 'Since opening in 1994, Someplace Else has had no rival in India’s rock culture. With no entry fee and zero pretense, it became a holy sanctuary for live indie musicians. Renowned acts like Skinny Alley, Lou Majaw, Cactus, and Fossils played here. With dark oak tables, brass footrails, and vintage rock memorabilia, the pub has delivered uninterrupted live music 365 nights a year for three decades.',
      quote: '“No cover charges, no fake poses—strictly pure rock and roll and cold draught beer.”',
      tag: 'Legendary Rock Pub',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Someplace Else', address: 'Ground Floor, The Park Hotel, 17 Park Street', landmark: 'Park Street entrance' }
      ],
      signatureItems: [
        'Fresh Draught Beer on Tap (Pitchers & Mugs)',
        'Devilled Chicken Skewers with mustard dip',
        'Loaded Pub Nachos with spiced salsa & melted cheese'
      ],
      nativeTips: [
        'Arrive by 7:45 PM to grab bar stools near the stage—by 9:00 PM, the pub is packed wall-to-wall with music lovers singing every lyric.'
      ],
      transitGuide: 'Park Street Metro Station. Direct entrance via The Park Hotel lobby.',
      atmosphere: 'Electric guitar riffs, cheering crowds, vintage dark wood, and ice-cold beer mugs.'
    },
    {
      id: 'broadway-hotel-bar',
      title: 'The Historic 1903 Broadway Hotel & Babu Bar',
      subtitle: 'Chandni Chowk’s Century-Old Bohemian Tavern & Fish Fingers',
      bengaliTitle: 'ব্রডওয়ে হোটেল ও বাবুদের ঐতিহাসিক বার',
      location: '27A Ganesh Chandra Avenue, Chandni Chowk, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Esplanade',
      category: 'pub',
      categories: ['pub', 'bistro', 'continental-restaurant'],
      timing: 'Best: 1:00 PM – 10:00 PM',
      priceRange: '₹400 – ₹800 for two',
      description: 'Founded in 1903, Broadway Hotel preserves the nostalgic charm of colonial Calcutta’s watering holes: high ceilings, whirring antique fans, vintage waiters, affordable chilled beer, and legendary crispy crumbed fish fingers.',
      heritageLore: 'During the Second World War, American and British soldiers frequented Broadway Hotel along Central Calcutta’s bustling commercial district. Through the decades, journalists from The Statesman, High Court barristers, artists, and university professors made it their beloved adda tavern. The interior remains delightfully suspended in time: green and cream walls, cast-iron pillars, heavy teak furniture, and vintage beer coasters.',
      quote: '“Unchanged since 1903—where generations of Calcutta babus debate over beer and kasundi fish fingers.”',
      tag: 'Century-Old Tavern',
      image: 'https://images.unsplash.com/photo-1538488881522-4326c36da6ac?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Broadway Hotel Bar', address: '27A Ganesh Chandra Avenue', landmark: 'Near Chandni Chowk Metro Gate 2 (Est. 1903)' }
      ],
      signatureItems: [
        'Classic Kolkata Crumb-Fried Bhetki Fish Fingers with Kasundi',
        'Crispy Chili Chicken (Old Calcutta style)',
        'Affordable Chilled Draught & Bottled Beers'
      ],
      nativeTips: [
        'Dip your fish fingers into their fiery house-ground Kasundi mustard.',
        'Best experienced on a rainy afternoon while watching yellow cabs splash through Ganesh Chandra Avenue.'
      ],
      transitGuide: 'Chandni Chowk Metro Station (Exit Gate 2). Walk 150 meters down Ganesh Chandra Avenue.',
      atmosphere: 'Sepia-toned nostalgic adda, clinking porcelain and glassware, and friendly banter.'
    },
    {
      id: 'the-grid-brewery',
      title: 'The Grid Microbrewery & Gastropub Lounge',
      subtitle: 'Kolkata’s Flagship Craft Microbrewery & Artisanal Wood-Fired Pies',
      bengaliTitle: 'দ্য গ্রিড মাইক্রোব্রুয়ারি ও গ্যাস্ট্রোপাব',
      location: '86A Topsia Road, EM Bypass, East Kolkata',
      region: 'east',
      regionLabel: 'East Kolkata & Tangra',
      category: 'pub',
      categories: ['pub', 'bar-grill', 'bistro', 'pizza-restaurant'],
      timing: 'Best: 12:00 PM – Midnight',
      priceRange: '₹1,200 – ₹2,400 for two',
      description: 'A sprawling 10,000 sq ft industrial-chic craft microbrewery along the EM Bypass. Famous for in-house crafted Belgian Witbiers, IPAs, craft ciders, and blistered sourdough pizzas baked in an imported wood oven.',
      heritageLore: 'Pioneering Kolkata’s modern microbrewery movement, The Grid transformed the city’s nightlife with state-of-the-art German brewing equipment. Its design features exposed brick, copper pipes, and a giant Lego bar that pays homage to design architecture. It has won numerous national awards for Best Microbrewery in Eastern India.',
      quote: '“Craft beer brewed to precision along the eastern arteries of the city.”',
      tag: 'Craft Microbrewery',
      image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'The Grid Microbrewery', address: '86A Haute Street Corporate Park, Topsia', landmark: 'Off EM Bypass, near Topsia police station' }
      ],
      signatureItems: [
        'Calcutta Wheat Belgian Wit with coriander & Gondhoraj zest',
        'Wood-Fired Truffle & Wild Mushroom Sourdough Pizza',
        'Smoked BBQ Pork Ribs with house cider glaze'
      ],
      nativeTips: [
        'Order the Beer Flight Sampler to taste 4 seasonal craft brews before committing to a pint.'
      ],
      transitGuide: 'Take EM Bypass via yellow taxi or cab towards Topsia / Science City.',
      atmosphere: 'Industrial copper vats, pulsating DJ beats, chic urban crowd, and fresh malt aroma.'
    },
    {
      id: 'fabbrica-della-pizza',
      title: 'Fabbrica della Pizza’s Wood-Fired Neapolitan Pies',
      subtitle: 'Kolkata’s Benchmark Sourdough Pizza Baked at 450°C',
      bengaliTitle: 'ফ্যাব্রিকা দেল্লা পিৎজা',
      location: '8A Allenby Road, Forum Mall area, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'pizza-restaurant',
      categories: ['pizza-restaurant', 'italian-restaurant', 'bistro'],
      timing: 'Best: 12:00 PM – 10:30 PM',
      priceRange: '₹800 – ₹1,500 for two',
      description: 'The pizzeria that redefined Italian dining in Kolkata. Hand-stretched sourdough crusts, Italian Caputo flour, San Marzano tomato sauce, and creamy Fior di Latte cheese baked in 90 seconds inside a roaring imported wood-fired oven.',
      heritageLore: 'Founded to bring true Neapolitan pizza standards to Bengal, Fabbrica respects strict Verace Pizza Napoletana traditions. Their sourdough dough is slow-fermented for over 48 hours, creating light, digestible crusts with signature leopard-spotted char blisters.',
      quote: '“Leopard-spotted sourdough crusts that transport you straight to the cobblestones of Naples.”',
      tag: 'Neapolitan Pizzeria',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Fabbrica della Pizza', address: '8A Allenby Road, Lala Lajpat Rai Sarani', landmark: 'Behind Forum Mall Elgin Road' }
      ],
      signatureItems: [
        'Pizza Margherita D.O.P with Buffalo Mozzarella & Fresh Basil',
        'Quattro Formaggi (Four Cheese with Gorgonzola & hot honey)',
        'Polenta Truffle Fries & House Tiramisu'
      ],
      nativeTips: [
        'Eat the pizza immediately when served hot—fold the soft, pillowy tip like a Neapolitan local.'
      ],
      transitGuide: 'Netaji Bhavan Metro Station. Walk 4 minutes down Elgin Road past Forum Mall into Allenby Road.',
      atmosphere: 'Wood smoke aromas, warm Mediterranean brick decor, and cozy trattoria energy.'
    },
    {
      id: 'sorano-ho-chi-minh',
      title: 'Sorano’s Tuscan Villa & Handmade Artisanal Pasta',
      subtitle: 'Courtyard Italian Elegance, Truffle Agnolotti & Burrata',
      bengaliTitle: 'সোরাণো ইতালিয়ান কোর্টইয়ার্ড',
      location: '24 Ho Chi Minh Sarani, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Park Street',
      category: 'italian-restaurant',
      categories: ['italian-restaurant', 'bistro', 'continental-restaurant'],
      timing: 'Best: 12:30 PM – 11:00 PM',
      priceRange: '₹1,500 – ₹2,800 for two',
      description: 'An idyllic Italian villa retreat hidden on Ho Chi Minh Sarani. Offering sun-kissed terracotta terraces, house-made extruded pastas, fresh burrata imported from Puglia, and exquisite Italian wine pairings.',
      heritageLore: 'Sorano was designed like an authentic Tuscan farmhouse with stucco walls, brick arches, and lemon trees. It quickly emerged as Kolkata’s premier fine-dining destination for authentic Northern and Southern Italian recipes, focusing on scratch-made pastas and delicate emulsions.',
      quote: '“A secret Italian courtyard where hand-rolled pastas and Tuscan sunlight meet.”',
      tag: 'Fine Italian Trattoria',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Sorano', address: '1st Floor, 24 Ho Chi Minh Sarani', landmark: 'Near US Consulate & British Council' }
      ],
      signatureItems: [
        'Truffle Cacio e Pepe in handmade Tagliolini',
        'Pugliese Burrata with Heirloom Tomatoes & Pesto',
        'Classic Sicilian Cannoli with pistachio ricotta'
      ],
      nativeTips: [
        'Reserve in advance for the alfresco courtyard tables during winter evenings.'
      ],
      transitGuide: 'Maidan or Rabindra Sadan Metro Station. Walk 5 minutes down Ho Chi Minh Sarani.',
      atmosphere: 'Terracotta walls, olive branches, intimate candlelit tables, and soft Italian classical strings.'
    },
    {
      id: 'sienna-cafe-hindustan-park',
      title: 'Sienna Store & Cafe’s Bengal Farm-to-Table Plates',
      subtitle: 'Artisanal Studio Cafe Celebrating Indigenous Terroir & Specialty Coffee',
      bengaliTitle: 'সিয়েনা স্টোর ও ক্যাফে',
      location: '49/1 Hindustan Park, Gariahat, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'cafe',
      categories: ['cafe', 'bistro', 'coffee-shop', 'continental-restaurant'],
      timing: 'Best: 9:00 AM – 9:30 PM',
      priceRange: '₹800 – ₹1,600 for two',
      description: 'Globally celebrated in international culinary journals, Sienna marries handcrafted studio pottery with farm-fresh regional cooking: Gondhoraj fried chicken, Bhetki carpaccio, seasonal Bengal greens, and artisanal hand-brewed coffees.',
      heritageLore: 'Starting as an indigenous ceramics workshop in Santiniketan, Sienna expanded into a bohemian courtyard cafe in South Kolkata. The chefs work closely with local Bengal farmers, transforming humble indigenous ingredients—like Kalonji, Bandel cheese, and Gondhoraj lime—into cutting-edge contemporary bistro plates served on handmade earthenware.',
      quote: '“An artisanal celebration of Bengal’s soul, from Santiniketan pottery to hyper-local produce.”',
      tag: 'Artisanal Studio Cafe',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Sienna Store & Cafe (Main)', address: '49/1 Hindustan Park, Gariahat', landmark: 'Inside artistic red brick alley' },
        { name: 'Sienna Cafe Salt Lake', address: 'Block IB, Sector III, Salt Lake', landmark: 'Near Karunamoyee' }
      ],
      signatureItems: [
        'Fried Chicken with Gondhoraj Lemon & house Kasundi Mayo',
        'Handmade Gnocchi in seasonal Bengal greens & Bandel cheese sauce',
        'Dark Chocolate Sea Salt Tart on hand-thrown clay plates'
      ],
      nativeTips: [
        'Browse the handcrafted ceramics and handwoven linen jackets in the adjacent boutique while your order brews.'
      ],
      transitGuide: 'Kalighat or Gariahat crossing. Walk into Hindustan Park lane.',
      atmosphere: 'Clay lamps, leafy terracotta courtyard, Indie folk music, and vibrant artistic adda.'
    },
    {
      id: 'eau-chew-chimney-soup',
      title: 'Eau Chew & The 1927 Charcoal Chimney Soup',
      subtitle: 'India’s Oldest Family-Run Chinese Dining Institution',
      bengaliTitle: 'ও চিউ ও ঐতিহাসিক চিমনি স্যুপ',
      location: '12 Ganesh Chandra Avenue, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Esplanade',
      category: 'chinese-restaurant',
      categories: ['chinese-restaurant', 'asian-restaurant', 'fast-food-restaurant'],
      timing: 'Best: 12:00 PM – 2:30 PM Lunch / 6:30 PM – 10:00 PM Dinner',
      priceRange: '₹600 – ₹1,200 for two',
      description: 'Founded in 1927 by the Huang family, Eau Chew is India’s oldest continuously run Chinese restaurant. Revered for its brass Chimney Soup heated by glowing coal briquettes at the center of the table and original Josephine noodles.',
      heritageLore: 'When founder Huang Lou Cheu arrived in Calcutta from Guangzhou in the 1920s, he cooked authentic Cantonese home recipes for Chinese traders and merchants. Four generations later, the family still personally supervises the kitchen. Their Chimney Soup arrives in an antique brass samovar-style pot with glowing coals burning up a central chimney, boiling a delicate broth of chicken, bhetki fish, pork meatballs, and greens.',
      quote: '“A glowing coal chimney boiling century-old Cantonese family broths.”',
      tag: '1927 Heritage Chinese',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Eau Chew Restaurant', address: '12 Ganesh Chandra Avenue (1st Floor)', landmark: 'Near Chandni Chowk Metro Gate 1 (Est. 1927)' }
      ],
      signatureItems: [
        'Legendary Coal-Fired Chimney Soup (with fish, chicken, egg & greens)',
        'Josephine Noodles (crispy pan-fried noodles blanketed in gravy)',
        'Steamed Whole Bhetki Fish in ginger, scallions & light soy'
      ],
      nativeTips: [
        'Chimney Soup must be ordered at least 2 hours in advance or right at the start of your meal so the coal handis can be fired!'
      ],
      transitGuide: 'Chandni Chowk Metro Station. Walk 2 minutes down Ganesh Chandra Avenue.',
      atmosphere: 'Clattering porcelain soup spoons, nostalgic red booths, and rich simmering bone broth aromas.'
    },
    {
      id: 'beijing-restaurant-tangra',
      title: 'Beijing Restaurant & The Wok Legends of Tangra Chinatown',
      subtitle: 'Hakka Chinese Feasts, Golden Prawns & Crispy Pork',
      bengaliTitle: 'বেইজিং রেস্তোরাঁ ও ট্যাংরা চাইনিজ',
      location: '77/1 Christopher Road, Tangra Chinatown, East Kolkata',
      region: 'east',
      regionLabel: 'East Kolkata & Tangra',
      category: 'chinese-restaurant',
      categories: ['chinese-restaurant', 'asian-restaurant', 'bar-grill'],
      timing: 'Best: 12:30 PM – 3:30 PM & 6:30 PM – 11:30 PM',
      priceRange: '₹800 – ₹1,600 for two',
      description: 'The shining crown of Tangra Chinatown. Renowned for authentic wok hei (breath of the wok), offering succulent Golden Fried Prawns, Hakka chili pork, and sizzling platters inside a vibrant, lantern-lit dining room.',
      heritageLore: 'Tangra was historically Kolkata’s Hakka leather-tanning hub. When tanneries relocated, the community turned their ancestral residences into magnificent restaurants, birthing the world-famous "Indian-Chinese" flavor profile. Beijing Restaurant has welcomed dignitaries, celebrities, and families for over four decades.',
      quote: '“Where giant iron woks roar with fire, creating the definitive flavor of Tangra.”',
      tag: 'Tangra Chinatown Flagship',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Beijing Restaurant', address: '77/1 Christopher Road, Tangra', landmark: 'Near Tangra Chinatown arch' },
        { name: 'Big Boss Restaurant', address: '54C Matheswartala Road, Tangra', landmark: 'Adjacent Tangra dining institution' }
      ],
      signatureItems: [
        'Golden Fried Butterfly Prawns with sweet chili dip',
        'Crispy Chili Honey Pork with scallions',
        'Hakka Mixed Wok Chowmein loaded with egg, chicken & prawns'
      ],
      nativeTips: [
        'Tangra restaurants have generous portion sizes—order dishes to share family-style across the table.'
      ],
      transitGuide: 'Drive down EM Bypass to the Science City junction and turn into Tangra Chinatown.',
      atmosphere: 'Red Chinese paper lanterns, dragon motifs, sizzling woks, and buzzing weekend family banquets.'
    },
    {
      id: 'banana-leaf-south-indian',
      title: 'Banana Leaf’s Ghee Roast Dosas & Filter Kaapi',
      subtitle: 'The South Kolkata Benchmark for Piping Hot Dosas on Fresh Leaves',
      bengaliTitle: 'ব্যানানা লিফ দক্ষিণ ভারতীয় খাবার',
      location: '77/1A Rash Behari Avenue, Lake Market, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'south-indian-restaurant',
      categories: ['south-indian-restaurant', 'indian-restaurant', 'cafe'],
      timing: 'Best: 7:00 AM – 10:30 PM Daily',
      priceRange: '₹250 – ₹550 for two',
      description: 'The indisputable South Kolkata standard for South Indian comfort. Crispy paper-thin ghee roast dosas, fluffy steamed idlis, and spicy Chettinad gravies served on cut green banana leaves with frothy filter coffee.',
      heritageLore: 'For generations of South Kolkata residents living around Southern Avenue and Lake Market, weekend morning breakfast means queueing on Rash Behari Avenue for Banana Leaf. The aromatic hiss of fermented lentil batter on giant black tawas and bubbling kettles of sambar define the neighborhood ritual.',
      quote: '“Crisp golden dosas glistening with ghee, unrolled on fresh emerald banana leaves.”',
      tag: 'Authentic South Indian',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Banana Leaf (Lake Market)', address: '77/1A Rash Behari Avenue', landmark: 'Opposite Lake Market complex' },
        { name: 'Ramkrishna Lunch Home', address: 'Sarat Bose Road', landmark: 'Decades-old Udipi classic' }
      ],
      signatureItems: [
        'Special Mysore Ghee Masala Dosa with red chili-garlic chutney spread',
        'Medu Vada dipped in hot Drumstick Sambar',
        'Frothy South Indian Degree Filter Coffee served in brass dabara'
      ],
      nativeTips: [
        'Pour your hot filter coffee back and forth between the brass dabara and tumbler from high up to aerate the frothy crema.'
      ],
      transitGuide: 'Kalighat Metro Station. Walk 3 minutes east toward Lake Market on Rash Behari Avenue.',
      atmosphere: 'Fast, efficient brass service, aromatic wafts of curry leaves and roasted asafoetida.'
    },
    {
      id: 'ramkrishna-lunch-home',
      title: 'Ramkrishna Lunch Home’s Udipi Delights & Vada Sambar',
      subtitle: 'Decades of Traditional Vegetarian Comfort on Sarat Bose Road',
      bengaliTitle: 'রামকৃষ্ণ লাঞ্চ হোম',
      location: '36 Sarat Bose Road, Lansdowne, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'south-indian-restaurant',
      categories: ['south-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant'],
      timing: 'Best: 6:30 AM – 9:30 PM',
      priceRange: '₹200 – ₹450 for two',
      description: 'A no-frills, beloved Udipi heritage eatery on Sarat Bose Road. Famous for featherlight steamed idlis, peppery hot rasam, crisp onion rava dosas, and authentic coconut chutney.',
      heritageLore: 'Founded by South Indian migrants who settled in Calcutta mid-20th century, Ramkrishna Lunch Home has fed university students, morning walkers from Rabindra Sarobar, and working professionals with unpretentious, pocket-friendly homestyle Udipi fare.',
      quote: '“Simple, unhurried, and soul-comforting Udipi breakfast since the 1960s.”',
      tag: 'Heritage Udipi Eatery',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Ramkrishna Lunch Home', address: '36 Sarat Bose Road', landmark: 'Near Paddapukur crossing' }
      ],
      signatureItems: [
        'Onion Rava Masala Dosa (ultra-crisp lacy semolina crepe)',
        'Rasam Vada (crispy medu vada soaked in peppery herbal broth)',
        'Upma with roasted cashews & fresh coconut'
      ],
      nativeTips: [
        'Arrive early between 7:30 AM and 9:00 AM for fresh steaming idlis straight from the multi-tiered aluminum steamers.'
      ],
      transitGuide: 'Netaji Bhavan Metro Station, followed by a 4-minute walk to Sarat Bose Road.',
      atmosphere: 'Retro steel tables, bustling morning regulars with newspapers, and hot filter coffee aromas.'
    },
    {
      id: 'kookie-jar-rawdon',
      title: 'Kookie Jar’s Confectionery Royalty & Chocolate Boats',
      subtitle: 'The Undisputed Monarch of Kolkata Cakes & Savory Puffs Since 1985',
      bengaliTitle: 'কুকি জার ও চকোলেট বোট প্যাস্ট্রি',
      location: '42A Rawdon Street & Alipore, Central/South Kolkata',
      region: 'central',
      regionLabel: 'Central Kolkata',
      category: 'bakery',
      categories: ['bakery', 'cafe', 'dessert-restaurant', 'fast-food-restaurant'],
      timing: 'Best: 8:30 AM – 9:30 PM',
      priceRange: '₹300 – ₹700 for two',
      description: 'Founded in 1985 by sisters Lovey and Puja Kapur, Kookie Jar is Kolkata’s premier confectionery royalty. Celebrated for iconic Chocolate Boat pastries, Lemon Soufflé tarts, and flaky mushroom patties.',
      heritageLore: 'Before Kookie Jar, European confectionery in Calcutta was limited to old colonial tearooms. Kookie Jar revolutionized the city’s sweet tooth with Belgian chocolate ganache, crisp butter crusts, and warm savory bakes. It is an indispensable feature of birthdays, weddings, and high-society tea tables across Bengal.',
      quote: '“No Kolkata celebration is complete without the glossy gold-and-black boxes of Kookie Jar.”',
      tag: 'Confectionery Royalty',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Kookie Jar Rawdon Street (Flagship)', address: '42A Rawdon Street', landmark: 'Near Rawdon Square' },
        { name: 'Kookie Jar Alipore', address: 'Alipore Road', landmark: 'South Kolkata flagship' }
      ],
      signatureItems: [
        'Iconic Chocolate Boat Pastry (glossy dark chocolate ganache in crisp shortcrust)',
        'Flaky Mushroom & Cheese Envelopes',
        'Lemon Tarts with tangy citrus curd',
        'Mocha Praline Gateau'
      ],
      nativeTips: [
        'Grab a Chocolate Boat pastry to-go; the crisp butter shell holds a velvety pool of rich chocolate that melts in the mouth.'
      ],
      transitGuide: 'Rabindra Sadan or Park Street Metro, then a short taxi ride down Park Street to Rawdon Street.',
      atmosphere: 'Gleaming glass showcases, aroma of vanilla extract and warm butter pastry, and busy celebratory patrons.'
    },
    {
      id: 'saldanha-bakery-wellesley',
      title: 'Saldanha Bakery’s 90-Year Goan-Anglo Indian Bakes',
      subtitle: 'Heritage Spiced Walnut Fruit Cakes & Savory Envelope Patties',
      bengaliTitle: 'সালদানহা বেকারি ও ওয়ালনাট কেক',
      location: '19 Nawab Abdur Rahman Street, Wellesley, Central Kolkata',
      region: 'central',
      regionLabel: 'Central & Esplanade',
      category: 'bakery',
      categories: ['bakery', 'sweets-desserts', 'fast-food-restaurant'],
      timing: 'Best: 9:00 AM – 7:30 PM',
      priceRange: '₹200 – ₹600 for two',
      description: 'Established in 1930 by Ubaldo Saldanha, this heritage Goan-Catholic family bakery tucked into a narrow Wellesley lane produces Kolkata’s most revered Rich Walnut Fruit Cake, coconut macaroons, and spiced chicken puffs.',
      heritageLore: 'Running continuously for four generations, Saldanha is the last remaining culinary bridge between Goa, Anglo-India, and Old Calcutta. During Christmas time, queues snake down the alley as thousands order their century-old secret recipe fruit cakes soaked with rum, orange peel, and toasted walnuts.',
      quote: '“A ninety-year-old family oven still baking the city’s favorite spiced fruit cakes.”',
      tag: 'Heritage Anglo-Indian Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Saldanha Bakery', address: '19 Nawab Abdur Rahman Street (Wellesley)', landmark: 'Off Rafi Ahmed Kidwai Road (Est. 1930)' }
      ],
      signatureItems: [
        'Rich Fruit & Walnut Cake (dense with dried peel & butter)',
        'Chicken Envelope Patties with pepper filling',
        'Coconut Snowball Macaroons'
      ],
      nativeTips: [
        'Call ahead during December to reserve your Christmas plum cakes before stocks vanish.'
      ],
      transitGuide: 'Take Metro to Park Street or Esplanade, walk 6 minutes down Rafi Ahmed Kidwai Road.',
      atmosphere: 'Cozy colonial home counter, antique biscuit tins, and warm scents of cinnamon and nutmeg.'
    },
    {
      id: 'mrs-magpie-southern-ave',
      title: 'Mrs. Magpie’s Fairytale Teatime & Artisanal Cupcakes',
      subtitle: 'Whimsical Pastel Parlor, Belgian Hot Chocolate & Scones',
      bengaliTitle: 'মিসেস ম্যাগপাই ক্যাফে ও কাপকেক',
      location: '570 Lake Terrace Road, Southern Avenue, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'cafe',
      categories: ['cafe', 'bakery', 'dessert-restaurant', 'coffee-shop'],
      timing: 'Best: 9:30 AM – 9:30 PM',
      priceRange: '₹500 – ₹1,000 for two',
      description: 'A charming pastel fairy-tale cafe near Southern Avenue. Renowned for miniature iced cupcakes, decadent Belgian hot chocolate with toasted marshmallows, and English cream tea platters.',
      heritageLore: 'Opened by Le Cordon Bleu-trained pastry chef Sohini Basu, Mrs. Magpie brought artisanal British baking aesthetics to Kolkata. Its playful birdhouse wallpaper, vintage floral teacups, and hand-decorated miniature bakes created a cherished sanctuary for slow afternoon teatime adda.',
      quote: '“A whimsical storybook escape filled with the scent of butter cream and hot cocoa.”',
      tag: 'Artisanal Teatime Cafe',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Mrs. Magpie (Southern Avenue)', address: '570 Lake Terrace Road', landmark: 'Near Southern Avenue boulevard' },
        { name: 'Mrs. Magpie (Salt Lake)', address: 'Block EC, Sector I, Salt Lake', landmark: 'City Centre 1 area' }
      ],
      signatureItems: [
        'Belgian Hot Chocolate served with toasted marshmallows',
        'Miniature Cupcakes (Red Velvet, Chocolate Peanut Butter & Salted Caramel)',
        'Traditional English Scones with strawberry preserve & clotted cream'
      ],
      nativeTips: [
        'Order the Afternoon High Tea Platter to sample savory finger sandwiches and sweet mini bakes together.'
      ],
      transitGuide: 'Rabindra Sarobar Metro Station. Walk 5 minutes down Southern Avenue into Lake Terrace.',
      atmosphere: 'Cozy pastel hues, storybook birdhouses, sweet vanilla warmth, and relaxed afternoon tea.'
    },
    {
      id: 'dada-boudi-biryani-barrackpore',
      title: 'Dada Boudi Biryani’s Legendary Mountain of Mutton',
      subtitle: 'The Undisputed Biryani Pilgrimage of Greater Kolkata',
      bengaliTitle: 'দাদা বৌদি বিরিয়ানি (ব্যারাকপুর)',
      location: 'SN Banerjee Road, Barrackpore (Greater North & Side Area)',
      region: 'outer',
      regionLabel: 'Side & Greater Areas',
      category: 'biryani-restaurant',
      categories: ['biryani-restaurant', 'mughlai-biryani', 'mughlai-restaurant', 'indian-restaurant'],
      timing: 'Best: 12:00 PM – 4:00 PM Lunch & 6:30 PM – 10:30 PM Dinner',
      priceRange: '₹350 – ₹700 for two',
      description: 'The supreme biryani destination of Greater Kolkata. Thousands travel on local trains to Barrackpore for colossal 250g succulent falling-off-the-bone mutton shanks served over long-grain fragrant saffron rice and golden potatoes.',
      heritageLore: 'Started in 1968 as a humble railway stall in Barrackpore by Sanjib Saha and his wife (affectionately called Dada and Boudi by locals), this eatery grew into a multi-story culinary powerhouse. Food lovers from all over Bengal make the pilgrimage for their signature rich, aromatic Awadhi-Calcutta hybrid biryani.',
      quote: '“A mountain of golden basmati crowned with a colossal, buttery 250g mutton shank.”',
      tag: 'Greater Kolkata Sensation',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Dada Boudi Restaurant (Main)', address: '1/1 SN Banerjee Road, Barrackpore', landmark: 'Near Barrackpore Railway Station Gate 1 (Est. 1968)' }
      ],
      signatureItems: [
        'Special Mutton Biryani (features colossal 250g tender mutton piece & golden aloo)',
        'Mutton Chaap cooked in thick poppy-seed gravy',
        'Special Shahi Firni in earthen bhaars'
      ],
      nativeTips: [
        'Take a fast local train from Sealdah to Barrackpore (just 35 minutes)—the restaurant is a 2-minute walk from the station exit!'
      ],
      transitGuide: 'Sealdah Suburban Railway to Barrackpore Station (Platform 1 exit).',
      atmosphere: 'Bustling queues, colossal copper degchis opening with aromatic saffron steam, and euphoric foodies.'
    },
    {
      id: 'india-restaurant-kidderpore',
      title: 'India Restaurant’s Awadhi Daan Kebab & Mutton Biryani',
      subtitle: 'The Historic West Calcutta Food Citadel of Karl Marx Sarani',
      bengaliTitle: 'ইন্ডিয়া রেস্তোরাঁ ও খিদিরপুরের বিরিয়ানি',
      location: '34 Karl Marx Sarani, Kidderpore, West Kolkata',
      region: 'outer',
      regionLabel: 'Side & Greater Areas',
      category: 'biryani-restaurant',
      categories: ['biryani-restaurant', 'mughlai-biryani', 'mughlai-restaurant', 'north-indian-restaurant'],
      timing: 'Best: 11:30 AM – 11:30 PM',
      priceRange: '₹400 – ₹850 for two',
      description: 'For over 50 years, India Restaurant has reigned supreme in Kidderpore. Famous for melt-in-the-mouth Daan Kebabs, aromatic Kolkata mutton biryani, and rich Awadhi Galawatis slow-cooked with royal Lucknowi spices.',
      heritageLore: 'Kidderpore, the historic dockland of Kolkata, developed a rich culinary scene influenced by Awadhi nawabs and migrant traders. Founded in 1974, India Restaurant elevated Mughlai dining in the area, winning state awards for the best Mughlai cuisine in Eastern India.',
      quote: '“The unsung jewel of Kidderpore, where kebabs melt on the tongue like silk.”',
      tag: 'Kidderpore Mughlai Legend',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'India Restaurant', address: '34 Karl Marx Sarani, Kidderpore', landmark: 'Near Kidderpore Tram Depot (Est. 1974)' }
      ],
      signatureItems: [
        'Special Mutton Biryani with tender dum meat and spiced aloo',
        'Daan Kebab (succulent marinated tender meat char-grilled to velvet perfection)',
        'Mutton Galawati Kebab with Ulta Tawa Paratha'
      ],
      nativeTips: [
        'Pair your biryani with their famous Daan Kebab—a signature dish unique to India Restaurant.'
      ],
      transitGuide: 'Take a yellow taxi down Diamond Harbour Road to the Karl Marx Sarani crossing.',
      atmosphere: 'Family-friendly banquet halls, wafts of rose water and mace, and royal Mughlai hospitality.'
    },
    {
      id: 'oudh-1590-deshapriya',
      title: 'Oudh 1590’s Royal Awadhi Period Dining & Raan Biryani',
      subtitle: 'Recreating 19th-Century Lucknowi Court Feasts in South Calcutta',
      bengaliTitle: 'অবধ ১৫৯০ ও রাজকীয় বিরিয়ানি',
      location: 'Deshapriya Park & Salt Lake Sector I, South/East Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'mughlai-biryani',
      categories: ['mughlai-biryani', 'biryani-restaurant', 'mughlai-restaurant', 'indian-restaurant'],
      timing: 'Best: 12:00 PM – 3:30 PM & 6:30 PM – 10:30 PM',
      priceRange: '₹800 – ₹1,600 for two',
      description: 'India’s first period-dining Awadhi restaurant. Guests step into a 19th-century royal court with antique bronze lamps, Sarod ragas, Dum Pukht Raan Biryani, tender Kakori kebabs, and Shahi Tukda.',
      heritageLore: 'Conceived to revive the gastronomic zenith of Nawab Wajid Ali Shah’s royal kitchens, Oudh 1590 uses authentic brass handis sealed with dough. The chefs recreate centuries-old recipes utilizing saffron, kewra, mace, and rose petals.',
      quote: '“A royal durbar feast steeped in the romantic poetry and slow-dum aromas of Awadh.”',
      tag: 'Period Awadhi Dining',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Oudh 1590 Deshapriya Park', address: '23/B Manoharpukur Road', landmark: 'Beside Priya Cinema' },
        { name: 'Oudh 1590 Salt Lake', address: 'Plot CJ 262, Sector II', landmark: 'Near Karunamoyee' }
      ],
      signatureItems: [
        'Awadhi Handi Biryani cooked slow in earthen pots',
        'Galawati Kebab (melt-in-mouth spiced minced mutton patty)',
        'Raan Biryani (whole slow-braised spiced leg of lamb)',
        'Shahi Tukda with saffron rabri'
      ],
      nativeTips: [
        'The handi comes sealed with a crisp wheat crust—crack it open at the table to release the aromatic burst of saffron steam.'
      ],
      transitGuide: 'Kalighat Metro Station. Walk 5 minutes down Rash Behari Avenue toward Priya Cinema.',
      atmosphere: 'Classical Sarod and sitar melodies, brass goblets, royal carved wooden screens, and regal lighting.'
    },
    {
      id: 'ballygunge-place-heritage',
      title: '6 Ballygunge Place’s Aristocratic Bengali Thali & Daab Chingri',
      subtitle: 'Ancestral Zamindari Banquets in a Restored 1920s Colonial Bungalow',
      bengaliTitle: '৬ বালিগঞ্জ প্লেস ও বনেদি ভুরিভোজ',
      location: '6 Ballygunge Place, South Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'bengali-restaurant',
      categories: ['bengali-restaurant', 'indian-restaurant', 'bistro'],
      timing: 'Best: 12:30 PM – 3:30 PM Lunch / 7:00 PM – 10:30 PM Dinner',
      priceRange: '₹900 – ₹1,800 for two',
      description: 'Housed in a restored 1920s white townhouse, 6 Ballygunge Place serves Bengal’s finest aristocratic recipes: Daab Chingri (jumbo prawns baked inside green coconut shell), Kacha Lanka Mangsho, and Bhetki Paturi.',
      heritageLore: 'Inspired by the private recipe manuscripts of Kolkata’s 19th-century zamindar families and the Tagore household, 6 Ballygunge Place elevated traditional Bengali home cuisine into an elegant dining experience. With sepia photos, Belgian chandeliers, and vintage teak furniture, it is the city’s premier cultural feast.',
      quote: '“Ancestral Bengali culinary art perfected over generations of aristocratic banquets.”',
      tag: 'Aristocratic Bengali Heritage',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: '6 Ballygunge Place (Main)', address: '6 Ballygunge Place', landmark: 'Near Ballygunge Post Office' },
        { name: '6 Ballygunge Place (Sector V)', address: 'Salt Lake Sector V', landmark: 'Near Technopolis' }
      ],
      signatureItems: [
        'Daab Chingri (jumbo prawns simmered in mustard-coconut cream inside tender coconut)',
        'Kacha Lanka Dhonepata Mangsho (coriander & green chili mutton curry)',
        'Bhetki Paturi steamed in banana leaf with sharp Kasundi mustard'
      ],
      nativeTips: [
        'Scrape the tender coconut malai from inside the Daab shell with your fork—it soaks up all the prawn broth flavors!'
      ],
      transitGuide: 'Ballygunge Railway Station or take a taxi down Gariahat Road into Ballygunge Place.',
      atmosphere: 'Vintage gramophones, antique chandeliers, warm Bengali greetings, and rich mustard aromas.'
    },
    {
      id: 'azad-hind-dhaba-ballygunge',
      title: 'Azad Hind Dhaba’s Midnight Butter Chicken & Tandoori Feast',
      subtitle: 'Kolkata’s Legendary Late-Night Highway Dhaba on Ballygunge Circular Road',
      bengaliTitle: 'আজাদ হিন্দ ধাবা ও তন্দুরি খাবার',
      location: 'Ballygunge Circular Road & EM Bypass, South/East Kolkata',
      region: 'south',
      regionLabel: 'South Kolkata',
      category: 'north-indian-restaurant',
      categories: ['north-indian-restaurant', 'indian-restaurant', 'fast-food-restaurant', 'mughlai-restaurant'],
      timing: 'Best: 7:00 PM – 2:00 AM Midnight',
      priceRange: '₹400 – ₹850 for two',
      description: 'Kolkata’s legendary midnight dining icon. Piping-hot clay tandoor naans, velvety Butter Chicken, Dal Makhani, Chicken Bharta, and smoky kebabs served until the early hours of dawn.',
      heritageLore: 'Azad Hind Dhaba started decades ago to feed nocturnal transport drivers and revelers returning from Park Street night clubs. It evolved into a beloved urban institution where college students, executives, and families park their cars for midnight foil-wrapped parcels of tandoori delights.',
      quote: '“Where the tandoors roar until 2:00 AM and midnight cravings find their home.”',
      tag: 'Late-Night Dhaba Legend',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: 'Azad Hind Dhaba (Ballygunge)', address: 'Ballygunge Circular Road', landmark: 'Near Rowland Row' },
        { name: 'Azad Hind Dhaba (Phoolbagan)', address: 'Kankurgachi crossing', landmark: 'East Kolkata hub' }
      ],
      signatureItems: [
        'Rich Butter Chicken with charred tandoori roti',
        'Kolkata Style Chicken Bharta with shredded egg yolk',
        'Dal Makhani slow-simmered overnight with white butter'
      ],
      nativeTips: [
        'Order their Tandoori Chicken straight from the skewer—it comes sprinkled with chaat masala and lime.'
      ],
      transitGuide: 'Drive down Ballygunge Circular Road; open late into the night.',
      atmosphere: 'Glowing charcoal fires, sizzling tawas, late-night car addas, and robust Punjabi spices.'
    },
    {
      id: 'eighth-day-cafe-bakery',
      title: '8th Day Cafe & Bakery’s Hand-Rolled NYC Bagels & Pour-Overs',
      subtitle: 'Artisanal Specialty Roasts, Boiled Bagels & Cinnamon Rolls in Park Circus',
      bengaliTitle: 'এইথ ডে ক্যাফে ও বেকারি',
      location: '6 West Range, Park Circus & Jodhpur Park, Central/South Kolkata',
      region: 'central',
      regionLabel: 'Central & Park Circus',
      category: 'coffee-shop',
      categories: ['coffee-shop', 'cafe', 'bakery', 'bistro'],
      timing: 'Best: 8:00 AM – 9:00 PM',
      priceRange: '₹450 – ₹900 for two',
      description: 'Kolkata’s pioneer in specialty third-wave coffee and hand-rolled New York-style boiled bagels. Renowned for house-roasted single origin espressos, cream cheese bagels, and towering frosted cinnamon rolls.',
      heritageLore: 'Founded by American expat Grant Walsh, 8th Day Cafe established Kolkata’s contemporary specialty bakery landscape. They source beans directly from ethical growers across southern India, roast them on-site, and boil their authentic kettle bagels daily from scratch.',
      quote: '“A community hub of slow-dripped coffees, warm bagels, and quiet creative work.”',
      tag: 'Third-Wave Coffee & Bagels',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
      famousStalls: [
        { name: '8th Day Cafe (Park Circus)', address: '6 West Range', landmark: 'Near AJC Bose Road crossing' },
        { name: '8th Day Cafe (Jodhpur Park)', address: 'Jodhpur Park', landmark: 'Near South City Mall' }
      ],
      signatureItems: [
        'Hand-Rolled Bagel with house Herb Garlic Cream Cheese',
        'Signature Giant Cinnamon Roll with cream cheese frosting',
        'Cold Brew Tonic & Single Origin Flat White'
      ],
      nativeTips: [
        'Their warm Cinnamon Rolls sell out quickly—grab one fresh from the morning oven by 10:30 AM!'
      ],
      transitGuide: 'Rabindra Sadan Metro, followed by a short auto-rickshaw down AJC Bose Road toward Park Circus.',
      atmosphere: 'Sunlit rustic tables, warm scent of baked yeast and freshly ground coffee, and cozy reading corners.'
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Kolkata & Suburbs', count: culinaryStories.length },
    { id: 'central', label: 'Central & Park St', count: culinaryStories.filter(c => c.region === 'central').length },
    { id: 'north', label: 'North Kolkata', count: culinaryStories.filter(c => c.region === 'north').length },
    { id: 'south', label: 'South Kolkata', count: culinaryStories.filter(c => c.region === 'south').length },
    { id: 'east', label: 'East & Tangra / Salt Lake', count: culinaryStories.filter(c => c.region === 'east').length },
    { id: 'outer', label: 'Side & Outer Areas', count: culinaryStories.filter(c => c.region === 'outer').length },
  ];

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return culinaryStories.filter(c => activeRegion === 'all' || c.region === activeRegion).length;
    }
    return culinaryStories.filter(c => {
      const matchesRegion = activeRegion === 'all' || c.region === activeRegion;
      const itemCategories = c.categories || STORY_CATEGORIES[c.id] || [];
      const matchesCategory = c.category === categoryId || itemCategories.includes(categoryId);
      return matchesRegion && matchesCategory;
    }).length;
  };

  const categoryFilters = [
    {
      id: 'all',
      label: 'All Cuisines',
      icon: '🍽️',
      group: 'all',
      count: getCategoryCount('all'),
    },
    // Kolkata Heritage Specialties First
    {
      id: 'street-bites',
      label: 'Street Bites & Puchka',
      icon: '🥟',
      group: 'heritage',
      count: getCategoryCount('street-bites'),
    },
    {
      id: 'cabins-fries',
      label: 'Heritage Cabins & Fries',
      icon: '🍗',
      group: 'heritage',
      count: getCategoryCount('cabins-fries'),
    },
    {
      id: 'mughlai-biryani',
      label: 'Awadhi Biryani & Mughlai',
      icon: '🍲',
      group: 'heritage',
      count: getCategoryCount('mughlai-biryani'),
    },
    {
      id: 'sweets-desserts',
      label: 'Iconic Mishti & Bakes',
      icon: '🍮',
      group: 'heritage',
      count: getCategoryCount('sweets-desserts'),
    },
    {
      id: 'tea-breakfast',
      label: 'Dawn Breakfast & Adda',
      icon: '☕',
      group: 'heritage',
      count: getCategoryCount('tea-breakfast'),
    },
    {
      id: 'bengali-restaurant',
      label: 'Bengali restaurant',
      icon: '🐟',
      group: 'heritage',
      count: getCategoryCount('bengali-restaurant'),
    },
    // Regional & Indian
    {
      id: 'biryani-restaurant',
      label: 'Biryani restaurant',
      icon: '🍛',
      group: 'regional',
      count: getCategoryCount('biryani-restaurant'),
    },
    {
      id: 'mughlai-restaurant',
      label: 'Mughlai restaurant',
      icon: '🍖',
      group: 'regional',
      count: getCategoryCount('mughlai-restaurant'),
    },
    {
      id: 'north-indian-restaurant',
      label: 'North Indian restaurant',
      icon: '🫓',
      group: 'regional',
      count: getCategoryCount('north-indian-restaurant'),
    },
    {
      id: 'south-indian-restaurant',
      label: 'South Indian restaurant',
      icon: '🥥',
      group: 'regional',
      count: getCategoryCount('south-indian-restaurant'),
    },
    {
      id: 'indian-restaurant',
      label: 'Indian restaurant',
      icon: '🥘',
      group: 'regional',
      count: getCategoryCount('indian-restaurant'),
    },
    // Global & World Cuisines
    {
      id: 'chinese-restaurant',
      label: 'Chinese restaurant',
      icon: '🥢',
      group: 'global',
      count: getCategoryCount('chinese-restaurant'),
    },
    {
      id: 'asian-restaurant',
      label: 'Asian restaurant',
      icon: '🍜',
      group: 'global',
      count: getCategoryCount('asian-restaurant'),
    },
    {
      id: 'italian-restaurant',
      label: 'Italian restaurant',
      icon: '🍝',
      group: 'global',
      count: getCategoryCount('italian-restaurant'),
    },
    {
      id: 'continental-restaurant',
      label: 'Continental restaurant',
      icon: '🍴',
      group: 'global',
      count: getCategoryCount('continental-restaurant'),
    },
    {
      id: 'pizza-restaurant',
      label: 'Pizza restaurant',
      icon: '🍕',
      group: 'global',
      count: getCategoryCount('pizza-restaurant'),
    },
    // Cafes, Bakeries & Hangouts
    {
      id: 'cafe',
      label: 'Cafe',
      icon: '☕',
      group: 'cafes',
      count: getCategoryCount('cafe'),
    },
    {
      id: 'coffee-shop',
      label: 'Coffee shop',
      icon: '🧋',
      group: 'cafes',
      count: getCategoryCount('coffee-shop'),
    },
    {
      id: 'bakery',
      label: 'Bakery',
      icon: '🥐',
      group: 'cafes',
      count: getCategoryCount('bakery'),
    },
    {
      id: 'pub',
      label: 'Pub',
      icon: '🍺',
      group: 'cafes',
      count: getCategoryCount('pub'),
    },
    {
      id: 'bar-grill',
      label: 'Bar & grill',
      icon: '🥩',
      group: 'cafes',
      count: getCategoryCount('bar-grill'),
    },
    {
      id: 'bistro',
      label: 'Bistro',
      icon: '🍷',
      group: 'cafes',
      count: getCategoryCount('bistro'),
    },
    {
      id: 'fast-food-restaurant',
      label: 'Fast food restaurant',
      icon: '🌯',
      group: 'cafes',
      count: getCategoryCount('fast-food-restaurant'),
    },
    {
      id: 'dessert-restaurant',
      label: 'Dessert restaurant',
      icon: '🍨',
      group: 'cafes',
      count: getCategoryCount('dessert-restaurant'),
    },
  ];

  const handleFilterChange = (regionId: string) => {
    setDirection(1);
    setActiveRegion(regionId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setDirection(1);
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const modalCategoryFilters = categoryFilters.filter((cat) => {
    if (modalGroupFilter !== 'all' && cat.group !== modalGroupFilter && cat.id !== 'all') {
      return false;
    }
    if (!modalCategorySearch.trim()) return true;
    return cat.label.toLowerCase().includes(modalCategorySearch.toLowerCase().trim());
  });

  const currentCategoryObj = categoryFilters.find((c) => c.id === activeCategory);

  const filteredItems = culinaryStories.filter((item) => {
    const matchesRegion = activeRegion === 'all' || item.region === activeRegion;
    const itemCategories = item.categories || STORY_CATEGORIES[item.id] || [];
    const matchesCategory =
      activeCategory === 'all' ||
      item.category === activeCategory ||
      itemCategories.includes(activeCategory);
    return matchesRegion && matchesCategory;
  });


  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setDirection(-1);
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    } else {
      setCurrentPage(totalPages); // wrap around
    }
  };

  const handleNextPage = () => {
    setDirection(1);
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    } else {
      setCurrentPage(1); // wrap around
    }
  };

  const handleImHungry = () => {
    // Pick a random card from all culinary delicacies
    const randomIndex = Math.floor(Math.random() * culinaryStories.length);
    const chosenItem = culinaryStories[randomIndex];
    if (!chosenItem) return;

    // Reset region to 'all' and calculate page so the background carousel updates
    setActiveRegion('all');
    setActiveCategory('all');
    setActiveCategory('all');
    const targetPage = Math.floor(randomIndex / ITEMS_PER_PAGE) + 1;
    setCurrentPage(targetPage);

    // Open detail modal with full lore & stall info
    setSelectedItem(chosenItem);
  };

  // Autoplay carousel timer effect with hover and modal pauses
  useEffect(() => {
    if (!isAutoPlay || isHovered || selectedItem !== null || totalPages <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, selectedItem, totalPages]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.8 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <section id="culture" className="py-8 sm:py-10 px-6 sm:px-10 lg:px-12 my-6 rounded-3xl bg-[#C6532B] text-[#FFF8EF] relative overflow-hidden shadow-[0_16px_50px_rgba(198,83,43,0.22)] scroll-mt-24">
      {/* Decorative background motifs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Page Stepper */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5 sm:mb-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#FFF8EF]/80 uppercase">
              Chapter III &bull; Gastronomy &amp; Culture
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#FFF8EF] font-semibold">
              স্বাদ ও সংস্কৃতির অলিগলি
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#FFF8EF] leading-snug">
            Where every street corner smells of <span className="italic text-[#FFF8EF]/90">celebration</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#FFF8EF]/85 leading-relaxed mt-2 max-w-2xl">
            In Kolkata, food is neither a commodity nor an afterthought. It is a cultural sacrament,
            an artistic passion, and the centerpiece of every deep conversation. Explore 4 iconic culinary stops at a time.
          </p>
        </div>

        {/* Top-Right Page Indicator, Autoplay Controls & Navigation Dots */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-start lg:justify-end">
          {/* Autoplay Play/Pause Toggle */}
          {totalPages > 1 && (
            <button
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className="px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/35 border border-[#FFF8EF]/25 text-[#FFF8EF] text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs shadow-xs active:scale-95"
              title={isAutoPlay ? (isHovered ? 'Paused while cursor is over cards' : 'Click to pause auto-carousel') : 'Click to resume auto-carousel'}
              aria-label={isAutoPlay ? 'Pause auto-carousel' : 'Resume auto-carousel'}
            >
              {isAutoPlay ? (
                <>
                  <span className="relative flex h-2 w-2">
                    {!isHovered ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    {isHovered ? 'Auto: Paused (Hover)' : 'Auto: Sliding'}
                  </span>
                  <Pause className="w-2.5 h-2.5 text-[#FFF8EF]/70 ml-0.5" />
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    Auto: Paused
                  </span>
                  <Play className="w-2.5 h-2.5 text-[#FFF8EF] ml-0.5 fill-current" />
                </>
              )}
            </button>
          )}

          {/* Dots Indicator */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/15 backdrop-blur-xs max-w-xs overflow-x-auto no-scrollbar">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (pageNum !== safeCurrentPage) {
                        setDirection(pageNum > safeCurrentPage ? 1 : -1);
                        setCurrentPage(pageNum);
                      }
                    }}
                    aria-label={`Go to page ${pageNum}`}
                    title={`Page ${pageNum}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                        ? 'w-5 bg-[#FFF8EF] shadow-xs'
                        : 'w-1.5 bg-[#FFF8EF]/40 hover:bg-[#FFF8EF]/75'
                      }`}
                  />
                );
              })}
            </div>
          )}

          {/* Page Counter */}
          <div className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF] text-[#351E1A] text-xs font-sans font-bold shadow-sm flex items-center gap-1.5">
            <span className="text-[#C6532B]">Page {safeCurrentPage}</span>
            <span className="text-[#351E1A]/40">/</span>
            <span>{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar scroll-smooth">
        {filterTabs.map((tab) => {
          const isActive = activeRegion === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${isActive
                  ? 'bg-[#FFF8EF] text-[#351E1A] font-bold shadow-md scale-102'
                  : 'bg-[#FFF8EF]/15 text-[#FFF8EF] border border-[#FFF8EF]/20 hover:bg-[#FFF8EF]/25 hover:text-white'
                }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-[#C6532B]/15 text-[#C6532B] font-bold' : 'bg-black/20 text-[#FFF8EF]/80'
                }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Selection Bar (Clean Modal Selector with Active Category Badge) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Left: Open All Categories & Cuisines Picker Modal */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setModalCategorySearch('');
              setModalGroupFilter('all');
              setIsCategoryModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#FFF8EF] hover:bg-white text-[#351E1A] text-xs sm:text-sm font-sans font-bold shadow-md flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 group border border-[#FFF8EF]/50"
            title="Browse all culinary categories"
            aria-label="Open category picker modal"
          >
            <LayoutGrid className="w-4 h-4 text-[#C6532B] transition-transform group-hover:rotate-12" />
            <span>Select Category / Cuisine</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#C6532B]/10 text-[#C6532B]">
              {categoryFilters.length - 1} Categories
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#351E1A]/60 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* Right: Active Filter Badge or Current Status */}
        <div className="flex items-center gap-2">
          {activeCategory !== 'all' && currentCategoryObj ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF8EF] text-[#351E1A] text-xs font-sans font-semibold shadow-md border border-white/40">
              <span className="text-base">{currentCategoryObj.icon}</span>
              <span className="font-bold">{currentCategoryObj.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6532B]/15 text-[#C6532B] font-mono font-bold">
                {currentCategoryObj.count} {currentCategoryObj.count === 1 ? 'place' : 'places'}
              </span>
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className="p-1 hover:bg-black/10 rounded-full cursor-pointer transition-colors ml-1"
                title="Reset to All Cuisines"
                aria-label="Clear active category filter"
              >
                <X className="w-3.5 h-3.5 text-[#351E1A]/80" />
              </button>
            </div>
          ) : (
            <div className="text-xs font-sans text-[#FFF8EF]/90 flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10">
              <span>Showing:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>🍽️</span>
                <span>All Cuisines ({filteredItems.length} curated stops)</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Autoplay Story Progress Bars */}
      {totalPages > 1 && (
        <div className="relative z-10 w-full mb-6">
          <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === safeCurrentPage;
              const isPast = pageNum < safeCurrentPage;
              return (
                <div key={pageNum} className="flex-1 h-full bg-black/20 rounded-full overflow-hidden">
                  {isActive ? (
                    <motion.div
                      key={`progress-${activeRegion}-${safeCurrentPage}-${isAutoPlay}-${isHovered}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isAutoPlay && !isHovered ? '100%' : (isHovered ? '100%' : '0%') }}
                      transition={{
                        duration: isAutoPlay && !isHovered ? 4 : 0,
                        ease: 'linear',
                      }}
                      className={`h-full rounded-full transition-colors ${isHovered ? 'bg-amber-300' : 'bg-[#FFF8EF]'
                        }`}
                    />
                  ) : (
                    <div className={`h-full rounded-full ${isPast ? 'bg-[#FFF8EF]/80' : 'bg-transparent'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Cards Per Page Grid with Floating Side Navigation Controls & Hover Pause */}
      <div
        className="relative z-10 group/foodgrid"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Left Side Arrow Button */}
        {totalPages > 1 && (
          <button
            onClick={handlePrevPage}
            className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#351E1A] hover:text-[#FFF8EF] hover:border-[#351E1A] flex items-center justify-center transition-all duration-300 shadow-[0_8px_24px_rgba(53,30,26,0.25)] cursor-pointer active:scale-90 group/btn"
            title="Previous 4 culinary stops"
            aria-label="Previous page of food cards"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-0.5" />
          </button>
        )}

        {/* Animated Cards Grid Container */}
        <div className="overflow-hidden py-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${activeRegion}-${activeCategory}-${safeCurrentPage}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 min-h-[460px]"
            >
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedItem(item);
                      }
                    }}
                    className="group rounded-3xl bg-[#FFF8EF] text-[#351E1A] p-6 sm:p-8 border border-[#E8D5C2] shadow-[0_10px_30px_rgba(53,30,26,0.1)] transition-all duration-300 hover:shadow-[0_22px_48px_rgba(53,30,26,0.18)] hover:-translate-y-1.5 hover:border-[#C6532B]/50 flex flex-col justify-between cursor-pointer select-none active:scale-[0.99] relative"
                  >
                    <div>
                      {/* Card Header with Tag & Location */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-[#C6532B]/10 text-[#C6532B] font-mono text-[10px] font-bold uppercase tracking-wider">
                          {item.tag}
                        </span>
                        <span className="text-[11px] font-sans text-[#351E1A]/60 flex items-center gap-1 shrink-0 max-w-[55%] truncate">
                          <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      </div>

                      {/* Title & Image Layout */}
                      <div className="flex flex-col sm:flex-row gap-5 items-start mb-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h3 className="font-serif text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug">
                            {item.title}
                          </h3>
                          <p className="font-sans text-xs font-semibold text-[#582822]">
                            {item.subtitle}
                          </p>
                        </div>

                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E8D5C2] shadow-xs bg-[#351E1A]/5">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/stories/puchka.jpg';
                            }}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-3 mt-auto">
                      {/* Bottom Quote & Timing */}
                      <div className="pt-3 border-t border-[#E8D5C2]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-script text-xs sm:text-sm text-[#582822] italic leading-tight">
                          {item.quote}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#C6532B] uppercase tracking-wider shrink-0">
                          {item.timing}
                        </span>
                      </div>

                      {/* Interactive Tap Prompt Banner */}
                      <div className="pt-2.5 border-t border-dashed border-[#E8D5C2] flex items-center justify-between text-[11px] font-sans font-bold text-[#C6532B] group-hover:text-[#9A3816] transition-colors">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C6532B]" />
                          <span>Tap for lore, stalls &amp; native secrets</span>
                        </span>
                        <span className="font-mono text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl bg-black/25 border border-[#FFF8EF]/20 space-y-3">
                  <span className="text-4xl">🍲</span>
                  <p className="font-serif text-xl sm:text-2xl text-[#FFF8EF] font-medium">
                    No spots found for this cuisine in the selected zone.
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-[#FFF8EF]/75 max-w-md">
                    Try switching back to &ldquo;All Cuisines&rdquo; or explore another zone of Kolkata to uncover hidden delicacies.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setCurrentPage(1);
                    }}
                    className="mt-3 px-5 py-2.5 rounded-full bg-[#FFF8EF] text-[#351E1A] font-bold text-xs shadow-md hover:bg-[#F7EBDD] transition-all cursor-pointer active:scale-95"
                  >
                    View All Cuisines
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Right Side Arrow Button */}
        {totalPages > 1 && (
          <button
            onClick={handleNextPage}
            className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#351E1A] hover:text-[#FFF8EF] hover:border-[#351E1A] flex items-center justify-center transition-all duration-300 shadow-[0_8px_24px_rgba(53,30,26,0.25)] cursor-pointer active:scale-90 group/btn"
            title="Next 4 culinary stops"
            aria-label="Next page of food cards"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Footnote & Curated Trail CTA */}
      <div className="relative z-10 mt-10 pt-6 border-t border-[#FFF8EF]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Counter Info */}
        <div className="text-xs font-sans text-[#FFF8EF]/80 shrink-0">
          Showing <span className="font-bold text-[#FFF8EF]">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}</span> of <span className="font-bold text-[#FFF8EF]">{filteredItems.length}</span> street delicacies
        </div>

        {/* Center: Bengali Eatery Style Design (Peach Silhouette) */}
        <div className="flex items-center gap-3.5 px-5 py-2.5 rounded-2xl bg-[#FFF8EF]/10 border border-[#D9A38E]/35 backdrop-blur-xs select-none shadow-xs group/eatery hover:bg-[#FFF8EF]/15 transition-all duration-300">
          {/* Steaming Earthen Cup (Bhaar) & Heritage Handi Degchi Silhouette */}
          <svg
            className="w-10 h-10 shrink-0 text-[#F5C2AF] transition-transform duration-300 group-hover/eatery:scale-108"
            viewBox="0 0 72 72"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Steaming Bhaar (Clay Cup) */}
            <ellipse cx="20" cy="38" rx="8" ry="2.5" />
            <path d="M12 38 C12 48 14 58 17 61 L23 61 C26 58 28 48 28 38 Z" />
            {/* Rising steam waves */}
            <path
              d="M17 33 C15 26 20 22 17 16 C15 12 19 8 17 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M23 32 C26 25 22 21 25 15 C27 11 24 7 26 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />

            {/* Traditional Handi Pot & Degchi */}
            <path d="M38 43 C36 43 35 45 35 48 C35 57 41 63 52 63 C63 63 69 57 69 48 C69 45 68 43 66 43 Z" />
            <ellipse cx="52" cy="43" rx="14" ry="3.5" />
            <ellipse cx="52" cy="39.5" rx="9" ry="2" />
            {/* Wooden Stirring Ladle */}
            <path
              d="M55 41 L67 21"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="68" cy="19.5" r="2.5" />
          </svg>

          {/* Bengali Typography & Subtitle */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bengali text-sm font-bold text-[#FFF8EF] tracking-wide">
                রসনা বিলাস &bull; <span className="font-script text-base text-[#F5C2AF] font-normal">স্মৃতির স্বাদ</span>
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#F5C2AF]/90 font-medium">
              Calcutta Cabin &bull; Earthen Cha &bull; Street Lore
            </span>
          </div>
        </div>

        {/* Right: I'm Hungry Random Delicacy Generator Button */}
        <div className="shrink-0">
          <button
            onClick={handleImHungry}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FFF8EF] hover:bg-white text-[#351E1A] font-sans text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
            title="Randomly pick a legendary Kolkata dish and explore its lore"
            aria-label="I'm hungry - surprise me with a random culinary spot"
          >
            <Utensils className="w-3.5 h-3.5 text-[#C6532B] group-hover:scale-110 transition-transform" />
            <span>I'm Hungry</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6532B]/10 text-[#C6532B] font-mono uppercase font-semibold group-hover:bg-[#C6532B] group-hover:text-[#FFF8EF] transition-colors flex items-center gap-1">
              Surprise Me 🎲
            </span>
          </button>
        </div>
      </div>

      {/* All Categories & Cuisines Picker Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#2A1410] border border-[#FFF8EF]/25 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden text-[#FFF8EF] z-10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 pb-3 border-b border-[#FFF8EF]/15 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8EF] text-[#C6532B] flex items-center justify-center shadow-md shrink-0">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FFF8EF] tracking-tight flex items-center gap-2">
                      <span>All Cuisines & Eateries</span>
                      <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-white/10 text-[#FFF8EF]/80">
                        {categoryFilters.length - 1} categories
                      </span>
                    </h3>
                    <p className="text-xs text-[#FFF8EF]/70 font-sans mt-0.5">
                      Select any category directly without clicking through navigation arrows.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#FFF8EF]/40 px-2 py-1 rounded bg-white/5 border border-white/10 hidden sm:inline-block">
                    ESC to close
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF8EF] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close categories modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search & Group Filter Tabs */}
              <div className="px-4 sm:px-6 pt-3 pb-2 space-y-3 bg-black/15">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFF8EF]/50 pointer-events-none" />
                  <input
                    ref={modalSearchInputRef}
                    type="text"
                    value={modalCategorySearch}
                    onChange={(e) => setModalCategorySearch(e.target.value)}
                    placeholder="Search by cuisine (e.g. biryani, cabin, sweets, cafe)..."
                    className="w-full bg-[#351E1A] border border-[#FFF8EF]/20 focus:border-[#FFF8EF]/60 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#FFF8EF] placeholder-[#FFF8EF]/40 outline-none transition-all shadow-inner font-sans"
                    autoFocus
                  />
                  {modalCategorySearch && (
                    <button
                      type="button"
                      onClick={() => setModalCategorySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-[#FFF8EF]/60 hover:text-white cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Groups Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-sans">
                  {[
                    { id: 'all', label: 'All Cuisines', icon: '🍽️' },
                    { id: 'heritage', label: '👑 Heritage Specials', icon: '🏛️' },
                    { id: 'regional', label: '🍛 Indian & Regional', icon: '🍲' },
                    { id: 'global', label: '🥢 World Cuisines', icon: '🌍' },
                    { id: 'cafes', label: '☕ Cafes & Nightlife', icon: '🍸' },
                  ].map((grp) => {
                    const isSelected = modalGroupFilter === grp.id;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setModalGroupFilter(grp.id)}
                        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          isSelected
                            ? 'bg-[#FFF8EF] text-[#351E1A] font-bold shadow-xs'
                            : 'bg-white/5 text-[#FFF8EF]/75 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{grp.icon}</span>
                        <span>{grp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories Grid List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[55vh] space-y-2">
                {modalCategoryFilters.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-sans text-[#FFF8EF]/70">
                      No categories found matching "{modalCategorySearch}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setModalCategorySearch('');
                        setModalGroupFilter('all');
                      }}
                      className="mt-2 text-xs text-[#FFF8EF] underline hover:text-white font-medium cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {modalCategoryFilters.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      const hasCount = cat.count > 0 || cat.id === 'all';
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            handleCategoryChange(cat.id);
                            setIsCategoryModalOpen(false);
                          }}
                          className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                            isActive
                              ? 'bg-[#FFF8EF] text-[#351E1A] border-[#FFF8EF] shadow-md font-bold scale-[1.01]'
                              : 'bg-black/25 hover:bg-black/45 text-[#FFF8EF] border-[#FFF8EF]/15 hover:border-[#FFF8EF]/35'
                          } ${!hasCount ? 'opacity-40 hover:opacity-70' : ''}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-xl shrink-0 p-1 rounded-lg bg-black/10 group-hover:scale-110 transition-transform">
                              {cat.icon}
                            </span>
                            <span className="text-xs sm:text-sm font-sans truncate">
                              {cat.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-[#C6532B]/15 text-[#C6532B] font-bold'
                                  : 'bg-white/10 text-[#FFF8EF]/80'
                              }`}
                            >
                              {cat.count}
                            </span>
                            {isActive && (
                              <Check className="w-4 h-4 text-[#C6532B] stroke-[2.5]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 px-6 border-t border-[#FFF8EF]/15 bg-black/25 flex items-center justify-between gap-3 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFF8EF]/60">Current Filter:</span>
                  <span className="font-bold text-[#FFF8EF] flex items-center gap-1">
                    <span>{currentCategoryObj?.icon}</span>
                    <span>{currentCategoryObj?.label}</span>
                  </span>
                  {activeCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCategoryChange('all');
                        setIsCategoryModalOpen(false);
                      }}
                      className="ml-2 text-[11px] underline text-[#FFF8EF]/80 hover:text-white cursor-pointer"
                    >
                      Reset to All
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-[#FFF8EF] text-[#351E1A] font-bold hover:bg-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Culinary Deep-Dive Detail Modal */}
      <CulinaryDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onBookmark={onBookmarkCulinary}
        isBookmarked={selectedItem && isBookmarked ? isBookmarked(selectedItem.id) : false}
      />
    </section>
  );
};

