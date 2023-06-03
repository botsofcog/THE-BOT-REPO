import { useState, useEffect } from "react";
import { useContractEvents, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ThirdwebProvider, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { VoteType } from "@thirdweb-dev/sdk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sdk = new ThirdwebSDK("polygon");

const Home: NextPage = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<{id: string, name: string, description: string, votes: number, deadline: number}[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<{id: string, name: string, description: string, votes: number, deadline: number} | null>(null);
  const [voteChoice, setVoteChoice] = useState<"yes" | "no" | null>(null);
  const [voted, setVoted] = useState(false);
  const [voteValue, setVoteValue] = useState<number | null>(null);

  // Define a function to refresh the proposals
  const refreshProposals = async () => {
    const contract = await sdk.getContract(
      "0xC432013CbA34F5202c3cAf109d3456d3b97e11bB"
    );
    const result = await contract.call("getAllProposals");
    console.log("proposals:", result); // Check the value of the proposals
    setProposals(result);
  };

  // Call the refresh function once when the component mounts
  useEffect(() => {
    refreshProposals();
  }, []);

  // Define a function to handle the vote submission
  const submitVote = async () => {
    console.log("selectedProposal:", selectedProposal);
    console.log("selectedProposal?.id:", selectedProposal?.id);

    if (!selectedProposal || !selectedProposal.id) {
      console.error("Proposal or Proposal ID is null or undefined");
      return;
    }

    console.log("Submitting vote...");

    const voteContract = await sdk.getContract(
      "0xC432013CbA34F5202c3cAf109d3456d3b97e11bB"
    );
    const cogzContract = await sdk.getContract(
      "0xd82f89a16Bf2dECc0d6cb96CA12F1306fb623D42"
    );

    // Get the ID of the selected proposal
    const proposalId = selectedProposal?.id;

    // Convert the proposal ID from string to number
    const proposalIdNum = parseInt(proposalId);

    // Check if voteChoice and voteValue are not null
    if (!voteChoice || voteValue === null || voteValue <= 0) {
      console.error("Vote choice or vote value is null, undefined, or less than or equal to 0");
      return;
    }

    // Determine the vote type based on the selected vote choice
    let voteType: VoteType;
    if (voteChoice === "yes") {
      voteType = VoteType.For;
    } else {
      voteType = VoteType.Against;
    }

    // Approve or abstain based on the vote choice
    try {
      const approveResult = await cogzContract.call(
        "approve",
        "0xC432013CbA34F5202c3cAf109d3456d3b97e11bB",
        voteValue
      );

      if (voteChoice === "yes") {
        const result = await voteContract.call(
          "approve",
          proposalIdNum,
          voteType,
          voteValue
        );
      } else {
        const result = await voteContract.call(
          "abstain",
          proposalIdNum,
          voteValue
        );
      }

      console.log("Vote submitted successfully");
      setVoted(true);
      toast.success("Your vote has been submitted!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>VOTE</h1>

      <div className={styles.proposalContainer}>
        {/* Render one box for each proposal */}
        {proposals.map((proposal) => {
          console.log("proposal:", proposal);
          return (
            <div key={proposal.id} className={styles.nftBox}>
              <h2 className={styles.h2}>{proposal.name}</h2>
              <p>{proposal.description}</p>
              <p>Votes: {proposal.votes}</p>
              <p>Deadline: {proposal.deadline}</p>
              <button
                className={styles.voteButton}
                onClick={() => {
                  setSelectedProposal(proposal);
                  setVoteChoice(null);
                  setVoted(false);
                  console.log("selectedProposal after click:", selectedProposal);
                }}
              >
                VOTE
              </button>
            </div>
          );
        })}
      </div>

      {/* Overlay and vote modal */}
      {selectedProposal && (
        <div className={`${styles.overlay} ${styles.modal}`}>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.voteButton} ${styles.yesButton}`}
              onClick={() => {
                setVoteChoice("yes");
                console.log("Vote choice set to Yes");
                console.log("voteChoice:", voteChoice);
              }}
              disabled={voted}
            >
              Yes
            </button>

            <button
              className={`${styles.voteButton} ${styles.noButton}`}
              onClick={() => setVoteChoice("no")}
              disabled={voted}
            >
              No
            </button>
          </div>

          <div className={styles.buttonContainer}>
            <input
              type="number"
              placeholder="Enter COGz token amount"
              className={styles.tokenInput}
              onChange={(event) => setVoteValue(parseInt(event.target.value))}
              value={voteValue ?? ""}
              disabled={voted}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.voteButton} ${styles.submitButton}`}
              onClick={submitVote}
              disabled={!voteChoice || voted}
            >
              Submit Vote
            </button>
            <br />
            {voted && (
              <p className={styles.voteConfirmation}>
                Your vote has been submitted!
              </p>
            )}
            <button
              className={styles.submitButton}
              onClick={() => {
                setSelectedProposal(null);
                setVoteChoice(null);
                setVoted(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Home;
