import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "./AdminLogIn.css";
import axios from "axios";
import config from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../../../features/user";
import Alert from "../../../Alert";

function AdminLogIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [dataErrors, setDataErrors] = useState({
    username: "",
    password: "",
  });
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...dataErrors };

    switch (name) {
      case "username":
        errors.username =
          value.trim().length < 3 ? "Please provide a valid admin Id" : "";
        break;
      case "password":
        errors.password =
          value.length < 8 || value.length > 16
            ? "Password must be between 8 and 16 characters"
            : "";
        break;
      default:
        break;
    }

    setDataErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    if (!dataErrors.username && !dataErrors.password) {
      try {
        const response = await axios.post(
          `${config.serverUrl}/users/adminLogin`,
          userData
        );
        if (response) {
          const user = {
            userId: response.data.data.userId || "",
            name: response.data.data.name || "admin",
            userType: "admin",
            phoneNumber: "",
            cartProducts: response.data.data.cart || [],
            purchasedHistory: response.data.data.orders || [],
            token: response.data.data.token.token,
          };
          dispatch(createUser(user));
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("cart", JSON.stringify(response.data.data.cart));
          localStorage.setItem(
            "orders",
            JSON.stringify(response.data.data.orders)
          );
          setIsFetching(false);
          navigate("/admin/products");
        }
      } catch (error) {
        if (error.response?.data.data?.includes("Invalid Admin id")) {
          setDataErrors({
            ...dataErrors,
            username: "No admin found for this admin id",
          });
        } else if (error.response?.data.data?.includes("Invalid Password")) {
          setDataErrors({
            ...dataErrors,
            password: "Invalid password",
          });
        } else {
          setErrorMsg("Internal Server Error");
        }
        setIsFetching(false);
      }
    } else {
      setErrorMsg("Form contains errors");
      setIsFetching(false);
    }
  };

  useEffect(() => {
    console.log(config.serverUrl);
  }, []);

  const renderTooltip = (msg) => (
    <Tooltip id="tooltip-top" className="custom-tooltip">
      {msg}
    </Tooltip>
  );

  return (
    <div className="adminLogInContainer">
      <div className="adminLogInLeft">
        <img src="/logo.png" alt="" />
      </div>
      <div className="adminLogInRight">
        <div className="logInRightTop">
          <h1 className="text-center" style={{ fontWeight: "800" }}>
            Vruksh Store
          </h1>
          <h2 className="text-center">Admin Login</h2>
          <h6 className="mt-4">
            Please Enter Your Admin Credentials to Proceed
          </h6>
        </div>
        <div className="logInMiddle">
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="input">
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip(dataErrors.username)}
                show={!!dataErrors.username}
              >
                <div className="input-icon">
                  <i className="fa fa-user"></i>
                  <input
                    type="text"
                    name="username"
                    className={
                      dataErrors.username
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Admin ID"
                    value={userData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <div className="input mt-3">
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip(dataErrors.password)}
                show={!!dataErrors.password}
              >
                <div className="input-icon">
                  <i className="fa fa-lock"></i>
                  <input
                    type="password"
                    name="password"
                    className={
                      dataErrors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Admin Password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <button
              type="submit"
              className="btn bg-dark mt-3 d-flex align-items-center justify-content-center"
              style={{ padding: "0.5rem 1.5rem" }}
              disabled={isFetching}
            >
              {isFetching ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{ color: "white", width: "1.5rem", height: "1.5rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="adminLogInLinks">
            <Link
              to={"/admin/forget"}
              className="adminLink"
              style={{ fontWeight: "700" }}
            >
              Forget Password?
            </Link>
            <Link to={"/"} className="adminLink" style={{ fontWeight: "700" }}>
              Log In as User?
            </Link>
          </div>
        </div>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default AdminLogIn;
