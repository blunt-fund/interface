import prisma from "@lib/prisma"
import { Project } from "@prisma/client"
import constants from "@utils/constants"
import fetcher from "@utils/fetcher"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const {
        newProjects
      }: {
        newProjects: {
          projectId: string
          metadataUri: string
          metadata: string
        }[]
      } = JSON.parse(req.body)

      // Get all metadata
      const updatedMetadata = await Promise.all(
        newProjects.map(({ metadataUri }) =>
          fetcher(constants.ipfsGateway + metadataUri)
        )
      )

      // Update Projects in database
      const projectData: Project[] = await Promise.all(
        newProjects.map(({ projectId, metadataUri }, i) =>
          prisma.project.upsert({
            where: { projectId: Number(projectId) },
            create: {
              projectId: Number(projectId),
              metadataUri,
              metadata: updatedMetadata[i]
            },
            update: { metadataUri, metadata: updatedMetadata[i] }
          })
        )
      )

      res.status(200).json(projectData)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
