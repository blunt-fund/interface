type Props = {
  page?: boolean
  size?: string
  children: any
}

const Container = ({ size = "", page = false, children }: Props) => {
  return (
    <div
      className={`${
        size ? size : "max-w-screen-lg"
      } mx-auto w-full px-4 md:px-8 ${
        page && "pt-16 pb-10 text-center sm:pt-24 sm:pb-12"
      }`}
    >
      {children}
    </div>
  )
}

export default Container
