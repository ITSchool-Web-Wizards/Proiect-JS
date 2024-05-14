const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('canvasSignature');
const context = canvas.getContext('2d');
// const pencilToolButton = document.getElementById('pencilTool');
const toolIcons = document.querySelectorAll('.tool-icon');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
brushWidth = 3;
//store drawing content
let drawingHistory = [];
let selectedTool = '';



window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

const draw = (event) => {
    if (!isDrawing || selectedTool !== 'pencilTool') return;

    // Store the scaled coordinates
    const x = event.offsetX * (canvas.width / window.innerWidth);
    const y = event.offsetY * (canvas.height / window.innerHeight);
    context.lineTo(x, y);
    context.stroke();
    // Draw on the canvas
    // if(selectedTool === 'pencilTool') {

    // } else if(selectedTool === 'rectangle'){
    //     drawRect(event);
    // }

    // Store drawing content
    drawingHistory.push({ x, y });
}

const startDrawing = (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
    // context.lineWidth = brushWidth;
    //creating a new path to draw
    // context.beginPath();
    // draw(event);
}

function stopDrawing() {
    isDrawing = false;
    context.beginPath();
}

function drawLine(event) {
    if (!isDrawing) return;

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    context.beginPath();
    context.moveTo(lastX, lastY);
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
            context.moveTo(x * (canvas.width / window.innerWidth), y * (canvas.height / window.innerHeight));
        } else {
            context.lineTo(x * (canvas.width / window.innerWidth), y * (canvas.height / window.innerHeight));
            context.stroke();
        }
    });

    // Restore the drawing history
    drawingHistory = tempHistory;
}

// Drawing events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
// Window resize event
window.addEventListener('resize', resizeCanvas);

// Call window resize function
resizeCanvas();

// Select Tools Events
toolIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        // const isSelected = this.classList.contains('selected');
        toolIcons.forEach(toolIcon => {
            toolIcon.classList.remove('selected');
        });
        this.classList.add('selected');
        selectedTool = this.id;
    })
})

const pencilToolButton = document.getElementById('pencilTool');


// pencilToolButton.addEventListener('click', function() {
//     let toolIcons = document.querySelectorAll('.tool-icon')
//     toolIcons.forEach(icon => icon.classList.remove('selected'));

//     this.classList.add('selected');

//     selectedTool = 'pencil';
//     context.globalCompositeOperation = 'source-over';
// })

const colorSwatches = document.querySelectorAll(".color-swatch")
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        context.strokeStyle = this.style.backgroundColor;
        selectedTool = 'pencil';
    })
})

// https://blog.openreplay.com/building-a-drawing-application-with-html5-canvas/
//  https://www.youtube.com/watch?v=y84tBZo8GFo&ab_channel=CodingNepal
// https://www.youtube.com/watch?v=6arkndScw7A&list=PLSxgVLtIB0IFmQGuVMSE_wDHPW5rq4Ik7&ab_channel=RedhwanNacef
// https://roughjs.com/