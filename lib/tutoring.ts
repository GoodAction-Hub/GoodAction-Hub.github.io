export interface TutoringMediaRef {
  title: string;
  url: string;
}

export interface ExternalTutoringCourse {
  slug: string;
  title: string;
  instructor?: string;
  stage?: string;
  duration_min?: number;
  tags?: string[];
  summary?: string;
  cover?: string;
  body?: string;
  videos?: TutoringMediaRef[];
  audios?: TutoringMediaRef[];
  attachments?: TutoringMediaRef[];
}

export interface TutoringCourse {
  slug: string;
  title: string;
  instructor?: string;
  stage?: string;
  durationMin?: number;
  tags: string[];
  summary: string;
  cover?: string;
  bodyUrl?: string;
  videos: TutoringMediaRef[];
  audios: TutoringMediaRef[];
  attachments: TutoringMediaRef[];
}

const TUTORING_API_URL =
  'https://goodaction-hub.github.io/GoodAction-data/tutoring.json';

const DATA_REPO_RAW_BASE =
  'https://raw.githubusercontent.com/GoodAction-Hub/GoodAction-data/main/data/';

const DATA_REPO_PAGES_BASE =
  'https://goodaction-hub.github.io/GoodAction-data/';

const isAbsolute = (url: string) => /^https?:\/\//i.test(url);

// Markdown 走 raw（Jekyll 不会处理）；二进制资源走 Pages（CDN 更快）
const resolveMarkdown = (path?: string) =>
  path ? (isAbsolute(path) ? path : DATA_REPO_RAW_BASE + path) : undefined;

const resolveAsset = (path?: string) =>
  path ? (isAbsolute(path) ? path : DATA_REPO_PAGES_BASE + path) : undefined;

const resolveMedia = (media?: TutoringMediaRef[]): TutoringMediaRef[] =>
  (media ?? []).map((m) => ({
    title: m.title,
    url: resolveAsset(m.url) ?? m.url,
  }));

const transformCourse = (c: ExternalTutoringCourse): TutoringCourse => ({
  slug: c.slug,
  title: c.title,
  instructor: c.instructor,
  stage: c.stage,
  durationMin: c.duration_min,
  tags: c.tags ?? [],
  summary: c.summary ?? '',
  cover: resolveAsset(c.cover),
  bodyUrl: resolveMarkdown(c.body),
  videos: resolveMedia(c.videos),
  audios: resolveMedia(c.audios),
  attachments: resolveMedia(c.attachments),
});

let _catalogCache: TutoringCourse[] | null = null;

export async function fetchTutoringCatalog(): Promise<TutoringCourse[]> {
  if (_catalogCache) return _catalogCache;
  try {
    // 默认缓存：尊重 GitHub Pages 的 Cache-Control，过期后用 ETag 重新校验，
    // 避免 force-cache 把过期数据一直钉死在浏览器缓存里
    const res = await fetch(TUTORING_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ExternalTutoringCourse[];
    _catalogCache = data.map(transformCourse);
    return _catalogCache;
  } catch (err) {
    console.error('Failed to fetch tutoring catalog:', err);
    return [];
  }
}

export async function fetchTutoringBody(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error('Failed to fetch tutoring markdown body:', err);
    return '';
  }
}
