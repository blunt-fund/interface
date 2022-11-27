import { gql } from "@apollo/client"
import client from "@utils/apollo-client"
import prisma from "@lib/prisma"
import { tokensQueryProjects } from "@lib/gqlQueries"
import fetcher from "@utils/fetcher"
import type { NextApiRequest, NextApiResponse } from "next"
import constants from "utils/constants"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { data } = await client.query({
        query: gql`
          query Projects {
            ${tokensQueryProjects}
          }
        `
      })
      const projects = data?.projects

      const projectsList =
        projects &&
        projects.map((project) => [project.projectId, project.metadataUri])

      const projectData = await prisma.project.findMany({
        where: {
          OR: projectsList.map(([projectId]) => ({
            projectId: { equals: projectId }
          }))
        }
      })

      for (let i = 0; i < projectsList.length; i++) {
        const [projectId, metadataUri] = projectsList[i]

        const data = projectData.find((el) => el.projectId == projectId)
        if (!data || data.metadataUri != metadataUri) {
          const metadata = await fetcher(constants.ipfsGateway + metadataUri)

          const newData = await prisma.project.upsert({
            where: { projectId },
            create: {
              projectId,
              metadataUri,
              metadata
            },
            update: { metadataUri, metadata }
          })

          if (!data) {
            projectData.push(newData)
          } else {
            const i = projectData.findIndex((el) => el == data)
            projectData[i] = newData
          }
        }
      }

      res.status(200).json({ subgraphData: projects, projectData })
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
