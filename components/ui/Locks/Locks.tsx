import { nullDate } from "../MyRounds/MyRounds"

type Props = {
  transferTimestamp: number
  releaseTimestamp: number
  roundTimestamp: number
}

const Locks = ({
  transferTimestamp,
  releaseTimestamp,
  roundTimestamp
}: Props) => {
  return (
    <div className="space-y-3 text-right">
      {transferTimestamp != 0 && transferTimestamp > nullDate && (
        <p className="text-sm">
          Slice transfers locked until:{" "}
          <span className="font-bold">
            {new Date(transferTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
      {releaseTimestamp != 0 && releaseTimestamp > nullDate && (
        <p className="text-sm">
          Token withdraws locked until:{" "}
          <span className="font-bold">
            {new Date(releaseTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
      {roundTimestamp != 0 && roundTimestamp > nullDate && (
        <p className="text-sm">
          Round token allocation locked until:{" "}
          <span className="font-bold">
            {new Date(roundTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
    </div>
  )
}

export default Locks
