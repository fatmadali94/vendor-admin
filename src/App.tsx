import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// import Products from "./pages/products/Products";
// import Affiliates from "./pages/affiliates/Affiliates";
// import Solutions from "./pages/solutions/Solutions";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useStore } from "./components/useSignIn/useSignIn";
import MaterialGrades from "./pages/materialGrades/MaterialGrades";
import MaterialNames from "./pages/materialNames/MaterialNames";
import MaterialProviders from "./pages/materialProviders/MaterialProviders";
import PartGroups from "./pages/partGroups/PartGroups";
import PartNames from "./pages/partNames/PartNames";
import PartGeneralIds from "./pages/partGeneralIds/PartGeneralIds";
import PartProviders from "./pages/partProviders/PartProviders";
import MaterialGroups from "./pages/materialGroups/MaterialGroups";

const queryClient = new QueryClient();

function App() {
  const user = useStore((state: any) => state.user);
  // console.log(user, "this is user from app");

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              {user.currentUser.isAdmin ? <Outlet /> : <Login />}
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        // {
        //   path: "/users",
        //   element: <Users />,
        // },
        {
          path: "/materialGrades",
          element: <MaterialGrades />,
        },
        {
          path: "/materialGroups",
          element: <MaterialGroups />,
        },
        {
          path: "/materialNames",
          element: <MaterialNames />,
        },
        {
          path: "/materialGrades",
          element: <MaterialGrades />,
        },
        {
          path: "/materialProviders",
          element: <MaterialProviders />,
        },
        {
          path: "/partGroups",
          element: <PartGroups />,
        },
        {
          path: "/partNames",
          element: <PartNames />,
        },
        {
          path: "/partGeneralIds",
          element: <PartGeneralIds />,
        },
        {
          path: "/partProviders",
          element: <PartProviders />,
        },

        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
