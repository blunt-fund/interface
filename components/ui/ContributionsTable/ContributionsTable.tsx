import { BigNumber } from "ethers"
import { useState } from "react"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"

type Props = {
  subgraphData: any
}
const ContributionsTable = ({ subgraphData }: Props) => {
  const increment = 10
  const [iterator, setIterator] = useState(increment)

  const participants = subgraphData.participants
  const { data: contributions } = useContractReads({
    contracts: participants.map(({ wallet }) => ({
      address: subgraphData.configureEvents[0].dataSource,
      abi: bluntDelegate.abi,
      functionName: "contributions",
      args: [wallet]
    })),
    suspense: true,
    watch: true
  })

  const orderedParticipants = contributions
    .map((contribution, index) => ({
      wallet: participants[index].wallet,
      contribution
    }))
    .sort((a, b) => Number(b.contribution) - Number(a.contribution))

  return (
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
          {orderedParticipants
            .slice(0, iterator)
            .map(({ wallet, contribution }, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td>
                  <a className="highlight">
                    {wallet.replace(
                      wallet.substring(5, wallet.length - 3),
                      `\xa0\xa0\xa0`
                    )}
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
            className="text-sm font-bold text-gray-600 underline cursor-pointer hover:text-blue-600"
            onClick={() => setIterator(iterator + increment)}
          >
            Load more
          </a>
        </p>
      )}
    </div>
  )
}

export default ContributionsTable
