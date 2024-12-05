import personAI from "./src/core/person.mjs";

const sessionid = "hugo";
const userPrompt = "como posso comprar";

const number = '564687543';

const ai = await personAI(sessionid, userPrompt, number)
console.log(ai)

