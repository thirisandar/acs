document.addEventListener("DOMContentLoaded", () => {
    // 1. Master Examples Toggle Logic (Kept as is)
    const mainToggleBtn = document.getElementById("main-examples-toggle");
    const mainContent = document.getElementById("main-examples-content");

    if (mainToggleBtn && mainContent) {
        mainToggleBtn.addEventListener("click", () => {
            mainToggleBtn.classList.toggle("active");
            mainContent.classList.toggle("active");
        });
        // Set default state: The main toggle should start OPEN
        mainToggleBtn.classList.add("active");
        mainContent.classList.add("active");
    }


    // 2. Individual Example Accordion Logic (Kept as is)
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const targetId = header.getAttribute("data-example");
            const targetContent = document.getElementById(targetId);

            accordionHeaders.forEach(h => {
                if (h !== header) {
                    h.classList.remove("active");
                    document.getElementById(h.getAttribute("data-example")).classList.remove("active");
                }
            });

            targetContent.classList.toggle("active");
            header.classList.toggle("active");
        });
    });

    document.querySelectorAll(".accordion-content").forEach(content => content.classList.remove("active"));
    document.querySelectorAll(".accordion-header").forEach(header => header.classList.remove("active"));
    

    const generatePromptBtn = document.getElementById("generate-prompt-btn");

if (generatePromptBtn) {
// Must use 'async' because the translation process is asynchronous
generatePromptBtn.addEventListener("click", async (event) => {
    event.preventDefault(); 
    
    // 1. Retrieve the Burmese inputs
    const context_mm = document.getElementById("content-main").value;
    const persona_mm = document.getElementById("persona-main").value;
    const result_mm = document.getElementById("result-main").value;
    const format_mm = document.getElementById("format-main").value;
    
    // Combine all inputs into a single string for translation
    const fullBurmesePrompt = `${context_mm}${persona_mm}${result_mm}${format_mm}`;

    // Display a loading message
    generatePromptBtn.textContent = 'Translating and Generating...';
    generatePromptBtn.disabled = true;

    try {
        // 2. Call the new client-side translation function
        const final_prompt_en = await translateText(fullBurmesePrompt);

        // 3. Package the final result data
        const dataToSave = {
            success: true,
            source: 'text',
            context_mm: context_mm,
            persona_mm: persona_mm,
            result_mm: result_mm,
            format_mm: format_mm,
            // The dynamically translated result
            final_prompt_en: final_prompt_en
        };

        // 4. Save the data to localStorage
        localStorage.setItem('promptData', JSON.stringify(dataToSave));

        // Restore button state
        generatePromptBtn.textContent = '✅ Generate & View Prompt';
        generatePromptBtn.disabled = false;

        // 5. Redirect to the result page
        window.location.href = `result.html`;

    } catch (error) {
        // Restore button state and show alert
        generatePromptBtn.textContent = '❌ Translation Failed. Try Again.';
        generatePromptBtn.disabled = false;
        console.error('Translation Error:', error);
        alert('Client-Side Translation Error: ' + error.message + '. Please ensure your browser is connected to the internet.');
    }
});
}

// --- NEW: Client-Side Translation Helper Function ---
// This uses a non-official Google Translate endpoint that works well for quick tests.
function translateText(text) {
return new Promise((resolve, reject) => {
    if (!text) return resolve('');

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=my&tl=en&dt=t&q=${encodeURIComponent(text)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // The translation is usually the first element of the first array
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                const translatedText = data[0].map(segment => segment[0]).join('');
                resolve(translatedText);
            } else {
                reject(new Error("Translation API returned unexpected format."));
            }
        })
        .catch(error => {
            reject(new Error("Network or API call failed: " + error.message));
        });
});
}
// --- Clear Input Fields Logic (Kept as is) ---
const resetBtn = document.getElementById("reset-cprf-btn");

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        document.getElementById("content-main").value = '';
        document.getElementById("persona-main").value = '';
        document.getElementById("result-main").value = '';
        document.getElementById("format-main").value = '';
        
        document.getElementById("content-main").focus();
    });
}
});
