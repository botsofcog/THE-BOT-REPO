import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";

const CONTRACT_ADDRESS = "0xC432013CbA34F5202c3cAf109d3456d3b97e11bB";

interface Proposal {
  proposalId: number;
  description: string;
  proposalVotes: {
    forVotes: string;
    againstVotes: string;
  };
  state: number;
}

const proposalStateMapping = [
  "Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"
];

export default function Home() {
  const router = useRouter();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: proposals } = useContractRead(contract, "getAllProposals", []);
  const { mutateAsync: castVote, isLoading } = useContractWrite(contract, "castVote");

  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      const data = await castVote({ args: [proposalId, support] });
      console.log("Vote casted:", data);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>COMING SOON</h1>
      <div className={styles.nftBoxGrid}>
        {proposals?.map((proposal: Proposal, index: number) => {
          const totalVotesFor = proposal?.proposalVotes?.forVotes || "0";
          const totalVotesAgainst = proposal?.proposalVotes?.againstVotes || "0";

          return (
            <div key={index} className={styles.optionSelectBox}>
              <h2 className={styles.selectBoxTitle}>{proposal.description}</h2>
              <p className={styles.selectBoxDescription}>
                State: {proposalStateMapping[proposal.state]}<br/>
                Votes For: {totalVotesFor}<br/>
                Votes Against: {totalVotesAgainst}
              </p>
              <button onClick={() => handleVote(proposal.proposalId, true)}>Vote Yes</button>
              <button onClick={() => handleVote(proposal.proposalId, false)}>Vote No</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
