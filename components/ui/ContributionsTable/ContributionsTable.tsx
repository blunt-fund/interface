import { ResolvedAddress } from "@components/ui"
import bluntDelegate from "abi/BluntDelegateClone.json"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { useContractReads } from "wagmi"

type Props = {
  subgraphData: any
}
const ContributionsTable = ({ subgraphData }: Props) => {
  const increment = 10
  const [iterator, setIterator] = useState(increment)
  const [displayParticipants, setDisplayParticipants] = useState([])

  const participants = subgraphData.participants
  const { data: contributions } = useContractReads({
    contracts: participants.map(({ wallet }) => ({
      address: subgraphData.configureEvents[0].dataSource,
      abi: bluntDelegate.abi,
      functionName: "contributions",
      args: [wallet.id]
    })),
    watch: true
  })

  useEffect(() => {
    const orderedParticipants = contributions
      ?.map(({ result: contribution }, index) => ({
        wallet: participants[index].wallet.id,
        contribution
      }))
      .filter(
        ({ contribution }) =>
          contribution && Number(BigNumber.from(contribution).div(1e15))
      )
      .sort((a, b) => Number(b.contribution) - Number(a.contribution))

    setDisplayParticipants(orderedParticipants)
  }, [contributions])

  return displayParticipants?.length ? (
    <div className="my-4 text-center">
      <h3 className="mb-4 text-lg font-bold text-gray-600 ">
        Top contributors
      </h3>
      <table>
        <thead>
          <tr className="text-gray-600 bg-gray-100">
            <th className="w-1/2 text-xs xs:text-sm" scope="col">
              Contributor
            </th>
            <th className="w-1/2 text-xs xs:text-sm" scope="col">
              Total paid (ETH)
            </th>
          </tr>
        </thead>
        <tbody>
          {displayParticipants
            .slice(0, iterator)
            .map(({ wallet, contribution }, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td>
                  <a
                    className="highlight"
                    href={`https://${
                      process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "goerli." : ""
                    }etherscan.io/address/${wallet}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ResolvedAddress address={wallet} />
                  </a>
                </td>
                <td className="font-bold">
                  {Number(BigNumber.from(contribution).div(1e15)) / 1000}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {iterator < participants.length && (
        <p className="mt-6">
          <a
            className="cursor-pointer text-sm font-bold underline text-gray-600 hover:text-yellow-600"
            onClick={() => setIterator(iterator + increment)}
          >
            Load more
          </a>
        </p>
      )}
    </div>
  ) : null
}

export default ContributionsTable
