import { addresses } from "utils/constants"

export const tokensQueryProjects = /* GraphQL */ `
projects(
  where: {
    deployer: "${addresses.BluntDelegateProjectDeployer.toLowerCase()}"
  },
  orderBy: "createdAt", 
  orderDirection: "desc"
) {
  projectId
  owner
  createdAt
  metadataUri
  configureEvents {
    timestamp
    duration
    weight
    dataSource
  }
}
`
