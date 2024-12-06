// Barcode Tracking Application

class BarcodeTrackingApp {
    constructor() {
        // Initialize pages from local storage or empty array
        this.pages = JSON.parse(localStorage.getItem('barcodePages')) || [];
        
        // DOM Elements
        this.pagesContainer = document.getElementById('pagesContainer');
        this.addPageBtn = document.getElementById('addPageBtn');
        this.newPageModal = new bootstrap.Modal(document.getElementById('newPageModal'));
        this.pageDetailModal = new bootstrap.Modal(document.getElementById('pageDetailModal'));
        this.newPageNameInput = document.getElementById('newPageNameInput');
        this.confirmNewPageBtn = document.getElementById('confirmNewPageBtn');
        this.simulateBarcodeBtn = document.getElementById('simulateBarcodeBtn');
        this.pageDetailTitle = document.getElementById('pageDetailTitle');
        this.pageDetailContent = document.getElementById('pageDetailContent');

        // Current active page
        this.currentPage = null;

        // Initialize event listeners
        this.initEventListeners();

        // Render existing pages
        this.renderPages();
    }

    initEventListeners() {
        // Add Page Button
        this.addPageBtn.addEventListener('click', () => this.newPageModal.show());

        // Confirm New Page Button
        this.confirmNewPageBtn.addEventListener('click', () => this.createNewPage());

        // Simulate Barcode Button
        this.simulateBarcodeBtn.addEventListener('click', () => this.simulateBarcodeScan());
    }

    createNewPage() {
        const pageName = this.newPageNameInput.value.trim();
        
        if (!pageName) {
            alert('Lütfen bir sayfa adı girin');
            return;
        }

        // Check if page name already exists
        if (this.pages.some(page => page.name === pageName)) {
            alert('Bu isimde bir sayfa zaten var');
            return;
        }

        // Create new page object
        const newPage = {
            id: Date.now(), // Unique identifier
            name: pageName,
            barcodes: [] // Array to store barcodes
        };

        // Add to pages array
        this.pages.push(newPage);

        // Save to local storage
        this.savePages();

        // Render pages
        this.renderPages();

        // Clear input and close modal
        this.newPageNameInput.value = '';
        this.newPageModal.hide();
    }

    renderPages() {
        // Clear existing pages
        this.pagesContainer.innerHTML = '';

        // Render each page
        this.pages.forEach(page => {
            const pageCard = document.createElement('div');
            pageCard.classList.add('col-12', 'col-md-4', 'col-lg-3');
            var pageTotalProducs = page.name * page.barcodes.length;
            if(isNaN(pageTotalProducs)){
                pageTotalProducs = 0;
            }
            pageCard.innerHTML = `
                <div class="page-card p-3 text-center" data-page-id="${page.id}">
                    <h3>${page.name}</h3>
                    <p>${page.barcodes.length} Okutulan Barkod</p>
                    <p>${pageTotalProducs} Toplam Ürün</p>
                </div>
            `;

            // Add click event to open page details
            pageCard.addEventListener('click', () => this.openPageDetails(page));

            this.pagesContainer.appendChild(pageCard);
        });
    }

    openPageDetails(page) {
        // Set current page
        this.currentPage = page;

        // Update modal title
        this.pageDetailTitle.textContent = page.name;

        // Render page barcodes
        this.renderPageBarcodes();

        // Show page detail modal
        this.pageDetailModal.show();
    }

    renderPageBarcodes() {
        // Clear previous content
        this.pageDetailContent.innerHTML = '';

        // Create barcode list container
        const barcodeList = document.createElement('div');
        barcodeList.classList.add('barcode-list');

        // If no barcodes, show message
        if (this.currentPage.barcodes.length === 0) {
            barcodeList.innerHTML = '<p class="text-center text-muted">Henüz barkod eklenmedi</p>';
        } else {
            // Render each barcode
            this.currentPage.barcodes.forEach((barcode, index) => {
                const barcodeItem = document.createElement('div');
                barcodeItem.classList.add('barcode-item');
                barcodeItem.innerHTML = `
                    <span>${barcode.number}</span>
                    <small class="text-muted">${barcode.timestamp}</small>
                `;
                barcodeList.appendChild(barcodeItem);
            });
        }

        this.pageDetailContent.appendChild(barcodeList);
    }

    simulateBarcodeScan() {
        // Validate current page
        if (!this.currentPage) {
            alert('Önce bir sayfa seçin');
            return;
        }

        // Generate random barcode
        const barcodeNumber = this.generateRandomBarcode();
        const timestamp = this.getCurrentTimestamp();

        // Create barcode object
        const newBarcode = {
            number: barcodeNumber,
            timestamp: timestamp
        };

        // Add to current page's barcodes
        this.currentPage.barcodes.push(newBarcode);

        // Update local storage
        this.savePages();

        // Re-render page barcodes
        this.renderPageBarcodes();
    }

    generateRandomBarcode() {
        // Generate a random 13-digit barcode
        return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    }

    getCurrentTimestamp() {
        const now = new Date();
        return now.toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    savePages() {
        // Save pages to local storage
        localStorage.setItem('barcodePages', JSON.stringify(this.pages));
    }
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.barcodeApp = new BarcodeTrackingApp();

    const closePageButton = document.querySelector("#closePageButton");
    closePageButton.addEventListener("click", () =>{
        window.barcodeApp = new BarcodeTrackingApp();
    })
});