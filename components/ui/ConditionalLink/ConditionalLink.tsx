import Link from "next/link"

type Props = {
  children: JSX.Element
  href: string
  external?: boolean
  className?: string
}

const ConditionalLink = ({
  children,
  href,
  external = false,
  className = ""
}: Props) => {
  return href ? (
    external ? (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    ) : (
      <div className={`cursor-pointer ${className}`}>
        <Link href={href}>{children}</Link>
      </div>
    )
  ) : (
    <>{children}</>
  )
}

export default ConditionalLink
