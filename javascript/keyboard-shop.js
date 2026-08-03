path = "../../javascript/products.json"

let cart = JSON.parse(localStorage.getItem("userCart")) || []

function loadProductsFromList(cart) {
    const priceTotal = document.getElementById("checkout-total-price")
    const numberItems = document.getElementById("checkout-item-count")
    const CartTemplate = document.querySelector("[cart-template]")
    const CartContainer = document.querySelector("[cart-container]")
    let cost = 0
    
    if (CartContainer && CartTemplate) {
        CartContainer.innerHTML = ""
        let index = 0
        cart.forEach(item => {
            const card = CartTemplate.content.cloneNode(true)
            const title = card.querySelector("[title]")
            const price = card.querySelector("[price]")
            const photo = card.querySelector("[cart-image] img") 
            const removeBtn = card.querySelector(".remove")
            const containerDiv = card.querySelector(".container")
            
            if (title) title.textContent = item.title
            if (price) price.textContent = "$" + item.price
            if (photo) photo.src = item.image
            cost += item.price
            
            if (containerDiv) containerDiv.setAttribute("id", item.title)
            if (removeBtn) removeBtn.setAttribute("id", index)
            
            CartContainer.appendChild(card)
            index += 1
        })

        if (numberItems) numberItems.textContent = index
        if (priceTotal) priceTotal.textContent = cost + ".00"
    }
}

function saveCart() {
    localStorage.setItem("userCart", JSON.stringify(cart))
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

/**
 * Toast Notification System
 * Displays a popup alert when a product is successfully added to the cart.
 */
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

async function addCart(id) {
    try {
        const response = await fetch(path)
        const products = await response.json()
        
        const matchedProduct = products.find(item => item.title === id)
        
        if (matchedProduct) {
            cart.push(matchedProduct)
            saveCart()
            
            // Format title for notification text
            const formattedName = matchedProduct.title.replace(/-/g, ' ');
            showToastNotification(formattedName);
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
}

function remove(index) {
    const arrayIndex = parseInt(index)
    
    if (typeof index === 'object' && index.closest) {
        const cardContainer = index.closest(".container")
        if (cardContainer) {
            cardContainer.remove()
        }
    }
    
    cart.splice(arrayIndex, 1)
    saveCart()
    loadProductsFromList(cart)
}

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
]

// Searchbar input functionality for shop page
const searchInput = document.getElementById("search") || (typeof search !== "undefined" ? search : null);
if (searchInput) {
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        let in_search = []
        shop_list.forEach(item => {
            let itemElement = document.getElementById(item)
            if (itemElement) {
                const show = itemElement.id.toLowerCase().includes(value)
                if (show) {
                    in_search.push(item)
                }
                itemElement.classList.toggle("hidden", !show)
            }
        })
        updateResultCount(in_search)
    })

    const currentCountEl = document.getElementById('current-count')
    const maxCountEl = document.getElementById('max-count')

    function updateResultCount(list) {
        if (currentCountEl) currentCountEl.textContent = list.length
        if (maxCountEl) maxCountEl.textContent = shop_list.length
    }
}

// Searchbar input functionality for cart checkout
const search2Input = document.getElementById("search2") || (typeof search2 !== "undefined" ? search2 : null);
if (search2Input) {
    search2Input.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        cart.forEach(item => {
            let itemElement = document.getElementById(item.title)
            if (itemElement) {
                const show = itemElement.id.toLowerCase().includes(value)
                itemElement.classList.toggle("hidden", !show)
            }
        })
    })
}

window.addEventListener("DOMContentLoaded", () => {
    loadProductsFromList(cart)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
})