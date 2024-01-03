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
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";
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
const NFT_CONTRACT_ADDRESS = "0x1BBCa92FC889Af891e3B666aee7Cb3534B83d7B7";
const STAKING_CONTRACT_ADDRESS = "0x6D067520526807E7A61BAC740E6D66BB62d05332";
const activeChain = { Polygon } ;
const Stake: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract: stakingContract, isLoading: isStakingContractLoading } = useContract(
    stakingContractAddress

  );
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens, isLoading: isStakedTokensLoading } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const [cogzRemaining, setCogzRemaining] = useState<string | undefined>();
  const [stakedBotIds, setStakedBotIds] = useState<number[]>([]);

  useEffect(() => {
    if (!stakingContract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
      setStakedBotIds(stakeInfo[0]);
    }

    async function loadCogzRemaining() {
      try {
        const cogzRemaining = await stakingContract?.call("getRewardTokenBalance", []);
        setCogzRemaining(ethers.utils.formatUnits(cogzRemaining, 18));
      } catch (error) {
        console.error("Failed to load cogz remaining:", error);
        setCogzRemaining("N/A");
      }
    }

    loadClaimableRewards();
    loadCogzRemaining();
  }, [address, stakingContract]);

  

  async function stakeNft(id: string) {
    if (!address) return;
  
    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    console.log("isApproved:", isApproved);  // Added console.log
  
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
  
    // Show loading notification
    const notification = toast.info("Staking NFT...", { autoClose: false });
  
    try {
      const tx = await stakingContract?.call("stake", [[id]]);
  
      if (tx) {
        await tx.wait();
  
        // Show success notification
        toast.success("NFT staked successfully!");
      } else {
        // Show error notification for canceled or rejected transaction
        toast.error("Failed to stake NFT.");
        console.error("Error", Error);
      }
    } catch (error) {
      // Show error notification for other errors
      toast.error("Failed to stake NFT.");
    }
  
    // Hide loading notification
    toast.dismiss(notification);
  }
  

  
  


  async function unstakeAll() {
    if (!address || !stakingContract || !stakedTokens) return;

    // Show loading notification
    const notification = toast.info("Unstaking all bots...", { autoClose: false });

    const withdrawPromises = stakedTokens[0]?.map((stakedToken: BigNumber) => {
      return stakingContract.call("withdraw", [stakedToken.toNumber()]);
    });

    try {
      const txs = await Promise.all(withdrawPromises);
      await Promise.all(txs.map((tx) => tx.wait()));

      // Show success notification
      toast.success("All bots unstaked successfully!");
    } catch (error) {
      // Show error notification
      toast.error("Failed to unstake bots.");
    }

    // Hide loading notification
    toast.dismiss(notification);
  }

  async function claimRewards() {
    if (!address || !stakingContract) return;

    // Show loading notification
    const notification = toast.info("Claiming earned COGz Coin...", { autoClose: false });

    try {
      const tx = await stakingContract?.call("claimRewards");

      if (tx) {
        await tx.wait();

        // Show success notification
        toast.success("Earned COGz Coin claimed successfully!");
      } else {
        // Show error notification for canceled or rejected transaction
        toast.error("Failed to claim earned COGz Coin.");
      }
    } catch (error) {
      // Show error notification for other errors
      toast.error("Failed to claim earned COGz Coin.");
    }

    // Hide loading notification
    toast.dismiss(notification);
  }

  if (isStakingContractLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.redBackground}`}>- BOTS OF COG GEN1 REPO -</h1>
      <button onClick={router.back} className={styles.backArrow}>
            <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" /></button><br></br>

            <h3 className={`${styles.redBackground}`}>Gen1/2 Staking Platform Contracts Are Being Migrated.<br></br> This Page Will Update Soon!</h3>

{/*       <div className={styles.tokenItem}>
        <h3 className={`${styles.tokenLabel} ${styles.blueText}`}>Total COGz In Vault:</h3>
        <p className={styles.tokenValue}>{cogzRemaining ?? "Loading..."}</p>
      </div>
      <br></br> */}
      
      {/* <hr className={`${styles.divider} ${styles.spacerTop}`} /> */}

      {!address ? (
        <ConnectWallet />
      ) : (
        <>

          <div className={styles.tokenGrid}>
{/*            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>OLD EARNED COGz:</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div> */}

            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>YOUR $COGz  BALANCE:</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>
{/* 
<Web3Button
            action={() => claimRewards()}
            contractAddress={stakingContractAddress}
          >
            Claim Remaining COGz
          </Web3Button> */}

{/* <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>YOUR GEN1 REPOSITORY</h2>
          <div className={styles.tokenItem}>
            <h3 className={styles.tokenLabel}>
              Total GEN1 Bots Uploaded:
              <p className={styles.tokenValue}> {stakedTokens && stakedTokens[0]?.length}</p>
              {stakedTokens && stakedTokens[0]?.length > 0 && (
                <span className={styles.blueText}></span>
              )}
            </h3>
          </div>


<div className={styles.nftBoxGrid}>
            {stakedTokens &&
              stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <NFTCard
                  tokenId={stakedToken.toNumber()}
                  key={stakedToken.toString()}
                />
              ))}
          </div> */}
          {/* 
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>GEN1 BOTS IN WALLET</h2>
          <Web3Button
      contractAddress="0x1BBCa92FC889Af891e3B666aee7Cb3534B83d7B7"
      action={(contract) => {
        contract.call("setApprovalForAll", [stakingContractAddress, true])
      }}
    >
      Set Approval For All GEN-1 Bots

    </Web3Button>
    <br></br>
<b><p>Please Confirm Your Gen-1 has Approval Before Uploading</p></b> */}
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
<h2 className={`${styles.h1} ${styles.redBackground}`}>GEN1 BOTS IN WALLET</h2>
<a href="https://opensea.io/collection/botsofcog">
          <b>VIEW ENTIRE BOTS OF COG GEN-1 COLLECTION</b> 
        </a>
          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3>{nft.metadata.name}</h3>
                
                
{/* <Web3Button
      contractAddress="0x1BBCa92FC889Af891e3B666aee7Cb3534B83d7B7"
      action={(contract) => {
        contract.call("approve", [stakingContractAddress, nft.metadata.id])
      }}
    >
      Approve For Upload
    </Web3Button>
    <br></br>
<br></br> */}
{/*     <Web3Button
      contractAddress="0x6D067520526807E7A61BAC740E6D66BB62d05332"
      action={(contract) => {
        contract.call("stake", [[nft.metadata.id]])
      }}
    >
      Upload to REPO
    </Web3Button> */}




              </div>
            ))}
          </div>
        </>
      )}

      {/* Toast container for pop-up notifications */}
      <ToastContainer />
      
    </div>
    
  );
};

export default Stake;
