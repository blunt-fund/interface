import { Button } from "@components/ui"
import { NextSeo } from "next-seo"
import { FC } from "react"

export interface ActionScreenProps {
  highlightTitle?: string
  title?: string
  text?: JSX.Element | string
  helpText?: JSX.Element | string
  href?: string
  loading?: boolean
  buttonLabel?: string
  buttonLabelSecondary?: string
  onClick?: any
  onClickSecondary?: any
}

const ActionScreen: FC<ActionScreenProps> = ({
  text = "",
  buttonLabel = "",
  buttonLabelSecondary = "",
  highlightTitle = "",
  title = "",
  helpText = "",
  href = "",
  loading = false,
  onClick = () => null,
  onClickSecondary = () => null
}) => {
  return (
    <main className="mx-auto w-full max-w-screen-sm">
      {title && <NextSeo title={title} />}
      <div className="flex flex-col items-center text-center">
        {highlightTitle && <h1>{highlightTitle}</h1>}
        {text && typeof text === "string" ? (
          <h3 className="mb-7 font-bold">{text}</h3>
        ) : (
          text
        )}
        {helpText && typeof helpText === "string" ? (
          <p className="mb-7 opacity-70">{helpText}</p>
        ) : (
          helpText
        )}
        {(buttonLabel || loading) && loading ? (
          <Button loading />
        ) : href ? (
          <Button label={buttonLabel} href={href} />
        ) : (
          <Button label={buttonLabel} onClick={onClick} />
        )}
        {buttonLabelSecondary && (
          <a className="highlight mt-8" onClick={onClickSecondary}>
            {buttonLabelSecondary}
          </a>
        )}
      </div>
    </main>
  )
}

export default ActionScreen
