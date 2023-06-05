import NextHead from "next/head"
import { NextSeo } from "next-seo"
import { ActionScreen, Container, RoundViewFullWrapper } from "@components/ui"
import fetcher from "@utils/fetcher"
import { GetStaticPropsContext } from "next"
import prisma from "@lib/prisma"
import constants, { addresses } from "@utils/constants"
import { useRouter } from "next/router"
import { defaultDescription, domain } from "@components/common/Head"

export default function Round({ subgraphData, projectData }) {
  const router = useRouter()
  const { id } = router.query
  const isBluntRound =
    subgraphData.deployer ==
    addresses.BluntDelegateProjectDeployer.toLowerCase()
  const { name, description, logoUri } = projectData.metadata
  const imageUrl = constants.ipfsGateway + String(logoUri).split("ipfs/")[1]

  return (
    <>
      <NextSeo
        title={`${name} | Blunt Round`}
        description={description || defaultDescription}
        openGraph={{
          title: `${name} | Blunt Round`,
          description: description || defaultDescription,
          url: domain,
          images: [
            {
              url: imageUrl || `${domain}/og_image.png`,
              alt: `${name} cover image`
            }
          ]
        }}
      />
      <NextHead>
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        <meta name="twitter:title" content={`${name} | Blunt Round`} />
        <meta
          name="twitter:description"
          content={description || defaultDescription}
        />
      </NextHead>

      <Container page={true}>
        <main className="max-w-screen-sm mx-auto space-y-10">
          {isBluntRound ? (
            <RoundViewFullWrapper
              subgraphData={subgraphData}
              projectData={projectData}
            />
          ) : (
            <ActionScreen
              text="This project is not a Blunt round"
              buttonLabel="View it on Juicebox"
              href={`https://${
                process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "goerli." : ""
              }juicebox.money/v2/p/${id}`}
            />
          )}
        </main>
      </Container>
    </>
  )
}

export async function getStaticPaths() {
  const ids = await prisma.project.findMany({ select: { projectId: true } })
  // const ids = []
  const paths = ids.map(({ projectId }) => ({
    params: {
      id: String(projectId)
    }
  }))

  return { paths, fallback: "blocking" }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params.id
  const endpoint = process.env.NEXT_PUBLIC_APP_URL + "/api/rounds/" + id
  const data = await fetcher(endpoint)
  const subgraphData = data?.subgraphData
  const projectData = data?.projectData

  return {
    props: {
      subgraphData,
      projectData,
      key: id
    },
    revalidate: 600
  }
}

// TODO: Make everything more static
