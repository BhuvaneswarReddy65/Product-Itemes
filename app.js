const image =
  "https://res.cloudinary.com/dpielityo/image/upload/v1703244618/b6ehph3vqnkwqh7civw1.jpg";
const apiEndpoint = "https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093";
let products = [];

async function fetchData() {
  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    products = data.data;
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderProducts(products, searchKey) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.addEventListener("click", () =>
      handleProductClick(productCard)
    );

    const title = product.product_title.toLowerCase();
    const highlightedTitle = searchKey
      ? highlightMatch(title, searchKey)
      : product.product_title;

    productCard.innerHTML = `
      <div class="badge">${product.product_badge}</div>
      <img src="${image}" alt="${product.product_title}">
      <h3>${highlightedTitle}</h3>
      <div class="variants">
        ${product.product_variants
          .map((variant) => `<span>${Object.values(variant)}</span>`)
          .join("")}
      </div>
    `;

    productList.appendChild(productCard);
  });
}

function highlightMatch(title, searchKey) {
  const index = title.indexOf(searchKey);
  if (index !== -1) {
    const matchedPart = title.substr(index, searchKey.length);
    const beforeMatch = title.substr(0, index);
    const afterMatch = title.substr(index + searchKey.length);
    return `${beforeMatch}<span class="highlight">${matchedPart}</span>${afterMatch}`;
  }
  return title;
}

function handleProductClick(productCard) {
  document
    .querySelectorAll(".product-card")
    .forEach((card) => card.classList.remove("clicked"));
  productCard.classList.add("clicked");
}

function switchLayout(layout) {
  const productList = document.getElementById("productList");
  productList.className = layout === "grid" ? "grid-view" : "";

  document
    .querySelectorAll(".product-card")
    .forEach((card) => card.classList.remove("clicked"));
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchKey = this.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.product_title.toLowerCase().includes(searchKey)
  );
  renderProducts(filteredProducts, searchKey);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
