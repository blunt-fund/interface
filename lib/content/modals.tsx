import File from "@components/icons/File"
import Link from "@components/icons/Link"
import { Discord, Twitter } from "@components/icons/Social"
import {
  Button,
  Input,
  PieChart,
  ProgressBar,
  ReservedTable
} from "@components/ui"
import { useAppContext } from "@components/ui/context"
import formatNumber from "@utils/formatNumber"
import Image from "next/image"
import projectDefault from "public/project_default.png"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames =
  | ""
  | "CREATE_ROUND_REVIEW"
  | "CREATE_ROUND_PROCESS"
  | "ROUND_INFO_VIEW"

export const ROUND_INFO_VIEW = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Reserved Rate explained</h1>
      <div className="pt-8 prose">
        <p>something something RR something something</p>
      </div>
    </div>
  )
}

export const CREATE_ROUND_PROCESS = (params: any) => {
  const { setModalView } = useAppContext()
  const {
    name,
    tokenSymbol,
    tokenIssuance,
    reservedStake,
    description,
    website,
    twitter,
    discord,
    docs,
    duration,
    isTargetEth,
    target,
    isCapEth,
    cap,
    reservedError,
    success,
    addresses,
    shares,
    totalShares
  } = params

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Blunt round in progress</h1>
      <p>{name}</p>
    </div>
  )
}

export const CREATE_ROUND_REVIEW = (params: any) => {
  const { setModalView } = useAppContext()
  const {
    name,
    description,
    descriptionHtml,
    image,
    website,
    twitter,
    discord,
    docs,
    tokenSymbol,
    tokenIssuance,
    reservedStake,
    duration,
    target,
    cap,
    addresses,
    shares,
    totalShares,
    isTargetEth,
    isCapEth
  } = params

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Review terms</h1>
      <div className="pt-8 space-y-6">
        <p>
          Proceeding will create a project on Juicebox with the following
          settings, and a slicer on Slice to handle token distribution to the
          blunt round participants.
        </p>
        <hr className="w-20 !my-12 mx-auto border-gray-300" />
        <div className="text-left">
          <div className="xs:flex">
            <div className="bg-white border border-gray-200 rounded-sm shadow-md w-44 h-44 xs:mr-4 bg-opacity-20">
              <Image
                src={image.url || projectDefault}
                alt={image.url ? `${name} logo` : "Default project logo"}
                width={196}
                height={196}
              />
            </div>
            <div className="flex-grow pt-6 xs:pt-0">
              <h1 className="text-2xl sm:text-3xl">{name}</h1>
              {(website || twitter || discord || docs) && (
                <div className="flex items-center gap-6 mt-3 ml-1">
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
                      href={twitter}
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
              <div className="mt-10 text-xs xs:text-sm">
                <ProgressBar max={cap || target * 5} target={target} />
                <div className="flex justify-between pt-6 pb-2">
                  <p>
                    Target: <b>{target != 0 ? `${target} Ξ` : "none"}</b>
                  </p>
                  <p>
                    Cap: <b>{cap ? `${cap} Ξ` : "unlimited"}</b>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    Deadline: <b>{duration ? `${duration} days` : "none"}</b>
                  </p>
                  {tokenIssuance != 0 && (
                    <p>
                      Issued:{" "}
                      <b>
                        {formatNumber(tokenIssuance, 1)}{" "}
                        {tokenSymbol || "tokens"} / ETH
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

        <div className="py-8">
          <p className="pb-8 text-base text-center">
            Token emission (after round)
          </p>
          <div className="text-black">
            <PieChart
              addresses={["Contributor", ...addresses.slice(1), "Blunt round"]}
              shares={[
                100 - totalShares,
                ...shares.slice(1),
                Number(reservedStake)
              ]}
              total={100}
            />
          </div>
        </div>
        <div className="pb-6">
          <ReservedTable
            reservedPool={totalShares}
            reservedStake={Number(reservedStake)}
          />
        </div>
        {/*       
        <table>
          <thead>
            <tr className="bg-gray-100">
              <th scope="col">Property</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(params).map((el, i) => {
              return (
                <tr
                  key={i}
                  className="border-b border-gray-100 even:bg-gray-50 dark:even:bg-gray-900"
                >
                  <td>{el[0]}</td>
                  <td className="font-bold">{String(el[1])}</td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
        <div className="pt-6 text-center">
          <Button
            label="Create round"
            onClick={() =>
              setModalView({
                name: "CREATE_ROUND_PROCESS",
                cross: true,
                params: params
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
