
import { MultisigTable, dataDaosOwners } from "@/constants/tableland";

export default async (req, res) => {    
        
      let where = "";
      
      if(req.query.where){
        where = req.query.where;
      }
        console.log(req.query)
        
        const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          statement: `
          SELECT DISTINCT json_object(
                'dataDAO' ,${dataDaosOwners}.daoAddress,
            ) 
            FROM ${dataDaosOwners} 
                JOIN ${MultisigTable} 
                ON ${MultisigTable}.multisigAddress = ${dataDaosOwners}.multisigAddress
            WHERE ${MultisigTable}.multisigAddress='${req.query.multiSig}'
         `
         ,
          format: "objects", unwrap: true, extract: true
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      console.log(result)
      
      if(result.length == 0) { res.status(200).json({result: "No results found"});}
      res.status(200).json({result: result});
  }
  