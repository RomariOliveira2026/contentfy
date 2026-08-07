import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ExperienceErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ContentFy Experience] UI boundary:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-2xl border border-border/40 p-6">
            <p className="text-sm font-medium">Não foi possível carregar esta seção.</p>
            <p className="text-sm text-muted-foreground mt-1">
              O restante da sua área do aluno permanece disponível.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
