import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });

        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-3 flex items-center justify-center flex-col">
          {/* <PiUserCircle size={80} /> */}
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-2">
            {location?.state?.name}
          </h2>
        </div>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 text-white font-bold hover:bg-secondary rounded mt-4 leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="mt-2 text-xs text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary hover:underline mx-2 font-semibold"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
