import { describe, it, expect } from 'vitest';
import { highlightRanges, normalize, search, searchFaq, tokenize } from './search';
import { FAQ } from './faq';

const titles = results => results.map(entry => entry.title);

describe('search', () => {
  it('suggests the main pages and popular questions when nothing is typed', () => {
    const { pages, help } = search('');
    expect(titles(pages)).toEqual(expect.arrayContaining(['Buy credits', 'Documents']));
    expect(help.length).toBeGreaterThan(0);
  });

  it('finds a page by its name or by a word people use for it', () => {
    expect(titles(search('analytics').pages)[0]).toBe('Analytics');
    expect(titles(search('receipt').pages)).toContain('Credit history');
    expect(titles(search('token').pages)[0]).toBe('API keys');
  });

  it('finds help questions by their wording and by their answers', () => {
    expect(titles(search('create api key').help)[0]).toBe('How do I create an API key?');
    expect(titles(search('6.0 MB').help).length + titles(search('docx').help).length).toBeGreaterThan(0);
    expect(titles(search('x-api-key').help)).toContain('How do I use an API key?');
  });

  it('needs every word to be somewhere, and returns nothing for nonsense', () => {
    const result = search('zzzzqq');
    expect(result.pages).toEqual([]);
    expect(result.help).toEqual([]);
    expect(search('api qqqzzz').help).toEqual([]);
  });

  it('folds accents and the Turkish dotless i', () => {
    expect(normalize('Sıkça Sorulan İşler')).toBe('sikca sorulan isler');
    expect(titles(search('sikca sorulan sorular').pages)).toContain('Help and FAQ');
    expect(titles(search('şifre').pages)).toContain('Profile');
  });

  it('ranks a title match above a body match', () => {
    const { help } = search('payment');
    expect(titles(help)[0]).toMatch(/payment/i);
  });

  it('filters and ranks the FAQ list for the Help page, or returns it whole', () => {
    expect(searchFaq(FAQ, '')).toHaveLength(FAQ.length);
    const found = searchFaq(FAQ, 'password');
    expect(found.map(item => item.id)).toContain('change-password');
    expect(found.length).toBeLessThan(FAQ.length);
  });

  it('keeps every FAQ id unique and every answer non-empty', () => {
    expect(new Set(FAQ.map(item => item.id)).size).toBe(FAQ.length);
    FAQ.forEach(item => expect(item.answer.length).toBeGreaterThan(0));
  });
});

describe('highlightRanges', () => {
  it('marks where the words are in the text as written', () => {
    expect(highlightRanges('How do I create an API key?', tokenize('api key'))).toEqual([
      [19, 22],
      [23, 26],
    ]);
  });

  it('matches through accents and merges overlaps', () => {
    expect(highlightRanges('Sıkça sorulan', tokenize('sikca'))).toEqual([[0, 5]]);
    expect(highlightRanges('abcdef', ['abc', 'cde'])).toEqual([[0, 5]]);
    expect(highlightRanges('abc', [])).toEqual([]);
  });
});
