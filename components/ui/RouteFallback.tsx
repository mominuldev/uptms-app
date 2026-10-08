/**
 * The App Shell's placeholder for a CMS route whose path wasn't prerendered
 * (a page, condition or guide published after the build). Holds the space
 * so the footer doesn't jump while the content streams in.
 */
export function RouteFallback() {
  return (
    <div role="status" className="min-h-[70vh]">
      <span className="sr-only">Loading…</span>
    </div>
  );
}
