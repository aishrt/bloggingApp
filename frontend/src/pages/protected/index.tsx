import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import MyProfile from "./myProfile";
import Header from "../../layout/header";
import NotFound from "../public/notFound";
import BlogList from "./blogList";
import EditUser from "./editUser";
import { CreateBlog } from "./createBlog";
import UpdateBlog from "./updateBlog";

const App = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="w-screen h-screen alignmentLogo">Any Image Here</div>
        }
      >
        <Header />
        <Outlet></Outlet>
      </Suspense>
    </div>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MyProfile /> },
      { path: "/profile", element: <MyProfile /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "/user-edit/:id", element: <EditUser /> },
      { path: "/create-blog", element: <CreateBlog /> },
      { path: "/update-blog/:id", element: <UpdateBlog /> },
      { path: "/blog-list", element: <BlogList /> },
      { path: "*", element: <Navigate to="/not-found" /> },
    ],
  },
];
