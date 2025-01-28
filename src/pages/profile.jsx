import { useEffect, useState } from "react";
import { Avatar, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select, Option, Textarea, Spinner } from "@material-tailwind/react";
import {
  MapPinIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  UserCircleIcon,
  AcademicCapIcon
} from "@heroicons/react/24/solid";
import { Footer } from "@/widgets/layout";

export function Profile() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    career: "",
    semester: "",
    parallel: "",
    username: "",
    phone: "",
    description: "",
    // image: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (userId && token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_FETCH_PROFILE}/${userId}?token=${token}`, {
            headers: {
              accept: "application/json",
            },
          });
          const data = await response.json();
          setUser(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            address: data.address,
            career: data.career,
            semester: data.semester,
            parallel: data.parallel,
            username: data.username,
            phone: data.phone,
            description: data.description,
            // image: data.image
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Phone number must be exactly 10 digits";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.career) newErrors.career = "Career is required";
    if (!formData.parallel) newErrors.parallel = "Parallel is required";
    else if (formData.parallel.length > 10) newErrors.parallel = "Parallel must be less than 10 characters";
    if (!formData.description) newErrors.description = "Description is required";
    else if (formData.description.length > 250) newErrors.description = "Description must be less than 250 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === "parallel") {
      if (value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "description") {
      if (value.length <= 250) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData({ ...formData, image: file });
  //   }
  // };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('semester', formData.semester);
      formDataToSend.append('career', formData.career);
      formDataToSend.append('parallel', formData.parallel);
      formDataToSend.append('description', formData.description);
      // if (formData.image) {
      //   formDataToSend.append('image', formData.image);
      // }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_UPDATE_PROFILE}/${userId}?token=${token}`, {
          method: 'PATCH',
          headers: {
            accept: "*/*",
          },
          body: formDataToSend,
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          setIsModalOpen(false);
          window.location.reload(); // Recargar la página
        } else {
          console.error("Error updating user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DELETE_PROFILE}/${userId}?token=${token}`, {
          method: 'DELETE',
          headers: {
            accept: "*/*",
          },
        });

        if (response.ok) {
          localStorage.clear();
          window.location.reload(); // Recargar la página
        } else {
          console.error("Error deleting user data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="relative block h-[50vh]">
        <div className="bg-profile-background absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center scale-105" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <section className="relative bg-white py-16">
        <div className="relative mb-6 -mt-40 flex w-full px-4 min-w-0 flex-col break-words bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between pb-8">
              <div className="relative flex gap-6 items-start">
                <div className="-mt-20 w-40">
                  <Avatar
                    src="/img/team-5.png"
                    alt="Profile picture"
                    variant="circular"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <Typography variant="h4" color="blue-gray">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="paragraph" color="gray" className="!mt-0 font-normal">{user.email}</Typography>
                </div>
              </div>

              <div className="mt-10 mb-10 flex lg:flex-row justify-between items-center lg:justify-end lg:mb-0 lg:px-4 flex-wrap lg:-mt-5">
                <button
                  className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Profile
                </button>
              </div>
            </div>
            <div className="-mt-4 container space-y-2">
              <div className="flex items-center gap-2">
                <MapPinIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  {user.address}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  {user.career}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <BuildingLibraryIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  {user.semester} - {user.parallel}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <UserCircleIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  {user.username}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="-mt-px h-4 w-4 text-blue-gray-500" />
                <Typography className="font-medium text-blue-gray-500">
                  {user.phone}
                </Typography>
              </div>
            </div>
            <div className="mb-10 py-6">
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <Typography className="mb-6 font-normal text-blue-gray-500">
                  {user.description}
                </Typography>
                {/* <Button variant="text">Show more</Button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={isModalOpen} handler={setIsModalOpen}>
        <DialogHeader>Editar Perfil</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={!!errors.firstName} />
            {errors.firstName && <Typography variant="small" color="red">{errors.firstName}</Typography>}
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={!!errors.lastName} />
            {errors.lastName && <Typography variant="small" color="red">{errors.lastName}</Typography>}
            <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} />
            {errors.email && <Typography variant="small" color="red">{errors.email}</Typography>}
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} error={!!errors.address} />
            {errors.address && <Typography variant="small" color="red">{errors.address}</Typography>}
            <Select
              label="Career"
              name="career"
              value={formData.career}
              onChange={(value) => setFormData({ ...formData, career: value })}
              error={!!errors.career}
            >
              <Option value="Ingeniería de Sistemas">Ingeniería de Sistemas</Option>
              <Option value="Ingeniería Civil">Ingeniería Civil</Option>
              <Option value="Medicina">Medicina</Option>
              <Option value="Derecho">Derecho</Option>
              <Option value="Arquitectura">Arquitectura</Option>
            </Select>
            {errors.career && <Typography variant="small" color="red">{errors.career}</Typography>}
            <Select
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={(value) => setFormData({ ...formData, semester: value })}
              error={!!errors.semester}
            >
              {[...Array(11).keys()].map((num) => (
                <Option key={num} value={num.toString()}>
                  {num}
                </Option>
              ))}
            </Select>
            {errors.semester && <Typography variant="small" color="red">{errors.semester}</Typography>}
            <Input label="Parallel" name="parallel" value={formData.parallel} onChange={handleInputChange} error={!!errors.parallel} />
            {errors.parallel && <Typography variant="small" color="red">{errors.parallel}</Typography>}
            <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} error={!!errors.username} />
            {errors.username && <Typography variant="small" color="red">{errors.username}</Typography>}
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} error={!!errors.phone} />
            {errors.phone && <Typography variant="small" color="red">{errors.phone}</Typography>}
            <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} error={!!errors.description} />
            {errors.description && <Typography variant="small" color="red">{errors.description}</Typography>}
            {/* <Input type="file" label="Profile Image" name="image" onChange={handleImageChange} /> */}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={isDeleteModalOpen} handler={setIsDeleteModalOpen}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody divider>
          <Typography>Are you sure you want to delete your profile?</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteProfile} disabled={isDeleting}>
            {isDeleting ? <Spinner className="h-4 w-4" /> : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Profile;