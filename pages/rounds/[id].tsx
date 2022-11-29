import { NextSeo } from "next-seo"
import { ActionScreen, Container, RoundViewFull } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import fetcher from "@utils/fetcher"
import { GetStaticPropsContext } from "next"
import prisma from "@lib/prisma"
import { useContractRead } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"
import { addresses } from "@utils/constants"
import { useRouter } from "next/router"

export default function Round({ subgraphData, projectData }) {
  const router = useRouter()
  const { id } = router.query
  const isBluntRound =
    subgraphData.deployer ==
    addresses.BluntDelegateProjectDeployer.toLowerCase()

  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractRead({
    address: subgraphData.configureEvents[0].dataSource,
    abi: bluntDelegate.abi,
    functionName: "getRoundInfo",
    suspense: true,
    watch: true,
    enabled: isBluntRound
  })

  return (
    <>
      <NextSeo
        title={`${projectData.metadata.name} | Blunt round | Blunt Finance`}
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
        <main className="max-w-screen-sm mx-auto space-y-10">
          {isBluntRound ? (
            roundInfo && (
              <RoundViewFull
                subgraphData={subgraphData}
                projectData={projectData}
                roundInfo={roundInfo}
              />
            )
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
      projectData
    },
    revalidate: 600
  }
}
