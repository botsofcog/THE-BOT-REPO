import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import { ThirdwebNftMedia, useContract, useNFTs, useContractMetadata } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      activeChain="polygon" 
      clientId="09bddeb436c778006bbfb6c89c8bf588" // You can get a client id from dashboard settings
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
