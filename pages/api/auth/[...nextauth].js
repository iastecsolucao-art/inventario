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
  async redirect({ url, baseUrl }) {
    // sempre manda para Inventário depois do login
    return "/contagem";
  },
},
  secret: process.env.NEXTAUTH_SECRET,
});