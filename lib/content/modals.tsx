import { Button } from "@components/ui"
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

export const CREATE_ROUND_PROCESS = (params) => {
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
    </div>
  )
}

export const CREATE_ROUND_REVIEW = (params: any) => {
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
      <h1 className="text-2xl sm:text-3xl">Blunt round review</h1>
      <div className="pt-8 space-y-6">
        <p>
          WIP || Preview screen of the blunt round page with following data ||
          WIP
        </p>
        <table>
          <thead>
            <tr className="bg-gray-100">
              <th scope="col">Property</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(params).map((el, i) => {
              return (
                <tr key={i} className="border-b border-gray-200">
                  {/* <th scope="row">Next</th> */}
                  <td>{el[0]}</td>
                  <td className="font-bold">{String(el[1])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="pt-6 text-center">
          <Button
            label="Create round"
            onClick={() =>
              setModalView({
                name: "CREATE_ROUND_PROCESS",
                cross: true,
                params: {
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
                }
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
