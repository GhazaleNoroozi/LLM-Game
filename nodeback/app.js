const {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Set up VertexAI
const project = process.env.PROJECT_I;
const location = process.env.LOCATION;
const port = process.env.PORT;

const vertexAI = new VertexAI({project: project, location: location});

// Instantiate Gemini models
const textModel =  'gemini-1.0-pro';
const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
  generationConfig: {maxOutputTokens: 256},
  systemInstruction: {
    role: 'system',
    parts: [{"text": `You're responsible to come up with a world
      based on the user requests for the world and describe it.
      This is for a text-based game that will happen in that world.`}]
  },
});


// async function DescribeWorld() {
//   const request = {
//     contents: [{role: 'user', parts: [{text: 'How are you doing today?'}]}],
//   };
//   const result = await generativeModel.generateContent(request);
//   const response = result.response;
//   console.log('Response: ', JSON.stringifipy(response));
// };

// DescribeWorld();


// Middleware to parse JSON bodies
const app = express();
app.use(cors()); 
app.use(express.json());

// Define the API endpoint
app.post('/describe-world', async (req, res) => {
  try {
    const quesiton = req.body["question"];
    const request = {
      contents: [{role: 'user', parts: [{text: quesiton}]}],
    };
    const result = await generativeModel.generateContent(request);
    const response = JSON.stringify(result.response);

    // Send the response back to the frontend
    res.json({success: true, data: response});
  } catch (error) {
    console.error('Error in generating content:', error);
    res.status(500).json({success: false, message: error});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
