"use client";

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
import { useAuth } from "@/providers/auth-provider";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useState } from "react";

const EDUCATION_LEVEL_OPTIONS = [
  {
    value: "PREPARATORY",
    label: "المرحلة الإعدادية",
  },
  {
    value: "SECONDARY",
    label: "الثانوية العامة",
  },
  {
    value: "BACCALAUREATE",
    label: "البكالوريا",
  },
] as const;

const GRADE_OPTIONS = {
  PREPARATORY: [
    {
      value: "PREP_1",
      label: "الصف الأول الإعدادي",
    },
    {
      value: "PREP_2",
      label: "الصف الثاني الإعدادي",
    },
    {
      value: "PREP_3",
      label: "الصف الثالث الإعدادي",
    },
  ],

  SECONDARY: [
    {
      value: "SEC_1",
      label: "الصف الأول الثانوي",
    },
    {
      value: "SEC_2",
      label: "الصف الثاني الثانوي",
    },
    {
      value: "SEC_3_MATH",
      label: "الصف الثالث الثانوي - علمي رياضة",
    },
    {
      value: "SEC_3_SCIENCE",
      label: "الصف الثالث الثانوي - علمي علوم",
    },
    {
      value: "SEC_3_LITERATURE",
      label: "الصف الثالث الثانوي - أدبي",
    },
  ],

  BACCALAUREATE: [
    {
      value: "BAC_1",
      label: "الصف الأول بكالوريا",
    },
    {
      value: "BAC_2_ENGINEERING_CS",
      label: "الصف الثاني بكالوريا - هندسة وعلوم الحاسب",
    },
    {
      value: "BAC_2_MEDICINE_LIFE",
      label: "الصف الثاني بكالوريا - طب وعلوم الحياة",
    },
    {
      value: "BAC_2_BUSINESS",
      label: "الصف الثاني بكالوريا - الأعمال",
    },
    {
      value: "BAC_2_ARTS",
      label: "الصف الثاني بكالوريا - آداب وفنون",
    },
  ],
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    parentPhone: "",
    studyLanguage: "",
    educationLevel: "",
    grade: "",
    password: "", 
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleEducationLevelChange(value: string) {
    setForm((prev) => ({
      ...prev,
      educationLevel: value,
      grade: "",
    }));
  }

  const gradeOptions =
    form.educationLevel in GRADE_OPTIONS
      ? GRADE_OPTIONS[
          form.educationLevel as keyof typeof GRADE_OPTIONS
        ]
      : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.studyLanguage) {
      toast.error("يرجى اختيار لغة الدراسة");
      return;
    }

    if (!form.educationLevel) {
      toast.error("يرجى اختيار المرحلة الدراسية");
      return;
    }

    if (!form.grade) {
      toast.error("يرجى اختيار الصف الدراسي");
      return;
    }

    setSubmitting(true);

    try {
      await register(form);

      toast.success("تم إنشاء الحساب — أهلًا بك في أكاديمية مسار!");

      router.push("/profile");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "تعذّر إنشاء الحساب")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-14 sm:py-20">
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
            انضم إلى آلاف الطلاب الذين يتعلمون بدورات منظمة
            مدعومة بالاختبارات.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم بالكامل</Label>

              <Input
                id="fullName"
                name="fullName"
                placeholder="يوسف مصطفى"
                required
                value={form.fullName}
                onChange={(e) =>
                  update("fullName", e.target.value)
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                البريد الإلكتروني
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                 
                className="text-right"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
              />
            </div>

            {/* Phones */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  required
                   
                  className="text-right"
                  value={form.phone}
                  onChange={(e) =>
                    update("phone", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentPhone">
                  هاتف ولي الأمر
                </Label>

                <Input
                  id="parentPhone"
                  name="parentPhone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  required
                   
                  className="text-right"
                  value={form.parentPhone}
                  onChange={(e) =>
                    update("parentPhone", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Study Language */}
            <div className="space-y-2">
              <Label htmlFor="studyLanguage">
                لغة الدراسة
              </Label>

              <Select
                value={form.studyLanguage}
                onValueChange={(value) =>
                  update("studyLanguage", value)
                }
              >
                <SelectTrigger
                  id="studyLanguage"
                  className="w-full"
                >
                  <SelectValue placeholder="اختر لغة الدراسة" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="AR">
                    العربية
                  </SelectItem>

                  <SelectItem value="EN">
                    English
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="educationLevel">
                المرحلة الدراسية
              </Label>

              <Select
                value={form.educationLevel}
                onValueChange={handleEducationLevelChange}
              >
                <SelectTrigger
                  id="educationLevel"
                  className="w-full"
                >
                  <SelectValue placeholder="اختر المرحلة الدراسية" />
                </SelectTrigger>

                <SelectContent>
                  {EDUCATION_LEVEL_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <Label htmlFor="grade">
                الصف الدراسي
              </Label>

              <Select
                value={form.grade}
                onValueChange={(value) =>
                  update("grade", value)
                }
                disabled={!form.educationLevel}
              >
                <SelectTrigger
                  id="grade"
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      form.educationLevel
                        ? "اختر الصف الدراسي"
                        : "اختر المرحلة أولًا"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                كلمة المرور
              </Label>

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
                  onChange={(e) =>
                    update("password", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting
                ? "جارٍ إنشاء حسابك…"
                : "إنشاء حساب مجاني"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}