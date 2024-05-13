const canvasContainer = document.querySelector('.canvas-container');
const canvas = document.getElementById('canvasSignature');
const context = canvas.getContext('2d');
const pencilToolButton = document.getElementById('pencilTool');

let isDrawing = false;
brushWidth = 5;
//store drawing content
let drawingHistory = [];

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

const draw = (event) => {
    if (!isDrawing) return;
    
    // Store the scaled coordinates
    const x = event.offsetX * (canvas.width / window.innerWidth);
    const y = event.offsetY * (canvas.height / window.innerHeight);
    
    // Draw on the canvas
    context.lineTo(x, y);
    context.stroke();
    
    // Store drawing content
    drawingHistory.push({ x, y });
}

const startDrawing = (event) => {
    isDrawing = true;
    context.lineWidth = brushWidth;
    // context.beginPath();
    // draw(event);
}

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
pencilToolButton.addEventListener('click', function() {
    let toolIcons = document.querySelectorAll('.tool-icon')
    toolIcons.forEach(icon => icon.classList.remove('selected'));

    this.classList.add('selected');

    selectedTool = 'pencil';
    context.globalCompositeOperation = 'source-over';
})


// https://blog.openreplay.com/building-a-drawing-application-with-html5-canvas/
//  https://www.youtube.com/watch?v=y84tBZo8GFo&ab_channel=CodingNepal
// https://www.youtube.com/watch?v=6arkndScw7A&list=PLSxgVLtIB0IFmQGuVMSE_wDHPW5rq4Ik7&ab_channel=RedhwanNacef
// https://roughjs.com/