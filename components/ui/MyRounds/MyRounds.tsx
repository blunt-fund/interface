import RoundViewMain from "../RoundViewMain"

export const nullDate = 777600000
export const rounds = [
  {
    name: "Token round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "https://slice.so",
    twitter: "@jj_ranalli",
    discord: "https://slice.so",
    docs: "https://slice.so",
    tokenSymbol: "TEST1",
    tokenIssuance: 12345,
    duration: 21,
    target: 600,
    cap: 1000,
    isFundraiseEth: true,
    raised: 160,
    roundId: 1,
    reservedStake: 0,
    totalReserved: 10,
    transferTimestamp: 0,
    releaseTimestamp: 0
  },
  {
    name: "Slice round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    tokenSymbol: "TEST2",
    tokenIssuance: 0,
    duration: 0,
    target: 300000,
    cap: 0,
    isFundraiseEth: false,
    raised: 1200000,
    roundId: 2,
    reservedStake: 15,
    totalReserved: 30,
    transferTimestamp: 1669820296053,
    releaseTimestamp: 0
  },
  {
    name: "Token & slice round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    tokenSymbol: "TEST3",
    tokenIssuance: 1000000,
    duration: 14,
    target: 500,
    cap: 800,
    isFundraiseEth: true,
    raised: 400,
    roundId: 3,
    reservedStake: 10,
    totalReserved: 25,
    transferTimestamp: 1669820296053,
    releaseTimestamp: 1679820296053
  }
]

const MyRounds = () => {
  return (
    <div className="space-y-20">
      {rounds.map((round, i) => (
        <div key={i}>
          <RoundViewMain
            name={round.name}
            image={round.image}
            website={round.website}
            twitter={round.twitter}
            discord={round.discord}
            docs={round.docs}
            tokenSymbol={round.tokenSymbol}
            tokenIssuance={round.tokenIssuance}
            duration={round.duration}
            target={round.target}
            cap={round.cap}
            isFundraiseEth={round.isFundraiseEth}
            raised={round.raised}
            roundId={round.roundId}
            reservedStake={round.reservedStake}
            secondary
          />
        </div>
      ))}
    </div>
  )
}

export default MyRounds
