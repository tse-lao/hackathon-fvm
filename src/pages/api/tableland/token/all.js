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
    
        
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `SELECT json_object(
                'tokenID', ${DB_main}.tokenID,
                'dbName', dbName,
                'description', description,
                'dbCID', dbCID,
              'minimumRowsOnSubmission', minimumRowsOnSubmission,
              'piece_cid', piece_cid,
                'attributes', json_group_array(
                  json_object(
                    'trait_type',trait_type,
                    'value', value
                  )
                )
              )
            FROM ${DB_main} JOIN ${DB_attribute}
                ON ${DB_main}.tokenID = ${DB_attribute}.tokenID
                ${req.query.request ? ` WHERE ${DB_main}.piece_cid != 'piece_cid'` : ''}  
            GROUP BY ${DB_main}.tokenID`,
        extract: true, format: "objects", unwrap: false
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      
      if(result.length == 0) { res.status(200).json({result: "No results found"});}

      for(var i = 0; i < result.length; i++) {
            result[i].categories = [];
        //result[i].attributes = JSON.parse(result[i].attributes    )
            for(var j = 0; j < result[i].attributes.length; j++) {
                if(result[i].attributes[j].trait_type == "category") {
                    result[i].categories.push(result[i].attributes[j].value)
                    result[i].attributes.splice(j, 1)
                    j--
                }
                if(result[i].attributes[j].trait_type == "creator"){
                    result[i].creator = result[i].attributes[j].value
                    result[i].attributes.splice(j, 1)
                    j--
                }
                if(result[i].attributes[j].trait_type == "mintPrice"){
                    result[i].mintPrice = result[i].attributes[j].value
                    result[i].attributes.splice(j, 1)
                    j--
                }
                
            }
                
        }
      res.status(200).json({result: result});
  }
  