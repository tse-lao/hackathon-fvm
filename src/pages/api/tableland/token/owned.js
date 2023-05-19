import { DB_attribute, DB_main } from "@/constants";


export default async (req, res) => {    

    
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          statement: `SELECT *
          FROM  ${DB_main} JOIN  ${DB_attribute}
              ON  ${DB_main}.tokenID =  ${DB_attribute}.tokenID
          WHERE  ${DB_attribute}.trait_type = 'creator' and  ${DB_attribute}.value = '${req.query.creator}'
          GROUP BY  ${DB_main}.tokenID`,
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, { headers: {Accept: 'application/json',}});
          const data = await response.json();
          resolve(data);
        } catch (error) { reject(error);}
      });
      
      console.log(result);
         
      res.status(200).json({result: result});
  }
  