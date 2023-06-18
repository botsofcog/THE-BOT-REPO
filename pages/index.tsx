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
          {/* Staking GEN1 */}
          <Image src="/icons/token.webp" alt="token" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-1 BOT STAKING</h2>
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
          <h2 className={styles.selectBoxTitle}>VOTE dApp (Closed)</h2>
          <p className={styles.selectBoxDescription}>
          </p>
        </div>

        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/mint`)}
        >
          {/* MINT */}
          <Image src="/icons/mint.webp" alt="mint" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>GEN-2 MINT</h2>
          <p className={styles.selectBoxDescription}>
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
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
