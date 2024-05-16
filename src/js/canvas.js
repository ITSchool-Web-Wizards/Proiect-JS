const canvas = document.getElementById("canvasSignature");
const context = canvas.getContext("2d");
const toolIcons = document.querySelectorAll(".tool-icon");

let isDrawing = false;
brushWidth = 3;
//store drawing content
let drawingHistory = [];
let selectedTool = "";

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const draw = (event) => {
  if (!isDrawing) return;

  // Store the scaled coordinates
  const x = event.offsetX * (canvas.width / window.innerWidth);
  const y = event.offsetY * (canvas.height / window.innerHeight);

  // Draw on the canvas based on selected tool
  if (selectedTool === "pencilTool") {
    context.lineTo(x, y);
    context.stroke();
  } else if (selectedTool === "eraserTool") {
    // Use eraser by drawing with transparency
    context.clearRect(x - 5, y - 5, 10, 10); // Clear a small square area centered around (x, y)
  } else if ((selectedTool === "airbrushTool")) {
    // set the color and brush style
    context.stroke();
    // context.strokeWeigh = brushWidth;

    // find the speed of the mouse movement
    const speed =
      Math.abs(event.mouseX - event.pmouseX) +
      Math.abs(event.mouseY - event.pmouseY);

    // set minimum radius and spray density of spraypaint brush
    const minRadius = 10;
    const sprayDensity = 80;

    // find radius of the spray paint brush and radius squared
    const r = speed + minRadius;
    const rSquared = r * r;

    // set the number of times we lerp the points in the for loop
    const lerps = 10;

    // repeat the random points with lerping
    for (let i = 0; i < lerps; i++) {
      // find the lerped X and Y coordinates
      const lerpX = this.lerp(event.mouseX, event.pmouseX, i / lerps);
      const lerpY = this.lerp(event.mouseY, event.pmouseY, i / lerps);

      // draw a bunch of random points within a circle
      for (let j = 0; j < sprayDensity; j++) {
        // pick a random position within the circle
        const randX = random(-r, r);
        const randY = random(-1, 1) * sqrt(rSquared - randX * randX);

        // draw the random point
        point(lerpX + randX, lerpY + randY);
      }
    }
  }

  // Store drawing content
  drawingHistory.push({ x, y });
};

const startDrawing = (event) => {
  isDrawing = true;
  // context.lineWidth = brushWidth;
  //creating a new path to draw
  draw(event);
};

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

function resizeCanvas() {
  // Store the current drawing before resizing
  const tempHistory = drawingHistory;

  // Clear the canvas and resize it
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the stored drawing on the resized canvas
  drawingHistory.forEach(({ x, y }, index) => {
    if (index === 0) {
      context.beginPath();
      context.moveTo(
        x * (canvas.width / window.innerWidth),
        y * (canvas.height / window.innerHeight)
      );
    } else {
      context.lineTo(
        x * (canvas.width / window.innerWidth),
        y * (canvas.height / window.innerHeight)
      );
      context.stroke();
    }
  });

  // Restore the drawing history
  drawingHistory = tempHistory;
}

// Drawing events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
// Window resize event
window.addEventListener("resize", resizeCanvas);

// Call window resize function
resizeCanvas();

// Select Tools Events
toolIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    // const isSelected = this.classList.contains('selected');
    toolIcons.forEach((toolIcon) => {
      toolIcon.classList.remove("selected");
    });
    this.classList.add("selected");
    selectedTool = this.id;

    if (selectedTool !== "eraserTool") {
      context.globalCompositeOperation = "source-over";
    }
  });
});

// Events for tools
// pencil
const pencilTool = document.getElementById("pencilTool");
pencilTool.addEventListener("mousedown", function () {
  selectedTool = "pencilTool";
  context.globalCompositeOperation = "source-over";
});
//eraser
const eraserTool = document.getElementById("eraserTool");
eraserTool.addEventListener("click", function () {
  selectedTool = "eraserTool";
  context.globalCompositeOperation = "destination-out";
});
//brush
const brushTool = document.getElementById("brushTool");
brushTool.addEventListener("click", function () {
  selectedTool = "brushTool";
  context.globalCompositeOperation = "multiply";
});
//spray
const airbrushTool = document.getElementById("airbrushTool");
airbrushTool.addEventListener("click", function () {
  selectedTool = "airbrushTool";
  context.globalCompositeOperation = "source-over";
});

// https://blog.openreplay.com/building-a-drawing-application-with-html5-canvas/
//  https://www.youtube.com/watch?v=y84tBZo8GFo&ab_channel=CodingNepal
// https://www.youtube.com/watch?v=6arkndScw7A&list=PLSxgVLtIB0IFmQGuVMSE_wDHPW5rq4Ik7&ab_channel=RedhwanNacef
// https://roughjs.com/

// Brush
// https://dev.to/ascorbic/a-more-realistic-html-canvas-paint-tool-313b
