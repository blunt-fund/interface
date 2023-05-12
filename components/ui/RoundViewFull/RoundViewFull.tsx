import NextHead from "next/head"
import {
  ContributionsTable,
  EmissionPreview,
  Locks,
  OwnerBlock,
  OwnerDisplay,
  QueueBlock,
  RoundMainSection,
  RoundViewMain
} from "../"
import { useRouter } from "next/router"
import { Suspense, useEffect, useState } from "react"
import markdownToHtml from "@lib/markdownToHtml"
import formatRound from "@utils/formatRound"
import { Project } from "@prisma/client"
import Crown from "@components/icons/Crown"
import formatAddress from "@utils/formatAddress"
import { useAppContext } from "../context"
import { TimeWrapper } from "../context"
import { NextSeo } from "next-seo"
import {
  defaultDescription,
  defaultTitle,
  domain,
  longTitle
} from "@components/common/Head"

type Props = {
  projectData: Project
  subgraphData: any
  roundInfo: any[]
}

const RoundViewFull = ({ projectData, subgraphData, roundInfo }: Props) => {
  const { account } = useAppContext()
  const router = useRouter()
  const { id } = router.query

  const [roundData, accountContributions] = roundInfo
  const { round, totalContributions, isRoundClosed } = formatRound(
    subgraphData,
    roundData,
    projectData.metadata
  )

  const { name, description, image } = round
  const totalShares = round.shares.reduce((a, b) => a + b)
  const formatTimestamp = (days: number) =>
    days && (subgraphData.configureEvents[0].timestamp + days * 86400) * 1000
  const bluntDelegate = subgraphData?.configureEvents[0].dataSource
  const currentDelegate =
    subgraphData?.configureEvents[subgraphData?.configureEvents.length - 1]
      .dataSource

  const [descriptionHtml, setDescriptionHtml] = useState("")
  useEffect(() => {
    const getDescriptionHtml = async (description: string) => {
      setDescriptionHtml(await markdownToHtml(description))
    }
    if (round?.description) {
      getDescriptionHtml(round.description)
    }
  }, [round])

  const [showOwnerBlock, setShowOwnerBlock] = useState(false)
  useEffect(() => {
    setShowOwnerBlock(account == round.projectOwner)
  }, [account, round])

  return (
    <>
      <NextSeo
        title={`${name} | Blunt Round`}
        openGraph={{
          title: `${name} | Blunt Round`,
          description: description || defaultDescription,
          url: domain,
          images: [
            {
              url: image?.url || `${domain}/og_image.png`,
              alt: `${name} cover image`
            }
          ]
        }}
      />

      <NextHead>
        <meta
          name="twitter:image"
          content={image?.url || `${domain}/twitter_card.png`}
        />
      </NextHead>

      <Suspense>
        <RoundViewMain
          roundData={round}
          descriptionHtml={descriptionHtml}
          raised={totalContributions}
          issuance={false}
          isRoundClosed={isRoundClosed}
          hasEndedUnsuccessfully={
            isRoundClosed && currentDelegate == bluntDelegate
          }
          showLinks
          roundId={Number(id)}
        />
      </Suspense>

      <TimeWrapper>
        <RoundMainSection
          round={round}
          totalContributions={totalContributions}
          isRoundClosed={isRoundClosed}
          accountContributions={accountContributions}
          bluntDelegate={bluntDelegate}
        />
      </TimeWrapper>

      {/* <EmissionPreview shares={round?.shares} totalShares={totalShares} /> */}

      <Suspense>
        {subgraphData.participants.length ? (
          <ContributionsTable subgraphData={subgraphData} />
        ) : null}
      </Suspense>

      <div className="flex justify-center w-full pb-4">
        <OwnerDisplay projectOwner={round.projectOwner} />
      </div>

      <TimeWrapper>
        {!isRoundClosed && (
          <>
            {showOwnerBlock && (
              <OwnerBlock
                projectId={Number(id)}
                bluntDelegate={bluntDelegate}
                totalContributions={totalContributions}
                round={round}
              />
            )}
          </>
        )}
      </TimeWrapper>

      {/* <Locks
        transferTimestamp={formatTimestamp(round.transferTimelock)}
        releaseTimestamp={formatTimestamp(round.releaseTimelock)}
        roundTimestamp={round.roundTimelock * 1000}
      /> */}
    </>
  )
}

export default RoundViewFull
