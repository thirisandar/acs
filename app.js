document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const burmeseTextarea = document.getElementById('burmeseText');
    const englishTextarea = document.getElementById('englishText');
    const copyButton = document.getElementById('copyBtn');
    const statusMessage = document.getElementById('statusMessage');
    const generateButtons = document.querySelectorAll('.button-group button');

    // --- API Configuration (USE YOUR SECURE BACKEND ENDPOINT HERE) ---
    // The Gemini API Key should be securely stored on your server (backend function), NOT here.
    const TRANSLATION_API_URL = 'https://YOUR-SECURE-SERVER-ENDPOINT.com/gemini-translate'; 
    
    // --- Utility Functions (autoExpandTextarea, showStatus, copyToClipboard remain the same) ---
    
    function autoExpandTextarea(element) {
        element.style.height = 'auto'; 
        element.style.height = (element.scrollHeight + 5) + 'px';
    }

    function showStatus(message, type) {
        // ... (function body remains the same) ...
        statusMessage.textContent = message;
        statusMessage.className = ''; 
        statusMessage.classList.add(type === 'success' ? 'status-success' : 'status-error');
        statusMessage.classList.remove('hidden');

        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 3000);
    }
    
    function copyToClipboard() {
        // ... (function body remains the same) ...
        if (!englishTextarea.value) {
            showStatus('Nothing to copy. Please generate a prompt first.', 'error');
            return;
        }

        navigator.clipboard.writeText(englishTextarea.value)
            .then(() => {
                copyButton.textContent = 'Copied!';
                showStatus('Successfully copied to clipboard!', 'success');
                setTimeout(() => {
                    copyButton.textContent = 'Copy Prompt';
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                showStatus('Error copying text. Please try selecting manually.', 'error');
            });
    }

    /**
     * Handles the translation and prompt generation using a secure backend
     * that calls the Gemini API.
     */
    async function translateAndGenerate(promptType, clickedButton) {
        const burmeseText = burmeseTextarea.value.trim();
        englishTextarea.value = ''; 
        englishTextarea.style.height = '150px'; 
        
        if (!burmeseText) {
            showStatus('Please enter Burmese text to translate.', 'error');
            return;
        }

        const originalButtonText = clickedButton.textContent;
        clickedButton.textContent = 'Generating...';
        generateButtons.forEach(btn => btn.disabled = true);

        try {
            // Send the Burmese text and the desired prompt type to your secure backend
            const response = await fetch(TRANSLATION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    burmese_text: burmeseText,
                    prompt_type: promptType // 'text', 'image', or 'video'
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Server error! Status: ${response.status}`);
            }

            const result = await response.json();
            
            // The result should contain the fully formatted English prompt from your backend
            const formattedPrompt = result.english_prompt;

            englishTextarea.value = formattedPrompt;
            autoExpandTextarea(englishTextarea); 

            showStatus(`Generation complete! Ready to use your ${promptType.toUpperCase()} prompt.`, 'success');

        } catch (error) {
            console.error('API Error:', error);
            englishTextarea.value = `Error: Could not generate prompt. Please check your secure backend status. Details: ${error.message}`;
            showStatus('An error occurred during generation.', 'error');
        } finally {
            clickedButton.textContent = originalButtonText;
            generateButtons.forEach(btn => btn.disabled = false);
        }
    }

    // --- Event Listeners ---
    burmeseTextarea.addEventListener('input', () => {
        autoExpandTextarea(burmeseTextarea);
    });
    
    autoExpandTextarea(burmeseTextarea); 

    generateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const promptType = event.currentTarget.dataset.promptType;
            translateAndGenerate(promptType, event.currentTarget);
        });
    });

    copyButton.addEventListener('click', copyToClipboard);
});