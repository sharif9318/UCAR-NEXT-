import type { NextPage } from "next";

// UI-only HOC: Do not attach getStaticProps/getServerSideProps here.
// Next.js requires data fetching methods to be exported from the page file.
export function withI18n(namespaces: string[] = ["common"]) {
  return function <P = any>(Page: NextPage<P>): NextPage<P> {
    const Wrapped: any = Page;
    // No data method attachment here. Keep wrapper pure.
    return Wrapped as NextPage<P>;
  };
}

export default withI18n;
