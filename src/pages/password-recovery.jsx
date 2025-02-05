import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // Estado para el código de 4 dígitos
  const [password, setPassword] = useState(""); // Estado para la nueva contraseña
  const [repeatPassword, setRepeatPassword] = useState(""); // Estado para repetir la nueva contraseña
  const [showCodeInput, setShowCodeInput] = useState(false); // Estado para mostrar el campo de código
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-`~[\]{}|;':",./<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const passwordRequirements = [
    { label: "Minimum Length: At least 8 characters.", regex: /.{8,}/ },
    { label: "Uppercase: At least one uppercase letter (A-Z).", regex: /[A-Z]/ },
    { label: "Lowercase: At least one lowercase letter (a-z).", regex: /[a-z]/ },
    { label: "Numbers: At least one number (0-9).", regex: /\d/ },
    { label: "Símbolos: Al menos un carácter especial o símbolo.", regex: /[!@#$%^&*()_+=\-`~[\]{}|;':",./<>?]/ },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!showCodeInput) {
      try {
        const response = await fetch(import.meta.env.VITE_API_FORGOT_PASSWORD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("email", data.email); // Almacenar el email en el localStorage
          //setAlertMessage("Please enter the 4-digit code.");
          setAlertType("success");
          setShowCodeInput(true); // Mostrar el campo de código
        } else {
          setAlertMessage(data.message || "No email found");
          setAlertType("error");
        }
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage("An error occurred: " + error.message);
        setAlertType("error");
      }
    } else {
      // Aquí puedes manejar la verificación del código de 4 dígitos y la nueva contraseña
      if (code.length === 4 && validatePassword(password) && password === repeatPassword) {
        try {
          const email = localStorage.getItem("email");
          const response = await fetch(import.meta.env.VITE_API_RESET_PASSWORD, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "accept": "*/*"
            },
            body: JSON.stringify({ 
              email: email,           // cambio de mail a email
              resetCode: code,
              newPassword: password 
            }),
          });
          const data = await response.json();
          if (response.ok) {
            setAlertMessage(data.message || "Password updated successfully");
            setAlertType("success");
            setTimeout(() => navigate("/sign-in"), 2000); // Redirigir a la página de inicio de sesión
          } else {
            setAlertMessage(data.message || "Failed to update password");
            setAlertType("error");
          }
        } catch (error) {
          console.error("Error:", error);
          setAlertMessage("An error occurred: " + error.message);
          setAlertType("error");
        }
      } else {
        setAlertMessage("Invalid code or password");
        setAlertType("error");
      }
    }
  };

  const isFormValid = () => {
    return showCodeInput ? (code.length === 4 && validatePassword(password) && password === repeatPassword) : email.length > 0;
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Password Recovery</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email to recover your password.</Typography>
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
              disabled={showCodeInput} // Deshabilitar el campo de email si se muestra el campo de código
            />
            {showCodeInput && (
              <>
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Enter the 4-digit code sent to your email. Expires in 3 minutes.
                </Typography>
                <Input
                  size="lg"
                  placeholder="1234"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} // Permitir solo 4 dígitos
                />
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  New Password
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
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Password Requirements:
                </Typography>
                <ul>
                  {passwordRequirements.map(({ label, regex }) => (
                    <Typography
                      key={label}
                      variant="small"
                      color={regex.test(password) ? "green" : "red"}
                    >
                      <li>{label}</li>
                    </Typography>
                  ))}
                </ul>
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Repeat New Password
                </Typography>
                <Input
                  type="password"
                  size="lg"
                  placeholder="********"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </>
            )}
          </div>

          <Button className="mt-6" fullWidth type="submit" disabled={!isFormValid()}>
            {showCodeInput ? "Verify Code and Set Password" : "Recover Password"}
          </Button>

          {alertMessage && (
            <Typography variant="small" color={alertType === "success" ? "green" : "red"} className="mt-4 text-center">
              {alertMessage}
            </Typography>
          )}

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Remembered your password?
            <Link to="/sign-in" className="text-gray-900 ml-1">Sign In</Link>
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

export default PasswordRecovery;
