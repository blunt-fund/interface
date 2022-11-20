import Arrow from "@components/icons/Arrow"
import Spinner from "@components/icons/Spinner"
import React, { InputHTMLAttributes } from "react"
import Question from "../Question"

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string | JSX.Element
  helptext?: string | JSX.Element
  prefix?: string
  after?: string
  error?: boolean
  loading?: boolean
  inverted?: boolean
  submit?: boolean
  question?: JSX.Element
  questionPosition?: string
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
  onChange,
  ...rest
}) => {
  const rootClassName = `peer bg-white rounded-sm py-2 pl-6 w-full appearance-none pr-4 border focus:outline-none placeholder-gray-500 disabled:text-gray-500 disabled:border-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
    error
      ? "border-red-500 text-red-500 focus:border-red-500"
      : "border-gray-400 text-black focus:border-blue-600"
  } ${className}`

  const handleOnChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      {(label || question) && (
        <div className="relative flex items-center h-9">
          {label && <p className="text-sm">{label}</p>}
          {question && <Question position={questionPosition} text={question} />}
        </div>
      )}
      {helptext && <p className="pb-2 text-xs text-gray-600">{helptext}</p>}
      <div
        className={`flex flex-row-reverse ${
          prefix && !error ? "overflow-hidden" : ""
        }`}
      >
        {onClick && (
          <div
            className={`relative text-sm font-bold group flex items-center justify-center px-8 text-white nightwind-prevent ${
              error
                ? "cursor-pointer bg-red-500"
                : `bg-blue-600 ${
                    !disabled && !loading
                      ? "cursor-pointer hover:bg-blue-700"
                      : ""
                  }`
            }`}
            onClick={!disabled && !loading ? onClick : null}
          >
            {onClickLabel && (
              <span className={`mr-1 ${loading ? "-z-10" : ""}`}>
                {onClickLabel}
              </span>
            )}
            {/* {" "}
            <div
              className={`w-[1.2rem] h-[1.2rem] text-white nightwind-prevent transition-transform duration-150 group-hover:translate-x-1 ${
                loading ? "-z-10" : ""
              }`}
            >
              <Arrow />
            </div> */}
            {loading && (
              <div className="absolute flex items-center justify-center w-full h-full">
                <Spinner color="text-white nightwind-prevent" />
              </div>
            )}
          </div>
        )}
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
            className={`flex items-center justify-center px-5 text-gray-600 bg-gray-200 border-b-[3px] dark:border-gray-700 ${
              error
                ? "border-red-400 peer-focus:border-red-400 dark:peer-focus:border-red-500 shadow-error"
                : !disabled && !loading
                ? "text-black focus:border-blue-600 peer-focus:border-blue-600 dark:peer-focus:border-blue-600"
                : ""
            } ${
              prefixAction && !disabled && !loading
                ? "cursor-pointer hover:bg-gray-100"
                : ""
            } ${
              disabled || loading
                ? "text-gray-400 border-blue-100 bg-gray-100 "
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
