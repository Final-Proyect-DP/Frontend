import React, { useState } from "react";
import {
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [semester, setSemester] = useState('');
  const [career, setcareer] = useState('');
  const [parallel, setParallel] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-`~[\]{}|;':",./<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password)) newErrors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    if (password !== repeatPassword) newErrors.repeatPassword = "Passwords do not match";
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!address) newErrors.address = "Address is required";
    if (!phone) newErrors.phone = "Phone is required";
    else if (!validatePhone(phone)) newErrors.phone = "Phone number must be exactly 10 digits";
    if (!semester) newErrors.semester = "Semester is required";
    if (!career) newErrors.career = "career is required";
    if (!parallel) newErrors.parallel = "Parallel is required";
    else if (parallel.length > 10) newErrors.parallel = "Parallel must be less than 10 characters";
    if (!description) newErrors.description = "Description is required";
    else if (description.length > 250) newErrors.description = "Description must be less than 250 characters";
    if (!termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('semester', semester);
    formData.append('career', career);
    formData.append('parallel', parallel);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_REGISTER, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setAlertMessage(data.message);
        setAlertType('success');
        setTimeout(() => navigate('/sign-in'), 2000);
      } else {
        setAlertMessage('Registration failed');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('An error occurred');
      setAlertType('error');
    }
  };

  const handleBlur = (field) => {
    if (field === 'email' && email && !validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    }
    if (field === 'phone' && phone && !validatePhone(phone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone number must be exactly 10 digits",
      }));
    }
    if (field === 'repeatPassword' && password !== repeatPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        repeatPassword: "Passwords do not match",
      }));
    }
    if (field === 'parallel' && parallel.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        parallel: "Parallel must be less than 10 characters",
      }));
    }
    if (field === 'description' && description.length > 250) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description must be less than 250 characters",
      }));
    }
  };

  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      if (validateEmail(value)) {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (field === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setPhone(numericValue);
      if (validatePhone(numericValue)) {
        setErrors((prevErrors) => {
          const { phone, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (field === 'password') {
      setPassword(value);
      if (validatePassword(value)) {
        setErrors((prevErrors) => {
          const { password, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (field === 'repeatPassword') {
      setRepeatPassword(value);
      if (password === value) {
        setErrors((prevErrors) => {
          const { repeatPassword, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (field === 'parallel') {
      if (value.length <= 10) {
        setParallel(value);
        setErrors((prevErrors) => {
          const { parallel, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    if (field === 'description') {
      if (value.length <= 250) {
        setDescription(value);
        setErrors((prevErrors) => {
          const { description, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isFormValid = () => {
    return (
      username &&
      email &&
      validateEmail(email) &&
      password &&
      validatePassword(password) &&
      repeatPassword &&
      password === repeatPassword &&
      firstName &&
      lastName &&
      address &&
      phone &&
      validatePhone(phone) &&
      semester &&
      career &&
      parallel.length <= 10 &&
      description.length <= 250 &&
      termsAccepted
    );
  };

  const passwordRequirements = [
    { label: "Minimum Length: At least 8 characters.", regex: /.{8,}/ },
    { label: "Uppercase: At least one uppercase letter (A-Z).", regex: /[A-Z]/ },
    { label: "Lowercase: At least one lowercase letter (a-z).", regex: /[a-z]/ },
    { label: "Numbers: At least one number (0-9).", regex: /\d/ },
    { label: "Símbolos: Al menos un carácter especial o símbolo.", regex: /[!@#$%^&*()_+=\-`~[\]{}|;':",./<>?]/ },
  ];

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your details to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="Username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
            />
            {errors.username && <Typography variant="small" color="red">{errors.username}</Typography>}
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
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={!!errors.email}
            />
            {errors.email && <Typography variant="small" color="red">{errors.email}</Typography>}
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
              onChange={(e) => handleChange('password', e.target.value)}
              error={!!errors.password}
            />
            {errors.password && <Typography variant="small" color="red">{errors.password}</Typography>}
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
              Repeat Password
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
              onChange={(e) => handleChange('repeatPassword', e.target.value)}
              onBlur={() => handleBlur('repeatPassword')}
              error={!!errors.repeatPassword}
            />
            {errors.repeatPassword && <Typography variant="small" color="red">{errors.repeatPassword}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              First Name
            </Typography>
            <Input
              size="lg"
              placeholder="First Name"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!errors.firstName}
            />
            {errors.firstName && <Typography variant="small" color="red">{errors.firstName}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Last Name
            </Typography>
            <Input
              size="lg"
              placeholder="Last Name"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!errors.lastName}
            />
            {errors.lastName && <Typography variant="small" color="red">{errors.lastName}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Address
            </Typography>
            <Input
              size="lg"
              placeholder="Address"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
            />
            {errors.address && <Typography variant="small" color="red">{errors.address}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Phone
            </Typography>
            <Input
              size="lg"
              placeholder="Phone"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={!!errors.phone}
            />
            {errors.phone && <Typography variant="small" color="red">{errors.semester}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Semester
            </Typography>
            <Select
              size="lg"
              label="Semester"
              value={semester}
              onChange={(value) => setSemester(value)}
              error={!!errors.semester}
            >
              {[...Array(11).keys()].map((num) => (
                <Option key={num} value={num.toString()}>
                  {num}
                </Option>
              ))}
            </Select>
            {errors.semester && <Typography variant="small" color="red">{errors.semester}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              career
            </Typography>
            <Select
              size="lg"
              label="career"
              value={career}
              onChange={(value) => setcareer(value)}
              error={!!errors.career}
            >
              <Option value="Ingeniería de Sistemas">Ingeniería de Sistemas</Option>
              <Option value="Ingeniería Civil">Ingeniería Civil</Option>
              <Option value="Medicina">Medicina</Option>
              <Option value="Derecho">Derecho</Option>
              <Option value="Arquitectura">Arquitectura</Option>
            </Select>
            {errors.career && <Typography variant="small" color="red">{errors.career}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Parallel
            </Typography>
            <Input
              size="lg"
              placeholder="Parallel"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={parallel}
              onChange={(e) => handleChange('parallel', e.target.value)}
              onBlur={() => handleBlur('parallel')}
              error={!!errors.parallel}
            />
            {errors.parallel && <Typography variant="small" color="red">{errors.parallel}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Give a short description about yourself
            </Typography>
            <Textarea
              size="lg"
              placeholder="Description"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={!!errors.description}
              rows={4}
            />
            {errors.description && <Typography variant="small" color="red">{errors.description}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Profile Image
            </Typography>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-full mb-3" />
                  ) : (
                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V8m0 0l-4 4m4-4l4 4m5 4h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m-6 10h6m-6 0a2 2 0 01-2-2v-2a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2m-6 0V8m0 0l-4 4m4-4l4 4"></path>
                    </svg>
                  )}
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  {image && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{image.name}</p>}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          {errors.termsAccepted && <Typography variant="small" color="red">{errors.termsAccepted}</Typography>}
          <Button className="mt-6" fullWidth type="submit" disabled={!isFormValid()}>
            Register Now
          </Button>

          {alertMessage && (
            <Typography variant="small" color={alertType === "success" ? "green" : "red"} className="mt-4 text-center">
              {alertMessage}
            </Typography>
          )}

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
