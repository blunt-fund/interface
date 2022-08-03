type Props = {
  reservedPool: number
  reservedStake: number
}
const ReservedTable = ({ reservedPool, reservedStake }: Props) => {
  return (
    <table>
      <thead>
        <tr className="bg-gray-100">
          <th scope="col">Cycle</th>
          <th scope="col">Contributor</th>
          <th scope="col">Blunt round</th>
          <th scope="col">Other reserved</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Current</th>
          <td>{Number(100 - reservedPool).toFixed(1)}%</td>
          <td>0%</td>
          <td className="font-bold text-blue-400 nightwind-prevent">
            {Number(reservedPool).toFixed(1)}%
          </td>
        </tr>
        <tr className="border border-gray-200">
          <th scope="row">Next</th>
          <td>{Number(100 - reservedPool).toFixed(1)}%</td>
          <td className="font-bold text-blue-600 nightwind-prevent">
            {Number(reservedStake).toFixed(1)}%
          </td>
          <td className="font-bold text-blue-400 nightwind-prevent">
            {Number(reservedPool - reservedStake).toFixed(1)}%
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default ReservedTable
