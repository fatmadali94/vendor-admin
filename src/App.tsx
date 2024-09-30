import { useState, useEffect } from "react";
import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./components/login/Login";
import "./styles/global.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MaterialGrades from "./pages/materialGrades/MaterialGrades";
import MaterialNames from "./pages/materialNames/MaterialNames";
import MaterialProviders from "./pages/materialProviders/MaterialProviders";
import PartGroups from "./pages/partGroups/PartGroups";
import PartNames from "./pages/partNames/PartNames";
import PartGeneralIds from "./pages/partGeneralIds/PartGeneralIds";
import PartProviders from "./pages/partProviders/PartProviders";
import MaterialGroups from "./pages/materialGroups/MaterialGroups";
import Exhibitions from "./pages/exhibitions/Exhibitions";
import Messages from "./pages/messages/Messages";
import Offers from "./pages/offers/Offers";
import Products from "./pages/products/Products";
import Markets from "./pages/markets/Markets";
import Resources from "./pages/resources/Resources";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const Layout = () => {
    return (
      <div className="main">
        {isAuthenticated ? (
          <>
            <Navbar />
            <div className="container">
              <QueryClientProvider client={queryClient}>
                <div className="menuContainer">
                  <Menu />
                </div>
                <div className="contentContainer">
                  <Outlet />
                </div>
              </QueryClientProvider>
            </div>
            <Footer />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
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
          path: "/messages",
          element: <Messages />,
        },
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
          path: "/exhibitions",
          element: <Exhibitions />,
        },

        {
          path: "/offers",
          element: <Offers />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/resources",
          element: <Resources />,
        },
        {
          path: "/markets",
          element: <Markets />,
        },
        {
          path: "/login",
          element: <Login onLogin={handleLogin} />,
        },
      ],
    },
    // {
    //   path: "/login",
    //   element: <Login onLogin={handleLogin} />,
    // },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
