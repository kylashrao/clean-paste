// Tab Switcher Logic
function switchTab(panelId) {
    // Hide all panels and remove active classes from buttons
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected panel
    document.getElementById(panelId).classList.add('active');

    // Highlight active button
    event.target.classList.add('active');
}

// 1. TEXT STRIPPER ACTIONS
function processText(actionType) {
    const rawInput = document.getElementById('text-input').value;
    let resultText = rawInput;

    if (actionType === 'clean') {
        // By default, assigning value into/out of a standard textarea strips deep rich-text/HTML structures.
        // We will normalize trailing whitespace variations here.
        resultText = rawInput.replace(/[ \t]+/g, ' ').trim();
    } else if (actionType === 'uppercase') {
        resultText = rawInput.toUpperCase();
    } else if (actionType === 'lowercase') {
        resultText = rawInput.toLowerCase();
    } else if (actionType === 'strip-emojis') {
        // Advanced Regex to sweep across Unicode emoji ranges
        resultText = rawInput.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '');
    }

    document.getElementById('text-output').value = resultText;
}

// 2. LINK STRIPPER LOGIC (Clears out tracking strings like ?utm_source=, ?fbclid=, etc.)
function cleanLink() {
    const dirtyUrlString = document.getElementById('link-input').value.trim();

    try {
        const urlObj = new URL(dirtyUrlString);

        // 1. Handle Amazon Product Links (e.g., amazon.in/dp/B0XXXXXXXX)
        if (urlObj.hostname.includes('amazon.') && urlObj.pathname.includes('/dp/')) {
            const patternMatch = urlObj.pathname.match(/\/dp\/[A-Z0-9]{10}/);
            if (patternMatch) {
                urlObj.pathname = patternMatch[0];
                urlObj.search = ""; // Completely deletes everything after the '?'
            }
        }
        // 2. Handle Amazon Browse/Category/Search Links (like your test link)
        else if (urlObj.hostname.includes('amazon.')) {
            // Grab the essential node ID if it exists in the URL
            const nodeId = urlObj.searchParams.get('node');

            // Clear absolutely ALL query parameters out completely
            urlObj.search = "";

            // If it was a browse/node link, re-attach ONLY the clean node ID back to it
            if (nodeId) {
                urlObj.searchParams.set('node', nodeId);
            }
        }
        // 3. Global sweep for standard marketing tokens on non-Amazon sites
        else {
            const trackingTokens = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'gclsrc', 's', 'feature', 'ref'];
            trackingTokens.forEach(token => {
                urlObj.searchParams.delete(token);
            });
        }

        // Output the flawless, clean link
        document.getElementById('link-output').value = urlObj.toString();
    } catch (e) {
        alert("Please paste a valid website URL (make sure it includes http:// or https://)");
    }
}

// GLOBAL CLIPBOARD COPY HELPER
function copyToClipboard(elementId) {
    const outputElement = document.getElementById(elementId);
    if (!outputElement.value) return;

    outputElement.select();
    outputElement.setSelectionRange(0, 99999); // Mobile compatibility

    navigator.clipboard.writeText(outputElement.value)
        .then(() => {
            const copyBtn = outputElement.nextElementSibling;
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied! ✓";
            copyBtn.style.backgroundColor = "#10b981"; // Turn green temporarily

            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.backgroundColor = "#38bdf8";
            }, 2000);
        })
        .catch(() => {
            alert("Failed to copy text automatically.");
        });
}
// Function to clear input and output text fields instantly
function clearPanel(panelType) {
    if (panelType === 'text') {
        document.getElementById('text-input').value = '';
        document.getElementById('text-output').value = '';
    } else if (panelType === 'link') {
        document.getElementById('link-input').value = '';
        document.getElementById('link-output').value = '';
    }
}