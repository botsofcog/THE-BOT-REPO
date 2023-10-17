import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import {
  useContract,
  useContractRead,
  useContractWrite,
  useAddress,
  ConnectWallet,
  useSDK,
  ThirdwebProvider,
  useNFTBalance,
  useTokenBalance,
  useBalance,
} from "@thirdweb-dev/react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import GetProposalInfo from "../components/GetProposalInfo";
import snapshot from "@snapshot-labs/snapshot.js";
import moment from "moment";
import Modal from "../components/Modal";
import {
  IoExitOutline,
  IoCheckmarkOutline,
  IoCheckmarkCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import Loading from "../components/Loading";
import { SNAPSHOT_SPACE } from "../consts/snapshot";
import ReactMarkdown from 'react-markdown'
import Image from "next/image";
import { Token } from "graphql";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
interface Proposal {
  id: number;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  scores: number[];
  scores_by_strategy: number[][];
  scores_total: number;
  scores_updated: number;
  author: string;
  type: string;
  space: {
    id: string;
    name: string;
  };
}

const CONTRACT_ADDRESS = "0xC432013CbA34F5202c3cAf109d3456d3b97e11bB";

const GET_SPACES = gql`
  query {
    space(id: "${SNAPSHOT_SPACE}") {
      id
      name
      about
      network
      symbol
      members
    }
  }
`;
const GET_PROPOSALS = gql`
  query Proposals {
    proposals(
      first: 3
      skip: 0
      where: { space_in: ["${SNAPSHOT_SPACE}"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      scores
      scores_by_strategy
      scores_total
      scores_updated
      author
      space {
        id
        name
      }
      type
    }
  }
`;

export default function Home() {
  const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
  const contractAddress1 = "0x1bbca92fc889af891e3b666aee7cb3534b83d7b7";
  const contractAddress2 = "0x8B9Ada84CBFBE266d103E6c90717Df789B63d0F7";
  const client = new snapshot.Client712(hub);
  const router = useRouter();
  const address = useAddress();
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const sdk = useSDK();
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const web3 = sdk?.getSigner()?.provider;

  const contract1 = useContract(contractAddress1);
  const contract2 = useContract(contractAddress2);

  const proposalsQuery = useQuery(GET_PROPOSALS);

  const [votes, setVotes] = useState<number[]>([]);
  const [votingPower, setVotingPower] = useState<number[]>([]);
  const [voteSuccess, setVoteSuccess] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [quadraticSelection, setQuadraticSelection] = useState<number[][]>([]);
  // nessecary for parsing markdown images
  const [proposalBodies, setProposalBodies] = useState<string[]>([])
  const [balance1, setBalance1] = useState<number>()
  const [balance2, setBalance2] = useState<number>()
  const [width, setWidth] = useState<number>(0)

  let markdownComponents = {
    //This custom renderer changes how images are rendered
    //we use it to constrain the max width of an image to its container
    img: (image:any) => {
      return (
        <img
          src={image.src}
          alt={image.alt}
          style={{width: width / 3, minWidth: 200}}
        />
      )
    }
  };
  useEffect(() => {
    function handleResize() {
      // Set window width/height to state
      setWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);
     
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  useEffect(() => {
    proposalsQuery?.data?.proposals.map(
      (proposal: Proposal, proposalIndex: number) => {
        if (proposal.type == "quadratic") {
          quadraticSelection[proposalIndex] = new Array(
            proposal.choices.length
          ).fill(0);
        }
      }
    );
  }, [proposalsQuery]);

  // whenever proposalsQuery is updated, update proposalBodies for up to date info
  useEffect(() => {
    let tempProposalBodies: string[] = []
    proposalsQuery?.data?.proposals?.map((proposal: Proposal, proposalIndex: number) => {
      //formats body so that ifps images work
      let hasLeftBracket = false
      let msg = proposal.body
      for (let i = 0; i < msg.length; i++) {
        if (msg[i] == '[') hasLeftBracket = true
        else if (
          msg[i] == ']' &&
          hasLeftBracket &&
          msg[i+1] + msg[i+2] + msg[i+3] + msg[i+4] + msg[i+5] + msg[i+6] + msg[i+7] + proposal.body[i+8] == "(ipfs://") {
          msg = msg.slice(0, i + 2) + "https://snapshot.4everland.link/ipfs/" + msg.slice(i + 9, msg.length - 1)
          hasLeftBracket = false
        }
        else if (msg[i] == ']') hasLeftBracket = false
      }
      tempProposalBodies.push(msg)
    })

    setProposalBodies(tempProposalBodies)

  }, [proposalsQuery])

  const NFTBalance1 = useNFTBalance(contract1.contract, address, 0);
  const NFTBalance2 = useNFTBalance(contract2.contract, address, 0);

  useEffect(() => {
    setBalance1(NFTBalance1?.data ? parseInt(NFTBalance1.data._hex, 16) : 0)
  }, [contract1, address, NFTBalance1])

  useEffect(() => {
    setBalance2(NFTBalance2?.data ? parseInt(NFTBalance2.data._hex, 16) : 0)
  }, [contract2, address, NFTBalance2])


  const [isOpen, setIsOpen] = useState<boolean>(false);

  // console.log(address)
  // console.log(isOpen)
  // console.log(votingPower)
  // console.log(votes)
  // console.log("PROPOSAL QUERY", proposalsQuery.data)

  //formats numbers
  const nFormatter = (num: number, digits: number) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  };
  
  const handleVote = async (proposalIndex: number, choiceIndex?: number) => {
    const proposalID = proposalsQuery?.data.proposals[proposalIndex].id;
    const proposalType = proposalsQuery?.data.proposals[proposalIndex].type;
    let choice: any;

    setIsOpen(true);
    if (balance1 == 0 && balance2 == 0) {
      setModalIndex(3);
      return;
    }
    if (!address) {
      setModalIndex(1)
      return
    }
    if (proposalsQuery?.data.proposals[proposalIndex].state == "closed") {
      setModalIndex(1)
      return
    }
    if (proposalType == "single-choice" && typeof(choiceIndex) == "number")
      choice = choiceIndex + 1;
    else if (proposalType == "quadratic") {
      choice = {};
      quadraticSelection[proposalIndex].map((selection, index) => {
        choice[(index + 1).toString()] = selection;
      });
    }
    else return;

    setModalIndex(2);

    try {
      console.log({
        space: SNAPSHOT_SPACE,
        proposal: proposalID,
        type: proposalType,
        choice: choice,
        reason: "",
        app: "snapshot",
      })
      if (web3) {
        // @ts-ignore
        await client.vote(web3, address?address:"", {
          space: SNAPSHOT_SPACE,
          proposal: proposalID,
          type: proposalType,
          choice: choice,
          reason: "",
          app: "snapshot",
        });
        setModalIndex(0);
        setVoteSuccess(true);
      }
      else throw new Error("web3 undefined")
      console.log("success")
    } catch (e) {
      console.log("ERROR: ", e);
      setModalIndex(1);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "4% 8%",
        textAlign: "left",
        color: "rgba(255,166,0,1)",
        position: "relative",
      }}
    >
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {modalIndex == 0 && (
          <>
            <h3 style={{ margin: "15px 0px 30px 0px" }}>Your Vote is In!</h3>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0)",
                color: "rgba(255,166,0,1)",
                border: "1px solid rgba(255,166,0,0.5)",
                padding: "10px",
                borderRadius: "20px",
              }}
            >
              Close
            </button>
          </>
        )}
        {modalIndex == 1 && (
          <>
            <h3 style={{ margin: "15px 0px 30px 0px" }}>Failed to vote</h3>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0)",
                color: "rgba(255,166,0,1)",
                border: "1px solid rgba(255,166,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                borderRadius: "20px",
              }}
            >
              Close
            </button>
          </>
        )}
        {modalIndex == 2 && <Loading />}
        {modalIndex == 3 && (
          <>
            <h3>Sorry, you need a Gen 1 or Gen 2 Bot in order to Vote!</h3>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0)",
                color: "rgba(255,166,0,1)",
                border: "1px solid rgba(255,166,0,0.5)",
                padding: "10px",
                borderRadius: "20px",
              }}
            >
              Close
            </button>
          </>
        )}
      </Modal>

      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <button onClick={router.back} className={styles.backArrow}>
            <IoArrowBackOutline size={25} color="rgba(255,166,0,1)" />
          </button>
          <p><b>Bots in Account</b> <br></br>
            <i>Gen-1 : {balance1} <br></br> Gen-2 : {balance2}</i>
            <br></br>
            <br></br>
            <b>COGz in Account</b><br></br>
            <p>
                <i>{tokenBalance?.displayValue}</i> {tokenBalance?.symbol}
              </p>
          </p>
        </div>
        <h1 style={{ wordWrap: "break-word", color: "#64b4ff" }}>"The Signal" <br></br> Vote on The Story So Far...</h1>
