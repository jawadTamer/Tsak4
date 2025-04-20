class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.initializeUI();
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    }

    // Initializes the UI components for the cart and wishlist icons
    initializeUI() {
        const navIconsContainer = document.getElementById('nav-icons');
        if (!navIconsContainer) return;
        
        // Add cart icon
        const cartIcon = document.createElement('div');
        cartIcon.innerHTML = `
            <div class="cart-icon" onclick="cart.toggleCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="badge bg-danger cart-count">${this.cart.length}</span>
            </div>
        `;
        
        // Add wishlist icon
        const wishlistIcon = document.createElement('div');
        wishlistIcon.innerHTML = `
            <div class="wishlist-icon ms-3" onclick="cart.toggleWishlist()">
                <i class="fas fa-heart"></i>
                <span class="badge bg-danger wishlist-count">${this.wishlist.length}</span>
            </div>
        `;
        
        navIconsContainer.appendChild(cartIcon);
        navIconsContainer.appendChild(wishlistIcon);
    }

    // Adds an item to the cart
    addToCart(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.updateCartUI();
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart!',
            text: `${item.name} has been added to your cart`,
            showConfirmButton: false,
            timer: 1500
        });
    }

    // Removes an item from the cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    // Adds an item to the wishlist
    addToWishlist(item) {
        const existingItem = this.wishlist.find(i => i.id === item.id);
        if (existingItem) {
            this.removeFromWishlist(item.id);
            const heartBtn = document.querySelector(`[data-item-id="${item.id}"] .wishlist-heart`);
            if (heartBtn) {
                heartBtn.classList.remove('active');
            }
        } else {
            this.wishlist.push(item);
            this.saveWishlist();
            this.updateWishlistUI();
            const heartBtn = document.querySelector(`[data-item-id="${item.id}"] .wishlist-heart`);
            if (heartBtn) {
                heartBtn.classList.add('active');
            }
            Swal.fire({
                icon: 'success',
                title: 'Added to Wishlist!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    // Toggles the wishlist modal
    toggleWishlist() {
        const wishlistItems = this.wishlist.map(item => `
            <div class="wishlist-item d-flex justify-content-between align-items-center mb-2">
                <span>${item.name}</span>
                <button class="btn btn-sm btn-danger" 
                        onclick="cart.removeFromWishlist(${item.id})">Remove</button>
        </div>
        `).join('');
    
        Swal.fire({
            title: 'Your Wishlist',
            html: `
                <div class="wishlist-items">
                    ${wishlistItems || '<p>Your wishlist is empty</p>'}
                </div>
            `,
            confirmButtonText: 'Close'
        });
    }

    // Removes an item from the wishlist
    removeFromWishlist(itemId) {
        this.wishlist = this.wishlist.filter(item => item.id !== itemId);
        this.saveWishlist();
        this.updateWishlistUI();
        const heartBtn = document.querySelector(`[data-item-id="${itemId}"] .wishlist-heart`);
        if (heartBtn) {
            heartBtn.classList.remove('active');
        }
    }

    // Updates the quantity of an item in the cart
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            }
            this.saveCart();
            this.updateCartUI();
        }
    }

    // Searches items based on a query
    searchItems(query) {
        const allItems = menuData.flatMap(category => category.items);
        return allItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filters items by price range
    filterByPrice(minPrice, maxPrice) {
        const allItems = menuData.flatMap(category => category.items);
        return allItems.filter(item => 
            item.price >= minPrice && item.price <= maxPrice
        );
    }

    // Calculates the total price of items in the cart
    getTotal() {
        return this.cart.reduce((total, item) => 
            total + (item.price * (item.quantity || 1)), 0
        ).toFixed(2);
    }

    // Saves the cart to local storage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Saves the wishlist to local storage
    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    // Toggles the cart modal
    toggleCart() {
        const cartModalId = 'cart-modal-content';
        const cartItems = this.cart.map(item => `
            <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                <span>${item.name} (x${item.quantity})</span>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2" 
                            onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) + 1}); cart.refreshCartModal('${cartModalId}')">+</button>
                    <button class="btn btn-sm btn-outline-primary me-2" 
                            onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) - 1}); cart.refreshCartModal('${cartModalId}')">-</button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="cart.removeFromCart(${item.id}); cart.refreshCartModal('${cartModalId}')">×</button>
                </div>
            </div>
        `).join('');

        Swal.fire({
            title: 'Your Cart',
            html: `
                <div id="${cartModalId}">
                    <div class="cart-items">
                        ${cartItems || '<p>Your cart is empty</p>'}
                        ${this.cart.length ? `<hr><h5>Total: $${this.getTotal()}</h5>` : ''}
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Checkout',
            cancelButtonText: 'Close',
            showConfirmButton: this.cart.length > 0
        });
    }

    // Refreshes the cart modal UI
    refreshCartModal(modalId) {
        const container = document.getElementById(modalId);
        if (container) {
            const cartItems = this.cart.map(item => `
                <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name} (x${item.quantity})</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-2" 
                                onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) + 1}); cart.refreshCartModal('${modalId}')">+</button>
                        <button class="btn btn-sm btn-outline-primary me-2" 
                                onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) - 1}); cart.refreshCartModal('${modalId}')">-</button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="cart.removeFromCart(${item.id}); cart.refreshCartModal('${modalId}')">×</button>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="cart-items">
                    ${cartItems || '<p>Your cart is empty</p>'}
                    ${this.cart.length ? `<hr><h5>Total: $${this.getTotal()}</h5>` : ''}
                </div>
            `;

            const confirmButton = document.querySelector('.swal2-confirm');
            if (confirmButton) {
                confirmButton.style.display = this.cart.length > 0 ? 'inline-block' : 'none';
            }
        }
    }

    // Refreshes the wishlist modal UI
    refreshWishlistModal(modalId) {
        const container = document.getElementById(modalId);
        if (container) {
            const wishlistItems = this.wishlist.map(item => `
                <div class="wishlist-item d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name}</span>
                    <button class="btn btn-sm btn-danger" 
                            onclick="cart.removeFromWishlist(${item.id}); cart.refreshWishlistModal('${modalId}')">Remove</button>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="wishlist-items">
                    ${wishlistItems || '<p>Your wishlist is empty</p>'}
                </div>
            `;
        }
    }

    // Updates the cart UI
    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    // Updates the wishlist UI
    updateWishlistUI() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
        }

        document.querySelectorAll('[data-item-id]').forEach(item => {
            const itemId = parseInt(item.getAttribute('data-item-id'));
            const heartBtn = item.querySelector('.wishlist-heart');
            if (heartBtn) {
                if (this.wishlist.some(i => i.id === itemId)) {
                    heartBtn.classList.add('active');
                } else {
                    heartBtn.classList.remove('active');
                }
            }
        });
    }
}

// Create global cart instance
const cart = new ShoppingCart();