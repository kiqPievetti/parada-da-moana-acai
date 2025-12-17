const acaiState = {
    size: null,
    base: null,
    addons: [],
    total: 0
};

const sizeButtons = document.querySelectorAll(".step:nth-child(1) .option");
const totalPriceEl = document.getElementById("total-price");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        acaiState.size = {
            label: button.innerText,
            price: Number(button.dataset.price)
        };

        calculateTotal();
    });
});

const baseButtons = document.querySelectorAll(".step:nth-child(2) .option");

baseButtons.forEach(button => {
    button.addEventListener("click", () => {
        baseButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        acaiState.base = button.innerText;
    });
});

const addonInputs = document.querySelectorAll(".addon input");

addonInputs.forEach(input => {
    input.addEventListener("change", () => {
        const addon = {
            name: input.parentElement.innerText.trim(),
            price: Number(input.dataset.price)
        };

        if (input.checked) {
            acaiState.addons.push(addon);
        } else {
            acaiState.addons = acaiState.addons.filter(
                item => item.name !== addon.name
            );
        }

        calculateTotal();
    });
});

function calculateTotal() {
    let total = 0;

    if (acaiState.size) {
        total += acaiState.size.price;
    }

    acaiState.addons.forEach(addon => {
        total += addon.price;
    });

    acaiState.total = total;

    updateUI();
}

function updateUI() {
    totalPriceEl.innerText = acaiState.total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const addToCartBtn = document.querySelector(".summary .btn-primary");

addToCartBtn.addEventListener("click", () => {
    if (!acaiState.size || !acaiState.base) {
        alert("Escolha o tamanho e a base do açaí 🍧");
        return;
    }

    console.log("Açaí montado:", acaiState);
});

const cartState = {
    items: [],
    total: 0
};

addToCartBtn.addEventListener("click", () => {
    if (!acaiState.size || !acaiState.base) {
        alert("Escolha o tamanho e a base do açaí 🍧");
        return;
    }

    cartState.items.push(structuredClone(acaiState));
    updateCart();
    resetBuilder();
});

function resetBuilder() {
    document.querySelectorAll(".option, .addon input").forEach(el => {
        el.classList.remove("active");
        if (el.type === "checkbox") el.checked = false;
    });

    acaiState.size = null;
    acaiState.base = null;
    acaiState.addons = [];
    acaiState.total = 0;

    updateUI();
}

const cartItemsEl = document.querySelector(".cart-items");
const cartTotalEl = document.getElementById("cart-total");

function updateCart() {
    cartItemsEl.innerHTML = "";
    cartState.total = 0;

    cartState.items.forEach((item, index) => {
        cartState.total += item.total;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-item-header">
                <strong>${item.size.label}</strong>
                <button class="remove-btn" data-index="${index}">✕</button>
            </div>
            <p>${item.base}</p>
            <small>${item.addons.map(a => a.name).join(", ") || "Sem adicionais"}</small>
            <span>${item.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}</span>
        `;

        cartItemsEl.appendChild(div);
    });

    cartTotalEl.innerText = cartState.total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    attachRemoveEvents();
}

function attachRemoveEvents() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            cartState.items.splice(index, 1);
            updateCart();
        });
    });
}

const CART_KEY = "acai_cart";

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartState));
}

function loadCart() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        cartState.items = data.items || [];
        cartState.total = data.total || 0;
        updateCart();
    }
}
saveCart();
showFeedback();

document.addEventListener("DOMContentLoaded", loadCart);
const feedbackEl = document.getElementById("cart-feedback");

function showFeedback() {
    feedbackEl.classList.add("show");
    setTimeout(() => {
        feedbackEl.classList.remove("show");
    }, 1500);
}


