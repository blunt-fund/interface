import Button from "../Button"

const HomeHowItWorks = () => {
  return (
    <div>
      <h2 className="pb-12 text-xl text-gray-500">How it works</h2>
      <div className="prose text-left">
        <p>
          A set of rules guarantees that all Blunt rounds behave the same way,
          and allows fundraisers to start a round in seconds.
        </p>
        <h2>Blunt rules</h2>
        <ul className="text-gray-700">
          <li>
            <b className="text-yellow-600">Pay ETH in exchange for tokens</b> to
            become a round contributor
          </li>
          <li>
            <b className="text-yellow-600">All funds raised are refundable</b>{" "}
            until a round is closed and the fundraising target has been reached
          </li>
          <li>
            A <b className="text-yellow-600">target</b> and{" "}
            <b className="text-yellow-600">hardcap</b> can be set to limit the
            minimum and maximum amount to raise in a round
          </li>
          <li>
            Once the <b className="text-yellow-600">deadline</b> is reached
            rounds cannot accept any more contributions
          </li>
          <li>
            Rounds without deadline can accept contributions until they&apos;re
            manually closed by their owner
          </li>
          <li>
            When a successful round is closed, ownership of the project is given
            to the round owner who can then manage the raised funds on Juicebox
          </li>
          <li>
            Blunt takes a fee only from successful rounds in exchange for BLUNT
            governance tokens. The fee varies between 1,5% and 3,5% of total
            amount raised (excl. 2,5% Juicebox fee) so the more you raise the
            less you pay
          </li>
        </ul>
      </div>
      <p className="pt-4 text-sm font-bold text-gray-400">
        Blunt is built on the battle-tested{" "}
        <a
          href="https://juicebox.money"
          className="text-gray-400 highlight"
          target="_blank"
          rel="noreferrer"
        >
          Juicebox
        </a>{" "}
        protocol
      </p>
      <div className="pt-12">
        <Button label="Create round" href="/create" />
      </div>
    </div>
  )
}

export default HomeHowItWorks
