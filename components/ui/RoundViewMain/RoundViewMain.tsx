import File from "@components/icons/File"
import Link from "@components/icons/Link"
import Logo from "@components/icons/Logo"
import { Discord, Twitter } from "@components/icons/Social"

import formatNumber from "@utils/formatNumber"
import Image from "next/image"
import ConditionalLink from "../ConditionalLink"
import { ImageType } from "../CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import ProgressBar from "../ProgressBar"

type Props = {
  name: string
  image: ImageType
  website: string
  twitter: string
  discord: string
  docs: string
  target: number
  tokenIssuance: number
  tokenSymbol: string
  duration: number
  cap: number
  isFundraiseEth: boolean
  reservedStake: number
  descriptionHtml?: string
  raised?: number
  roundId?: number
  secondary?: boolean
}

const CreateFormAdvancedERC20 = ({
  name,
  image,
  website,
  twitter,
  discord,
  docs,
  target,
  tokenIssuance,
  tokenSymbol,
  duration,
  cap,
  isFundraiseEth,
  reservedStake,
  descriptionHtml,
  raised = 0,
  roundId,
  secondary = false
}: Props) => {
  const currency = isFundraiseEth ? "ETH" : "USD"
  const twitterUrl = `https://twitter.com/${twitter.replace("@", "")}`

  return (
    <ConditionalLink
      href={roundId ? `/round/${roundId}` : undefined}
      className="sm:border sm:border-transparent sm:px-4 sm:py-6 sm:hover:border-gray-200 sm:hover:shadow-inner"
    >
      <div className="text-left">
        <div className="xs:flex">
          <div className="bg-white border border-gray-200 rounded-sm shadow-md w-44 h-44 xs:mr-4 bg-opacity-20">
            {image.url ? (
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
                secondary ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              }
            >
              {name}
            </h1>
            {!roundId ? (
              (website || twitter || discord || docs) && (
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
                      className="w-5 h-5 mt-0.5 higlight"
                      target="_blank"
                      rel="noreferrer"
                      href={discord}
                    >
                      <Discord />
                    </a>
                  )}
                  {docs && (
                    <a
                      className="w-5 h-5 higlight"
                      target="_blank"
                      rel="noreferrer"
                      href={docs}
                    >
                      <File />
                    </a>
                  )}
                </div>
              )
            ) : (
              <p className="pt-2 text-sm">Round allocation: {reservedStake}%</p>
            )}
            <div className="mt-8 text-xs xs:text-sm">
              <ProgressBar
                max={
                  cap != 0
                    ? cap
                    : raised < target
                    ? target * 1.5
                    : raised * 1.25
                }
                target={target}
                raised={raised}
              />
              <div className="flex justify-between pt-5 pb-2">
                <p>
                  Raised:{" "}
                  <b>
                    <span
                      className={
                        raised < target
                          ? "text-yellow-500 dark:text-yellow-300"
                          : "text-blue-600 nightwind prevent"
                      }
                    >
                      {formatNumber(raised, 1)}
                    </span>{" "}
                    {cap != 0 && `/ ${formatNumber(cap, 1)}`} {currency}
                  </b>
                </p>
                <p>
                  Deadline: <b>{duration ? `${duration} days` : "none"}</b>
                </p>
              </div>
              <div className="flex justify-between">
                {target != 0 && (
                  <p>
                    Target:{" "}
                    <b>
                      <span className="text-blue-600">
                        {formatNumber(target, 1)}
                      </span>{" "}
                      {currency}
                    </b>
                  </p>
                )}
                {tokenIssuance != 0 && (
                  <p>
                    Issuance:{" "}
                    <b>
                      {formatNumber(tokenIssuance, 1)} {tokenSymbol || "tokens"}{" "}
                      / ETH
                    </b>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {descriptionHtml && (
          <div className="pt-6 prose-sm">
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
        )}
      </div>
    </ConditionalLink>
  )
}

export default CreateFormAdvancedERC20
