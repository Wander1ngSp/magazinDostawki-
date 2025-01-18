// Данные о продуктах
const products = [
    {
        id: 1,
        name: 'Яблоки Голден',
        price: 32.50,
        category: 'Фрукты',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'
    },
    {
        id: 2,
        name: 'Бананы',
        price: 45.00,
        category: 'Фрукты',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'
    },
    {
        id: 3,
        name: 'Апельсины',
        price: 38.90,
        category: 'Фрукты',
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e'
    },
    {
        id: 4,
        name: 'Морковь',
        price: 15.50,
        category: 'Овощи',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'
    },
    {
        id: 5,
        name: 'Картофель',
        price: 22.00,
        category: 'Овощи',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655'
    },
    {
        id: 6,
        name: 'Помидоры',
        price: 48.90,
        category: 'Овощи',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
    },
    {
        id: 7,
        name: 'Огурцы',
        price: 35.00,
        category: 'Овощи',
        image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e'
    },
    {
        id: 8,
        name: 'Хлеб белый',
        price: 18.50,
        category: 'Хлебобулочные',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73'
    },
    {
        id: 9,
        name: 'Батон нарезной',
        price: 22.00,
        category: 'Хлебобулочные',
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    },
    {
        id: 10,
        name: 'Молоко 2.5%',
        price: 42.90,
        category: 'Молочные',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b'
    },
    {
        id: 11,
        name: 'Сыр Российский',
        price: 185.00,
        category: 'Молочные',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'
    },
    {
        id: 12,
        name: 'Йогурт натуральный',
        price: 28.50,
        category: 'Молочные',
        image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8'
    }
];

// Состояние приложения
let cart = [];
let balance = 0;

// Оптимизированная инициализация Lucide иконок
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderProducts(products);
    
    // Добавляем обработчики событий
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Оптимизированный поиск с debounce
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        }, 300);
    });
}

// Отображение продуктов с оптимизацией производительности
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    const fragment = document.createDocumentFragment();
    
    // Очищаем сетку
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    
    productsToRender.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price.toFixed(2)} ₴</p>
                <button onclick="addToCart(${product.id})" class="btn">
                    <i data-lucide="plus"></i>
                    В корзину
                </button>
            </div>
        `;
        fragment.appendChild(div);
    });
    
    grid.appendChild(fragment);
    lucide.createIcons();
}

// Оптимизированная работа с корзиной
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    const newQuantity = cart[itemIndex].quantity + delta;
    
    if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].quantity = newQuantity;
    }
    
    updateCartUI();
}

// Оптимизированное обновление UI корзины
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Обновляем счетчик товаров
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Обновляем содержимое корзины
    const fragment = document.createDocumentFragment();
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.price.toFixed(2)} ₴</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, -1)" class="btn">
                    <i data-lucide="minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="btn">
                    <i data-lucide="plus"></i>
                </button>
            </div>
        `;
        fragment.appendChild(div);
    });
    
    // Очищаем и обновляем корзину
    while (cartItems.firstChild) {
        cartItems.removeChild(cartItems.firstChild);
    }
    cartItems.appendChild(fragment);
    
    // Обновляем общую сумму
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
    
    lucide.createIcons();
}

// Оптимизированная работа с модальными окнами
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const isOpening = !modal.classList.contains('active');
    
    if (isOpening) {
        modal.style.display = 'flex';
        // Форсируем reflow
        modal.offsetHeight;
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Оптимизированная оплата
function checkout() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total > balance) {
        alert('Недостаточно средств на балансе');
        return;
    }
    
    balance -= total;
    cart = [];
    updateCartUI();
    document.getElementById('balanceAmount').textContent = balance.toFixed(2);
    toggleModal('cartModal');
    
    // Используем setTimeout для улучшения UX
    setTimeout(() => {
        alert('Заказ успешно оплачен!');
    }, 300);
}

// Оптимизированное пополнение баланса
function addBalance() {
    const input = document.querySelector('#balanceModal input');
    const amount = parseFloat(input.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }
    
    balance += amount;
    document.getElementById('balanceAmount').textContent = balance.toFixed(2);
    input.value = '';
    toggleModal('balanceModal');
}