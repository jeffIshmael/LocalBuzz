import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount, useReadContract, useDisconnect, useWriteContract } from "wagmi";
import { contractAddress, contractAbi } from "@/config/Contract";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Purchased from "@/components/Purchased";

const ClientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const { address , isConnected} = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const {writeContractAsync, error} = useWriteContract();
  const [activeSection, setActiveSection] = useState('section');

  const { data } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getClient",
    args: [address],
  });

  const { data: token } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const details = (data as Detail) || [];

  interface Detail {
    email: string;
    id: number;
    purchasedIds: [];
    tokenBalance: number;
    username: string;
    walletAddress: string;
  }

  console.log(details);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (sectionName:string) => {
    setActiveSection(sectionName); // Update active section on dashboard
  };

  async function Redeem() {
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }
    try {
      
  

      if (token) {
        const hash = await writeContractAsync({
          address: contractAddress,
          abi: contractAbi,
          functionName: "redeemTokens",
          args: [BigInt(Number(token))],
        });

        if (hash) {
          toast.success("Purchase successful");
        }
      } else {
        console.log(error);
        toast.error("Purcse failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Purchase failed");
    }
  }

  const LogOut = () => {
    disconnect();
    router.push("/");
  };

  console.log(token);

  // console.log(data);

  return (
    <div className="text-gray-800 font-inter">
      {/* <!--sidenav --> */}
      {isSidebarOpen && (
        <div>
          <div className="fixed left-0 top-0 w-64 h-full bg-[#f8f4f3] p-4 z-50 sidebar-menu transition-transform">
            <Link
              href="/"
              className="flex items-center pb-4 border-b border-b-gray-800"
            >
              <h2 className="font-bold text-2xl">
                Local{" "}
                <span className="bg-[#f84525] text-white px-2 rounded-md">
                  Buzz
                </span>
              </h2>
            </Link>
            <XMarkIcon
              className="block h-6 w-6 absolute top-4 md:hidden right-4 hover:cursor-pointer "
              onClick={toggleSidebar}
              aria-hidden="true"
            />
            <ul className="mt-4">
              <span className="text-gray-400 font-bold">ADMIN</span>
              <li className="mb-1 group">
                <button
                  onClick={() => handleButtonClick('section')}
                  className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <i className="ri-home-2-line mr-3 text-lg"></i>
                  <span className="text-sm">Dashboard</span>
                </button>
              </li>
              <li className={`mb-1 group ${isOpen ? "selected" : ""}`}>
                <Link
                  href="#"
                  className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md sidebar-dropdown-toggle"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <i className="bx bx-user mr-3 text-lg"></i>
                  <span className="text-sm">Contracts</span>
                  <i
                    className={`ri-arrow-right-s-line ml-auto group-[.selected]:rotate-90 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  ></i>
                </Link>
                <ul className={`pl-7 mt-2 ${isOpen ? "block" : "hidden"}`}>
                  <li className="mb-4">
                    <button
                      onClick={() => handleButtonClick('packages')}
                      className="text-gray-900 text-sm flex items-center hover:text-[#f84525] before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"
                    >
                      Open contracts
                    </button>
                  </li>
                  <li className="mb-4">
                    <button
                      onClick={() => handleButtonClick('packages')}
                      className="text-gray-900 text-sm flex items-center hover:text-[#f84525] before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"
                    >
                      All contracts
                    </button>
                  </li>
                </ul>
              </li>
              <li className="mb-1 group">
                <Link
                  href="/explore"
                  className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <i className="bx bx-archive mr-3 text-lg"></i>
                  <span className="text-sm">View influencers</span>
                </Link>
              </li>
              <li className="mb-1 group">
                <Link
                  href="#"
                  className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <i className="bx bx-bell mr-3 text-lg"></i>
                  <span className="text-sm">Notifications</span>
                  <span className=" md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-600 bg-red-200 rounded-full">
                    5
                  </span>
                </Link>
              </li>
              <li className="mb-1 group">
                <Link
                  href="#"
                  className="flex font-semibold items-center py-2 px-4 text-gray-900 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100"
                >
                  <i className="bx bx-envelope mr-3 text-lg"></i>
                  <span className="text-sm">Messages</span>
                  <span className=" md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-600 bg-green-200 rounded-full">
                    2 New
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>
        </div>
      )}
      {/* <!-- end sidenav --> */}
      <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
        {/* <!-- navbar --> */}
        <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
          <Bars3Icon
            className="block h-6 w-6 md:hidden hover:cursor-pointer"
            onClick={toggleSidebar}
            aria-hidden="true"
          />

          <ul className="ml-auto flex items-center">
           

            <li className="dropdown ml-3">
              <button
                type="button"
                className="dropdown-toggle flex items-center"
                onClick={() => setViewProfile(!viewProfile)}
              >
                <div className="flex-shrink-0 w-10 h-10 relative">
                  <div className="p-1 bg-white rounded-full focus:outline-none focus:ring">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg"
                      alt=""
                    />
                    <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
                    <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <div className="p-2 md:block text-left">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {details.username}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {details.walletAddress?.slice(0, 6)}...
                    {details.walletAddress?.slice(-3)}
                  </p>
                </div>
              </button>
              {viewProfile && (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center text-gray-600"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open menu</span>
                    <svg
                      className="w-3 h-3 fill-current"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                  </button>
                  <ul className="dropdown-menu shadow-md shadow-black/5 absolute top-0 right-0 z-30 py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                    <li>
                      <Link
                        href="#"
                        className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-[#f84525] hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-[#f84525] hover:bg-gray-50"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={LogOut}>
                        <Link
                          href="#"
                          role="menuitem"
                          className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-[#f84525] hover:bg-gray-50 cursor-pointer"
                        >
                          Log Out
                        </Link>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
        {/* <!-- end navbar -->

      <!-- Content --> */}
      {activeSection === 'section' && (<div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <h1 className="text-2xl font-semibold">
                      {Number(token) / 10 ** 18}{" "}
                      <span className="text-gray-500"> Buzz </span>{" "}
                    </h1>
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    Token balance
                  </div>
                </div>

                <div className="mt-2 ml-16">
                  <button onClick={Redeem} className="bg-green-500 hover:bg-green-400 text-white font-bold p-1 rounded">
                    Redeem
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="text-2xl font-semibold">
                      {details.purchasedIds?.length}
                    </div>
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    Open Contracts
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="text-2xl font-semibold mb-1">
                    {details.purchasedIds?.length}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    All Contracts
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
              <div className="flex justify-between mb-4 items-start">
                <div className="font-medium">Payments</div>
                
              </div>
              <div className="overflow-hidden">
                <table className="w-full min-w-[540px]">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <div className="flex items-center">
                          <Link
                            href="#"
                            className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                          >
                            Lorem Ipsum
                          </Link>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <span className="text-[13px] font-medium text-gray-400">
                          02-02-2024
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <span className="text-[13px] font-medium text-gray-400">
                          17.45
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <div className="flex items-center">
                          <Link
                            href="#"
                            className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                          >
                            Lorem Ipsum
                          </Link>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <span className="text-[13px] font-medium text-gray-400">
                          02-02-2024
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <span className="text-[13px] font-medium text-gray-400">
                          17.45
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>)}

      {activeSection === 'packages' && (<Purchased />)}
        

        {/* <!-- End Content --> */}
      </main>
    </div>
  );
};

export default ClientDashboard;
