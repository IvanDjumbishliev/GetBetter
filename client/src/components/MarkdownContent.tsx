import Markdown, { type Components } from 'react-markdown';

import { cn } from '@/lib/utils';

// User-generated content: react-markdown never renders raw HTML and strips unsafe URLs;
// images are dropped too (tracking pixels, huge files) and links open safely in a new tab.
const components: Components = {
  h1: 'h2',
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer nofollow ugc" />
  ),
};

export function MarkdownContent({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose prose-neutral max-w-none break-words dark:prose-invert', className)}>
      <Markdown components={components} disallowedElements={['img']} unwrapDisallowed>
        {children}
      </Markdown>
    </div>
  );
}
