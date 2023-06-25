import { RoundData } from "@utils/getRounds"
import { BigNumber, ethers } from "ethers"
import { addresses as addressConstants } from "utils/constants"
import calculateSplits from "@utils/calculateSplits"
import { parseEther } from "viem"

const formatDeployData = (roundData: RoundData, totalShares: number) => {
  const {
    target,
    cap,
    isTargetUsd,
    isHardcapUsd,
    deadline,
    addresses,
    shares,
    tokenName,
    tokenSymbol,
    projectOwner,
    tokenIssuance,
    metadata
  } = roundData

  return {
    deployBluntDelegateData: {
      directory: addressConstants.JBDirectory,
      // sliceCore: addressConstants.SliceCore,
      projectOwner,
      hardcap: !isHardcapUsd
        ? parseEther(String(cap))
        : BigNumber.from(10).pow(6).mul(cap),
      target: !isTargetUsd
        ? parseEther(String(target))
        : BigNumber.from(10).pow(6).mul(target),
      // releaseTimelock: releaseTimelock,
      // transferTimelock: transferTimelock,
      afterRoundReservedRate: totalShares * 100,
      // afterRoundSplits: calculateSplits(shares, addresses, totalShares),
      tokenName,
      tokenSymbol,
      // enforceSlicerCreation,
      isTargetUsd,
      isHardcapUsd
    },
    launchProjectData: {
      projectMetadata: {
        content: metadata,
        domain: 0
      },
      data: {
        duration: deadline && Number(deadline) != 0 ? Number(deadline) : 0,
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
      memo: "Created from blunt.fund"
    }
  }
}

export default formatDeployData
