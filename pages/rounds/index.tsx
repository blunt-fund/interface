import {
  defaultDescription,
  defaultTitle,
  domain,
  longTitle
} from "@components/common/Head"
import { Container, RoundsList } from "@components/ui"
import { Project } from "@prisma/client"
import fetcher from "@utils/fetcher"
import { GetStaticPropsContext } from "next"
import { NextSeo } from "next-seo"

export default function Explore({ subgraphData, projectData }) {
  return (
    <>
      <NextSeo
        title="Explore rounds | Blunt"
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
        <main className="mx-auto max-w-screen-sm">
          <h2 className="pb-20">Blunt rounds</h2>
          <RoundsList subgraphData={subgraphData} projectData={projectData} />
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
