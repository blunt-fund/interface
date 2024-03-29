const formatNumber = (number: number | undefined, decimals = 1) => {
  if (number == undefined) return "..."

  const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"]
  const tier = (Math.log10(Math.abs(number)) / 3) | 0
  if (tier == 0) return Math.floor(number * 1000) / 1000
  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = number / scale

  const roundFactor = Math.pow(10, decimals)
  const formatted = Math.floor(scaled * roundFactor) / roundFactor
  return String(formatted) + suffix
}

export default formatNumber
