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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEVEL_OPTIONS } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    parentPhone: "",
    level: "",
    password: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success("تم إنشاء الحساب — أهلًا بك في أكاديمية مسار!");
      router.push("/profile");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "تعذّر إنشاء الحساب"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-14 sm:py-20">
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
          <CardTitle className="font-display text-2xl">
            أنشئ حسابك
          </CardTitle>
          <CardDescription>
            انضم إلى آلاف الطلاب الذين يتعلمون بدورات منظمة مدعومة
            بالاختبارات.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم بالكامل</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="يوسف مصطفى"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </div>

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
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  required
                  dir="ltr"
                  className="text-right"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">هاتف ولي الأمر</Label>
                <Input
                  id="parentPhone"
                  name="parentPhone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  required
                  dir="ltr"
                  className="text-right"
                  value={form.parentPhone}
                  onChange={(e) => update("parentPhone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">المرحلة الدراسية</Label>
              <Select
                value={form.level}
                onValueChange={(v) => update("level", v)}
                required
              >
                <SelectTrigger id="level" className="w-full">
                  <SelectValue placeholder="اختر صفك الدراسي" />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8 أحرف على الأقل"
                  required
                  minLength={8}
                  className="pl-10"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
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
              {submitting ? "جارٍ إنشاء حسابك…" : "إنشاء حساب مجاني"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
