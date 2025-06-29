/* background.js — v8 (With Session History)
 * Manages chat history persistence and deletion.
 * ---------------------------------------------------- */

/* ----- 0. CONFIG --------------------------------------------------------- */
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"; // Updated for latest model
const RATE_LIMIT_DELAY_MS = 300;

/* ----- 1. Rate Limiter (Unchanged) -------------------------------------- */
let nextFreeSlot = 0;
async function rateLimit() {
  const now = Date.now();
  if (now < nextFreeSlot) {
    await new Promise((r) => setTimeout(r, nextFreeSlot - now));
  }
  nextFreeSlot = Date.now() + RATE_LIMIT_DELAY_MS;
}

/* ----- 2. Action Handler & Router ---------------------------------------- */
chrome.action.onClicked.addListener(async (tab) => {
  /* ... Unchanged ... */
  const [{ result: already }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.getElementById("gemini-hint-container"),
  });
  if (already) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-scraper.js"],
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  if (msg.type === "PROBLEM_SCRAPED") {
    /* ... Unchanged ... */
    chrome.storage.local.set({ lastProblemData: msg.data }, () =>
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ["ui-injector.js"],
      })
    );
  } else if (msg.type === "GET_INITIAL_STATE") {
    (async () => {
      const { geminiApiKey } = await chrome.storage.sync.get("geminiApiKey");
      const { lastProblemData } = await chrome.storage.local.get(
        "lastProblemData"
      );
      // UPDATED: Also get the chat history from the session
      const { chatHistory } = await chrome.storage.session.get("chatHistory");
      sendResp({
        apiKeyExists: Boolean(geminiApiKey),
        problemData: lastProblemData || null,
        chatHistory: chatHistory || [], // Send history, or an empty array
      });
    })();
    return true;
  } else if (msg.type === "ASK_GEMINI") {
    /* ... Unchanged logic, but now it's part of a persistent conversation ... */
    (async () => {
      const { lastProblemData } = await chrome.storage.local.get(
        "lastProblemData"
      );
      if (!lastProblemData)
        return sendResp({ success: false, text: "No problem scraped." });
      const systemPrompt = buildSystemPrompt(lastProblemData);
      await callGeminiApi(msg.history, systemPrompt, sendResp);
    })();
    return true;
  } else if (msg.type === "DELETE_HISTORY_REQUEST") {
    // NEW: Handle history deletion
    (async () => {
      // 1. Clear history from storage
      await chrome.storage.session.remove("chatHistory");

      // 2. Tell the active popup to update its UI
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab) {
        chrome.runtime.sendMessage({ type: "HISTORY_DELETED" });
      }
      sendResp({ success: true }); // Acknowledge the request
    })();
    return true;
  }
  // NOTE: The "RESET_API_REQUEST" is handled directly by popup.js and does not need a listener here.
});

/* ----- 3. API & Prompt Functions (Unchanged) ------------------------------- */
function buildSystemPrompt(p) {
  /* ... Unchanged ... */
}
async function callGeminiApi(history, systemPrompt, sendResp) {
  /* ... Unchanged ... */
}

// Paste the unchanged buildSystemPrompt and callGeminiApi functions here
function buildSystemPrompt(p) {
  return `You are an expert programming tutor. You are currently helping a user with a specific problem.
Source: ${p.source}
Title: ${p.title}
Problem Details: ${p.body?.slice(0, 4000)}

Your rules:
1. Provide concise, Socratic hints to guide the user.
2. Do not provide the full code or the final answer.
3. Keep the conversation focused on the provided problem.
4. Base your next hint on the user's last question and the conversation history.`;
}

async function callGeminiApi(history, systemPrompt, sendResp) {
  const { geminiApiKey } = await chrome.storage.sync.get("geminiApiKey");
  if (!geminiApiKey)
    return sendResp({ success: false, text: "API key missing." });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent`;
  const body = JSON.stringify({
    contents: history,
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": geminiApiKey,
  };

  try {
    await rateLimit();
    const res = await fetch(url, { method: "POST", headers, body });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || `${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(
        "API returned no content, possibly due to safety filters."
      );
    }
    sendResp({ success: true, text: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    sendResp({ success: false, text: `Gemini Error: ${err.message}` });
  }
}
