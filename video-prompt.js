function translateText(text) {
    return new Promise((resolve, reject) => {
        if (!text) return resolve('');

        // Using the unofficial but effective endpoint for client-side translation
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=my&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extract translated segments and join them
                if (data && data[0] && data[0].length > 0) {
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
// --- END Translation Helper ---

document.addEventListener("DOMContentLoaded", () => {
    // [Keep all existing Accordion and Master Toggle logic here if present]
     // 1. Master Examples Toggle Logic (Keep original logic)
     const mainToggleBtn = document.getElementById("main-examples-toggle");
    const mainContent = document.getElementById("main-examples-content");

    if (mainToggleBtn && mainContent) {
        mainToggleBtn.addEventListener("click", () => {
            mainToggleBtn.classList.toggle("active");
            mainContent.classList.toggle("active");
        });
        mainToggleBtn.classList.add("active");
        mainContent.classList.add("active");
    }


    // 2. Individual Example Accordion Logic (Keep original logic)
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
        generatePromptBtn.addEventListener("click", async (event) => {
            event.preventDefault(); 
            
            // 1. Retrieve all seven input values (SSAELSA)
            const style_mm = document.getElementById("style-main").value;
            const subject_mm = document.getElementById("subject-main").value;
            const action_mm = document.getElementById("action-main").value;
            const environment_mm = document.getElementById("environment-main").value;
            const lighting_mm = document.getElementById("lighting-main").value;
            // Assuming you use these IDs for Scene Dynamics and Audio
            const camera_mm = document.getElementById("scene-main").value; 
            const audio_mm = document.getElementById("audio-main").value;

            
            // Combine inputs for translation. Use commas to separate concepts.
            const fullBurmesePrompt = `${style_mm}${subject_mm}${action_mm}${environment_mm}${lighting_mm}${camera_mm}${audio_mm}`;

            // Display a loading message
            generatePromptBtn.textContent = 'Translating and Generating...';
            generatePromptBtn.disabled = true;

            try {
                // 2. Call the client-side translation function
                const final_prompt_en = await translateText(fullBurmesePrompt);

                // 3. Package the final result data
                const dataToSave = {
                    success: true,
                    source: 'video', // **CRITICAL: Set source to 'video'**
                    
                    // Save original Burmese inputs for display on result page
                    style_mm: style_mm,
                    subject_mm: subject_mm,
                    action_mm: action_mm,
                    environment_mm: environment_mm,
                    lighting_mm: lighting_mm,
                    camera_mm: camera_mm, // Scene Dynamics
                    audio_mm: audio_mm,   // Audio
                    
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
                alert('Translation Error: ' + error.message + '. Please ensure your browser is connected to the internet.');
            }
        });
    }

    // --- NEW LOGIC: Clear Input Fields (Updated for 7 SSAELSA fields) ---
    const resetBtn = document.getElementById("reset-cprf-btn");

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            // Clear all seven SSAELSA input fields
            document.getElementById("style-main").value = '';
            document.getElementById("subject-main").value = '';
            document.getElementById("action-main").value = '';
            document.getElementById("environment-main").value = '';
            document.getElementById("lighting-main").value = '';
            document.getElementById("camera-main").value = ''; // Scene Dynamics
            document.getElementById("audio-main").value = '';   // Audio
            
            document.getElementById("style-main").focus();
        });
    }
});