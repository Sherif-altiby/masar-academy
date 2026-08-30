"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { RequireRole } from "@/components/shared/require-role";
import { DashboardSidebarContent } from "@/components/teacher/dashboard-sidebar";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <RequireRole role="TEACHER">
      <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l bg-card md:block">
        <DashboardSidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">قائمة لوحة تحكم المدرّس</SheetTitle>
          <DashboardSidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-2 md:hidden"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold">
              لوحة تحكم المدرّس
            </span>
          </Link>
          <span className="hidden text-sm font-medium text-muted-foreground md:inline">
            لوحة تحكم المدرّس
          </span>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
    </RequireRole>
  );
}
