import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/infrastructure/database/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.adminAccount.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!admin || !admin.isActive) return null;

        const valid = await compare(String(credentials.password), admin.passwordHash);
        if (!valid) return null;

        await prisma.adminAccount.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name ?? "Admin",
          role: "ADMIN",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "ADMIN";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
