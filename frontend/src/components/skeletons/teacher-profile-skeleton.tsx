import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function TeacherProfileSkeleton() {
    return (
        <main className="min-h-screen bg-background">
            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />

                    <Skeleton className="h-4 w-2" />

                    <Skeleton className="h-4 w-32" />
                </div>

                {/* Profile Header */}
                <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                    <div className="h-1 bg-primary" />

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-7 md:flex-row md:items-center">
                            {/* Avatar */}
                            <div className="relative shrink-0 self-start">
                                <Skeleton className="size-24 rounded-full border-4 border-secondary sm:size-28" />

                                <Skeleton className="absolute bottom-0 left-0 size-7 rounded-full border-2 border-background" />
                            </div>

                            {/* Teacher info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />

                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>

                                <Skeleton className="mt-2 h-5 w-40" />

                                {/* Rating */}
                                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-20" />

                                        <Skeleton className="h-4 w-8" />

                                        <Skeleton className="h-4 w-20" />
                                    </div>

                                    <span className="hidden h-4 w-px bg-border sm:block" />

                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>

                            {/* Action */}
                            <div className="shrink-0">
                                <Skeleton className="h-10 w-32 rounded-md" />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid overflow-hidden rounded-xl border border-border/70 bg-secondary/30 sm:grid-cols-3">
                            <StatSkeleton />

                            <StatSkeleton className="border-t sm:border-r sm:border-t-0" />

                            <StatSkeleton className="border-t sm:border-t-0" />
                        </div>
                    </div>
                </Card>

                {/* Content */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* About */}
                        <section>
                            <SectionHeadingSkeleton />

                            <Card className="mt-4 rounded-2xl border-border/70 shadow-sm">
                                <CardContent className="space-y-3 p-6">
                                    <Skeleton className="h-4 w-full" />

                                    <Skeleton className="h-4 w-full" />

                                    <Skeleton className="h-4 w-4/5" />
                                </CardContent>
                            </Card>
                        </section>

                        {/* Courses */}
                        <section>
                            <div className="flex items-end justify-between gap-4">
                                <SectionHeadingSkeleton />

                                <Skeleton className="hidden h-6 w-16 shrink-0 rounded-full sm:block" />
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <CourseCardSkeleton />

                                <CourseCardSkeleton />

                                <CourseCardSkeleton />

                                <CourseCardSkeleton />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Credentials */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/60 bg-secondary/20">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded" />

                                    <Skeleton className="h-5 w-24" />
                                </div>

                                <Skeleton className="mt-2 h-4 w-40" />
                            </CardHeader>

                            <CardContent className="space-y-4 p-5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <Skeleton className="mt-0.5 size-5 shrink-0 rounded-full" />

                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/60 bg-secondary/20">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded" />

                                    <Skeleton className="h-5 w-28" />
                                </div>

                                <Skeleton className="mt-2 h-4 w-40" />
                            </CardHeader>

                            <CardContent className="space-y-5 p-5">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index}>
                                        <div className="flex items-start gap-3">
                                            <Skeleton className="size-9 shrink-0 rounded-full" />

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Skeleton className="h-4 w-24" />

                                                    <Skeleton className="h-3 w-16" />
                                                </div>

                                                <Skeleton className="mt-2 h-16 w-full rounded-xl" />
                                            </div>
                                        </div>

                                        {index < 2 && <Separator className="mt-5" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export function StatSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-3 p-4 sm:p-5", className)}>
            <Skeleton className="size-10 shrink-0 rounded-xl" />

            <div className="space-y-2">
                <Skeleton className="h-5 w-16" />

                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    );
}

export function SectionHeadingSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-xl" />

            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />

                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}

export function CourseCardSkeleton() {
    return (
        <Card className="h-full rounded-2xl border-border/70">
            <CardHeader className="pb-3">
                <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="size-10 rounded-xl" />

                    <Skeleton className="size-8 rounded-full" />
                </div>

                <Skeleton className="h-5 w-3/4" />

                <Skeleton className="mt-1 h-4 w-full" />

                <Skeleton className="mt-1 h-4 w-2/3" />
            </CardHeader>

            <CardContent>
                <Separator className="mb-4" />

                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />

                    <Skeleton className="h-4 w-12" />
                </div>
            </CardContent>
        </Card>
    );
}