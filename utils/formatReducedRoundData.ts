import { ReducedRoundData, RoundData } from "./formatRoundInfo"

const formatReducedRoundData = (roundReduced: ReducedRoundData) => {
  roundReduced["projectOwner"] = ""
  roundReduced["transferTimeLock"] = 0
  roundReduced["releaseTimeLock"] = 0
  roundReduced["roundTimeLock"] = 0
  roundReduced["tokenName"] = ""
  roundReduced["website"] = ""
  roundReduced["twitter"] = ""
  roundReduced["discord"] = ""
  roundReduced["docs"] = ""
  roundReduced["metadata"] = ""
  roundReduced["fundingCycleRound"] = 0

  return roundReduced as RoundData
}

export default formatReducedRoundData
