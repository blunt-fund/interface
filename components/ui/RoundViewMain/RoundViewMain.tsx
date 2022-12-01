import File from "@components/icons/File"
import Link from "@components/icons/Link"
import Logo from "@components/icons/Logo"
import { Discord, Juicebox, Twitter } from "@components/icons/Social"
import Image from "next/image"
import { ConditionalLink, RoundDetails } from "@components/ui"
import { RoundData } from "utils/getRounds"
import { TimeWrapper } from "../context"

type Props = {
  roundData: RoundData
  descriptionHtml?: string
  isRoundClosed: boolean
  raised?: number
  roundId?: number | string
  timestamp?: number
  issuance?: boolean
  smallTitle?: boolean
  showLinks?: boolean
}

const RoundViewMain = ({
  roundData,
  descriptionHtml,
  isRoundClosed,
  raised = 0,
  roundId,
  timestamp,
  issuance = true,
  smallTitle = false,
  showLinks = false
}: Props) => {
  const { name, image, website, twitter, discord, docs, shares } = roundData

  const twitterUrl = `https://twitter.com/${twitter}`

  return (
    <ConditionalLink
      href={roundId && !showLinks ? `/rounds/${roundId}` : undefined}
      className="block rounded-sm hover:text-black sm:border sm:border-transparent sm:px-4 sm:py-6 sm:hover:border-gray-200 sm:hover:shadow-inner"
    >
      <div className="text-left">
        <div className="xs:flex">
          <div className="bg-white border border-gray-200 rounded-sm shadow-md w-44 h-44 xs:mr-4 bg-opacity-20">
            {image.url &&
            image.url !=
              "https://ipfs.io/ipfs/bafkreienba5ag3lv7uwfkqjonxqfm2sqfzddmekjhgulnslaksfxz3y4eu" ? (
              <Image
                src={image.url}
                alt={`${name} logo`}
                width={196}
                height={196}
              />
            ) : (
              <div className="p-10">
                <Logo />
              </div>
            )}
          </div>
          <div className="flex-grow pt-6 xs:pt-0">
            <h1
              className={
                smallTitle ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              }
            >
              {name}
            </h1>
            {showLinks ? (
              <div className="flex items-center gap-6 mt-4 ml-1">
                {website && (
                  <a
                    className="w-5 h-5 higlight"
                    target="_blank"
                    rel="noreferrer"
                    href={website}
                  >
                    <Link />
                  </a>
                )}
                {twitter && (
                  <a
                    className="w-5 h-5 higlight"
                    target="_blank"
                    rel="noreferrer"
                    href={twitterUrl}
                  >
                    <Twitter />
                  </a>
                )}
                {discord && (
                  <a
                    className="w-5 h-5 mt-0.5 hover:text-indigo-500"
                    target="_blank"
                    rel="noreferrer"
                    href={discord}
                  >
                    <Discord />
                  </a>
                )}
                {docs && (
                  <a
                    className="w-5 h-5 hover:text-gray-500"
                    target="_blank"
                    rel="noreferrer"
                    href={docs}
                  >
                    <File />
                  </a>
                )}
                <a
                  className="w-5 h-5 hover:text-yellow-600"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://${
                    process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "goerli." : ""
                  }juicebox.money/v2/p/${roundId}`}
                >
                  <Juicebox />
                </a>
              </div>
            ) : (
              <p className="pt-2 text-sm">
                Round allocation: <b>{shares[0]}%</b>
              </p>
            )}
            <TimeWrapper>
              <RoundDetails
                roundData={roundData}
                raised={raised}
                timestamp={timestamp}
                issuance={issuance}
                isRoundClosed={isRoundClosed}
              />
            </TimeWrapper>
          </div>
        </div>

        {descriptionHtml && (
          <div className="py-3 prose-sm prose">
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
        )}
      </div>
    </ConditionalLink>
  )
}

export default RoundViewMain
