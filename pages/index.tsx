import { NextSeo } from "next-seo"
import { Button, Container, RoundsListMain } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { GetStaticPropsContext } from "next"
import fetcher from "@utils/fetcher"
import { Project } from "@prisma/client"

export default function Home({ subgraphData, projectData }) {
  return (
    <>
      <NextSeo
        title="Blunt Finance | Fundraise bluntly in the open with your community."
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.png`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <main className="max-w-screen-sm mx-auto">
          <div className="py-24">
            <h1 className="pb-10 sm:text-5xl">Blunt Finance</h1>
            <p className="text-xl font-bold text-gray-500">
              Fundraise bluntly in the open with your community
            </p>
            <div className="pt-12">
              <Button label="Create round" href="/create" />
            </div>
          </div>
          <RoundsListMain
            subgraphData={subgraphData}
            projectData={projectData}
          />
          <div className="pt-24">
            <h2 className="pb-12 text-xl text-gray-500 sm:pb-6">
              How it works
            </h2>
            <div className="prose text-left">
              <p>
                Blunt rounds are trustless, refundable funding rounds that
                behave according to a set of pre-defined rules.
              </p>
              <p>
                These guarantee contributors that the fundraise doesn't behave
                unexpectedly, and provides fundraisers a streamlined solution to
                kickstart their project.
              </p>
              <ul className="text-gray-700">
                <li>
                  Round contributions can be made anytime while a round is
                  active.
                </li>
                <li>
                  Full refunds can be processed anytime while the round is
                  active, or after a round has concluded unsuccessfully.
                </li>
                <li>
                  A round is considered successful when the fundraise target is
                  reached. If the target is not reached in time, contributors
                  can get full refunds for their contributions.
                </li>
                <li>
                  A deadline can be set to limit the period of time the round
                  stays active.
                </li>
                <li>
                  A hard cap can be set to limit the maximum amount to be
                  raised.
                </li>
                <li>
                  When a round closes successfully, Blunt takes a small cut in
                  exchange for BF governance tokens. The more you raise, the
                  less you pay. Fee ranges between 1,5% and 3,5% (excluding 2,5%
                  Juicebox base fee).
                </li>
                <li>
                  Once a round is completed, ownership of the related Juicebox
                  project is transferred to the rightful owner who can manage
                  the funds raised.
                </li>
              </ul>
            </div>
            <p className="pt-4 text-sm font-bold text-gray-500">
              Blunt Finance is built on{" "}
              <a
                href="https://juicebox.money"
                className="highlight"
                target="_blank"
                rel="noreferrer"
              >
                Juicebox
              </a>
              , leveraging solidity of its foundations
            </p>
          </div>
        </main>
      </Container>
    </>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const endpoint = process.env.NEXT_PUBLIC_APP_URL + "/api/rounds"
  const data = await fetcher(endpoint)
  const subgraphData = data?.subgraphData
  const projectData: Project[] = data?.projectData
  // const subgraphData = []
  // const projectData = []

  return {
    props: {
      subgraphData,
      projectData
    },
    revalidate: 600
  }
}
