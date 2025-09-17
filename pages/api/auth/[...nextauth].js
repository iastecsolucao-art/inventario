import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const client = await pool.connect();
        try {
          const res = await client.query(
            "SELECT * FROM usuarios WHERE email = $1 AND senha = crypt($2, senha)",
            [credentials.email, credentials.senha]
          );
          if (res.rows.length > 0) {
            return {
              id: res.rows[0].id,
              name: res.rows[0].nome,
              email: res.rows[0].email,
              role: res.rows[0].role,
              expiracao: res.rows[0].expiracao, // 🔹 já retorna expiracao no login manual
            };
          }
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await pool.connect();
        try {
          const res = await client.query(
            "SELECT id, expiracao FROM usuarios WHERE email = $1",
            [user.email]
          );

          if (res.rows.length === 0) {
            // Novo usuário → cria com expiracao 10 dias
            await client.query(
              `INSERT INTO usuarios (nome, email, google_id, role, expiracao)
               VALUES ($1, $2, $3, 'user', NOW() + interval '10 days')`,
              [user.name, user.email, user.id]
            );
          } else {
            // Já existe → atualiza google_id e garante expiracao
            await client.query(
              `UPDATE usuarios
               SET google_id = $1,
                   nome = $2,
                   expiracao = COALESCE(expiracao, NOW() + interval '10 days')
               WHERE email = $3`,
              [user.id, user.name, user.email]
            );
          }
        } finally {
          client.release();
        }
      }
      return true;
    },

    // 🔹 Aqui traz o role e expiracao direto para session.user
    async session({ session }) {
      const client = await pool.connect();
      try {
        const res = await client.query(
          "SELECT role, expiracao FROM usuarios WHERE email = $1",
          [session.user.email]
        );

        if (res.rows.length > 0) {
          session.user.role = res.rows[0].role || "user";
          session.user.expiracao = res.rows[0].expiracao;
        }
      } finally {
        client.release();
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);