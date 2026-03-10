export interface AccessibilityFilter {
  deafFriendly?: boolean;
  blindFriendly?: boolean;
}

export interface BitesRestaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  tags: string[];
  description: string;
  food?: { name: string; price?: string }[];
  social_values?: string[];
  accessibility: {
    deafFriendly: boolean;
    blindFriendly: boolean;
  };
}

// Raw shape from the external data API
interface ExternalRestaurant {
  id: string;
  name: string;
  description: string;
  features: string[];
  food?: { name: string; price?: string }[];
  social_values?: string[];
  address: string;
  lat?: string;
  lng?: string;
  issue_link?: string;
}

const RESTAURANTS_API_URL =
  'https://goodaction-hub.github.io/GoodAction-data/restaurants.json';

function extractCity(address: string): string {
  const municipalities = ['北京', '上海', '天津', '重庆'];
  for (const city of municipalities) {
    if (address.includes(city)) return city;
  }
  // Match "省XX市" or "区XX市" pattern (e.g. "安徽省合肥市" → "合肥")
  const afterProvince = address.match(/(?:省|自治区)([\u4e00-\u9fa5]{2,3})市/);
  if (afterProvince) return afterProvince[1];
  // Match "XX市" at start of address (e.g. "广州市越秀区" → "广州")
  const atStart = address.match(/^([\u4e00-\u9fa5]{2,3})市/);
  if (atStart) return atStart[1];
  return address.slice(0, 2);
}

function detectAccessibility(features: string[]): {
  deafFriendly: boolean;
  blindFriendly: boolean;
} {
  const text = features.join(' ');
  return {
    deafFriendly: /手语|听障|耳障|无声/.test(text),
    blindFriendly: /盲|视障|黑暗|触觉/.test(text),
  };
}

const transformRestaurant = (r: ExternalRestaurant): BitesRestaurant => ({
  id: r.id,
  name: r.name,
  address: r.address,
  city: extractCity(r.address),
  lat: r.lat ? parseFloat(r.lat) : undefined,
  lng: r.lng ? parseFloat(r.lng) : undefined,
  tags: (r.features ?? []).slice(0, 3),
  description: r.description,
  food: r.food,
  social_values: r.social_values,
  accessibility: detectAccessibility(r.features ?? []),
});

let _catalogCache: BitesRestaurant[] | null = null;

export async function fetchBitesCatalog(): Promise<BitesRestaurant[]> {
  if (_catalogCache) return _catalogCache;
  try {
    const res = await fetch(RESTAURANTS_API_URL, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ExternalRestaurant[];
    _catalogCache = data.map(transformRestaurant);
    return _catalogCache;
  } catch (err) {
    console.error('Failed to fetch restaurants from external API:', err);
    return [];
  }
}

export function filterBitesCatalog(
  catalog: BitesRestaurant[],
  location: string,
  accessibility: AccessibilityFilter = {},
) {
  const loc = (location || '').trim();
  const byCity = (item: BitesRestaurant) =>
    !loc ? true : item.city.includes(loc) || loc.includes(item.city);
  const byAccess = (item: BitesRestaurant) => {
    const needDeaf = !!accessibility?.deafFriendly;
    const needBlind = !!accessibility?.blindFriendly;
    if (needDeaf && !item.accessibility.deafFriendly) return false;
    if (needBlind && !item.accessibility.blindFriendly) return false;
    return true;
  };
  return catalog.filter((x) => byCity(x) && byAccess(x));
}
