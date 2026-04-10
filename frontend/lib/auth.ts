import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const AUTH_URL = process.env.SPRING_AUTH_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        try {
          const params = new URLSearchParams();
          params.append("grant_type", "client_credentials");
          params.append("scope", "openid user_read user_write");

          const response = await axios.post(`${AUTH_URL}/oauth2/token`, params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
          });

          const { access_token, refresh_token } = response.data;

          return {
            id: credentials.username,
            name: credentials.username,
            email: `${credentials.username}@vehiclerental.local`,
            accessToken: access_token,
            refreshToken: refresh_token ?? null,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "vehicle-rental-dev-secret-change-in-production",
};
