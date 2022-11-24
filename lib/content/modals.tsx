import Crown from "@components/icons/Crown"
import {
  Button,
  EmissionPreview,
  LoadingStep,
  Locks,
  RoundViewMain
} from "@components/ui"
import { useAppContext } from "@components/ui/context"
import formatAddress from "@utils/formatAddress"

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
  const { uploadStep } = params
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
      uploadState = "Reverting"
      break
    case 4:
      uploadState = "Reverted"
      break
    case 5:
      uploadState = "Success!"
      break
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Transaction in progress</h1>
      <div className="space-y-6">
        <div className="grid items-center max-w-lg grid-cols-6 gap-2 px-4 pt-12 pb-8 mx-auto">
          <LoadingStep
            initCondition={uploadStep < 2}
            uploadState={uploadState}
            endState={uploadStep == 3 || uploadStep == 4 ? uploadState : "Done"}
          />
          <LoadingStep
            nullCondition={uploadStep < 2}
            initCondition={uploadStep < 3}
            uploadState={uploadState}
            waitingState="Create round"
            endState={uploadStep == 3 || uploadStep == 4 ? uploadState : "Done"}
          />
        </div>
        <div>
          {uploadStep > 3 ? (
            uploadStep > 4 ? (
              <div onClick={() => setModalView({ name: "" })}>
                <Button label={"Go to round"} href={`/round/${roundId}`} />
              </div>
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
    roundData,
    descriptionHtml,
    totalShares,
    createRound,
    transferTimestamp,
    releaseTimestamp,
    roundTimestamp,
    projectOwner
  } = params
  const { shares } = roundData

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Review terms</h1>
      <div className="pt-8 space-y-8">
        <p>
          Proceeding will create a Juicebox project and a slicer to distribute
          future token issued to blunt round participants.
        </p>
        <hr className="w-20 !my-12 mx-auto border-gray-300" />
        <RoundViewMain
          roundData={roundData}
          descriptionHtml={descriptionHtml}
        />

        <Locks
          transferTimestamp={transferTimestamp}
          releaseTimestamp={releaseTimestamp}
          roundTimestamp={roundTimestamp}
        />

        <EmissionPreview shares={shares} totalShares={totalShares} />

        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4">
            <Crown />
          </div>
          <p>Project owner: {formatAddress(projectOwner)}</p>
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