<p><h4>* Users Must Have At Least One(1) Bot Unstaked To Verify Their Vote.<br></br> <i>(COG Bots Cannot Mine COGz & Verify Votes At the Same Time)</i> <br></br>
<br></br>* Voting Does Not Permanently "Spend" Users COGz.<br></br> Make Sure To Withrdraw Any Mined COGz Before Voting! <i> (The Quantity of COGz Held Equals Your Current Voting Power) </i></h4><br></br>Happy Voting!</p><br></br>
          <ConnectWallet />
          {balance1 == 0 && balance2 == 0 && (
            <h3>You must hold either a&nbsp;
              <a
                href={"https://opensea.io/collection/botsofcog"}
                target="_blank"
                style={{ color: "rgba(255,255,0,1)" }}
              >
                Gen1
              </a>
              &nbsp;or&nbsp;
              <a
                href={"../mint"}
                target="_blank"
                style={{ color: "rgba(255,255,0,1)" }}
              >
                Gen2
              </a>
              &nbsp;'Bots Of COG' NFT <u>In Your Wallet</u>, In Order To Vote. <br></br><i>(Please Unstake A Minimum of 1 Bot)</i>
            </h3>
          )}



        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "20px",
            marginTop: "50px",
          }}
        >
          {proposalsQuery?.data?.proposals?.map(
            (proposal: Proposal, proposalIndex: number) => {

              let winner = -1;
              for (let i = 0; i < proposal.scores.length - 1; i++) {
                let max = true;

                for (let j = i + 1; j < proposal.scores.length; j++) {
                  if (proposal.scores[i] <= proposal.scores[j]) {
                    max = false;
                  }
                }

                if (max == true) {
                  winner = i;
                }
              }
              if (winner == -1) winner = proposal.scores.length - 1

              return (
                <div key={proposalIndex} className={styles.proposalContainer}>
                  {/* dont ask me why this components isnt returning any jsx if it works it works :) */}
                  <GetProposalInfo
                    proposalsQuery={proposalsQuery}
                    setVoteSuccess={setVoteSuccess}
                    voteSuccess={voteSuccess}
                    votes={votes}
                    setVotes={setVotes}
                    votingPower={votingPower}
                    setVotingPower={setVotingPower}
                    address={address}
                    proposalID={
                      proposalsQuery?.data?.proposals[proposalIndex].id
                    }
                    index={proposalIndex}
                  />

                  {/* Left Column */}
                  <div
                    key={proposalIndex}
                    style={{
                      flexWrap: "wrap",
                      gap: "30px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexGrow: 1,
                    }}
                  >
                    {/* Description Wrapper */}
                    <div style={{ lineHeight: "30px"}}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          {/* Proposal Title */}
                          <h3 style={{ margin: "0px" }}>{proposal.title}</h3>
                          {/* Author */}
                          <p
                            style={{
                              margin: "5px 0px 15px 0px",
                              color: "rgba(255,166,0,0.7)",
                              fontSize: "14px",
                            }}
                          >
                            Created by{" "}
                            {proposal.author.substring(0, 5) +
                              "..." +
                              proposal.author.substring(
                                proposal.author.length - 5,
                                proposal.author.length - 1
                              )}
                          </p>
                        </div>

                        {/* Proposal State */}
                        <div
                          style={{
                            marginBottom: "20px",
                            height: "fit-content",
                            backgroundColor:
                              proposal.state == "active"
                                ? "rgba(102,190,101, 1)"
                                : "rgba(235,102,101, 1)",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "5px 15px",
                            borderRadius: "10px",
                          }}
                        >
                          <p style={{ margin: "0px" }}>
                            {proposal.state.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <ReactMarkdown children={proposalBodies[proposalIndex]} components={markdownComponents}/>
                      </div>
                    </div>

                    {/* Choices */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        gap: "15px",
                      }}
                    >
                      {proposal.type == "single-choice" &&
                        proposal.choices.map((choice, choiceIndex) => {
                          return (
                            <button
                              key={choiceIndex}
                              onClick={() => {
                                handleVote(proposalIndex, choiceIndex);
                              }}
                              className={styles.proposalButton}
                              style={{
                                ...(votes[proposalIndex] == choiceIndex + 1 ||
                                (choiceIndex == winner &&
                                  proposal.state == "closed")
                                  ? { backgroundColor: "rgba(255,255,255,0.2)" }
                                  : {}),
                                ...{
                                  pointerEvents:
                                    proposal.state == "active"
                                      ? "auto"
                                      : "none",
                                },
                                ...{
                                  flexGrow: 0
                                },
                              }}
                            >
                              {votes[proposalIndex] == choiceIndex + 1 ||
                                (choiceIndex == winner &&
                                  proposal.state == "closed" && (
                                    <IoCheckmarkOutline size={18} />
                                  ))}
                              <p style={{ margin: 0 }}>
                                {choice}
                              </p>
                              {/* <div>
                                {nFormatter(proposal.scores[choiceIndex], 1)}{" "}
                                COGz
                              </div> */}
                            </button>
                          );
                        })
                      }
                      {proposal.type == "quadratic" && (
                        <>
                          {proposal.choices.map((choice, choiceIndex) => {
                            return (
                              <div
                                key={choiceIndex}
                                // onClick={() => {handleVote(proposalIndex, choiceIndex)}}
                                className={styles.proposalButton}
                                style={{
                                  ...(votes[proposalIndex] == choiceIndex + 1 ||
                                  (choiceIndex == winner &&
                                    proposal.state == "closed")
                                    ? { backgroundColor: "rgba(255,255,255,0.2)" }
                                    : {}),
                                  ...{
                                    pointerEvents:
                                      proposal.state == "active"
                                        ? "auto"
                                        : "none",
                                  },
                                  ...{
                                    flexGrow: 0,
                                  }
                                }}
                              >
                                {votes[proposalIndex] == choiceIndex + 1 ||
                                  (choiceIndex == winner &&
                                    proposal.state == "closed" && (
                                      <IoCheckmarkOutline size={18} />
                                    )
                                  )
                                }
                                <p style={{ margin: 0 }}>
                                  {choice}
                                </p>
                                {
                                  // proposal.state != "closed" && (
                                    <>
                                      {/* - button */}
                                      <button
                                        style={{ color: "rgba(255,166,0,1)" }}
                                        onClick={() => {
                                          let tempQuadraticSelection: number[][] = [];
                                          quadraticSelection.map(
                                            (selection, index) => {
                                              tempQuadraticSelection[index] =
                                                selection;
                                            }
                                          );
                                          if (
                                            tempQuadraticSelection[proposalIndex][
                                              choiceIndex
                                            ] > 0
                                          ) {
                                            tempQuadraticSelection[proposalIndex][
                                              choiceIndex
                                            ] =
                                              tempQuadraticSelection[proposalIndex][
                                                choiceIndex
                                              ] - 1;
                                          }

                                          setQuadraticSelection(
                                            tempQuadraticSelection
                                          );
                                        }}
                                      >
                                        -
                                      </button>
                                      <p>
                                        {quadraticSelection[proposalIndex] &&
                                          quadraticSelection[proposalIndex][
                                            choiceIndex
                                          ]}
                                      </p>
                                      {/* + button */}
                                      <button
                                        style={{ color: "rgba(255,166,0,0.7)" }}
                                        onClick={() => {
                                          let tempQuadraticSelection: number[][] = [];
                                          quadraticSelection.map(
                                            (selection, index) => {
                                              tempQuadraticSelection[index] =
                                                selection;
                                            }
                                          );
                                          tempQuadraticSelection[proposalIndex][
                                            choiceIndex
                                          ] =
                                            tempQuadraticSelection[proposalIndex][
                                              choiceIndex
                                            ] + 1;

                                          setQuadraticSelection(
                                            tempQuadraticSelection
                                          );
                                        }}
                                      >
                                        +
                                      </button>

                                    </>
                                  // )
                                }
                                {/* <div>
                                  {Math.round(
                                    proposal.scores[choiceIndex] * 100
                                  ) / 100}{" "}
                                  COGz
                                </div> */}
                              </div>
                            );
                          })}
                          {proposal.state == "active" &&
                            <button
                              className={styles.proposalButton}
                              onClick={() => handleVote(proposalIndex)}
                            >
                              Vote
                            </button>
                          }
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, gap: "15px"}}>
                    {/* Top */}
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        padding: "30px 7%",
                        borderRadius: "20px",
                        display: "flex",
                        // justifyContent: "space-between",
                        flexDirection: 'column',
                        width: "100%",
                      }}
                    >
                      <h3 style={{marginTop: 0}}>
                        Information
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: 'column',
                          justifyContent: "space-between",
                          gap: "20px",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(255,166,0,0.7)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: "20px",
                            flexWrap: "wrap",
                            justifyContent: "space-between",

                          }}
                        >
                          <p>Start Date </p>
                          <p style={{color: "rgba(255,166,0,1)",}}>{moment(proposal.start * 1000).format("lll")}</p>
                        </div>
                        <div
                          style={{
                            color: "rgba(255,166,0,0.7)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: "20px",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>End Date </p>
                          <p style={{color: "rgba(255,166,0,1)",}}>{moment(proposal.end * 1000).format("lll")}</p>
                        </div>
                        <div
                          style={{
                            color: "rgba(255,166,0,0.7)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: "20px",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>Snapshot </p>
                          <a
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              color: "rgba(255,166,0,1)",
                              textDecoration: "none",
                            }}
                            href={`https://etherscan.io/block/` + proposal.snapshot}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <p style={{ margin: 0 }}>{proposal.snapshot}</p>
                            <IoExitOutline />
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Bottom */}
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        padding: "30px 7%",
                        borderRadius: "20px",
                        display: "flex",
                        // justifyContent: "space-between",
                        flexDirection: 'column',
                        width: "100%",
                      }}
                    >
                      <h3 style={{marginTop: 0}}>
                        Results
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: 'column',
                          justifyContent: "space-between",
                          gap: "20px",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      >
                        {
                          proposal.choices.map((choice, choiceIndex) => {
                            return (
                              <div
                                key={choiceIndex}
                                style={{
                                  pointerEvents: 'none',
                                  display: 'flex',
                                  justifyContent: 'between',
                                
                                }}
                              >
                                <p style={{ margin: 0, marginRight: "auto", color: "rgba(255,166,0,0.7)", }}>
                                  {choice}
                                </p>
                                <div>
                                  {nFormatter(proposal.scores[choiceIndex], 1)}{" "}
                                  COGz
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </>
    </div>
  );
}
