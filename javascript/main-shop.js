const path = "../../javascript/shop-products.json"


// Payment.html stuff

let totalCost = 0
let isApplied = false
let currentDiscount = 0 // Track applied discount amount

const VALID_PROMOS = [{
    "code": "HUATAH61",
    "promo": 10
}]

function checkPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase()
    const priceTotal = document.getElementById("checkout-total-price")

    if (isApplied) {
        alert('A promo code has already been applied!')
        return
    }

    for (let i = 0; i < VALID_PROMOS.length; i++) {
        if (code === VALID_PROMOS[i]["code"]) {
            currentDiscount = VALID_PROMOS[i]["promo"]
            totalCost = Math.max(0, totalCost - currentDiscount)
            isApplied = true
            alert('APPLIED!')
            if (priceTotal) {
                priceTotal.textContent = totalCost.toFixed(2)
            }
            return
        } 
    }
    alert('INVALID PROMO CODE!')
}

// Loading products for payment.html

function loadProductsFromList(cartList) {
    const priceTotal = document.getElementById("checkout-total-price")
    const numberItems = document.getElementById("checkout-item-count")
    const CartTemplate = document.querySelector("[data-cart-template]")
    const CartContainer = document.querySelector("[data-cart-container]")

    // Reset total before recalculating
    totalCost = 0

    if (!CartContainer) {
        return
    }

    // Handle Empty Cart State
    if (!cartList || cartList.length === 0) {
        CartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <h3 class="text-xl font-semibold text-white mb-1">Your cart is empty</h3>
                <p class="text-sm text-gray-400 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
            </div>
        `

        if (numberItems) {
            numberItems.textContent = "0"
        }
        if (priceTotal) {
            priceTotal.textContent = "0.00"
        }

        const checkoutBtn = document.getElementById("checkout-button")
        if (checkoutBtn) {
            checkoutBtn.disabled = true
            checkoutBtn.classList.add("opacity-50", "cursor-not-allowed")
        }
        return
    }

    const checkoutBtn = document.getElementById("checkout-button")
    if (checkoutBtn) {
        checkoutBtn.disabled = false
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed")
    }

    if (!CartTemplate) {
        return
    }

    let totalItemsCount = 0
    CartContainer.innerHTML = ""

    cartList.forEach((item, index) => {
        const itemQuantity = item.quantity || 1
        const itemTotalPrice = item.price * itemQuantity

        totalCost += itemTotalPrice
        totalItemsCount += itemQuantity

        const card = CartTemplate.content.cloneNode(true)
        const containerDiv = card.querySelector(".container")
        const title = card.querySelector("[title]")
        const price = card.querySelector("[price]")
        const photo = card.querySelector("[cart-image] img")
        const quantityCount = card.querySelector("[quantity-count]")
        
        const btnDecrease = card.querySelector(".quantity-decrease")
        const btnIncrease = card.querySelector(".quantity-increase")
        const btnRemove = card.querySelector(".remove")

        if (containerDiv) {
            containerDiv.setAttribute("id", `cart-item-${index}`)
        }
        if (title) {
            title.textContent = item.title
        }
        if (price) {
            price.textContent = "$" + itemTotalPrice.toFixed(2)
        }
        if (photo) {
            photo.src = item.image;
            photo.alt = item.title;
        }
        if (quantityCount) {
            quantityCount.textContent = itemQuantity
        }

        // Attach event listeners
        if (btnDecrease) {
            btnDecrease.addEventListener("click", () => changeQuantity(index, -1))
        }
        if (btnIncrease) {
            btnIncrease.addEventListener("click", () => changeQuantity(index, 1))
        }
        if (btnRemove) {
            btnRemove.addEventListener("click", () => remove(index))
        }

        CartContainer.appendChild(card)
    })

    if (isApplied) {
        totalCost = Math.max(0, totalCost - currentDiscount)
    }

    if (numberItems) {
        numberItems.textContent = totalItemsCount
    }

    if (priceTotal) {
        priceTotal.textContent = totalCost.toFixed(2)
    }
}



// Searchbar input functionality for cart checkout
const search2Input = document.getElementById("search2") || (typeof search2 !== "undefined" ? search2 : null)
if (search2Input) {
    search2Input.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        const CartContainer = document.querySelector("[data-cart-container]")
        if (!CartContainer) return

        const cartCards = CartContainer.querySelectorAll(".container")
        cartCards.forEach(card => {
            const titleEl = card.querySelector("[title]")
            const titleText = titleEl ? titleEl.textContent.toLowerCase() : ""
            const show = titleText.includes(value)
            card.classList.toggle("hidden", !show)
        })
    })
}

// Initializer
window.addEventListener("DOMContentLoaded", () => {
    loadProductsFromList(cart);
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});







// Cart stuff




// Creates the cart

let cart = JSON.parse(localStorage.getItem("userCart")) || []

cart = cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
}))

function saveCart() {
    localStorage.setItem("userCart", JSON.stringify(cart))
    if (typeof updateCartCount === 'function') {
        updateCartCount()
    }
}

// Shows what you ordered after clicking

function showToastNotification(productName) {
    let container = document.getElementById('toast-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'toast-container'
        container.className = 'fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none'
        document.body.appendChild(container)
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 bg-neutral-900 border border-[var(--maingreen,#22c55e)] text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-5 opacity-0'
    toast.innerHTML = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--maingreen,#22c55e)]/20 text-[var(--maingreen,#22c55e)]">
            <i class="fa fa-shopping-bag text-sm"></i>
        </div>
        <div class="flex flex-col">
            <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Added to Cart</span>
            <span class="text-sm font-medium text-white line-clamp-1 max-w-[220px]">${productName}</span>
        </div>
    `

    container.appendChild(toast)

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-5', 'opacity-0')
    })

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2')
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

