// Global state
let allData = [];
let filteredData = [];
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupEventListeners();
    performSearch();
});

// Load data from data.json
async function loadData() {
    try {
        const response = await fetch('data.json');
        allData = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('resultsList').innerHTML = 
            '<p style="color: red;">Error loading code archive. Please refresh.</p>';
    }
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const closeModal = document.getElementById('closeModal');
    const copyBtn = document.getElementById('copyBtn');
    const modal = document.getElementById('codeModal');

    // Search input
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // Focus search with /
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Clear search with Esc
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            performSearch();
        });
    });

    // Modal close
    closeModal.addEventListener('click', closeCodeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCodeModal();
    });

    // Copy code
    copyBtn.addEventListener('click', copyCode);
}

// Perform search and filter
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    filteredData = allData.filter(item => {
        // Apply language filter
        if (currentFilter !== 'all' && item.language !== currentFilter) {
            return false;
        }

        // Apply search filter
        if (!query) return true;

        const titleMatch = item.title.toLowerCase().includes(query);
        const languageMatch = item.language.toLowerCase().includes(query);
        const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(query));

        return titleMatch || languageMatch || tagMatch;
    });

    renderResults();
}

// Render results to the DOM
function renderResults() {
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');

    if (filteredData.length === 0) {
        resultsList.innerHTML = '<p style="grid-column: 1/-1; color: #999;">No results found. Try another search.</p>';
        resultsCount.textContent = '0 results';
        return;
    }

    resultsList.innerHTML = filteredData.map((item, index) => `
        <div class="result-card" data-index="${index}">
            <h3>${escapeHtml(item.title)}</h3>
            <span class="language">${escapeHtml(item.language)}</span>
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        </div>
    `).join('');

    resultsCount.textContent = `${filteredData.length} result${filteredData.length !== 1 ? 's' : ''}`;

    // Add click handlers to result cards
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            openCodeModal(filteredData[index]);
        });
    });
}

// Handle search keydown (Enter to open first result)
function handleSearchKeydown(e) {
    if (e.key === 'Enter' && filteredData.length > 0) {
        openCodeModal(filteredData[0]);
    }
}

// Open code modal and fetch code
async function openCodeModal(item) {
    const modal = document.getElementById('codeModal');
    const modalTitle = document.getElementById('modalTitle');
    const codeContent = document.getElementById('codeContent');
    const rawLink = document.getElementById('rawLink');

    modalTitle.textContent = `${item.title} (${item.language})`;
    rawLink.href = item.rawPath;

    // Fetch the raw code file
    try {
        const response = await fetch(item.rawPath);
        const code = await response.text();
        codeContent.textContent = code;
    } catch (error) {
        codeContent.textContent = `Error loading code: ${error.message}`;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close code modal
function closeCodeModal() {
    const modal = document.getElementById('codeModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Copy code to clipboard
async function copyCode() {
    const codeContent = document.getElementById('codeContent').textContent;
    try {
        await navigator.clipboard.writeText(codeContent);
        showNotification('Code copied to clipboard!');
    } catch (error) {
        console.error('Error copying code:', error);
        showNotification('Failed to copy code');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
