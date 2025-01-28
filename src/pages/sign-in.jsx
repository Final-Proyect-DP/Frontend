import React, { useState, useContext } from "react";
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth"; // Asegúrate de importar el AuthContext correctamente

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Cambia setIsAuthenticated por login

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        login(); // Llama a login en lugar de setIsAuthenticated
        setAlertMessage("Login successful");
        setAlertType("success");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setAlertMessage("Login failed");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("An error occurred: " + error.message);
      setAlertType("error");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>

          {alertMessage && (
            <Typography variant="small" color={alertType === "success" ? "green" : "red"} className="mt-4 text-center">
              {alertMessage}
            </Typography>
          )}


          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            <Link to="/password-recovery" className="text-gray-900 ml-1">Forgot password?</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
