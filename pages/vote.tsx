import { useContractEvents, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebProvider, useContract, useContractRead } from "@thirdweb-dev/react";
import { VoteContractOutput } from "@thirdweb-dev/sdk/dist/declarations/src/evm/schema";
const sdk = new ThirdwebSDK("polygon");
const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>VOTE</h1>
      <div className={styles.nftBoxGrid}>

      <Web3Button
colorMode="dark"
contractAddress="0xC432013CbA34F5202c3cAf109d3456d3b97e11bB"
action={(contract) => {contract.call("getAllProposals")}}
onSuccess={() => {
  //alert("Voted!");

}}
onError={(error) => {
  alert(error);
}}
>
VOTE
</Web3Button>
      </div>
    </div>
  );
};
export default Home;
