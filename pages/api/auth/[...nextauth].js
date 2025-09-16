import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Dá pra usar token.email p/ setar admin
      session.user.role = session.user.email === "admin@empresa.com" ? "admin" : "user";
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});