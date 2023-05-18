
import Papa from 'papaparse';

import { NFTStorage } from 'nft.storage';
import { Configuration, OpenAIApi } from "openai";
import { toast } from 'react-toastify';

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);


export default
  function readBlobAsJson(blob, callback) {
  const reader = new FileReader();

  // Define the onload event handler
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
  reader.readAsText(blob);

  return reader;
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

async function checkOpenAI() {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

}

export async function categorizeData(json) {

  checkOpenAI();
  const jsonData = JSON.stringify(json, null, 2);

  const prompt = `Analyze and categorize the following JSON data:\n\n${jsonData}\n\nAnalysis:`;


  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(prompt),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }


  return 'Unable to analyze and categorize the JSON data.';
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

export function readFSStream(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', async () => {
      try {
        resolve(reader.result);
      } catch (error) {
        toast.error(error);
        reject(error.message);
      }
    });

    reader.addEventListener('error', () => {
      reject(new Error('Error reading file'));
    });

    reader.readAsText(file);
  });
}

export async function getMetadataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', async () => {
      try {
        const json = JSON.parse(reader.result);
        const metadata = analyzeJSONStructure(json);
        const result = await getMetadataCID(metadata);
        resolve(result);
      } catch (error) {
        toast.error(error);
        reject(error.message);
      }
    });

    reader.addEventListener('error', () => {
      reject(new Error('Error reading file'));
    });

    reader.readAsText(file);
  });
}

export async function getMetadataCID(file){
  const blob = new Blob([file], { type: "application/json" })

  const { cid } = await NFTStorage.encodeBlob(blob)


  //return await storage.storeBlob(blob)
  return  cid.toString()
}

