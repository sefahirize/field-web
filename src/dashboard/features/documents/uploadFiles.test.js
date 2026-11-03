import { describe, it, expect, vi } from 'vitest';
import { mergeFiles, validateFiles } from './uploadFiles';

vi.mock('axios', () => ({}));

const file = (name, size = 1000, lastModified = 1) => ({ name, size, lastModified });

describe('validateFiles', () => {
  it('keeps the good files and explains each rejected one', () => {
    const { accepted, problems } = validateFiles([
      file('cv.pdf'),
      file('notes.txt'),
      file('huge.docx', 7 * 1024 * 1024),
      file('PHOTO.JPG'),
    ]);

    expect(accepted.map(f => f.name)).toEqual(['cv.pdf', 'PHOTO.JPG']);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/notes\.txt/);
    expect(problems[1]).toMatch(/huge\.docx is over/);
  });
});

describe('mergeFiles', () => {
  it('adds files without repeating one that is already there', () => {
    const a = file('a.pdf');
    const b = file('b.pdf');
    expect(mergeFiles([a], [a, b])).toEqual([a, b]);
    expect(mergeFiles([a], [file('a.pdf', 1000, 2)])).toHaveLength(2); // same name, a different file
  });
});
