// Quagga.js Barcode scanner setup
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#video')  // Or '#yourElement' (optional)
    },
    decoder: {
        readers: ["code_128_reader"] // Adjust based on barcode type
    }
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    Quagga.start();
});

// Listen for detected barcodes
Quagga.onDetected(function(data) {
    let code = data.codeResult.code;
    addScannedCode(code);
});

// Add scanned barcode to the modal
function addScannedCode(code) {
    const ul = document.getElementById('barcode-list');
    const li = document.createElement('li');
    li.innerHTML = `
        <span>Barcode: ${code}</span>
        <button onclick="adjustQuantity(this, -1)">-</button>
        <span class="quantity">1</span>
        <button onclick="adjustQuantity(this, 1)">+</button>
        <button onclick="removeItem(this)">Delete</button>
    `;
    ul.appendChild(li);
}

// Adjust quantity
function adjustQuantity(button, change) {
    const quantityElem = button.parentElement.querySelector('.quantity');
    let quantity = parseInt(quantityElem.textContent);
    quantity += change;
    if (quantity < 1) quantity = 1;
    quantityElem.textContent = quantity;
}

// Remove item
function removeItem(button) {
    const li = button.parentElement;
    li.remove();
}

// Drag functionality for modal
const modal = document.getElementById('barcode-modal');
let isDragging = false;
let startX, startY, initialX, initialY;

modal.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = modal.offsetLeft;
    initialY = modal.offsetTop;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        modal.style.left = initialX + dx + 'px';
        modal.style.top = initialY + dy + 'px';
    }
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
