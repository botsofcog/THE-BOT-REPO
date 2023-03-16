import { Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nftDropContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Mint An GEN2!</h1>

      <p className={styles.explain}>
        Click Here to Claim your <b>BOTS OF COG</b> Generation 2 Series Robot.
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />

      <Web3Button
        colorMode="dark"
        accentColor="#5204BF"
        contractAddress="0x1BBCa92FC889Af891e3B666aee7Cb3534B83d7B7"
        action={(contract) => {contract.call("mint", 1)}}
        onSuccess={() => {
          alert("NFT Minted!");
          router.push("/stake");
        }}
        onError={(error) => {
          alert(error);
        }}
      >
        MINT COG BOT
      </Web3Button>
    </div>
  );
};

export default Mint;
