import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Users — Admin",
  path: "/admin/users",
  noIndex: true,
  description: "Admin users",
});

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { downloads: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <AdminNav />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Downloads</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No registered users yet
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-border/40 last:border-0">
                      <td className="p-4">{u.email ?? "—"}</td>
                      <td className="p-4">{u.name ?? "—"}</td>
                      <td className="p-4">{u.role}</td>
                      <td className="p-4">{u._count.downloads}</td>
                      <td className="p-4">{u.createdAt.toLocaleDateString()}</td>
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
