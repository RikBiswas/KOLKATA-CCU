"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
  MapRoute,
  type MapRef
} from '../ui/map';
import { Destination } from '../../types/travel';
import { travelData } from '../../config/travel.config';
import { cn } from '../../lib/utils';
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  Sparkles,
  Clock,
  Landmark,
  Layers,
  Eye,
  Star,
  ChevronRight,
  Maximize2,
  Car,
  Crosshair,
  Loader2,
  Route as RouteIcon,
  LocateFixed,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export interface KolkataPlaceItem {
  id: string;
  name: string;
  bengaliName?: string;
  tagline: string;
  category: 'Colonial Heritage' | 'Riverfront & Ghats' | 'Spiritual Heritage' | 'Culture & Literature' | 'Gastronomy & Boulevards';
  coordinates: [number, number]; // [lng, lat]
  imageUrl: string;
  region: string;
  rating: number;
  reviewsCount: number;
  timing: string;
  insiderTip: string;
  metroStop: string;
  destinationData?: Destination;
}

export interface UserLocation {
  name: string;
  lng: number;
  lat: number;
  isGPS?: boolean;
}

interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}

// Preset starting hubs across Kolkata
export const STARTING_LOCATION_PRESETS: UserLocation[] = [
  { name: 'Howrah Railway Station', lng: 88.3426, lat: 22.5830 },
  { name: 'Kolkata Airport (CCU)', lng: 88.4467, lat: 22.6547 },
  { name: 'Esplanade Metro & Bus Hub', lng: 88.3518, lat: 22.5645 },
  { name: 'Park Street Crossing', lng: 88.3535, lat: 22.5510 },
  { name: 'Sealdah Railway Station', lng: 88.3712, lat: 22.5675 },
];

