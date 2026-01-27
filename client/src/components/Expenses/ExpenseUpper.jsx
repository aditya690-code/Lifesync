import React, { useState } from "react";
import { Bot, IndianRupee, Loader2, Sparkles, Wallet, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useSelector } from "react-redux";
import callGemini from "../../api/Gemini";

const ExpenseUpper = ({ tl, total }) => {
  const [aiTop, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);

  const EXPENSE_CATEGORIES = [
    "Groceries",
    "Travel",
    "Rent",
    "Bills",
    "Internet",
    "Shopping",
    "Entertainment",
    "Subscriptions",
    "Health",
    "Fitness",
    "Education",
    "Books",
    "EMI",
    "Loan",
    "Insurance",
    "Fuel",
    "Cab",
    "Gifts",
    "Personal Care",
  ];

  const expenses = useSelector((state) => state.expenses.expenses);

  // Animation
  useGSAP(() => {
    tl.from(".history", {
      x: 400,
      autoAlpha: 0,
      stagger: 0.15,
      delay: 1,
    })

      .from(".header", {
        y: 500,
        autoAlpha: 0,
        duration: 0.6,
      })
      .from(".header .left", {
        x: -400,
        autoAlpha: 0,
        duration: 0.6,
        scale: 0,
      })
      .from(
        ".header .right",
        {
          x: 700,
          autoAlpha: 0,
          duration: 0.6,
          scale: 0,
        },
        "<",
      )

      .from(".left h2,.left h2 Wallet,.left h2 span,.left p span", {
        x: -600,
        scale: 0,
        duration: 0.1,
        autoAlpha: 0,
        stagger: 0.17,
      })

      .from(
        ".icon, input,select,.option,button",
        {
          x: 1200,
          autoAlpha: 0,
          scale: 0,
          duration: 0.7,
          stagger: 0.17,
        },
        "<",
      );
  });
  const handleAnalyze = async () => {
    // 1. Fast Exit
    if (!expenses || expenses.length === 0) return;

    try {
      setLoadingTip(true);
      setAiTip(null);

      // --- STEP 2: SMART AGGREGATION ---

      // Calculate Total
      const totalAmount = expenses.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0,
      );

      // Group totals by Category
      const categoryTotals = expenses.reduce((acc, curr) => {
        const key = curr.category || curr.title || "Misc";
        acc[key] = (acc[key] || 0) + (Number(curr.amount) || 0);
        return acc;
      }, {});

      // Sort by highest cost and take only TOP 5 (Focuses the AI's attention)
      const topExpenses = Object.entries(categoryTotals)
        .sort(([, amountA], [, amountB]) => amountB - amountA) // Descending sort
        .slice(0, 5) // Take top 5
        .map(([key, val]) => `${key}: ₹${val}`)
        .join(", ");

      const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
      });

      // --- STEP 3: CONTEXT-AWARE PROMPT ---

      const systemPrompt = `
        Act as a financial coach. Analyze this user's spending data.
        
        Context:
        - Today's Date: ${currentDate}
        - Total Spent: ₹${totalAmount}
        - Top Spending Categories: ${topExpenses}

        Task: Identify the single most impactful area to cut costs.

        Output Requirements:
        1. Return strictly valid JSON.
        2. No markdown formatting (no \`\`\`).
        3. Format: { "advice": "One sentence of friendly, actionable advice." }
      `;

      // --- STEP 4: API CALL ---

      const response = await callGemini(systemPrompt);

      // --- STEP 5: ROBUST PARSING ---
      let replyText = response.data?.advice || ""; //response.data ||

      // aggressive cleanup: removes markdown code blocks and surrounding whitespace
      // const cleanJson = replyText.replace(/```json|```/g, "").trim();
      const cleanJson = replyText;

      let advice = "Check your top expense categories to find savings."; // Default fallback

      try {
        const parsed = JSON.parse(cleanJson);
        if (parsed.advice) advice = parsed.advice;
      } catch (parseError) {
        // If JSON fails, check if the raw text is usable advice
        if (!cleanJson.startsWith("{") && cleanJson.length < 150) {
          advice = cleanJson;
          console.log(parseError);
        } else {
          console.warn("AI Response malformed:", replyText);
        }
      }
      advice = cleanJson;

      setAiTip(advice);
    } catch (err) {
      console.error("Analysis Error:", err);
      setAiTip("I need a bit more data to generate a tip. Keep tracking!");
    } finally {
      setLoadingTip(false);
    }
  };
  return (
    <>
      {/* Header */}
      <div
        className="
          header 
          relative
          w-full 
          bg-white
          py-20 h-20 mt-3
          flex justify-evenly items-center
          rounded-2xl
          opacity-95 
          border
          border-transparent
          shadow
          "
      >
        {/*Header Left */}
        <div
          className="
                left 
                relative
                max-w-[26%] 
                h-20
                flex justify-center items-center
                rounded-xl
                animate-slide-up 
                bg-linear-to-r 
                from-indigo-600 
                to-purple-600 "
        >
          <h2 className="text-sm flex gap-2 text-[#eae8e8] w-1/3 h-full items-center p-4">
            <Wallet size={35} />
            <span className="leading-4">Total Spend</span>
          </h2>
          <p className="flex-1 flex items-center justify-start gap-0 text-[#eae8e8]">
            <span className="text-4xl">₹{total}</span>
          </p>
          {loadingTip ? (
            <Loader2
              size={23}
              className="text-white absolute top-4 right-5 cursor-progress animate-spin p-1.5"
            />
          ) : (
            <Sparkles
              size={23}
              onClick={handleAnalyze}
              className="text-white absolute top-4 right-5 cursor-pointer hover:bg-[#ffffff3d] p-1.5 rounded-full transition"
            />
          )}{" "}
        </div>

        {/* Header Right */}
        <div
          className="
                right 
                w-[70%] 
                rounded-xl
                h-20 
                bg-[#eae9e9]
                flex items-center"
        >
          <div className="inputes h-1/2 w-full flex px-8">
            <div className="icon max-w-32 flex items-center bg-white pl-2 rounded-lg">
              <IndianRupee size={30} />
              <input
                type="number"
                className="bg-white outline-none border-none h-full text-start pl-4 min-w-20"
                placeholder="Amount"
              />
            </div>
            <input
              type="text"
              className="bg-white outline-none border-none h-full text-start min-w-28 flex-1 pl-4"
              placeholder="Description"
            />
            <span className="option bg-white flex items-center cursor-pointer">
              <select
                name="categoty"
                placeholder="Category"
                id=""
                className="cursor-pointer w-43 px-4 pr-8 border-none rounded-none outline-none bg-white"
              >
                <option value="" hidden>
                  {" "}
                  Category
                </option>
                {EXPENSE_CATEGORIES.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </span>
            {/* Button */}
            <button className="w-28 h-full cursor-pointer bg-white rounded-lg rounded-l-none active:font-normal font-medium">
              {" "}
              Add
            </button>
          </div>
        </div>
      </div>
      {/* Ai message */}

      {aiTop && (
        <div
          className="mt-4 p-3 bg-indigo-700/10 
          rounded-lg text-sm min-w-68 max-w-1/4 
          backdrop-blur-sm border border-white/20 
          animate-fade-in flex gap-2 
          absolute left-82 top-50 z-20"
        >
          <Bot size={16} className="shrink-0 mt-0.5" />
          <p>{aiTop}</p>
          <button
            onClick={() => setAiTip(null)}
            className="shrink-0 opacity-50 hover:opacity-100"
          >
            <X size={14} className="cursor-pointer" />
          </button>
        </div>
      )}
    </>
  );
};

export default ExpenseUpper;
