import { Navigate } from "react-router-dom";

const AdminAuthRoute = ({ element: Component }) => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (!data) {
    return <Component />;
  }

  if (data?.name?.length < 2 && data.userType === "") {
    return <Component />;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminAuthRoute;
