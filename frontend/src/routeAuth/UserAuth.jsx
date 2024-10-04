import { Navigate } from "react-router-dom";

const UserAuth = ({ element: Component }) => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (!data || (data?.name?.length < 2 && data.userType === "")) {
    return <Component />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default UserAuth;
