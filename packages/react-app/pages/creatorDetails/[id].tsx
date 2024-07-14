import { useRouter } from "next/router";
import { contractAddress, contractAbi } from "@/config/Contract";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatorDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { isConnected } = useAccount();

  const { data: creatorData } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getCreator",
    args: [id],
  });

  const { writeContractAsync } = useWriteContract();

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
    packageId: bigint;
    name: string;
    price: bigint;
    description: string;
    duration: number;
    platform: string;
  }

  const [packdetails, setPackdetails] = useState<PackageDetails | null>(null);
  const address = creator.walletAddress;

  const { data: packageIds, refetch: refetchPackageIds } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getCreatorPackages",
    args: [address],
    // enabled: false, // disable automatic fetching
  });

  useEffect(() => {
    if (address) {
      refetchPackageIds();
    }
  }, [address, refetchPackageIds]);

  const createdPackages = (packageIds as { id: number }[]) || [];
  const packageId = createdPackages[0]?.id || 0;

  const { refetch: refetchPackageDetails } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackage",
    args: [BigInt(packageId)],
     // disable automatic fetching
  });

  useEffect(() => {
    const fetchPackages = async () => {
      if (createdPackages.length === 0) return;
      

      // const packageId = createdPackages[0].id; // Assuming you want the first package

      const { data } = await refetchPackageDetails(
        // {options: { args: [BigInt(packageId)] },
        // enabled: false,
      // }
    );

      setPackdetails(data as PackageDetails);
    };

    fetchPackages();
  }, [createdPackages, refetchPackageDetails]);

  async function Purchase() {
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }

    if (!packdetails) {
      toast.error("Package details not available");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "purchasePackage",
        args: [packdetails.packageId],
      });

      if (hash) {
        toast.success("Successfully purchased");
      }
    } catch (e: any) {
      toast.error("Failed to purchase, try again.");
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
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              {" "}
              Message
            </button>
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
        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">
            {creator?.bio}
          </p>
          <div>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
                {createdPackages.length === 0 ? (
                  <h1 className="text-black text-center font-medium lg:px-16">
                    No Packages yet
                  </h1>
                ) : (
                  <div className="rounded-2xl border border-orange-600 p-6 shadow-sm ring-1 ring-orange-600 sm:order-last sm:px-8 lg:p-12">
                    <div className="text-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        <span className="sr-only"></span>
                      </h2>

                      <p className="mt-2 sm:mt-4">
                        <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                          {" "}
                          {packdetails ? Number(packdetails.price) : 0}{" "}
                        </strong>

                        <span className="text-base font-medium text-gray-700">cUSD </span>
                      </p>
                    </div>

                    <h1 className="text-center text-lg font-normal mt-2">{packdetails?.name}</h1>

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
                          {packdetails?.description}{" "}
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
                          {packdetails?.platform}
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
                          {Number(packdetails?.platform)} days
                        </span>
                      </li>
                    </ul>
                    <button
                      onClick={Purchase}
                      className="mt-8 block rounded-full border border-orange-600 bg-orange-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-orange-700 hover:ring-1 hover:ring-orange-700 focus:outline-none focus:ring active:text-orange-500"
                    >
                      Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}