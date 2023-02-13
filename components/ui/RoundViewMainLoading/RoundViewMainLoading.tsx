import Logo from "@components/icons/Logo"
import ProgressBar from "../ProgressBar"

const RoundViewMainLoading = () => {
  return (
    <div className="block rounded-sm sm:border sm:border-transparent sm:px-4 sm:py-6">
      <div className="w-full text-left">
        <div className="xs:flex">
          <div className="w-40 h-40 bg-white border border-gray-200 rounded-sm shadow-md xs:mr-4 bg-opacity-20">
            <div
              className="p-10"
              style={{
                animation: "spin 0.8s steps(4, jump-end) infinite"
              }}
            >
              <Logo />
            </div>
          </div>
          <div className="flex-grow pt-6 xs:pt-0">
            <div className={"h-8 w-44 animate-pulse bg-gray-300 rounded-sm"} />

            <p className="pt-2 text-sm">Round allocation: ...</p>
            <div className="mt-6 text-xs xs:text-sm">
              <ProgressBar
                max={100}
                target={30}
                raised={10}
                isCapped={false}
                active={true}
              />
              <div className="flex justify-between pt-5 pb-2">
                <p>Raised: ...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundViewMainLoading
