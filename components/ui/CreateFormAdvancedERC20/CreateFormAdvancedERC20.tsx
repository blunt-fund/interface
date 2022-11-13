import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction } from "react"
export type NewImage = { url: string; file: File }

type Props = {
  name: string
  tokenSymbol: string
  tokenIssuance: number
  setTokenSymbol: Dispatch<SetStateAction<string>>
  setTokenIssuance: Dispatch<SetStateAction<number>>
}

const CreateFormAdvancedERC20 = ({
  name,
  tokenSymbol,
  tokenIssuance,
  setTokenSymbol,
  setTokenIssuance
}: Props) => {
  const handleSetTokenSymbol = (tokenSymbol: string) => {
    setTokenSymbol(tokenSymbol.toUpperCase())
  }

  return (
    <div className="py-3 space-y-6">
      <p>
        Configure the project&apos;s ERC20 token and the amount to be issued to
        blunt round participants.
      </p>
      <div>
        <Input
          type="string"
          label="Token symbol"
          value={tokenSymbol}
          onChange={handleSetTokenSymbol}
          placeholder={
            name
              ? name
                  .replaceAll(/[^a-zA-Z]+/g, "")
                  .slice(0, 5)
                  .toUpperCase()
              : "BLUNT"
          }
          question={
            <>
              Symbol of the ERC20 token to be issued for the project. Tipically
              between 3 and 7 letters.
            </>
          }
        />
      </div>
      <div>
        <Input
          type="number"
          label="Tokens issued per ETH"
          min={0}
          value={tokenIssuance != 0 ? tokenIssuance : ""}
          onChange={setTokenIssuance}
          placeholder="1000000"
          question={
            <>
              Number of tokens to issue per ETH contributed during the blunt
              round.
            </>
          }
          questionPosition="bottom-[-4px] left-0 xs:left-[-96px]"
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedERC20
