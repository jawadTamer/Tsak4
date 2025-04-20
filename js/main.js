// Fetch featured pizzas from the API
async function fetchFeaturedPizzas() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/jawadTamer/papa-johns-api/refs/heads/main/papa-johns-menu-en-expanded.json');
        const data = await response.json();
        
        const pizzas = data.categories.find(category => category.name === "Pizzas").items;
        
        const featuredContainer = document.getElementById('featured-pizzas');
        pizzas.slice(0, 3).forEach(pizza => {
            const isInWishlist = cart.wishlist.some(i => i.id === pizza.id);
            const pizzaCard = `
            <div class="col-md-4 menu-item mb-4" data-item-id="${pizza.id}">
                <div class="card h-100 shadow-sm">
                    <div class="position-relative">
                        <img src="${pizza.image}" class="card-img-top" alt="${pizza.name}">
                        <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle ${isInWishlist ? 'active' : ''}" 
                                onclick='cart.addToWishlist(${JSON.stringify(pizza).replace(/'/g, "&#39;")})'>
                            <i class="far fa-heart wishlist-heart ${isInWishlist ? 'active' : ''}"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${pizza.name}</h5>
                        <p class="card-text">${pizza.description}</p>
                        <p class="card-text">
                            <i class="fas fa-tag text-primary me-2"></i>
                            <strong>${pizza.price}</strong>
                        </p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <button class="btn btn-primary w-100" onclick='cart.addToCart(${JSON.stringify(pizza).replace(/'/g, "&#39;")})'>
                            <i class="fas fa-shopping-cart me-2"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
            featuredContainer.innerHTML += pizzaCard;
        });
    } catch (error) {
        console.error('Error fetching featured pizzas:', error);
    }
}

// Add this function to populate the carousel
async function populateCarousel() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/jawadTamer/papa-johns-api/refs/heads/main/papa-johns-menu-en-expanded.json');
        const data = await response.json();
        
        const pizzas = data.categories.find(category => category.name === "Pizzas").items;
        const carouselContainer = document.getElementById('carousel-container');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        // Add indicators
        pizzas.forEach((_, index) => {
            const indicator = `
                <button type="button" 
                    data-bs-target="#pizzaCarousel" 
                    data-bs-slide-to="${index}" 
                    ${index === 0 ? 'class="active" aria-current="true"' : ''} 
                    aria-label="Slide ${index + 1}">
                </button>
            `;
            indicatorsContainer.innerHTML += indicator;
        });
        
        // Add carousel items
        pizzas.forEach((pizza, index) => {
            const carouselItem = `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <div class="carousel-content">
                        <img src="${pizza.image || 'images/default-pizza.jpg'}" class="d-block w-100" alt="${pizza.name}">
                        <div class="carousel-overlay"></div>
                        <div class="carousel-text">
                            <h2 class="pizza-name">${pizza.name}</h2>
                            <p class="pizza-description">${pizza.description}</p>
                            <p class="pizza-price">EGP ${pizza.price}</p>
                        </div>
                    </div>
                </div>
            `;
            carouselContainer.innerHTML += carouselItem;
        });
    } catch (error) {
        console.error('Error populating carousel:', error);
    }
}


async function initializePage() {
    await populateCarousel();
    await fetchFeaturedPizzas();
}

// Add this function to handle active navigation
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Get the href and clean it up for comparison
        const href = link.getAttribute('href');
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Compare current page with link href
        if (currentPage === href) {
            link.classList.add('active');
        }
    });
}

// Add this to your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});

initializePage();