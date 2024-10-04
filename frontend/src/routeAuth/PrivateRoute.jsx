import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (!data) {
    return <Navigate to="/user/logIn" replace />;
  }

  if (!data?.userId && data?.userType == "admin") {
    return <Navigate to="/admin/products" />;
  }

  return data?.userId && data?.userType === "user" ? (
    <Component />
  ) : (
    <Navigate to="/user/logIn" replace />
  );
};

export default PrivateRoute;
