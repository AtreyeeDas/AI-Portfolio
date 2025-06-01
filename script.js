const chatBubble = document.getElementById("chat-bubble");
const chatOverlay = document.getElementById("chat-overlay");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

// Show chat overlay
chatBubble.addEventListener("click", () => {
  chatOverlay.classList.remove("hidden");
  userInput.focus();

  if (!chatBody.dataset.initialized) {
    const botMsgDiv = document.createElement("div");
    botMsgDiv.classList.add("chat-message", "bot-message");
    botMsgDiv.innerText = "Hi! I am Atreyee Das, what do you want to know about me?";
    chatBody.appendChild(botMsgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    chatBody.dataset.initialized = "true";
  }
});


// Close chat overlay
closeChat.addEventListener("click", () => {
  chatOverlay.classList.add("hidden");
});

// Send message function
async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  // Display user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.classList.add("chat-message", "user-message");
  userMsgDiv.innerText = msg;
  chatBody.appendChild(userMsgDiv);

  userInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show typing animation (optional)
  const botTypingDiv = document.createElement("div");
  botTypingDiv.classList.add("chat-message", "bot-message");
  botTypingDiv.innerText = "Typing...";
  chatBody.appendChild(botTypingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Fetch AI response from Gemini API
  const response = await getGeminiResponse(msg);

  // Replace typing with actual message
  botTypingDiv.innerText = response;
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  
  // Optional: Save theme preference
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

async function getGeminiResponse(userMessage) {
  const fullName = "Atreyee Das";
  const myDescription = "I am Atreyee Das, a 20 year old passionate and curious Computer Science Engineering student from Kolkata with a strong inclination toward Artificial Intelligence, Machine Learning, and data-driven solutions for real-world problems. I study in IEM, Kolkata, 2nd year. My academic and project experiences reflect a balance of innovation and impact — from analyzing satellite imagery using few-shot learning to understand mangrove resilience in the Sundarbans, to developing AI-powered drug repurposing tools with Graph Neural Networks, and creating intelligent financial assistants using LSTM models and the Gemini API. I have built multiple full-stack applications using Python, JavaScript, Flask, and modern web technologies, and I enjoy combining creativity with technical skills to solve complex challenges. Beyond academics, I am deeply passionate about the arts — I love painting, experimenting with different art styles, dancing as a form of expression, reading a wide range of books, and traveling to explore new cultures and perspectives. My journey is driven by a desire to learn continuously and create technology that is meaningful, ethical, and human-centered."
  const payload = {
    contents: [{
      parts: [{
        text: `User_message:${userMessage}. Reply naturally to the usermessage and if required then answer based on: ${myDescription} or just simply give friendly reply and reply in a way that ${fullName} is herself talking. Reply in short sentences`
      }]
    }]
  };

  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC7-RM00asmKYnolN00DYs28eCrlMLCDU0", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t understand that.";
  } catch (err) {
    console.error("Error fetching Gemini response:", err);
    return "Oops! Something went wrong.";
  }
}
