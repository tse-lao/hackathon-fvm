import { MerkleHelper } from "@/constants/tableland";

export default async (req, res) => {    
   
        console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `SELECT * FROM ${MerkleHelper} ${req.query.where ? req.query.where : ""}`,
               format: "objects", unwrap: false
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      
      res.status(200).json({result: result});
  }
  