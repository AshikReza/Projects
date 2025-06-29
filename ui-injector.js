// ui-injector.js (VERSION 5.3 - Syntax Errors Corrected)

(function () {
  // Prevent duplicate injection
  if (document.getElementById("gemini-hint-container")) return;

  // --- Create Main Container ---
  const container = document.createElement("div");
  container.id = "gemini-hint-container";
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.width = "380px";
  container.style.height = "500px";
  container.style.minWidth = "300px";
  container.style.minHeight = "400px";
  container.style.zIndex = "2147483647";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.overflow = "hidden";
  container.style.border = "1px solid rgba(0, 0, 0, 0.2)";

  // --- Create Draggable Header Bar ---
  const headerBar = document.createElement("div");
  headerBar.style.height = "36px";
  headerBar.style.width = "100%";
  headerBar.style.cursor = "grab";
  headerBar.style.flexShrink = "0";
  headerBar.style.display = "flex";
  headerBar.style.alignItems = "center";
  headerBar.style.padding = "0 10px";
  headerBar.style.boxSizing = "border-box";
  headerBar.style.background = "#2c2f33";

  // --- Create Title Element in Header ---
  const headerTitle = document.createElement("div");
  headerTitle.id = "gemini-hint-header-title";
  headerTitle.style.color = "#e0e0e0";
  headerTitle.style.fontSize = "14px";
  headerTitle.style.fontWeight = "500";
  headerTitle.style.whiteSpace = "nowrap";
  headerTitle.style.overflow = "hidden";
  headerTitle.style.textOverflow = "ellipsis";
  headerTitle.textContent = "Loading...";

  // --- Header Buttons & Menu ---
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "0px";
  closeButton.style.right = "5px";
  closeButton.style.height = "36px";
  closeButton.style.width = "36px";
  closeButton.style.zIndex = "1";
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "24px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "#b0b3b8";
  closeButton.onmouseover = () => {
    closeButton.style.color = "#ffffff";
  };
  closeButton.onmouseout = () => {
    closeButton.style.color = "#b0b3b8";
  };
  closeButton.onclick = () => container.remove();

  const settingsIcon = document.createElement("button");
  settingsIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
  settingsIcon.style.position = "absolute";
  settingsIcon.style.top = "0px";
  settingsIcon.style.right = "40px";
  settingsIcon.style.height = "36px";
  settingsIcon.style.width = "36px";
  settingsIcon.style.background = "transparent";
  settingsIcon.style.border = "none";
  settingsIcon.style.cursor = "pointer";
  settingsIcon.style.color = "#b0b3b8";
  settingsIcon.querySelector("svg").style.width = "16px";
  settingsIcon.querySelector("svg").style.height = "16px";
  settingsIcon.onmouseover = () => {
    settingsIcon.style.color = "#ffffff";
  };
  settingsIcon.onmouseout = () => {
    settingsIcon.style.color = "#b0b3b8";
  };

  const settingsMenu = document.createElement("div");
  settingsMenu.style.position = "absolute";
  settingsMenu.style.top = "40px";
  settingsMenu.style.right = "10px";
  settingsMenu.style.background = "#ffffff";
  settingsMenu.style.border = "1px solid #e0e0e0";
  settingsMenu.style.borderRadius = "8px";
  settingsMenu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  settingsMenu.style.zIndex = "2147483647";
  settingsMenu.style.display = "none";
  settingsMenu.style.padding = "5px 0";

  // =========================================================
  // === THE FIX IS HERE: Corrected Syntax Errors Below ======
  // =========================================================
  const deleteHistoryButton = document.createElement("button"); // <-- Fixed
  deleteHistoryButton.textContent = "Delete History";
  deleteHistoryButton.style.display = "block";
  deleteHistoryButton.style.width = "100%";
  deleteHistoryButton.style.padding = "8px 15px";
  deleteHistoryButton.style.border = "none";
  deleteHistoryButton.style.background = "none";
  deleteHistoryButton.style.textAlign = "left";
  deleteHistoryButton.style.cursor = "pointer";
  deleteHistoryButton.style.fontSize = "14px";
  deleteHistoryButton.onmouseover = () => {
    deleteHistoryButton.style.backgroundColor = "#f0f0f0";
  };
  deleteHistoryButton.onmouseout = () => {
    deleteHistoryButton.style.backgroundColor = "transparent";
  };

  const divider = document.createElement("hr"); // <-- Fixed
  divider.style.border = "none";
  divider.style.borderTop = "1px solid #e5e5e5";
  divider.style.margin = "5px 0";

  const resetApiButton = document.createElement("button"); // <-- Fixed
  resetApiButton.textContent = "Reset API Key";
  resetApiButton.style.display = "block";
  resetApiButton.style.width = "100%";
  resetApiButton.style.padding = "8px 15px";
  resetApiButton.style.border = "none";
  resetApiButton.style.background = "none";
  resetApiButton.style.textAlign = "left";
  resetApiButton.style.cursor = "pointer";
  resetApiButton.style.fontSize = "14px";
  resetApiButton.style.color = "#c93c3c";
  resetApiButton.style.fontWeight = "500";
  resetApiButton.onmouseover = () => {
    resetApiButton.style.backgroundColor = "#f0f0f0";
  };
  resetApiButton.onmouseout = () => {
    resetApiButton.style.backgroundColor = "transparent";
  };

  settingsMenu.appendChild(deleteHistoryButton);
  settingsMenu.appendChild(divider);
  settingsMenu.appendChild(resetApiButton);

  const iframe = document.createElement("iframe"); // <-- Fixed
  iframe.src = chrome.runtime.getURL("popup/popup.html");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  const resizeHandle = document.createElement("div"); // <-- Fixed
  resizeHandle.style.position = "absolute";
  resizeHandle.style.width = "15px";
  resizeHandle.style.height = "15px";
  resizeHandle.style.right = "0";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.cursor = "nwse-resize";
  resizeHandle.style.zIndex = "2";

  // --- Assemble and Inject ---
  headerBar.appendChild(headerTitle);
  headerBar.appendChild(settingsIcon);
  headerBar.appendChild(closeButton);
  container.appendChild(headerBar);
  container.appendChild(settingsMenu);
  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  document.body.appendChild(container);

  // --- Event Listeners ---
  settingsIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.style.display =
      settingsMenu.style.display === "block" ? "none" : "block";
  });
  deleteHistoryButton.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "DELETE_HISTORY_REQUEST" });
    settingsMenu.style.display = "none";
  });
  resetApiButton.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "RESET_API_REQUEST" });
    settingsMenu.style.display = "none";
  });
  document.addEventListener("click", (e) => {
    if (
      settingsMenu.style.display === "block" &&
      !settingsMenu.contains(e.target) &&
      !settingsIcon.contains(e.target)
    ) {
      settingsMenu.style.display = "none";
    }
  });

  // --- Drag and Resize Logic (Unchanged) ---
  headerBar.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    e.preventDefault();
    headerBar.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    let initialX = e.clientX;
    let initialY = e.clientY;
    let initialLeft = container.offsetLeft;
    let initialTop = container.offsetTop;
    function onMouseMove(e) {
      let dx = e.clientX - initialX;
      let dy = e.clientY - initialY;
      container.style.left = `${initialLeft + dx}px`;
      container.style.top = `${initialTop + dy}px`;
    }
    function onMouseUp() {
      headerBar.style.cursor = "grab";
      document.body.style.userSelect = "auto";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
  resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    let isResizing = true;
    let initialWidth = container.offsetWidth;
    let initialHeight = container.offsetHeight;
    let initialMouseX = e.clientX;
    let initialMouseY = e.clientY;
    function onMouseMove(e) {
      if (!isResizing) return;
      let dw = e.clientX - initialMouseX;
      let dh = e.clientY - initialMouseY;
      container.style.width = `${initialWidth + dw}px`;
      container.style.height = `${initialHeight + dh}px`;
    }
    function onMouseUp() {
      isResizing = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // --- Message Listener (Now it will run correctly) ---
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_HEADER_TITLE") {
      const titleElement = document.getElementById("gemini-hint-header-title");
      if (titleElement) {
        titleElement.textContent = message.text;
      }
    } else if (message.type === "IFRAME_CLICKED") {
      // If the menu is open and a click happened inside the iframe, close it.
      if (settingsMenu.style.display === "block") {
        settingsMenu.style.display = "none";
      }
    }
  });
})();
