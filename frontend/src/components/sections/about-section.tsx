"use client";

import { motion, type Variants } from "framer-motion";
import { ClipboardCheck, MessagesSquare, Route, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Route,
    title: "دورات منظمة خطوة بخطوة",
    description:
      "كل دورة مقسّمة إلى دروس مرتبة، فتعرف دائمًا ما هي الخطوة التالية بالضبط.",
  },
  {
    icon: ClipboardCheck,
    title: "اختبار بعد كل درس",
    description:
      "اختبارات قصيرة تتبع كل درس للتأكد مما ترسّخ فعلاً — قبل أن يظهر في امتحان حقيقي.",
  },
  {
    icon: MessagesSquare,
    title: "مدرّسون حقيقيون، وإجابات حقيقية",
    description:
      "كل دورة يقودها مدرّس معروف يمكنك تقييمه والتواصل معه — لا مجرد مكتبة بلا وجه.",
  },
  {
    icon: ShieldCheck,
    title: "مصمم لراحة الأهل أيضًا",
    description:
      "بيانات تواصل ولي الأمر محفوظة، حتى تبقى الأسرة على اطلاع بالتقدّم من أول يوم.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function AboutSection() {
  return (
    <section id="about" className="border-t bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold text-primary">عن مسار</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            مبنيّة على فكرة واحدة: الفهم، لا مجرد المشاهدة.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            معظم المنصات تقيس التقدّم بعدد الدقائق التي شاهدتها. نحن نقيسه بعدد
            الدروس التي فهمتها فعلاً — ولهذا ينتهي كل درس على مسار إما باختبار
            قصير أو بملف قابل للتحميل للمراجعة.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={index}
              variants={fadeUp}
              className="rounded-xl border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
