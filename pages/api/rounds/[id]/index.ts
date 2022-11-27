import { gql } from "@apollo/client"
import client from "@utils/apollo-client"
import prisma from "@lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"
import { tokensQueryProject } from "@lib/gqlQueries"
import fetcher from "@utils/fetcher"
import constants from "@utils/constants"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { id } = req.query

      let [{ data }, projectData] = await Promise.all([
        client.query({
          query: gql`
          query Projects {
            ${tokensQueryProject(Number(id))}
          }
        `
        }),
        prisma.project.findFirst({
          where: { projectId: Number(id) }
        })
      ])
      const subgraphData = data?.project

      if (!projectData || projectData.metadataUri != subgraphData.metadataUri) {
        const metadata = await fetcher(
          constants.ipfsGateway + subgraphData.metadataUri
        )

        projectData = await prisma.project.upsert({
          where: { projectId: Number(id) },
          create: {
            projectId: Number(id),
            metadataUri: subgraphData.metadataUri,
            metadata
          },
          update: { metadataUri: subgraphData.metadataUri, metadata }
        })
      }

      res.status(200).json({ subgraphData, projectData })
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
