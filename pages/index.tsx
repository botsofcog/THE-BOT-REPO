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
          onClick={() => router.push(`/stake`)}
        >
          {/* Staking an NFT */}
          <Image src="/icons/token.webp" alt="token" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>STAKE YOUR COG BOTS</h2>
          <p className={styles.selectBoxDescription}>
          </p>
        </div>

         <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/vote`)}
        >
          {/* VOTE */}
          <Image src="/icons/drop.webp" alt="vote" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>VOTE</h2>
          <p className={styles.selectBoxDescription}>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Home;
