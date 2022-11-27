import prisma from "@lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { id } = req.query
      const projectData = await prisma.project.findFirst({
        where: { projectId: Number(id) }
      })
      res.status(200).json(projectData)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
