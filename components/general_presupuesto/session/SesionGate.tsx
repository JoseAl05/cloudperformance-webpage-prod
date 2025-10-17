"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { LoaderComponent } from "@/components/general/LoaderComponent";

interface SessionGateProps {
  children: ReactNode;
  redirectTo?: string; // Ruta a la que redirige si no hay sesión
}

/**
 * SessionGate protege rutas que requieren sesión.
 * - Muestra un loader mientras se carga la sesión.
 * - Redirige al login si no hay usuario.
 * - Muestra error si ocurre uno.
 */
export const SessionGate = ({
  children,
  redirectTo = "/login",
}: SessionGateProps) => {
  const router = useRouter();
  const actualSession = useSession();

  const { isLoading, error, user } = actualSession;

  // 🚀 Redirigir si no hay usuario
  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, error, router, redirectTo]);

  // 🌀 Mostrar loader mientras carga la sesión
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <LoaderComponent size="large" />
      </div>
    );
  }

  // ❌ Mostrar error si ocurre
  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error al cargar la sesión.
      </div>
    );
  }

  // 🚷 Si ya terminó de cargar pero no hay usuario, no renderices nada (ya redirigió)
  if (!user) {
    return null;
  }

  // ✅ Si todo está bien, renderiza los hijos protegidos
  return <>{children}</>;
};
