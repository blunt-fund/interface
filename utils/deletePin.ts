export default function deletePin(cid: string) {
  const endpoint = `https://api-staging.web3.storage/pins/${cid}`
  const body = {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEB3STORAGE_KEY}`
    },
    method: "DELETE"
  }
  fetch(endpoint, body)
}
