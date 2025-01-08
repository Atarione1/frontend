import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },

      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              name: credentials?.name,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        )
       
        const user = await res.json()
        console.log(user)
        if (user.error) throw user

        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token
      return session
    },
  }, pages: {
    signIn: "/",
  },
})

export { handler as GET, handler as POST }