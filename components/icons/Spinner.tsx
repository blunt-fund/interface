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
        animation: "0.8s infinite steps(4, jump-end) spin "
      }}
    >
      <Logo />
    </div>
  )
}

export default Spinner
