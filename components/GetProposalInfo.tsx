import { useQuery, gql } from "@apollo/client"
import { useEffect } from 'react'
import { SNAPSHOT_SPACE } from '../consts/snapshot'
const GET_VOTING_POWER = gql`
  query VP($voter: String!, $proposal: String!){
    vp (
      space: "${SNAPSHOT_SPACE}"
      voter: $voter
      proposal: $proposal
      ) {
        vp
        vp_by_strategy
        vp_state
      } 
  }
`
const GET_VOTES = gql`
  query VOTES($proposal: String!){
    votes (
      first: 1000
      skip: 0
      where: {
        proposal: $proposal
      }
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      voter
      vp
      vp_by_strategy
      vp_state
      created
      proposal {
        id
      }
      choice
      space {
        id
      }
    }
  }
`
const GetProposalInfo = ({proposalsQuery, setVoteSuccess, voteSuccess, votes, setVotes, votingPower, setVotingPower, address, proposalID, index}: any) => {

  const votingPowerQuery = useQuery(GET_VOTING_POWER, {variables: {voter: address, proposal: proposalID}})
  const voteQuery = useQuery(GET_VOTES, {variables: {proposal: proposalID}})
  // console.log("Vote Query", voteQuery.data.votes)

  useEffect(() => {
    if (voteSuccess) {
      voteQuery.refetch({proposal: proposalID})
      proposalsQuery.refetch()
      setVoteSuccess(false)
    }
  }, [voteSuccess])

  // once votingPowerQuery gets data, put it into state
  useEffect(() => {
    if (votingPowerQuery?.data) {
      let tempVotingPower = [...votingPower]
      tempVotingPower[index] = votingPowerQuery?.data?.vp.vp
      setVotingPower(tempVotingPower)
    }
    // console.log(data)
  }, [votingPowerQuery])

  //once voteQuery gets data, put it into state
  useEffect(() => {
    if (voteQuery?.data?.votes) {
      let tempVotes: number[] = [...votes]
      voteQuery.data.votes.map((vote:any, voteIndex:number) => {
        if (vote.voter == address) {
          tempVotes[index] = vote.choice
        }
      })
      setVotes(tempVotes)
    }
    // console.log(data)
  }, [voteQuery])

  return <></>
}

export default GetProposalInfo