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
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Gen2NFTCard from "../components/Gen2NFTCard";
import {
  gen2DropContractAddress,
  gen2stakingContractAddress,
  tokenContractAddress,
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

const Stake: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const { contract: nftDropContract } = useContract(
    gen2DropContractAddress,
    "nft-drop"
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
      gen2stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(gen2stakingContractAddress, true);
    }

    // Show loading notification
    const notification = toast.info("Staking NFT...", { autoClose: false });

    try {
      const tx = await stakingContract?.call("stake", [id]);

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
<h1 className={`${styles.h1} ${styles.redText} ${styles.darkPurpleBackground}`}>
  - BOTS OF COG GEN2 REPO -
</h1>
<button onClick={router.back} className={styles.backArrow}>
            <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" /></button><br></br>

            <h3 className={`${styles.redText} ${styles.darkPurpleBackground}`}>Gen1/2 Staking Platform Contracts Are Being Migrated.<br></br> This Page Will Update Soon!</h3>


 {/*      <div className={styles.tokenItem}>
        <h3 className={`${styles.tokenLabel} ${styles.blueText}`}>Total COGz In Vault:</h3>
        <p className={styles.tokenValue}>{cogzRemaining ?? "Loading..."}</p>
      </div>
      <br></br>
      
      <hr className={`${styles.divider} ${styles.spacerTop}`} /> */}

      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          {/* <h2>YOUR COGz COIN</h2> */}
          <div className={styles.tokenGrid}>
{/*             <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>EARNED COGz:</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div> */}

            <div className={styles.tokenItem2}>
              <h3 className={styles.tokenLabel}>YOUR $COGz BALANCE:</h3>
              <p className={styles.tokenValue2}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>



{/*           <Web3Button
            action={() => claimRewards()}
            contractAddress={gen2stakingContractAddress}
          >
            Claim Earned COGz Coin
          </Web3Button> */}

{/*           <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>YOUR GEN2 REPOSITORY</h2>
          <div className={styles.tokenItem}>
            <h3 className={styles.tokenLabel}>
              Total GEN2 Bots Uploaded:
              <p className={styles.tokenValue}> {stakedTokens && stakedTokens[0]?.length}</p>
              {stakedTokens && stakedTokens[0]?.length > 0 && (
                <span className={styles.blueText}></span>
              )}
            </h3>
          </div>
          <br></br>
          <div className={styles.nftBoxGrid}>
  {stakedTokens &&
    stakedTokens[0]?.map((stakedToken: BigNumber) => (
      <Gen2NFTCard
        tokenId={stakedToken.toNumber()}
        key={stakedToken.toString()}
      />
    ))}
</div> */}
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2 className={`${styles.h1} ${styles.redText} ${styles.darkPurpleBackground}`}>GEN2 BOTS IN WALLET</h2>
          <a href="https://opensea.io/collection/bots-of-cog-gen2">
          <b>VIEW ENTIRE BOTS OF COG GEN-2 COLLECTION</b> 
        </a>
{/*           <Web3Button
      contractAddress="0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7"
      action={(contract) => {
        contract.call("setApprovalForAll", [gen2stakingContractAddress, true])
      }}
    >
      Set Approval For All GEN-2 Bots

    </Web3Button> */}
          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox2} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3 className={styles.redText}>{nft.metadata.name}</h3>
   

{/*                 <Web3Button
      contractAddress="0xa388f4d544bF437D8C40df85bc65A9822a0472Db"
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
