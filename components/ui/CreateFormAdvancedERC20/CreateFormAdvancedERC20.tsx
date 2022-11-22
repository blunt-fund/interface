import { Input, NoteText } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction } from "react"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
export type NewImage = { url: string; file: File }

type Props = {
  createRoundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormAdvancedERC20 = ({ createRoundData, setRoundData }: Props) => {
  const { name, tokenName, tokenSymbol, tokenIssuance } = createRoundData

  const handleSetTokenIssuance = (value: number) => {
    handleSetObject("tokenIssuance", value, createRoundData, setRoundData)
  }

  const handleSetTokenName = (value: string) => {
    handleSetObject("tokenName", value, createRoundData, setRoundData)
  }

  const handleSetTokenSymbol = (value: string) => {
    handleSetObject(
      "tokenSymbol",
      value.toUpperCase(),
      createRoundData,
      setRoundData
    )
  }

  return (
    <div className="py-3 space-y-6">
      <p>
        Configure the project&apos;s ERC20 token and the amount to be issued to
        blunt round participants.
      </p>
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
                If left blank, note that a small amount of tokens is still
                issued (0.001 tokens per ETH) in order to handle redemptions.
              </p>
              <p>Once the blunt round ends, token emission will be 1M / ETH.</p>
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
          placeholder={name ? name : "Blunt Finance"}
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
