import { NextSeo } from "next-seo"
import { Container, RoundsList } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { GetStaticPropsContext } from "next"
import fetcher from "@utils/fetcher"

export default function Explore({ subgraphData, projectData }) {
  return (
    <>
      <NextSeo
        title="Explore rounds | Blunt Finance"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <main className="max-w-screen-sm mx-auto">
          <h1 className="pb-20">Blunt rounds</h1>
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
  const projectData = data?.projectData

  return {
    props: {
      subgraphData,
      projectData
    },
    revalidate: 600
  }
}
