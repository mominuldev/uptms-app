import type { Metadata } from "next";
import { Suspense } from "react";
import { PageView } from "@/components/page/PageView";
import { Container } from "@/components/ui/Container";
import { getPreview } from "@/lib/cms";

/**
 * Admin "Preview" (uptms-ad Figma 07): renders a page's working copy using
 * the signed, 30-minute token the admin issued. Always dynamic, never
 * cached, never indexed. Laravel verifies the token, not this app.
 */
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

async function Preview({ searchParams }: { searchParams: PageProps<"/preview">["searchParams"] }) {
  const query = await searchParams;
  const path = typeof query.path === "string" ? query.path : "";
  const token = typeof query.token === "string" ? query.token : "";
  const page = path !== "" && token !== "" ? await getPreview(path, token) : null;

  if (!page) {
    return (
      <Container className="py-24">
        <h1 className="font-serif text-heading-m">This preview link has expired.</h1>
        <p className="mt-4 text-body-l text-ink-soft">Open the page in the admin and choose Preview again.</p>
      </Container>
    );
  }

  return <PageView page={page} />;
}

export default function PreviewPage({ searchParams }: PageProps<"/preview">) {
  return (
    <Suspense fallback={<Container className="py-24 text-body-l text-ink-soft">Loading preview…</Container>}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
