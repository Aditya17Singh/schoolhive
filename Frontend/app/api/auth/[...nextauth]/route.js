import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        try {
          console.log("Received credentials:", credentials);
        
          await connectMongoDB();
          const user = await User.findOne({ username: credentials.username, mobile: credentials.mobile });
      
          if (!user) {
            console.log("User not found!");
            return null;
          }
      
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordsMatch) {
            console.log("Incorrect password!");
            return null;
          }
      
          console.log("User found and role assigned:", user.role);
      
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            mobile: user.mobile,
            role: user.role, // Ensure that the 'role' field exists and is valid
            schoolId: user.schoolId || user._id
          };
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      }          
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.mobile = user.mobile;
        token.role = user.role; // Role will be added here
        token.schoolId = user.schoolId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        mobile: token.mobile,
        role: token.role, // Ensure role is available here
        schoolId: token.schoolId,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
