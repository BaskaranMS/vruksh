import React, { useEffect, useState, useRef } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "./UserLogIn.css";
import axios from "axios";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../../../features/user";
import Alert from "../../../Alert";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function UserLogIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  gsap.registerPlugin(useGSAP);

  const container = useRef();
  const img = useRef();

  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });

  const [dataErrors, setDataErrors] = useState({
    username: '',
    password: ''
  });
  
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ images, setImages ] = useState(['/a2.jpg', '/a3.jpg','/a1.jpg']);
  const [ imageIndex, setImageIndex ] = useState(0);

  useEffect(() => {
    const fadeImage = () => {
      gsap.to(img.current, { opacity: 0.5, duration: 0.8, onComplete: () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        gsap.fromTo(img.current, { opacity: 0.5 }, { opacity: 1, duration: 0.8 });
      }});
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
      case 'username':
        errors.username = value.trim().length < 3
          ? 'Please provide a valid username'
          : '';
        break;
      case 'password':
        errors.password = value.length !== 10
          ? 'Password must be between 10 characters'
          : '';
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
        const response = await axios.post(`${config.serverUrl}/users/login`, userData);
        if (response) {
          const user = {
            userId: response.data.data.userId,
            name: response.data.data.username,
            userType: 'user',
            phoneNumber: response.data.data.phone,
            cartProducts: response.data.data.cart || [],
            purchasedHistory: response.data.data.orders || [],
            token: response.data.data.token
          };
          dispatch(createUser(user));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('cart', JSON.stringify(response.data.data.cart));
          localStorage.setItem('orders', JSON.stringify(response.data.data.orders));
          setIsFetching(false);
          navigate('/');
        }
      } catch (error) {
        if (error.response?.data?.message?.includes('no user found for this username')) {
          setDataErrors({
            ...dataErrors,
            username: 'No user found for this username'
          });
        } else if (error.response?.data?.message?.includes('password is incorrect')) {
          setDataErrors({
            ...dataErrors,
            password: 'Password is incorrect'
          });
        } else {
          setErrorMsg('Internal server error.. Try again later!');
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
    <div className="userLogInContainer">
      <div className="userLogInLeft">
      <img src={images[imageIndex]} alt="Vruksh Store Logo" ref={img}/>
      </div>
      <div className="userLogInRight">
        <div className="logInRightTop">
          <h1 className="text-center" style={{ fontWeight : '800'}}><b>Vruksh Store</b></h1>
          <h2 className="text-center" style={{ fontWeight : '500'}}><b>On The Job Training</b></h2>
          <h2 className="text-center mt-3">Welcome back!</h2>
          <h6 className="mt-5">Continue where you left off</h6>
        </div>
        <div className="logInMiddle">
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
                    name="username"
                    placeholder="Full name"
                    value={userData.username}
                    onChange={handleChange}
                    className={dataErrors.username ? 'is-invalid' : ''}
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
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange}
                    className={dataErrors.password ? 'is-invalid' : ''}
                    required
                  />
                </div>
              </OverlayTrigger>
            </div>

            <button type="submit" className="btn bg-dark mt-3" disabled={isFetching}>
              {isFetching ? (
                <div className="spinner-border" role="status" style={{ color: 'white' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
          <div className="privacy">
            <p>By logging in, you agree to share your details with us.</p>
          </div>
        </div>
        <div className="logInBottom">
          <p><b>New user?</b></p>
          <button onClick={() => navigate('/user/signUp')} className="bg-dark">
            Create new account
          </button>
        </div>
        <h6 onClick={() => navigate('/admin/logIn')} className="logInAdmin mt-3">
          <b>Log In as Admin?</b>
        </h6>
      </div>
      <Alert errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
}

export default UserLogIn;
