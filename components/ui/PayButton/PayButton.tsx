import { Input } from "@components/ui"
import formatNumber from "@utils/formatNumber"
import { Dispatch, SetStateAction } from "react"

type Props = {
  round: any
  payment: number
  isPaymentEth: boolean
  setPayment: Dispatch<SetStateAction<number>>
  setIsPaymentEth: Dispatch<SetStateAction<boolean>>
}

const PayButton = ({
  round,
  payment,
  setPayment,
  isPaymentEth,
  setIsPaymentEth
}: Props) => {
  return (
    <div>
      <Input
        type="number"
        onClickLabel="Pay"
        min={0}
        value={payment || ""}
        onChange={setPayment}
        prefix={isPaymentEth ? "Ξ" : "$"}
        prefixAction={() => setIsPaymentEth(!isPaymentEth)}
        onClick={() => null}
      />
      <p className="pt-1.5 text-xs xs:text-sm text-left">
        Receive{" "}
        <span className="font-bold text-blue-600">
          {round.tokenIssuance != 0 &&
            `${formatNumber(
              payment
                ? Number(Number(payment * round.tokenIssuance).toFixed(0))
                : round.tokenIssuance,
              3
            )} 
                ${round.tokenSymbol} `}
          {round.tokenIssuance != 0 && round.reservedStake != 0 && "+ "}
          {round.reservedStake != 0 &&
            `${formatNumber(
              payment
                ? payment * round.reservedStake * 1000
                : round.reservedStake * 1000,
              1
            )} slices `}
        </span>
        {!payment && (isPaymentEth ? "/ ETH" : "/ USD")}
      </p>
    </div>
  )
}

export default PayButton
