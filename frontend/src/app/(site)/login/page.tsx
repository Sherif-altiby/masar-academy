"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      toast.success("أهلًا بعودتك!");
      router.push(user.role === "TEACHER" ? "/teacher/dashboard" : "/profile");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر تسجيل الدخول"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-14 sm:py-24">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <span className="font-display text-xl font-semibold tracking-tight">
          أكاديمية مسار
        </span>
      </Link>

      <Card className="mt-8 w-full">
        <CardHeader>
          <CardTitle className="font-display text-2xl">أهلًا بعودتك</CardTitle>
          <CardDescription>
            سجّل دخولك لمتابعة دوراتك وتتبّع تقدّمك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                dir="ltr"
                className="text-right"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            جديد على أكاديمية مسار؟{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              أنشئ حسابًا مجانيًا
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
