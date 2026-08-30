"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, Star, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/teachers", label: "المدرّسون" },
  { href: "/subjects", label: "المواد الدراسية" },
  { href: "/#about", label: "من نحن" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, isTeacher, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success("تم تسجيل الخروج");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            أكاديمية مسار
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm font-medium",
                pathname === link.href && "bg-secondary text-secondary-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {status === "authenticated" && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {user.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isTeacher && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User /> ملفي الشخصي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=ratings">
                        <Star /> قيّم المنصة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=settings">
                        <Settings /> إعدادات الحساب
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {isTeacher && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/dashboard">
                        <LayoutDashboard /> لوحة تحكم المدرّس
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                  <LogOut /> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="font-display">أكاديمية مسار</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                <DropdownMenuSeparator className="my-2" />
                {status === "authenticated" && user ? (
                  <Button variant="outline" className="justify-start" onClick={handleLogout}>
                    <LogOut /> تسجيل الخروج
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/login">تسجيل الدخول</Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link href="/register">إنشاء حساب مجاني</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
