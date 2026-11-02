import { HELP_ENTRIES, PAGES } from './searchIndex';

/** Lower case, accents and Turkish dotted/dotless i folded, so "sikca" finds "sıkça". */
export const normalize = value =>
  String(value ?? '')
    .toLocaleLowerCase('en')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss');

export const tokenize = query =>
  normalize(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/**
 * How well one entry answers the query, or 0 when it does not. Every word of
 * the query has to be found somewhere in the entry; where it is found decides
 * the score — in the title counts most, then in the keywords, then in the
 * description or answer.
 */
const scoreEntry = (entry, tokens) => {
  const title = normalize(entry.title);
  const keywords = (entry.keywords ?? []).map(normalize);
  const body = normalize(entry.description);
  const titleWords = title.split(/[^a-z0-9]+/).filter(Boolean);

  let total = 0;
  for (const token of tokens) {
    let best = 0;
    if (titleWords.some(word => word === token)) best = 100;
    else if (titleWords.some(word => word.startsWith(token))) best = 85;
    else if (title.includes(token)) best = 60;

    if (best < 50 && keywords.some(keyword => keyword === token || keyword.split(/[^a-z0-9]+/).includes(token))) best = Math.max(best, 55);
    else if (best < 40 && keywords.some(keyword => keyword.includes(token))) best = Math.max(best, 40);

    if (best === 0 && body.includes(token)) best = 15;
    if (best === 0) return 0; // a word that is nowhere rules the entry out
    total += best;
  }

  // Several words that all sit in the title is a better match than a scatter.
  if (tokens.length > 1 && tokens.every(token => title.includes(token))) total += 40;
  return total;
};

const rank = (entries, tokens, limit) =>
  entries
    .map((entry, index) => ({ entry, index, score: scoreEntry(entry, tokens) }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(result => result.entry);

/**
 * Pages and help questions for a query. With nothing typed it returns the
 * suggestions to show on opening: the main pages and the popular questions.
 */
export const search = (query, { pageLimit = 5, helpLimit = 5 } = {}) => {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return {
      query: '',
      tokens,
      pages: PAGES.filter(page => ['products', 'documents', 'api-credentials', 'analytics'].includes(page.id)),
      help: HELP_ENTRIES.filter(entry => entry.popular).slice(0, helpLimit),
    };
  }

  return { query, tokens, pages: rank(PAGES, tokens, pageLimit), help: rank(HELP_ENTRIES, tokens, helpLimit) };
};

/** FAQ items that match a query, in FAQ order scored — for the Help page's own search box. */
export const searchFaq = (items, query) => {
  const tokens = tokenize(query);
  if (tokens.length === 0) return items;
  const entries = items.map(item => ({
    ...item,
    title: item.question,
    description: item.answer.join(' '),
  }));
  return rank(entries, tokens, entries.length);
};

/**
 * Where `tokens` sit in `text`, as `[start, end)` ranges in the original string,
 * for highlighting. Matching is done on the folded text (accents and case
 * ignored), so "sikca" lights up "sıkça" in the text as it was written.
 */
export const highlightRanges = (text, tokens) => {
  if (!tokens.length) return [];
  const chars = Array.from(String(text));
  let folded = '';
  const origin = []; // folded index -> original char index
  chars.forEach((char, index) => {
    const piece = normalize(char);
    for (let i = 0; i < piece.length; i += 1) origin.push(index);
    folded += piece;
  });

  const ranges = [];
  tokens.forEach(token => {
    let from = 0;
    for (;;) {
      const at = folded.indexOf(token, from);
      if (at === -1) break;
      ranges.push([origin[at], origin[at + token.length - 1] + 1]);
      from = at + token.length;
    }
  });

  // Merge overlaps so a character is only wrapped once.
  ranges.sort((a, b) => a[0] - b[0]);
  return ranges.reduce((merged, range) => {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
    return merged;
  }, []);
};
