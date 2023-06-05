import { computation } from "@/constants/tableland";
export default async (req, res) => {

    var whereStatement = ""
    for(var key in req.query) {
        if(whereStatement == "") {
            whereStatement = `WHERE ${key} = '${req.query[key]}' `
        }
        else {
            whereStatement = whereStatement + ` AND ${key} = '${req.query[key]}' `
        } 
    }
    
    console.log(whereStatement)
    
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          statement: `SELECT *
            FROM ${computation}`,

          format: 'objects',
          extract: true,
          unwrap: true,
          
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, {
            headers: {
              Accept: 'application/json',
            },
          });
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
      console.log(result)
    res.status(200).json({result: result});
  }
  