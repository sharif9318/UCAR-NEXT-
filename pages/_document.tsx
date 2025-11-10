import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import fs from "fs";
import path from "path";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { seo: any; locale: string }> {
    const initialProps = await Document.getInitialProps(ctx);
    // Determine locale
    const locale = ctx.locale || "en";
    // Load SEO translations from locale file
    let seo = {
      title:
        "UCAR - Buy and Sell Cars in South Korea | Used Cars, Best Prices, Trusted Dealers",
      description:
        "Buy and sell cars anywhere, anytime in South Korea. Best cars at the best prices on UCAR. Trusted by thousands of happy customers.",
      keywords:
        "ucar, ucar.kr, used cars, buy car korea, sell car korea, car marketplace, trusted dealers, best prices",
    };
    try {
      const seoPath = path.join(
        process.cwd(),
        "public",
        "locales",
        locale,
        "seo.json"
      );
      if (fs.existsSync(seoPath)) {
        const raw = fs.readFileSync(seoPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.seo) seo = parsed.seo;
      }
    } catch (e) {
      // fallback to defaults
      // Optionally log error
      // console.error("SEO i18n load error", e);
    }
    return { ...initialProps, seo, locale };
  }

  render() {
    const { seo, locale } = this.props as any;
    return (
      <Html lang={locale}>
        <Head>
          <meta name="robots" content="index,follow" />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/img/logo/ucar_logo.svg"
          />
          <title>{seo?.title}</title>
          <meta name="keywords" content={seo?.keywords} />
          <meta name="description" content={seo?.description} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
