import {
  Button,
  LoadingStep,
  Locks,
  PieChart,
  ReservedTable,
  RoundViewMain
} from "@components/ui"
import { useAppContext } from "@components/ui/context"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames =
  | ""
  | "REVIEW_ROUND_VIEW"
  | "CREATE_ROUND_VIEW"
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

export const CREATE_ROUND_VIEW = (params: any) => {
  const { setModalView } = useAppContext()
  const { uploadStep, tokenSymbol } = params
  const roundId = 1

  let uploadState: string
  switch (uploadStep) {
    case 1:
      uploadState = "Saving metadata"
      break
    case 2:
      uploadState = "Settin up round"
      break
    case 3:
      uploadState = "Issuing ERC20 token"
      break
    case 4:
      uploadState = "Reverting"
      break
    case 5:
      uploadState = "Reverted"
      break
    case 6:
      uploadState = "Success!"
      break
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Transaction in progress</h1>
      <div className="pt-8 space-y-6">
        <p className="pb-8">Please wait</p>
        <div className="grid items-center max-w-lg grid-cols-6 gap-2 px-4 mx-auto">
          <LoadingStep
            initCondition={uploadStep < 2}
            uploadState={uploadState}
            endState={uploadStep == 4 || uploadStep == 5 ? uploadState : "Done"}
          />
          <LoadingStep
            nullCondition={uploadStep < 2}
            initCondition={uploadStep < 3}
            uploadState={uploadState}
            waitingState="Create round"
            endState={uploadStep == 4 || uploadStep == 5 ? uploadState : "Done"}
          />
          {tokenSymbol && (
            <LoadingStep
              nullCondition={uploadStep < 3}
              initCondition={uploadStep < 4}
              uploadState={uploadState}
              waitingState="Issue token"
              endState={
                uploadStep == 4 || uploadStep == 5 ? uploadState : "Done"
              }
            />
          )}
        </div>
        <div className="pt-10">
          {uploadStep > 4 ? (
            uploadStep > 5 ? (
              <Button label={"Go to round"} href={`/round/${roundId}`} />
            ) : (
              <Button
                label={"Go back"}
                onClick={() => setModalView({ name: "" })}
              />
            )
          ) : (
            <p className="mx-auto text-sm font-bold text-yellow-600">
              Wait until the process is completed
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const REVIEW_ROUND_VIEW = (params: any) => {
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
    transferTimestamp,
    releaseTimestamp,
    addresses,
    shares,
    totalShares,
    isFundraiseEth,
    createRound
  } = params

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Review terms</h1>
      <div className="pt-8 space-y-6">
        <p>
          Proceeding will create a Juicebox project and a slicer to handle token
          distribution to blunt round participants.
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
          reservedStake={reservedStake}
        />
        <div className="py-8">
          <p className="pb-8 text-base text-center">
            Token emission (after blunt round)
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

        <Locks
          transferTimestamp={transferTimestamp}
          releaseTimestamp={releaseTimestamp}
        />

        <div className="pb-6">
          <ReservedTable
            reservedPool={totalShares}
            reservedStake={Number(reservedStake)}
          />
        </div>
        <div className="pt-6 text-center">
          <Button
            label="Create round"
            onClick={async () => await createRound()}
          />
          <p>
            <span
              className="inline-block mt-4 text-sm font-bold text-red-500 cursor-pointer hover:underline"
              onClick={() => setModalView({ name: "" })}
            >
              Go back
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
