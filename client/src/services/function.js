import callGemini from "../api/Gemini";

export function handleLayout(lay, setActiveLayout) {
  localStorage.setItem("layout", lay);
  setActiveLayout(lay);
}
export function scrollToBottom() {
  const el = document.querySelector(".display");
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}
export function handleUserInput(userInput, setUserInput, handleAiForm) {
  if (userInput.trim() == "") return;
  scrollToBottom();
  setUserInput("");
  handleAiForm();
}

export async function handleAiForm(
  userInput,
  setUserInput,
  setMessages,
  setRows,
  setLoading,
  setError,
) {
  if (!userInput.trim()) return;

  const date = new Date();

  const systemPrompt = `
    You are LifeSync Bot. You have READ and WRITE access to the user's data.

    Current Data Context: {contextStr}

    You must respond ONLY in valid JSON.

    If the user wants to perform an action, return:
    { "type": "action", "tool": "TOOL_NAME", "args": { ... } }

    Available Tools:
    - add_expense: { amount, category, description }
    - add_note: { title, content }
    - add_diary: { title, content }
    - add_task: { title }
    - delete_item: { type, id }
    - complete_habit: { id, title }

    If the user just wants to chat:
    { "type": "message", "content": "text" }

    User Text: ${userInput}
    Today's Date: "${date.getDate()}/${date.getMonth()}/${date.getFullYear()}",
    Today day:${date.getDay()},
    Current time:"Hour:${date.getHours()}:Min${date.getMinutes()}"

  `;

  setMessages((prev) => [...prev, { role: "user", text: userInput }]);
  setUserInput("");
  setRows(1);
  setLoading(true);

  try {
    const rawResponse = await callGemini(systemPrompt);
    const raw = rawResponse.data.reply.trim();

    // 🛡 Safe JSON extraction
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const safeJson = raw.slice(start, end + 1);
    const response = JSON.parse(safeJson);

    setError(false);

    if (response.type === "message") {
      setMessages((prev) => [...prev, { role: "bot", text: response.content }]);
    }

    if (response.type === "action") {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `✅ Action detected: ${response.tool}`,
        },
      ]);

      // 👉 Here you can execute tool logic later
      console.log("ACTION:", response);
    }
  } catch (err) {
    console.error(err);
    setError(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: "⚠️ Something went wrong. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
    scrollToBottom();
  }
}

export const isTaskDue = (date) => {
  const today = new Date();
  const temp = new Date(date.year, date.month, date.date);
  return today > temp;
};
