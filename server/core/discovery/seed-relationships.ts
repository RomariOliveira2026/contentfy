import type { DiscoveryRelationship } from "@shared/contentfy";

/**
 * Reusable product relationship graph (Netflix-style sequels / ecosystems).
 * Seed edges — extend via DB table product_discovery_relationships when migrated.
 */
export const DISCOVERY_RELATIONSHIP_SEED: DiscoveryRelationship[] = [
  // Representação comercial trail
  {
    fromSlug: "manual-do-representante-comercial",
    toSlug: "rep4crm",
    type: "next",
    weight: 10,
    label: "Rep4CRM",
  },
  {
    fromSlug: "rep4crm",
    toSlug: "prompt-pack-comercial",
    type: "next",
    weight: 9,
    label: "Prompt Pack Comercial",
  },
  {
    fromSlug: "prompt-pack-comercial",
    toSlug: "planilhas-comerciais",
    type: "next",
    weight: 8,
    label: "Planilhas",
  },
  {
    fromSlug: "planilhas-comerciais",
    toSlug: "consultoria-comercial",
    type: "upsell",
    weight: 7,
    label: "Consultoria",
  },
  {
    fromSlug: "consultoria-comercial",
    toSlug: "crm-premium",
    type: "upsell",
    weight: 6,
    label: "CRM Premium",
  },
  // Bem-estar trail
  {
    fromSlug: "desacelere",
    toSlug: "ansiedade",
    type: "next",
    weight: 10,
    label: "Ansiedade",
  },
  {
    fromSlug: "ansiedade",
    toSlug: "sono",
    type: "next",
    weight: 9,
    label: "Sono",
  },
  {
    fromSlug: "sono",
    toSlug: "produtividade",
    type: "next",
    weight: 8,
    label: "Produtividade",
  },
  {
    fromSlug: "produtividade",
    toSlug: "habitos",
    type: "next",
    weight: 7,
    label: "Hábitos",
  },
  {
    fromSlug: "habitos",
    toSlug: "mindfulness",
    type: "companion",
    weight: 6,
    label: "Mindfulness",
  },
];

export function getSeedRelationshipsFrom(
  fromSlug: string
): DiscoveryRelationship[] {
  return DISCOVERY_RELATIONSHIP_SEED.filter((r) => r.fromSlug === fromSlug).sort(
    (a, b) => b.weight - a.weight
  );
}

export function walkRelationshipChain(
  startSlug: string,
  maxDepth = 8
): string[] {
  const chain: string[] = [startSlug];
  let current = startSlug;
  const seen = new Set([startSlug]);
  for (let i = 0; i < maxDepth; i++) {
    const next = getSeedRelationshipsFrom(current).find(
      (r) => r.type === "next" || r.type === "upsell"
    );
    if (!next || seen.has(next.toSlug)) break;
    chain.push(next.toSlug);
    seen.add(next.toSlug);
    current = next.toSlug;
  }
  return chain;
}
