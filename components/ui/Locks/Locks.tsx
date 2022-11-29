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
            {new Date(transferTimestamp).toDateString().substring(4)}
          </span>
        </p>
      )}
      {releaseTimestamp != 0 && releaseTimestamp > now && (
        <p className="text-sm">
          Token withdraws locked until:{" "}
          <span className="font-bold">
            {new Date(releaseTimestamp).toDateString().substring(4)}
          </span>
        </p>
      )}
      {roundTimestamp != 0 && roundTimestamp * 1000 > now && (
        <p className="text-sm">
          Round allocation locked until:{" "}
          <span className="font-bold">
            {new Date(roundTimestamp * 1000).toDateString().substring(4)}
          </span>
        </p>
      )}
    </div>
  )
}

export default Locks
