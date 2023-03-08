
import { useBalance } from "wagmi";
import { useState, useEffect } from "react";

export const Balance = (props) => {
    const [amount, setAmount] = useState('');

    const {data, isError, isLoading } = useBalance({
        address: props.account
    })

    useEffect(() => {
        let amt = data.formatted;
        amt = Number(amt).toFixed(3);
        setAmount(amt);
    }, []);

    if(isLoading) return <div>Fetching Balance...</div>
    if(isError) return <div>There was an error fetching the balance</div>

   
    

    return (
        <div className='balance'>
            <h4>Your Wallet Balance: {amount} BNB</h4>
        </div>
    )
}