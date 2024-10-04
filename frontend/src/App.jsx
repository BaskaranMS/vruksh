import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "./features/user";
import { useEffect } from "react";
import UserSignUp from "./pages/user/signUp/UserSignUp";
import UserLogIn from "./pages/user/logIn/UserLogIn";
import AdminLogIn from "./pages/admin/logIn/AdminLogIn";
import AdminProducts from "./pages/admin/Adminproducts/AdminProducts";
import AdminOrders from "./pages/admin/Adminorders/AdminOrders";
import UserHome from "./pages/user/userHome/UserHome";
import ForgotPassword from "./pages/admin/AdminReset/AdminForgetPass";
import ResetPassword from "./pages/admin/AdminReset/AdminResetPass";
import AdminAggregate from "./pages/admin/AdminAgg/AdminAggregate";
import PrivateRoute from "./routeAuth/PrivateRoute";
import Price from "./pages/user/Price";
import AdminPrivateRoute from "./routeAuth/adminPrivateRoute";
import AdminAuthRoute from "./routeAuth/AdminAuth";
import UserAuth from "./routeAuth/UserAuth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const setAppUser = () => {
      const storedData = JSON.parse(localStorage.getItem("user"));
      if (storedData) {
        dispatch(createUser(storedData));
      }
    };
    setAppUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PrivateRoute element={UserHome} />} />

        <Route
          exact
          path="/user/signUp"
          element={<UserAuth element={UserSignUp} />}
        />
        <Route
          exact
          path="/user/logIn"
          element={<UserAuth element={UserLogIn} />}
        />

        <Route
          exact
          path="/admin/logIn"
          element={<AdminAuthRoute element={AdminLogIn} />}
        />
        <Route
          exact
          path="/admin/forget"
          element={<AdminAuthRoute element={ForgotPassword} />}
        />
        <Route
          exact
          path="/admin/reset"
          element={<AdminAuthRoute element={ResetPassword} />}
        />

        <Route
          exact
          path="/admin/products"
          element={<AdminPrivateRoute element={AdminProducts} />}
        />
        <Route
          exact
          path="/admin/orders"
          element={<AdminPrivateRoute element={AdminOrders} />}
        />
        <Route
          exact
          path="/admin/aggregate"
          element={<AdminPrivateRoute element={AdminAggregate} />}
        />
        <Route
          exact
          path="/price"
          element={<AdminPrivateRoute element={Price} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
