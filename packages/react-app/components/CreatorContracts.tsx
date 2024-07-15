import React, { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress, contractAbi } from "@/config/Contract";

const CreatorContracts = () => {
  const { address } = useAccount();
  const { data } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getClient",
    args: [address],
  });

  console.log(data);
  interface Client {
    id: number;
    username: string;
    email: string;
    walletAddress: string;
    purchasedIds: [];
  }

  interface PackageDetails {
    buyers: string[];
    creator: string;
    description: string;
    duration: number;
    id: number;
    name: string;
    platform: string;
    price: number;
  }

  interface PackageId {
    id: number;
  }
  const clientdata = (data as Client) || {};
  const clientPurchasedIds = clientdata.purchasedIds || [];

  const myPurchasedIds = (clientPurchasedIds as PackageId[]) || [];
  console.log(myPurchasedIds);

  const { data: purchaseData, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackages",
    args: [myPurchasedIds],
  });

  const PurchasedPackages = (purchaseData as PackageDetails[]) || [];


  useEffect(() => {
    if (!PurchasedPackages) {
      refetch();
      console.log(PurchasedPackages);
    }
    console.log(PurchasedPackages);
  }, [PurchasedPackages]);

  console.log(PurchasedPackages);

  return (
    <div>
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0   mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  Your Contracts
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right"></div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
              
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Package name
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Description
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Amnt
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"></th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {PurchasedPackages?.map(
                  (PurchasedPackage: PackageDetails, index: number) => (
                    <tr key={index}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {PurchasedPackage.name}
                      </th>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {PurchasedPackage.description}
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {Number(PurchasedPackage.price) / 10 ** 18} cUSD
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4"></td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="inline-flex items-center rounded-md shadow-sm">
                          <button className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border-y border-slate-200 font-medium px-4 py-2 inline-flex space-x-1 items-center">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </span>
                            <span>view</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorContracts;
