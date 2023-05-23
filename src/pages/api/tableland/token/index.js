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
                  'tokenID', ${DB_main}.tokenID, 'dbName', dbName,'requiredRows', requiredRows, 'dataFormatCID', dataFormatCID, 'description', description, 'dbCID', dbCID, 'minRows', minRows,
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
      const priceAttribute = result.attributes.find(attr => attr.trait_type === 'price');
      const priceItem = priceAttribute ? ethers.utils.formatEther(priceAttribute.value) : null;

      const creator = result.attributes.find(attr => attr.trait_type === 'creator').value;

      let categories = [];
      for(let i = 0; i < result.attributes.length; i++) {
        if(result.attributes[i].trait_type === 'category') {
          categories.push(result.attributes[i].value);
        }
      }
         
      res.status(200).json({result: result, price: priceItem, categories: categories, creator: creator});
  }
  