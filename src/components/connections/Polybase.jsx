import { useAuth } from "@polybase/react";

export default function Polybase() {
    
    const {auth, state, loading} = useAuth();
    
  return (
    <div>

    {state && <p>Public Key: {state.publicKey}</p>}
    <button onClick={() => auth.signIn()}>Sign In</button>
    <button onClick={() => auth.signOut()}>Sign Out</button>
  </div>

  )
}
