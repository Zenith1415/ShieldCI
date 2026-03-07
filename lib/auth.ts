import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"            // root/models/User.ts

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: { scope: "read:user user:email repo workflow" },
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        githubUsername: { label: "GitHub Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.githubUsername || !credentials?.password) {
          throw new Error("GitHub username and password are required")
        }
        await connectDB()
        const user = await User.findOne({
          githubUsername: credentials.githubUsername.toLowerCase().trim(),
        })
        if (!user) throw new Error("No ShieldCI account found for this GitHub username")
        if (!user.password) throw new Error("This account uses GitHub login. Click 'Continue with GitHub' instead.")
        if (!user.isVerified) throw new Error("UNVERIFIED:" + user.githubUsername)
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Incorrect password")
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email || null,
          image: user.image,
          githubUsername: user.githubUsername,
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          await connectDB()
          const githubProfile = profile as any
          const githubUsername = githubProfile?.login?.toLowerCase()
          const existingUser = await User.findOne({ githubUsername })
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              githubId: String(githubProfile?.id),
              githubUsername,
              githubAccessToken: account?.access_token,
              connectedRepos: [],
              isVerified: true,
            })
          } else {
            await User.findOneAndUpdate(
              { githubUsername },
              { githubAccessToken: account?.access_token, image: user.image, githubId: String(githubProfile?.id), email: user.email, isVerified: true }
            )
          }
        } catch (error) {
          console.error("GitHub SignIn error:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, account, profile, user }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as any
        token.githubUsername = githubProfile?.login?.toLowerCase()
        token.githubAccessToken = account?.access_token
        token.githubId = String(githubProfile?.id)
      }
      if (account?.provider === "credentials" && user) {
        token.githubUsername = (user as any).githubUsername
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).githubUsername = token.githubUsername
        ;(session.user as any).githubAccessToken = token.githubAccessToken
        ;(session.user as any).githubId = token.githubId
      }
      return session
    },
  },

  pages: { signIn: "/login", error: "/login" },
}
































