// logic for real-time updates and visualization
const canvas = document.getElementById('pathCanvas');
const ctx = canvas.getContext('2d');
const currentCoordsDisplay = document.getElementById('current-coords');
// Set canvas size for a high-resolution display
const canvasWidth = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const padding = 50; // Padding from the canvas edges
let originLat = null;
let originLon = null;
const history = []; // to create trace of robodog path
// fetch data from the server and update the UI
async function updateCoordinates() {
    try {
        const response = await fetch('/data');
        const data = await response.json();

        if (data.length > 0) {
            const latest = data[data.length - 1];
            currentCoordsDisplay.textContent = `Lat: ${latest.latitude}, Lon: ${latest.longitude}`;

            // Update history and redraw
            history.length = 0; // Clear array
            history.push(...data);
            drawPath();
        }
    } catch (error) {
        console.error("Failed to fetch coordinates:", error);
    }
}
// Draw the path on the canvas
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    if (history.length === 0) return; // no data to display

    // dynamic scaling
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;
    history.forEach(point => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLon = Math.min(minLon, point.longitude);
        maxLon = Math.max(maxLon, point.longitude);
    });

    const latRange = maxLat - minLat;
    const lonRange = maxLon - minLon;

    // when there is no movement yet prevent division by zero
    const scalingFactor = Math.min(
        (canvasWidth - 2 * padding) / (lonRange || 1),
        (canvasHeight - 2 * padding) / (latRange || 1)
    );

    // --- Draw the dynamic grid background ---
    ctx.strokeStyle = 'rgba(78, 115, 142, 0.3)';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let lon = minLon; lon <= canvasWidth; lon += 0.0002) {
        const x = padding + (lon - minLon) * scalingFactor;
        // Skip lines outside the paintable area
        if (x > canvasWidth - padding) {
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvasHeight - padding);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let lat = minLat; lat <= canvasHeight; lat += 0.0002) {
        const y = canvasHeight - padding - (lat - minLat) * scalingFactor;
        // Skip lines outside the paintable area
        if (y < padding || y > canvasHeight - padding) {
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvasWidth - padding, y);
        ctx.stroke();
    }



    history.forEach((point, index) => {
        // Normalize coordinates relative to min values and scale to canvas pixels
        const relativeLon = (point.longitude - minLon);
        const relativeLat = (point.latitude - minLat);

        const x = padding + relativeLon * scalingFactor;
        const y = canvasHeight - padding - relativeLat * scalingFactor; // Y-axis is inverted 

        // Fade older points by adjusting opacity
        const opacity = (index + 1) / history.length;
        ctx.fillStyle = `rgba(37, 143, 255, ${opacity})`;

        // Draw a point on the canvas
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}
// Start fetch data every 3 seconds, wait 1 second first to allow server to start
setInterval(updateCoordinates, 3000);
setTimeout(updateCoordinates, 1000);
updateCoordinates(); 