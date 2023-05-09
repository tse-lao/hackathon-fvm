
export const computation = "computation_3141_15"
export const data_contribution = "data_contribution_80001_6052 "
export const DB_main = "file_main_80001_6053"
export const DB_attribute = "file_attribute_80001_6054"


export const useTableland = () => {

    const fetchTokenRequest = (db, tokenID) => {
        return new Promise(async (resolve, reject) => {
          const url = 'https://testnets.tableland.network/api/v1/query';
          const params = new URLSearchParams({
            statement: `select * from ${db} WHERE tokenID = ${tokenID}`,
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
      
      
      const fetchTokenRequestByCID = ( dataFormatCID) => {
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
    return {
        fetchTokenRequest,
        fetchTokenRequestByCID,
        fetchDataSubmission
    }
}