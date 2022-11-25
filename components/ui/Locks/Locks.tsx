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
  const now = new Date().getTime()
  return (
    <div className="space-y-3 text-right">
      {transferTimestamp != 0 && transferTimestamp > now && (
        <p className="text-sm">
          Slice transfers locked until:{" "}
          <span className="font-bold">
            {new Date(transferTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
      {releaseTimestamp != 0 && releaseTimestamp > now && (
        <p className="text-sm">
          Token withdraws locked until:{" "}
          <span className="font-bold">
            {new Date(releaseTimestamp).toLocaleDateString()}
          </span>
        </p>
      )}
      {roundTimestamp != 0 && roundTimestamp > now && (
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
