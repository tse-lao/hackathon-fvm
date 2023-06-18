import { DealClientDeals } from "@/constants/tableland";

//TODO: implement this
export default async (req, res) => {

    console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `SELECT json_object(
                'dealID' ,${DealClientDeals}.dealID
            )FROM 
                ${DealClientDeals} WHERE ${DealClientDeals}.piece_cid='${req.query.piece}'
            `
            ,
            format: "objects", unwrap: false
        });

        try {
            const response = await fetch(`${url}?${params.toString()}`, { headers: { Accept: 'application/json', } });
            const data = await response.json();
            resolve(data);
        } catch (error) { reject(error); }
    });


    if (result.length == 0) { res.status(200).json({ result: "No results found" }); }
    res.status(200).json({ result: result });
}
