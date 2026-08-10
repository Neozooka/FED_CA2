// USED IN: nexos-shop.html

// ----------------------------------------------------------------
// ISO Picker Quiz
// ----------------------------------------------------------------

function openDownloadModal() {
    const modal = document.getElementById('download-modal');
    modal.classList.remove('hidden');
    resetDownloadModal();
}

function closeDownloadModal() {
    document.getElementById('download-modal').classList.add('hidden');
}

// Unified Framework text description
const hardwareDescriptions = {
    'desktop': '<strong>Desktop & HTPC Experience:</strong> Unlocks maximum desktop frame-pacing, raw GPU passthrough, and zero-latency display server hooks. Configured for multi-monitor setups, high-refresh rates, and couch TV setups.',
    'framework': '<strong>Framework Experience:</strong> NexOS is officially supported by Framework, with out-of-box support for all hardware models. Enjoy an enhanced d-GPU support on Framework 16 without the hassle. And if you are on <span class="font-bold">Framework Desktop</span>, enjoy the best home theatre PC when you switch to Apex Mode.',
    'other-laptop': '<strong>Laptop Experience:</strong> Features hybrid-GPU switching controls (MUX switch support), dynamic fan curves, and battery optimization profiles to keep heat low during high-load gaming sessions.',
    'steam-deck': '<strong>Steam Deck Experience:</strong> NexOS provides an alternative to SteamOS, with fine-tuned optimization, tailored audio drivers, and battery efficiency profiless designed for Valve&#39;s handheld architecture.',
    'onexplayer': '<strong>OneXPlayer Experience:</strong> As an official hardware supplier, OneXPlayer handhelds run beautifully on NexOS. Pre-configured with custom controller mapping support and power management profiles to maximize performance on high-resolution displays.',
    'legion-go': '<strong>Lenovo Legion Go Experience:</strong> Includes built-in support for native portrait display rotation, detachable controller bindings, and Legion Space hardware optimizations.',
    'rog-ally': '<strong>Asus ROG Ally Experience:</strong> Features dynamic TDP controls, optimized Armoury Crate compatibility layer, and enhanced power efficiency for both original and extended battery revisions.',
    'msi-handheld': '<strong>MSI Handheld Experience:</strong> Experience a fine-tuned version of NexOS designed for MSI Claw and Intel, with built-in trigger calibrration and MSI Center controller integration. Support may be limited.',
    'other-handheld': '<strong>Note: Intel may not function as intended.</strong> Generic handheld profile loading universal controller mappings, touchscreen layout optimizations, and balanced power profiles.',
    'vm': '<strong>VM Experience:</strong> Lightweight distribution footprint with full guest utilities pre-installed, disabled hardware-accelerated desktop bloat, and optimized virtual display drivers.'
};

const gpuCompatibilityDescriptions = {
    'legacy-nvidia': '<strong>Warning!</strong> Due to issues with drivers, we are unfortunately unable to get Apex Mode working at the moment for legacy GPUs. Stay tuned for a future update!',
    'legacy-amd': '<strong>Warning!</strong> Due to issues with drivers, we are unfortunately unable to get Apex Mode working at the moment for legacy GPUs. Stay tuned for a future update!',
    'legacy-intel': '<strong>Warning!</strong> Due to issues with drivers, we are unfortunately unable to get Apex Mode working at the moment for legacy GPUs. Stay tuned for a future update!'
};

function handleHardwareChange() {
    const hardware = document.getElementById('hardware-select').value;
    const gpuStep = document.getElementById('step-gpu');
    const gpuSelect = document.getElementById('gpu-select');
    const descBox = document.getElementById('hardware-description');
    const gpuBox = document.getElementById('gpu-support');
    
    // Reset GPU value and warning box
    gpuSelect.value = "";
    gpuBox.classList.add('hidden');
    gpuBox.innerHTML = '';

    // Render hardware description
    if (hardwareDescriptions[hardware]) {
        descBox.innerHTML = hardwareDescriptions[hardware];
        descBox.classList.remove('hidden');
    } else {
        descBox.classList.add('hidden');
        descBox.innerHTML = '';
    }

    // Show GPU step for Desktops, and Other Laptops
    if (hardware === 'desktop' || hardware === 'other-laptop' || hardware === 'vm') {
        gpuStep.classList.remove('hidden');
        gpuSelect.setAttribute('required', 'true');
        
        document.getElementById('step-newsletter').classList.add('hidden');
        document.getElementById('step-submit').classList.add('hidden');
    } else {
        // Direct handhelds or VMs to newsletter step
        gpuStep.classList.add('hidden');
        gpuSelect.removeAttribute('required');
        
        showNewsletterStep();
    }
}

function handleGpuChange() {
    const gpuVal = document.getElementById('gpu-select').value;
    const gpuBox = document.getElementById('gpu-support');

    if (gpuCompatibilityDescriptions[gpuVal]) {
        gpuBox.innerHTML = gpuCompatibilityDescriptions[gpuVal];
        gpuBox.classList.remove('hidden');
    } else {
        gpuBox.classList.add('hidden');
        gpuBox.innerHTML = '';
    }
    
    if (gpuVal) {
        showNewsletterStep();
    }
}

function resetDownloadModal() {
    document.getElementById('iso-config-form').reset();
    document.getElementById('step-gpu').classList.add('hidden');
    document.getElementById('step-newsletter').classList.add('hidden');
    document.getElementById('step-submit').classList.add('hidden');
    
    const descBox = document.getElementById('hardware-description');
    descBox.classList.add('hidden');
    descBox.innerHTML = '';

    const gpuBox = document.getElementById('gpu-support');
    gpuBox.classList.add('hidden');
    gpuBox.innerHTML = '';

    document.getElementById('gpu-select').removeAttribute('required');
}

function showNewsletterStep() {
    document.getElementById('step-newsletter').classList.remove('hidden');
    document.getElementById('step-submit').classList.remove('hidden');
}

function handleIsoDownload(event) {
    event.preventDefault();
    
    const hardware = document.getElementById('hardware-select').value;
    const gpu = document.getElementById('gpu-select').value || 'generic';
    const email = document.getElementById('newsletter-email').value;

    const isoFilename = `nexos-26.07-core-${hardware}-${gpu}.iso`;
    window.location.href = `/downloads/${isoFilename}`;
    
    closeDownloadModal();
}