import Arrow from "@components/icons/Arrow"
import Spinner from "@components/icons/Spinner"
import React, { InputHTMLAttributes } from "react"
import Question from "../Question"

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string | JSX.Element
  helptext?: string | JSX.Element
  prefix?: string
  after?: string | JSX.Element
  error?: boolean
  loading?: boolean
  inverted?: boolean
  submit?: boolean
  question?: JSX.Element
  questionPosition?: string
  onClickArrow?: boolean
  onClickLabel?: string
  prefixAction?: (...args: any[]) => any
  onClick?: (...args: any[]) => any
  onChange?: (...args: any[]) => any
}

const Input: React.FC<Props> = ({
  className,
  label,
  helptext,
  prefix = "",
  after,
  children,
  error,
  loading,
  disabled,
  inverted,
  submit,
  question,
  questionPosition = "bottom-[-4px] left-0",
  prefixAction,
  onClick,
  onClickLabel,
  onClickArrow = true,
  onChange,
  ...rest
}) => {
  const rounded =
    !prefix && !onClick
      ? "rounded-sm"
      : prefix && onClick
      ? ""
      : prefix
      ? "rounded-r-sm"
      : "rounded-l-sm"
  const rootClassName = `peer bg-white py-2 pl-5 w-full appearance-none pr-4 border focus:outline-none placeholder-gray-400 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500 ${
    error
      ? "border-red-500 text-red-500 focus:border-red-500"
      : "border-gray-200 text-black focus:border-yellow-600"
  } ${rounded} ${className}`

  const handleOnChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      {(label || question) && (
        <div className={`relative flex items-center ${question ? "" : "pb-2"}`}>
          {label && <p className="text-sm">{label}</p>}
          {question && <Question position={questionPosition} text={question} />}
        </div>
      )}
      {helptext && <p className="pb-2 text-xs text-gray-600">{helptext}</p>}
      <div
        className={`relative flex flex-row-reverse ${
          prefix && !error ? "overflow-hidden" : ""
        }`}
      >
        {onClick && (
          <div
            className={`group relative flex items-center justify-center px-6 text-sm font-bold text-white ${
              error
                ? "cursor-pointer bg-red-500"
                : `bg-yellow-600 ${
                    !disabled && !loading ? "cursor-pointer" : ""
                  }`
            }`}
            onClick={!disabled && !loading ? onClick : null}
          >
            {onClickLabel && (
              <span
                className={`mr-2 whitespace-nowrap ${loading ? "-z-10" : ""}`}
              >
                {onClickLabel}
              </span>
            )}
            {onClickArrow && (
              <div
                className={`h-[1.2rem] w-[1.2rem] transition-transform duration-100 text-white group-hover:translate-x-1 ${
                  loading ? "-z-10" : ""
                }`}
              >
                <Arrow />
              </div>
            )}
            {loading && (
              <div className="absolute flex h-full w-full items-center justify-center">
                <Spinner color="text-white" />
              </div>
            )}
          </div>
        )}
        <p className="absolute right-[40px] flex h-full items-center text-sm text-gray-400">
          {after}
        </p>
        <input
          className={rootClassName}
          onChange={handleOnChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled || loading}
          onWheel={(e) => e.currentTarget.blur()}
          {...rest}
        />
        {prefix && (
          <div
            className={`flex items-center justify-center rounded-l-sm border-b-[3px] px-5 text-gray-600 bg-gray-200 dark:border-gray-700 ${
              error
                ? "shadow-error border-red-400 peer-focus:border-red-400 dark:peer-focus:border-red-500"
                : !disabled && !loading
                ? "text-black focus:border-yellow-600 peer-focus:border-yellow-600 dark:peer-focus:border-yellow-300"
                : ""
            } ${
              prefixAction && !disabled && !loading
                ? "cursor-pointer hover:bg-gray-100"
                : ""
            } ${
              disabled || loading
                ? "text-gray-400 bg-gray-100 border-yellow-100 "
                : ""
            }`}
            onClick={
              prefixAction && !disabled && !loading
                ? () => prefixAction()
                : null
            }
          >
            {prefix}
          </div>
        )}
      </div>
    </label>
  )
}

export default Input
