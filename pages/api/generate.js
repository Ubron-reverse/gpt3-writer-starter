import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Give me two numbered lists of
1. Fonts: The name of top 3 Google fonts for the industry mentioned below
2. Colors: Name of the top 3 colours with their hexcodes for the industry mentioned below
Industry:
`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

   // Prompt #2.
   const secondPrompt = 
   `
   Take the Two Lists below and choose one font and color from each list. Don't just list the points. Write a short blog in Chris Do's style. Go deep into each one. Explain why this choice is best for the Industry.
 
   Industry: ${req.body.userInput}
 
   Two Lists: ${basePromptOutput.text}
 
   Font & Color:
   `
   
   // I call the OpenAI API a second time with Prompt #2
   const secondPromptCompletion = await openai.createCompletion({
     model: 'text-davinci-003',
     prompt: `${secondPrompt}`,
     // I set a higher temperature for this one. Up to you!
     temperature: 0.85,
         // I also increase max_tokens.
     max_tokens: 1250,
   });
   
   // Get the output
   const secondPromptOutput = secondPromptCompletion.data.choices.pop();
 
   // Send over the Prompt #2's output to our UI instead of Prompt #1's.
   res.status(200).json({ output: secondPromptOutput });
 };
 
 export default generateAction;