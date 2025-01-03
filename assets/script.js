const synth = window.speechSynthesis;
let utterance;
let voices = [];
let currentWordIndex = 0;
let words = [];
let selectedText = "";

// Load available voices
function loadVoices() {
  voices = synth.getVoices();
  const voiceSelect = document.getElementById("voice-select");

  // Clear existing options
  voiceSelect.innerHTML = "";

  // Add available voices to the dropdown
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Populate voices when they are loaded
synth.onvoiceschanged = loadVoices;

// Function to speak the selected or entered text
function speakSelectedText() {
  const text = selectedText || document.getElementById("text-input").value;
  const voiceIndex = document.getElementById("voice-select").value;

  if (!text.trim()) {
    alert("Please select or enter some text!");
    return;
  }

  // Split text into words for highlighting
  words = text.split(" ");
  currentWordIndex = 0;

  // Create a new utterance
  utterance = new SpeechSynthesisUtterance(text);

  // Set the selected voice
  utterance.voice = voices[voiceIndex];

  // Set utterance properties
  utterance.rate = 1; // Speed (0.1 to 10)
  utterance.pitch = 1; // Pitch (0 to 2)
  utterance.volume = 1; // Volume (0 to 1)

  // Update status
  document.getElementById("status").textContent = "Status: Speaking...";

  // Start progress bar
  updateProgressBar(0);

  // Highlight the first word
  highlightWord(currentWordIndex);

  // Event listeners for utterance
  utterance.onboundary = (event) => {
    if (event.name === "word") {
      currentWordIndex++;
      highlightWord(currentWordIndex);
      updateProgressBar((currentWordIndex / words.length) * 100);
    }
  };

  utterance.onend = () => {
    document.getElementById("status").textContent = "Status: Finished";
    updateProgressBar(100);
    clearHighlight();
  };

  utterance.onpause = () => {
    document.getElementById("status").textContent = "Status: Paused";
  };

  utterance.onresume = () => {
    document.getElementById("status").textContent = "Status: Speaking...";
  };

  // Speak the text
  synth.speak(utterance);
}

// Function to stop speaking
function stop() {
  synth.cancel();
  document.getElementById("status").textContent = "Status: Stopped";
  updateProgressBar(0);
  clearHighlight();
}

// Function to pause speaking
function pause() {
  synth.pause();
}

// Function to resume speaking
function resume() {
  synth.resume();
}

// Function to preview the selected voice
function previewVoice() {
  const voiceIndex = document.getElementById("voice-select").value;
  const previewText = "This is a preview of the selected voice.";

  const previewUtterance = new SpeechSynthesisUtterance(previewText);
  previewUtterance.voice = voices[voiceIndex];
  synth.speak(previewUtterance);
}

// Function to update the progress bar
function updateProgressBar(percentage) {
  const progressBar = document.getElementById("progress");
  progressBar.style.width = percentage + "%";
}

// Function to highlight the current word being spoken
function highlightWord(index) {
  const textOutput = document.getElementById("text-output");
  textOutput.innerHTML = words
    .map((word, i) =>
      i === index ? `<span class="highlight">${word}</span>` : word
    )
    .join(" ");
}

// Function to clear highlighting
function clearHighlight() {
  const textOutput = document.getElementById("text-output");
  textOutput.innerHTML = words.join(" ");
}

// Function to capture selected text on the page
document.addEventListener("mouseup", () => {
  selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    document.getElementById("selected-text-content").textContent = selectedText;
  } else {
    document.getElementById("selected-text-content").textContent = "None";
  }
});