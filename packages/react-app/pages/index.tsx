import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className="bg-white font-sans flex flex-col  items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 pt-12 lg:pt-0">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div className="">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                    <p className="sm:block">LocalBuzz</p>
                    <span className="text-zinc-500  md:block">
                      Hire local influencers
                    </span>
                    <p className="text-orange-600 md:block">in one click</p>
                  </h1>
                </div>
                <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                  <Link href={"/signupcreator"}>
                    <button className="inline-flex items-center text-white bg-orange-500 hover:bg-orange-300 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto">
                      Get hired
                    </button>
                  </Link>
                  <Link href={"/signupclient"}>
                    <button className="inline-flex hover:ring-gray-400 hover:bg-gray-200 bg-gray-100 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                      Hire influencers
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-16 ml-6 sm:mt-24 lg:mt-0 lg:col-span-5">
              <div className="mt-12 ml-8">
                <div className="grid grid-cols-3 gap-6 sm:gap-6 xl:gap-8">
                  <div className="text-center sm:flex sm:items-center sm:justify-center">
                    <div className="sm:flex-shrink-0">
                      <div className="flow-root">
                        <div className="border w-fit transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium leading-5 text-orange-600 bg-orange-100 rounded-full">
                          Active Influencers
                        </div>
                        <p className="text-4xl font-bold text-gray-900">16K+</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:flex sm:items-center sm:justify-center">
                    <div className="sm:flex-shrink-0">
                      <div className="flow-root">
                        <div className="border w-fit transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium leading-5 text-orange-600 bg-orange-100 rounded-full">
                          Clients
                        </div>
                        <p className="text-4xl font-bold ml-4 text-gray-900">
                          28K+
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:flex sm:items-center sm:justify-center">
                    <div className="sm:flex-shrink-0">
                      <div className="flow-root">
                        <div className="border w-fit transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium leading-5 text-orange-600 bg-orange-100 rounded-full">
                          Brands
                        </div>
                        <p className="text-4xl font-bold ml-4 text-gray-900">
                          18+
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex justify-center space-x-3">
                <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <img
                    className="aspect-square h-full w-full"
                    alt="User 1"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;width=40"
                  />
                </span>
                <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <img
                    className="aspect-square h-full w-full"
                    alt="User 2"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;width=40"
                  />
                </span>
                <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <img
                    className="aspect-square h-full w-full"
                    alt="User 3"
                    src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;width=40"
                  />
                </span>
                <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <img
                    className="aspect-square h-full w-full"
                    alt="User 4"
                    src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;width=40"
                  />
                </span>
                <img
                  className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full"
                  src="https://images.unsplash.com/photo-1527718641255-324f8e2d0421?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="5"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5%">
          {/* <!-- component --> */}

          <div className="container flex flex-col justify-center mt-2 p-4 mx-auto md:p-8">
            <Link
              className="inline-flex px-1 py-1 gap-x-2 rounded-xl w-fit border-gray-400 border-2 hover:border-orange-500 items-center text-sm font-semibold text-gray-600 space-x-1"
              href="/explore"
            >
              <span className="bg-orange-100 flex items-center justify-center gap-2 text-orange-800 text-sm font-semibold px-2.5 py-0.5 rounded-lg dark:bg-blue-900 dark:text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-orange-400"
                >
                  <path d="m3 11 18-5v12L3 14v-3z"></path>
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                </svg>
              </span>
              <span>View Influencers</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <p className="p-2 text-sm font-medium tracking-wider text-center uppercase"></p>
            <h2 className="mt-4 mb-1 text-4xl font-bold leading-none text-center sm:text-5xl">
              About Us
            </h2>
            <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 dark:divide-gray-300">
              <h3 className="py-2 outline-none cursor-pointer focus:underline">
                `&quot;`LocalBuzz connects businesses with influential voices in
                their community, empowering brands to reach their audience
                authentically. Our platform offers a curated selection of local
                influencers, ensuring targeted and impactful collaborations.
                Join us to amplify your message and engage with your community
                like never before.`&quot;`
              </h3>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
