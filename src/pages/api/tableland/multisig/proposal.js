

//TODO: implement this
export default async (req, res) => {    
   
        const confirmTable = req.query.confirmationTable;
        const proposalTable = req.query.proposalTable;
        
        //TODO: issue when there are no confirmations. 
     
        const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const paramsCheck =  new URLSearchParams({
          statement: `
          SELECT json_object(
              'name', ${proposalTable}.name,
              'description', ${proposalTable}.description,
              'proposer', ${proposalTable}.proposer,
              'proposalID', ${proposalTable}.proposalID
              'executed', ${proposalTable}.executed,
            )       
          FROM  ${proposalTable} 
          GROUP BY ${proposalTable}.proposalID`,
           format: "objects", extract:true
      });
        const params = new URLSearchParams({
            statement: `
            SELECT json_object(
                'name', ${proposalTable}.name,
                'description', ${proposalTable}.description,
                'proposer', ${proposalTable}.proposer,
                'proposalID', ${proposalTable}.proposalID,
                'executed', ${proposalTable}.executed,
                'confirmations', json_group_array(${confirmTable}.confirmationAddress)
            )       
            FROM  ${confirmTable} 
            JOIN  ${proposalTable} ON  ${proposalTable}.proposalID = ${confirmTable}.proposalID 
            WHERE ${proposalTable}.executed = ${req.query.executed}
            GROUP BY ${confirmTable}.proposalID
            `,
             format: "objects", unwrap: false, extract:true
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          
          console.log(params.toString())
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      console.log(result);
      if(result.length == 0) { res.status(200).json({result: false});}
      res.status(200).json({result: result});
  }
  