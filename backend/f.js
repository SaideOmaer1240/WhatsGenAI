import personAI from "./src/core/person.mjs";

const sessionid = "ana";

const userPrompt = "ainda tem o produto premium?";
const ai = await personAI(sessionid, userPrompt)
console.log(ai)
