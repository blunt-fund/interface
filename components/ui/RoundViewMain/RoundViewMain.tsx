import File from "@components/icons/File"
import Link from "@components/icons/Link"
import Logo from "@components/icons/Logo"
import { Discord, Twitter } from "@components/icons/Social"
import formatNumber from "@utils/formatNumber"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import Image from "next/image"
import ConditionalLink from "../ConditionalLink"
import { RoundData } from "utils/getRounds"
import ProgressBar from "../ProgressBar"

type Props = {
  roundData: RoundData
  descriptionHtml?: string
  raised?: number
  roundId?: number
  deadline?: number
  issuance?: boolean
  secondary?: boolean
  active?: boolean
}

const RoundViewMain = ({
  roundData,
  descriptionHtml,
  raised = 0,
  roundId,
  deadline,
  issuance = true,
  secondary = false,
  active = false
}: Props) => {
  const {
    name,
    image,
    website,
    twitter,
    discord,
    docs,
    tokenName,
    tokenSymbol,
    tokenIssuance,
    duration,
    target,
    cap,
    shares,
    isTargetEth,
    isCapEth
  } = roundData

  const currency = (isEth: boolean) => (isEth ? "ETH" : "USD")
  const twitterUrl = `https://twitter.com/${twitter}`
  // const displayedTarget = isTargetEth ? target / 1e4 : target / 1e2
  // const displayedCap = isCapEth ? cap / 1e4 : cap / 1e2
  const targetEth = useNormalizeCurrency(target, isTargetEth)
  const capEth = useNormalizeCurrency(cap, isCapEth)
  const normalizedRaisedUsd = useNormalizeCurrency(raised, true, false)
  const raisedUsd = raised != 0 ? normalizedRaisedUsd || undefined : 0

  const formattedDeadlineUnits =
    deadline / 86400 > 1
      ? "days"
      : deadline / 3600 > 1
      ? "hours"
      : deadline / 60 > 1
      ? "minutes"
      : "seconds"
  const formattedDeadline =
    deadline &&
    Math.floor(
      formattedDeadlineUnits == "days"
        ? deadline / 86400
        : formattedDeadlineUnits == "hours"
        ? deadline / 3600
        : formattedDeadlineUnits == "minutes"
        ? deadline / 60
        : deadline
    )

  return (
    <ConditionalLink
      href={roundId ? `/rounds/${roundId}` : undefined}
      className="block rounded-sm hover:text-black sm:border sm:border-transparent sm:px-4 sm:py-6 sm:hover:border-gray-200 sm:hover:shadow-inner"
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
              <p className="pt-2 text-sm">
                Round allocation: <b>{shares[0]}%</b>
              </p>
            )}
            <div className="mt-8 text-xs xs:text-sm">
              <ProgressBar
                max={
                  cap != 0
                    ? capEth
                    : raised < targetEth
                    ? targetEth * 1.5
                    : raised * 1.25
                }
                target={targetEth}
                raised={raised}
                isCapped={cap != 0}
                active={active}
              />
              <div className="flex justify-between pt-5 pb-2">
                <p>
                  Raised:{" "}
                  <b>
                    <span
                      className={
                        raised < targetEth
                          ? "text-yellow-500 dark:text-yellow-300"
                          : "text-blue-600 nightwind prevent"
                      }
                    >
                      {formatNumber(isCapEth ? raised : raisedUsd, 1)}
                    </span>{" "}
                    {cap != 0 && `/ ${formatNumber(cap, 1)}`}{" "}
                    {currency(isCapEth || !cap)}
                  </b>
                </p>
                <p>
                  Deadline:{" "}
                  <b
                    className={
                      deadline > 0 && deadline < 259200 ? "text-yellow-500" : ""
                    }
                  >
                    {duration
                      ? deadline != undefined
                        ? deadline > 0
                          ? `${formattedDeadline} ${formattedDeadlineUnits}`
                          : "passed"
                        : `${duration} days`
                      : "none"}
                  </b>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  {target != 0 && (
                    <>
                      Target:{" "}
                      <b>
                        <span className="text-blue-600">
                          {formatNumber(target, 1)}
                        </span>{" "}
                        {currency(isTargetEth)}
                      </b>
                    </>
                  )}
                </p>
                {issuance && tokenIssuance >= 1 && (
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
          <div className="py-3 prose-sm prose">
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
        )}
      </div>
    </ConditionalLink>
  )
}

export default RoundViewMain
