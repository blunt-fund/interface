import { Input, NoteText } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction } from "react"
import { RoundData } from "utils/getRounds"

export type NewImage = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormAdvancedERC20 = ({ roundData, setRoundData }: Props) => {
  const { name, tokenName, tokenSymbol, tokenIssuance } = roundData

  const handleSetTokenIssuance = (value: number) => {
    handleSetObject("tokenIssuance", value, roundData, setRoundData)
  }

  const handleSetTokenName = (value: string) => {
    handleSetObject("tokenName", value, roundData, setRoundData)
  }

  const handleSetTokenSymbol = (value: string) => {
    handleSetObject("tokenSymbol", value.toUpperCase(), roundData, setRoundData)
  }

  return (
    <div className="space-y-8 py-3">
      <p>Configure the amount of tokens issued to round participants.</p>
      <div>
        <Input
          type="number"
          label="Tokens issued during round"
          min={0}
          value={tokenIssuance != 0 ? tokenIssuance : ""}
          onChange={handleSetTokenIssuance}
          placeholder="1000000"
          after="/ ETH"
          question={
            <>
              <p>
                The amount of tokens to issue per ETH contributed during the
                blunt round.
              </p>
              <p>
                If left blank or set to 0, a small amount of tokens will still
                be issued in order to handle refunds (0.001 tokens/ETH).
              </p>
              <p>
                Once the round ends, token emission can be modified by the
                project owner.
              </p>
            </>
          }
        />
      </div>
      <div>
        <Input
          type="string"
          label="Token name"
          value={tokenName}
          onChange={handleSetTokenName}
          placeholder={name ? name : "Blunt"}
          question={<>Name of the ERC20 token to be issued for the project.</>}
        />
      </div>
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
              <p>Symbol of the ERC20 token to be issued for the project. </p>
              <p>Tipically between 3 and 7 letters.</p>
            </>
          }
        />
      </div>
      <NoteText text="Token name and symbol can also be set later, while the round is in progress" />
    </div>
  )
}

export default CreateFormAdvancedERC20
