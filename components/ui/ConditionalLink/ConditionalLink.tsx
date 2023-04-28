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
      <Link href={href} className={`cursor-pointer ${className}`}>
        {children}
      </Link>
    )
  ) : (
    <>{children}</>
  )
}

export default ConditionalLink
