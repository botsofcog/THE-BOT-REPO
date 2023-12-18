import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import type { FC } from "react";
import {
  gen2DropContractAddress,
  gen2stakingContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
  const { contract } = useContract(gen2DropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);

  return (
    <>
      {nft && (
        <div className={styles.nftBox2}>
          {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.nftMedia}
            />
          )}
          <h3>{nft.metadata.name}</h3>

          <Web3Button
      contractAddress="0xa388f4d544bF437D8C40df85bc65A9822a0472Db"
      action={(contract) => {
        contract.call("withdraw", [[nft.metadata.id]])
      }}
    >
      Download to ACCOUNT
    </Web3Button>

        </div>
      )}
    </>
  );
};
export default NFTCard;
