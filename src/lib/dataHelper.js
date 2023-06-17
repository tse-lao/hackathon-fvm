
import Papa from 'papaparse';

import { NFTStorage } from 'nft.storage';
import { toast } from 'react-toastify';

export async function readBlobAsJson(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('error', () => {
      reject(new Error('Error reading file'));
    });

    // Define the onload event handler
    reader.addEventListener('load', async () => {
      try {
        const json = JSON.parse(reader.result);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });

    // Define the onerror event handler
    reader.onerror = function () {
      reject(reader.error);
    };

    // Read the Blob as a text string
    reader.readAsText(blob);

    return reader;
  });
}


export function readTextAsJson(blob, callback) {
  let reader = new FileReader();
  reader.readAsText(blob, 'UTF-8');

  reader.onload = function (event) {
    try {

      const json = JSON.parse(event.target.result);

      callback(null, json);
    } catch (error) {
      callback(error);
    }
  };

  // Define the onerror event handler
  reader.onerror = function () {
    callback(reader.error);
  };

  // Read the Blob as a text string

  return reader;

}



export function readBlobAsCsvToJson(blob, callback) {
  const reader = new FileReader();

  // Define the onload event handler
  reader.onload = function (event) {
    try {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          callback(null, results.data);
        },
        error: function (error) {
          callback(error);
        },
      });
    } catch (error) {
      callback(error);
    }
  };

  // Define the onerror event handler
  reader.onerror = function () {
    callback(reader.error);
  };

  // Read the Blob as a text string
  reader.readAsText(blob);
}

export function analyzeJSONStructure(json) {
  function analyzeNode(node, path = []) {
    let structure = {};

    let count = 0;

    if (Array.isArray(node)) {
      structure.type = 'array';
      count = node.length;

      if (node.length > 0) {
        structure.children = analyzeNode(node[0], [...path, '[0]']);
      }
    } else if (typeof node === 'object' && node !== null) {
      structure.type = 'object';
      structure.children = {};

      for (const key in node) {
        structure.children[key] = analyzeNode(node[key], [...path, key]);
      }
    } else {
      structure.type = typeof node;
    }

    structure.path = path.join('.');
    return structure;
  }

  return analyzeNode(json);
}


export function readJSONFromFileInput(fileInput, callback) {
  // Get the first file object from the file input
  const file = fileInput.files[0];

  // Create a new FileReader object
  const reader = new FileReader();

  // Set up the 'load' event listener on the reader
  reader.addEventListener('load', () => {
    try {
      // Parse the JSON data from the reader's result
      const jsonData = JSON.parse(reader.result);
      callback(null, jsonData);
    } catch (error) {
      callback(error);
    }
  });


  // Read the file as text using the reader
  reader.readAsText(file);
}

export async function getMetadataFromFile(file) {
  const readfile = file.files[0];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', async () => {
      try {
        const json = JSON.parse(reader.result);
        const metadata = analyzeJSONStructure(json);
        console.log(metadata)
        const result = await getMetadataCID(JSON.stringify(metadata));

        resolve(result);
      } catch (error) {
        toast.error(error);
        reject(error.message);
      }
    });

    reader.addEventListener('error', () => {
      reject(new Error('Error reading file'));
    });

    reader.readAsText(readfile);
  });
}

export async function getMetadataCID(file) {
  const blob = new Blob([file], { type: "application/json" })

  const { cid } = await NFTStorage.encodeBlob(blob)


  //return await storage.storeBlob(blob)
  return cid.toString()
}


