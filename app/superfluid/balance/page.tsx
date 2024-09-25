"use client";

import {useState} from 'react';
import type { NextPage } from "next";
import { useSearchParams } from 'next/navigation'
import { formatEther } from 'viem'
import { optimismSepolia } from 'viem/chains'
import { postCheckETHxBalance } from '~~/lib/graphql'
import "~~/styles/hide.css";
import { useBalance } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { useQuery } from '@tanstack/react-query';
const Home: NextPage = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
 const [inputValue,setInputValue]=useState(id || "")
 const result = useBalance({
  address: id as string,
  chainId: optimismSepolia.id
})
const { data: parsedString, isLoading: loadingParsed } = useQuery({
  queryKey: ["getBalance", id as string],
  queryFn: () => postCheckETHxBalance(id as string),
});

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      

    <div className="w-full max-w-md space-y-4">
    <div className="flex justify-center items-center">
        <img
          src="https://sepolia-optimism.etherscan.io/assets/opsepolia/images/svg/logos/logo-light.svg?v=24.9.2.0"
          alt="Optimism Sepolia Logo"
          className="h-12 w-auto mr-2" 
        />
        <span className="text-xl font-bold">Sepolia</span>
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          placeholder="eth address or ens"
          value={inputValue} // Assuming you have a state variable named 'inputValue'
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <label className="absolute -top-2 left-2 px-1 bg-gray-100 text-xs text-gray-500">
          eth address or ens
        </label>
      </div>
      <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full max-w-md">
        Check Balance
      </button>
      <div className="p-4 bg-white border border-gray-300 rounded-md">
        <div className="text-sm text-gray-500 mb-1">balance</div>
        <div className="text-2xl font-bold">{result.data?.value ? formatEther(result.data?.value) : "0"} ETH</div>
      </div>
      <div className="p-4 bg-white border border-gray-300 rounded-md">
        <div className="text-sm text-gray-500 mb-1">ethx balance</div>
          <div className="text-2xl font-bold">{parsedString && (parsedString as any).data ? (parsedString as any).data.accountTokenSnapshots[0].balanceUntilUpdatedAt + " " + (parsedString as any).data.accountTokenSnapshots[0].token.symbol : "0 ETHx"}</div>
      </div>
    </div>
  </div>
  );
};

export default Home;
