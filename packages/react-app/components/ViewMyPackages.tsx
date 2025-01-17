import React, { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { contractAddress, contractAbi } from "@/config/Contract";
import Link from "next/link";
import { toast } from "sonner";

const ViewMyPackages = () => {
  const { address } = useAccount();
  const {writeContractAsync , error} = useWriteContract();
  const { data: packsId } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getCreatorPackages",
    args: [address],
  });

  const packageIds = (packsId as PackageId[]) || [];

  console.log(packageIds);
  interface PackageId {
    id: number;
  }

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackages",
    args: [packageIds],
  });

  console.log(data);

  const packageDetails = (data as PackageDetails[]) || [];

  interface PackageDetails {
    platform: string;
    buyers: [];
    creator: string;
    description: string;
    duration: number;
    id: number;
    name: string;
    price: number;
  }


  useEffect(() => {
    if (!packageDetails) {
      async () => {
        await refetch();
        console.log(packageDetails);
      };
    }
    console.log(packageDetails);
  }, [packageDetails]);

  const handleDelete = async (id: number) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "deletePackage",
        args: [id],
      });
      if (hash) {
        toast(`successfully deleted ${packageDetails[id].name}`);
        
      }
    } catch (e) {
      if (error) {
        if (error.message) {
          toast("only the creator can delete.");
        }
        toast("Failed to delete.");
        return;
      }

      toast("Failed to delete.");
    }
  };

  console.log(packageIds);

  return (
    <>
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 mt-2 ml-2">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  Your Packages
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link href={"/createPackage"}>
                  <button
                    className="bg-orange-500 text-white active:bg-orange-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Add new package
                  </button>
                </Link>
              </div>
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
                    Price
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Desription
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {packageIds?.length === 0 ? (
                  <>
                    <tr className="flex items-center justify-center">
                      <h1>You have no packages</h1>
                    </tr>{" "}
                  </>
                ) : (
                  packageDetails?.map(
                    (packageDetail: PackageDetails, index: number) => (
                      <tr key={index}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                          {packageDetail.name}
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                          {Number(packageDetail.price) / 10 ** 18} cUSD
                        </td>
                        <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {packageDetail.description}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="inline-flex items-center rounded-md shadow-sm">
                            <button className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
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
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </span>
                              <span>Edit</span>
                            </button>
                            <button onClick={() => handleDelete(packageDetail.id)} className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
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
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMyPackages;
