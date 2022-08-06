import Image from "next/image"
import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction, useState } from "react"
import Camera from "@components/icons/Camera"

import projectDefault from "public/project_default.png"
import { Message } from "@utils/handleMessage"

export type ImageType = { url: string; file: File }

type Props = {
  name: string
  image: ImageType
  website: string
  twitter: string
  discord: string
  docs: string
  setImage: Dispatch<SetStateAction<ImageType>>
  setWebsite: Dispatch<SetStateAction<string>>
  setTwitter: Dispatch<SetStateAction<string>>
  setDiscord: Dispatch<SetStateAction<string>>
  setDocs: Dispatch<SetStateAction<string>>
}

const CreateFormAdvancedLinks = ({
  name,
  image,
  website,
  twitter,
  discord,
  docs,
  setWebsite,
  setTwitter,
  setDiscord,
  setDocs,
  setImage
}: Props) => {
  const [msg, setMsg] = useState<Message>({
    message: "",
    messageStatus: "success"
  })

  const updateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const handleMessage = (await import("@utils/handleMessage")).default

    try {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5000000) {
          handleMessage(
            { message: "Max size 5MB", messageStatus: "error" },
            setMsg
          )
        } else {
          const url = URL.createObjectURL(file)
          setImage({ url, file })
        }
      }
    } catch (err) {
      null
    }
  }

  return (
    <div className="py-3 space-y-6">
      <p>Add a logo, website and social links to your project</p>

      <div>
        <p className="pb-2 text-sm">Logo</p>
        <label
          htmlFor="upload"
          className="relative flex items-center justify-center bg-gray-800 cursor-pointer w-36 h-36 group"
        >
          <div className="flex flex-grow opacity-50 group-hover:opacity-20">
            <Image
              src={image.url || projectDefault}
              alt={image.url ? `${name} logo` : "Default project logo"}
              width={196}
              height={196}
            />
          </div>
          <Camera
            className={`absolute top-[8px] right-[8px] w-4 h-4 text-white group-hover:text-blue-300 dark:group-hover:text-blue-600`}
          />
        </label>
        {image.url && (
          <a
            className="text-sm text-gray-600 highlight highlight-red"
            onClick={() => setImage({ url: "", file: undefined })}
          >
            Remove image
          </a>
        )}
        {msg.message && (
          <p className="pt-3 text-sm font-bold text-red-500">{msg.message}</p>
        )}

        <input
          className="absolute hidden"
          type="file"
          id="upload"
          accept="image/*"
          onChange={(e) => updateImage(e)}
        />
      </div>
      <div>
        <Input
          type="string"
          label="Website"
          value={website}
          onChange={setWebsite}
          placeholder="https://blunt.finance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Twitter"
          value={twitter}
          onChange={setTwitter}
          placeholder="@bluntfinance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Discord"
          value={discord}
          onChange={setDiscord}
          placeholder="https://discord.gg/bluntfinance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Docs"
          value={docs}
          onChange={setDocs}
          placeholder="https://blunt.notion.site"
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedLinks
