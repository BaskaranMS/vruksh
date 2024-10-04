import React, { useEffect, useRef, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Alert from "../../../Alert";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./UserSignUp.css";

function UserSignUp() {
  gsap.registerPlugin(useGSAP);

  const container = useRef();
  const img = useRef();

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    password: "",
    cPassword: "",
  });

  const [dataErrors, setDataErrors] = useState({
    username: "",
    phone: "",
    password: "",
    cPassword: "",
  });

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ images, setImages ] = useState(['/a1.jpg', '/a2.jpg', '/a3.jpg']);
  const [ imageIndex, setImageIndex ] = useState(0);

  useEffect(() => {
    const fadeImage = () => {
      gsap.to(img.current, {
        opacity: 0.5,
        duration: 0.8,
        onComplete: () => {
          setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          gsap.fromTo(
            img.current,
            { opacity: 0.5 },
            { opacity: 1, duration: 0.8 }
          );
        },
      });
    };

    const intervalId = setInterval(fadeImage, 7000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...dataErrors };

    switch (name) {
      case "username":
        value = value.trim();
        if (value.length > 40) {
          errors.username = "Username must be 40 characters or less.";
        } else {
          const regex = /^[A-Za-z\s]+$/;
          errors.username = regex.test(value)
            ? ""
            : "Name can only contain letters and spaces.";
        }
        break;
      case "phone":
        const phonePattern = /^[0-9]{10}$/;
        errors.phone = phonePattern.test(value)
          ? ""
          : "Enter a valid phone number!";
        break;
      case "password":
        errors.password =
          value.length !== 10 ? "Password must be a length phone number" : "";
        break;
      case "cPassword":
        errors.cPassword =
          value !== userData.password ? "Passwords do not match!" : "";
        break;
      default:
        break;
    }

    setDataErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    if (
      !dataErrors.username &&
      !dataErrors.phone &&
      !dataErrors.password &&
      !dataErrors.cPassword
    ) {
      try {
        const response = await axios.post(
          `${config.serverUrl}/users/register`,
          userData
        );
        if (response) {
          setIsFetching(false);
          navigate("/user/logIn");
        }
      } catch (error) {
        if (error.response.data.message.includes("Username")) {
          setDataErrors({
            ...dataErrors,
            username: error.response.data.message,
          });
        } else if (error.response.data.message.includes("Phone number")) {
          setDataErrors({
            ...dataErrors,
            phone: error.response.data.message,
          });
        } else {
          setErrorMsg("Internal server error.. Please try again later!");
        }
        setIsFetching(false);
      }
    } else {
      setIsFetching(false);
    }
  };

  const renderTooltip = (msg) => (
    <Tooltip id="tooltip-top" className="custom-tooltip">
      {msg}
    </Tooltip>
  );

  return (
    <div className="userSignUpContainer" ref={container}>
      <div className="userSignUpLeft">
        <img src={images[imageIndex]} alt="Vruksh Store Logo" ref={img} />
      </div>
      <div className="userSignUpRight">
        <div className="signUpRightTop">
          <h1 className="text-center" style={{ fontWeight: "800" }}>
            <b>Vruksh Store </b>
          </h1>
          <h2 className="text-center" style={{ fontWeight: "500" }}>
            <b>On The Job Training</b>
          </h2>
          <h3 className="text-center">Create a new account</h3>
          <h6 className="mt-4">
            Join us to simplify your shopping experience!
          </h6>
        </div>
        <div className="signUpMiddle">
          <form onSubmit={handleSubmit}>
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
                    id="username"
                    name="username"
                    placeholder="Full name"
                    value={userData.username}
                    onChange={handleChange}
                    className={dataErrors.username ? "is-invalid" : ""}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <div className="input mt-3">
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip(dataErrors.phone)}
                show={!!dataErrors.phone}
              >
                <div className="input-icon">
                  <i className="fa fa-phone"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={userData.phone}
                    onChange={handleChange}
                    className={dataErrors.phone ? "is-invalid" : ""}
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
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange}
                    className={dataErrors.password ? "is-invalid" : ""}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <div className="input mt-3">
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip(dataErrors.cPassword)}
                show={!!dataErrors.cPassword}
              >
                <div className="input-icon">
                  <i className="fa fa-lock"></i>
                  <input
                    type="password"
                    id="cPassword"
                    name="cPassword"
                    placeholder="Confirm Password"
                    value={userData.cPassword}
                    onChange={handleChange}
                    className={dataErrors.cPassword ? "is-invalid" : ""}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <button
              type="submit"
              className="btn bg-dark mt-3"
              disabled={isFetching}
            >
              {isFetching ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{ color: "white" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </form>
          <div className="privacy">
            <p>By signing up, you agree to share your details with us!</p>
          </div>
        </div>
        <div className="signUpBottom">
          <p>
            <b>Already have an account?</b>
          </p>
          <button onClick={() => navigate("/user/logIn")} className="bg-dark">
            Log in
          </button>
        </div>
        <h6 onClick={() => navigate("/admin/logIn")} className="signUpAdmin">
          <b>Log In as Admin?</b>
        </h6>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default UserSignUp;
