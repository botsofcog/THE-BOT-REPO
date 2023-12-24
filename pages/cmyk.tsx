import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Diamond from '@niftykit/diamond';
import Image from 'next/image';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { IoArrowBackOutline } from 'react-icons/io5';
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

const Mint: NextPage = () => {
  const router = useRouter();
  const [mintStatus, setMintStatus] = useState<string>('');

  const handleMint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const diamond = await Diamond.create(signer, 'clq7jmq2q0001ii7edvamkdyt');

      const recipient = await signer.getAddress();
      const price = await diamond?.apps?.drop?.price();

      const tx = await diamond?.apps?.drop?.mintTo(recipient, 1, {
        value: price,
      });
      await tx?.wait();

      setMintStatus('Success!');
    } catch (error) {
      console.error('Error while minting:', error);
      setMintStatus('Failed!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.magentaText}`}>BOTS OF COG - CMYK SERIES</h1>
      <ConnectWallet></ConnectWallet>
      <br></br>
      <div>
        
        <button onClick={router.back} className={styles.backArrow}>
          <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" />
        </button>
      </div>
      <br />
      <div className={styles.optionSelectBox4}>
        <div>
          <Image src="/cmyk promo.png" alt="preview" width={400} height={400} />
        </div>
      </div>
      <div>
  <button className={styles.mintButton} onClick={handleMint}>
    Mint NFT
  </button>
  {mintStatus && <p className={styles.mintStatus}>[ Minting Status: {mintStatus} ]</p>}
</div>
      <br />
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p>
        CONTRACT ADDRESS:{' '}
        <a href="https://polygonscan.com/address/0xa4bA364003A0975dcC649D770886E0Cb71b16E86">
          0xa4bA364003A0975dcC649D770886E0Cb71b16E86
        </a>
      </p>
      <br />
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p className={styles.explain}>
        CLAIM YOUR {' '}
        <a href="https://app.niftykit.com/collections/bots-of-cog-cmyk-series">
          <b>FUN TIME PAL</b>
        </a>{' '}
        NOW!
        <br />
        Bridge Your ETH to MATIC using the{' '}
        <a href="https://bridge.umbria.network/">
          <b>UBMBRIA Network Bridge</b>
        </a>
      </p>
      <br />
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