// Exact curated coordinates for Kolkata's iconic heritage places
export const KOLKATA_LANDMARKS: KolkataPlaceItem[] = [
  {
    id: 'victoria-memorial',
    name: 'Victoria Memorial Hall',
    bengaliName: 'ভিক্টোরিয়া মেমোরিয়াল',
    tagline: 'Makrana Marble Sovereign & Lush Maidan Grounds',
    category: 'Colonial Heritage',
    coordinates: [88.3426, 22.5448],
    imageUrl: '/images/destinations/victoria-memorial.jpg',
    region: 'Central Kolkata (Maidan)',
    rating: 4.9,
    reviewsCount: 2450,
    timing: '10:00 AM – 6:00 PM (Gardens 6 AM)',
    insiderTip: 'Golden hour reflection over the South Lake at 5:15 PM.',
    metroStop: 'Rabindra Sadan (5 min walk)',
  },
  {
    id: 'howrah-bridge',
    name: 'Howrah Bridge (Rabindra Setu)',
    bengaliName: 'হাওড়া ব্রিজ (রবীন্দ্র সেতু)',
    tagline: 'World’s Busiest Cantilever River Wonder & Mallick Ghat',
    category: 'Riverfront & Ghats',
    coordinates: [88.3468, 22.5851],
    imageUrl: '/images/destinations/howrah-bridge.jpg',
    region: 'Hooghly Riverfront',
    rating: 4.8,
    reviewsCount: 3120,
    timing: 'Open 24 Hours',
    insiderTip: 'Visit Mallick Ghat flower market beneath the bridge at 6 AM.',
    metroStop: 'Howrah Railway / Armenian Ghat Ferry',
  },
  {
    id: 'princep-ghat',
    name: 'Princep Ghat & Strand Promenade',
    bengaliName: 'প্রিন্সেপ ঘাট',
    tagline: 'Palladian Porch, Sunset Ferries & Vidyasagar Setu',
    category: 'Riverfront & Ghats',
    coordinates: [88.3325, 22.5557],
    imageUrl: '/images/destinations/princep-ghat.jpg',
    region: 'Strand Road Riverbank',
    rating: 4.8,
    reviewsCount: 1740,
    timing: 'Open 24 Hours',
    insiderTip: 'Hire a hand-oared wooden dinghy boat during twilight.',
    metroStop: 'Princep Ghat Circular Railway',
  },
  {
    id: 'dakshineswar-temple',
    name: 'Dakshineswar Kali Temple',
    bengaliName: 'দক্ষিণেশ্বর কালীবাড়ি',
    tagline: '1855 Navaratna Sanctum of Sri Ramakrishna',
    category: 'Spiritual Heritage',
    coordinates: [88.3575, 22.6550],
    imageUrl: '/images/destinations/dakshineswar-temple.jpg',
    region: 'North Hooghly Riverbank',
    rating: 4.9,
    reviewsCount: 1980,
    timing: '6:00 AM – 12:30 PM, 3:30 PM – 8:30 PM',
    insiderTip: 'Board the ₹11 river ferry to Belur Math across the Ganges.',
    metroStop: 'Dakshineswar Metro Station (Blue Line)',
  },
  {
    id: 'belur-math',
    name: 'Belur Math (Ramakrishna Mission)',
    bengaliName: 'বেলুড় মঠ',
    tagline: 'Universalist Temple Architecture & Serene River Gardens',
    category: 'Spiritual Heritage',
    coordinates: [88.3562, 22.6322],
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    region: 'Hooghly West Bank',
    rating: 4.9,
    reviewsCount: 1650,
    timing: '6:30 AM – 11:30 AM, 4:00 PM – 8:30 PM',
    insiderTip: 'Attend the peaceful evening congregational Sandhya Arati.',
    metroStop: 'Direct ferry from Dakshineswar Ghat',
  },
  {
    id: 'kumartuli-potters',
    name: 'Kumartuli Artisan Colony',
    bengaliName: 'কুমারটুলী মৃৎশিল্পীদের পাড়া',
    tagline: 'Centuries-Old Cradle of Clay Gods & Bengal Sculptors',
    category: 'Culture & Literature',
    coordinates: [88.3653, 22.5997],
    imageUrl: '/images/destinations/kumartuli.jpg',
    region: 'North Kolkata Labyrinth',
    rating: 4.9,
    reviewsCount: 1540,
    timing: '8:00 AM – 7:00 PM daily',
    insiderTip: 'Explore Banamali Sarkar Street towards the riverbank ghats.',
    metroStop: 'Sovabazar Sutanuti Metro (10 min walk)',
  },
  {
    id: 'college-street-boipara',
    name: 'College Street (Boi Para) & Coffee House',
    bengaliName: 'কলেজ স্ট্রিট বইপাড়া',
    tagline: 'World’s Largest Second-Hand Book District & Historic Adda',
    category: 'Culture & Literature',
    coordinates: [88.3630, 22.5744],
    imageUrl: '/images/destinations/college-street.jpg',
    region: 'Central Intellectual Core',
    rating: 4.7,
    reviewsCount: 2190,
    timing: '10:00 AM – 7:30 PM (Mon–Sat)',
    insiderTip: 'Head up to the 1st floor of Indian Coffee House for infusion black brew.',
    metroStop: 'Central or MG Road Metro',
  },
  {
    id: 'st-pauls-cathedral',
    name: 'St. Paul’s Cathedral',
    bengaliName: 'সেন্ট পলস ক্যাথিড্রাল',
    tagline: '1847 Indo-Gothic Grandeur with Edward Burne-Jones Windows',
    category: 'Colonial Heritage',
    coordinates: [88.3475, 22.5442],
    imageUrl: '/images/destinations/st-pauls-cathedral.jpg',
    region: 'Cathedral Road',
    rating: 4.8,
    reviewsCount: 1420,
    timing: '9:00 AM – 5:00 PM (Mon–Sat)',
    insiderTip: 'Sit inside for 15 minutes of serene contemplation after Maidan walks.',
    metroStop: 'Rabindra Sadan / Maidan Metro',
  },
  {
    id: 'marble-palace',
    name: 'Marble Palace Mansion',
    bengaliName: 'মার্বেল প্যালেস',
    tagline: '1835 Neoclassical Mansion, Rubens Masterpieces & Aviary',
    category: 'Colonial Heritage',
    coordinates: [88.3601, 22.5828],
    imageUrl: 'https://assets.cntraveller.in/photos/62012b5b6445f4e06c1a9a8c/master/w_1600%2Cc_limit/MARBLE%2520PALACE.jpg',
    region: 'Muktaram Babu Street, North Kolkata',
    rating: 4.8,
    reviewsCount: 1680,
    timing: '10:00 AM – 4:00 PM (Closed Mon & Thu)',
    insiderTip: 'Carry government photo ID for free permit entry slip at gate.',
    metroStop: 'Girish Park or MG Road Metro',
  },
  {
    id: 'south-park-street-cemetery',
    name: 'South Park Street Cemetery',
    bengaliName: 'সাউথ পার্ক স্ট্রিট সিমেট্রি',
    tagline: '1767 Gothic Pyramids, Banyan Vines & Silent Lore',
    category: 'Colonial Heritage',
    coordinates: [88.3635, 22.5469],
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrxkTbe557OhtQNXPjTajM2zz2k8S1g3ah7zzyHcOQB13Kfbj3Y5iFOlw&s=10',
    region: 'Park Street Downtown',
    rating: 4.8,
    reviewsCount: 1840,
    timing: '10:00 AM – 5:00 PM daily',
    insiderTip: 'Golden sunlight filters through mahogany leaves at 4 PM.',
    metroStop: 'Park Street Metro (Short taxi/walk)',
  },
  {
    id: 'jorasanko-thakurbari',
    name: 'Jorasanko Thakurbari (Tagore House)',
    bengaliName: 'জোড়াসাঁকো ঠাকুরবাড়ি',
    tagline: 'Birthplace of Rabindranath Tagore & Bengal Renaissance Cradle',
    category: 'Culture & Literature',
    coordinates: [88.3587, 22.5852],
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAS0dtwg0g3MB0-TQSJZZ1x9ptBO76hlLNxu61aMWXDlAtXlPh2rCWxIA&s=10',
    region: 'Jorasanko, Central Kolkata',
    rating: 4.9,
    reviewsCount: 2260,
    timing: '10:30 AM – 5:00 PM (Closed Mondays)',
    insiderTip: 'Stand by the window in the final bedroom overlooking the courtyard.',
    metroStop: 'Girish Park Metro (5 min walk)',
  },
  {
    id: 'indian-museum',
    name: 'Indian Museum (Jadughar)',
    bengaliName: 'ভারতীয় জাদুঘর (জাদুঘর)',
    tagline: 'Estd. 1814 — Asia’s Oldest Grand Colonnaded Museum',
    category: 'Colonial Heritage',
    coordinates: [88.3512, 22.5579],
    imageUrl: '/images/destinations/indian-museum.jpg',
    region: 'Jawaharlal Nehru Road',
    rating: 4.8,
    reviewsCount: 2980,
    timing: '10:00 AM – 6:00 PM (Closed Mondays)',
    insiderTip: 'Marvel at the 4,000-year-old Egyptian mummy and Ashokan capitals.',
    metroStop: 'Park Street Metro (Gate 1)',
  },
  {
    id: 'kalighat-temple',
    name: 'Kalighat Kali Temple',
    bengaliName: 'কালীঘাট মন্দির',
    tagline: 'Ancient 51 Shakti Peeth on the Adi Ganga Canal',
    category: 'Spiritual Heritage',
    coordinates: [88.3424, 22.5197],
    imageUrl: 'https://www.tourmyindia.com/states/west-bengal/images/kalighat-kali-temple1.jpg',
    region: 'South Kolkata',
    rating: 4.7,
    reviewsCount: 2310,
    timing: '5:00 AM – 2:00 PM, 5:00 PM – 10:30 PM',
    insiderTip: 'Buy authentic clay dolls and hibiscus garlands from old vendors.',
    metroStop: 'Kalighat Metro Station (5 min walk)',
  },
  {
    id: 'park-street-heritage',
    name: 'Park Street & Flurys Heritage',
    bengaliName: 'পার্ক স্ট্রিট ও ফ্লুরিজ',
    tagline: 'Colonial Tea Rooms, Vintage Jazz Pubs & Gastronomic Lore',
    category: 'Gastronomy & Boulevards',
    coordinates: [88.3542, 22.5512],
    imageUrl: 'https://s7ap1.scene7.com/is/image/incredibleindia/park-street-kolkata-west-bengal-1-attr-hero?qlt=82&ts=1742152704187',
    region: 'Downtown Heritage Core',
    rating: 4.9,
    reviewsCount: 3890,
    timing: 'Open daily till late night',
    insiderTip: 'Try breakfast rum balls and Darjeeling tea at Flurys (est. 1927).',
    metroStop: 'Park Street Metro',
  },
  {
    id: 'national-library',
    name: 'National Library of India (Belvedere Estate)',
    bengaliName: 'ভারতের জাতীয় গ্রন্থাগার',
    tagline: 'Colonial Viceregal Estate Housing Millions of Rare Manuscripts',
    category: 'Colonial Heritage',
    coordinates: [88.3332, 22.5338],
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    region: 'Belvedere Road, Alipore',
    rating: 4.8,
    reviewsCount: 1350,
    timing: '9:00 AM – 8:00 PM (Mon–Fri)',
    insiderTip: 'Walk the shaded banyan avenues past the historic viceroy ballroom.',
    metroStop: 'Netaji Bhavan Metro (15 min walk or cab)',
  },
];

