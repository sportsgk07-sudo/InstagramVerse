import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "API Usage — Admin",
  path: "/admin/api-usage",
  noIndex: true,
  description: "Admin API usage",
});

export const dynamic = "force-dynamic";

export default async function AdminApiUsagePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const requests = await prisma.apiRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      endpoint: true,
      method: true,
      statusCode: true,
      status: true,
      durationMs: true,
      ipAddress: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">API Usage</h1>
        <AdminNav />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 font-medium">Endpoint</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">IP</th>
                  <th className="text-left p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 last:border-0">
                    <td className="p-4">{r.endpoint}</td>
                    <td className="p-4">{r.method}</td>
                    <td className="p-4">
                      <span className={r.statusCode >= 400 ? "text-destructive" : "text-green-600"}>
                        {r.statusCode}
                      </span>
                    </td>
                    <td className="p-4">{r.durationMs ? `${r.durationMs}ms` : "—"}</td>
                    <td className="p-4">{r.ipAddress ?? "—"}</td>
                    <td className="p-4 whitespace-nowrap">{r.createdAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
