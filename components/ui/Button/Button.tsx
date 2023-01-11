import { FC } from "react"
import Spinner from "@components/icons/Spinner"
import Link from "next/link"

interface ButtonProps {
  loading?: boolean
  customClassName?: string
  customColor?: string
  type?: "button" | "submit" | "reset"
  label?: string | JSX.Element
  href?: string
  onClick?: any
  secondary?: boolean
  disabled?: boolean
}

const Button: FC<ButtonProps> = (props) => {
  const {
    customClassName,
    customColor,
    type,
    label,
    href,
    onClick,
    loading = false,
    secondary = false,
    disabled = false,
    ...rest
  } = props

  const className =
    customClassName || secondary
      ? "px-5 overflow-hidden text-sm font-bold tracking-wide rounded-sm"
      : "overflow-hidden font-bold tracking-wide rounded-sm"
  const color = !disabled
    ? customColor
      ? customColor
      : secondary
      ? "dark:!text-white text-blue-600 border-blue-600 border-2 hover:bg-blue-700 focus:bg-blue-700 hover:text-white"
      : "text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
    : "bg-gray-400 dark:!bg-gray-500 cursor-not-allowed"

  const rootClassName = `nightwind-prevent px-7 h-[40px] min-w-[150px] focus:outline-none ${color} ${className}`

  return href ? (
    <Link href={href} className="block">
      <button className={rootClassName}>{label}</button>
    </Link>
  ) : (
    <button
      className={rootClassName}
      type={type}
      disabled={disabled}
      onClick={!disabled && !loading ? onClick : null}
    >
      <div className="flex items-center justify-center w-full">
        {loading ? <Spinner /> : <p>{label}</p>}
      </div>
    </button>
  )
}

export default Button
