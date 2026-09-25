// JavaScript Logic
const processBtn = document.getElementById('processBtn');
const fileInput = document.getElementById('fileInput');
const statusBox = document.getElementById('statusMessage');

// The key (shift amount) for our simple Caesar Cipher encryption
const SHIFT_AMOUNT = 3;

processBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    const operation = document.querySelector('input[name="operation"]:checked').value;

    // Input Validation (I/O operations)
    if (!file) {
        showStatus("Please select a file first.", "error");
        return;
    }

    // Basic check to ensure it's a text file
    if (file.type !== "text/plain" && !file.name.endsWith('.txt')) {
        showStatus("Please upload a valid .txt file.", "error");
        return;
    }

    showStatus("Processing file...", "success");

    // File Handling: Use FileReader to read the contents of the text file
    const reader = new FileReader();

    reader.onload = function(event) {
        const originalText = event.target.result;
        let processedText = "";

        // String Manipulation & Encryption Algorithm
        if (operation === "encrypt") {
            processedText = encryptText(originalText, SHIFT_AMOUNT);
        } else {
            processedText = decryptText(originalText, SHIFT_AMOUNT);
        }

        // Save the result to a new file
        downloadResult(processedText, file.name, operation);
        showStatus(`File successfully ${operation}ed and downloaded!`, "success");
        
        // Reset the file input
        fileInput.value = '';
    };

    reader.onerror = function() {
        showStatus("Error reading the file.", "error");
    };

    // Read the file as text (Basic I/O operation)
    reader.readAsText(file);
});

// --- Encryption Functions (String Manipulation) ---

function encryptText(text, shift) {
    let result = "";
    // Loop through each character in the string
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        // Shift the ASCII value
        let shiftedCode = charCode + shift;
        result += String.fromCharCode(shiftedCode);
    }
    return result;
}

function decryptText(text, shift) {
    let result = "";
    // Loop through each character in the string
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        // Shift the ASCII value back
        let shiftedCode = charCode - shift;
        result += String.fromCharCode(shiftedCode);
    }
    return result;
}

// --- File Saving Function (Basic I/O operation) ---

function downloadResult(content, originalFilename, operation) {
    // Create a Blob (Binary Large Object) from the processed string
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    
    // Create a new filename (e.g., encrypted_myFile.txt)
    const prefix = operation === 'encrypt' ? 'encrypted_' : 'decrypted_';
    a.download = prefix + originalFilename;
    
    // Programmatically click the link to download the file
    document.body.appendChild(a);
    a.click();
    
    // Clean up by removing the temporary element and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Helper function to display status messages to the user
function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `status-box ${type}`;
}