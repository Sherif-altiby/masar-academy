"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const NAV_ITEMS = [
  { href: "/teacher/dashboard", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/teacher/dashboard/courses", label: "دوراتي", icon: BookOpen },
  { href: "/teacher/dashboard/courses/new", label: "إضافة دورة", icon: PlusCircle },
  { href: "/teacher/dashboard/pdf/new", label: "إضافة PDF لدرس", icon: FileText },
  { href: "/teacher/dashboard/quiz/new", label: "إنشاء اختبار لدرس", icon: HelpCircle },
];

export function DashboardSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    await logout();
    toast.success("تم تسجيل الخروج");
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b p-5">
        <Avatar className="size-11 border-2 border-secondary">
          <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
            {user?.avatarInitials ?? "؟"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user?.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 px-3"
          onClick={handleLogout}
        >
          <LogOut className="size-4" /> تسجيل الخروج
        </Button>
        <Button variant="outline" className="mt-1 w-full" asChild>
          <Link href="/">العودة إلى المنصة</Link>
        </Button>
      </div>
    </div>
  );
}
