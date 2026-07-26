import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ShowcaseProduct } from "@/lib/showcase";
import {
  checkoutHref,
  formatShowcasePrice,
  isComingSoonCommerce,
  productHref,
  visibilityLabel,
  getProductVisibility,
} from "@/lib/showcase";
import { badgesForProduct, ShowcaseBadgePill } from "./ShowcaseBadge";
import ProductCoverMedia from "./ProductCoverMedia";
import { Link } from "wouter";

interface ProductDetailModalProps {
  product: ShowcaseProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  if (!product) return null;

  const comingSoon = isComingSoonCommerce(product);
  const price = formatShowcasePrice(
    product.isPublished ? product.priceCents : null
  );
  const canBuy =
    !comingSoon && product.isPublished && product.priceCents != null;
  const status = getProductVisibility(product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-white/10 bg-[#0f1522] text-foreground gap-0">
        <div className="relative aspect-[21/9] bg-[#070b12]">
          <ProductCoverMedia product={product} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {badgesForProduct(product, 2).map((id) => (
                <ShowcaseBadgePill key={id} id={id} />
              ))}
            </div>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            {product.slogan && (
              <DialogDescription className="text-base text-foreground/85">
                {product.slogan}
              </DialogDescription>
            )}
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || product.shortDescription}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Meta label="Tipo" value={product.typeLabel} />
            <Meta label="Categoria" value={product.category} />
            <Meta label="Status" value={visibilityLabel(status)} />
            {product.author && <Meta label="Autor" value={product.author} />}
            {product.level && <Meta label="Nível" value={product.level} />}
            {comingSoon ? (
              <Meta label="Preço" value="Em breve" />
            ) : (
              price && <Meta label="Preço" value={price} />
            )}
            {product.guaranteeDays != null && product.isPublished && (
              <Meta
                label="Garantia"
                value={`${product.guaranteeDays} dias`}
              />
            )}
          </div>

          {product.benefits?.length ? (
            <Block title="Benefícios">
              <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                {product.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Block>
          ) : null}

          {product.audience?.length ? (
            <Block title="Para quem é">
              <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                {product.audience.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Block>
          ) : null}

          {product.included?.length ? (
            <Block title="Conteúdo incluído">
              <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                {product.included.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Block>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link href={productHref(product)}>Ver página completa</Link>
            </Button>
            {canBuy ? (
              <Button asChild variant="outline" className="flex-1">
                <Link href={checkoutHref(product)}>Comprar</Link>
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                {comingSoon ? "Em breve" : "Compra disponível na publicação"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
      {children}
    </div>
  );
}
