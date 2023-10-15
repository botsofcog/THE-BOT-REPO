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
    stakingContractAddress,
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
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
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
      <div className={styles.tokenItem}>
        <h3 className={`${styles.tokenLabel} ${styles.blueText}`}>Total COGz In Vault:</h3>
        <p className={styles.tokenValue}>{cogzRemaining ?? "Loading..."}</p>
      </div>
      <br></br>
      
      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          <h2>YOUR COGz COIN</h2>
          <div className={styles.tokenGrid}>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>EARNED COGz:</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div>

            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>COGz BALANCE:</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>

          <Web3Button
            action={() => claimRewards()}
            contractAddress={stakingContractAddress}
          >
            Claim Earned COGz Coin
          </Web3Button>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
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
          <Web3Button
            action={() => unstakeAll()}
            contractAddress={stakingContractAddress}
          >
            Download ALL GEN1 Bots to Account*
          </Web3Button>
          <p>*[Combines Multiple Wallet Withdrawals Into A Single Transaction.]<br></br>[You Will Still Have to Approve Each Staked Bot!]</p>
          <div className={styles.nftBoxGrid}>
            {stakedTokens &&
              stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <NFTCard
                  tokenId={stakedToken.toNumber()}
                  key={stakedToken.toString()}
                />
              ))}
          </div>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>GEN1 BOTS IN WALLET</h2>
          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3>{nft.metadata.name}</h3>
                <Web3Button
                  contractAddress={stakingContractAddress}
                  action={() => stakeNft(nft.metadata.id)}
                >
                  Upload to REPO
                </Web3Button>
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
