import { RoundData } from "@utils/getRounds"
import { BigNumber, ethers } from "ethers"
import { addresses as addressConstants } from "utils/constants"
import calculateSplits from "@utils/calculateSplits"

const formatDeployData = (roundData: RoundData, totalShares: number) => {
  const {
    target,
    cap,
    isTargetEth,
    isCapEth,
    duration,
    transferTimelock,
    releaseTimelock,
    roundTimelock,
    addresses,
    shares,
    projectOwner,
    tokenName,
    tokenSymbol,
    tokenIssuance,
    isSlicerToBeCreated: enforceSlicerCreation,
    metadata
  } = roundData

  return {
    deployBluntDelegateData: {
      directory: addressConstants.JBDirectory,
      fundingCycleStore: addressConstants.JBFundingCycleStore,
      sliceCore: addressConstants.SliceCore,
      projectOwner,
      hardcap: isCapEth
        ? ethers.utils.parseEther(String(cap))
        : BigNumber.from(10).pow(6).mul(cap),
      target: isTargetEth
        ? ethers.utils.parseEther(String(target))
        : BigNumber.from(10).pow(6).mul(target),
      releaseTimelock: releaseTimelock,
      transferTimelock: transferTimelock,
      afterRoundReservedRate: totalShares * 100,
      afterRoundSplits: calculateSplits(
        shares,
        addresses,
        totalShares,
        roundTimelock
      ),
      tokenName,
      tokenSymbol,
      enforceSlicerCreation,
      isTargetUsd: !isTargetEth,
      isHardcapUsd: !isCapEth
    },
    launchProjectData: {
      projectMetadata: {
        content: metadata,
        domain: 1
      },
      data: {
        duration: duration != 0 ? BigNumber.from(duration).mul(86400) : 0,
        weight:
          tokenIssuance != 0
            ? BigNumber.from(10).pow(18).mul(tokenIssuance)
            : BigNumber.from(10).pow(15),
        discountRate: 0,
        ballot: ethers.constants.AddressZero
      },
      metadata: {
        global: {
          allowSetTerminals: false,
          allowSetController: false,
          pauseTransfers: true
        },
        reservedRate: 0,
        redemptionRate: 0,
        ballotRedemptionRate: 0,
        pausePay: false,
        pauseDistributions: false,
        pauseRedeem: false,
        pauseBurn: false,
        allowMinting: false,
        allowTerminalMigration: false,
        allowControllerMigration: false,
        holdFees: false,
        preferClaimedTokenOverride: false,
        useTotalOverflowForRedemptions: false,
        useDataSourceForPay: true,
        useDataSourceForRedeem: true,
        dataSource: ethers.constants.AddressZero,
        metadata: 0
      },
      mustStartAtOrAfter: 0,
      groupedSplits: [],
      fundAccessConstraints: [],
      terminals: [addressConstants.JBTerminal],
      memo: "Created from blunt.finance"
    }
  }
}

export default formatDeployData
