import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const retrieveDocuments = async (query) => {
  return [`Relevant doc about "${query}"`, `Another doc about "${query}"`];
};

const buildPrompt = async (docs, question) => {
  const context = docs.join("\n");
  return `Answer the question using the context below:\n\n${context}\n\nQuestion: ${question}`;
};

const generateAnswer = async (prompt) => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });

  const res = await model.generateContent(prompt);

  // ✅ Correct way to access text
  return res.response.text();
};

const chatbotController = async (req, res) => {
  try {
    const question = req.body.question;
    const docs = await retrieveDocuments(question);
    const prompt = await buildPrompt(docs, question);
    const answer = await generateAnswer(prompt);

    console.log("Answer:", answer, "Question:", question);
    return res.json({ answer });
  } catch (err) {
    console.error("Error in chatbotController:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { chatbotController };
