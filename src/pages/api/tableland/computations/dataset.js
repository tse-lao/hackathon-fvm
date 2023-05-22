
import { DB_main, computation } from "@/constants";


export default async (req, res) => {    
   
        console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        
        const params = new URLSearchParams({
            statement: `SELECT json_object(
                'specStart', ${computation}.specStart,
                'specEnd', ${computation}.specEnd,
                'bridgeJobId', ${computation}.bridgeJobId,
                'jobId',  ${computation}.jobId,
                'result', ${computation}.result,
                'creator', ${computation}.creator
                )
                FROM ${DB_main} JOIN ${computation}
                    ON ${DB_main}.dbCID = ${computation}.input
                    WHERE ${computation}.input = ${DB_main}.dbCID and ${computation}.input = '${req.query.cid}'
                    GROUP BY ${computation}.input
                `,
        extract: true, format: "objects", unwrap: false
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      
      if(result.length == 0) { res.status(200).json({result: "No results found"});}


      res.status(200).json({result: result});
  }
  