const inputField = document.querySelector(".chat__input-field");
const toolbar = document.getElementById("textToolbar");
const messagePreview = {
  text: document.querySelector(".message__content-text"),
  time: document.querySelector(".message__meta-time"),
};

function parseTelegramMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/__(.*?)__/g, "<em>$1</em>") // Italic
    .replace(/~~(.*?)~~/g, "<s>$1</s>") // Strikethrough
    .replace(/`(.*?)`/g, "<code>$1</code>") // Inline code
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    ); // Links
}

function renderPreview() {
  const raw = inputField.innerHTML;
  const formatted = parseTelegramMarkdown(raw);

  messagePreview.text.innerHTML = formatted;
  messagePreview.time.innerText = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const handleSelection = () => {
  const selection = window.getSelection();

  if (!inputField.contains(selection.anchorNode)) {
    toolbar.classList.remove("visible");
    return;
  }

  if (selection.toString().length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    toolbar.style.top = `${window.scrollY + rect.top - 50}px`;
    toolbar.style.left = `${window.scrollX + rect.left}px`;

    toolbar.classList.add("visible");
  } else {
    toolbar.classList.remove("visible");
  }
};

const applyFormatting = (cmd, value = null) => {
  document.execCommand(cmd, false, value);
  renderPreview();
};

const commandMap = {
  bold: () => applyFormatting("bold"),
  italic: () => applyFormatting("italic"),
  underline: () => applyFormatting("underline"),
  strikethrough: () => applyFormatting("strikethrough"),
  insertLink: () => {
    const url = prompt("Enter the link URL:", "https://");
    if (url) applyFormatting("createLink", url);
  },
};

function handleToolbarClick(e) {
  const cmd = e.target.getAttribute("tool-cmd");
  if (!cmd) return;

  if (commandMap[cmd]) {
    commandMap[cmd]();
  }

  window.getSelection().removeAllRanges();
  toolbar.classList.remove("visible");
}

function handleOutsideClick(e) {
  if (
    !e.target.closest(".text-toolbar") &&
    !e.target.closest(".chat__input-field")
  ) {
    toolbar.classList.remove("visible");
  }
}

inputField.addEventListener("input", renderPreview);
inputField.addEventListener("mouseup", handleSelection);
inputField.addEventListener("keyup", handleSelection);
document.addEventListener("selectionchange", handleSelection);
toolbar.addEventListener("click", handleToolbarClick);
document.addEventListener("click", handleOutsideClick);

window.onload = function () {
  inputField.focus();
};
