import { useAuth, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import Connected from "../application/elements/Connected";

export default function Polybase({address}) {

    const { auth, state, loading } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    
    const polybase = usePolybase();
    if(loading) return <p>Loading...</p>
    
    useEffect(() => {
        if(state){
            if(state.userId == address.toLowerCase()){
                console.log(state.publicKey)
                setLoggedIn(true)
            }else{
                auth.signOut();
                
            }
        }
    }, [address]   )


    
    return (

        <Connected connected={loggedIn} msg="Polybase" handleConnect={() => auth.signIn()} />

    )
}
