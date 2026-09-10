"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ProfileCoursesTab } from "@/components/profile/profile-courses-tab";
import { ProfileDetailsForm } from "@/components/profile/profile-details-form";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileRatingsTab } from "@/components/profile/profile-ratings-tab";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </React.Suspense>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "profile";
  const { user, status, isTeacher } = useAuth();

  React.useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && isTeacher) {
      router.replace("/teacher/dashboard");
    }
  }, [status, isTeacher, router]);

  if (status !== "authenticated" || !user || isTeacher) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <ProfileHeader user={user} />

      <Tabs defaultValue={initialTab} className="mt-10" dir="rtl">
        <TabsList className="h-12 w-full sm:w-auto">
          <TabsTrigger
            className="flex h-9 items-center justify-center"
            value="profile"
          >
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger
            className="flex h-9 items-center justify-center"
            value="courses"
          >
            دوراتي
          </TabsTrigger>
          <TabsTrigger
            className="flex h-9 items-center justify-center"
            value="ratings"
          >
            التقييمات
          </TabsTrigger>
          <TabsTrigger
            className="flex h-9 items-center justify-center"
            value="settings"
          >
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">البيانات الشخصية</CardTitle>
              <CardDescription>
                حافظ على تحديث بياناتك حتى يبقى المدرّسون وأولياء الأمور على
                تواصل.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileDetailsForm key={user.id} user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <ProfileCoursesTab />
        </TabsContent>

        <TabsContent value="ratings" className="mt-6">
          <ProfileRatingsTab />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تغيير كلمة المرور</CardTitle>
              <CardDescription>
                استخدم كلمة مرور لا تقل عن 8 أحرف.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
