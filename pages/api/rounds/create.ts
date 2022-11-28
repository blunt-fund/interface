import prisma from "@lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { metadataUri, projectId, metadata } = JSON.parse(req.body)

      const projectData = await prisma.project.create({
        data: { projectId: Number(projectId), metadataUri, metadata }
      })

      res.status(200).json(projectData)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
