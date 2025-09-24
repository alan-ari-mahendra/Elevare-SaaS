import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/projects/:path*",
    "/tasks/:path*",
    "/settings/:path*",
  ],
};
