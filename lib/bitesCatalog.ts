export interface AccessibilityFilter {
  deafFriendly?: boolean;
  blindFriendly?: boolean;
}

export interface BitesRestaurant {
  name: string;
  address: string;
  city: string;
  tags: string[];
  description: string;
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
  "https://goodaction-hub.github.io/GoodAction-data/restaurants.json";

function extractCity(address: string): string {
  const municipalities = ["北京", "上海", "天津", "重庆"];
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
  const text = features.join(" ");
  return {
    deafFriendly: /手语|听障|耳障|无声/.test(text),
    blindFriendly: /盲|视障|黑暗|触觉/.test(text),
  };
}

function transformRestaurant(r: ExternalRestaurant): BitesRestaurant {
  return {
    name: r.name,
    address: r.address,
    city: extractCity(r.address),
    tags: (r.features ?? []).slice(0, 3),
    description: r.description,
    accessibility: detectAccessibility(r.features ?? []),
  };
}

let _catalogCache: BitesRestaurant[] | null = null;

export async function fetchBitesCatalog(): Promise<BitesRestaurant[]> {
  if (_catalogCache) return _catalogCache;
  try {
    const res = await fetch(RESTAURANTS_API_URL, { cache: "force-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ExternalRestaurant[];
    _catalogCache = data.map(transformRestaurant);
    return _catalogCache;
  } catch (err) {
    console.error(
      "Failed to fetch restaurants from external API, using fallback:",
      err,
    );
    return FALLBACK_CATALOG;
  }
}

export function filterBitesCatalog(
  catalog: BitesRestaurant[],
  location: string,
  accessibility: AccessibilityFilter = {},
) {
  const loc = (location || "").trim();
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

// Fallback catalog used when the external API is unreachable
export const FALLBACK_CATALOG: BitesRestaurant[] = [
  {
    name: "培哥烟囱面包",
    address: "安徽省合肥市庐阳区含山路29号105-3室",
    city: "合肥",
    tags: ["听障友好", "面包", "烘焙"],
    description:
      "提供专业手语服务，图文菜单与电子点餐，视觉化叫号与写字板沟通。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
  {
    name: "木马童话黑暗餐厅",
    address: "北京西城区西单北大街109号西西友谊酒店8层",
    city: "北京",
    tags: ["视障友好", "法餐", "日式料理"],
    description: "完全黑暗用餐体验，视障员工专业引导，盲文菜单与语音介绍。",
    accessibility: { deafFriendly: false, blindFriendly: true },
  },
  {
    name: "星巴克东方文德手语门店（广州）",
    address: "广州市越秀区文德北路68号东方文德广场一层",
    city: "广州",
    tags: ["听障友好", "咖啡"],
    description: "手语沟通与无障碍动线设计，伙伴支持可视化提示与社区友好活动。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
  {
    name: "全聚德前门店（北京）",
    address: "北京市东城区前门大街 全聚德前门店",
    city: "北京",
    tags: ["无障碍服务", "盲文菜单", "手语"],
    description:
      "盲文菜单与无障碍用餐区，导盲犬友好；员工接受基础手语培训，提供贴心平等的用餐体验。",
    accessibility: { deafFriendly: true, blindFriendly: true },
  },
  {
    name: "那伽树无障碍咖啡披萨集合店（北京大栅栏）",
    address: "北京前门大栅栏 那伽树咖啡厅",
    city: "北京",
    tags: ["视障友好", "轮椅友好", "咖啡", "披萨"],
    description:
      "全国首家无障碍咖啡披萨集合店，设置缓坡、低位呼叫按钮、风铃定位与宽双开门等设施，倡导残健共融。",
    accessibility: { deafFriendly: false, blindFriendly: true },
  },
  {
    name: "无声饭店（云南玉溪）",
    address: "云南省玉溪市 无声饭店",
    city: "玉溪",
    tags: ["听障友好", "家常菜"],
    description:
      "由听障员工共同经营，通过学习手语与贴心服务打破沟通障碍，提供温暖、平等的用餐体验。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
];

/** @deprecated Use fetchBitesCatalog() instead */
export const BITES_CATALOG = FALLBACK_CATALOG;
