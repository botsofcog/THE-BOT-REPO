import { Polygon } from "@thirdweb-dev/chains";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
  brokenContractAddress,
  gen2DropContractAddress,
  oldContractAddress,
  scrapContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IoExitOutline,
  IoCheckmarkOutline,
  IoCheckmarkCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useRouter } from "next/router";

const NUM_VISIBLE_SCRAP_NFTS = 4;

const Recycle: NextPage = () => {
  const address = useAddress();
  const router = useRouter();

  const { contract: scrapAddress } = useContract(
    scrapContractAddress,
    "scrap"
  );
  const { data: ownedScrapNfts } = useOwnedNFTs(scrapAddress, address);
  const { contract: nftDropContract } = useContract(
    gen2DropContractAddress,
    "nft-drop"
  );
  const { data: ownedGen2Nfts } = useOwnedNFTs(nftDropContract, address);
  const [scrollIndex, setScrollIndex] = useState(0);
  const maxIndex = Math.max(0, (ownedScrapNfts?.length || 0) - NUM_VISIBLE_SCRAP_NFTS);

  const scrollLeft = () => {
    if (scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    }
  };

  const scrollRight = () => {
    const maxIndex = Math.max(
      0,
      (ownedScrapNfts?.length || 0) - NUM_VISIBLE_SCRAP_NFTS
    );
    if (scrollIndex < maxIndex) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.whiteText}`}>
        - THE SCRAPYARD -
      </h1>
      <br></br>
      <button onClick={router.back} className={styles.backArrow}>
        <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" />
      </button>
      <br></br>
      <ConnectWallet></ConnectWallet>
      <h3 className={`${styles.whiteText}`}>
        Exchange Incomplete Bots <br></br><i>OR</i><br></br>x 500.00 $COGz Coins<br></br>=<br></br>Redeem SCRAP; Used for Future Upgrades.
      </h3>


      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
<br></br>

          <iframe
    src="https://embed.ipfscdn.io/ipfs/bafybeicd3qfzelz4su7ng6n523virdsgobrc5pcbarhwqv3dj3drh645pi/?contract=0x937F774e3eeFd60cCaFD895a80DEcEa90245e775&chain=%7B%22name%22%3A%22Polygon+Mainnet%22%2C%22chain%22%3A%22Polygon%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fpolygon.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22MATIC%22%2C%22symbol%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22matic%22%2C%22chainId%22%3A137%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22polygon%22%2C%22icon%22%3A%7B%22url%22%3A%22ipfs%3A%2F%2FQmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9%2Fpolygon%2F512.png%22%2C%22width%22%3A512%2C%22height%22%3A512%2C%22format%22%3A%22png%22%7D%7D&clientId=f2d6855133f2f2331b61b0b5c2b2c52f&theme=dark"
    width="600px"
    height="600px"
></iframe>

          <h2 className={`${styles.whiteText}`}>YOUR SCRAP:</h2>
          <p>
            <a href="https://opensea.io/collection/bots-of-cog-scrapyard">
              <b>Official Scrap Collection</b>
            </a>
          </p>
          <p className={`${styles.whiteText}`}>
            <a href="https://polygonscan.com/address/0x937F774e3eeFd60cCaFD895a80DEcEa90245e775">
              0x937F774e3eeFd60cCaFD895a80DEcEa90245e775
            </a>
          </p>

          <div className={styles.scrollButtons}>
  <button onClick={scrollLeft} disabled={scrollIndex === 0}>
    <IoChevronBackOutline size={20} />
  </button>
  <button onClick={scrollRight} disabled={scrollIndex === maxIndex}>
    <IoChevronForwardOutline size={20} />
  </button>
</div>

          <div className={styles.nftBoxGrid2}>
            {ownedScrapNfts &&
              ownedScrapNfts
                .slice(scrollIndex, scrollIndex + NUM_VISIBLE_SCRAP_NFTS)
                .map((nft) => (
                  <div
                    className={styles.nftBox4}
                    key={nft.metadata.id.toString()}
                  >
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                    <h3 className={`${styles.whiteText}`}>
                      {nft.metadata.name}
                    </h3>
                  </div>
                ))}
          </div>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />

          <h2 className={`${styles.whiteText}`}>NFTS/TOKENS TO RECYCLE:</h2>
      <br></br>
          <p className={`${styles.whiteText}`}><b>All Your GEN2s Are Displayed Here</b> - <i>Only Clones From Duplicate Collections Will RECYCLE.</i>  <br></br></p>
          <p className={`${styles.greenText}`}><b> CURRENTLY BURNING ---{">"} </b>
<i>[ Failed Contract:{" "}
            <a href="https://polygonscan.com/address/0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a">
              0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a
            </a> ]</i>
          </p>
          <p className={`${styles.redText}`}>
[ Original Contract:{" "}
            <a href="https://polygonscan.com/address/0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7">
            0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7
            </a> ]
          </p>
          <div className={styles.nftBoxGrid3}>
            {ownedGen2Nfts?.map((nft) => (
              <div className={styles.nftBox3} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3 className={`${styles.whiteText}`}>
                  {nft.metadata.name}
                </h3>
{/* 
                <Web3Button
                  contractAddress="0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a"
                  action={(contract) => {
                    contract.call("approve", [address, nft.metadata.id]);
                  }}
                >
                  APPROVE
                </Web3Button>
                <br></br> */}
                
                <Web3Button
  contractAddress="0x937F774e3eeFd60cCaFD895a80DEcEa90245e775"
  action={async (contract) => {
    try {
      await contract.call("burnAndClaim", [nft.metadata.id, 1]);
      // Display success toast when the recycling action completes
      toast.success("Recycling successful!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000, // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
      });
    } catch (error) {
      // Handle error here if the recycling action fails
      console.error("Recycling failed:", error);
      toast.error("Recycling failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000, // Set the duration in milliseconds for the error toast
      });
    }
  }}
>
  RECYCLE
</Web3Button>
                
              </div>
            ))}
          </div>
          <br></br>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />

          <p>
            <a href="https://opensea.io/collection/bots-of-cog-gen2">
              <b>- OFFICIAL GEN-2 COLLECTION -</b>
            </a>
            <br></br>
            <a href="https://www.botsofcog.io">- HOMEPAGE -</a>
            <br />
            <a href="https://twitter.com/botsofcog">- TWITTER -</a>
          </p>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recycle;
