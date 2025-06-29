// popup.js (Final Version 2.3 - Fixed "Receiving End" Error)

document.addEventListener("DOMContentLoaded", () => {
  // --- References and State (Unchanged) ---
  const settingsView = document.getElementById("settings-view");
  const chatView = document.getElementById("chat-view");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
  const statusMessage = document.getElementById("statusMessage");
  const chatbox = document.getElementById("chatbox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  let chatHistory = [];

  // --- Click-Away Listener (Unchanged) ---
  document.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "IFRAME_CLICKED" });
  });

  // --- Helper Functions (Unchanged, except for setupChatView) ---
  const showView = (viewToShow) => {
    settingsView.classList.add("hidden");
    chatView.classList.add("hidden");
    viewToShow.classList.remove("hidden");
  };

  const addMessage = (text, role, save = true) => {
    const messageDiv = document.createElement("div");
    const cssClass = role === "model" ? "bot-message" : "user-message";
    messageDiv.classList.add("message", cssClass);
    messageDiv.innerHTML = marked.parse(text);
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    if (save) {
      chatHistory.push({ role, parts: [{ text }] });
      chrome.storage.session.set({ chatHistory });
    }
  };

  const rebuildChatFromHistory = (history) => {
    chatbox.innerHTML = "";
    history.forEach((message) => {
      addMessage(message.parts[0].text, message.role, false);
    });
  };

  // =========================================================
  // === THE FIX IS HERE: Modified setupChatView function ===
  // =========================================================
  const setupChatView = (problemData, storedHistory) => {
    chatHistory = storedHistory || [];
    chatbox.innerHTML = "";

    if (chatHistory.length > 0) {
      rebuildChatFromHistory(chatHistory);
    } else if (problemData && problemData.title) {
      addMessage(
        "I've read the problem. How can I help you get started?",
        "model"
      );
    } else {
      addMessage(
        "Navigate to a supported problem page and click the extension icon again.",
        "model"
      );
      userInput.disabled = true;
    }

    if (problemData) {
      userInput.disabled = false;
      // Only send the message to update the title if we have problem data,
      // which guarantees the UI has been injected.
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          chrome.tabs
            .sendMessage(tabs[0].id, {
              type: "UPDATE_HEADER_TITLE",
              text: problemData.title,
            })
            .catch((err) => {
              // Optional: Catches the error if the user navigates away very quickly.
              // This prevents the error from appearing in the console in that edge case.
              // console.log("Could not send title update, tab may have been closed or changed.");
            });
        }
      });
    }

    showView(chatView);
  };

  // --- Main Initialization (Unchanged) ---
  chrome.runtime.sendMessage({ type: "GET_INITIAL_STATE" }, (response) => {
    if (response.apiKeyExists) {
      setupChatView(response.problemData, response.chatHistory);
    } else {
      showView(settingsView);
    }
  });

  // --- All other Event Listeners and Functions are Unchanged ---
  // ... (paste the rest of the unchanged code from the previous file) ...
  saveApiKeyBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      statusMessage.textContent = "Please enter a valid key.";
      statusMessage.style.color = "red";
      return;
    }
    statusMessage.textContent = "Saving...";
    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        statusMessage.textContent = "Error saving key.";
      } else {
        statusMessage.textContent = "Success! Loading chat...";
        statusMessage.style.color = "green";
        setTimeout(() => {
          chrome.runtime.sendMessage(
            { type: "GET_INITIAL_STATE" },
            (response) => {
              setupChatView(response.problemData, response.chatHistory);
            }
          );
        }, 1000);
      }
    });
  });

  sendBtn.addEventListener("click", handleUserMessage);
  userInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleUserMessage();
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RESET_API_REQUEST") {
      chrome.storage.sync.remove("geminiApiKey");
      chrome.storage.session.remove("chatHistory");
      apiKeyInput.value = "";
      statusMessage.textContent = "";
      showView(settingsView);
      apiKeyInput.focus();
    } else if (message.type === "HISTORY_DELETED") {
      chatHistory = [];
      chatbox.innerHTML = "";
      addMessage(
        "I've read the problem. How can I help you get started?",
        "model"
      );
    }
  });

  function handleUserMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;
    addMessage(userText, "user");
    userInput.value = "";
    userInput.disabled = true;
    addLoadingIndicator();
    chrome.runtime.sendMessage(
      { type: "ASK_GEMINI", history: chatHistory },
      (response) => {
        removeLoadingIndicator();
        addMessage(response.text || "An unexpected error occurred.", "model");
        userInput.disabled = false;
        userInput.focus();
      }
    );
  }

  function addLoadingIndicator() {
    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("message", "bot-message", "loading-indicator");
    const spinner = document.createElement("div");
    spinner.classList.add("loading-spinner");
    botMessageDiv.appendChild(spinner);
    chatbox.appendChild(botMessageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  function removeLoadingIndicator() {
    document.querySelector(".loading-indicator")?.remove();
  }
});
