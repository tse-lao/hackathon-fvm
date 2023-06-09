import { job_bounty, MultisigOwnersTable } from "@/constants/tableland";

//TODO: implement this
export default async (req, res) => {

    console.log(req.query)
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
            statement: `
            SELECT json_object(
                'bountyID', ${job_bounty}.bountyID,
                'name',  ${job_bounty}.name,
                'description',  ${job_bounty}.description,
                'creator',  ${job_bounty}.creator,
                'dataFormat',  ${job_bounty}.dataFormat,
                'reward',  ${job_bounty}.reward, 
                'members', json_group_array(${MultisigOwnersTable}.ownerAddress)
                )
                FROM  ${job_bounty} LEFT OUTER JOIN  ${MultisigOwnersTable} ON  ${MultisigOwnersTable}.multisigAddress =  ${job_bounty}.creator
                WHERE  ${job_bounty}.bountyID=${req.query.bountyID}            
            `,
            format: "objects", unwrap: false, extract: true
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
