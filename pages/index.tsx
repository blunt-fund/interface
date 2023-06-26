import {
  defaultDescription,
  defaultTitle,
  domain,
  longTitle
} from "@components/common/Head"
import {
  Button,
  Container,
  HomeHowItWorks,
  RoundsListMain
} from "@components/ui"
import { Project } from "@prisma/client"
import fetcher from "@utils/fetcher"
import { GetStaticPropsContext } from "next"
import { NextSeo } from "next-seo"

export default function Home({ subgraphData, projectData }) {
  return (
    <>
      <NextSeo
        title="blunt | bluntly simple fundraising"
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
        <main className="mx-auto max-w-screen-sm space-y-32 pt-12 pb-8">
          <div className="space-y-10">
            <h1 className="sm:text-5xl">blunt</h1>
            <p className="tracking-wide text-gray-500 sm:text-lg">
              Blunts are trustless funding rounds where contributors can get
              refunds until a round is closed successfully
            </p>
            <div className="pt-2">
              <Button label="Create round" href="/create" />
            </div>
          </div>
          <RoundsListMain
            subgraphData={subgraphData}
            projectData={projectData}
          />
          <HomeHowItWorks />
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
