"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";
import { ApiRole } from "@/lib/api-types";
import { Loader2 } from "lucide-react";

export function RequireRole({
  role,
  children,
}: {
  role: ApiRole;
  children: React.ReactNode;
}) {
  const { status, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && user?.role !== role) {
      router.replace("/");
    }
  }, [status, user, role, router]);

  if (status !== "authenticated" || user?.role !== role) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
