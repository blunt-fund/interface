import Logo from "./Logo"

type Props = {
  size?: string
  color?: string
}

const Spinner = ({ size, color }: Props) => {
  return (
    <div
      className={`${size ? size : "h-5 w-5"} ${color ? color : ""}`}
      style={{
        animation: "spin 0.8s steps(4, jump-end) infinite"
      }}
    >
      <Logo />
    </div>
  )
}

export default Spinner
