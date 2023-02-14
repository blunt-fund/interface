import Button from "../Button"

const HomeHowItWorks = () => {
  return (
    <div>
      <h2 className="pb-12 text-xl text-gray-500">How it works</h2>
      <div className="prose text-left">
        <p>
          Blunt rounds are{" "}
          <b className="text-yellow-600">trustless funding rounds</b> where
          contributors can get refunds if the fundraising target isn&apos;t
          reached.
        </p>
        <p>
          A set of pre-defined rules guarantees that all Blunt rounds behave the
          same way, and allows fundraisers to start a round in seconds.
        </p>
        <h3>Blunt rules</h3>
        <ul className="text-gray-700">
          <li>Contributions can be made anytime while a round is active.</li>
          <li>
            <b className="text-yellow-600">Full refunds</b> can be obtained by
            contributors while a round is active, or once it has concluded
            unsuccessfully.
          </li>
          <li>
            <b className="text-yellow-600">
              A round is successful when the fundraising target is reached
            </b>
            . If the target is not reached before the deadline (or the round is
            closed), contributors can get full refunds for their contributions.
          </li>
          <li>
            A deadline can be set to limit the period of time in which
            contributions are accepted. Rounds without deadline can accept
            contributions until they&apos;re closed by their owner.
          </li>
          <li>A hard cap can be set to limit the maximum raised amount.</li>
          <li>
            When a round ends successfully, ownership of the project is
            transferred to the rightful owner, who can then manage the funds
            raised from Juicebox.
          </li>
          <li>
            Blunt takes a fee from successful rounds in exchange for BF
            governance tokens. The fee varies between 1,5% and 3,5% of total
            amount raised (excluding 2,5% Juicebox base fee), so the more you
            raise the less you pay.
          </li>
        </ul>
      </div>
      <p className="pt-4 text-sm font-bold text-gray-400">
        Blunt Finance is built on the{" "}
        <a
          href="https://juicebox.money"
          className="text-gray-400 highlight"
          target="_blank"
          rel="noreferrer"
        >
          Juicebox
        </a>{" "}
        fundraising protocol.
      </p>
      <div className="pt-12">
        <Button label="Create round" href="/create" />
      </div>
    </div>
  )
}

export default HomeHowItWorks
