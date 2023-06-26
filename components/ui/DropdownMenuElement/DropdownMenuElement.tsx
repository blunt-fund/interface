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
          <div className="group flex items-center rounded-sm py-3.5 hover:text-white hover:bg-blue-600 dark:text-white">
            <div className="ml-4">{image}</div>
            <p className="ml-4 font-normal">{label}</p>
          </div>
        </Link>
      ) : (
        <div className="group flex cursor-pointer items-center rounded-sm py-3.5 hover:text-white hover:bg-blue-600 dark:text-white">
          <div className="ml-4">{image}</div>
          <p className="ml-4 font-normal">{label}</p>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
