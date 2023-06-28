import Link from "next/link"
import Button from "../Button"

const HomeHowItWorks = () => {
  return (
    <div>
      <h2 className="pb-12 text-xl text-gray-500">How it works</h2>
      <div className="text-left prose">
        <p>
          Fixed rules guarantee that all Blunt rounds behave the same way,
          and allow fundraisers to start a round in seconds.
        </p>
        <h2>Blunt rules</h2>
        <ul className="text-gray-700">
          <li>
            <b className="text-yellow-600">Pay ETH in exchange for tokens</b> to
            become a round contributor
          </li>
          <li>
            <b className="text-yellow-600">All funds raised are refundable</b>{" "}
            until the fundraising target is met and the round is closed
          </li>
          <li>
            A <b className="text-yellow-600">target</b> and{" "}
            <b className="text-yellow-600">hard cap</b> can be set to limit the
            minimum and maximum raised in a round
          </li>
          <li>
            Once the <b className="text-yellow-600">deadline</b> is reached,
            a rounds cannot accept any more contributions
          </li>
          <li>
            Rounds without a deadline can accept contributions until
            they&apos;re manually closed by their owner
          </li>
          <li>
            When a successful round is closed, ownership of the project is given
            to the round owner who can then manage the raised funds on{" "}
            <Link href="https://juicebox.money/">Juicebox</Link>
          </li>
          <li>
            Blunt only takes a fee from successful rounds in exchange for BLUNT
            governance tokens. The fee varies between 1,5% and 3,5% of the total
            amount raised (excl. the 2,5% Juicebox fee) so the more you raise
            the less you pay
          </li>
        </ul>
      </div>
      <p className="pt-4 text-sm font-bold text-gray-400">
        Blunt is built on the battle-tested{" "}
        <a
          href="https://juicebox.money"
          className="highlight text-gray-400"
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
