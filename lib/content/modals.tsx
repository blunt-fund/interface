import Crown from "@components/icons/Crown"
import {
  Button,
  EmissionPreview,
  Input,
  LoadingStep,
  Locks,
  OwnerDisplay,
  RoundViewMain
} from "@components/ui"
import { useAppContext } from "@components/ui/context"
import { addresses } from "@utils/constants"
import executeTransaction from "@utils/executeTransaction"
import formatAddress from "@utils/formatAddress"
import formatNumber from "@utils/formatNumber"
import { useState } from "react"
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import JBTokenStore from "abi/JBTokenStore.json"
import { BigNumber, ethers } from "ethers"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"
import { formatEther } from "ethers/lib/utils.js"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames =
  | ""
  | "NETWORK_VIEW"
  | "REVIEW_ROUND_VIEW"
  | "CREATE_ROUND_VIEW"
  | "ROUND_INFO_VIEW"
  | "REDEEM_VIEW"

export const NETWORK_VIEW = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl">Pick the right chain</h1>
        <div className="py-8">
          <p>
            Connect to the{" "}
            <b>{chainId === "5" ? "Goerli Testnet" : "Ethereum Mainnet"}</b>{" "}
            Network
          </p>
        </div>
        <div
          className="flex justify-center pt-6"
          onClick={() => saEvent("connect_wallet_attempt")}
        >
          <ConnectButton
            accountStatus={{
              smallScreen: "address",
              largeScreen: "full"
            }}
            chainStatus="full"
            showBalance={false}
          />
        </div>
      </div>
    </>
  )
}

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

