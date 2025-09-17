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
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 🔹 CORRIGIDO: usar pool.query em vez de db.query
          const result = await pool.query(
            "SELECT * FROM usuarios WHERE email=$1",
            [credentials.email]
          );

          if (result.rows.length === 0) return null;

          const u = result.rows[0];

          // Aceitamos "senha trial" para testes ou senha real do banco
          if ((u.role === "trial" && credentials.senha === "trial") ||
              (u.senha && credentials.senha === u.senha)) {
            return {
              id: u.id,
              name: u.nome,
              email: u.email,
              role: u.role,
              expiracao: u.expiracao
            };
          }

          return null;
        } catch (err) {
          console.error("Erro no login credenciais:", err);
          return null;
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
            // Novo usuário → cadastra com expiração de 10 dias
            await client.query(
              `INSERT INTO usuarios (nome, email, google_id, role, expiracao)
               VALUES ($1, $2, $3, 'user', NOW() + interval '10 days')`,
              [user.name, user.email, user.id]
            );
          } else {
            // Usuário existente → atualiza google_id e mantém expiração
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

  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);