'use client'
import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Trash2, DollarSign, ImageIcon, Package, CreditCard, CheckCircle, X } from 'lucide-react'
import { registerProduct, getProducts, addToCart, removeFromCart, getCart, getCartTotal, configureStripe, processStripePayment, type Product, type CartItem } from '@/lib/cms'
export function EcommerceBridge() {
  const [products, setProducts] = useState<Product[]>(() => getProducts())
  const [cart, setCart] = useState<CartItem[]>(() => getCart())
  const [showProductModal, setShowProductModal] = useState(false)
  const [stripeKey, setStripeKey] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    sku: '',
    inventory: 0
  })
  useEffect(() => {
    setProducts(getProducts())
    setCart(getCart())
  }, [])
  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) return
    registerProduct(newProduct)
    setProducts(getProducts())
    setNewProduct({ name: '', price: 0, description: '', image: '', sku: '', inventory: 0 })
    setShowProductModal(false)
  }
  const handleAddToCart = (productId: string) => {
    addToCart(productId)
    setCart(getCart())
  }
  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
    setCart(getCart())
  }
  const handleConfigureStripe = () => {
    if (!stripeKey) return
    configureStripe({ publishableKey: stripeKey })
    alert('Stripe configured!')
  }
  const handleCheckout = async () => {
    const total = getCartTotal()
    if (total <= 0) return
    const result = await processStripePayment(total)
    if (result.success) {
      alert(`Payment successful! Transaction ID: ${result.transactionId}`)
    } else {
      alert(`Payment failed: ${result.error}`)
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ShoppingCart size={20} />
            E-commerce Layer & Stripe Bridge
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage products, cart, and payment processing</p>
        </div>
        <button
          onClick={() => setShowProductModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Products</h3>
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="p-3 bg-gray-900 rounded-lg flex items-center gap-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-400">{product.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-green-400 flex items-center gap-1">
                        <DollarSign size={14} />
                        {product.price.toFixed(2)}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Package size={14} />
                        {product.inventory} in stock
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Package size={32} className="mx-auto mb-2" />
                  <p>No products yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <ShoppingCart size={16} />
              Cart ({cart.length} items)
            </h3>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="p-2 bg-gray-900 rounded flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Cart is empty</p>
              )}
            </div>
            {cart.length > 0 && (
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-green-400 font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Checkout with Stripe
                </button>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Stripe Configuration</h3>
            <input
              type="password"
              value={stripeKey}
              onChange={e => setStripeKey(e.target.value)}
              placeholder="pk_test_..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3"
            />
            <button
              onClick={handleConfigureStripe}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Configure Stripe
            </button>
          </div>
        </div>
      </div>
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Add New Product</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Inventory</label>
                  <input
                    type="number"
                    value={newProduct.inventory}
                    onChange={e => setNewProduct({ ...newProduct, inventory: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
              <button onClick={() => setShowProductModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name || newProduct.price <= 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
