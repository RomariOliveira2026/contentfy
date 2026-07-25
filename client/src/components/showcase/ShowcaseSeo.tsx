import { useEffect } from "react";

const SITE = "https://contentfy.com.br";

interface ShowcaseSeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  productJsonLd?: Record<string, unknown> | null;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function ShowcaseSeo({
  title,
  description,
  path,
  image,
  noIndex,
  productJsonLd,
}: ShowcaseSeoProps) {
  useEffect(() => {
    const url = `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", productJsonLd ? "product" : "website");
    upsertMeta("property", "og:site_name", "ContentFy");
    if (image) upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) upsertMeta("name", "twitter:image", image);

    const scriptId = "showcase-product-jsonld";
    const prev = document.getElementById(scriptId);
    if (prev) prev.remove();

    if (productJsonLd && !noIndex) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(productJsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, path, image, noIndex, productJsonLd]);

  return null;
}
