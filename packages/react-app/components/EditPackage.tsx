import React, { useEffect } from "react";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contractAbi, contractAddress } from "@/config/Contract";


const EditPackage = (id: number  ) => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackages",
    args: [id],
  });

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


  async function edit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "editPackage",
        args: [
          BigInt(id), 
          data.packageName as string,
          data.platforms as string,
          data.description as string,
          BigInt(Number(data.duration)),
          BigInt(Math.floor(Number(data.price) * 10 ** 18)),
          
        ],
      });
      if (hash) {
        console.log(hash);
        toast("successfully created");
        router.push("/dashboard");
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to create package, try again.");
      return;
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Edit Package</h2>
        <form onSubmit={edit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Package Name
            </label>
            <input
              type="text"
              id="name"
              name="packageName"
              placeholder="Package Name"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="mb-4">
          <label
              htmlFor="platforms"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Platforms
            </label>
            <input
              type="text"
              id="Platform"
              name="platforms"
              placeholder="Platforms"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Add a description of your package..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            ></textarea>
          </div>
          <div className="mb-4">
          <label
              htmlFor="duration"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="duration in (hrs)"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price(in cUSD)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="price in cUSD"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
            />
          </div>
          
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:shadow-outline-orange"
          >
            Edit Package
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPackage;
