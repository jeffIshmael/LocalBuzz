import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractAbi } from "../config/Contract";
import Image from "next/image";

const Explore = () => {
  const { isConnected } = useAccount();
  const { data, error, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllCreators",
    args: [],
  });
  const [isClient, setIsClient] = useState(false);

  interface Creator {
    bio: string;
    email: string;
    facebookLink: string;
    fullname: string;
    id: number;
    instagramLink: string;
    linkedinLink: string;
    packagesCreated: [];
    tiktokLink: string;
    twitterLink: string;
    username: string;
    walletAddress: string;
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
    } else {
      async () => {
        await refetch();
        console.log(data);
      };
    }
  }, [data]);

  const creators = (data as Creator[]) || [];

  return (
    <div>
      {isClient ? (
        <div>
          <Header />

          <div className="container flex justify-center mx-auto">
            <div>
              <p className="text-gray-500 text-lg text-center font-normal pb-3"></p>
              <h1 className="xl:text-4xl text-3xl text-center text-gray-800 font-extrabold pb-6 sm:w-4/6 w-5/6 mx-auto">
                Influencers available for Hire
              </h1>
            </div>
          </div>
          {creators?.length === 0 && (
            <div className="flex h-screen items-center justify-center w-full  bg-gray-100 ">
              <h1>No Available influencers.</h1>
            </div>
          )}
          {error || !isConnected ? (
            <div className="flex h-screen items-center justify-center">
              <p>
                Error fetching influencers, connect wallet if not connected and
                try again.
              </p>
            </div>
          ) : null}
          <div className="w-full bg-gray-100 px-10 pt-10">
            {creators?.map((creator: Creator, index: number) => (
              <Link href={`/creatorDetails/${index}`} key={index}>
                <div key={index} className="container mx-auto ">
                  <div
                    role="list"
                    aria-label="Behind the scenes People "
                    className="lg:flex md:flex sm:flex items-center xl:justify-between flex-wrap md:justify-around sm:justify-around lg:justify-around"
                  >
                    <div
                      role="listitem"
                      className="xl:w-1/3 sm:w-3/4 md:w-2/5 relative mt-16 mb-32 sm:mb-24 xl:max-w-sm lg:w-2/5"
                    >
                      <div className="rounded overflow-hidden shadow-md bg-white">
                        <div className="absolute -mt-20 w-full flex justify-center">
                          <div className="h-32 w-32">
                            <Image
                              src={`https://ipfs.io/ipfs/QmXyFKsktSW3iR66rAi8vwAeF6xnWLB8LFvWNN9rtwRmTV/${Number(
                                creator.id
                              ).toString()}.jpg`}
                              alt="Display Picture of Andres Berlin"
                              width={250}
                              height={250}
                              role="img"
                              className="rounded-full object-cover h-full w-full shadow-md"
                            />
                          </div>
                        </div>
                        <div className="px-6 mt-16">
                          <h1 className="font-bold text-3xl text-center mb-1">
                            {creator.username}
                          </h1>
                          <p className="text-gray-800 text-sm text-center">
                            TikTok Influencer
                          </p>
                          <p className="text-center text-gray-600 text-base pt-3 font-normal">
                            {creator.bio}
                          </p>
                          <div className="w-full flex justify-center pt-5 pb-5">
                            <Link
                              href={`${creator.tiktokLink}`}
                              className="mx-5"
                            >
                              <div aria-label="Tiktok" role="img">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#718096"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-tiktok"
                                >
                                  <path d="M12 2v3.25a7 7 0 0 0 4.906 6.717 7.5 7.5 0 1 1-6.906-6.406V9a4.5 4.5 0 1 0 3 4.065V2h-1z" />
                                </svg>
                              </div>
                            </Link>
                            <Link
                              href={`${creator.twitterLink}`}
                              className="mx-5"
                            >
                              <div aria-label="Twitter" role="img">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#718096"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-twitter"
                                >
                                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                              </div>
                            </Link>
                            <Link
                              href={`${creator.instagramLink}`}
                              className="mx-5"
                            >
                              <div aria-label="Instagram" role="img">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#718096"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-instagram"
                                >
                                  <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                  ></rect>
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                  <line
                                    x1="17.5"
                                    y1="6.5"
                                    x2="17.51"
                                    y2="6.5"
                                  ></line>
                                </svg>
                              </div>
                            </Link>
                          </div>
                          <Link href={`/creatorDetails/${index}`} key={index}>
                            <div className="border-2 border-orange-500 text-center rounded-lg px-3 py-2 text-yellow-400 cursor-pointer hover:bg-orange-500 hover:text-yellow-200">
                              view profile
                            </div>
                          </Link>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Footer />
        </div>
      ) : null}{" "}
    </div>
  );
};

export default Explore;
