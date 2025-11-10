import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './prisma';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, handlers: authHandlers, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

      if (!isAdminRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [
    Credentials({
      name: 'Admin Login',
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: 'admin',
        };
      },
    }),
  ],
});