// OSRM demo route colors
const routeColor = '#C6532B';
const inactiveOpacity = 0.35;

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Great-circle Haversine distance in meters
function getHaversineDistanceMeters(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

interface KolkataPlacesMapSectionProps {
  onSelectDestination?: (destination: Destination) => void;
}

export const KolkataPlacesMapSection: React.FC<KolkataPlacesMapSectionProps> = ({
  onSelectDestination,
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('victoria-memorial');
  const [userLocation, setUserLocation] = useState<UserLocation>({
    name: 'Kolkata Center',
    lng: 88.3639,
    lat: 22.5726,
    isGPS: false,
  });
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'locating' | 'locked' | 'approximate' | 'fallback' | 'denied'>('locating');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Places');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light');
  const [is3D, setIs3D] = useState(true);
  const [isPlacesDrawerOpen, setIsPlacesDrawerOpen] = useState(false);

  // Close places drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacesDrawerOpen) {
        setIsPlacesDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlacesDrawerOpen]);

  // OpenFreeMap 3D style URL
  const openStreetMap3DStyle = 'https://tiles.openfreemap.org/styles/liberty';

  // Robust live location detection: High Accuracy -> Network Geolocation -> IP Fallback -> Center Fallback
  const detectLiveLocation = useCallback((isManualClick = false) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsStatus('fallback');
      setGpsError('Geolocation is not supported by your browser.');
      setIsLocatingUser(false);
      return;
    }

    setIsLocatingUser(true);
    setGpsStatus('locating');
    setGpsError(null);

    const onGeoSuccess = (pos: GeolocationPosition, _source = 'GPS') => {
      const liveLoc: UserLocation = {
        name: 'My Current Location',
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
        isGPS: true,
      };
      setUserLocation(liveLoc);
      setGpsStatus('locked');
      setGpsError(null);
      setIsLocatingUser(false);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [liveLoc.lng, liveLoc.lat], zoom: 13.5, duration: 1000 });
      }
    };

    const tryNetworkFallback = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => onGeoSuccess(pos, 'Network'),
        async (lowAccError) => {
          console.warn('Network geolocation failed:', lowAccError.message);

          if (lowAccError.code === lowAccError.PERMISSION_DENIED) {
            setGpsStatus('denied');
            setGpsError('Location access was denied in browser permissions. Please allow location access in your address bar.');
            setIsLocatingUser(false);
            return;
          }

          // Try client-side IP-based location fallback if GPS and network fail
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data.latitude && data.longitude) {
                const ipLoc: UserLocation = {
                  name: data.city ? `My Location (${data.city})` : 'My Location (IP)',
                  lng: Number(data.longitude),
                  lat: Number(data.latitude),
                  isGPS: true,
                };
                setUserLocation(ipLoc);
                setGpsStatus('approximate');
                setGpsError(null);
                setIsLocatingUser(false);
                if (mapRef.current) {
                  mapRef.current.flyTo({ center: [ipLoc.lng, ipLoc.lat], zoom: 12.5, duration: 1000 });
                }
                return;
              }
            }
          } catch (e) {
            console.warn('IP geolocation fallback failed or timed out:', e);
          }

          // Fallback to Kolkata center if all methods fail
          setGpsStatus('fallback');
          if (isManualClick) {
            setGpsError('Could not retrieve device GPS. Please check location permissions in your browser.');
          }
          setIsLocatingUser(false);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    };

    // First attempt: High accuracy GPS (for phones/tablets or devices with GPS hardware)
    navigator.geolocation.getCurrentPosition(
      (pos) => onGeoSuccess(pos, 'GPS'),
      (highAccError) => {
        if (highAccError.code === highAccError.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsError('Location permission denied. Click address bar lock icon to allow location.');
          setIsLocatingUser(false);
          return;
        }
        console.warn('High accuracy GPS timed out or unavailable, retrying network geolocation...');
        tryNetworkFallback();
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
    );
  }, []);

  // Detect live location on mount & watch permission changes
  useEffect(() => {
    detectLiveLocation(false);

    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permissionStatus) => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            detectLiveLocation(false);
          } else if (permissionStatus.state === 'denied') {
            setGpsStatus('denied');
            setGpsError('Location permission is blocked in your browser.');
          }
        };
      }).catch(() => {});
    }
  }, [detectLiveLocation]);

  // Ease map pitch when toggling 3D mode
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }
  }, [is3D]);

  // OSRM Routes State
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Link each place item to the rich destination data in travel.config.ts if available
  const enrichedPlaces = useMemo(() => {
    return KOLKATA_LANDMARKS.map((item) => {
      const match = travelData.destinations.find(
        (d) => d.id === item.id || d.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 8))
      );
      return {
        ...item,
        destinationData: match,
      };
    });
  }, []);

  // Currently selected destination place
  const selectedPlace = useMemo(() => {
    return enrichedPlaces.find((p) => p.id === selectedPlaceId) || enrichedPlaces[0];
  }, [enrichedPlaces, selectedPlaceId]);

  // Compute straight-line distance fallback for all places from user's current location
  const placesWithDistances = useMemo(() => {
    return enrichedPlaces.map((place) => {
      const distanceMeters = getHaversineDistanceMeters(
        userLocation.lng,
        userLocation.lat,
        place.coordinates[0],
        place.coordinates[1],
      );
      return {
        ...place,
        distanceMeters,
        formattedDistance: formatDistance(distanceMeters),
      };
    });
  }, [enrichedPlaces, userLocation]);

  // Filtered places based on category and search query
  const filteredPlaces = useMemo(() => {
    return placesWithDistances.filter((place) => {
      const matchesCategory =
        selectedCategory === 'All Places' || place.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        place.region.toLowerCase().includes(query) ||
        place.tagline.toLowerCase().includes(query) ||
        place.bengaliName?.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [placesWithDistances, selectedCategory, searchQuery]);

  // Fit bounds helper to frame both the user's location and the destination
  const fitRouteBounds = useCallback((startCoords: [number, number], endCoords: [number, number]) => {
    if (!mapRef.current) return;
    const minLng = Math.min(startCoords[0], endCoords[0]);
    const maxLng = Math.max(startCoords[0], endCoords[0]);
    const minLat = Math.min(startCoords[1], endCoords[1]);
    const maxLat = Math.max(startCoords[1], endCoords[1]);

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        maxZoom: 15.5,
        duration: 1200,
      }
    );
  }, []);

  // Fetch real-time OSRM driving route when user location or selected place changes
  useEffect(() => {
    if (!selectedPlace) return;

    let isSubscribed = true;
    setIsLoadingRoute(true);
    setRouteError(null);

    const start = { lng: userLocation.lng, lat: userLocation.lat };
    const end = { lng: selectedPlace.coordinates[0], lat: selectedPlace.coordinates[1] };

    async function fetchRoutes() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`,
        );

        if (!response.ok) {
          throw new Error(`OSRM responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (isSubscribed && data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] };
              duration: number;
              distance: number;
            }) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            }),
          );
          setRoutes(routeData);
          setSelectedIndex(0);
          fitRouteBounds([start.lng, start.lat], [end.lng, end.lat]);
        } else if (isSubscribed) {
          // Direct fallback line
          const directDistance = getHaversineDistanceMeters(start.lng, start.lat, end.lng, end.lat);
          setRoutes([
            {
              coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat],
              ],
              distance: directDistance,
              duration: Math.round((directDistance / 25000) * 3600), // ~25 km/h driving estimate
            },
          ]);
          setSelectedIndex(0);
          fitRouteBounds([start.lng, start.lat], [end.lng, end.lat]);
        }
      } catch (error) {
        console.warn('OSRM route fetch failed, using direct coordinate route:', error);
        if (isSubscribed) {
          const directDistance = getHaversineDistanceMeters(start.lng, start.lat, end.lng, end.lat);
          setRoutes([
            {
              coordinates: [
                [start.lng, start.lat],
                [end.lng, end.lat],
              ],
              distance: directDistance,
              duration: Math.round((directDistance / 25000) * 3600),
            },
          ]);
          setSelectedIndex(0);
          fitRouteBounds([start.lng, start.lat], [end.lng, end.lat]);
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingRoute(false);
        }
      }
    }

    fetchRoutes();

    return () => {
      isSubscribed = false;
    };
  }, [userLocation, selectedPlace, fitRouteBounds]);

  // Request browser geolocation for live location
  const handleDetectLiveLocation = () => {
    detectLiveLocation(true);
  };

  // Fly smoothly to landmark and close places drawer
  const handleSelectPlace = (place: KolkataPlaceItem) => {
    setSelectedPlaceId(place.id);
    setIsPlacesDrawerOpen(false);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: place.coordinates,
        zoom: 14.5,
        pitch: is3D ? 60 : 0,
        duration: 1200,
      });
    }
  };

  // Handle opening full destination modal
  const handleOpenDestinationModal = (place: KolkataPlaceItem) => {
    if (onSelectDestination) {
      if (place.destinationData) {
        onSelectDestination(place.destinationData);
      } else {
        const fallbackDest: Destination = {
          id: place.id,
          name: place.name,
          tagline: place.tagline,
          category: place.category,
          region: place.region,
          rating: place.rating,
          reviewsCount: place.reviewsCount,
          imageUrl: place.imageUrl,
          description: `${place.name} is one of Kolkata's most celebrated heritage destinations. ${place.tagline}. Located in ${place.region}, it offers travelers a glimpse into the living history and culture of Calcutta.`,
          highlights: [
            place.tagline,
            `Convenient transit via ${place.metroStop}`,
            place.insiderTip,
            `Optimal hours: ${place.timing}`,
          ],
          bestTimeToVisit: place.timing,
          timing: place.timing,
          howToReach: place.metroStop,
          entryFee: 'Check local guidelines upon arrival',
          insiderTip: place.insiderTip,
        };
        onSelectDestination(fallbackDest);
      }
    }
  };

  const activeRoute = routes[selectedIndex];

  return (
    <section
      id="kolkata-map-atlas"
      className="py-8 sm:py-12 lg:py-14 border-t border-[#E8D5C2] relative bg-[#F7EBDD]/50"
    >
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs mb-2.5">
            <RouteIcon className="size-3.5 text-[#C6532B]" />
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#582822] tracking-wider uppercase">
              CHAPTER II-B · LOCATION DISTANCE & LIVE ROUTING
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#351E1A] tracking-tight leading-tight mb-2">
            Real-Time Distance & Route to Any Landmark
          </h2>

          <p className="font-bengali text-base sm:text-lg text-[#C6532B] font-medium mb-2">
            আপনার বর্তমান অবস্থান থেকে কলকাতার দর্শনীয় স্থানের দূরত্ব ও পথ
          </p>

          <p className="text-[#582822]/80 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
            Select any heritage destination to instantly view the driving distance, travel duration, and highlighted path from your current location, powered by <span className="font-semibold text-[#C6532B]">mapcn MapRoute</span>.
          </p>
        </div>


        {/* Selected Landmark Quick Status Banner */}
        {selectedPlace && (
          <div className="mb-6 bg-gradient-to-r from-[#FFF8EF] to-[#F7EBDD] p-3.5 sm:p-4 rounded-2xl border border-[#E8D5C2] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-[#E8D5C2] bg-[#351E1A]">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/destinations/victoria-memorial.jpg';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C6532B] bg-[#C6532B]/10 px-2 py-0.5 rounded-full">
                    Selected Destination
                  </span>
                  <span className="text-xs text-[#582822]/70 font-mono">
                    From: {userLocation.name}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#351E1A] leading-tight mt-0.5">
                  {selectedPlace.name}
                </h3>
              </div>
            </div>

            {/* Distance & Travel Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#E8D5C2] text-center shadow-2xs">
                <div className="text-[10px] font-semibold text-[#582822]/70 uppercase tracking-wider">
                  Distance
                </div>
                <div className="text-sm sm:text-base font-bold font-mono text-[#C6532B]">
                  {activeRoute ? formatDistance(activeRoute.distance) : 'Calculating...'}
                </div>
              </div>

              <div className="bg-[#FFF8EF] px-3.5 py-2 rounded-xl border border-[#E8D5C2] text-center shadow-2xs">
                <div className="text-[10px] font-semibold text-[#582822]/70 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Car className="size-3 text-[#C6532B]" /> Drive Time
                </div>
                <div className="text-sm sm:text-base font-bold font-mono text-[#351E1A]">
                  {activeRoute ? formatDuration(activeRoute.duration) : 'Calculating...'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDestinationModal(selectedPlace)}
                className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#C6532B] hover:bg-[#582822] text-[#FFF8EF] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Eye className="size-3.5" />
                View Archive
              </button>
            </div>
          </div>
        )}

        {/* Category Pills & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['All Places', 'Colonial Heritage', 'Riverfront & Ghats', 'Spiritual Heritage', 'Culture & Literature', 'Gastronomy & Boulevards'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all shrink-0 cursor-pointer ${selectedCategory === cat
                    ? 'bg-[#C6532B] text-white shadow-md shadow-[#C6532B]/20 scale-102 font-semibold'
                    : 'bg-[#FFF8EF] text-[#351E1A] border border-[#E8D5C2] hover:bg-[#F7EBDD]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px] md:w-72">
            <Search className="size-4 text-[#582822]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places or metro..."
              className="w-full bg-[#FFF8EF] border border-[#E8D5C2] rounded-full pl-9 pr-4 py-2 text-xs text-[#351E1A] placeholder:text-[#582822]/50 focus:outline-none focus:ring-2 focus:ring-[#C6532B] shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#582822]/60 hover:text-[#582822] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Main Map Canvas (Full Width) */}
        <div className="w-full bg-[#FFF8EF] rounded-2xl sm:rounded-3xl border border-[#E8D5C2] overflow-hidden shadow-xl p-1 relative">
            {/* Top Bar inside Map Frame with GPS Status & Manual Trigger */}
            <div className="bg-[#F7EBDD]/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-[#E8D5C2] flex flex-wrap items-center justify-between gap-2 text-xs text-[#582822]">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Live GPS Status Pill */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] shadow-2xs cursor-pointer hover:bg-[#F7EBDD] transition-colors"
                  onClick={() => detectLiveLocation(true)}
                  title="Click to detect or refresh your live device location"
                >
                  {isLocatingUser ? (
                    <Loader2 className="size-3 animate-spin text-[#C6532B]" />
                  ) : gpsStatus === 'locked' ? (
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  ) : gpsStatus === 'denied' ? (
                    <span className="size-2 rounded-full bg-red-500" />
                  ) : (
                    <span className="size-2 rounded-full bg-amber-500" />
                  )}
                  <span className="text-[11px] font-mono font-semibold">
                    {isLocatingUser
                      ? 'Detecting GPS...'
                      : gpsStatus === 'locked'
                      ? 'GPS Active'
                      : gpsStatus === 'approximate'
                      ? 'Approximate Location'
                      : gpsStatus === 'denied'
                      ? 'GPS Denied'
                      : 'Kolkata Fallback'}
                  </span>
                </div>

                <span className="font-semibold text-[#351E1A] truncate max-w-[200px] sm:max-w-xs">
                  {selectedPlace ? `${userLocation.name} ➔ ${selectedPlace.name}` : 'Kolkata Distance Navigator'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeRoute && (
                  <span className="text-[11px] font-mono font-bold text-[#C6532B] bg-[#C6532B]/10 px-2 py-0.5 rounded-md">
                    {formatDistance(activeRoute.distance)} • {formatDuration(activeRoute.duration)}
                  </span>
                )}

                {/* Explicit Detect GPS Button */}
                <button
                  type="button"
                  onClick={() => detectLiveLocation(true)}
                  disabled={isLocatingUser}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8EF] border border-[#C6532B]/40 hover:bg-[#C6532B] hover:text-white text-[#C6532B] font-sans text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                  title="Detect your device's live GPS coordinates"
                >
                  <Crosshair className={cn("size-3", isLocatingUser && "animate-spin")} />
                  <span className="hidden sm:inline">
                    {gpsStatus === 'locked' ? 'Refresh GPS' : 'Fetch Live GPS'}
                  </span>
                </button>
              </div>
            </div>

            {/* GPS Error & Permission Guidance Banner */}
            {gpsError && (
              <div className="bg-amber-50/95 backdrop-blur-xs border-b border-amber-200 px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-amber-900 transition-all">
                <div className="flex items-center gap-2">
                  <LocateFixed className="size-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs leading-tight">{gpsError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => detectLiveLocation(true)}
                  className="text-[11px] font-bold text-[#C6532B] hover:text-[#582822] underline cursor-pointer shrink-0 ml-2"
                >
                  Retry GPS
                </button>
              </div>
            )}

            {/* mapcn Map Container with explicit height */}
            <div className="h-[460px] sm:h-[580px] lg:h-[700px] w-full relative overflow-hidden rounded-xl">
              {/* Map Floating Controls: Hamburger Places Menu, 3D toggle & 2D-only Light/Dark toggle */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                {/* Hamburger Places Button */}
                <button
                  type="button"
                  onClick={() => setIsPlacesDrawerOpen((prev) => !prev)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer active:scale-95",
                    isPlacesDrawerOpen
                      ? "bg-[#C6532B] text-white border-[#C6532B] shadow-[#C6532B]/30 ring-2 ring-[#C6532B]/30"
                      : "bg-[#FFF8EF]/95 hover:bg-[#FFF8EF] text-[#351E1A] border-[#E8D5C2]"
                  )}
                  title={isPlacesDrawerOpen ? "Close Places Menu" : "View Places List"}
                  aria-expanded={isPlacesDrawerOpen}
                >
                  {isPlacesDrawerOpen ? (
                    <X className="size-4" />
                  ) : (
                    <Menu className="size-4 text-[#C6532B]" />
                  )}
                  <span className="font-semibold">Places</span>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold",
                    isPlacesDrawerOpen ? "bg-white/20 text-white" : "bg-[#C6532B]/10 text-[#C6532B]"
                  )}>
                    {filteredPlaces.length}
                  </span>
                </button>

                {/* 3D / 2D Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIs3D((prev) => !prev)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer",
                    is3D
                      ? "bg-[#C6532B] text-white border-[#C6532B] shadow-[#C6532B]/30"
                      : "bg-[#FFF8EF]/95 hover:bg-[#FFF8EF] text-[#351E1A] border-[#E8D5C2]"
                  )}
                  title={is3D ? "Switch to 2D view" : "Switch to 3D perspective"}
                >
                  <Compass className="size-3.5" />
                  <span>{is3D ? "3D" : "2D"}</span>
                </button>

                {/* Dark / Light Mode Toggle Button: ONLY VISIBLE WHEN IN 2D */}
                {!is3D && (
                  <button
                    type="button"
                    onClick={() => setMapTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
                    className="px-3 py-1.5 rounded-xl border border-[#E8D5C2] text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md bg-[#FFF8EF]/95 hover:bg-[#FFF8EF] text-[#351E1A] transition-all cursor-pointer"
                    title="Toggle Light / Dark Basemap"
                  >
                    {mapTheme === 'dark' ? (
                      <>
                        <Sun className="size-3.5 text-amber-500" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="size-3.5 text-[#582822]" />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <Map
                ref={mapRef}
                center={[88.355, 22.565]}
                zoom={12.4}
                theme={mapTheme}
                styles={
                  is3D
                    ? { light: openStreetMap3DStyle, dark: openStreetMap3DStyle }
                    : undefined
                }
                pitch={is3D ? 60 : 0}
                loading={isLoadingRoute}
                className="rounded-xl overflow-hidden"
              >
                {/* Standard MapControls */}
                <MapControls
                  position="bottom-right"
                  showZoom
                  showCompass
                  showLocate
                  showFullscreen
                  onLocate={(coords) => {
                    const liveLoc: UserLocation = {
                      name: 'My Current Location',
                      lng: coords.longitude,
                      lat: coords.latitude,
                      isGPS: true,
                    };
                    setUserLocation(liveLoc);
                    setGpsStatus('locked');
                    setGpsError(null);
                    setIsLocatingUser(false);
                  }}
                />

                {/* 1. OSRM LIVE ROUTE HIGHLIGHT USING MAPCN MapRoute */}
                {routes.map((route, index) => (
                  <MapRoute
                    key={index}
                    coordinates={route.coordinates}
                    active={index === selectedIndex}
                    color={routeColor}
                    width={5}
                    opacity={inactiveOpacity}
                    activeWidth={6}
                    activeOpacity={1}
                    onClick={() => setSelectedIndex(index)}
                  />
                ))}

                {/* 2. USER CURRENT LOCATION MARKER */}
                <MapMarker
                  longitude={userLocation.lng}
                  latitude={userLocation.lat}
                >
                  <MarkerContent>
                    <div className="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2 z-40">
                      <span className="absolute -inset-3 rounded-full bg-blue-500/30 animate-ping" />
                      <span className="absolute -inset-1 rounded-full bg-blue-400/40 animate-pulse" />
                      <div className="size-9 rounded-full bg-blue-600 text-white border-2 border-white shadow-2xl flex items-center justify-center text-sm font-bold ring-2 ring-blue-300">
                        📍
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-blue-950 text-white text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full shadow-lg border border-blue-400/40 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        {userLocation.isGPS ? 'My Current Location' : userLocation.name}
                      </div>
                    </div>
                  </MarkerContent>
                  <MarkerTooltip>
                    <div className="text-center font-sans">
                      <p className="font-semibold text-blue-400">
                        {userLocation.isGPS ? 'My Current Location' : userLocation.name}
                      </p>
                      <p className="text-[10px] text-white/80">Route Origin (Start)</p>
                    </div>
                  </MarkerTooltip>
                </MapMarker>

                {/* 3. ALL LANDMARK PLACE MARKERS (Clicking any calculates distance & highlights route) */}
                {filteredPlaces.map((place) => {
                  const isSelected = selectedPlaceId === place.id;
                  return (
                    <MapMarker
                      key={place.id}
                      longitude={place.coordinates[0]}
                      latitude={place.coordinates[1]}
                      onClick={() => handleSelectPlace(place)}
                    >
                      <MarkerContent>
                        <div
                          className={`relative group transition-transform duration-300 ${isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-10'
                            }`}
                        >
                          {isSelected && (
                            <span className="absolute -inset-2 rounded-full bg-[#C6532B]/40 animate-ping" />
                          )}

                          <div
                            className={`flex items-center justify-center size-8 rounded-full shadow-lg border-2 transition-all ${isSelected
                                ? 'bg-[#582822] text-[#FFF8EF] border-[#FFF8EF] shadow-xl ring-2 ring-[#C6532B]'
                                : 'bg-[#C6532B] text-white border-white hover:bg-[#582822]'
                              }`}
                          >
                            <Landmark className="size-4" />
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none whitespace-nowrap bg-[#351E1A] text-white text-[10px] font-medium px-2 py-0.5 rounded shadow">
                            {place.name} ({place.formattedDistance})
                          </div>
                        </div>
                      </MarkerContent>

                      <MarkerTooltip>
                        <div className="text-center font-sans">
                          <p className="font-semibold">{place.name}</p>
                          <p className="text-[10px] text-[#D9A38E]">
                            {place.formattedDistance} from you
                          </p>
                        </div>
                      </MarkerTooltip>

                      <MarkerPopup closeButton className="w-72 sm:w-80 p-0 overflow-hidden border-[#E8D5C2] shadow-2xl rounded-2xl bg-[#FFF8EF]">
                        <div className="relative h-32 w-full overflow-hidden bg-[#351E1A]">
                          <img
                            src={place.imageUrl}
                            alt={place.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/destinations/victoria-memorial.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-transparent to-transparent opacity-85" />
                          <span className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#C6532B] text-white tracking-wide">
                            {place.category}
                          </span>
                          <span className="absolute top-2 left-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#FFF8EF]/90 text-[#351E1A] backdrop-blur-xs flex items-center gap-1">
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                            {place.rating} ({place.reviewsCount})
                          </span>
                        </div>

                        <div className="p-3.5">
                          <h4 className="font-serif font-bold text-[#351E1A] text-base leading-snug">
                            {place.name}
                          </h4>
                          {place.bengaliName && (
                            <p className="font-bengali text-xs text-[#C6532B] font-medium mb-1">
                              {place.bengaliName}
                            </p>
                          )}

                          {/* Distance badge inside popup */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-semibold my-1.5">
                            <MapPin className="size-3.5 text-blue-600" />
                            {place.formattedDistance} from your location
                          </div>

                          <p className="text-xs text-[#582822]/80 leading-relaxed mb-3">
                            {place.tagline}
                          </p>

                          <div className="space-y-1.5 text-[11px] text-[#582822] mb-3 bg-[#F7EBDD]/60 p-2 rounded-lg border border-[#E8D5C2]/60">
                            <div className="flex items-start gap-1.5">
                              <Clock className="size-3 text-[#C6532B] shrink-0 mt-0.5" />
                              <span>{place.timing}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <Navigation className="size-3 text-[#C6532B] shrink-0 mt-0.5" />
                              <span className="font-medium text-[#351E1A]">{place.metroStop}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDestinationModal(place)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#C6532B] hover:bg-[#582822] text-[#FFF8EF] text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                            >
                              <Eye className="size-3.5" />
                              View Archive
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectPlace(place)}
                              title="Recalculate route and center"
                              className="p-1.5 rounded-lg border border-[#E8D5C2] bg-[#F7EBDD] hover:bg-[#E8D5C2] text-[#582822] transition-colors cursor-pointer"
                            >
                              <Maximize2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  );
                })}
              </Map>

              {/* ROUTE OPTIONS RADIO GROUP OVERLAY */}
              {routes.length > 0 && (
                <div
                  role="radiogroup"
                  aria-label="Route options"
                  className="bg-[#FFF8EF]/95 border-[#E8D5C2] text-[#351E1A] absolute bottom-3 left-3 sm:top-3 sm:left-3 sm:bottom-auto w-40 sm:w-52 space-y-1 rounded-xl border p-1.5 sm:p-2 shadow-xl backdrop-blur-md z-10"
                >
                  <div className="text-[10px] font-semibold text-[#582822] uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#E8D5C2]">
                    <span>Routes</span>
                    <span className="text-[#C6532B] font-mono">{routes.length} options</span>
                  </div>
                  {routes.map((route, index) => {
                    const isActive = index === selectedIndex;

                    return (
                      <button
                        key={index}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                          'flex w-full items-center gap-1.5 sm:gap-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 transition-colors cursor-pointer text-left',
                          isActive ? 'bg-[#F7EBDD] font-semibold shadow-2xs' : 'hover:bg-[#F7EBDD]/60 text-[#582822]',
                        )}
                      >
                        <span
                          className="h-3.5 sm:h-4 w-1 shrink-0 rounded-full"
                          style={{
                            backgroundColor: routeColor,
                            opacity: isActive ? 1 : inactiveOpacity,
                          }}
                        />
                        <span
                          className={cn(
                            'text-[11px] sm:text-xs font-mono tabular-nums text-[#351E1A]',
                            !isActive && 'text-[#582822]/70',
                          )}
                        >
                          {formatDuration(route.duration)}
                        </span>
                        <span className="text-[#582822]/80 ml-auto text-[11px] sm:text-xs font-mono tabular-nums">
                          {formatDistance(route.distance)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Places Drawer Backdrop */}
              {isPlacesDrawerOpen && (
                <div
                  className="absolute inset-0 bg-[#351E1A]/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
                  onClick={() => setIsPlacesDrawerOpen(false)}
                  aria-hidden="true"
                />
              )}

              {/* Places Slide-Over Drawer */}
              <div
                className={cn(
                  'absolute top-0 right-0 bottom-0 w-full sm:w-[380px] md:w-[420px] bg-[#FFF8EF] border-l border-[#E8D5C2] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out',
                  isPlacesDrawerOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                )}
                role="dialog"
                aria-label="Places directory"
                aria-modal="true"
              >
                {/* Header */}
                <div className="p-3.5 sm:p-4 border-b border-[#E8D5C2] bg-[#F7EBDD]/90 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#C6532B]/10 border border-[#C6532B]/20 flex items-center justify-center text-[#C6532B]">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#351E1A] leading-tight">
                        Places ({filteredPlaces.length})
                      </h3>
                      <p className="text-[11px] text-[#582822]/70 font-sans">
                        Select a place to navigate on map
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlacesDrawerOpen(false)}
                    className="size-8 rounded-lg border border-[#E8D5C2] bg-[#FFF8EF] hover:bg-[#F7EBDD] text-[#351E1A] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    title="Close Places Menu (Esc)"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Quick Search & Filter Inside Drawer */}
                <div className="p-3 border-b border-[#E8D5C2]/70 bg-[#FFF8EF] space-y-2">
                  <div className="relative">
                    <Search className="size-3.5 text-[#582822]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search places or metro..."
                      className="w-full bg-[#F7EBDD]/50 border border-[#E8D5C2] rounded-lg pl-8 pr-7 py-1.5 text-xs text-[#351E1A] placeholder:text-[#582822]/50 focus:outline-none focus:ring-1 focus:ring-[#C6532B]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#582822]/60 hover:text-[#582822] cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Chips inside Drawer */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['All Places', 'Colonial Heritage', 'Riverfront & Ghats', 'Spiritual Heritage', 'Culture & Literature', 'Gastronomy & Boulevards'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer",
                          selectedCategory === cat
                            ? "bg-[#C6532B] text-white font-semibold shadow-2xs"
                            : "bg-[#F7EBDD]/60 text-[#582822] border border-[#E8D5C2] hover:bg-[#F7EBDD]"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable Places List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-[#E8D5C2]/40 scrollbar-thin scrollbar-thumb-[#E8D5C2]">
                  {filteredPlaces.length === 0 ? (
                    <div className="py-12 text-center text-[#582822]/60 text-xs">
                      No places match "{searchQuery}".
                    </div>
                  ) : (
                    filteredPlaces.map((place) => {
                      const isSelected = selectedPlaceId === place.id;
                      return (
                        <div
                          key={place.id}
                          onClick={() => handleSelectPlace(place)}
                          className={cn(
                            "pt-2.5 first:pt-0 group flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer",
                            isSelected
                              ? "bg-[#F7EBDD] border border-[#C6532B]/50 shadow-xs ring-1 ring-[#C6532B]/30"
                              : "hover:bg-[#F7EBDD]/60 border border-transparent"
                          )}
                        >
                          {/* Image Thumbnail */}
                          <div className="relative size-14 sm:size-16 rounded-lg overflow-hidden shrink-0 border border-[#E8D5C2] bg-[#351E1A]">
                            <img
                              src={place.imageUrl}
                              alt={place.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/destinations/victoria-memorial.jpg';
                              }}
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#351E1A]/85 text-[8px] font-mono text-center text-[#FFF8EF] py-0.5">
                              {place.rating} ★
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#351E1A] truncate group-hover:text-[#C6532B] transition-colors">
                                {place.name}
                              </h4>
                              {/* Live Distance */}
                              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#C6532B] shrink-0 bg-[#C6532B]/10 px-2 py-0.5 rounded-full">
                                {place.formattedDistance}
                              </span>
                            </div>

                            {place.bengaliName && (
                              <p className="font-bengali text-[11px] text-[#582822]/70 leading-none mb-1">
                                {place.bengaliName}
                              </p>
                            )}

                            <p className="text-[11px] text-[#582822]/80 line-clamp-1 mb-1.5">
                              {place.tagline}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-[#582822]/70">
                              <span className="flex items-center gap-1 truncate max-w-[170px]">
                                <MapPin className="size-3 text-[#C6532B] shrink-0" />
                                {place.metroStop}
                              </span>
                              <span className="text-[#C6532B] group-hover:translate-x-0.5 transition-transform flex items-center font-semibold">
                                Navigate <ChevronRight className="size-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Insight Footer */}
                <div className="p-3 bg-[#F7EBDD]/90 border-t border-[#E8D5C2] flex items-center justify-between gap-2 text-xs">
                  <p className="text-[11px] text-[#582822]/80 truncate">
                    📍 <span className="font-semibold">Live GPS:</span> {userLocation.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => detectLiveLocation(true)}
                    className="text-[11px] font-bold text-[#C6532B] hover:text-[#582822] underline cursor-pointer shrink-0"
                  >
                    {gpsStatus === 'locked' ? 'Update GPS' : 'Detect GPS'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Footnote on OSRM & OpenStreetMap routing */}
        <div className="mt-8 text-center text-xs text-[#582822]/60 font-sans flex items-center justify-center gap-2">
          <span>Routing & distance computed with OSRM (Open Source Routing Machine) & MapLibre GL.</span>
          <span>•</span>
          <span className="text-[#C6532B] font-medium">100% Free & Non-Commercial Calcutta Guide.</span>
        </div>
      </div>
    </section>
  );
};
