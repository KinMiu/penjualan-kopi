/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import './LoginSignUp.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, register } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Loader from '../../Components/Loader/Loder';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import coffeeImage from '../../assets/coffee.png';

const LoginSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, loading, isAuthenticate, token } = useSelector((state) => state.user);

  const [currState, setCurState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png");

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "avatar") {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(data.email, data.password));
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (avatar) {
      formData.append('avatar', avatar);
    } else {
      alert.error("Avatar is required for registration");
      return;
    }

    dispatch(register(formData));
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (isAuthenticate) {
      Cookies.set('token', token);
      navigate(redirect);
    }
  }, [dispatch, error, alert, isAuthenticate, navigate, redirect]);

  return (
    <>
      {
        loading
          ? <Loader />
          : <div className="auth-page">
            <div className="auth-container">
              <div className="auth-form-section">
                <div className="login-text">
                  <h2>{currState === "Login" ? "Welcome Back!" : "Create Account"}</h2>
                  <p>{currState === "Login" ? "Please login to continue" : "Register to get started"}</p>
                </div>

                <form onSubmit={currState === "Login" ? loginSubmit : registerSubmit}>
                  {currState === "Register" && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={data.name}
                      onChange={onChangeHandler}
                      required
                    />
                  )}

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                  />

                  {currState === "Register" && (
                    <div className="avatar-upload">
                      <img src={avatarPreview} alt="Avatar Preview" />
                      <label>
                        <input type="file" name="avatar" onChange={onChangeHandler} accept="image/*" />
                        <span>Upload Profile Picture</span>
                      </label>
                    </div>
                  )}

                  {currState === "Login" && (
                    <p className="forgot">Forgot password?</p>
                  )}

                  <button type="submit" className="submit-btn">
                    {currState === "Login" ? "Login" : "Register"}
                  </button>
                </form>

                <div className="toggle-auth">
                  {currState === "Login" ? (
                    <p>Don't have an account? <span onClick={() => setCurState("Register")}>Sign Up</span></p>
                  ) : (
                    <p>Already have an account? <span onClick={() => setCurState("Login")}>Login</span></p>
                  )}
                </div>
              </div>

              <div className="auth-image-section">
                <img src={coffeeImage} alt="Illustration" />
              </div>
            </div>
          </div>
      }
    </>
  );
};

export default LoginSignUp;
