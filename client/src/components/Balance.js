import { useBalance } from "wagmi"

export const Balance = (props) => {
    const {data, isError, isLoading } = useBalance({
        address: props.account
    })

    if(isLoading) return <div>Fetching Balance...</div>
    if(isError) return <div>There was an error fetching the balance</div>

    return (
        <div>
            Balance: {data?.formatted} BNB
        </div>
    )
}