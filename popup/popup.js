// popup.js (Final Version - Listens for Reset Request)

document.addEventListener("DOMContentLoaded", () => {
  // --- References and State ---
  const settingsView = document.getElementById("settings-view");
  const chatView = document.getElementById("chat-view");
  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
  const statusMessage = document.getElementById("statusMessage");
  const chatbox = document.getElementById("chatbox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  let chatHistory = [];

  // --- Helper Functions (Unchanged) ---
  const showView = (viewToShow) => {
    settingsView.classList.add("hidden");
    chatView.classList.add("hidden");
    viewToShow.classList.remove("hidden");
  };

  const addMessage = (text, role) => {
    const messageDiv = document.createElement("div");
    const cssClass = role === "model" ? "bot-message" : "user-message";
    messageDiv.classList.add("message", cssClass);
    messageDiv.innerHTML = marked.parse(text);
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    chatHistory.push({ role, parts: [{ text }] });
  };

  const setupChatView = (problemData) => {
    chatbox.innerHTML = "";
    chatHistory = [];
    if (problemData && problemData.title) {
      addMessage(
        "I've read the problem. How can I help you get started?",
        "model"
      );
      userInput.disabled = false;
    } else {
      addMessage(
        "Navigate to a supported problem page and click the extension icon again.",
        "model"
      );
      userInput.disabled = true;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, {
          type: "UPDATE_HEADER_TITLE",
          text: problemData?.title || "Gemini Solver",
        });
      }
    });
    showView(chatView);
  };

  // --- Main Initialization (Unchanged) ---
  chrome.runtime.sendMessage({ type: "GET_INITIAL_STATE" }, (response) => {
    if (response.apiKeyExists) {
      setupChatView(response.problemData);
    } else {
      showView(settingsView);
    }
  });

  // --- Event Listeners ---
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
              setupChatView(response.problemData);
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

  // The old resetApiKeyBtn listener has been REMOVED

  // =========================================================
  // === NEW: Message listener for API Reset Request =========
  // =========================================================
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RESET_API_REQUEST") {
      // 1. Remove the key from storage
      chrome.storage.sync.remove("geminiApiKey", () => {
        // 2. Clear the input field and any status messages
        apiKeyInput.value = "";
        statusMessage.textContent = "";
        statusMessage.style.color = ""; // Reset color

        // 3. Switch back to the settings view
        showView(settingsView);

        // 4. (Optional but good UX) Focus the input field
        apiKeyInput.focus();
      });
    }
  });
  // =========================================================

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
