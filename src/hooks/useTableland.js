import { DB_attribute, DB_main, data_contribution } from '../constants/tableland';

//const url = "http://localhost:4000";

const fetchTokenRequest = (tokenID) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `select * from ${DB_main} WHERE tokenID = ${tokenID}`,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};


const fetchTokenRequestByCID = (dataFormatCID) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `select * from ${DB_main} WHERE dataFormatCID = ${dataFormatCID}`,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });


      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};


const fetchDataSubmission = (tokenID) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `select * from ${data_contribution} WHERE tokenID = ${tokenID}`,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(response);


      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const getRequestData = (tokenID) => {
  return new Promise(async (resolve, reject) => {

    const url = "https://testnets.tableland.network/api/v1/query"
    const params = new URLSearchParams({
      statement: `select trait_type, value FROM  ${DB_main} JOIN ${DB_attribute}  WHERE  ${DB_main}.tokenID = ${tokenID} and ${DB_attribute}.tokenID = ${tokenID}`
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(response);


      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};


const getContributionSplit = (tokenID) => {

  const query = `
        query GetContributors($tokenId: String) {
          getContributors(tokenID: $tokenId) {
            percentage
            contributors
          }
        }
        `
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "query": query,
          "variables": {
            "tokenId": tokenID,
          }
        })
      });
      const data = await result.json();
      console.log(data.data.getContributors);
      resolve(data.data.getContributors);
    } catch (e) {
      reject(e);
    }
  });

}
export async function getContributors(parent, args, context) {

  const data = await allContributionByToken(args.tokenID);

  const contributors = []
  let percentage = []
  let total = 0;
  for (let i = 0; i < data.length; i++) {


    //check if contributor is already in the list
    //if not add them to the list

    if (!contributors.includes(data[i].creator)) {
      contributors.push(data[i].creator);
      percentage.push(parseInt(data[i].rows));
    } else {
      //if they are in the list, add the rows to the total
      const index = contributors.indexOf(data[i].creator);
      percentage[index] = percentage[index] + parseInt(data[i].rows);

    }

    total += parseInt(data[i].rows);
  }

  const DISTRIBUTION = 10000;

  let newTotal = 0;
  for (let i = 0; i < percentage.length; i++) {
    percentage[i] = parseInt((percentage[i] / total) * DISTRIBUTION);
    newTotal += percentage[i];
  }

  const remainder = DISTRIBUTION - newTotal;

  if (remainder > 0) {
    contributors.push("0xf129b0D559CFFc195a3C225cdBaDB44c26660B60");
    percentage.push(remainder);

  }


  return { "contributors": contributors, "percentage": percentage };


}

function allContributionByToken(tokenId) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `select * from ${data_contribution} WHERE tokenID = ${tokenId}`,
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
}

export async function getAllNFTs(request) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT json_object(
              'tokenID', file_main_80001_6097.tokenID,
              'dbName', dbName,
              'description', description,
              'dbCID', dbCID,
            'minimumRowsOnSubmission', minimumRowsOnSubmission,
            'piece_cid', piece_cid,
              'attributes', json_group_array(
                json_object(
                  'trait_type',trait_type,
                  'value', value
                )
              )
            )
          FROM file_main_80001_6097 JOIN file_attribute_80001_6098
              ON file_main_80001_6097.tokenID = file_attribute_80001_6098.tokenID
              ${request ? ` WHERE file_main_80001_6097.piece_cid != 'piece_cid'` : ''}  
          GROUP BY file_main_80001_6097.tokenID`,
      extract: true, format: "objects", unwrap: false
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });



      const data = await response.json();
      console.log(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export async function filteredWithCategories(request,category){
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT json_object(
              'tokenID', file_main_80001_6097.tokenID,
              'dbName', dbName,
              'description', description,
                  'dbCID', dbCID,
                          'minimumRowsOnSubmission', minimumRowsOnSubmission,
          
              'attributes', json_group_array(
                json_object(
                  'trait_type',trait_type,
                  'value', value
                )
              )
            )
          FROM file_main_80001_6097 JOIN file_attribute_80001_6098
              ON file_main_80001_6097.tokenID = file_attribute_80001_6098.tokenID
              ${category ? `WHERE file_attribute_80001_6098.value = ${category}`: ''}
          

          
          
          `,
      extract: true, format: "objects", unwrap: true
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });



      const data = await response.json();
      console.log(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getTableFromTableland(table){
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT * FROM ${table}`
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });



      const data = await response.json();
      console.log(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getNFTDetail(tokenID, categories) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT json_object(
              'tokenID', file_main_80001_6097.tokenID,
              'dbName', dbName,
              'dataFormatCID', dataFormatCID,
              'description', description,
                  'dbCID', dbCID,
                          'minimumRowsOnSubmission', minimumRowsOnSubmission,
          
              'attributes', json_group_array(
                json_object(
                  'trait_type',trait_type,
                  'value', value
                )
              )
            )
          FROM file_main_80001_6097 JOIN file_attribute_80001_6098
              ON file_main_80001_6097.tokenID = file_attribute_80001_6098.tokenID
          WHERE file_main_80001_6097.tokenID = ${tokenID}
          
          
          `,
      extract: true, format: "objects", unwrap: true
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });



      const data = await response.json();
      console.log(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAllCategories() {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT DISTINCT file_attribute_80001_6098.value FROM file_attribute_80001_6098 WHERE file_attribute_80001_6098.trait_type = 'category'`
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

      console.log(newData);
      resolve(newData);
    } catch (error) {
      reject(error);
    }
  });
}


export async function getAllContributionData(creator) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://testnets.tableland.network/api/v1/query';
    const params = new URLSearchParams({
      statement: `SELECT * FROM data_contribution_80001_6096 JOIN file_main_80001_6097 ON file_main_80001_6097.tokenID = data_contribution_80001_6096.tokenID WHERE creator = '${creator}'`,
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
}


export {
  fetchTokenRequestByCID,
  fetchDataSubmission,
  fetchTokenRequest,
  getRequestData,
  getContributionSplit,
};
