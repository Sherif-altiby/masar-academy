"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, CheckCircle2, FileText, HelpCircle, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { value: "+٤٣", label: "مدرّس متميز" },
  { value: "+١٨٠", label: "دورة منظمة" },
  { value: "+١٢,٦٠٠", label: "طالب يتعلم معنا" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background blobs */}
      <div
        className="animate-blob-pulse absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-blob-pulse absolute top-1/2 -left-20 -z-10 size-64 rounded-full bg-accent/15 blur-3xl [animation-delay:2.5s]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
          >
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              لطلاب المرحلة الابتدائية حتى الثانوية
            </Badge>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="mt-5 max-w-xl text-balance font-display text-4xl font-semibold leading-[1.2] tracking-tight sm:text-5xl"
          >
            طريق واضح{" "}
            <span className="marker-highlight">من الدرس</span> إلى الإتقان.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-5 max-w-md text-balance text-base text-muted-foreground sm:text-lg"
          >
            أكاديمية مسار تربط كل درس باختبار قصير، حتى تعرف دائمًا ما تعلّمته
            فعلاً — لا ما شاهدته فقط.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <Link href="/register">
                أنشئ حسابك المجاني <ArrowLeft />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/teachers">تعرّف على مدرّسينا</Link>
            </Button>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl font-semibold">
                  {stat.value}
                </dt>
                <dd className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/5 blur-2xl"
            aria-hidden
          />
          <div className="animate-float-soft">
            <Card className="gap-0 p-0 shadow-lg">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-xs text-muted-foreground">أساسيات الجبر</p>
                  <p className="font-display text-sm font-semibold">
                    خطة درس اليوم
                  </p>
                </div>
                <Badge className="gap-1">
                  <Play className="size-3" /> مباشر
                </Badge>
              </div>

              <div className="space-y-1 p-3">
                <LessonRow
                  icon={CheckCircle2}
                  title="التعبيرات الجبرية"
                  meta="18 دقيقة · PDF"
                  done
                />
                <LessonRow
                  icon={CheckCircle2}
                  title="اختبار التعبيرات الجبرية"
                  meta="3 أسئلة"
                  done
                />
                <LessonRow
                  icon={FileText}
                  title="المعادلات ذات الخطوة الواحدة"
                  meta="22 دقيقة · PDF"
                  active
                />
                <LessonRow
                  icon={HelpCircle}
                  title="اختبار المعادلات ذات الخطوة الواحدة"
                  meta="2 سؤال"
                />
              </div>

              <div className="border-t px-5 py-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">تقدّم الدورة</span>
                  <span className="font-medium">2 / 6 دروس</span>
                </div>
                <Progress value={33} />
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LessonRow({
  icon: Icon,
  title,
  meta,
  done,
  active,
}: {
  icon: React.ElementType;
  title: string;
  meta: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-2 py-2.5 ${
        active ? "bg-secondary" : ""
      }`}
    >
      <Icon
        className={`size-4 shrink-0 ${
          done ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}
