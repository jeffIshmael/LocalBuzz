import React, { useState } from "react";
// import {CONTRACT_ADDRESS} from "../"
import { contractAddress, contractAbi } from "../config/Contract";
import { useWriteContract, useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/Header";

const SignUpAsCreator = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { isConnected } = useAccount();
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect wallet");
      console.log("Please connect wallet");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerClient",
        args: [data.username as string, data.email as string],
      });
      if (hash) {
        console.log(hash);
        toast("successfully signed up");
        router.push("/");
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to sign you up, try again.");
      return;
    }
  }

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "20px",
            border: "2px solid #ddd",
            borderRadius: "8px",
          }}
          className="mb-4"
        >
          <h1 className="text-center text-2xl font-bold">Sign Up as Client</h1>
          <form onSubmit={submit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="username"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpAsCreator;
