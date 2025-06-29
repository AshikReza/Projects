// ui-injector.js (VERSION 4 - With Settings Menu)

(function () {
  // Prevent duplicate injection
  if (document.getElementById("gemini-hint-container")) return;

  // --- Create Main Container ---
  const container = document.createElement("div");
  container.id = "gemini-hint-container";
  // ... (all other container styles remain the same) ...
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
  // ... (all other header bar styles remain the same) ...
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
  // ... (all other title styles remain the same) ...
  headerTitle.style.color = "#e0e0e0";
  headerTitle.style.fontSize = "14px";
  headerTitle.style.fontWeight = "500";
  headerTitle.style.whiteSpace = "nowrap";
  headerTitle.style.overflow = "hidden";
  headerTitle.style.textOverflow = "ellipsis";
  headerTitle.textContent = "Loading...";

  // --- Create Close Button ---
  const closeButton = document.createElement("button");
  // ... (all close button styles remain the same) ...
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

  // =========================================================
  // === NEW: Settings Icon and Popup Menu ===================
  // =========================================================

  // --- 1. Create Settings Icon ---
  const settingsIcon = document.createElement("button");
  settingsIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
  settingsIcon.style.position = "absolute";
  settingsIcon.style.top = "0px";
  settingsIcon.style.right = "40px"; // Position left of the close button
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

  // --- 2. Create Popup Menu ---
  const settingsMenu = document.createElement("div");
  settingsMenu.style.position = "absolute";
  settingsMenu.style.top = "40px"; // Below the header
  settingsMenu.style.right = "10px";
  settingsMenu.style.background = "#ffffff";
  settingsMenu.style.border = "1px solid #e0e0e0";
  settingsMenu.style.borderRadius = "8px";
  settingsMenu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  settingsMenu.style.zIndex = "2147483647"; // Ensure it's on top
  settingsMenu.style.display = "none"; // Initially hidden

  // --- 3. Create "Reset API" Button in Menu ---
  const resetApiButton = document.createElement("button");
  resetApiButton.textContent = "Reset API Key";
  resetApiButton.style.display = "block";
  resetApiButton.style.width = "100%";
  resetApiButton.style.padding = "10px 15px";
  resetApiButton.style.border = "none";
  resetApiButton.style.background = "none";
  resetApiButton.style.textAlign = "left";
  resetApiButton.style.cursor = "pointer";
  resetApiButton.style.fontSize = "14px";
  resetApiButton.onmouseover = () => {
    resetApiButton.style.backgroundColor = "#f0f0f0";
  };
  resetApiButton.onmouseout = () => {
    resetApiButton.style.backgroundColor = "transparent";
  };

  settingsMenu.appendChild(resetApiButton);

  // --- 4. Add Event Listeners ---
  settingsIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent header drag
    settingsMenu.style.display =
      settingsMenu.style.display === "block" ? "none" : "block";
  });

  resetApiButton.addEventListener("click", (e) => {
    e.stopPropagation();
    // Send a message to the iframe to handle the logic
    chrome.runtime.sendMessage({ type: "RESET_API_REQUEST" });
    settingsMenu.style.display = "none"; // Hide menu after clicking
  });

  // Hide menu if clicking outside of it
  document.addEventListener("click", (e) => {
    if (
      settingsMenu.style.display === "block" &&
      !settingsMenu.contains(e.target) &&
      !settingsIcon.contains(e.target)
    ) {
      settingsMenu.style.display = "none";
    }
  });

  // --- Create Iframe ---
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("popup/popup.html");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  // --- Create Resize Handle ---
  const resizeHandle = document.createElement("div");
  resizeHandle.style.position = "absolute";
  resizeHandle.style.width = "15px";
  resizeHandle.style.height = "15px";
  resizeHandle.style.right = "0";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.cursor = "nwse-resize";
  resizeHandle.style.zIndex = "2";

  // --- Assemble and Inject ---
  headerBar.appendChild(headerTitle);
  headerBar.appendChild(settingsIcon); // Add settings icon
  headerBar.appendChild(closeButton);
  container.appendChild(headerBar);
  container.appendChild(settingsMenu); // Add menu to container
  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  document.body.appendChild(container);

  // --- Draggable & Resizing Logic (Unchanged) ---
  // ... (paste the draggable and resizing logic from your previous file here) ...
  headerBar.addEventListener("mousedown", (e) => {
    // Prevent drag if clicking on an interactive element like the settings icon
    if (settingsIcon.contains(e.target)) return;
    e.preventDefault();
    headerBar.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    let initialX = e.clientX,
      initialY = e.clientY;
    let initialLeft = container.offsetLeft,
      initialTop = container.offsetTop;
    function onMouseMove(e) {
      container.style.left = `${initialLeft + e.clientX - initialX}px`;
      container.style.top = `${initialTop + e.clientY - initialY}px`;
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
    let initialWidth = container.offsetWidth,
      initialHeight = container.offsetHeight;
    let initialMouseX = e.clientX,
      initialMouseY = e.clientY;
    function onMouseMove(e) {
      if (!isResizing) return;
      container.style.width = `${initialWidth + e.clientX - initialMouseX}px`;
      container.style.height = `${initialHeight + e.clientY - initialMouseY}px`;
    }
    function onMouseUp() {
      isResizing = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // --- Message Listener (Unchanged) ---
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_HEADER_TITLE") {
      const titleElement = document.getElementById("gemini-hint-header-title");
      if (titleElement) {
        titleElement.textContent = message.text;
      }
    }
  });
})();
