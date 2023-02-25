import { Balance } from "./Balance";
export const Home =  (props) => {
 

    return (
        <div>
            <h2>Welcome to My-NFT</h2>
            <h3>Your connected account is</h3>
            <p>{props.account}</p>
            
            <Balance account={props.account}/>
            
        </div>
    )
}