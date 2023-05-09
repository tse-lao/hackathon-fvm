const go = async () => {
    //public api endpoint.
    const url = "https://apollo-server-gateway.herokuapp.com/";
    const query = `
    query Query($cid: String) {
      verifyCID(cid: $cid)
    }`


    const fetchCID = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "query": query,
            "variables": {
                "cid": cid, //this we need to provide in params 
            }
        }
        )
    }).then((response) => response.json());

    console.log(fetchCID)
    const verifiedCID = fetchCID.data.verifyCID;
    
    console.log(verifiedCID)
    const contractFormatCID = "bafkreigpliv6qwuawfwkea45t4rj2fzc6whbapp3awxssjmf3puqd7huve";
   
    if(verifiedCID != contractFormatCID){
        return;
    }
    

    const sigShare = await LitActions.signEcdsa({
        toSign, //param which includes = cid, metadata, publicKey
        publicKey,  //param
        sigName
    });
    
  //  Lit.Actions.setResponse(JSON.stringify({ response: true, signature: sigShare}));


}

go();