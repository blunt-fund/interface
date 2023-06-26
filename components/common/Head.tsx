import { DefaultSeo } from "next-seo"
import NextHead from "next/head"
import { FC } from "react"

export const defaultTitle = "blunt"
export const longTitle =
  // "Blunt – Fundraise bluntly in the open with your community"
  "blunt – bluntly simple fundraising"
export const defaultDescription =
  "Trustless, refundable funding rounds based on preset rules."
export const domain = process.env.NEXT_PUBLIC_APP_URL
export const twitterAccount = "blunt_fund"

const Head: FC = () => {
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | ${defaultTitle}`}
        defaultTitle={longTitle}
        description={defaultDescription}
        openGraph={{
          site_name: longTitle,
          type: `website`,
          locale: `en_US`
        }}
        twitter={{
          handle: twitterAccount,
          site: twitterAccount,
          cardType: "summary_large_image"
        }}
      />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:image" content={`${domain}/twitter_card.png`} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </NextHead>
    </>
  )
}

export default Head
