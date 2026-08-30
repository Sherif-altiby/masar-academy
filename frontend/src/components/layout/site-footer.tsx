import Link from "next/link";
import {
  GraduationCap,
  MessageCircle,
  Send,
  PlayCircle,
  Mail,
  Phone,
} from "lucide-react";

const PLATFORM_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/teachers", label: "مدرّسونا" },
  { href: "/subjects", label: "المواد الدراسية" },
  { href: "/#about", label: "من نحن" },
];

const ACCOUNT_LINKS = [
  { href: "/register", label: "إنشاء حساب" },
  { href: "/login", label: "تسجيل الدخول" },
  { href: "/profile", label: "ملفي الشخصي" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-4.5" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                أكاديمية مسار
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              طريق واضح من الدرس إلى الإتقان. مدرّسون حقيقيون، دورات منظمة،
              واختبار في نهاية كل درس حتى لا يبقى التقدّم موضع شك أبدًا.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[MessageCircle, Send, PlayCircle].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">المنصة</h3>
            <ul className="mt-4 space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">الحساب</h3>
            <ul className="mt-4 space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-5 space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" /> hello@masar-academy.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" /> ‎+20 100 000 0000
              </li>
            </ul>
          </div>
        </div>

        <div className="ruled-divider mt-10" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} أكاديمية مسار. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-foreground">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
