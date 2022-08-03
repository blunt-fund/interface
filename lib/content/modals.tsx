export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames = "" | "ROUND_INFO_VIEW"

export const ROUND_INFO_VIEW = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl">Reserved Rate explained</h1>
      <div className="pt-8 prose">
        <p>something something RR something something</p>
      </div>
    </div>
  )
}
