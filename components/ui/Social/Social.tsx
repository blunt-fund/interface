import { FC } from "react"
import {
  Twitter,
  Facebook,
  Instagram,
  Reddit,
  Linkedin,
  Mail,
  Github,
  Discord,
  Blog,
  Juicebox,
  Slice,
  Notion
} from "@components/icons/Social"
import { twitterAccount } from "@components/common/Head"

type Props = {
  accounts: object
  className?: string
  wrapperClassName?: string
}

export const accounts = {
  twitter: `https://twitter.com/${twitterAccount}`,
  // discord: "https://discord.gg/CdyHUzdZks",
  // notion: "https://slicedao.notion.site",
  github: "https://github.com/jbx-protocol/blunt-finance",
  // blog: "/blog",
  slice: "https://slice.so",
  juicebox: "https://juicebox.money/#/p/slice"
}

const Social: FC<Props> = ({ wrapperClassName, accounts }, props) => {
  const { children, className, ...rest } = props

  const components = {
    twitter: { color: "hover:text-blue-500", element: Twitter },
    discord: { color: "hover:text-indigo-500", element: Discord },
    github: { color: "hover:text-purple-500", element: Github },
    notion: { color: "hover:text-gray-500", element: Notion },
    blog: { color: "hover:text-green-500", element: Blog },
    juicebox: { color: "hover:text-yellow-600", element: Juicebox },
    facebook: { color: "hover:text-blue-700", element: Facebook },
    instagram: { color: "hover:text-pink-500", element: Instagram },
    reddit: { color: "hover:text-red-500", element: Reddit },
    linkedin: { color: "hover:text-blue-700", element: Linkedin },
    slice: { color: "hover:text-blue-600", element: Slice },
    mail: { color: "hover:text-gray-500", element: Mail }
  }

  const size = "h-6"

  return (
    <div className={`${wrapperClassName} flex justify-center items-center`}>
      {Object.keys(accounts).map((key) => {
        const DynamicComponent = components[key].element
        const componentColor = components[key].color
        return (
          <a
            key={key}
            className={`${componentColor} ${size} mx-6`}
            href={accounts[key]}
            target="_blank"
            rel="noreferrer"
            aria-label={`${accounts[key]} logo`}
          >
            <DynamicComponent />
          </a>
        )
      })}
    </div>
  )
}

export default Social
