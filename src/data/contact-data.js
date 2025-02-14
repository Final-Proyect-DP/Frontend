import {
  ArchiveBoxIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpCircleIcon,
  BriefcaseIcon,
  ChartBarIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

export const contactData = [
  {
    title: "GitHub Actions",
    icon: ArrowPathRoundedSquareIcon,
    description:
      "We use GitHub Actions to automate the deployment of our applications through CI/CD and manage secrets.",
  },
  {
    title: "Docker Hub",
    icon: ArchiveBoxIcon,
    description:
      "We use Docker Hub to store our Docker images and use them in our applications.",
  },
  {
    title: "AWS EC2",
    icon: ArrowUpCircleIcon,
    description:
      "we use AWS EC2 to deploy our applications and manage the infrastructure.",
  },
];

export default contactData;
