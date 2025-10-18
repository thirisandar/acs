document.addEventListener('DOMContentLoaded', () => {
    const detailsDiv = document.getElementById('original-inputs-details'); // New details div
    const finalPromptPre = document.getElementById('final-prompt');
    const title = document.getElementById('page-title');

    // *** CRITICAL FIX: Read the correct key 'promptData' ***
    const dataJSON = localStorage.getItem('promptData'); 
    const data = dataJSON ? JSON.parse(dataJSON) : null;

    if (data && data.final_prompt_en) {
        title.textContent = "✅ Dynamic Prompt Translation Complete";

        // --- Dynamic Rendering Logic ---
        let innerHTML = '';
        
        if (data.source === 'text') {
            title.textContent = "📝 Text Prompt Result (CPRF)";
            // CPRF Fields: c, p, r, f
            innerHTML = `
                <div class="cprf-section" style="--primary-color: var(--primary-blue);"><strong>Context (C):</strong> ${data.context_mm}</div>
                <div class="cprf-section" style="--primary-color: var(--primary-blue);"><strong>Persona (P):</strong> ${data.persona_mm}</div>
                <div class="cprf-section" style="--primary-color: var(--primary-blue);"><strong>Result (R):</strong> ${data.result_mm}</div>
                <div class="cprf-section" style="--primary-color: var(--primary-blue);"><strong>Format (F):</strong> ${data.format_mm}</div>
            `;
        } else if (data.source === 'image') {
            title.textContent = "🖼️ Image Prompt Result (SSAEL)";
            // SSAEL Fields: style, subject, action, environment, lighting
            innerHTML = `
                <div class="cprf-section" style="--primary-color: #ffc107;"><strong>Style (S):</strong> ${data.style_mm}</div>
                <div class="cprf-section" style="--primary-color: #ffc107;"><strong>Subject (S):</strong> ${data.subject_mm}</div>
                <div class="cprf-section" style="--primary-color: #ffc107;"><strong>Action (A):</strong> ${data.action_mm}</div>
                <div class="cprf-section" style="--primary-color: #ffc107;"><strong>Environment (E):</strong> ${data.environment_mm}</div>
                <div class="cprf-section" style="--primary-color: #ffc107;"><strong>Lighting (L):</strong> ${data.lighting_mm}</div>
            `;
        } else if (data.source === 'video') {
            title.textContent = "🎥 Video Prompt Result (SSAELSA)";
            // SSAELSA Fields: style, subject, action, environment, lighting, camera, audio
            innerHTML = `
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Style (S):</strong> ${data.style_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Subject (S):</strong> ${data.subject_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Action (A):</strong> ${data.action_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Environment (E):</strong> ${data.environment_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Lighting (L):</strong> ${data.lighting_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Scene Dynamics (S):</strong> ${data.camera_mm}</div>
                <div class="cprf-section" style="--primary-color: #dc3545;"><strong>Audio (A):</strong> ${data.audio_mm}</div>
            `;
        } else {
             title.textContent = "❓ Unknown Prompt Type";
             innerHTML = `<p>The prompt source could not be identified.</p>`;
        }

        // Inject the generated input HTML
        detailsDiv.innerHTML = innerHTML;

        // Display the final translated English prompt
        finalPromptPre.textContent = data.final_prompt_en;
        
        localStorage.removeItem('promptData'); // Clean up the storage

    } else {
        // Error Case
        title.textContent = "❌ Error: Prompt Data Missing";
        detailsDiv.innerHTML = `<p>Prompt data could not be retrieved. Please go back to the dashboard and select an editor.</p>`;
        finalPromptPre.textContent = "Error: Translation result not found. Please check the browser console and ensure your Vercel serverless function is running.";
    }
});

function copyPrompt() {
    const promptText = document.getElementById('final-prompt').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        alert('English Prompt copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy prompt.');
    });
}