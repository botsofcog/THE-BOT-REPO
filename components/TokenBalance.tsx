import React, { useState, useEffect } from 'react';

interface TokenBalanceProps {
  sdk: any;
  tokenAddress: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ sdk, tokenAddress }) => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchBalance() {
      const userAddress = await sdk.signer.getAddress();
      const userBalance = await sdk.tokens.balanceOf(tokenAddress, userAddress);
      setBalance(userBalance);
    }

    fetchBalance();
  }, [sdk, tokenAddress]);

  return (
    <div>
      Your Token Balance: {balance}
    </div>
  );
}

export default TokenBalance;
