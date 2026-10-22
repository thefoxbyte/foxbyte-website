import { faqs } from "@/content/home";
import { site } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { BlackboxProof } from "@/components/home/BlackboxProof";
import { Suit } from "@/components/home/Suit";
import { Story } from "@/components/home/Story";
import { Data } from "@/components/home/Data";
import { Editions } from "@/components/home/Editions";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/mark-light.png`,
      sameAs: [site.github, site.x, site.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Linux, Windows",
      description: site.description,
      url: site.url,
      downloadUrl: site.github,
      license: `${site.github}/blob/main/LICENSE`,
      publisher: { "@id": `${site.url}/#organization` },
      offers: [{ "@type": "Offer", name: "Standard", price: "0", priceCurrency: "USD" }],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Hero />
      <BlackboxProof />
      <Suit />
      <Story />
      <Data />
      <Editions />
      <Faq />
      <FinalCta />
    </>
  );
}
