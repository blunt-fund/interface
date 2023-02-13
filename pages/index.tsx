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
        title="Blunt Finance | Manage terms sheets, fundraising, cashflow, and capital allocation, bluntly in the open with your community."
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
        <main className="max-w-screen-sm mx-auto space-y-12">
          <div>
            <h1 className="pb-8 sm:text-5xl">Blunt Finance</h1>
            <p className="pb-4 text-lg sm:text-xl">
              Fundraise bluntly in the open with your community
            </p>
          </div>
          <div>
            <Button label="Create round" href="/create" />
          </div>
          <RoundsListMain
            subgraphData={subgraphData}
            projectData={projectData}
          />
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
