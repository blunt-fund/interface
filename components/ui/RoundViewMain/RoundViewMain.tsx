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
  descriptionHtml: string
  image: ImageType
  website: string
  twitter: string
  discord: string
  docs: string
  tokenSymbol: string
  tokenIssuance: number
  duration: number
  target: number
  cap: number
  isFundraiseEth: boolean
  raised?: number
  roundId?: number
}

const CreateFormAdvancedERC20 = ({
  name,
  descriptionHtml,
  image,
  website,
  twitter,
  discord,
  docs,
  tokenSymbol,
  tokenIssuance,
  duration,
  target,
  cap,
  isFundraiseEth,
  raised = 0,
  roundId
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
            <h1 className="text-2xl sm:text-3xl">{name}</h1>
            {!roundId && (website || twitter || discord || docs) && (
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
            )}
            <div className="text-xs mt-9 xs:text-sm">
              <ProgressBar
                max={cap || raised < target ? target * 1.5 : raised * 1.25}
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
                {tokenIssuance != 0 && (
                  <p>
                    Issuance:{" "}
                    <b>
                      <span className="text-blue-600">
                        {formatNumber(tokenIssuance, 1)}{" "}
                        {tokenSymbol || "tokens"}
                      </span>{" "}
                      / ETH
                    </b>
                  </p>
                )}
                {target != 0 && (
                  <p>
                    Target:{" "}
                    <b>
                      <span className="text-blue-600">
                        {formatNumber(target, 1)} {currency}
                      </span>
                    </b>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 prose">
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
      </div>
    </ConditionalLink>
  )
}

export default CreateFormAdvancedERC20
