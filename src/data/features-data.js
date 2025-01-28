import {
LockClosedIcon,CloudIcon,CubeTransparentIcon 
} from "@heroicons/react/24/solid";

export const featuresData = [
  {
    color: "gray",
    title: "Microservices",
    icon: CubeTransparentIcon,
    description:
      "Microservices are an architecture where an application is built as a collection of small, independent services that communicate through APIs, each focusing on a specific task."
     },
  {
    color: "gray",
    title: "DevOps",
    icon: LockClosedIcon,
    description:
      "DevOps is a set of practices that combine development and operations to automate and streamline the software development lifecycle, improving collaboration, efficiency, and continuous delivery.",
  },
  {
    color: "gray",
    title: "Cloud",
    icon: CloudIcon,
    description:
      "Cloud refers to the delivery of computing services (like storage, processing, and software) over the internet, allowing for scalable, on-demand access without the need for local infrastructure.",
  },
];

export default featuresData;
