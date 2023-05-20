
//TODO: Change DB_attribute to the attribute you want to query

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
          statement: `SELECT DISTINCT ${DB_attribute}.value FROM ${DB_attribute} ${whereStatement}}`
        });
    
        try {
          const response = await fetch(`${url}?${params.toString()}`, {
            headers: {
              Accept: 'application/json',
            },
          });
    
    
    
          const data = await response.json();
          // const newArr = data.map(item => {label: item.value},{ value: item.value});
    
          let newData = data.map(item => {
            return {
              value: item.value,
              label: item.value
            }
          });
    
          resolve(newData);
        } catch (error) {
          reject(error);
        }
      });
      
    res.status(200).json({result: result});
  }
  