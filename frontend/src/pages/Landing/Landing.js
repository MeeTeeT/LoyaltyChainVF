import Navbar from "../../components/Navbar";
import "../../App.css";
import { useState, useContext } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import { useNavigate, Link } from "react-router-dom";
//import Marketplace from "../../LoyaltyMarketplace.json";
import { useLocation } from "react-router";
import { WalletContext } from "../../contexts/walletProvider";

export default function Landing() {
  const { isAddressAlreadyCreatedAccount, isRegisteredBrand } =
    useContext(WalletContext);

  return (
    <div className="hero  min-h-screen bg-base-100">
      <div className="hero-content flex-col">
        <div className="hero-content flex-col lg:flex-row-reverse py-20">
          <img
            src="https://media.istockphoto.com/id/1348670624/vector/vector-set-of-illustration-loyalty-program-concept-line-art-style-background-design-for-web.jpg?s=612x612&w=0&k=20&c=6hw0CX3DjiHDttIK51RmYnlIxqdnPvZGcJt0ddPBuv0="
            className="max-w-sm rounded-3xl shadow-2xl"
          />
          <div className="pr-16">
            <h1 className="text-6xl font-bold">
              Buy, Trade, Exchange your loyalty rewards
            </h1>
            <p className="py-9">
              Loyalty Chain is a web3 platform that allows both brands to engage
              new customers, and for customers to really benefit from their
              different loyalty programs.
            </p>
            {!isRegisteredBrand ? (
              <div className="flex flex-col w-full lg:flex-row py-8">
                <Link
                  to={{ pathname: "/createBrand" }}
                  className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center"
                >
                  Start as brand
                </Link>
                <div className=" lg:divider-horizontal"></div>
                <Link
                  to={{ pathname: "/marketplace" }}
                  className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center"
                >
                  Go to marketplace
                </Link>
              </div>
            ) : (
              <div className="flex flex-col w-full lg:flex-row py-8">
                <Link
                  to={{ pathname: "/sellNFT" }}
                  className="grid flex-grow h-32 card bg-base-content text-base-100 rounded-box place-items-center"
                >
                  Create Loyalty NFT
                </Link>
                <div className=" lg:divider-horizontal"></div>
                <Link
                  to={{ pathname: "/marketplace" }}
                  className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center"
                >
                  Go to marketplace
                </Link>
              </div>
            )}
          </div>
        </div>
        <br />
        <br />
        <br />
        <section className="mb-32 bg-neutral rounded-lg p-3">
          <div className="flex justify-center">
            <div className="max-w-[700px] text-center">
              <h2 className="mb-6 text-3xl font-bold text-neutral-500 dark:text-neutral-300">
                Why is it so great for brands ?{" "}
              </h2>
              <p className="mb-16 text-neutral-500 dark:text-neutral-300">
                Engage new customers and fidelize existing ones
              </p>
            </div>
          </div>

          <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-4 xl:gap-x-12">
            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Engage your community
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Retain your customers by giving them loyalty
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Tracking
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Follow your fidelity NFT activities
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Partnership
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Create brands community
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Web 3
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Enter web3 space !
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Marketplace
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Sell or Offer your loyalty benefit on your personnalized
                    marketplace
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Easy to use
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Only 2 min. to mint and send loyalty benefit.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Frequent updates
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    We will offers frequent functionnality updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="mr-3 h-5 w-5 text-success"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-2 grow">
                  <p className="mb-1 font-bold text-neutral-500 dark:text-neutral-300">
                    Responsive
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-300">
                    Access and mint your NFT loyalty anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-32 text-center">
          <div className="flex justify-center">
            <div className="max-w-[700px] text-center">
              <h2 className="mb-6 text-center text-3xl font-bold">
                Benefits for customers
              </h2>
              <p className="mb-16 text-neutral-500 dark:text-neutral-300"></p>
            </div>
          </div>

          <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
            <div className="mb-12 lg:mb-0">
              <div className="mb-6 inline-block rounded-full bg-primary-100 p-4 text-primary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <h5 className="mb-4 text-lg font-bold">Buy / Sell Loyalty</h5>
              <p className="text-primary-500 dark:text-primary-300">
                You can monetize your loyalty
              </p>
            </div>

            <div className="mb-12 lg:mb-0">
              <div className="mb-6 inline-block rounded-full bg-primary-100 p-4 text-primary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <h5 className="mb-4 text-lg font-bold">Be part of a community</h5>
              <p className="text-primary-300 dark:text-primary-300">
                Get exclusif rewards and benfits from Brands
              </p>
            </div>
            <div className="mb-12 lg:mb-0">
              <div className="mb-6 inline-block rounded-full bg-primary-100 p-4 text-primary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <h5 className="mb-4 text-lg font-bold">Instant access</h5>
              <p className="text-primary-300 dark:text-primary-300">
                Get loyalty reward whenever you want
              </p>
            </div>
            <div className="mb-12 lg:mb-0">
              <div className="mb-6 inline-block rounded-full bg-primary-100 p-4 text-primary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <h5 className="mb-4 text-lg font-bold">Web 3</h5>
              <p className="text-primary-300 dark:text-primary-300">
                Enter web 3 space
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
