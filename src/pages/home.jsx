import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export function Home() {
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Our Proyect.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-70 text-sm sm:text-base md:text-lg lg:text-xl">
                The educational platform, developed for a Distributed Programming
                course, consists of 20 AWS-deployed microservices using REST API, GraphQL,
                WebSocket, WebHook, and RPC. It integrates four types of databases, runs on
                three operating systems, and uses at least four backend languages. Security
                includes JWT, encryption, and CORS. The system follows DevOps best practices,
                featuring a load balancer, auto-scaling, API Gateway, and event-driven architecture
                with AWS SNS, SQS, or Kinesis. It adheres to SOLID, KISS, DRY, and YAGNI principles,
                with monitoring via Grafana, Prometheus, and Kibana.
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold text-2xl sm:text-3xl"
                color="blue-gray"
              >
                The architecture
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500 text-sm sm:text-base">
                Our application uses cloud infrastructure, deploying containers across multiple
                regions and availability zones for resilience. Each microservice has its own database,
                ensuring high availability, scalability, and fault isolation.
                <br></br>
                <br></br>
                We also implement replication and disaster recovery mechanisms to minimize
                failure impact and ensure continuous service. This enhances reliability and
                allows the app to function during disruptions.
              </Typography>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src="/img/teamwork.png"
                    className="h-full w-full"
                  />
                </CardHeader>
                <CardBody>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold text-xl"
                  >
                    AWS Architecture
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500 text-sm sm:text-base">
                    We use AWS for its reliable, scalable, and secure infrastructure,
                    enabling resilient deployment, independent scaling, and integrated
                    security with minimal downtime.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pt-10 pb-10">
        <div className="container mx-auto">
          <PageTitle section="Our Team" heading="Meet the Team">
            
          </PageTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 gap-x-12 md:grid-cols-2 xl:grid-cols-2">
            {teamData.map(({ img, name, position, socials }) => (
              <TeamCard
                key={name}
                img={img}
                name={name}
                position={position}
                socials={
                  <div className="flex items-center gap-2">
                    {socials.map(({ color, name, link }) => (
                      <IconButton
                        key={name}
                        color={color}
                        variant="text"
                        onClick={() => window.open(link, "_blank")}
                      >
                        <i className={`fa-brands text-xl fa-${name}`} />
                      </IconButton>
                    ))}
                  </div>
                }
              />
            ))}
          </div>

          <PageTitle heading="Our microservices">
          Each of our microservices has its own Redis and MongoDB database, deployed in the cloud on EC2 instances. Additionally, each microservice is independently containerized, ensuring high availability, scalability, fault isolation, and efficient resource management.
          </PageTitle>
          <div className="mt-12">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
            >
              {['/img/WhatsApp Image 2025-02-13 at 6.35.51 PM.jpeg', '/img/WhatsApp Image 2025-02-13 at 6.36.02 PM.jpeg', '/img/WhatsApp Image 2025-02-13 at 6.36.12 PM.jpeg','/img/WhatsApp Image 2025-02-13 at 6.36.21 PM.jpeg','/img/WhatsApp Image 2025-02-13 at 6.36.29 PM.jpeg','/img/WhatsApp Image 2025-02-13 at 6.36.38 PM.jpeg','/img/WhatsApp Image 2025-02-13 at 6.36.47 PM.jpeg','/img/WhatsApp Image 2025-02-13 at 6.36.57 PM.jpeg'].map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center items-center h-75">
                    <img src={src} alt={`Architecture ${index + 1}`} className="object-contain h-full" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="px-4 pt-10 pb-10 bg-gray-100">
        <div className="container mx-auto text-center">
          <PageTitle heading="Production Architecture Overview">
            Here is an overview of our entire production architecture.
          </PageTitle>
          <div className="mt-12 flex justify-center">
            <img src='img/Main Enviroment.png' alt="Architecture Overview" className="w-full h-auto max-w-4xl" />
          </div>
        </div>
      </section> <section className="px-4 pt-10 pb-10 bg-gray-100">
        <div className="container mx-auto text-center">
          <PageTitle heading="QA Architecture Overview">
            Here is an overview of our QA entire architecture.
          </PageTitle>
          <div className="mt-12 flex justify-center">
            <img src='/img/qa enviroment.png' alt="Architecture Overview" className="w-full h-auto max-w-4xl" />
          </div>
        </div>
      </section>
      <section className="relative bg-white py-12 px-4">
        <div className="container mx-auto">
          <PageTitle section="DevOps" heading="Our Enviroments">
          We currently have approximately 50 instances running on AWS, evenly distributed between QA and production (25 each), seamlessly communicating via Kafka. We leverage GitHub Actions for CI/CD, enabling automated, efficient, and reliable deployment workflows.
          </PageTitle>
          <div className="mx-auto mt-20 mb-20 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500 text-sm sm:text-base">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
