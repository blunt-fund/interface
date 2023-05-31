import { addresses } from "utils/constants"

export const tokensQueryProject = (
  projectId: number | string
) => /* GraphQL */ `
project(
  id: "2-${projectId}"
) {
  owner
  deployer
  createdAt
  metadataUri
  configureEvents (orderBy: timestamp, orderDirection: asc) {
    timestamp
    duration
    weight
    dataSource
  }
  participants (orderBy: volume, orderDirection: desc) {
    wallet {
      id
    }
  }
}
`

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
  configureEvents (orderBy: timestamp, orderDirection: asc)  {
    timestamp
    duration
    weight
    dataSource
  }
}
`
