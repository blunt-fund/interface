import Link from "next/link"

type Props = {
  image: JSX.Element
  label: string
  onClick?: () => void
  href?: string
}

function DropdownMenu({ href, image, label, onClick }: Props) {
  return (
    <div onClick={onClick}>
      {href ? (
        <Link href={href}>
          <a>
            <div className="flex items-center py-3.5 group rounded-sm dark:text-white hover:bg-blue-600 hover:text-white">
              <div className="ml-4">{image}</div>
              <p className="ml-4 font-normal">{label}</p>
            </div>
          </a>
        </Link>
      ) : (
        <div className="flex items-center py-3.5 group rounded-sm cursor-pointer dark:text-white hover:bg-blue-600 hover:text-white">
          <div className="ml-4">{image}</div>
          <p className="ml-4 font-normal">{label}</p>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
