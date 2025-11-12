import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatwithAI = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const habits = await prisma.habit.findMany({
      where: {
        userId: userId
      },
      include: { logs: true }
    });

    if (!habits.length) {
      return res.json({ reply: "You don't have any habits yet. Try adding one!" });
    }

    const summary = habits.map((habit) => {
      const completedThisWeek = habit.logs.filter((log) =>
        new Date(log.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
        log.status === 'completed'
      ).length;
      return `${habit.name}: completed ${completedThisWeek} days this week, current streak: ${habit.streak} days.`;
    }).join("\n")

    const prompt = ` You are a helpful AI assistant in a Habit Tracking app.
Your goal is to give friendly insights, motivation, and answers based on the user's
habit data. User Data: ${summary} User Question:"${message}"
Respond in a positive and human-like tone in only 20 to 30 words.`

    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);

    const aiReply = result.response.text();

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Something went wrong while chatting." });
  }

}

const retrieveDocuments = async (query) => {
  return [`Relevant doc about "${query}"`, `Another doc about "${query}"`];
};

const buildPrompt = async (docs, question) => {
  const context = docs.join("\n");
  return `Answer the question using the context below:\n\n${context}\n\nQuestion: ${question}`;
};

const generateAnswer = async (prompt) => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

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

export { chatbotController, chatwithAI };
