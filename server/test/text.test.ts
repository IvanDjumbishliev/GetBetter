import { toPlainTextExcerpt } from '@shared/text';
import { describe, expect, it } from 'vitest';

describe('toPlainTextExcerpt', () => {
  it('strips Markdown formatting but keeps the words', () => {
    const markdown =
      '# Title\n\nSome **bold**, _italic_ and `code`.\n\n- a [link](https://x.y)\n> quote';
    expect(toPlainTextExcerpt(markdown, 150)).toBe(
      'Title Some bold, italic and code. a link quote',
    );
  });

  it('drops images and fenced code blocks', () => {
    expect(toPlainTextExcerpt('Look ![cat](c.png)\n```js\nalert(1)\n```\ndone', 150)).toBe(
      'Look done',
    );
  });

  it('removes raw HTML, including script contents', () => {
    expect(
      toPlainTextExcerpt('Hi <script>alert(1)</script><img src=x onerror="y"> <b>there</b>', 150),
    ).toBe('Hi there');
  });

  it('truncates on a word boundary with an ellipsis', () => {
    const excerpt = toPlainTextExcerpt('word '.repeat(100), 150);
    expect(excerpt.length).toBeLessThanOrEqual(151);
    expect(excerpt.endsWith('word…')).toBe(true);
  });

  it('leaves short text untouched', () => {
    expect(toPlainTextExcerpt('Short post', 150)).toBe('Short post');
  });
});
