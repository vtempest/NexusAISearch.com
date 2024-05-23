import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model_names = [
  "llama3-70b-8192",
  "llama3-8b-8192",
  "gemma-7b-it",
  "mixtral-8x7b-32768",
];

/**
 * langModelAPI uses langChain to interact with the Groq LLM models
 * It requires a system prompt and user prompt, and returns a response from the Groq model
 * @param {Object} promptObject {
  systemPrompt,
  userPrompt,
  model,
  temperature,
  apiKey}
 * @return {string} output message from the Groq model
 */
export default async function langModelAPI({
  systemPrompt,
  userPrompt,
  model,
  temperature,
  apiKey,
}) {
  //the devil is in the defaults
  model = model || 0;
  temperature = temperature || 1;

  // prompt cannot be over 4000 words or no content
  if (!userPrompt) return { error: "No content" };

  if (userPrompt && userPrompt?.length > 10000) {
    console.log("User prompt too long at " + userPrompt.length);

    userPrompt = userPrompt.substring(0, 10000);
  }

  try {
    var langAPI = new ChatGroq({
      apiKey,
      model: model_names[model],
      temperature,
    });
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["human", userPrompt],
    ]);
    const chain = prompt.pipe(langAPI);
    var response = await chain.invoke();
    response = response?.content;
  } catch (error) {
    return (error.message);
  }

  return response;
}
