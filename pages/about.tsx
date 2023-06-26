import {
  defaultDescription,
  defaultTitle,
  domain,
  longTitle,
} from "@components/common/Head";
import { Container } from "@components/ui";
import { NextSeo } from "next-seo";
import Link from "next/link";

export default function About() {
  return (
    <>
      <NextSeo
        title="about | blunt"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.png`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`,
            },
          ],
        }}
      />

      <Container page={true}>
        <main className="max-w-screen-sm pt-12 pb-8 mx-auto space-y-32">
          <h2>What does blunt do?</h2>
          <p>
            Blunt lets you launch a crowdfunding campaign and issue tokens to
            your supporters without the commitment – if you fail to reach your
            funding goal, refunds are trustlessly guaranteed to your supporters.
            If you meet your funding goal, you can run your project onchain with
            built-in payout management, token issuance, and other incentives:
            Blunt rounds are{" "}
            <Link href="https://juicebox.money/">Juicebox</Link> projects.
          </p>
          <p>
            Blunt also lets you reward your supporters by sending them ETH and
            your project&apos;tokens in the future.
          </p>

          <h2>How does blunt work?</h2>
          <p>
            Blunt allows anyone to launch a funding round with a pre-defined
            fundraising target. When people pay a Blunt round with ETH, they
            receive its tokens – while the round is ongoing, those tokens can be
            redeemed for a full ETH refund.
          </p>
          <p>
            If the funding goal isn&apos;t met by the time the round ends, new
            payments are paused and the ETH stays available for redemption.
          </p>
          <p>
            If the funding goal <em>is</em> met, the round and its funds are
            transferred to the round&apos;s creator (or another pre-defined
            address, like a multisig wallet) to manage – under the hood, Blunt
            rounds are <Link href="https://juicebox.money">Juicebox</Link>{" "}
            projects which are owned by a smart contract, and are only
            transferred if their fundraising target is met.
          </p>
          <p>Blunt rounds can also have:</p>
          <ul>
            <li>
              <b>A hard cap.</b>
              The cap is a maximum amount of ETH or USD a round can raise. Once
              the cap is met, any further payments are rejected.
            </li>
            <li>
              <b>A deadline.</b>
              Blunt rounds can have a deadline. If the round isn&apos;t
              successfully closed by the deadline, further payments are rejected
              and all all funds can be refunded.
            </li>
            <li>
              <b>A slicer.</b>
              Blunt can deploy a <Link href="https://slice.so/">
                slicer
              </Link>{" "}
              for your round. A slicer allows you to split tokens, ETH, or other
              onchain assets between your round&apos;s participants in the
              future.
            </li>
            <li>
              <b>Locks.</b>
              Blunt round participants are given a percentage of future token
              issuance, but by default, the project&apos;s owner can remove this
              allocation. Blunt lets you lock this percentage in place to assure
              prospective contributors.
            </li>
          </ul>

          <h2>FAQ</h2>
          <p>How much does blunt cost?</p>
          <p>
            Blunt only takes a fee from successful rounds in exchange for BLUNT
            governance tokens. The fee varies between 1,5% and 3,5% of the total
            amount raised (excl. the 2,5% Juicebox fee) so the more you raise
            the less you pay.
          </p>

          <p>How decentralized is blunt?</p>
          <p>
            Blunt is built with decentralized technology: Ethereum and Juicebox.
            Blunt rounds take place onchain, making them transparent and
            unstoppable. Nobody can delete or modify your round.
          </p>

          <p>How do I use this website?</p>
          <p>
            This website interacts with the Ethereum blockchain – to use it,
            you&apos;ll need to have a wallet and some ETH (the main currency on
            Ethereum). You can get a wallet on{" "}
            <Link href="https://metamask.io/">metamask.io</Link> and buy ETH
            within the wallet using a credit card.
          </p>
        </main>
      </Container>
    </>
  );
}
