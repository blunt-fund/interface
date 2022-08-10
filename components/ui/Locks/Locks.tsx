import { nullDate } from "../MyRounds/MyRounds"

type Props = {
  transferTimestamp: number
  releaseTimestamp: number
}

const Locks = ({ transferTimestamp, releaseTimestamp }: Props) => {
  return (
    <div className="space-y-3">
      {transferTimestamp != 0 && transferTimestamp > nullDate && (
        <p className="text-sm text-left">
          Transfers locked until:{" "}
          <span className="font-bold">
            {new Date(transferTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
      {releaseTimestamp != 0 && releaseTimestamp > nullDate && (
        <p className="text-sm text-left">
          Token release locked until:{" "}
          <span className="font-bold">
            {new Date(releaseTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
    </div>
  )
}

export default Locks