// Add cart using JSON file and input from shop

async function addCart(id) {
    
    try {
        const response = await fetch(path)
        const products = await response.json()
        
        const matchedProduct = products.find(item => item.title === id)
        console.log(products.find(item => item.title === id))
        if (matchedProduct) {

            const existingItem = cart.find(item => item.title === id)

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1
            } else {
                cart.push({ ...matchedProduct, quantity: 1 })
            }

            saveCart();
            
            // Format title for toast notification
            const formattedName = matchedProduct.title.replace(/-/g, ' ')
            showToastNotification(formattedName)
        }
    } catch (error) {
        console.error("Error adding product to cart:", error)
    }
}

// Tweeks the quantity

function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + delta

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1)
        }

        saveCart()
        loadProductsFromList(cart)
    }
}

// Removes item from page

function remove(index) {
    const arrayIndex = parseInt(index)
    if (!isNaN(arrayIndex) && cart[arrayIndex]) {
        cart.splice(arrayIndex, 1)
        saveCart()
        loadProductsFromList(cart)
    }
}






// MAINLY FOR SHOP-MAIN






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
    "nexus-gateron-baby-kangaroo-2.0-tactile-switches",
    "nexus-gateron-pro-3.0-yellow-linear-switches",
    "nexus-python-v2-gaming-mouse-30k-dpi-54g-optical-gen-3-switches",
    "nexos-pro-26-07",
    "nexos-spectre-gaming-headset-50mm-drivers-clearcast-microphone",
    "nexos-hunter-gaming-keyboard-1000hz-polling"
]

const searchInput = document.getElementById("search") || (typeof search !== "undefined" ? search : null);

// Search input for mainshop

if (searchInput) {

    searchInput.addEventListener("input", e => {

        const value = e.target.value.toLowerCase()

        let in_search = []

        shop_list.forEach(item => {

            let itemElement = document.getElementById(item);

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

let productsList = []

//Loading the products from JSON

async function loadProducts() {
    try {
        const response = await fetch(path) // Update path to match your JSON file location
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        productsList = await response.json()

        // Initial render and sort setup

        loadingProductShop(productsList)
        productSort(productsList)

    } catch (error) {
        console.error("Failed to load products from JSON:", error)
    }
}

//Loading onto the template and creating child elements

function loadingProductShop(products) {
    const gridContainer = document.getElementById("product-grid")
    const cardTemplate = document.getElementById("product-card-template")

    if (!gridContainer || !cardTemplate) {
        return
    }

    // Clear existing grid items
    gridContainer.innerHTML = ""

    products.forEach((product) => {
        const card = cardTemplate.content.cloneNode(true)
        const cardRoot = card.querySelector(".product-card")
        const title = card.querySelector("[data-title]")
        const price = card.querySelector("[data-price]")
        const image = card.querySelector("[data-image]")
        const btnAddCart = card.querySelector("[data-add-cart]")
        const btnBuyNow = card.querySelector("[data-buy-now]")


        if (cardRoot) {
            cardRoot.id = product.title
        }
        

        if (title) {
            title.textContent = product.title
        }
        if (price) {
            price.textContent = "$" + product.price
        }
        if (image) {
            image.src = product.image
            image.alt = product.title
        }

        if (btnAddCart) {
            btnAddCart.addEventListener("click", (e) => {
                addCart(product.title)
            })
        }

        if (btnBuyNow) {
            btnBuyNow.addEventListener("click", (e) => {
                // If buy now also adds to cart before redirecting
                addCart(product.title)
            })
        }

        gridContainer.appendChild(card);
    });
}

// Sorting function

function productSort(products) {
    const sortSelect = document.getElementById("sort-select")
    if (!sortSelect) return

    sortSelect.addEventListener("change", (e) => {
        const sortValue = e.target.value
        let sortedProducts = [...products]

        if (sortValue === "low-high") {
            sortedProducts.sort((a, b) => a.price - b.price)
        } else if (sortValue === "high-low") {
            sortedProducts.sort((a, b) => b.price - a.price)
        }

        loadingProductShop(sortedProducts)
    })
}

// Initialize on load

document.addEventListener("DOMContentLoaded", () => {
    loadingProductShop(productsList)
    productSort(productsList)
})

document.addEventListener("DOMContentLoaded", loadProducts)