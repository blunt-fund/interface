import File from "@components/icons/File"
import Link from "@components/icons/Link"
import Logo from "@components/icons/Logo"
import { Discord, Juicebox, Twitter } from "@components/icons/Social"
import { ConditionalLink, RoundDetails } from "@components/ui"
import { NextSeo } from "next-seo"
import NextHead from "next/head"
import Image from "next/image"
import { RoundData } from "utils/getRounds"
import { TimeWrapper } from "../context"

type Props = {
  roundData: RoundData
  descriptionHtml?: string
  isRoundClosed: boolean
  hasEndedUnsuccessfully?: boolean
  raised?: number
  roundId?: number | string
  issuance?: boolean
  smallTitle?: boolean
  showLinks?: boolean
}

const RoundViewMain = ({
  roundData,
  descriptionHtml,
  isRoundClosed,
  hasEndedUnsuccessfully,
  raised = 0,
  roundId,
  issuance = true,
  smallTitle = false,
  showLinks = false
}: Props) => {
  const { name, image, website, twitter, discord, docs, shares } = roundData

  const twitterUrl = `https://twitter.com/${twitter}`

  return (
    <>
      {twitter && (
        <NextSeo
          twitter={{
            handle: twitter,
            site: twitter,
            cardType: "summary_large_image"
          }}
        />
      )}

      <ConditionalLink
        href={roundId && !showLinks ? `/rounds/${roundId}` : undefined}
        className="block rounded-sm hover:text-black sm:border sm:px-4 sm:py-6 sm:border-transparent sm:hover:shadow-inner sm:hover:border-gray-300"
      >
        <div className="text-left">
          <div className="xs:flex">
            <div
              className={`flex flex-shrink-0 items-center rounded-sm border bg-opacity-20 shadow-md bg-white border-gray-200 xs:mr-4 ${
                showLinks ? "h-44 w-44" : "h-40 w-40"
              }`}
            >
              {image.url &&
              image.url !=
                "https://ipfs.io/ipfs/bafkreienba5ag3lv7uwfkqjonxqfm2sqfzddmekjhgulnslaksfxz3y4eu" &&
              image.url !=
                "https://ipfs.io/ipfs/bafkreibdtsmod77wdg2lf6n4j5kubyy7idrlc2y2td4p4x77e2t5ppbche" ? (
                <Image
                  src={image.url}
                  alt={`${name} logo`}
                  width={196}
                  height={196}
                  className="h-full object-cover"
                />
              ) : (
                <div className="h-full w-full p-10">
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
              {
                showLinks ? (
                  <div className="mt-4 ml-1 flex items-center gap-6">
                    {website && (
                      <a
                        className="higlight h-5 w-5"
                        target="_blank"
                        rel="noreferrer"
                        href={website}
                      >
                        <Link />
                      </a>
                    )}
                    {twitter && (
                      <a
                        className="higlight h-5 w-5"
                        target="_blank"
                        rel="noreferrer"
                        href={twitterUrl}
                      >
                        <Twitter />
                      </a>
                    )}
                    {discord && (
                      <a
                        className="mt-0.5 h-5 w-5 hover:text-indigo-500"
                        target="_blank"
                        rel="noreferrer"
                        href={discord}
                      >
                        <Discord />
                      </a>
                    )}
                    {docs && (
                      <a
                        className="h-5 w-5 hover:text-gray-500"
                        target="_blank"
                        rel="noreferrer"
                        href={docs}
                      >
                        <File />
                      </a>
                    )}
                    <a
                      className="h-5 w-5 hover:text-yellow-600"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://${
                        process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "goerli." : ""
                      }juicebox.money/v2/p/${roundId}`}
                    >
                      <Juicebox />
                    </a>
                  </div>
                ) : null // (
                // <p className="pt-2 text-sm">
                //   Round allocation: <b>{shares[0]}%</b>
                // </p>
                // )
              }
              <TimeWrapper>
                <RoundDetails
                  roundData={roundData}
                  raised={raised}
                  issuance={issuance}
                  isRoundClosed={isRoundClosed}
                  hasEndedUnsuccessfully={hasEndedUnsuccessfully}
                />
              </TimeWrapper>
            </div>
          </div>

          {descriptionHtml && (
            <div className="prose-sm max-w-none py-6 prose">
              <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </div>
          )}
        </div>
      </ConditionalLink>
    </>
  )
}

export default RoundViewMain
