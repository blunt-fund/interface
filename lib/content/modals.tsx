import { Button, PieChart, ReservedTable, RoundViewMain } from "@components/ui"
import { useAppContext } from "@components/ui/context"

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
    isFundraiseEth
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
        <RoundViewMain
          name={name}
          descriptionHtml={descriptionHtml}
          image={image}
          website={website}
          twitter={twitter}
          discord={discord}
          docs={docs}
          tokenSymbol={tokenSymbol}
          tokenIssuance={tokenIssuance}
          duration={duration}
          target={target}
          cap={cap}
          isFundraiseEth={isFundraiseEth}
        />
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
