import { DB_attribute, DB_main } from "@/constants";
import { ethers } from "ethers";


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
                  'tokenID', ${DB_main}.tokenID, 'dbName', dbName, 'dataFormatCID', dataFormatCID, 'description', description, 'dbCID', dbCID, 'minimumRowsOnSubmission', minimumRowsOnSubmission,
                  'attributes', json_group_array(json_object('trait_type',trait_type,'value', value)))
                  FROM ${DB_main} JOIN ${DB_attribute} ON ${DB_main}.tokenID = ${DB_attribute}.tokenID ${whereStatement}`,
            extract: true, format: "objects", unwrap: true
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      if(result.length == 0) { res.status(200).json({result: "No results found"});}
      const priceItem = ethers.utils.formatEther((result.attributes.find(attr => attr.trait_type === 'price').value));
      const categories = result.attributes.find(attr => attr.trait_type === 'category').value;    
      res.status(200).json({result: result, price: priceItem, categories: categories});
  }
  