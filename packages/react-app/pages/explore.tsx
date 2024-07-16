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
                            <div className="flex justify-center items-center">
                              <Link href={`${creator.tiktokLink}`}>
                                <div className="relative">
                                  <div className="flex items-center justify-center w-15 h-15 mx-2 overflow-hidden">
                                    <img src="/static/images/tiktok.png" width={80} height={80}/>
                                  </div>
                                  <div>
                                    <p className="flex justify-center font-bold tracking-wide ...">
                                      10K
                                    </p>
                                  </div>
                                </div>
                              </Link>

                              <Link href={`${creator.instagramLink}`}>
                                <div className="relative">
                                  <div className="flex items-center justify-center w-15 h-15 mx-2 overflow-hidden ">
                                    <img src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-tumb.png" width={120} height={120}/>
                                  </div>
                                  <div>
                                    <p className="flex justify-center font-bold tracking-wide ...">
                                      170.9K
                                    </p>
                                  </div>
                                </div>
                              </Link>

                              <Link href={`${creator.linkedinLink}`}>
                                <div className="relative">
                                  <div className="flex items-center justify-center w-15 h-15 mx-2 overflow-hidden ">
                                    <img src="/static/images/youtube.png" width={100} height={100} />
                                  </div>
                                  <div>
                                    <p className="flex justify-center font-bold tracking-wide ...">
                                      7.2K
                                    </p>
                                  </div>
                                </div>
                              </Link>

                              <Link href={`${creator.twitterLink}`}>
                                <div className="relative">
                                  <div className="flex items-center justify-center w-15 h-15 mx-2 overflow-hidden">
                                    <img src="/static/images/twitter-x-logo-42562.png" width={70} height={70} />
                                  </div>
                                  <div>
                                    <p className="flex justify-center font-bold tracking-wide ...">
                                      34.8K
                                    </p>
                                  </div>
                                </div>
                              </Link>
                              <Link href={`${creator.facebookLink}`}>
                                <div className="relative">
                                  <div className="flex items-center justify-center w-15 h-15 mx-2 overflow-hidden  ">
                                    <img src="/static/images/facebook.png" width={70} height={70}/>
                                  </div>
                                  <div>
                                    <p className="flex justify-center font-bold tracking-wide ...">
                                      100K
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </div>
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
