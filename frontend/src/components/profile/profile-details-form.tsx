"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/auth-api";
import { ApiUser } from "@/lib/api-types";
import {
  EDUCATION_LEVEL_OPTIONS,
  EducationLevel,
  getEducationLevelLabel,
  getGradeLabel,
  getStudyLanguageLabel,
  GRADE_OPTIONS,
  STUDY_LANGUAGE_OPTIONS,
} from "@/lib/education-options";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useAuth } from "@/providers/auth-provider";

export function ProfileDetailsForm({ user }: { user: ApiUser }) {
  const { updateUser } = useAuth();
  const [fullName, setFullName] = React.useState(user.fullName);
  const [email, setEmail] = React.useState(user.email);
  const [phone, setPhone] = React.useState(user.phone);
  const [parentPhone, setParentPhone] = React.useState(user.parentPhone ?? "");
  const [studyLanguage, setStudyLanguage] = React.useState(
    user.studyLanguage ?? ""
  );
  const [educationLevel, setEducationLevel] = React.useState(
    user.educationLevel ?? ""
  );
  const [grade, setGrade] = React.useState(user.grade ?? "");
  const [submitting, setSubmitting] = React.useState(false);

  const gradeOptions =
    educationLevel in GRADE_OPTIONS
      ? GRADE_OPTIONS[educationLevel as EducationLevel]
      : [];

  const studyLanguageLabel = getStudyLanguageLabel(studyLanguage);
  const educationLevelLabel = getEducationLevelLabel(educationLevel);
  const gradeLabel = getGradeLabel(grade);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!studyLanguage || !educationLevel || !grade) {
      toast.error("يرجى تعبئة لغة الدراسة والمرحلة والصف");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await authApi.updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        parentPhone: parentPhone.trim(),
        studyLanguage,
        educationLevel,
        grade,
      });
      updateUser(updated);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "تعذر تحديث الملف الشخصي، حاول مرة أخرى")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="fullName">الاسم بالكامل</Label>
        <Input
          id="fullName"
          required
          minLength={3}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-right"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            required
            minLength={8}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentPhone">هاتف ولي الأمر</Label>
          <Input
            id="parentPhone"
            type="tel"
            required
            minLength={8}
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="text-right"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="studyLanguage">لغة الدراسة</Label>
        <Select
          value={studyLanguage || undefined}
          onValueChange={setStudyLanguage}
        >
          <SelectTrigger id="studyLanguage" className="w-full">
            <SelectValue placeholder="اختر لغة الدراسة">
              {studyLanguageLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STUDY_LANGUAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="educationLevel">المرحلة الدراسية</Label>
        <Select
          value={educationLevel || undefined}
          onValueChange={(value) => {
            setEducationLevel(value);
            setGrade("");
          }}
        >
          <SelectTrigger id="educationLevel" className="w-full">
            <SelectValue placeholder="اختر المرحلة الدراسية">
              {educationLevelLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {EDUCATION_LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="grade">الصف الدراسي</Label>
        <Select
          value={grade || undefined}
          onValueChange={setGrade}
          disabled={!educationLevel}
        >
          <SelectTrigger id="grade" className="w-full">
            <SelectValue
              placeholder={
                educationLevel ? "اختر الصف الدراسي" : "اختر المرحلة أولًا"
              }
            >
              {gradeLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {gradeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <Save />}
        حفظ التغييرات
      </Button>
    </form>
  );
}
