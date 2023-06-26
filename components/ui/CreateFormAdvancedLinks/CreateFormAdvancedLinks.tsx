import Camera from "@components/icons/Camera"
import Logo from "@components/icons/Logo"
import { Input, Textarea } from "@components/ui"
import { Message } from "@utils/handleMessage"
import handleSetObject from "@utils/handleSetObject"
import Image from "next/image"
import React, { Dispatch, SetStateAction, useState } from "react"
import { RoundData } from "utils/getRounds"
import { accounts } from "../Social/Social"

export type ImageType = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormAdvancedLinks = ({ roundData, setRoundData }: Props) => {
  const { name, description, image, twitter, website, discord, docs } =
    roundData

  const handleSetDescription = (value: string) => {
    handleSetObject("description", value, roundData, setRoundData)
  }
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
    <div className="space-y-8 py-3">
      <div>
        <Textarea
          label="Project description"
          value={description}
          onChange={handleSetDescription}
          rows={5}
        />
      </div>
      <p>Add a logo, website and social links</p>

      <div>
        <p className="pb-2 text-sm">Logo</p>
        <label
          htmlFor="upload"
          className="group relative flex h-36 w-36 cursor-pointer items-center justify-center rounded-sm border bg-opacity-20 shadow-md bg-white border-gray-200"
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
              <div className="mx-auto h-20 w-20">
                <Logo />
              </div>
            )}
          </div>
          <Camera
            className={`absolute top-[8px] right-[8px] h-4 w-4 text-black group-hover:text-yellow-600 dark:group-hover:text-yellow-300`}
          />
        </label>
        {image.url && (
          <a
            className="highlight highlight-red text-sm text-gray-600"
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
          placeholder="https://blunt.fund"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Twitter"
          value={twitter}
          onChange={handleSetTwitter}
          placeholder="blunt_fund"
        />
      </div>
      <div>
        <Input
          type="string"
          label="Discord"
          value={discord}
          onChange={handleSetDiscord}
          placeholder={accounts.discord}
        />
      </div>
      <div>
        <Input
          type="string"
          label="Docs"
          value={docs}
          onChange={handleSetDocs}
          placeholder="https://bluntfund.notion.site"
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedLinks
