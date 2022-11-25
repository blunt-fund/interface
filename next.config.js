module.exports = {
  swcMinify: true,
  images: {
    domains: [
      // process.env.NEXT_PUBLIC_APP_URL.split("://").pop().split(":")[0],
      // process.env.NEXT_PUBLIC_SUPABASE_URL.split("://").pop(),
      "ipfs.io"
      // "static.alchemyapi.io",
      // ""
    ]
  }
}
