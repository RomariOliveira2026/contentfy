import { APP_TITLE } from "@/const";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-gradient-owl">
              {APP_TITLE}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Construa aplicações web robustas e profissionais com tecnologia de ponta. 
              Transforme suas ideias em realidade com desenvolvimento ágil e eficiente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <a href="#recursos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#exemplos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Exemplos
                </a>
              </li>
              <li>
                <a href="#processo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Processo
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ContentFy, uma Empresa do Grupo O Especialista, CNPJ nº 46.709.692/0001-42. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
