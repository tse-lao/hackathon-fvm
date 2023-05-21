export default async (req, res) => {

    var whereStatement = ""
    for(var key in req.query) {
        if(whereStatement == "") {
            whereStatement = `WHERE ${key} = '${req.query[key]}' `
        }
        else {
            whereStatement = whereStatement + ` AND ${key} = '${req.query[key]}' `
        } 
    }
    
    console.log(whereStatement)
    
    const result = await new Promise(async (resolve, reject) => {
        const url = 'https://testnets.tableland.network/api/v1/query';
        const params = new URLSearchParams({
          statement: `SELECT json_object(
            'specStart', computation_3141_122.specStart,
            'specEnd', computation_3141_122.specEnd,
            'bridgeJobId', computation_3141_122.bridgeJobId,
            'jobId',  computation_3141_122.jobId,
            'result', computation_3141_122.result,
            'creator', computation_3141_122.creator
            )
            FROM file_main_80001_6135 JOIN computation_3141_122
                ON file_main_80001_6135.dbCID = computation_3141_122.input
            WHERE computation_3141_122.input = file_main_80001_6135.dbCID
            GROUP BY computation_3141_122.bridgeJobId`,
          format: 'objects',
          extract: true,
          unwrap: true,
          
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
  