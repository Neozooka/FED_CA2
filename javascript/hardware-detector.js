document.addEventListener('DOMContentLoaded', function() {
    checkNexosProCompatibility();
});

function getCleanGpuName(rawGpuVendor) {
// Matches text between the first '(' and the next '(' or comma
    const regex = /ANGLE\s*\([^,]+,\s*(.*?)\s*(?:\(0x|Direct3D|OpenGL|Vulkan|vs_\d)/i;
    const match = rawGpuVendor.match(regex);
    
    if (!match) {
        return "Unknown GPU";
    }
    
    let gpuName = match[1].trim();
    
    return gpuName;
}

function checkNexosProCompatibility() {
    const badge = document.getElementById('status-badge');
    const cpuDetail = document.getElementById('cpu-detail');
    const ramDetail = document.getElementById('ram-detail');
    const gpuDetail = document.getElementById('gpu-detail');
    const summary = document.getElementById('status-summary');

    // Requirements Thresholds
    const minRamGB = 4;
    const recRamGB = 16;
    
    const minCores = 2;
    const recCores = 6;

    const cpuCores = navigator.hardwareConcurrency || "Unknown";
    const ramGB = navigator.deviceMemory || "Unknown";

    let rawGpuVendor = "Unknown";
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
            rawGpuVendor = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
    } catch (e) {
        rawGpuVendor = "Unavailable";
    }

    // Clean the extracted GPU string to get only the model name
    // Clean the extracted GPU string
    const cleanGpuName = getCleanGpuName(rawGpuVendor);

    console.log("Raw GPU:", rawGpuVendor);
    console.log("Clean GPU Name:", cleanGpuName);

    cpuDetail.innerText = cpuCores !== "Unknown" ? `${cpuCores} Threads` : "Undetected";
    ramDetail.innerText = ramGB !== "Unknown" ? `~${ramGB} GB` : "Undetected";
    gpuDetail.innerText = cleanGpuName !== "Unknown GPU" ? cleanGpuName : "Standard Adapter";

    let meetsMinimum = true;
    let meetsRecommended = true;
    let minFeedback = [];
    let recFeedback = [];

    // Check RAM
    if (ramGB !== "Unknown") {
        if (ramGB < minRamGB) {
            meetsMinimum = false;
            meetsRecommended = false;
            minFeedback.push(`RAM (~${ramGB} GB) is below the minimum 4 GB required.`);
        } else if (ramGB < recRamGB) {
            meetsRecommended = false;
            recFeedback.push(`RAM (~${ramGB} GB) meets minimum requirements (16 GB recommended for optimal multi-tasking).`);
        }
    }

    // Check CPU
    if (cpuCores !== "Unknown") {
        if (cpuCores < minCores) {
            meetsMinimum = false;
            meetsRecommended = false;
            minFeedback.push(`CPU core count (${cpuCores}) is below the minimum 2 cores required.`);
        } else if (cpuCores < recCores) {
            meetsRecommended = false;
            recFeedback.push(`CPU thread count (${cpuCores}) meets minimum specifications (6+ threads recommended).`);
        }
    }

    // Render Statuses
    if (meetsMinimum && meetsRecommended) {
        badge.className = "text-lg sm:text-xl md:text-3xl font-bold text-[--maingreen]";
        badge.innerText = "EXCEEDS RECOMMENDED SPECS";
        
        summary.innerHTML = `
            <p class="text-[--maingreen] text-sm sm:text-base md:text-lg font-semibold">Your hardware surpasses the recommended specs. You can fully utilize the features of NexOS.</p>
        `;
    } else if (meetsMinimum && !meetsRecommended) {
        badge.className = "text-lg sm:text-xl md:text-3xl font-bold text-yellow-400";
        badge.innerText = "MEETS MINIMUM REQUIREMENTS";
        
        summary.innerHTML = `
            <p class="text-yellow-400 text-sm sm:text-base md:text-lg font-semibold">Your hardware passes minimum requirements. Note that Apex Mode may not function properly.</p>
            ${recFeedback.map(item => `<p class="text-neutral-400 text-xs">${item}</p>`).join('')}
        `;
    } else {
        badge.className = "text-lg sm:text-xl md:text-3xl font-bold text-red-500";
        badge.innerText = "INSUFFICIENT HARDWARE";
        
        summary.innerHTML = `
            <p class="text-red-400 text-sm sm:text-base md:text-lg font-semibold">System falls below minimum baseline requirements:</p>
            ${minFeedback.map(item => `<p class="text-neutral-400 text-xs">${item}</p>`).join('')}
        `;
    }
}