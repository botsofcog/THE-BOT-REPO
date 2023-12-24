import { Polygon } from "@thirdweb-dev/chains";
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

const Stake: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const { contract: nftDropContract } = useContract(
    brokenContractAddress,
    "nft-drop"
  );
  const { contract: scrapAddress } = useContract(
    scrapContractAddress,
    "scrap"
  );
  const { contract: stakingContract, isLoading: isStakingContractLoading } = useContract(
    stakingContractAddress
  );
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: ownedScrapNfts } = useOwnedNFTs(scrapAddress, address);
  const { data: ownedGen2Nfts } = useOwnedNFTs(nftDropContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens, isLoading: isStakedTokensLoading } = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
  );
  const [cogzRemaining, setCogzRemaining] = useState<string | undefined>();
  const [stakedBotIds, setStakedBotIds] = useState<number[]>([]);
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

  if (isStakingContractLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.whiteText}`}>
        - THE SCRAPYARD -
      </h1>
      <p>(Tokens Take A Minute To Load. Please Be Patient.)</p>
      <br></br>
      <button onClick={router.back} className={styles.backArrow}>
        <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" />
      </button>
      <br></br>
      <ConnectWallet></ConnectWallet>
      <h3 className={`${styles.whiteText}`}>
        Burn Incomplete/Unused Bot Tokens To Redeem Scrap Tokens Used for Future Upgrades.
      </h3>
      <Web3Button
        contractAddress="0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a"
        action={(contract) => {
          contract.call("setApprovalForAll", [stakingContractAddress, true]);
        }}
      >
        Set Approval For All
      </Web3Button>

      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
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
              Scroll Left
            </button>
            <button
              onClick={scrollRight}
              disabled={scrollIndex === maxIndex}
            >
              Scroll Right
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

          <h2 className={`${styles.greenText}`}>AVAILABLE TO RECYCLE:</h2>
          <p className={`${styles.whiteText}`}>
            Bots from Failed Contract:{" "}
            <a href="https://polygonscan.com/address/0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a">
              0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a
            </a>
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

                <Web3Button
                  contractAddress="0x71eA5c257ae5dc3C0CD7867fEa30d236E2c8dF6a"
                  action={(contract) => {
                    contract.call("approve", [address, nft.metadata.id]);
                  }}
                >
                  APPROVE
                </Web3Button>
                <br></br>
                <br></br>
                <Web3Button
                  contractAddress="0x937F774e3eeFd60cCaFD895a80DEcEa90245e775"
                  action={(contract) => {
                    contract.call("burnAndClaim", [[nft.metadata.id, 1]]);
                  }}
                >
                  RECYCLE
                </Web3Button>
              </div>
            ))}
          </div>

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

export default Stake;
