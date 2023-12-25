import { Web3Button, useClaimNFT } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nftDropContractAddress } from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import {
  IoExitOutline,
  IoCheckmarkOutline,
  IoCheckmarkCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
const Mint: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.redText} ${styles.darkPurpleBackground}`}>- BOTS OF COG GEN2 MINT PAGE -</h1>
      <div><button onClick={router.back} className={styles.backArrow}>
            <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" />
          </button></div><br></br>


      <div className={styles.optionSelectBox2}>
        <div className={styles.goldBox}>
          <Image src="/preview.gif" alt="preview" layout="fill" />
        </div>
      </div>
      
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <Web3Button
      contractAddress="0xfFd0A8D2FeC4144b3D4dfcD37499ef46b8cfE3Fd"
      action={(contract) => contract.erc721.claim(1)}
    >
      MINT A GEN-2 BOT
    </Web3Button>
    <br></br>
    <p><i>Mint 1 Bot With the Button Above or Multiple Bots With the Widget Below</i></p>
    <br></br>
     
            <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
            <iframe
  src="https://embed.ipfscdn.io/ipfs/bafybeicd3qfzelz4su7ng6n523virdsgobrc5pcbarhwqv3dj3drh645pi/?contract=0xfFd0A8D2FeC4144b3D4dfcD37499ef46b8cfE3Fd&chain=%7B%22name%22%3A%22Polygon+Mainnet%22%2C%22chain%22%3A%22Polygon%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fpolygon.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22MATIC%22%2C%22symbol%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22matic%22%2C%22chainId%22%3A137%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22polygon%22%2C%22icon%22%3A%7B%22url%22%3A%22ipfs%3A%2F%2FQmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9%2Fpolygon%2F512.png%22%2C%22width%22%3A512%2C%22height%22%3A512%2C%22format%22%3A%22png%22%7D%7D&clientId=f2d6855133f2f2331b61b0b5c2b2c52f&theme=dark&primaryColor=red"
  width="600px"
  height="600px"
  max-width="100%"
></iframe>

      <br></br>
 <p>
        CONTRACT ADDRESS:{" "}
        <a href="https://polygonscan.com/address/0xfFd0A8D2FeC4144b3D4dfcD37499ef46b8cfE3Fd">
        0xfFd0A8D2FeC4144b3D4dfcD37499ef46b8cfE3Fd
        </a>
      </p>


        <br></br>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p className={styles.explain}>
        Connect Your Wallet Above To Claim Your{" "}
        <a href="https://opensea.io/collection/bots-of-cog-gen2">
          <b>BOTS OF COG</b> Generation 2 Series Robot
        </a>

        <br></br>
        Bridge Your ETH to MATIC using the{" "}
        <a href="https://bridge.umbria.network/">
          <b>UBMBRIA Network Bridge</b>
        </a>
      </p>
      <br></br> 
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p>{/* <a href="https://botrepo.botsofcog.io/stakegen2">- Stake Your GEN2 Bot(s) For COGz Tokens -</a><br></br> */}
        <a href="https://www.botsofcog.io">- BACK TO BOTS OF COG HOMEPAGE -</a>
        <br />
        <a href="https://twitter.com/botsofcog">- BoC Twitter -</a>
      </p>
    </div>
  );
};

export default Mint;
