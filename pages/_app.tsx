import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import { ThirdwebNftMedia, useContract, useNFTs, useContractMetadata } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={137}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;