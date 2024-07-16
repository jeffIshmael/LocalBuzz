import React, { useState } from "react";
import { contractAddress, contractAbi } from "../config/Contract";
import { useWriteContract, useAccount, useConnect } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/Header";

const SignUpAsCreator = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { writeContractAsync, error } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "registerContentCreator",
        args: [
          data.fullname as string,
          data.username as string,
          data.bio as string,
          data.instagramLink as string,
          data.facebookLink as string,
          data.youtubeLink as string,
          data.twitterLink as string,
          data.tiktokLink as string,
          data.email as string,
        ],
      });
      if (hash) {
        console.log(hash);
        toast("successfully signed up");
        router.push("/dashboard");
      }
    } catch (e) {
      if (error) {
        if (error.message) {
          toast("You are already registered.");
        }
        toast("Failed to sign up");
        return;
      }

      toast("Failed to sign up");
    }
  }

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center mt-2">
        <div
          style={{
            width: "90%",
            maxWidth: "600px",
            padding: "20px",
            border: "2px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h1 className="text-center text-2xl font-bold">
            Sign Up as Influencer
          </h1>
          <form onSubmit={submit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="fullname"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
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
                name="username"
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
                htmlFor="bio"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
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
                htmlFor="instagramLink"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Instagram Link
              </label>
              <input
                type="url"
                id="instagramLink"
                name="instagramLink"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="facebookLink"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Facebook Link
              </label>
              <input
                type="url"
                id="facebookLink"
                name="facebookLink"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="youtubeLink"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Youtube Link
              </label>
              <input
                type="url"
                id="youtubeLink"
                name="youtubeLink"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="twitterLink"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Twitter Link
              </label>
              <input
                type="url"
                id="twitterLink"
                name="twitterLink"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="tiktokLink"
                style={{ display: "block", marginBottom: "5px" }}
              >
                TikTok Link
              </label>
              <input
                type="url"
                id="tiktokLink"
                name="tiktokLink"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
                className="bg-gray-300 rounded-md"
              />
            </div>
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
                name="email"
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
