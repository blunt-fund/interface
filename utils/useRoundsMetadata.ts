import { useEffect, useState } from "react"
import constants from "./constants"
import fetcher from "./fetcher"

const useRoundsMetadata = (projects: any[]) => {
  const [roundMetadata, setRoundMetadata] = useState(null)

  useEffect(() => {
    const getRoundInfo = async () => {
      const cids = []
      const bluntDelegates = projects.map((project) => {
        cids.push(project.metadataUri)
        return project.bluntDelegateAddress
      })

      const metadataPromises = Promise.all(
        cids.map((cid) => fetcher(constants.ipfsGateway + cid))
      )

      const [metadata] = await Promise.all([metadataPromises])

      setRoundMetadata(metadata)
    }

    if (projects && projects[0]) {
      getRoundInfo()
    }
  }, projects)

  return roundMetadata
}

export default useRoundsMetadata
