import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Root route - shows welcome for unauthenticated, redirects to home for authenticated
  index("routes/index.tsx"),
  
  // Public routes
  route("/welcome", "routes/welcome.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  
  // Handle Chrome DevTools requests
  route("/.well-known/appspecific/com.chrome.devtools.json", "routes/devtools.tsx"),
  
  // Protected routes with layout
  layout("layouts/AppLayout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/profile/:userId?", "routes/profile.tsx"),
    route("/post/:id", "routes/post-details.tsx"),
    route("/create-post", "routes/create-post.tsx"),
    route("/edit-post/:id", "routes/edit-post.tsx"),
    route("/followers/:userId", "routes/followers.tsx"),
    route("/following/:userId", "routes/following.tsx"),
    route("/search", "routes/search.tsx"),
    route("/settings", "routes/settings.tsx"),
    route("/notifications", "routes/notifications.tsx"),
  ]),
  
  // Admin routes
  layout("layouts/AdminLayout.tsx", [
    route("/admin", "routes/admin/dashboard.tsx"),
    route("/admin/login", "routes/admin/login.tsx"),
    route("/admin/users", "routes/admin/users.tsx"),
    route("/admin/posts", "routes/admin/posts.tsx"),
    route("/admin/employees", "routes/admin/employees.tsx"),
    route("/admin/revenue", "routes/admin/revenue.tsx"),
    route("/admin/payments", "routes/admin/payments.tsx"),
    route("/admin/analytics", "routes/admin/analytics.tsx"),
  ]),
  
  // Catch-all route for unmatched paths (including Chrome DevTools requests)
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
