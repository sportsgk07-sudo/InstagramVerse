import { createMetadata } from "@/lib/seo/metadata";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/infrastructure/database/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Settings — Admin",
  path: "/admin/settings",
  noIndex: true,
  description: "Admin settings",
});

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSetting.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <AdminNav />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No settings configured. Run database seed.</p>
          ) : (
            <dl className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.key} className="flex justify-between border-b border-border/40 pb-4 last:border-0">
                  <dt className="font-medium text-sm">{setting.key}</dt>
                  <dd className="text-sm text-muted-foreground">
                    {JSON.stringify(setting.value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
