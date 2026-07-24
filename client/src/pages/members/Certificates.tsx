import MembersLayout from "@/components/MembersLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Award, Download, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Certificates() {
  const { data: certificates, isLoading } = trpc.certificates.getMyCertificates.useQuery();

  if (isLoading) {
    return (
      <MembersLayout>
        <div className="container py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </MembersLayout>
    );
  }

  return (
    <MembersLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Certificados</h1>
          <p className="text-muted-foreground">
            Certificados dos cursos que você concluiu
          </p>
        </div>

        {!certificates || certificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Nenhum certificado ainda
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Complete seus cursos para gerar certificados e comprovar seu
                aprendizado!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                {cert.courseCoverImage && (
                  <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    <img
                      src={cert.courseCoverImage}
                      alt={cert.courseName || "Curso"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Award className="w-8 h-8 text-white mb-2" />
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {cert.courseName || "Curso"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Emitido em{" "}
                      {format(new Date(cert.issuedAt), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Código de Validação
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {cert.certificateCode}
                    </p>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Certificado
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MembersLayout>
  );
}
