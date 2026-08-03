const path = "../../javascript/products.json"

let cart = JSON.parse(localStorage.getItem("userCart")) || []

// Ensure legacy carts without quantity default to quantity = 1
cart = cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
}))

function saveCart() {
    localStorage.setItem("userCart", JSON.stringify(cart))
}

function loadProductsFromList(cart) {
    const priceTotal = document.getElementById("checkout-total-price")
    const numberItems = document.getElementById("checkout-item-count")
    const CartTemplate = document.querySelector("[cart-template]")
    const CartContainer = document.querySelector("[cart-container]")
    
    if (!CartContainer || !CartTemplate) return

    let totalCost = 0
    let totalItemsCount = 0

    CartContainer.innerHTML = ""

    cart.forEach((item, index) => {
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

        // Populate card details
        containerDiv.dataset.index = index
        title.textContent = item.title
        price.textContent = "$" + itemTotalPrice.toFixed(2)
        photo.src = item.image
        quantityCount.textContent = itemQuantity

        // Attach quantity buttons event listeners
        btnDecrease.addEventListener("click", () => changeQuantity(index, -1))
        btnIncrease.addEventListener("click", () => changeQuantity(index, 1))
        btnRemove.addEventListener("click", () => removeItem(index))

        CartContainer.appendChild(card)
    })

    if (numberItems) numberItems.textContent = totalItemsCount
    if (priceTotal) priceTotal.textContent = "$" + totalCost.toFixed(2)
}

// Add item to cart or increase quantity if it already exists
async function addCart(id) {
    try {
        const response = await fetch(path)
        const products = await response.json()

        const matchedProduct = products.find(item => item.title === id)

        if (matchedProduct) {
            const existingItem = cart.find(item => item.title === id)

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1
            } else {
                cart.push({ ...matchedProduct, quantity: 1 })
            }

            saveCart()
            loadProductsFromList(cart)
        }
    } catch (error) {
        console.error("Error adding product to cart:", error)
    }
}

// Change quantity (+1 or -1)
function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + delta

        // If quantity reaches 0, remove item from cart
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1)
        }

        saveCart()
        loadProductsFromList(cart)
    }
}

// Remove entire item row from cart
function removeItem(index) {
    cart.splice(index, 1)
    saveCart()
    loadProductsFromList(cart)
}

// Shop page search bar
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

if (typeof search !== "undefined" && search !== null) {
    search.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        let in_search = []
        
        shop_list.forEach(item => {
            const itemElement = document.getElementById(item)
            if (itemElement) {
                const show = itemElement.id.toLowerCase().includes(value)
                if (show) in_search.push(item)
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

// Cart search bar (filters rendered DOM nodes directly)
if (typeof search2 !== "undefined" && search2 !== null) {
    search2.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        const CartContainer = document.querySelector("[cart-container]")
        
        if (!CartContainer) return

        const cardElements = CartContainer.querySelectorAll(".container")

        cardElements.forEach(card => {
            const titleEl = card.querySelector("[title]")
            const titleText = titleEl ? titleEl.textContent.toLowerCase() : ""
            const show = titleText.includes(value)
            
            card.classList.toggle("hidden", !show)
        })
    })
}

window.addEventListener("DOMContentLoaded", () => {
    loadProductsFromList(cart)
})