import { useEffect } from "react";

interface DiscoverySeoProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string | null;
}

const SITE = "https://contentfy.com.br";

export function DiscoverySeo({
  title = "Explorar | ContentFy Discovery",
  description = "Descubra cursos, e-books e ferramentas com recomendações inteligentes baseadas no seu comportamento — ContentFy Discovery.",
  canonicalPath = "/explorar",
  image,
}: DiscoverySeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", `${SITE}${canonicalPath}`);
    if (image) setMeta("property", "og:image", image);

    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${SITE}${canonicalPath}`;

    const schemaId = "contentfy-discovery-schema";
    let script = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = schemaId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `${SITE}${canonicalPath}`,
      isPartOf: {
        "@type": "WebSite",
        name: "ContentFy",
        url: SITE,
      },
    });
  }, [title, description, canonicalPath, image]);

  return null;
}
