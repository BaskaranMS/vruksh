// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import config from "../../../config";
// import "./reset.css";
// import Alert from "../../../Alert";

// function ResetPassword() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     otp: "",
//     newPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [isFetching, setIsFetching] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsFetching(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         `${config.serverUrl}/users/admin-resetpassword`,
//         formData
//       );
//       navigate("/admin/logIn");
//       setIsFetching(false);
//     } catch (error) {
//       setError("Failed to reset password. Please check your OTP or try again.");
//       setErrorMsg("Failed to reset password. Please check your OTP or try again.");
//       setIsFetching(false);
//     }
//   };

//   return (
//     <div className="resetPasswordContainer">
//       <div className="resetPasswordLeft">
//         <img src="/logo.png" alt="Logo" />
//       </div>
//       <div className="resetPasswordRight">
//         <div className="resetPasswordTop">
//           <h2>Reset Password</h2>
//           <h6>Enter the OTP and your new password</h6>
//         </div>
//         <div className="resetPasswordMiddle">
//           <form onSubmit={handleSubmit} className="form-group">
//             <input
//               type="text"
//               name="username"
//               className="form-control"
//               placeholder="Admin ID"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="otp"
//               className="form-control"
//               placeholder="OTP"
//               value={formData.otp}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="password"
//               name="newPassword"
//               className="form-control"
//               placeholder="New Password"
//               value={formData.newPassword}
//               onChange={handleChange}
//               required
//             />
//             {error && <p className="text-danger">{error}</p>}
//             <button
//               type="submit"
//               className="btn btn-primary mt-3 d-flex align-items-center justify-content-center"
//               disabled={isFetching}
//             >
//               {isFetching ? (
//                 <div
//                   className="spinner-border"
//                   role="status"
//                   style={{ color: "white", width: "1.5rem", height: "1.5rem" }}
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
//     </div>
//   );
// }

// export default ResetPassword;

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import config from "../../../config";
// import "./reset.css";
// import Alert from "../../../Alert";

// function ResetPassword() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     otp: "",
//     newPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [isFetching, setIsFetching] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsFetching(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         `${config.serverUrl}/users/admin-resetpassword`,
//         formData
//       );
//       navigate("/admin/logIn");
//       setIsFetching(false);
//     } catch (error) {
//       setError("Failed to reset password. Please check your OTP or try again.");
//       setErrorMsg(
//         "Failed to reset password. Please check your OTP or try again."
//       );
//       setIsFetching(false);
//     }
//   };

//   return (
//     <div className="resetPasswordContainer">
//       <div className="resetPasswordLeft">
//         <img src="/logo.png" alt="Logo" />
//       </div>
//       <div className="resetPasswordRight">
//         <div className="resetPasswordTop">
//           <h2 className="text-center">Reset Password</h2>
//           <h6 className="text-center">Enter the OTP and your new password</h6>
//         </div>
//         <div className="resetPasswordMiddle mt-4">
//           <form onSubmit={handleSubmit} className="form-group">
//             <div className="input">
//               <div className="input-icon">
//                 <i className="fa fa-user"></i>
//                 <input
//                   type="text"
//                   name="username"
//                   className={error ? "form-control is-invalid" : "form-control"}
//                   placeholder="Admin ID"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="input-icon mt-4">
//                 <i className="fa fa-key"></i>
//                 <input
//                   type="text"
//                   name="otp"
//                   className={error ? "form-control is-invalid" : "form-control"}
//                   placeholder="OTP"
//                   value={formData.otp}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="input-icon mt-4">
//                 <i className="fa fa-lock"></i>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   className={error ? "form-control is-invalid" : "form-control"}
//                   placeholder="New Password"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               {error && <p className="text-danger mt-2">{error}</p>}
//             </div>
//             <button
//               type="submit"
//               className="btn bg-dark mt-3 d-flex align-items-center justify-content-center"
//               style={{ padding: "0.5rem 1.5rem" }}
//               disabled={isFetching}
//             >
//               {isFetching ? (
//                 <div
//                   className="spinner-border"
//                   role="status"
//                   style={{ color: "white", width: "1.5rem", height: "1.5rem" }}
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
//     </div>
//   );
// }

// export default ResetPassword;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import "./reset.css";
import Alert from "../../../Alert";

function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    otp: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setError("");

    try {
      const response = await axios.post(
        `${config.serverUrl}/users/admin-resetpassword`,
        formData
      );
      navigate("/admin/logIn");
      setIsFetching(false);
    } catch (error) {
      setError("Failed to reset password. Please check your OTP or try again.");
      setErrorMsg(
        "Failed to reset password. Please check your OTP or try again."
      );
      setIsFetching(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/forgot");
  };

  return (
    <div className="resetPasswordContainer">
      <div className="resetPasswordLeft">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="resetPasswordRight">
        <div className="resetPasswordTop">
          <h2 className="text-center">Reset Password</h2>
          <h6 className="text-center">Enter the OTP and your new password</h6>
        </div>
        <div className="resetPasswordMiddle mt-4">
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input">
              <div className="input-icon">
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="username"
                  className={error ? "form-control is-invalid" : "form-control"}
                  placeholder="Admin ID"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-icon mt-4">
                <i className="fa fa-key"></i>
                <input
                  type="text"
                  name="otp"
                  className={error ? "form-control is-invalid" : "form-control"}
                  placeholder="OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-icon mt-4">
                <i className="fa fa-lock"></i>
                <input
                  type="password"
                  name="newPassword"
                  className={error ? "form-control is-invalid" : "form-control"}
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="text-danger mt-2">{error}</p>}
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
                "Reset Password"
              )}
            </button>
          </form>
          <div className="timer mt-3 text-center">
            <p>Time Remaining: {timer}s</p>
            {timer === 0 && (
              <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-2"
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default ResetPassword;
