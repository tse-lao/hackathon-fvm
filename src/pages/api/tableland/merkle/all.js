import { DB_main, MerkleHelper } from "@/constants/tableland";

export default async (req, res) => {    
   
        console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        
      const params2 = new URLSearchParams({
          statement: `SELECT MAX (blocktimestamp) as max, tokenID FROM ${MerkleHelper} ${req.query.where ? req.query.where : ""} AND AccessFor='SUBMIT' GROUP BY tokenID`, format: "objects", unwrap: false,
    });
    
        const url = 'https://testnets.tableland.network/api/v1/query';
      
        
       
          //resolve(data2);

    
        try {
          const response2 = await fetch(`${url}?${params2.toString()}`, { headers: {Accept: 'application/json',}});
          const data2 = await response2.json();

          let results = []
          for(var i = 0; i < data2.length; i++) {
            let max = data2[i].max  
            
            const params = new URLSearchParams({
                statement: `SELECT 
                ${DB_main}.tokenID, ${DB_main}.dbName, ${DB_main}.description
                FROM ${DB_main} JOIN ${MerkleHelper}
                ON ${DB_main}.tokenID = ${MerkleHelper}.tokenID 
                ${req.query.where ? req.query.where : ""} AND ${MerkleHelper}.blockTimestamp= '${max}' AND ${MerkleHelper}.tokenID = '${data2[i].tokenID}'`,
                unwrap: true
            });
            
            console.log(params)
            
            const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
            const data = await response.json();
            console.log(data)
            results.push(data);
        }
          resolve(results);
        } catch (error) { reject(error);}
      });
      
      
      res.status(200).json({result: result});
  }
  