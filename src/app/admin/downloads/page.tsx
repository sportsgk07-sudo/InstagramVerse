import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Downloads — Admin",
  path: "/admin/downloads",
  noIndex: true,
  description: "Admin downloads",
});

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const downloads = await prisma.download.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      url: true,
      contentType: true,
      status: true,
      mediaCount: true,
      createdAt: true,
      ipAddress: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Downloads</h1>
        <AdminNav />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 font-medium">URL</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Media</th>
                  <th className="text-left p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d.id} className="border-b border-border/40 last:border-0">
                    <td className="p-4 max-w-xs truncate">{d.url}</td>
                    <td className="p-4">{d.contentType}</td>
                    <td className="p-4">{d.status}</td>
                    <td className="p-4">{d.mediaCount}</td>
                    <td className="p-4 whitespace-nowrap">{d.createdAt.toLocaleString()}</td>
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
