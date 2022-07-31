import { NextSeo } from "next-seo"
import { ConnectBlock, Container, CreateRoundForm } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Create() {
  return (
    <>
      <NextSeo
        title="Create round | Blunt Finance"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <ConnectBlock>
          <main className="max-w-screen-sm mx-auto space-y-10 ">
            <h1>Create round</h1>
            <CreateRoundForm />
          </main>
        </ConnectBlock>
      </Container>
    </>
  )
}
