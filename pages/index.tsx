import { NextSeo } from "next-seo"
import {
  Button,
  Container,
  HomeHowItWorks,
  RoundsListMain
} from "@components/ui"
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
        <main className="max-w-screen-sm pt-12 pb-8 mx-auto space-y-32">
          <div className="space-y-10">
            <h1 className="sm:text-5xl">blunt</h1>
            <p className="text-gray-500 tracking-wide sm:text-lg">
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
