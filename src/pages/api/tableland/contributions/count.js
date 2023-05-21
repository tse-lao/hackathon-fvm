import { data_contribution } from "@/constants";
// pages/api/myFunction.js
export default async (req, res) => {
    // Here you continue the function in the backend
    // ... Run your backend function and assign the result to `result` variable
    // Return the result
    var whereStatement = ""
    for(var key in req.query) {
        if(whereStatement == "") {
            whereStatement = `WHERE ${key} = '${req.query[key]}' `
        }
        else {
            whereStatement = whereStatement + ` AND ${key} = '${req.query[key]}' `
        } 
    }
    
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          statement: `SELECT COUNT(*)  FROM ${data_contribution} ${whereStatement} `,
          unwrap: true, extract: true, format: "objects"
          
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
    res.status(200).json(result);
  }
  