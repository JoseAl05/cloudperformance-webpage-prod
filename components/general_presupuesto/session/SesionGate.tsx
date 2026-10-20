"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { LoaderComponent } from "@/components/general_aws/LoaderComponent";

interface SessionGateProps {
  children: ReactNode;
  redirectTo?: string;
}

export const SessionGate = ({
  children,
  redirectTo = "/login",
}: SessionGateProps) => {
  const router = useRouter();
  const actualSession = useSession();

  const { isLoading, error, user } = actualSession;

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, error, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <LoaderComponent size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error al cargar la sesión.
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
