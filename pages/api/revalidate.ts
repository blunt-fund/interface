import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { paths } = req.query

  try {
    if (typeof paths == "string") {
      await res.revalidate(`/${paths}`)
    } else {
      for (let i = 0; i < paths.length; i++) {
        await res.revalidate(`/${paths[i]}`)
      }
    }

    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating")
  }
}

export default handler
