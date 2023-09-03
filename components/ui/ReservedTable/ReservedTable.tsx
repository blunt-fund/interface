import { useAppContext } from "../context"

type Props = {
  reservedPool: number
  reservedStake: number
}
const ReservedTable = ({ reservedPool, reservedStake }: Props) => {
  return (
    <div className="text-center">
      <table>
        <thead>
          <tr className="bg-gray-100">
            {/* <th scope="col">Cycle</th> */}
            <th className="w-1/3 text-xs xs:text-sm" scope="col">
              Contributor
            </th>
            <th className="w-1/3 text-xs xs:text-sm" scope="col">
              Blunt round
            </th>
            <th className="w-1/3 text-xs xs:text-sm" scope="col">
              Other reserves
            </th>
          </tr>
        </thead>
        <tbody>
          {/*<tr className="border-b border-gray-200">
             <th scope="row">Current</th> 
            <td>{Number(100 - reservedPool).toFixed(1)}%</td>
            <td>0%</td>
            <td className="font-bold text-blue-400 dark:text-blue-300 ">
              {Number(reservedPool).toFixed(1)}%
            </td>
          </tr>*/}
          <tr className="border-b border-gray-200">
            {/* <th scope="row">Next</th> */}
            <td>{Number(100 - reservedPool).toFixed(1)}%</td>
            <td className="nightwind-prevent font-bold text-yellow-600">
              {Number(reservedStake).toFixed(1)}%
            </td>
            <td className="font-bold text-yellow-400 dark:text-yellow-300 ">
              {Number(reservedPool - reservedStake).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
      {/* <p className="pt-2 text-sm text-right">
        <a
          className="text-gray-600 highlight"
          onClick={() => setModalView({ name: "ROUND_INFO_VIEW", cross: true })}
        >
          WTF is this?
        </a>
      </p> */}
    </div>
  )
}

export default ReservedTable
