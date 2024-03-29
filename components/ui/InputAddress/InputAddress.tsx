import formatAddress from "@utils/formatAddress"
import resolveEns from "@utils/resolveEns"
import React, {
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useEffect
} from "react"
import { useAppContext } from "../context"
import Input from "../Input/Input"

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  address: `0x${string}`
  resolvedAddress: string
  setResolvedAddress: Dispatch<SetStateAction<string>>
  helptext?: string | JSX.Element
  question?: JSX.Element
  label?: string
  onChange?: (...args: any[]) => any
  placeholder?: string
  resolve?: boolean
  disabled?: boolean
}

const InputAddress: React.FC<Props> = (props) => {
  const { provider } = useAppContext()
  const {
    address,
    required,
    disabled,
    label,
    helptext,
    question,
    placeholder = "0x… / bluntly.eth",
    onChange,
    resolvedAddress,
    setResolvedAddress,
    ...rest
  } = props

  const addressReduced = resolvedAddress
    ? resolvedAddress.substring(resolvedAddress.length - 4) !== ".eth" &&
      resolvedAddress !== "Invalid ENS name"
      ? formatAddress(resolvedAddress)
      : resolvedAddress
    : null

  useEffect(() => {
    if (provider && address) {
      const timeout = setTimeout(
        () => resolveEns(provider, address, setResolvedAddress),
        200
      )
      return () => {
        clearTimeout(timeout)
        setResolvedAddress("")
      }
    }
  }, [provider, address])

  return (
    <div className="relative">
      <Input
        type="string"
        value={address}
        placeholder={placeholder}
        label={label}
        required={required}
        error={resolvedAddress === "Invalid ENS name"}
        onChange={onChange}
        disabled={disabled}
        helptext={helptext}
        question={question}
      />
      {resolvedAddress && (
        <p
          className={`${
            resolvedAddress === "Invalid ENS name"
              ? "text-red-500"
              : "text-yellow-600"
          } } absolute left-0 bottom-[-20px] text-xs font-black
          opacity-80`}
        >
          {addressReduced}
        </p>
      )}
    </div>
  )
}

export default InputAddress
