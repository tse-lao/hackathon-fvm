
import { DB_attribute, DB_main } from "@/constants";


export default async (req, res) => {    
    var whereStatement = ""
    for(var key in req.query) {
        if(whereStatement == "") {
            whereStatement = `WHERE ${key} = '${req.query[key]}' `
        }
        else {
            whereStatement = whereStatement + ` AND ${key} = '${req.query[key]}' `
        }}
        console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `SELECT  json_object(
                'dbName',${DB_main}.dbName,
                'description',${DB_main}.description,
                'dbCID',${DB_main}.dbCID,
                'dataFormatCID',${DB_main}.dataFormatCID,
                    'tokenID', ${DB_main}.tokenID,
                    'attributes', json_object(SELECT * FROM ${DB_attribute} ${whereStatement})
                  ) 
                
                  FROM  ${DB_main}
                WHERE ${whereStatement}
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
  