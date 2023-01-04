//import the necessary elements
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

//for making requests to the OpenAI API 
//The Configuration object is used to configure the client for making requests to the OpenAI API. 
//The apiKey property is used to authenticate the client and allow it to access the API.
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//setting up an HTTP server using the express library
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res)=>{
    res.status(200).send({
        message: 'Hello from Jarvis',
    })
});

//for setting up an HTTP POST route on an express app object that listens for requests to the root path ('/') 
//and uses the OpenAI API to generate a response to a prompt provided in the request body
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt: `${prompt}`, 
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text 
        })
    } 
    
    catch (error) 
    {
        console.log(error);
        res.status(500).send({ error })
    }
} 
)

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));