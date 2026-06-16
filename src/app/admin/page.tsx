import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Download,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const metadata = createMetadata({
  title: "Admin Dashboard — InstagramVerse",
  description: "Admin dashboard",
  path: "/admin",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalDownloads,
    todayDownloads,
    totalUsers,
    totalApiRequests,
    recentLogs,
    topPages,
  ] = await Promise.all([
    prisma.download.count(),
    prisma.download.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count(),
    prisma.apiRequest.count(),
    prisma.systemLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["page"],
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Downloads", value: totalDownloads, icon: Download },
    { label: "Today's Downloads", value: todayDownloads, icon: TrendingUp },
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "API Requests", value: totalApiRequests, icon: Activity },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user?.name}</p>
        </div>
        <AdminNav />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No analytics data yet</p>
            ) : (
              <ul className="space-y-3">
                {topPages.map((page) => (
                  <li key={page.page} className="flex justify-between text-sm">
                    <span>{page.page ?? "Unknown"}</span>
                    <span className="font-medium">{page._count.page}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No logs yet</p>
            ) : (
              <ul className="space-y-3">
                {recentLogs.map((log) => (
                  <li key={log.id} className="text-sm border-b border-border/40 pb-2 last:border-0">
                    <span className={`font-medium ${log.level === "error" ? "text-destructive" : ""}`}>
                      [{log.level}]
                    </span>{" "}
                    {log.message}
                    <time className="block text-xs text-muted-foreground mt-1">
                      {log.createdAt.toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
