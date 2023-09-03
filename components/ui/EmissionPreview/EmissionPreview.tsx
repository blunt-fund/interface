import { PieChart, ReservedTable } from "@components/ui"

type Props = {
  shares: number[]
  totalShares: number
}

const EmissionPreview = ({ shares, totalShares }: Props) => {
  return (
    <div className="space-y-10 py-6">
      <p className="text-center text-base">
        Token emission (after blunt round)
      </p>
      <div className="text-black">
        <PieChart
          addresses={["Contributor", "Other reserves", "Blunt round"]}
          shares={[100 - totalShares, totalShares - shares[0], shares[0]]}
          total={100}
        />
      </div>
      <div>
        <ReservedTable
          reservedPool={totalShares}
          reservedStake={Number(shares[0])}
        />
      </div>
    </div>
  )
}

export default EmissionPreview
