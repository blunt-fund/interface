import {
  defaultDescription,
  defaultTitle,
  domain,
  longTitle
} from "@components/common/Head"
import {
  ConnectBlock,
  Container,
  RoundsList,
  RoundViewMainLoading
} from "@components/ui"
import { useAppContext } from "@components/ui/context"
import fetcher from "@utils/fetcher"
import { NextSeo } from "next-seo"
import useSWR from "swr"

export default function Rounds() {
  const { account } = useAppContext()
  const { data } = useSWR("/api/rounds", fetcher)
  const subgraphData = data?.subgraphData
  const projectData = data?.projectData

  return (
    <>
      <NextSeo
        title="My rounds | Blunt"
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.png`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <ConnectBlock>
          <main className="mx-auto max-w-screen-sm">
            <h2 className="pb-20">My rounds</h2>
            {!data ? (
              <div className="space-y-20">
                {[...Array(3)].map((el, key) => (
                  <RoundViewMainLoading key={key} />
                ))}
              </div>
            ) : (
              <RoundsList
                subgraphData={subgraphData}
                projectData={projectData}
                accountFilter={account}
              />
            )}
          </main>
        </ConnectBlock>
      </Container>
    </>
  )
}
