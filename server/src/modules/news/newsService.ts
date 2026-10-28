import { XMLParser } from 'fast-xml-parser';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  publishedAt: string;
}

const FEED_PREFIX = 'https://news.google.com/rss/search?q=';

const TOPIC_ALIASES: Record<string, string[]> = {
  technology: ['technology', 'software', 'artificial intelligence', 'cybersecurity', 'startups'],
  science: ['science', 'physics', 'space', 'biology', 'research'],
  finance: ['finance', 'economy', 'markets', 'personal finance', 'investing'],
  history: ['history', 'ancient history', 'world war', 'roman empire', 'cold war'],
  design: ['design', 'ux design', 'product design', 'typography', 'visual design'],
  general: ['current events', 'technology'],
};

const normalizeTopic = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return 'general';
  if (normalized in TOPIC_ALIASES) return normalized;
  for (const [keyword, aliases] of Object.entries(TOPIC_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) return keyword;
  }
  return 'general';
};

const stripHtml = (value: string | undefined) =>
  (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const sourceLabelFromUrl = (link: string) => {
  try {
    return new URL(link).hostname.replace(/^www\./, '');
  } catch {
    return 'News';
  }
};

async function fetchGoogleNews(query: string): Promise<NewsArticle[]> {
  const feedUrl = `${FEED_PREFIX}${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const response = await fetch(feedUrl, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`News feed request failed with status ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', trimValues: true });
  const parsed = parser.parse(xml);
  const items = Array.isArray(parsed?.rss?.channel?.item)
    ? parsed.rss.channel.item
    : parsed?.rss?.channel?.item
      ? [parsed.rss.channel.item]
      : [];

  return items
    .filter((entry: unknown): entry is Record<string, string | undefined> => typeof entry === 'object' && entry !== null)
    .map((entry: Record<string, string | undefined>): NewsArticle => {
      const link = String(entry.link ?? entry.guid ?? '');
      const title = stripHtml(String(entry.title ?? 'Untitled story'));
      const summary = stripHtml(String(entry.description ?? entry.summary ?? ''));
      const publishedAt = entry.pubDate ?? new Date().toISOString();
      return {
        id: `${sourceLabelFromUrl(link)}:${title}:${publishedAt}`,
        title,
        summary: summary || 'Current coverage from a public news source.',
        link,
        source: sourceLabelFromUrl(link),
        publishedAt: new Date(publishedAt).toISOString(),
      };
    })
    .filter((entry: NewsArticle) => entry.link && entry.title)
    .slice(0, 8);
}

export async function fetchNewsForTopic(topic: string, limit = 6): Promise<NewsArticle[]> {
  const normalized = normalizeTopic(topic);
  const fallbackAliases = TOPIC_ALIASES.general ?? [];
  const aliases = TOPIC_ALIASES[normalized] ?? fallbackAliases;

  const firstPass = await Promise.all(
    aliases.map(async (alias: string) => {
      try {
        return await fetchGoogleNews(alias);
      } catch {
        return [] as NewsArticle[];
      }
    }),
  );

  const deduped = new Map<string, NewsArticle>();
  for (const batch of firstPass) {
    for (const item of batch) {
      if (!deduped.has(item.link)) deduped.set(item.link, item);
    }
  }

  return [...deduped.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, limit);
}
