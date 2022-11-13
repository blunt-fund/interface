export default async function deletePins(requestIds: string[]) {
  const endpoints = requestIds.map(
    (requestId) => `https://api.web3.storage/pins/${requestId}`
  )
  const body = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEB3STORAGE_KEY}`
    },
    method: "DELETE"
  }

  endpoints.forEach((endpoint) => fetch(endpoint, body))
}
