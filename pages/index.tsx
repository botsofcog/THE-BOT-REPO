import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { ConnectWallet } from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>THE BOTS OF COG REPO</h1>
      <ConnectWallet></ConnectWallet>



      <div className={styles.nftBoxGrid}>
      <div
            className={styles.optionSelectBox}
            role="button"
            onClick={() => router.push(`/cmyk`)}
          >
            {/* MINT */}
            <Image src="/icons/cmyk.webp" alt="mintcmyk" width={64} height={64} />
            <h2 className={styles.selectBoxTitle}>CMYK MINT <br></br>[ CLOSED ]</h2>
            <p className={styles.selectBoxDescription}>
            {"Burn To Exchange Phase Is LIVE. Send A Pal in to Redeem A New One."}
            {/* <p>FUN TIME PALS; 64 Limted Edition Worker Bots, Unique to COG.</p> */}
            </p>
        </div>
        <div
            className={styles.optionSelectBox}
            role="button"
            onClick={() => router.push(`/mint`)}
          >
            {/* MINT */}
            <Image src="/icons/mint.webp" alt="mint" width={64} height={64} />
            <h2 className={styles.selectBoxTitle}>GEN-2 MINT<br></br>[ ONLINE ]</h2>
            <p className={styles.selectBoxDescription}>
            {"GEN-2 BOTS; Repurposed Robots Taken From COG Corp Factories."}
            </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          {/* Staking GEN1 */}
          <Image src="/icons/token.webp" alt="token" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-1 GALLERY</h2>
          <p className={styles.selectBoxDescription}>
          {"- STAKING CURRENTLY OFFLINE -"}
          </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push("/stakegen2")}
        >
          {/* Staking GEN2 */}
          <Image src="/icons/token2.webp" alt="token2" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-2 GALLERY</h2>
          <p className={styles.selectBoxDescription}>
          {"- STAKING CURRENTLY OFFLINE -"}
          </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/vote`)}
        >
          {/* VOTE */}
          <Image src="/icons/vote.webp" alt="vote" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}> -THE SIGNAL- </h2>
          <p className={styles.selectBoxDescription}>
          {"Vote on Story Events and Choices."}
          </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/recycle`)}
          >
          {/* RECYCLE */}
          <Image src="/icons/recycle.webp" alt="burn2mint" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}> RECYCLE BOTS </h2>
          <p className={styles.selectBoxDescription}>
            {"Burn Old Bots to Mint Upgraded Scrap."}
          </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => window.open('https://botbattle.botsofcog.io/', '_self')}
        >
          {/* BOT BATTLE */}
          <Image src="/icons/botbattle.webp" alt="botbattle" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>BOT BATTLE</h2>
          <p className={styles.selectBoxDescription}>
            {"Burn/Transfer Bots To Others to Gain Death Cogs! Prizes Each Season."}
          </p>
        </div>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => window.open('https://botsofcog.io/links/', '_self')}
        >
          {/* LINKS */}
          <Image src="/icons/extra.webp" alt="links" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>LINK HUB</h2>
          <p className={styles.selectBoxDescription}>
            {"Official Links to ALL BOTS OF COG Related Online Content."}
          </p>
        </div>
      </div>
      <p>{/* <a href="https://botrepo.botsofcog.io/stakegen2">- Stake Your GEN2 Bot(s) For COGz Tokens -</a><br></br> */}
        <a href="https://www.botsofcog.io">- BACK TO BOTS OF COG HOMEPAGE -</a>
        <br />
        <a href="https://twitter.com/botsofcog">- BoC Twitter -</a>
        <br></br>
      </p>
    </div>
  );
  
};

export default Home;