export const CREATE_ROUND_VIEW = (params: any) => {
  const { setModalView } = useAppContext()
  const { uploadStep, roundId } = params

  let uploadState: string
  switch (uploadStep) {
    case 1:
      uploadState = "Saving metadata"
      break
    case 2:
      uploadState = "Settin up round"
      break
    case 3:
      uploadState = "Reverting"
      break
    case 4:
      uploadState = "Reverted"
      break
    case 5:
      uploadState = "Finalizing ..."
      break
    case 6:
      uploadState = "Success!"
      break
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Transaction in progress</h1>
      <div className="space-y-8">
        <div className="grid items-center max-w-lg grid-cols-6 gap-2 px-4 pt-12 pb-8 mx-auto">
          <LoadingStep
            initCondition={uploadStep < 2}
            uploadState={uploadState}
            endState={uploadStep == 3 || uploadStep == 4 ? uploadState : "Done"}
          />
          <LoadingStep
            nullCondition={uploadStep < 2}
            initCondition={uploadStep == 2 || uploadStep == 5}
            uploadState={uploadState}
            waitingState="Create round"
            endState={uploadStep < 6 ? uploadState : "Done"}
          />
        </div>
        <div>
          {uploadStep == 4 || uploadStep == 6 ? (
            uploadStep == 6 ? (
              <div onClick={() => setModalView({ name: "" })}>
                <Button label={"Go to round"} href={`/rounds/${roundId}`} />
              </div>
            ) : (
              <Button
                label={"Go back"}
                onClick={() => setModalView({ name: "" })}
              />
            )
          ) : (
            <p className="mx-auto text-sm font-bold text-yellow-600">
              Wait until the process is completed
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const REVIEW_ROUND_VIEW = (params: any) => {
  const { setModalView } = useAppContext()
  const {
    roundData,
    descriptionHtml,
    totalShares,
    createRound,
    // transferTimestamp,
    // releaseTimestamp,
    // roundTimestamp,
    projectOwner
  } = params
  const { shares } = roundData
  const now = Math.floor(new Date().getTime() / 1000)
  const tempRoundData = { ...roundData, deadline: roundData["deadline"] + now }

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Review terms</h1>
      <div className="pt-8 space-y-8">
        <p className="text-gray-600">
          Proceeding will create a round with the settings below.
        </p>
        <hr className="w-20 !my-12 mx-auto border-gray-300" />
        <RoundViewMain
          roundData={tempRoundData}
          descriptionHtml={descriptionHtml}
          isRoundClosed={false}
        />

        {/* <Locks
          transferTimestamp={transferTimestamp}
          releaseTimestamp={releaseTimestamp}
          roundTimestamp={roundTimestamp}
        /> */}

        {/* <EmissionPreview shares={shares} totalShares={totalShares} /> */}

        <div className="flex justify-center w-full">
          <OwnerDisplay projectOwner={projectOwner} />
        </div>

        <div className="pt-6 text-center">
          <Button
            label="Create round"
            onClick={async () => await createRound()}
          />
          <p>
            <span
              className="inline-block mt-4 text-sm font-bold text-red-500 cursor-pointer hover:underline"
              onClick={() => setModalView({ name: "" })}
            >
              Go back
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export const REDEEM_VIEW = (params: any) => {
  const { account, setModalView } = useAppContext()
  const [redeemAmount, setRedeemAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const {
    projectId,
    formattedAccountContributions,
    totalContributions,
    tokenIssuance
  } = params

  // TODO: Make this independent from total tokens owned, and calculate based on accountsContributions and tokenIssuance
  const { data: tokenCountAll } = useContractRead({
    address: addresses.JBTokenStore,
    abi: JBTokenStore.abi,
    functionName: "balanceOf",
    args: [account, projectId]
  }) as { data: BigNumber }

  const tokenCount =
    tokenCountAll &&
    ethers.BigNumber.from(
      Math.round((redeemAmount * 1e9) / formattedAccountContributions)
    )
      .mul(tokenCountAll)
      .div(1e9)

  const { config, error } = usePrepareContractWrite({
    address: addresses.JBTerminal,
    abi: JBTerminal.abi,
    functionName: "redeemTokensOf",
    args: [
      account,
      projectId,
      tokenCount || 0,
      ethers.constants.AddressZero,
      0,
      account,
      "Redeemed from blunt.finance",
      []
    ]
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Refund contributions</h1>
      <div className="pt-16 text-left">
        <p className="pb-2 text-sm">
          You contributed: <b>{formattedAccountContributions} ETH</b>
        </p>
        <Input
          type="number"
          onClickLabel="Refund"
          error={redeemAmount > formattedAccountContributions}
          min={0}
          max={formattedAccountContributions}
          placeholder={`Refund up to ${formattedAccountContributions} ETH`}
          step={0.001}
          value={redeemAmount || ""}
          onChange={setRedeemAmount}
          prefix="Ξ"
          loading={loading}
          onClick={async () =>
            redeemAmount != 0 &&
            (await executeTransaction(
              writeAsync,
              setLoading,
              `Redeem ${redeemAmount}Ξ | Round ${projectId}`,
              addRecentTransaction,
              () => setModalView({ name: "" }),
              true
            ))
          }
        />
        <div className="text-left text-xs xs:text-sm pt-1.5">
          {tokenCountAll &&
            (redeemAmount ? (
              <p>
                Return{" "}
                <span className="font-bold">
                  {formatNumber(Math.round(Number(formatEther(tokenCount))))}{" "}
                  tokens
                </span>
              </p>
            ) : (
              <p>
                Owned:{" "}
                <span className="font-bold">
                  {formatNumber(Math.round(Number(formatEther(tokenCountAll))))}{" "}
                  tokens
                </span>
              </p>
            ))}
        </div>
        {/* <p className="pt-6 text-sm">
          Remaining slices:{" "}
          <b>
            {formatNumber(
              Math.round((formattedAccountContributions - redeemAmount) * 1000)
            )}
          </b>{" "}
          (
          {Math.floor(
            ((formattedAccountContributions - redeemAmount) /
              (totalContributions - redeemAmount) || 1) * 1e4
          ) / 100}
          % of round allocation)
        </p> */}
      </div>
    </div>
  )
}
