
import { useEffect,
 useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState(() => {
  try {
    const savedProducts = localStorage.getItem('stokpilot-products')

    if (savedProducts !== null) {
      return JSON.parse(savedProducts)
    }
  } catch (error) {
    console.error('Ürünler yüklenemedi:', error)
  }

  return [
    { id: 1, name: 'A4 Kağıt', category: 'Ofis', stock: 120, minStock: 50 },
    { id: 2, name: 'Toner', category: 'Ofis', stock: 8, minStock: 10 },
    { id: 3, name: 'Ambalaj Kutusu', category: 'Ambalaj', stock: 200, minStock: 50 },
  ]
})

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [minStock, setMinStock] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  useEffect(() => {
  localStorage.setItem('stokpilot-products', JSON.stringify(products))
}, [products])

  const lowStock = products.filter(p => p.stock <= p.minStock)

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !category.trim() || stock === '' || minStock === '') {
      alert('Lütfen tüm alanları doldur.')
      return
    }

    const product = {
      id: editingId ?? Date.now(),
      name: name.trim(),
      category: category.trim(),
      stock: Number(stock),
      minStock: Number(minStock),
    }

    if (editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? product : p))
      setEditingId(null)
    } else {
      setProducts([...products, product])
    }

    setName('')
    setCategory('')
    setStock('')
    setMinStock('')
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setName(product.name)
    setCategory(product.category)
    setStock(String(product.stock))
    setMinStock(String(product.minStock))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id) {
    if (window.confirm('Bu ürünü silmek istediğine emin misin?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">S</span> StokPilot</div>
        <p className="menu-label">ANA MENÜ</p>
        <div className="menu-item active">▦ &nbsp; Genel Bakış</div>
        <div className="menu-item">▤ &nbsp; Ürün Yönetimi</div>
        <div className="sidebar-bottom">Stoklarını kolayca yönet.</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">STOK YÖNETİM SİSTEMİ</p>
            <h1>Genel Bakış</h1>
          </div>
          <div className="profile"><span>👤</span><div><strong>Yönetici</strong><small>Stok sorumlusu</small></div></div>
        </header>

        <section className="welcome">
          <div>
            <p className="welcome-tag">STOKPILOT'A HOŞ GELDİN</p>
            <h2>Stoklarını kontrol altında tut.</h2>
            <p>Ürünlerini takip et, kritik stok seviyelerini kaçırma.</p>
          </div>
          <div className="welcome-symbol">▦</div>
        </section>

        <section className="summary">
          <div className="summary-card">
            <div className="card-top"><span>Toplam ürün</span><span className="card-icon blue">▤</span></div>
            <strong>{products.length}</strong>
            <small>Kayıtlı ürün çeşidi</small>
          </div>
          <div className="summary-card">
            <div className="card-top"><span>Toplam stok</span><span className="card-icon green">▦</span></div>
            <strong>{products.reduce((sum, p) => sum + p.stock, 0).toLocaleString('tr-TR')}</strong>
            <small>Tüm ürünlerin toplam adedi</small>
          </div>
          <div className="summary-card">
            <div className="card-top"><span>Kritik stok</span><span className="card-icon orange">!</span></div>
            <strong>{lowStock.length}</strong>
            <small>Minimum seviyeye ulaşan ürün</small>
          </div>
        </section>

        {lowStock.length > 0 && (
          <div className="alert-box">
            <span className="alert-symbol">!</span>
            <div><strong>Kritik stok uyarısı</strong><p>{lowStock.map(p => p.name).join(', ')} ürünlerinin stok miktarını kontrol et.</p></div>
          </div>
        )}

        <section className="panel">
          <div className="panel-heading">
            <div><h2>{editingId !== null ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2><p>Ürün bilgilerini aşağıya gir.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="product-form">
            <label>Ürün adı<input value={name} onChange={e => setName(e.target.value)} placeholder="Örn. Karton kutu" /></label>
            <label>Kategori<input value={category} onChange={e => setCategory(e.target.value)} placeholder="Örn. Ambalaj" /></label>
            <label>Stok miktarı<input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" /></label>
            <label>Minimum stok<input type="number" min="0" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="10" /></label>
            <div className="form-actions">
              <button className="primary-button" type="submit">{editingId !== null ? 'Değişiklikleri Kaydet' : '+ Ürün Ekle'}</button>
              {editingId !== null && <button className="cancel-button" type="button" onClick={() => { setEditingId(null); setName(''); setCategory(''); setStock(''); setMinStock('') }}>Vazgeç</button>}
            </div>
          </form>
        </section>

        <section className="panel inventory-panel">
          <div className="panel-heading inventory-heading">
            <div><h2>Ürün Envanteri</h2><p>Eklediğin ürünleri buradan yönetebilirsin.</p></div>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün veya kategori ara..." />
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ÜRÜN ADI</th><th>KATEGORİ</th><th>STOK MİKTARI</th><th>MİN. STOK</th><th>DURUM</th><th>İŞLEMLER</th></tr></thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.minStock}</td>
                    <td><span className={product.stock <= product.minStock ? 'status critical' : 'status sufficient'}>{product.stock <= product.minStock ? 'Kritik' : 'Yeterli'}</span></td>
                    <td className="actions"><button className="edit-button" onClick={() => handleEdit(product)}>Düzenle</button><button className="delete-button" onClick={() => handleDelete(product.id)}>Sil</button></td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && <tr><td colSpan="6" className="empty-state">Aramana uygun ürün bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-footer">Toplam {filteredProducts.length} ürün listeleniyor</div>
        </section>
        <footer>© 2026 StokPilot · Akıllı stok yönetimi</footer>
      </main>
    </div>
  )
}

export default App
