import { useAuth, usePolybase } from "@polybase/react";

export default function Polybase() {

    const { auth, state, loading } = useAuth();
    const polybase = usePolybase();
    if(loading) return <p>Loading...</p>
    
    /* // we want to 
    useEffect(() => {
        
        const getProfile = async(key) => {
            try{
                await polybase.collection("Profile").record(key).get();
            }catch(e){
                console.log(e)
               
            }
           
        }
        if(state) {
            const {publicKey} = state;
            getProfile(publicKey);
        }
    }, [])
     */

    
    
    return (
        <div>
            <h2 className="text-lg font-bold">Polybase</h2>
            {state ? (
                <div>
                <span>Public Key: {state.publicKey}</span>
                <button onClick={() => auth.signOut()}
                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Sign Out</button>
                
                </div>
                ): (
                    
                    <button onClick={() => auth.signIn()}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                    >Sign In</button>
                )}
        </div>

    )
}
