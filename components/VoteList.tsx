import React, { useState, useEffect } from 'react';

interface Proposal {
  id: number;
  text: string;
}

interface VoteListProps {
  sdk: any;
  voteContractAddress: string;
}

const VoteList: React.FC<VoteListProps> = ({ sdk, voteContractAddress }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    async function fetchProposals() {
      // Logic to fetch active proposals from the vote contract
    }

    fetchProposals();
  }, [sdk, voteContractAddress]);

  const handleVote = async (proposalId: number, vote: string) => {
    // Logic to cast a vote using the SDK
  };

  return (
    <div>
      {proposals.map(proposal => (
        <div key={proposal.id}>
          <p>{proposal.text}</p>
          <button onClick={() => handleVote(proposal.id, 'yes')}>Yes</button>
          <button onClick={() => handleVote(proposal.id, 'no')}>No</button>
        </div>
      ))}
    </div>
  );
}

export default VoteList;
