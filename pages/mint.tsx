import { Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nftDropContractAddress } from "../consts/contractAddresses";
import { newnftDropContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Mint A GEN2!</h1>

      <p className={styles.explain}>
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />

      <Web3Button
        colorMode="dark"
        accentColor="#5204BF"
        contractAddress={newnftDropContractAddress}
        action={(contract) => contract.erc721.claim(1)}
        onSuccess={() => {
          alert("NFT Claimed!");
          router.push("/stake");
        }}
        onError={(error) => {
          alert(error);
        }}
      >
        CLAIM A COG BOT
      </Web3Button>
    </div>
  );
};

export default Mint;
