import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Protect admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      
      // Protect user-specific routes
      if (
        req.nextUrl.pathname.startsWith("/profile") ||
        req.nextUrl.pathname.startsWith("/orders")
      ) {
        return !!token;
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};