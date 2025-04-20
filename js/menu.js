let menuData = [];

async function fetchMenu() {
    try {
        // Show loading indicator
        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading menu items...</p>
            </div>`;

        // Check cache first
        const cachedData = localStorage.getItem('menuData');
        if (cachedData) {
            menuData = JSON.parse(cachedData);
            setupCategoryTabs();
            displayMenuItems(menuData[0].name);
            return;
        }

        const response = await fetch('https://raw.githubusercontent.com/jawadTamer/papa-johns-api/refs/heads/main/papa-johns-menu-en-expanded.json');
        const data = await response.json();
        
        menuData = data.categories;
        // Cache the data
        localStorage.setItem('menuData', JSON.stringify(menuData));
        
        setupCategoryTabs();
        displayMenuItems(menuData[0].name); 
    } catch (error) {
        console.error('Error fetching menu:', error);
        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = `
            <div class="col-12 text-center text-danger">
                <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                <h3>Error loading menu</h3>
                <p>Please try again later</p>
            </div>`;
    }
}

function setupCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    menuData.forEach((category, index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <a class="nav-link ${index === 0 ? 'active' : ''}" 
               href="#" 
               onclick="displayMenuItems('${category.name}'); return false;">
                ${category.name}
            </a>
        `;
        tabsContainer.appendChild(li);
    });
}

function displayMenuItems(categoryName) {
    // Update active tab
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.trim() === categoryName) {
            link.classList.add('active');
        }
    });

    // Display items
    const menuContainer = document.getElementById('menu-items');
    const category = menuData.find(cat => cat.name === categoryName);
    
    menuContainer.innerHTML = '';
    category.items.forEach((item, index) => {
        const isInWishlist = cart.wishlist.some(i => i.id === item.id);
        const itemCard = `
            <div class="col-md-4 menu-item mb-4" data-item-id="${item.id}" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card h-100 shadow-sm">
                    <div class="position-relative">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle ${isInWishlist ? 'active' : ''}" 
                                onclick='cart.addToWishlist(${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                            <i class="far fa-heart wishlist-heart ${isInWishlist ? 'active' : ''}"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text">
                            <i class="fas fa-tag text-primary me-2"></i>
                            <strong> ${item.price}</strong>
                        </p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <button class="btn btn-primary w-100" onclick='cart.addToCart(${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                            <i class="fas fa-shopping-cart me-2"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        menuContainer.innerHTML += itemCard;
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Replace click and keyup events with input event
    searchInput.addEventListener('input', performSearch);
    
    // Keep the button click event as backup
    searchButton.addEventListener('click', performSearch);

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            displayMenuItems(menuData[0].name);
            return;
        }

        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = '';
        
        let foundItems = [];
        menuData.forEach(category => {
            category.items.forEach(item => {
                if (item.name.toLowerCase().includes(query) || 
                    item.description.toLowerCase().includes(query)) {
                    foundItems.push(item);
                }
            });
        });

        if (foundItems.length === 0) {
            menuContainer.innerHTML = `
                <div class="col-12 text-center">
                    <h3 class="text-muted">No items found</h3>
                    <p>Try a different search term</p>
                </div>`;
            return;
        }

        foundItems.forEach((item, index) => {
            const isInWishlist = cart.wishlist.some(i => i.id === item.id);
            const itemCard = `
                <div class="col-md-4 menu-item mb-4" data-item-id="${item.id}" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="card h-100 shadow-sm">
                        <div class="position-relative">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                            <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle ${isInWishlist ? 'active' : ''}" 
                                    onclick='cart.addToWishlist(${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                                <i class="far fa-heart wishlist-heart ${isInWishlist ? 'active' : ''}"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${highlightText(item.name, query)}</h5>
                            <p class="card-text">${highlightText(item.description, query)}</p>
                            <p class="card-text">
                                <i class="fas fa-tag text-primary me-2"></i>
                                <strong>${item.price}</strong>
                            </p>
                            <button class="btn btn-primary w-100" onclick='cart.addToCart(${JSON.stringify(item).replace(/'/g, "&#39;")})'>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>`;
            menuContainer.innerHTML += itemCard;
        });

        // Add this line back to refresh AOS animations after search
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
}

// Add this to your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    fetchMenu();
    setupSearch();
});
