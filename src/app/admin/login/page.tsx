import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Admin Login — InstagramVerse",
  description: "Admin dashboard login",
  path: "/admin/login",
  noIndex: true,
});

export { default } from "./login-form";
