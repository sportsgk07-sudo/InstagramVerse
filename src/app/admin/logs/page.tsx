import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "System Logs — Admin",
  path: "/admin/logs",
  noIndex: true,
  description: "Admin system logs",
});

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <AdminNav />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 font-medium">Level</th>
                  <th className="text-left p-4 font-medium">Message</th>
                  <th className="text-left p-4 font-medium">Source</th>
                  <th className="text-left p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No system logs yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/40 last:border-0">
                      <td className="p-4">
                        <span
                          className={
                            log.level === "error"
                              ? "text-destructive font-medium"
                              : log.level === "warn"
                                ? "text-yellow-600"
                                : ""
                          }
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="p-4 max-w-md truncate">{log.message}</td>
                      <td className="p-4">{log.source ?? "—"}</td>
                      <td className="p-4 whitespace-nowrap">{log.createdAt.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
