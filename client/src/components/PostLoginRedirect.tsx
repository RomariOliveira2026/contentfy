import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "contentfy_post_login_redirect";

/** Após OAuth, retoma o fluxo (ex.: checkout) se o usuário veio de um CTA de compra. */
export function PostLoginRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading || !user) return;
    const redirect = sessionStorage.getItem(STORAGE_KEY);
    if (!redirect?.startsWith("/")) return;
    sessionStorage.removeItem(STORAGE_KEY);
    setLocation(redirect);
  }, [isLoading, user, setLocation]);

  return null;
}
