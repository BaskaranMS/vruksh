import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ element: Component }) => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (data?.userType === "admin") {
    return <Component />;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminPrivateRoute;
