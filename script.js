// Get DOM elements
const canvas = document.getElementById("splashCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const opacity = document.getElementById("opacity");
const generateSplash = document.getElementById("generateSplash");
const clearCanvas = document.getElementById("clearCanvas");
let splashHistory = [];
let undoHistory = [];

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Helper function to generate random number
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate paint splash
function drawSplash() {
  // Set color, size, and opacity
  const splashColor = colorPicker.value;
  const splashSize = brushSize.value;
  const splashOpacity = opacity.value;

  ctx.globalAlpha = splashOpacity;

  // Create random splatter pattern
  for (let i = 0; i < 10; i++) {
    const x = getRandomInt(0, canvas.width);
    const y = getRandomInt(0, canvas.height);
    const radius = getRandomInt(splashSize / 2, splashSize);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = splashColor;
    ctx.fill();
    ctx.closePath();

    // Add random drips
    if (Math.random() > 0.7) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + getRandomInt(-20, 20), y + getRandomInt(20, 100));
      ctx.strokeStyle = splashColor;
      ctx.lineWidth = getRandomInt(2, 5);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

// Event listener to generate a paint splash
generateSplash.addEventListener("click", () => {
  drawSplash();
});

// Event listener to clear the canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
// Extend the existing JavaScript functionality

// Store previous splashes for undo/redo

// Extended helper to generate random color gradient
function generateGradient(ctx, x, y, radius) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"]; // Customize as needed
  gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
  gradient.addColorStop(1, colors[Math.floor(Math.random() * colors.length)]);
  return gradient;
}

// Function to draw splash with a gradient
function drawSplash() {
  const splashColor = colorPicker.value;
  const splashSize = brushSize.value;
  const splashOpacity = opacity.value;

  ctx.globalAlpha = splashOpacity;

  for (let i = 0; i < 10; i++) {
    const x = getRandomInt(0, canvas.width);
    const y = getRandomInt(0, canvas.height);
    const radius = getRandomInt(splashSize / 2, splashSize);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = generateGradient(ctx, x, y, radius); // Use gradient instead of solid color
    ctx.fill();
    ctx.closePath();

    // Random drips with physics
    if (Math.random() > 0.7) {
      const dripX = x + getRandomInt(-20, 20);
      const dripY = y + getRandomInt(20, 100);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(dripX, dripY);
      ctx.strokeStyle = splashColor;
      ctx.lineWidth = getRandomInt(2, 5);
      ctx.stroke();
      ctx.closePath();
    }
  }

  // Save the current canvas state to the history for undo
  saveCanvasState();
}

// Function to save canvas state for undo/redo
function saveCanvasState() {
  splashHistory.push(canvas.toDataURL());
}

// Undo function
function undoSplash() {
  if (splashHistory.length > 1) {
    undoHistory.push(splashHistory.pop()); // Save to undo history
    const prevImage = new Image();
    prevImage.src = splashHistory[splashHistory.length - 1];
    prevImage.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(prevImage, 0, 0);
    };
  }
}

// Redo function
function redoSplash() {
  if (undoHistory.length > 0) {
    const redoImage = new Image();
    redoImage.src = undoHistory.pop();
    redoImage.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(redoImage, 0, 0);
    };
    splashHistory.push(redoImage.src); // Add back to history
  }
}

// Event listeners for Undo and Redo
document.getElementById("undo").addEventListener("click", undoSplash);
document.getElementById("redo").addEventListener("click", redoSplash);
