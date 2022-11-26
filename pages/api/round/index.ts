import prisma from "@lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { ids } = req.query
      const idList = String(ids).split("_")
      const projectData = await prisma.project.findMany({
        where: {
          OR: [...idList.map((id) => ({ projectId: { equals: Number(id) } }))]
        }
      })
      res.status(200).json(projectData)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default handler
