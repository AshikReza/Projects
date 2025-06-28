// ui-injector.js (VERSION 3 - With Drag Fix and Style Update)

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
  container.style.border = "1px solid rgba(0, 0, 0, 0.2)"; // A subtle border for the container

  // --- Create Draggable Header Bar ---
  const headerBar = document.createElement("div");
  headerBar.style.height = "36px";
  headerBar.style.width = "100%";
  headerBar.style.cursor = "grab";
  headerBar.style.flexShrink = "0";
  headerBar.style.display = "flex"; // For aligning title and close button
  headerBar.style.alignItems = "center";
  headerBar.style.padding = "0 10px";
  headerBar.style.boxSizing = "border-box";
  // STYLE CHANGE: Ash gray / dark charcoal header
  headerBar.style.background = "#2c2f33";

  // --- Create Title Element in Header ---
  const headerTitle = document.createElement("div");
  headerTitle.id = "gemini-hint-header-title"; // ID for popup.js to find
  headerTitle.style.color = "#e0e0e0";
  headerTitle.style.fontSize = "14px";
  headerTitle.style.fontWeight = "500";
  headerTitle.style.whiteSpace = "nowrap";
  headerTitle.style.overflow = "hidden";
  headerTitle.style.textOverflow = "ellipsis";
  headerTitle.textContent = "Loading..."; // Default text

  // --- Create Close Button ---
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "0px";
  closeButton.style.right = "5px";
  closeButton.style.height = "36px"; // Match header height
  closeButton.style.width = "36px";
  closeButton.style.zIndex = "1";
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "24px";
  closeButton.style.cursor = "pointer";
  // STYLE CHANGE: Light gray to be visible on dark header
  closeButton.style.color = "#b0b3b8";
  closeButton.onmouseover = () => {
    closeButton.style.color = "#ffffff";
  };
  closeButton.onmouseout = () => {
    closeButton.style.color = "#b0b3b8";
  };
  closeButton.onclick = () => container.remove();

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
  headerBar.appendChild(closeButton);
  container.appendChild(headerBar);
  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  document.body.appendChild(container);

  // --- Draggable Logic (with the fix) ---
  headerBar.addEventListener("mousedown", (e) => {
    // THE FIX: Prevent browser's default text-selection behavior
    e.preventDefault();

    headerBar.style.cursor = "grabbing";
    document.body.style.userSelect = "none"; // Prevent selection on the whole page

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

  // --- Resizing Logic (no changes needed here) ---
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

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_HEADER_TITLE") {
      const titleElement = document.getElementById("gemini-hint-header-title");
      if (titleElement) {
        titleElement.textContent = message.text;
      }
    }
  });
})();
