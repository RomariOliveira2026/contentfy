import CreatorLayout from "@/components/CreatorLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-400">
              Em breve
            </Badge>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Card className="border-white/[0.08] bg-[#0f1522]">
          <CardHeader>
            <CardTitle className="text-base">Placeholder identificado</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Esta seção faz parte do menu da Área do Criador, mas ainda não possui
              backend dedicado nesta versão.
            </p>
            <p>
              Nenhum dado fictício é exibido como se fosse real.
            </p>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}
