import React, { useState, useEffect } from 'react';
import { Utensils, MapPin, ChevronLeft, ChevronRight, Sparkles, Compass, Play, Pause } from 'lucide-react';
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
  region: 'all' | 'north' | 'central' | 'south' | 'sweets';
  regionLabel: string;
  timing: string;
  description: string;
  quote: string;
  tag: string;
  image: string;
  bengaliTitle?: string;
  priceRange?: string;
  heritageLore?: string;
  famousStalls?: { name: string; address: string; landmark?: string }[];
  signatureItems?: string[];
  nativeTips?: string[];
  transitGuide?: string;
  atmosphere?: string;
}

const ITEMS_PER_PAGE = 4;

export const FoodAndCultureSection: React.FC<FoodAndCultureSectionProps> = ({
  onExploreFoodTrail,
  onBookmarkCulinary,
  isBookmarked,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<CulinaryItem | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const culinaryStories: CulinaryItem[] = [
    {
      id: 'puchka-alchemy',
      title: 'The Sacred Alchemy of Kolkata Puchka',
      subtitle: 'Gandharaj Lime, Roasted Cumin & Tamarind Water',
      bengaliTitle: 'কলকাতার পুঁচকা',
      location: 'Vivekananda Park & Southern Avenue',
      region: 'south',
      regionLabel: 'South Kolkata',
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
      region: 'sweets',
      regionLabel: 'Citywide Sweetcraft',
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
      timing: 'Best: 6:00 AM – 8:30 AM (Dawn Only)',
      priceRange: '₹40 – ₹120 per plate',
      description: 'Every dawn since the 19th century, Kolkata’s Hakka and Cantonese community transforms Sun Yat Sen Street into a bustling open-air breakfast feast of steaming wontons, sweet pork baozi, and fish-meatball soup.',
      heritageLore: 'Kolkata is home to India’s only historical Chinatown. Starting in the late 18th century when Chinese businessman Tong Achew landed near the Hooghly river, Hakka and Cantonese immigrants established thriving leather, dental, and culinary crafts. Before the morning sun clears the rooftops of Poddar Court, elderly Chinese women and home cooks set up wooden tables serving piping hot pork and chicken dumplings with chili-garlic oil, delicate fishball noodle broth, sesame sweet rice balls, and crisp prawn crackers.',
      quote: '“Dawn arrives in Central Calcutta with the clatter of bamboo steam baskets on Sun Yat Sen Street.”',
      tag: 'Historic Chinatown',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
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
      region: 'sweets',
      regionLabel: 'North Sweetcraft',
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
      region: 'sweets',
      regionLabel: 'Bowbazar Sweetcraft',
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
  ];


  const filterTabs = [
    { id: 'all', label: 'All Kolkata', count: culinaryStories.length },
    { id: 'north', label: 'North Kolkata', count: culinaryStories.filter(c => c.region === 'north').length },
    { id: 'central', label: 'Central & Esplanade', count: culinaryStories.filter(c => c.region === 'central').length },
    { id: 'south', label: 'South Kolkata', count: culinaryStories.filter(c => c.region === 'south').length },
    { id: 'sweets', label: 'Sweets & Sips', count: culinaryStories.filter(c => c.region === 'sweets' || c.id === 'flurys-tearoom' || c.id === 'paramount-daab-sarbat' || c.id === 'balwant-singh-doodh-cola').length },
  ];

  const handleFilterChange = (regionId: string) => {
    setDirection(1);
    setActiveRegion(regionId);
    setCurrentPage(1);
  };

  const filteredItems = culinaryStories.filter((item) => {
    if (activeRegion === 'all') return true;
    if (activeRegion === 'sweets') return item.region === 'sweets' || item.id === 'flurys-tearoom' || item.id === 'paramount-daab-sarbat' || item.id === 'balwant-singh-doodh-cola';
    return item.region === activeRegion;
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
    <section id="culture" className="py-16 sm:py-24 my-8 rounded-3xl bg-[#C6532B] text-[#FFF8EF] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_16px_50px_rgba(198,83,43,0.22)] scroll-mt-24">
      {/* Decorative background motifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Page Stepper */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#FFF8EF]/80 uppercase">
              Chapter III &bull; Gastronomy &amp; Culture
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#FFF8EF] font-semibold">
              স্বাদ ও সংস্কৃতির অলিগলি
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FFF8EF] leading-[1.08]">
            Where every street corner smells of <span className="italic text-[#FFF8EF]/90">celebration</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#FFF8EF]/85 leading-relaxed mt-4">
            In Kolkata, food is neither a commodity nor an afterthought. It is a cultural sacrament, 
            an artistic passion, and the centerpiece of every deep conversation. Explore 4 iconic culinary stops at a time.
          </p>
        </div>

        {/* Top-Right Page Indicator, Autoplay Controls & Navigation Dots */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
          {/* Autoplay Play/Pause Toggle */}
          {totalPages > 1 && (
            <button
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-full bg-black/25 hover:bg-black/35 border border-[#FFF8EF]/25 text-[#FFF8EF] text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs shadow-xs active:scale-95"
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/15 backdrop-blur-xs">
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
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-6 bg-[#FFF8EF] shadow-xs'
                        : 'w-2 bg-[#FFF8EF]/40 hover:bg-[#FFF8EF]/75'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Page Counter */}
          <div className="px-4 py-2 rounded-full bg-[#FFF8EF] text-[#351E1A] text-xs font-sans font-bold shadow-sm flex items-center gap-2">
            <span className="text-[#C6532B]">Page {safeCurrentPage}</span>
            <span className="text-[#351E1A]/40">/</span>
            <span>{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar scroll-smooth">
        {filterTabs.map((tab) => {
          const isActive = activeRegion === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#FFF8EF] text-[#351E1A] font-bold shadow-md scale-102'
                  : 'bg-[#FFF8EF]/15 text-[#FFF8EF] border border-[#FFF8EF]/20 hover:bg-[#FFF8EF]/25 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isActive ? 'bg-[#C6532B]/15 text-[#C6532B] font-bold' : 'bg-black/20 text-[#FFF8EF]/80'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
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
                      className={`h-full rounded-full transition-colors ${
                        isHovered ? 'bg-amber-300' : 'bg-[#FFF8EF]'
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
              key={`${activeRegion}-${safeCurrentPage}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 min-h-[460px]"
            >
              {currentItems.map((item) => (
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
              ))}
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

