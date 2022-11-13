import fetcher from "./fetcher"

export default async function getRequestIds(cids: string[]) {
  const endpoint = `https://api.web3.storage/pins?status=queued,pinning,pinned&cid=${cids.join(
    ","
  )}`
  const body = {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEB3STORAGE_KEY}`
    },
    method: "GET"
  }
  return await fetcher(endpoint, body)
}

// TODO: Wait for web3.storage to fix this endpoint
