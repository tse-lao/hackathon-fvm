import { DealRequests } from "@/constants/tableland";
export default async (req, res) => {

    //
    console.log(req.query.cid)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          //statement: `SELECT ${DealRequests}.dealID FROM ${DealRequests} JOIN ${DealClientDeals} where ${DealRequests}.piece_cid = ${DealClientDeals}.piece_cid and ${DealRequests}.piece_cid = '${req.query.cid}'`,
            statement: `SELECT * FROM ${DealRequests} WHERE label = '${req.query.cid}'`,
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
  