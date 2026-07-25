import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, BookOpen, Users, Clock } from "lucide-react";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - será substituído por dados reais do TRPC
  const courses = [];

  const stats = {
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    avgCompletion: 0,
  };

  return (
    <AdminLayout>
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-owl bg-clip-text text-transparent">
            Cursos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie cursos, módulos e aulas da plataforma
          </p>
        </div>
        <Button className="bg-gradient-owl hover-glow">
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-owl-primary/20 hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <GraduationCap className="h-4 w-4 text-owl-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-owl-primary">
              {stats.totalCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              Cursos publicados
            </p>
          </CardContent>
        </Card>

        <Card className="border-owl-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-owl-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              Matriculados
            </p>
          </CardContent>
        </Card>

        <Card className="border-owl-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.totalLessons}
            </div>
            <p className="text-xs text-muted-foreground">
              Conteúdos criados
            </p>
          </CardContent>
        </Card>

        <Card className="border-owl-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.avgCompletion}%
            </div>
            <p className="text-xs text-muted-foreground">
              Média geral
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="search">Buscar por título ou categoria</Label>
            <Input
              id="search"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cursos */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Cursos ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum curso cadastrado</h3>
            <p className="text-muted-foreground mt-2">
              Comece criando seu primeiro curso online
            </p>
            <Button className="mt-4 bg-gradient-owl hover-glow">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Curso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-owl-primary/20 bg-gradient-to-br from-owl-primary/5 to-owl-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-owl-primary/10">
              <GraduationCap className="h-6 w-6 text-owl-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Sistema de Cursos Completo
              </h3>
              <p className="text-muted-foreground">
                Crie cursos estruturados com módulos, aulas em vídeo, materiais complementares,
                exercícios e certificados automáticos. Acompanhe o progresso dos alunos em tempo real
                e ofereça uma experiência de aprendizado profissional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
