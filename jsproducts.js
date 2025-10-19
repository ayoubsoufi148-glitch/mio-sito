// Database prodotti
const products = [
    {
        id: 1,
        name: "MacBook Pro 14\"",
        category: "computer",
        price: 2249.00,
        originalPrice: 2499.00,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        description: "MacBook Pro con chip M2 Pro, 16GB RAM, 512GB SSD"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "smartphone",
        price: 1229.00,
        originalPrice: 1329.00,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        description: "iPhone 15 Pro 128GB, fotocamera avanzata, Titanio"
    },
    {
        id: 3,
        name: "Samsung Galaxy S24",
        category: "smartphone",
        price: 899.00,
        originalPrice: 999.00,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        description: "Samsung Galaxy S24 256GB, display 6.2\", 8GB RAM"
    },
    {
        id: 4,
        name: "iPad Air 5",
        category: "tablet",
        price: 749.00,
        originalPrice: 799.00,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        description: "iPad Air con chip M1, display 10.9\", 64GB"
    },
    {
        id: 5,
        name: "Dell XPS 13",
        category: "computer",
        price: 1299.00,
        originalPrice: 1499.00,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400",
        description: "Dell XPS 13, i7, 16GB RAM, 512GB SSD, display 13.4\""
    },
    {
        id: 6,
        name: "AirPods Pro",
        category: "accessori",
        price: 249.00,
        originalPrice: 279.00,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
        description: "AirPods Pro 2ª generazione, cancellazione attiva rumore"
    },
    {
        id: 7,
        name: "Samsung Galaxy Tab S9",
        category: "tablet",
        price: 849.00,
        originalPrice: 899.00,
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
        description: "Tablet Samsung 11\", 8GB RAM, 128GB, S-Pen inclusa"
    },
    {
        id: 8,
        name: "Apple Watch Series 9",
        category: "accessori",
        price: 429.00,
        originalPrice: 459.00,
        image: "https://images.unsplash.com/photo-1579586337278-3f436c8b2aac?w=400",
        description: "Apple Watch Series 9 45mm, GPS, alluminio"
    },
    {
        id: 9,
        name: "ASUS ROG Gaming PC",
        category: "computer",
        price: 1899.00,
        originalPrice: 2099.00,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400",
        description: "PC Gaming ASUS ROG, RTX 4070, i7, 32GB RAM, 1TB SSD"
    },
    {
        id: 10,
        name: "Google Pixel 8 Pro",
        category: "smartphone",
        price: 899.00,
        originalPrice: 999.00,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
        description: "Google Pixel 8 Pro 128GB, fotocamera professionale"
    },
    {
        id: 11,
        name: "Magic Keyboard",
        category: "accessori",
        price: 129.00,
        originalPrice: 149.00,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
        description: "Tastiera Apple Magic Keyboard con Touch ID"
    },
    {
        id: 12,
        name: "Microsoft Surface Pro 9",
        category: "tablet",
        price: 1199.00,
        originalPrice: 1299.00,
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
        description: "Surface Pro 9, i5, 8GB RAM, 256GB SSD"
    }
];

// Carrello
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funzione per formattare il prezzo
function formatPrice(price) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Funzione per calcolare lo sconto
function calculateDiscount(price, originalPrice) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// Funzione per creare la card prodotto
function createProductCard(product) {
    const discount = calculateDiscount(product.price, product.originalPrice);
    
    return `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                ${product.originalPrice ? `
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                ` : ''}
                ${formatPrice(product.price)}
                ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Aggiungi al Carrello
            </button>
        </div>
    `;
}

// Funzione per visualizzare i prodotti
function displayProducts(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = productsArray.map(product => 
        createProductCard(product)
    ).join('');
}

// Funzione per aggiungere al carrello
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    saveCartToLocalStorage();
    
    // Mostra notifica
    showNotification(`${product.name} aggiunto al carrello!`);
}

// Funzione per aggiornare il contatore del carrello
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Funzione per salvare il carrello nel localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Funzione per mostrare notifiche
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Filtri e ordinamento
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceSort = document.getElementById('priceSort');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }
    if (priceSort) {
        priceSort.addEventListener('change', filterAndSortProducts);
    }
}

function filterAndSortProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceSort = document.getElementById('priceSort');
    
    let filteredProducts = [...products];

    // Filtro per categoria
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryFilter.value
        );
    }

    // Ordinamento per prezzo
    if (priceSort && priceSort.value) {
        filteredProducts.sort((a, b) => {
            if (priceSort.value === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }

    displayProducts(filteredProducts, 'allProducts');
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Mostra prodotti in evidenza (primi 6)
    displayProducts(products.slice(0, 6), 'featuredProducts');
    
    // Mostra tutti i prodotti nella pagina prodotti
    displayProducts(products, 'allProducts');
    
    // Setup filtri
    setupFilters();
    
    // Aggiorna contatore carrello
    updateCartCount();
});