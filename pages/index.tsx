import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>THE BOTS OF COG REPO</h1>
      <div className={styles.nftBoxGrid}>

      <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/mint`)}
        >
          {/* MINT */}
          <Image src="/icons/mint.webp" alt="mint" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-2 MINT</h2>
          <p className={styles.selectBoxDescription}>
          {"Mint A GEN-2 BOT; Repurposed Robots Taken From COG Corp Factories."}
          </p>
        </div>

        <div
  className={styles.optionSelectBox}
  role="button"
  onClick={() => window.open('https://botbattle.botsofcog.io/', '_self')}
>
  {/* BOT BATTLE */}
  <Image src="/icons/botbattle.webp" alt="botbattle" width={64} height={64} />
  <h2 className={styles.selectBoxTitle}>Bot Battle</h2>
  <p className={styles.selectBoxDescription}>
    {"Burn/Transfer Bots To Others to Gain Death Cogs! Prizes Each Season."}
  </p>
</div>

<div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          {/* Staking GEN1 */}
          <Image src="/icons/token.webp" alt="token" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-1 BOT STAKING</h2>
          <p className={styles.selectBoxDescription}>
          {"Stake Your Gen 1 Bots For COGz Tokens."}
          </p>
        </div>

     <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stakegen2`)}
        >
          {/* Staking GEN2 */}
          <Image src="/icons/token2.webp" alt="token2" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-2 BOT STAKING</h2>
          <p className={styles.selectBoxDescription}>
          {"Stake Your Gen 2 Bots For COGz Tokens."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
