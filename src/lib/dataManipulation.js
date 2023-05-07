
import Papa from 'papaparse';

import { Configuration, OpenAIApi } from "openai";

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

    if (Array.isArray(node)) {
      structure.type = 'array';
      structure.count = node.length;

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

async function checkOpenAI(){
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

}

export async function categorizeData(json){
  
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
  } catch(error) {
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

