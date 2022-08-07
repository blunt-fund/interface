import RoundViewMain from "../RoundViewMain"

export const rounds = [
  {
    name: "Test round 1",
    descriptionHtml: "",
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
    roundId: 1
  },
  {
    name: "Test round 2",
    descriptionHtml: "",
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
    roundId: 2
  }
]

const MyRounds = () => {
  return (
    <div className="space-y-20">
      {rounds.map((round, i) => (
        <div key={i}>
          <RoundViewMain
            name={round.name}
            descriptionHtml={round.descriptionHtml}
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
          />
        </div>
      ))}
    </div>
  )
}

export default MyRounds
