import { useRouter } from "next/router";
import { contractAddress, contractAbi } from "@/config/Contract";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import Header from "@/components/Header";
import { useEffect } from "react";
import { toast } from "sonner";
import { processCheckout } from "@/config/TokenFunction";
import Link from "next/link";

export default function CreatorDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: creatorData } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getCreator",
    args: [id],
  });

  console.log(creatorData);

  const creator = (creatorData as Creator) || {};

  interface Creator {
    bio: string;
    email: string;
    facebookLink: string;
    fullname: string;
    id: number;
    instagramLink: string;
    linkedinLink: string;
    packagesCreated: number[];
    tiktokLink: string;
    twitterLink: string;
    username: string;
    walletAddress: string;
  }

  interface PackageDetails {
    id: number;
    name: string;
    price: number;
    description: string;
    duration: number;
    platform: string;
  }

  interface PackageId {
    id: number;
  }

  const creatorAddress = creator.walletAddress as `0x${string}`;
  const address = creator.walletAddress;

  const { data: packageIdsdata } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getCreatorPackages",
    args: [address],
    // enabled: false, // disable automatic fetching
  });

  const packageIds = (packageIdsdata as PackageId[]) || [];

  console.log(packageIds);

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackages",
    args: [packageIds],
  });

  const packdetails = (data as PackageDetails[]) || [];

  console.log(packdetails);

  useEffect(() => {
    if (packdetails) {
      console.log(packdetails);
    }
  }, [packdetails]);

  async function Purchase(id: number, amount: number) {
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }

    try {
      const isCheckoutProcessed = await processCheckout(Number(amount));

      if (isCheckoutProcessed) {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractAbi,
          functionName: "purchasePackage",
          args: [BigInt(Number(id))],
        });

        if (hash) {
          toast.success("Purchase successful");
        }
      } else {
        toast.error("Purchase failed");
      }
    } catch (error) {
      toast.error("Purchase failed");
    }
  }

  return (
    <div>
      <div className="">
        <Header />
      </div>
      <div className="p-8 bg-white shadow mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400">Campaigns participated</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">10</p>
              <p className="text-gray-400">Offers</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400">Open contracts</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-orange-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              {" "}
              Connect
            </button>
            <Link href={`mailto:${creator?.email}`}>
              <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                {" "}
                Message
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {creator?.username}{" "}
            <span className="font-light text-gray-500">27</span>
          </h1>
          <p className="font-light text-gray-600 mt-3">Nairobi, Kenya</p>
          <p className="mt-8 text-gray-500">TikTok Influencer</p>
          <p className="mt-2 text-gray-500"></p>
        </div>
        <br></br>
        <div className="flex justify-center items-center">
          <Link href={`${creator?.tiktokLink}`}>
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 mx-2 overflow-hidden ">
                <img src="/static/images/tiktok.png" width={50} height={50} />
              </div>
              <div>
                <p className="flex justify-center font-bold tracking-wide ...">
                  10K
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${creator?.instagramLink}`}>
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 mx-2 overflow-hidden ">
                <img src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-tumb.png" />
              </div>
              <div>
                <p className="flex justify-center font-bold tracking-wide ...">
                  170.9K
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${creator?.linkedinLink}`}>
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 mx-2 overflow-hidden ">
                <img
                  src="/static/images/youtube.png"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p className="flex justify-center font-bold tracking-wide ...">
                  7.2K
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${creator?.twitterLink}`}>
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 mx-2 overflow-hidden ">
                <img
                  src="/static/images/twitter-x-logo-42562.png"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <p className="flex justify-center font-bold tracking-wide ...">
                  34.8K
                </p>
              </div>
            </div>
          </Link>

          <Link href={`${creator?.facebookLink}`}>
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 mx-2 overflow-hidden ">
                <img src="/static/images/facebook.png" width={50} height={50} />
              </div>
              <div>
                <p className="flex justify-center font-bold tracking-wide ...">
                  100K
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">
            {creator?.bio}
          </p>
          <div>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
                {packageIds?.length === 0 ? (
                  <h1 className="text-black text-center font-medium lg:px-16">
                    No Packages yet
                  </h1>
                ) : (
                  packdetails?.map(
                    (packdetail: PackageDetails, index: number) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-orange-600 p-6 shadow-sm ring-1 ring-orange-600 sm:order-last sm:px-8 lg:p-12"
                      >
                        <div className="text-center">
                          <h2 className="text-lg font-medium text-gray-900">
                            <span className="sr-only"></span>
                          </h2>

                          <p className="mt-2 sm:mt-4">
                            <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                              {" "}
                              {Number(packdetail.price) / 10 ** 18}{" "}
                            </strong>

                            <span className="text-base font-medium text-gray-700">
                              cUSD{" "}
                            </span>
                          </p>
                        </div>

                        <h1 className="text-center text-lg font-normal mt-2">
                          {packdetail.name}
                        </h1>

                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 text-orange-700"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>

                            <span className="text-gray-700">
                              {" "}
                              {packdetail.description}{" "}
                            </span>
                          </li>

                          <li className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 text-orange-700"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>

                            <span className="text-gray-700">
                              {packdetail.platform}
                            </span>
                          </li>

                          <li className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-5 text-orange-700"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>

                            <span className="text-gray-700">
                              {Number(packdetail.duration)} hours
                            </span>
                          </li>
                        </ul>
                        <button
                          onClick={() =>
                            Purchase(packdetail.id, packdetail.price)
                          }
                          className="mt-8 block rounded-full border border-orange-600 bg-orange-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-orange-700 hover:ring-1 hover:ring-orange-700 focus:outline-none focus:ring active:text-orange-500"
                        >
                          Pay
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
