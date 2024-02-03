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
    const websiteUrl = 'https://app.niftykit.com/collections/bots-of-cog-cmyk-series';
    window.open(websiteUrl, '_self');
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.h1} ${styles.whiteText}`}>BOTS OF COG - CMYK SERIES</h1>
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
          <Image src="/cmykpreview.gif" alt="preview" width={400} height={400} />
        </div>
      </div>
      <div>
      <div className={styles.greenText}>
        <h1><p>TO EXCHANGE YOUR FUN TIME PAL FOR A NEW RANDOM PAL:</p></h1>
        <h3><p>Please Send The Selected Bot(s) To <i>0xC7738249346eE61114d6f84d3645B986AC5f5559</i> and Wait for your New Pal!</p></h3>
        <p><b>ITS THAT EASY!</b></p></div>
{/*   <button className={styles.mintButton} onClick={handleMint}>
    Mint NFT
  </button> */}

</div>
      <br />
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <p>
      Check Out The CMYK Collection of {' '}
        <a href="https://opensea.io/collection/bots-of-cog-cmyk-series">
          <b>THE FUN TIME PALS</b>
        </a>{' '}</p><br />
      <p>
        CONTRACT ADDRESS:{' '}
        <a href="https://polygonscan.com/address/0xa4bA364003A0975dcC649D770886E0Cb71b16E86">
          0xa4bA364003A0975dcC649D770886E0Cb71b16E86
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
