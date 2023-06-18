import { Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nftDropContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Mint: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.redText} ${styles.darkPurpleBackground}`}>- MINT A BOTS OF COG GEN2 -</h1>
      <p>
        CONTRACT ADDRESS:{" "}
        <a href="https://polygonscan.com/address/0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7">
          0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7
        </a>
      </p>
      <div className={styles.optionSelectBox2}>
        <div className={styles.goldBox}>
          <Image src="/preview.gif" alt="preview" layout="fill" />
        </div>
      </div>
      <p>
        Early Access JULY 14-21 2023 @10 $Matic - JULY 21 2023 Public @15 $Matic
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <div className={styles.iframeContainer}>
        <iframe
          src="https://ipfs-2.thirdwebcdn.com/ipfs/QmZG9dPDYCpTuzM3mVvdtmpjqwCbhErPipNvT945QqzWHk?contract=0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7&chain=%7B%22name%22%3A%22Polygon+Mainnet%22%2C%22chain%22%3A%22Polygon%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fpolygon.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22MATIC%22%2C%22symbol%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22matic%22%2C%22chainId%22%3A137%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22polygon%22%7D&theme=dark&primaryColor=red"
          className={styles.iframe}
        ></iframe>
      </div>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p className={styles.explain}>
        Connect Your Wallet Above To Claim Your{" "}
        <a href="https://opensea.io/collection/bots-of-cog-gen2">
          <b>BOTS OF COG</b> Generation 2 Series Robot
        </a>
        .<br />
        <br></br><a href="https://botrepo.botsofcog.io/stakegen2">Stake Your GEN2 Bot(s) For COGz Tokens</a><br></br>
        <br></br>
        Bridge Your ETH to MATIC Below using the{" "}
        <a href="https://bridge.umbria.network/">
          <b>UBMBRIA Network Bridge</b>
        </a>
        .
      </p>
      <div className={styles.iframeContainer}>
        <iframe
          src="https://umbria.network/widgetv2/"
          className={styles.iframe}
        ></iframe>
      </div>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p>
        <a href="https://www.botsofcog.io">- BACK TO BOTS OF COG HOMEPAGE -</a>
        <br />
        <a href="https://twitter.com/botsofcog">- BoC Twitter -</a>
      </p>
    </div>
  );
};

export default Mint;
