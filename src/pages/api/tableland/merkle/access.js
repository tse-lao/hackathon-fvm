import { MerkleHelper } from "@/constants/tableland";

export default async (req, res) => {    
   
        console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        
      const params2 = new URLSearchParams({
          statement: `SELECT MAX (blocktimestamp) as max FROM ${MerkleHelper} ${req.query.where ? req.query.where : ""} AND AccessFor='SUBMIT'`, format: "objects", unwrap: false,
    });
    
        const url = 'https://testnets.tableland.network/api/v1/query';
      
        
       
          //resolve(data2);

    
        try {
          const response2 = await fetch(`${url}?${params2.toString()}`, { headers: {Accept: 'application/json',}});
          const data2 = await response2.json();
          console.log(data2)
          
          const params = new URLSearchParams({
            statement: `SELECT * FROM ${MerkleHelper} ${req.query.where ? req.query.where : ""} AND blockTimestamp= ${data2[0].max}`,
               format: "objects", unwrap: false
        });
         console.log(params.toString());
        
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          
          console.log(data);
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      
      res.status(200).json({result: result});
  }
  