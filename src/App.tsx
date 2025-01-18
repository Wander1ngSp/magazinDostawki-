import React, { useState } from 'react';
import { Search, ShoppingCart, UserPlus, Wallet, Plus, Minus, Store } from 'lucide-react';

// Типы данных
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  // Состояния
  const [showCart, setShowCart] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Продукты
  const products: Product[] = [
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
    // Добавьте больше продуктов здесь...
  ];

  // Функции для работы с корзиной
  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart =>
      currentCart.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Фильтрация продуктов по поиску
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <header className="bg-yellow-400 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Store className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Продуктовый магазин</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="px-4 py-2 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowRegister(true)}
              className="bg-white px-4 py-2 rounded-full flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Регистрация
            </button>
            
            <button
              onClick={() => setShowBalance(true)}
              className="bg-white px-4 py-2 rounded-full flex items-center"
            >
              <Wallet className="h-5 w-5 mr-2" />
              {balance} ₴
            </button>
            
            <button
              onClick={() => setShowCart(true)}
              className="bg-white px-4 py-2 rounded-full flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Корзина ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-xl font-bold mt-2">{product.price} ₴</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-yellow-400 text-white rounded-full py-2 flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-yellow-400 mt-8 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">О нас</h3>
              <p>Мы предлагаем свежие продукты высокого качества по доступным ценам.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Контакты</h3>
              <p>Телефон: +380 XX XXX XX XX</p>
              <p>Email: info@product-store.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Адрес</h3>
              <p>ул. Примерная, 123</p>
              <p>г. Киев, Украина</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Корзина</h2>
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 mx-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>{item.price} ₴</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-xl font-bold">
                Итого: {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)} ₴
              </p>
              <button
                onClick={() => setShowCart(false)}
                className="bg-yellow-400 text-white px-6 py-2 rounded-full"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Пароль</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 text-white py-2 rounded-full"
              >
                Зарегистрироваться
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 w-full border border-yellow-400 text-yellow-400 py-2 rounded-full"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Пополнение баланса</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Сумма</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <button
                onClick={() => setShowBalance(false)}
                className="w-full bg-yellow-400 text-white py-2 rounded-full"
              >
                Пополнить
              </button>
              <button
                onClick={() => setShowBalance(false)}
                className="w-full border border-yellow-400 text-yellow-400 py-2 rounded-full"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;