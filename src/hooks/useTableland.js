import { DB_attribute, DB_main, data_contribution } from '../constants/tableland';
export const useTableland = () => {

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
            const response =  await fetch(`${url}?${params.toString()}`, {
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
    return {
        fetchTokenRequest,
        fetchTokenRequestByCID,
        fetchDataSubmission, getRequestData
    }
}