// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import config from "../../../config";
// import "./reset.css";
// import Alert from "../../../Alert";

// function ForgotPassword() {
//   const [username, setUsername] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [isFetching, setIsFetching] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsFetching(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         `${config.serverUrl}/users/admin-forgetpassword`,
//         { username }
//       );
//       setOtpSent(true);
//       navigate("/admin/reset");
//       setIsFetching(false);
//     } catch (error) {
//       setError("Failed to send OTP. Please check the admin ID.");
//       setErrorMsg("Failed to send OTP. Please check the admin ID.");
//       setIsFetching(false);
//     }
//   };

//   return (
//     <div className="forgotPasswordContainer">
//       <div className="forgotPasswordLeft">
//         <img src="/logo.png" alt="Logo" />
//       </div>
//       <div className="forgotPasswordRight">
//         <div className="forgotPasswordTop">
//           <h2>Forgot Password</h2>
//           <h6>Enter your Admin ID to receive an OTP</h6>
//         </div>
//         <div className="forgotPasswordMiddle ">
//           <form onSubmit={handleSubmit} className="form-group">
//             <input
//               type="text"
//               name="username"
//               className="form-control"
//               placeholder="Admin ID"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
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
//                 "Send OTP"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
//     </div>
//   );
// }

// export default ForgotPassword;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import "./reset.css";
import Alert from "../../../Alert";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setError("");

    try {
      const response = await axios.post(
        `${config.serverUrl}/users/admin-forgetpassword`,
        { username }
      );
      setOtpSent(true);
      navigate("/admin/reset");
      setIsFetching(false);
    } catch (error) {
      setError("Failed to send OTP. Please check the admin ID.");
      setErrorMsg("Failed to send OTP. Please check the admin ID.");
      setIsFetching(false);
    }
  };

  return (
    <div className="forgotPasswordContainer">
      <div className="forgotPasswordLeft">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="forgotPasswordRight">
        <div className="forgotPasswordTop">
          <h1 className="text-center" style={{ fontWeight: "800" }}>
            Vruksh Store
          </h1>
          <h2 className="text-center">Forgot Password</h2>
          <h6 className="mt-4 text-center">
            Enter your Admin ID to receive an OTP
          </h6>
        </div>
        <div className="forgotPasswordMiddle mt-4">
          <form onSubmit={handleSubmit} className="form-group">
            <div className="input">
              <div className="input-icon">
                <i className="fa fa-user"></i>
                <input
                  type="text"
                  name="username"
                  className={error ? "form-control is-invalid" : "form-control"}
                  placeholder="Admin ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default ForgotPassword;
