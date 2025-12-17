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


