import { CarReader, CarWriter } from '@ipld/car';

import { create } from 'ipfs-http-client';


const ipfs = create({ url: 'https://gateway.ipfs.io' });

export function readFileFromIPFS(cid) {
  return new Promise(async (resolve, reject) => {
    console.log(cid)
    try {
      const stream = ipfs.cat(cid);
      let data = '';

      for await (const chunk of stream) {
        data += chunk.toString();
      }

      resolve(data.toString());
    } catch (error) {
      reject(new Error(`Error reading file from IPFS: ${error}`));
    }
  });
}

export function readFile(content){
  
}



export async function storeCarFile(filename){
  const inStream = createReadStream(filename);
  const car = await CarReader.fromIterable(inStream);
  
  CarWriter.create(car);
  console.log(car);
  
}
