import React, { useEffect, useState } from "react";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contractAbi, contractAddress } from "@/config/Contract";

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

const EditPackage = ({ id }: { id: number }) => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPackages",
    args: [id],
  });

  const packageDetails = (data as PackageDetails) || [];

  const [formData, setFormData] = useState({
    packageName: "",
    platforms: "",
    description: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    if (packageDetails) {
      setFormData({
        packageName: packageDetails.name,
        platforms: packageDetails.platform,
        description: packageDetails.description,
        duration: packageDetails.duration?.toString(),
        price: (packageDetails.price / 10 ** 18)?.toString(),
      });
    }
  }, [packageDetails]);

  async function edit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "editPackage",
        args: [
          BigInt(id),
          formData.packageName,
          formData.platforms,
          formData.description,
          BigInt(Number(formData.duration)),
          BigInt(Math.floor(Number(formData.price) * 10 ** 18)),
        ],
      });

      if (hash) {
        console.log(hash);
        toast("successfully edited package");
        router.push("/dashboard");
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to edit package, try again.");
      return;
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Edit Package</h2>
      <form onSubmit={edit}>
        <div className="mb-4">
          <label htmlFor="packageName" className="block text-gray-700 text-sm font-bold mb-2">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            name="packageName"
            value={formData.packageName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="platforms" className="block text-gray-700 text-sm font-bold mb-2">
            Platforms
          </label>
          <input
            type="text"
            id="platforms"
            name="platforms"
            value={formData.platforms}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a description of your package..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Price (in cUSD)
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
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
  );
};

export default EditPackage;
