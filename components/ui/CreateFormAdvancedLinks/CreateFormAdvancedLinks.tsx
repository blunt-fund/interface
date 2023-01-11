import Image from "next/image"
import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction, useState } from "react"
import Camera from "@components/icons/Camera"
import { Message } from "@utils/handleMessage"
import Logo from "@components/icons/Logo"
import { RoundData } from "utils/getRounds"
import handleSetObject from "@utils/handleSetObject"

export type ImageType = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormAdvancedLinks = ({ roundData, setRoundData }: Props) => {
  const { name, image, twitter, website, discord, docs } = roundData

  const handleSetWebsite = (value: string) => {
    handleSetObject("website", value, roundData, setRoundData)
  }
  const handleSetTwitter = (value: string) => {
    handleSetObject("twitter", value, roundData, setRoundData)
  }
  const handleSetDiscord = (value: string) => {
    handleSetObject("discord", value, roundData, setRoundData)
  }
  const handleSetDocs = (value: string) => {
    handleSetObject("docs", value, roundData, setRoundData)
  }
  const handleSetImage = (value: ImageType) => {
    handleSetObject("image", value, roundData, setRoundData)
  }

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
          handleSetImage({ url, file })
        }
      }
    } catch (err) {
      null
    }
  }

  return (
    <div className="py-3 space-y-8">
      <p>Add a logo, website and social links to your project</p>

      <div>
        <p className="pb-2 text-sm">Logo</p>
        <label
          htmlFor="upload"
          className="relative flex items-center justify-center bg-white border border-gray-200 rounded-sm shadow-md cursor-pointer bg-opacity-20 w-36 h-36 group"
        >
          <div className="flex flex-grow group-hover:opacity-20">
            {image.url ? (
              <Image
                src={image.url}
                alt={`${name} logo`}
                width={196}
                height={196}
              />
            ) : (
              <div className="w-20 h-20 mx-auto">
                <Logo />
              </div>
            )}
          </div>
          <Camera
            className={`absolute top-[8px] right-[8px] w-4 h-4 text-black group-hover:text-blue-300 dark:group-hover:text-blue-600`}
          />
        </label>
        {image.url && (
          <a
            className="text-sm text-gray-600 highlight highlight-red"
            onClick={() => handleSetImage({ url: "", file: undefined })}
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
          onChange={handleSetWebsite}
          placeholder="https://blunt.finance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Twitter"
          value={twitter}
          onChange={handleSetTwitter}
          placeholder="blunt_finance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Discord"
          value={discord}
          onChange={handleSetDiscord}
          placeholder="https://discord.gg/bluntfinance"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Docs"
          value={docs}
          onChange={handleSetDocs}
          placeholder="https://blunt.notion.site"
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedLinks
