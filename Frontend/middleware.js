import { withAuth } from "next-auth/middleware"; 

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard"], 
};

export const handler = withAuth({
  secret: process.env.NEXTAUTH_SECRET, 
  async pages({ req, res }) {
    const session = await getSession({ req });
    
    if (!session) {
      return { redirect: { destination: "/", permanent: false } }; 
    }

    return { next: true };
  }
});
