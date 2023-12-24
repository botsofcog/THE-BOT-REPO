import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Gen2NFTCard from "../components/Gen2NFTCard";
import {
  gen2DropContractAddress,
  gen2stakingContractAddress,
  tokenContractAddress,
  oldContractAddress,
  brokenContractAddress,
  scrapContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { nftDropContractAddress } from "../consts/contractAddresses";

// Import dependencies for pop-up notifications
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IoExitOutline,
  IoCheckmarkOutline,
  IoCheckmarkCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useRouter } from "next/router";
import { FaRecycle } from "react-icons/fa"; // Import the recycling icon from a library

const Recycle: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const { contract: nftDropContract } = useContract(
    brokenContractAddress,
    "broken-nft-drop"
  );
  const { contract: scrapDropContract } = useContract(
    scrapContractAddress,
    "scrap-nft-drop"
  );
  const { contract: oldnftDropContract } = useContract(
    oldContractAddress,
    "old-nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract: stakingContract, isLoading: isStakingContractLoading } = useContract(
    gen2stakingContractAddress,
    "staking"
  );
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: scrapOwnedNfts } = useOwnedNFTs(scrapDropContract, address);
  const { data: oldContractOwnedNfts } = useOwnedNFTs(oldnftDropContract, address);

  return (
    <div className={styles.container}>
<h1 className={`${styles.h1} ${styles.whiteText}`}>
  - THE SCRAPYARD -
</h1>
<button onClick={router.back} className={styles.backArrow}>
            <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" /></button>
            <br></br>
<h3 className={`${styles.whiteText}`}>Burn Incomplete/Unused Bot Tokens To Redeem Scrap Tokens Used for Future Upgrades. </h3>
<div className={styles.optionSelectBox3}>
        <div className={styles.whiteBox}>
          <Image src="/scrap.gif" alt="preview" layout="fill" />
        </div>
      </div>



      <hr className={`${styles.divider} ${styles.spacerTop}`} />
{/*       <Web3Button
      contractAddress="0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7"
      action={(contract) => {
        contract.call("setApprovalForAll", [address, true])
      }}
    >
      Approve Migrated GEN-2 Contract

    </Web3Button> */}

<Web3Button
      contractAddress="0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a"
      action={(contract) => {
        contract.call("setApprovalForAll", [address, true])
      }}
    >
      Approve Failed GEN-2 Contract

    </Web3Button>
      
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2 className={`${styles.greenText}`}>AVAILABLE TO RECYCLE:</h2>
          <p className={`${styles.whiteText}`}>Bots from Failed Contract <a href="https://polygonscan.com/address/0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a">0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a</a></p>



<div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox3} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia} 
                /> 
                <h3 className={`${styles.whiteText}`}>{nft.metadata.name}</h3>
      <Web3Button
contractAddress="0x937F774e3eeFd60cCaFD895a80DEcEa90245e775"
action={(contract) => {
  contract.call("burnAndClaim", [nft.metadata.id, 1])
      }}
    >
      <FaRecycle className={styles.recycleIcon} /> SCRAP
    </Web3Button>
              </div>
            ))}
          </div>



{/* <div className={styles.nftBoxGrid}>
  {oldContractOwnedNfts?.map((nft) => (
    <div className={styles.nftBox3} key={nft.metadata.id.toString()}>
      <ThirdwebNftMedia
        metadata={nft.metadata}
        className={styles.nftMedia}
      />
      <h3 className={`${styles.whiteText}`}>{nft.metadata.name}</h3>
      <Web3Button
contractAddress="0x937F774e3eeFd60cCaFD895a80DEcEa90245e775"
action={(contract) => {
  contract.call("burnAndClaim", [nft.metadata.id, 1])
      }}
    >
      <FaRecycle className={styles.recycleIcon} /> SCRAP
    </Web3Button>
    </div>
  ))}
</div> */}


      {/* Toast container for pop-up notifications */}
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
<br></br>
<h2 className={`${styles.whiteText}`}>EARNED SCRAP:</h2>
<p><a href="https://opensea.io/collection/bots-of-cog-scrapyard">Scrap Collection</a></p>
<p className={`${styles.whiteText}`}><a href="https://polygonscan.com/address/0x937F774e3eeFd60cCaFD895a80DEcEa90245e775">0x937F774e3eeFd60cCaFD895a80DEcEa90245e775</a></p>


<div className={styles.nftBoxGrid}>
  {scrapOwnedNfts?.map((nft) => (
    <div className={styles.nftBox4} key={nft.metadata.id.toString()}>
      <ThirdwebNftMedia
        metadata={nft.metadata}
        className={styles.nftMedia}
      />
      <h3 className={`${styles.whiteText}`}>{nft.metadata.name}</h3>
    </div>
  ))}
</div> 

<br></br>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      <ToastContainer />
      <p><a href="https://opensea.io/collection/bots-of-cog-gen2">
          <b>OFFICIAL GEN-2 COLLECTION</b> 
        </a>
        <br></br>
        <a href="https://www.botsofcog.io">- HOMEPAGE -</a>
        <br />
        <a href="https://twitter.com/botsofcog">- TWITTER -</a>
      </p>
    </div>
  );
  
};

export default Recycle;
