import { job_bounty } from "@/constants/tableland";

//TODO: implement this
export default async (req, res) => {

    console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `SELECT *
            FROM ${job_bounty}
            ${req.query.where && req.query.where}
            `,
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
