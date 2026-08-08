const path = "../../javascript/shop-products.json";

let cart = JSON.parse(localStorage.getItem("userCart")) || [];
cart = cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
}));

function saveCart() {
    localStorage.setItem("userCart", JSON.stringify(cart));
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}


function showToastNotification(productName) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 bg-neutral-900 border border-[var(--maingreen,#22c55e)] text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-5 opacity-0';
    toast.innerHTML = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--maingreen,#22c55e)]/20 text-[var(--maingreen,#22c55e)]">
            <i class="fa fa-shopping-bag text-sm"></i>
        </div>
        <div class="flex flex-col">
            <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Added to Cart</span>
            <span class="text-sm font-medium text-white line-clamp-1 max-w-[220px]">${productName}</span>
        </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-5', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function loadProductsFromList(cartList) {
    const priceTotal = document.getElementById("checkout-total-price");
    const numberItems = document.getElementById("checkout-item-count");
    const CartTemplate = document.querySelector("[cart-template]");
    const CartContainer = document.querySelector("[cart-container]");

    if (!CartContainer) {
        return;
    }

    // Handle Empty Cart State
    if (!cartList || cartList.length === 0) {
        CartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        
                <h3 class="text-xl font-semibold text-white mb-1">Your cart is empty</h3>
                <p class="text-sm text-gray-400 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
            </div>
        `;

        if (numberItems) { 
            numberItems.textContent = "0";
        }
        if (priceTotal) { 
            priceTotal.textContent = "0.00";
        }

        // Optional: Disable checkout button if present
        const checkoutBtn = document.getElementById("checkout-button");
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
        }
        return;
    }

    // Enable checkout button if items are in cart
    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    if (!CartTemplate) return;

    let totalCost = 0;
    let totalItemsCount = 0;

    CartContainer.innerHTML = "";

    cartList.forEach((item, index) => {
        const itemQuantity = item.quantity || 1;
        const itemTotalPrice = item.price * itemQuantity;

        totalCost += itemTotalPrice;
        totalItemsCount += itemQuantity;

        const card = CartTemplate.content.cloneNode(true);
        const containerDiv = card.querySelector(".container");
        const title = card.querySelector("[title]");
        const price = card.querySelector("[price]");
        const photo = card.querySelector("[cart-image] img");
        const quantityCount = card.querySelector("[quantity-count]");
        
        const btnDecrease = card.querySelector(".quantity-decrease");
        const btnIncrease = card.querySelector(".quantity-increase");
        const btnRemove = card.querySelector(".remove");

        if (containerDiv) { 
            containerDiv.setAttribute("id", `cart-item-${index}`);
        }
        if (title) { 
            title.textContent = item.title;
        }
        if (price) { 
            price.textContent = "$" + itemTotalPrice.toFixed(2);
        }
        if (photo) { 
            photo.src = item.image;
        }

        if (quantityCount) {
            quantityCount.textContent = itemQuantity;
        }

        if (btnDecrease) {
            btnDecrease.addEventListener("click", () => changeQuantity(index, -1));
        }
        if (btnIncrease) {
            btnIncrease.addEventListener("click", () => changeQuantity(index, 1));
        }
        if (btnRemove) {
            btnRemove.addEventListener("click", () => remove(index));
        }

        CartContainer.appendChild(card);
    });

    if (numberItems) {
        numberItems.textContent = totalItemsCount;
    }

    if (priceTotal) {
        priceTotal.textContent = totalCost.toFixed(2);
    }
}


async function addCart(id) {
    try {
        const response = await fetch(path);
        const products = await response.json();
        
        const matchedProduct = products.find(item => item.title === id);
        
        if (matchedProduct) {
            const existingItem = cart.find(item => item.title === id);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...matchedProduct, quantity: 1 });
            }

            saveCart();
            
            // Format title for toast notification
            const formattedName = matchedProduct.title.replace(/-/g, ' ');
            showToastNotification(formattedName);
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
}


function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + delta;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        saveCart();
        loadProductsFromList(cart);
    }
}

function remove(index) {
    const arrayIndex = parseInt(index);
    if (!isNaN(arrayIndex) && cart[arrayIndex]) {
        cart.splice(arrayIndex, 1);
        saveCart();
        loadProductsFromList(cart);
    }
}

// Shop Product List
const shop_list = [
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable",
    "nexus-single-monitor-arm-gas-spring-desk-mount-usb-ports",
    "nexus-usb-condenser-microphone-studio-quality-gain-control",
    "nexus-gaming-monitor-27-inch-4k-oled-240hz-ultra-fast",
    "nexus-lochness-gaming-headset-50mm-drivers-clearcast-microphone",
    "nexus-python-ultra-light-gaming-mouse-26k-dpi-59g-optical-switches",
    "nexus-kailh-box-jade-clicky-mechanical-switches",
    "nexus-clear-glass-gaming-mousepad-450x400mm-ultra-smooth",
    "nexus-gateron-baby-kangaroo-2-0-tactile-switches",
    "nexus-gateron-pro-3-0-yellow-linear-switches",
    "nexus-python-v2-gaming-mouse-30k-dpi-54g-optical-gen-3-switches"
];

// Searchbar input functionality for shop page
const searchInput = document.getElementById("search") || (typeof search !== "undefined" ? search : null);
if (searchInput) {
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        let in_search = [];
        shop_list.forEach(item => {
            let itemElement = document.getElementById(item);
            if (itemElement) {
                const show = itemElement.id.toLowerCase().includes(value);
                if (show) {
                    in_search.push(item);
                }
                itemElement.classList.toggle("hidden", !show);
            }
        });
        updateResultCount(in_search);
    });

    const currentCountEl = document.getElementById('current-count');
    const maxCountEl = document.getElementById('max-count');

    function updateResultCount(list) {
        if (currentCountEl) currentCountEl.textContent = list.length;
        if (maxCountEl) maxCountEl.textContent = shop_list.length;
    }
}

// Searchbar input functionality for cart checkout
const search2Input = document.getElementById("search2") || (typeof search2 !== "undefined" ? search2 : null);
if (search2Input) {
    search2Input.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        const CartContainer = document.querySelector("[cart-container]");
        if (!CartContainer) return;

        const cartCards = CartContainer.querySelectorAll(".container");
        cartCards.forEach(card => {
            const titleEl = card.querySelector("[title]");
            const titleText = titleEl ? titleEl.textContent.toLowerCase() : "";
            const show = titleText.includes(value);
            card.classList.toggle("hidden", !show);
        });
    });
}

// Initializer
window.addEventListener("DOMContentLoaded", () => {
    loadProductsFromList(cart);
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});