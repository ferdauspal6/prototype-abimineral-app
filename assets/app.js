const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

function app() {
  return {
    page: 'login',
    role: 'Admin',
    collapsed: false,
    mobileMenu: false,
    userMenu: false,
    demoToday: '2026-10-26',
    toast: { show: false, message: '', type: 'success' },
    toastTimer: null,
    confirm: { open: false, title: '', message: '', action: '', id: null, danger: true },

    /* ---------- NAVIGATION ---------- */
    get currentUser() {
      return this.role === 'Sales' ? 'Fahri' : (this.role === 'Manager' ? 'Rina' : 'Admin');
    },
    get navGroups() {
      const groups = [
        { title: '', items: [
          { page: 'dashboard', label: 'Dashboard', icon: 'i-dashboard', roles: ['Admin', 'Manager', 'Sales'], match: ['dashboard'] }
        ]},
        { title: 'Penjualan', items: [
          { page: 'customers', label: 'Master Pelanggan', icon: 'i-users', roles: ['Admin', 'Manager', 'Sales'], match: ['customers'] },
          { page: 'promos', label: 'Master Promo', icon: 'i-tag', roles: ['Admin', 'Manager'], match: ['promos'] },
          { page: this.role === 'Sales' ? 'order-customer' : 'orders', label: 'Order', icon: 'i-cart', roles: ['Admin', 'Manager', 'Sales'], match: ['order-customer','order-create','order-success','orders','order-detail','invoice','deliveries','delivery-create','delivery-check','delivery-detail','delivery-invoice','returns'] }
        ]},
        { title: 'Inventory', items: [
          { page: 'warehouses', label: 'Master Gudang', icon: 'i-warehouse', roles: ['Admin', 'Manager'], match: ['warehouses'] },
          { page: 'products', label: 'Master Barang', icon: 'i-package', roles: ['Admin', 'Manager'], match: ['products'] },
          { page: 'stock', label: 'Stock', icon: 'i-boxes', roles: ['Admin', 'Manager'], match: ['stock'] }
        ]},
        { title: 'Keuangan', items: [
          { page: 'finance-master', label: 'Master Keuangan', icon: 'i-chart', roles: ['Admin', 'Manager'], match: ['finance-master'] },
          { page: 'receivables', label: 'Piutang', icon: 'i-wallet', roles: ['Admin', 'Manager'], match: ['receivables','collection-create','collection-confirm'] },
          { page: 'finance-income', label: 'Pendapatan Lainnya', icon: 'i-banknote', roles: ['Admin', 'Manager'], match: ['finance-income'] },
          { page: 'finance-expense', label: 'Pengeluaran Lainnya', icon: 'i-banknote-down', roles: ['Admin', 'Manager'], match: ['finance-expense'] }
        ]},
        { title: 'Pengguna', items: [
          { page: 'settings', label: 'Akun Saya', icon: 'i-user', roles: ['Admin', 'Manager', 'Sales'], match: ['settings'] },
          { page: 'users', label: 'Kelola Pengguna', icon: 'i-users', roles: ['Admin'], match: ['users'] },
          { page: 'roles', label: 'Kelola Role', icon: 'i-shield', roles: ['Admin'], match: ['roles'] }
        ]}
      ];
      return groups.map(g => ({ ...g, items: g.items.filter(i => i.roles.includes(this.role)) })).filter(g => g.items.length);
    },
    get pageMeta() {
      const map = {
        login: { title: 'Login', crumb: 'Login' },
        dashboard: { title: 'Dashboard', crumb: 'Dashboard' },
        customers: { title: 'Master Pelanggan', crumb: 'Master Pelanggan' },
        promos: { title: 'Master Promo', crumb: 'Master Promo' },
        'order-customer': { title: 'Buat Order', crumb: 'Order / Pilih Pelanggan' },
        'order-create': { title: 'Buat Order', crumb: 'Order / Buat Order' },
        'order-success': { title: 'Order Sukses', crumb: 'Order / Sukses' },
        orders: { title: 'Order', crumb: 'Order' },
        'order-detail': { title: 'Preview Order', crumb: 'Order / Preview Order' },
        invoice: { title: 'Preview Invoice', crumb: 'Order / Invoice' },
        deliveries: { title: 'Surat Jalan', crumb: 'Order / Surat Jalan' },
        'delivery-create': { title: 'Buat Surat Jalan', crumb: 'Order / Surat Jalan / Buat' },
        'delivery-check': { title: 'Konfirmasi Surat Jalan', crumb: 'Order / Surat Jalan / Konfirmasi' },
        'delivery-detail': { title: 'Detail Surat Jalan', crumb: 'Order / Surat Jalan / Detail' },
        'delivery-invoice': { title: 'Preview Delivery', crumb: 'Order / Surat Jalan / Invoice' },
        returns: { title: 'Return', crumb: 'Order / Return' },
        stock: { title: 'Stock', crumb: 'Stock' },
        warehouses: { title: 'Master Gudang', crumb: 'Master Gudang' },
        products: { title: 'Master Barang', crumb: 'Master Barang' },
        'finance-master': { title: 'Master Keuangan', crumb: 'Master Keuangan' },
        'finance-income': { title: 'Pendapatan Lainnya', crumb: 'Pendapatan Lainnya' },
        'finance-expense': { title: 'Pengeluaran Lainnya', crumb: 'Pengeluaran Lainnya' },
        receivables: { title: 'Piutang', crumb: 'Piutang' },
        'collection-create': { title: 'Buat Penagihan', crumb: 'Piutang / Penagihan / Buat' },
        'collection-confirm': { title: 'Konfirmasi Penagihan', crumb: 'Piutang / Penagihan / Konfirmasi' },
        users: { title: 'Kelola Pengguna', crumb: 'Kelola Pengguna' },
        roles: { title: 'Kelola Role', crumb: 'Kelola Role' },
        settings: { title: 'Akun Saya', crumb: 'Pengaturan' }
      };
      return map[this.page] || map.dashboard;
    },
    isNavActive(item) { return item.match.includes(this.page); },
    go(page) {
      this.page = page;
      if (page === 'finance-income') this.financeTab = 'income';
      if (page === 'finance-expense') this.financeTab = 'expense';
      this.mobileMenu = false;
      this.userMenu = false;
      this.closeModals();
      try { history.replaceState(null, '', '#' + page); } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    init() {
      const known = ['login','dashboard','customers','promos','order-customer','order-create','order-success','orders','order-detail','invoice','deliveries','delivery-create','delivery-check','delivery-detail','delivery-invoice','returns','stock','warehouses','products','finance-master','finance-income','finance-expense','receivables','collection-create','collection-confirm','users','roles','settings'];
      const hash = (location.hash || '').replace('#', '');
      if (hash && known.includes(hash)) this.page = hash;
      if (this.page === 'finance-income') this.financeTab = 'income';
      if (this.page === 'finance-expense') this.financeTab = 'expense';
      if (['delivery-check','delivery-detail'].includes(this.page)) this.startDeliveryCheck(this.deliveries[0], this.page === 'delivery-detail');
      window.addEventListener('hashchange', () => {
        const next = (location.hash || '').replace('#', '');
        if (!known.includes(next)) return;
        this.page = next;
        if (next === 'finance-income') this.financeTab = 'income';
        if (next === 'finance-expense') this.financeTab = 'expense';
        if (['delivery-check','delivery-detail'].includes(next)) this.startDeliveryCheck(this.deliveries[0], next === 'delivery-detail');
      });
    },
    loginRole: 'Admin',
    loginForm: { username: 'admin', password: 'rahasia123' },
    selectLoginRole(role) {
      this.loginRole = role;
      const accounts = {
        Admin: { username: 'admin', name: 'Admin', email: 'admin@abimineral.com' },
        Sales: { username: 'fahri', name: 'Fahri', email: 'fahri@abimineral.com' },
        Manager: { username: 'rina', name: 'Rina', email: 'rina@abimineral.com' }
      };
      const account = accounts[role] || accounts.Admin;
      this.loginForm = { username: account.username, password: 'rahasia123' };
      this.settingsForm = { name: account.name, username: account.username, email: account.email };
    },
    doLogin() {
      const role = this.loginRole || 'Admin';
      this.loginRole = role;
      this.role = role;
      this.selectLoginRole(role);
      this.go('dashboard');
      this.notify('Login demo sebagai ' + role);
    },
    logout() {
      this.userMenu = false;
      this.page = 'login';
      this.loginRole = 'Admin';
      this.selectLoginRole('Admin');
      try { history.replaceState(null, '', '#login'); } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onRoleChange() {
      if (this.role === 'Sales' && !['dashboard', 'customers', 'order-customer', 'order-create', 'order-success', 'settings'].includes(this.page)) {
        this.page = 'order-customer';
      }
      const profiles = {
        Admin: { name:'Admin', username:'admin', email:'admin@abimineral.com' },
        Sales: { name:'Fahri', username:'fahri', email:'fahri@abimineral.com' },
        Manager: { name:'Rina', username:'rina', email:'rina@abimineral.com' }
      };
      this.settingsForm = { ...profiles[this.role] };
      this.notify('Mode demo: ' + this.role);
    },

    /* ---------- HELPERS ---------- */
    fmt(n) { return numberFmt.format(Number(n) || 0); },
    rp(n) { return rupiahFmt.format(Number(n) || 0); },
    short(n) {
      const v = Number(n) || 0;
      if (Math.abs(v) >= 1000000000) return (v / 1000000000).toFixed(1).replace('.0', '') + 'm';
      if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1).replace('.0', '') + 'jt';
      if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + 'rb';
      return String(v);
    },
    dateShort(v) {
      if (!v) return '-';
      const d = new Date(v);
      if (isNaN(d.getTime())) return v;
      return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
    },
    dateLong(v) {
      if (!v) return '-';
      const d = new Date(v);
      if (isNaN(d.getTime())) return v;
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    },
    weekdayName(v) {
      const d = new Date(v);
      if (isNaN(d.getTime())) return 'Senin';
      return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()];
    },
    initials(name) { return (name || '').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase(); },
    customer(id) { return this.customers.find(c => c.id === id) || {}; },
    product(id) { return this.products.find(p => p.id === id) || {}; },
    customerName(id) { return this.customer(id).name || '-'; },
    productName(id) { return this.product(id).name || '-'; },
    order(id) { return this.orders.find(o => o.id === id) || {}; },
    delivery(id) { return this.deliveries.find(d => d.id === id) || {}; },
    receivable(id) { return this.receivables.find(r => r.id === id) || {}; },
    statusBadge(s) {
      return { pending:'badge-yellow', processing:'badge-orange', already:'badge-blue', holding:'badge-cyan', shipping:'badge-amber', success:'badge-green', partial:'badge-green', failed:'badge-red', cancel:'badge-red', return:'badge-blue', discard:'badge-red' }[s] || 'badge-slate';
    },
    statusLabel(s) {
      return { pending:'Belum Diproses', processing:'Sedang Diproses', already:'Siap Dikirim', holding:'Ditahan', shipping:'Dikirim', success:'Selesai', partial:'Selesai Parsial', failed:'Gagal', cancel:'Dibatalkan', return:'Stocked', discard:'Dihapus' }[s] || s;
    },
    paymentBadge(p) { return p === 'paid' ? 'badge-green' : p === 'partial' ? 'badge-green' : 'badge-yellow'; },
    paymentLabel(p) { return p === 'paid' ? 'Lunas' : p === 'partial' ? 'Lunas Partial' : 'Belum Lunas'; },
    printPage() { window.print(); },
    notify(message, type = 'success') {
      this.toast = { show: true, message, type };
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast.show = false; }, 3000);
    },
    closeModals() {
      this.cameraOpen = false;
      this.orderPreviewOpen = false;
      this.deliveryPreviewOpen = false;
      this.collectionPreviewOpen = false;
      this.reportOpen = false;
      this.customerModalOpen = false;
      this.promoModalOpen = false;
      this.productModalOpen = false;
      this.warehouseModalOpen = false;
      this.financeModalOpen = false;
      this.financeTypeModalOpen = false;
      this.userModalOpen = false;
      this.roleModalOpen = false;
      this.stockModalOpen = false;
      this.opnameModalOpen = false;
      this.returnModalOpen = false;
      this.paymentModalOpen = false;
      this.confirm.open = false;
    },
    askConfirm(action, id, title, message, danger = true) {
      this.confirm = { open: true, action, id, title, message, danger };
    },
    runConfirm() {
      const { action, id } = this.confirm;
      if (action === 'delete-order') { this.orders = this.orders.filter(o => o.id !== id); this.notify('Order berhasil dihapus'); }
      if (action === 'delete-customer') { this.customers = this.customers.filter(c => c.id !== id); this.notify('Pelanggan berhasil dihapus'); }
      if (action === 'delete-promo') { this.promos = this.promos.filter(p => p.id !== id); this.notify('Promo berhasil dihapus'); }
      if (action === 'delete-product') { this.products = this.products.filter(p => p.id !== id); this.notify('Barang berhasil dihapus'); }
      if (action === 'delete-warehouse') { this.warehouses = this.warehouses.filter(w => w.id !== id); this.notify('Gudang berhasil dihapus'); }
      if (action === 'delete-user') { this.users = this.users.filter(u => u.id !== id); this.notify('Pengguna berhasil dihapus'); }
      if (action === 'delete-role') { this.roles = this.roles.filter(r => r.id !== id); this.notify('Role berhasil dihapus'); }
      if (action === 'delete-finance') { this.incomes = this.incomes.filter(i => i.id !== id); this.expenses = this.expenses.filter(i => i.id !== id); this.notify('Transaksi berhasil dihapus'); }
      if (action === 'delete-finance-type') { this.financeTypes.income = this.financeTypes.income.filter(t => t.id !== id); this.financeTypes.expense = this.financeTypes.expense.filter(t => t.id !== id); this.notify('Jenis transaksi berhasil dihapus'); }
      if (action === 'process-return') { const r = this.returns.find(x => x.id === id); if (r) { r.status = r.action; } this.notify('Return berhasil diproses'); }
      if (action === 'delete-return') { this.returns = this.returns.filter(r => r.id !== id); this.notify('Return dibatalkan'); }
      if (action === 'delete-delivery') { this.deliveries = this.deliveries.filter(d => d.id !== id); this.notify('Surat jalan berhasil dihapus'); }
      if (action === 'delete-stock') { this.stockHistory = this.stockHistory.filter(s => s.id !== id); this.notify('Riwayat stock dihapus'); }
      if (action === 'delete-opname') { this.opnames = this.opnames.filter(o => o.id !== id); this.notify('Opname dihapus'); }
      this.confirm.open = false;
    },

    /* ---------- DATA ---------- */
    customers: [
      { id:'c1', code:'C-0001', name:'Toko Sumber Rejeki', address:'Jl. Merdeka No. 12, Kersik Putih', channel:'Grosir', week:'Genap', day:'Senin', priceType:'in', phone:'081234567890', sales:'Fahri', lastOrder:'2026-10-19', orderedToday:true, description:'Pelanggan rutin pekan genap' },
      { id:'c2', code:'C-0002', name:'Aneka Jaya', address:'Jl. Pahlawan No. 88, Balikpapan', channel:'Retail', week:'Ganjil', day:'Selasa', priceType:'out', phone:'081298765432', sales:'Zainudin', lastOrder:'2026-10-18', orderedToday:false, description:'' },
      { id:'c3', code:'C-0003', name:'Berkah Mineral', address:'Kawasan Industri Blok C-4', channel:'Grosir', week:'Genap', day:'Senin', priceType:'in', phone:'081355667788', sales:'Fahri', lastOrder:'2026-10-12', orderedToday:false, description:'Pembayaran tempo 14 hari' },
      { id:'c4', code:'C-0004', name:'Sinar Abadi', address:'Jl. Soekarno Hatta No. 45', channel:'Modern Market', week:'Ganjil', day:'Rabu', priceType:'in', phone:'081377889900', sales:'Zainudin', lastOrder:'2026-10-15', orderedToday:false, description:'' },
      { id:'c5', code:'C-0005', name:'Mitra Bangunan', address:'Jl. Ahmad Yani No. 21', channel:'Grosir', week:'Genap', day:'Kamis', priceType:'in', phone:'081255667799', sales:'Fahri', lastOrder:'2026-10-16', orderedToday:false, description:'' },
      { id:'c6', code:'C-0006', name:'Cahaya Putih', address:'Jl. Sudirman No. 9', channel:'Apotik', week:'Ganjil', day:'Jumat', priceType:'in', phone:'081399887766', sales:'Zainudin', lastOrder:'2026-10-10', orderedToday:false, description:'' },
      { id:'c7', code:'C-0007', name:'Toko Sejahtera', address:'Jl. Gatot Subroto No. 3', channel:'Retail', week:'Genap', day:'Sabtu', priceType:'out', phone:'081211223344', sales:'Fahri', lastOrder:'2026-10-07', orderedToday:false, description:'' },
      { id:'c8', code:'C-0008', name:'Grosir Makmur', address:'Jl. Mulawarman No. 17', channel:'Star Outlet', week:'Ganjil', day:'Senin', priceType:'in', phone:'081322334455', sales:'Zainudin', lastOrder:'2026-10-11', orderedToday:false, description:'' }
    ],
    products: [
      { id:'p1', code:'ABI-0001', name:'Kapur Aji 1 Kg', unit:'Krt', cost:18000, inSale:24000, outSale:25500, stock:120, status:true },
      { id:'p2', code:'ABI-0002', name:'Kapur Aji 5 Kg', unit:'Krt', cost:82000, inSale:95000, outSale:100000, stock:48, status:true },
      { id:'p3', code:'ABI-0003', name:'Kapur Sirih 500 g', unit:'Box', cost:12000, inSale:16000, outSale:17000, stock:8, status:true },
      { id:'p4', code:'ABI-0004', name:'Bata Ringan', unit:'Pcs', cost:7000, inSale:9500, outSale:10500, stock:240, status:true },
      { id:'p5', code:'ABI-0005', name:'Semen Putih 40 kg', unit:'Sak', cost:58000, inSale:68000, outSale:72000, stock:35, status:true },
      { id:'p6', code:'ABI-0006', name:'Pasir Silika 25 kg', unit:'Sak', cost:32000, inSale:39000, outSale:42000, stock:5, status:true },
      { id:'p7', code:'ABI-0007', name:'Marmer Bubuk 1 kg', unit:'Pcs', cost:9000, inSale:13000, outSale:14000, stock:72, status:true },
      { id:'p8', code:'ABI-0008', name:'Gipsum Premium 20 kg', unit:'Sak', cost:45000, inSale:52000, outSale:56000, stock:18, status:false }
    ],
    promos: [
      { id:'pr1', code:'PR/2026/10/0001', name:'Promo Grosir Oktober', productId:'p1', minAmount:24, early:'2026-10-01', final:'2026-10-31', bonusType:'price', discountPrice:5, multiple:false, bonusProductId:null, bonusAmount:0, description:'Potongan 5% untuk pembelian minimal 24 karton.' },
      { id:'pr2', code:'PR/2026/10/0002', name:'Bonus Kapur 5 Kg', productId:'p2', minAmount:12, early:'2026-10-01', final:'2026-10-31', bonusType:'product', discountPrice:0, multiple:true, bonusProductId:'p3', bonusAmount:2, description:'Setiap kelipatan 12 karton mendapat 2 box kapur sirih.' },
      { id:'pr3', code:'PR/2026/10/0003', name:'Diskon Bata Ringan', productId:'p4', minAmount:50, early:'2026-10-05', final:'2026-10-30', bonusType:'price', discountPrice:4, multiple:false, bonusProductId:null, bonusAmount:0, description:'Potongan 4% pembelian minimal 50 pcs.' },
      { id:'pr4', code:'PR/2026/10/0004', name:'Bonus Marmer Bubuk', productId:'p5', minAmount:10, early:'2026-10-01', final:'2026-10-25', bonusType:'product', discountPrice:0, multiple:false, bonusProductId:'p7', bonusAmount:5, description:'Bonus 5 pcs marmer bubuk untuk pembelian 10 sak.' }
    ],
    orders: [
      { id:'o1', code:'INV/2026/10/0041', customerId:'c1', sales:'Fahri', orderBy:'Admin', status:'already', payment:'unpaid', delivery:'full', radius:'onsite', date:'2026-10-26', schedule:'2026-10-26', dueDate:'2026-11-09', subtotal:1200000, discount:60000, tax:0, total:1140000, customDiscount:0, items:[{productId:'p1', qty:50, price:24000, discPercent:5}] },
      { id:'o2', code:'INV/2026/10/0042', customerId:'c2', sales:'Zainudin', orderBy:'Admin', status:'pending', payment:'unpaid', delivery:'full', radius:'onsite', date:'2026-10-25', schedule:'2026-10-27', dueDate:'2026-11-10', subtotal:950000, discount:0, tax:0, total:950000, customDiscount:0, items:[{productId:'p2', qty:10, price:95000, discPercent:0}] },
      { id:'o3', code:'INV/2026/10/0043', customerId:'c3', sales:'Fahri', orderBy:'Admin', status:'shipping', payment:'partial', delivery:'partial', radius:'offsite', date:'2026-10-24', schedule:'2026-10-26', dueDate:'2026-11-07', subtotal:2300000, discount:0, tax:0, total:2300000, customDiscount:0, items:[{productId:'p5', qty:30, price:68000, discPercent:0},{productId:'p7', qty:20, price:13000, discPercent:0}] },
      { id:'o4', code:'INV/2026/10/0044', customerId:'c4', sales:'Zainudin', orderBy:'Admin', status:'shipping', payment:'partial', delivery:'full', radius:'onsite', date:'2026-10-24', schedule:'2026-10-28', dueDate:'2026-11-07', subtotal:690000, discount:0, tax:0, total:690000, customDiscount:0, items:[{productId:'p1', qty:20, price:24000, discPercent:0},{productId:'p3', qty:5, price:16000, discPercent:0},{productId:'p7', qty:10, price:13000, discPercent:0}] },
      { id:'o5', code:'INV/2026/10/0045', customerId:'c5', sales:'Fahri', orderBy:'Admin', status:'success', payment:'paid', delivery:'full', radius:'onsite', date:'2026-10-20', schedule:'2026-10-22', dueDate:'2026-11-03', subtotal:1629000, discount:0, tax:0, total:1629000, customDiscount:0, items:[{productId:'p2', qty:15, price:95000, discPercent:0},{productId:'p5', qty:3, price:68000, discPercent:0}] },
      { id:'o6', code:'INV/2026/10/0046', customerId:'c6', sales:'Zainudin', orderBy:'Admin', status:'holding', payment:'unpaid', delivery:'full', radius:'onsite', date:'2026-10-23', schedule:'2026-10-25', dueDate:'2026-11-06', subtotal:510000, discount:0, tax:0, total:510000, customDiscount:0, items:[{productId:'p4', qty:40, price:9500, discPercent:0},{productId:'p7', qty:10, price:13000, discPercent:0}] },
      { id:'o7', code:'INV/2026/10/0047', customerId:'c7', sales:'Fahri', orderBy:'Admin', status:'success', payment:'paid', delivery:'full', radius:'onsite', date:'2026-10-19', schedule:'2026-10-21', dueDate:'2026-11-02', subtotal:720000, discount:0, tax:0, total:720000, customDiscount:0, items:[{productId:'p1', qty:30, price:24000, discPercent:0}] },
      { id:'o8', code:'INV/2026/10/0048', customerId:'c8', sales:'Zainudin', orderBy:'Admin', status:'cancel', payment:'unpaid', delivery:'full', radius:'offsite', date:'2026-10-18', schedule:'2026-10-20', dueDate:'2026-11-01', subtotal:1110000, discount:0, tax:0, total:1110000, customDiscount:0, items:[{productId:'p2', qty:10, price:95000, discPercent:0},{productId:'p3', qty:10, price:16000, discPercent:0}] }
    ],
    deliveries: [
      { id:'d1', code:'DO/2026/10/0012', orderIds:['o1','o2'], periodStart:'2026-10-20', periodEnd:'2026-10-26', driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh1', status:'pending', total:2090000, createdBy:'Admin' },
      { id:'d2', code:'DO/2026/10/0013', orderIds:['o3','o4'], periodStart:'2026-10-24', periodEnd:'2026-10-28', driver:'Agus Salim', car:'Gran Max - DD 5678 CD', warehouseId:'wh1', status:'shipping', total:2990000, createdBy:'Admin' },
      { id:'d3', code:'DO/2026/10/0014', orderIds:['o5','o7'], periodStart:'2026-10-19', periodEnd:'2026-10-22', driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh2', status:'success', total:2349000, createdBy:'Admin' },
      { id:'d4', code:'DO/2026/10/0015', orderIds:['o6'], periodStart:'2026-10-23', periodEnd:'2026-10-25', driver:'Agus Salim', car:'Gran Max - DD 5678 CD', warehouseId:'wh3', status:'pending', total:510000, createdBy:'Admin' }
    ],
    returns: [
      { id:'r1', code:'RTN/2026/10/0003', orderId:'o4', name:'Kapur Aji 1 Kg', qty:2, price:45600, type:'change', condition:'bad', action:'discard', status:'pending', description:'Kemasan rusak saat pengiriman', by:'Admin', date:'2026-10-25' },
      { id:'r2', code:'RTN/2026/10/0002', orderId:'o5', name:'Kapur Aji 5 Kg', qty:1, price:88350, type:'cut', condition:'good', action:'return', status:'return', description:'Potong harga karena selisih kualitas', by:'Admin', date:'2026-10-24' },
      { id:'r3', code:'RTN/2026/10/0001', orderId:'o7', name:'Kapur Aji 1 Kg', qty:1, price:22800, type:'change', condition:'bad', action:'discard', status:'discard', description:'Barang pecah', by:'Admin', date:'2026-10-22' }
    ],
    warehouses: [
      { id:'wh1', code:'ST-0001', name:'Gudang Utama', address:'Jl. Dharma Praja, Kersik Putih' },
      { id:'wh2', code:'ST-0002', name:'Gudang Cabang', address:'Jl. Soekarno Hatta No. 88' },
      { id:'wh3', code:'ST-0003', name:'Gudang Transit', address:'Kawasan Pelabuhan KM 12' }
    ],
    stockHistory: [
      { id:'sh1', code:'AS/2026/10/0004', date:'2026-10-24', warehouseId:'wh1', description:'Restock kapur', by:'Admin', items:[{productId:'p1', qty:50},{productId:'p2', qty:20}] },
      { id:'sh2', code:'AS/2026/10/0003', date:'2026-10-22', warehouseId:'wh2', description:'Kiriman gudang cabang', by:'Admin', items:[{productId:'p4', qty:100}] },
      { id:'sh3', code:'AS/2026/10/0002', date:'2026-10-20', warehouseId:'wh1', description:'Stock awal bulan', by:'Admin', items:[{productId:'p5', qty:40},{productId:'p8', qty:25}] }
    ],
    opnames: [
      { id:'op1', code:'OP/2026/10/0003', date:'2026-10-25', productId:'p1', warehouseId:'wh1', qty:5, description:'Koreksi stok', by:'Admin' },
      { id:'op2', code:'OP/2026/10/0002', date:'2026-10-23', productId:'p4', warehouseId:'wh1', qty:-2, description:'Barang rusak', by:'Admin' },
      { id:'op3', code:'OP/2026/10/0001', date:'2026-10-21', productId:'p7', warehouseId:'wh2', qty:3, description:'Salah hitung', by:'Admin' }
    ],
    financeTypes: {
      income: [
        { id:'ti1', code:'IC-0001', name:'Penjualan Lain', description:'Pendapatan di luar penjualan utama' },
        { id:'ti2', code:'IC-0002', name:'Jasa Pengiriman', description:'Pendapatan jasa antar barang' },
        { id:'ti3', code:'IC-0003', name:'Komisi', description:'Komisi dari mitra' }
      ],
      expense: [
        { id:'te1', code:'OC-0001', name:'Operasional', description:'Biaya operasional harian' },
        { id:'te2', code:'OC-0002', name:'Gaji', description:'Gaji karyawan' },
        { id:'te3', code:'OC-0003', name:'Transportasi', description:'BBM dan perawatan kendaraan' },
        { id:'te4', code:'OC-0004', name:'Maintenance', description:'Perawatan gudang' }
      ]
    },
    incomes: [
      { id:'fi1', code:'IC/2026/10/0004', typeId:'ti2', amount:1500000, date:'2026-10-22', description:'Jasa antar pelanggan luar kota', proof:'', by:'Admin' },
      { id:'fi2', code:'IC/2026/10/0003', typeId:'ti1', amount:850000, date:'2026-10-20', description:'Penjualan barang sisa', proof:'', by:'Admin' },
      { id:'fi3', code:'IC/2026/10/0002', typeId:'ti3', amount:1200000, date:'2026-10-16', description:'Komisi mitra bulan Oktober', proof:'', by:'Admin' },
      { id:'fi4', code:'IC/2026/10/0001', typeId:'ti2', amount:600000, date:'2026-10-12', description:'Pengiriman tambahan', proof:'', by:'Admin' }
    ],
    expenses: [
      { id:'fe1', code:'OC/2026/10/0004', typeId:'te3', amount:1850000, date:'2026-10-23', description:'BBM dan tol', proof:'', by:'Admin' },
      { id:'fe2', code:'OC/2026/10/0003', typeId:'te1', amount:950000, date:'2026-10-21', description:'ATK dan perlengkapan gudang', proof:'', by:'Admin' },
      { id:'fe3', code:'OC/2026/10/0002', typeId:'te2', amount:4500000, date:'2026-10-15', description:'Gaji karyawan minggu kedua', proof:'', by:'Admin' },
      { id:'fe4', code:'OC/2026/10/0001', typeId:'te4', amount:1300000, date:'2026-10-10', description:'Perbaikan atap gudang', proof:'', by:'Admin' }
    ],
    receivables: [
      { id:'rc1', orderId:'o1', orderCode:'INV/2026/10/0041', customerId:'c1', sales:'Fahri', schedule:'2026-10-26', due:'2026-11-09', total:1140000, cash:0, transfer:0, unpaid:1140000 },
      { id:'rc2', orderId:'o3', orderCode:'INV/2026/10/0043', customerId:'c3', sales:'Fahri', schedule:'2026-10-26', due:'2026-11-07', total:2300000, cash:200000, transfer:300000, unpaid:1800000 },
      { id:'rc3', orderId:'o4', orderCode:'INV/2026/10/0044', customerId:'c4', sales:'Zainudin', schedule:'2026-10-28', due:'2026-11-07', total:690000, cash:0, transfer:200000, unpaid:490000 },
      { id:'rc4', orderId:'o6', orderCode:'INV/2026/10/0046', customerId:'c6', sales:'Zainudin', schedule:'2026-10-25', due:'2026-11-06', total:510000, cash:0, transfer:0, unpaid:510000 },
      { id:'rc5', orderId:'o5', orderCode:'INV/2026/10/0045', customerId:'c5', sales:'Fahri', schedule:'2026-10-22', due:'2026-11-03', total:1629000, cash:1629000, transfer:0, unpaid:0 },
      { id:'rc6', orderId:'o7', orderCode:'INV/2026/10/0047', customerId:'c7', sales:'Fahri', schedule:'2026-10-21', due:'2026-11-02', total:720000, cash:720000, transfer:0, unpaid:0 },
      { id:'rc7', orderId:'o2', orderCode:'INV/2026/10/0042', customerId:'c2', sales:'Zainudin', schedule:'2026-10-27', due:'2026-11-10', total:950000, cash:0, transfer:0, unpaid:950000 }
    ],
    collections: [
      { id:'cl1', code:'CL/2026/10/0003', sales:'Fahri', date:'2026-10-23', status:'processing', itemIds:['rc1','rc3'], total:1830000, paid:200000, unpaid:1630000 },
      { id:'cl2', code:'CL/2026/10/0002', sales:'Zainudin', date:'2026-10-22', status:'pending', itemIds:['rc2','rc7'], total:3250000, paid:500000, unpaid:2750000 },
      { id:'cl3', code:'CL/2026/10/0001', sales:'Fahri', date:'2026-10-18', status:'success', itemIds:['rc5'], total:1629000, paid:1629000, unpaid:0 }
    ],
    payments: [
      { id:'pm1', orderId:'o5', orderCode:'INV/2026/10/0045', customerId:'c5', amount:1629000, date:'2026-10-21', proof:'bukti-transfer-bca.jpg', by:'Admin' },
      { id:'pm2', orderId:'o3', orderCode:'INV/2026/10/0043', customerId:'c3', amount:500000, date:'2026-10-20', proof:'', by:'Admin' },
      { id:'pm3', orderId:'o7', orderCode:'INV/2026/10/0047', customerId:'c7', amount:720000, date:'2026-10-19', proof:'bukti-setor-tunai.jpg', by:'Admin' }
    ],
    users: [
      { id:'u1', code:'U-0001', name:'Admin', username:'admin', email:'admin@abimineral.com', roles:['Admin'] },
      { id:'u2', code:'U-0002', name:'Fahri', username:'fahri', email:'fahri@abimineral.com', roles:['Sales'] },
      { id:'u3', code:'U-0003', name:'Zainudin', username:'zainudin', email:'zainudin@abimineral.com', roles:['Sales'] },
      { id:'u4', code:'U-0004', name:'Sari', username:'sari', email:'sari@abimineral.com', roles:['Supervisor'] },
      { id:'u5', code:'U-0005', name:'Rina', username:'rina', email:'rina@abimineral.com', roles:['Manager'] }
    ],
    permissions: ['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Barang','Stock','Stock Opname','Master Keuangan','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya','Kelola Role & Pengguna','Diskon Khusus'],
    roles: [
      { id:'role1', name:'Admin', guard:'web', members:1, permissions:['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Barang','Stock','Stock Opname','Master Keuangan','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya','Kelola Role & Pengguna','Diskon Khusus'] },
      { id:'role2', name:'Sales', guard:'web', members:2, permissions:['Dashboard','Master Pelanggan','Order'] },
      { id:'role3', name:'Manager', guard:'web', members:1, permissions:['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Barang','Stock','Stock Opname','Master Keuangan','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya'] },
      { id:'role4', name:'Supervisor', guard:'web', members:1, permissions:['Dashboard','Order','Order Admin','Stock','Piutang'] },
      { id:'role5', name:'Developer', guard:'web', members:0, permissions:['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Barang','Stock','Stock Opname','Master Keuangan','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya','Kelola Role & Pengguna','Diskon Khusus'] }
    ],

    /* ---------- DASHBOARD ---------- */
    dashRecapTab: 'income',
    dashStockTab: 'active',
    dashboardSales: 'all',
    dashboardDate: '2026-10-26',
    chartMonths: [
      { m:'Jan', income:22, expense:12 }, { m:'Feb', income:28, expense:14 }, { m:'Mar', income:25, expense:16 },
      { m:'Apr', income:34, expense:18 }, { m:'Mei', income:31, expense:15 }, { m:'Jun', income:38, expense:20 },
      { m:'Jul', income:42, expense:19 }, { m:'Agu', income:39, expense:22 }, { m:'Sep', income:45, expense:20 },
      { m:'Okt', income:48, expense:21 }
    ],
    summary: { income:48200000, incomeDelta:11.4, expense:21600000, expenseDelta:-3.2, gross:18900000, grossDelta:8.1, net:9200000, netDelta:5.4, receivable:12400000, receivableDelta:2.1 },
    recapIncome: { total:8400000, credit:3200000, cash:4100000, transfer:1100000 },
    recapCash: { total:5200000, cash:4700000, transfer:500000 },
    info: { delivery:{ pending:2, partial:1, success:2 }, billing:{ pending:2, success:1 }, invoice:{ pending:2, ready:3, shipping:1, partial:1, success:2, cancel:1 }, return:{ pending:1, return:1, discard:1 } },
    popularProducts: [{ name:'Kapur Aji 1 Kg', qty:310, unit:'Krt' }, { name:'Kapur Aji 5 Kg', qty:220, unit:'Krt' }, { name:'Bata Ringan', qty:185, unit:'Pcs' }, { name:'Semen Putih 40 kg', qty:120, unit:'Sak' }],
    holdingProducts: [{ name:'Pasir Silika 25 kg', qty:35, unit:'Sak' }, { name:'Kapur Sirih 500 g', qty:18, unit:'Box' }],
    get chartIncomePoints() { return this.chartPoints('income'); },
    get chartExpensePoints() { return this.chartPoints('expense'); },
    chartPoints(key) {
      const max = 60;
      return this.chartMonths.map((d, i) => {
        const x = 42 + i * 62;
        const y = 180 - (d[key] / max) * 150;
        return x + ',' + y;
      }).join(' ');
    },
    get lowStock() { return [...this.products].filter(p => p.stock <= 10).sort((a,b) => a.stock - b.stock); },
    get invoiceCount() { return this.orders.length; },
    get deliveryCount() { return this.deliveries.length; },
    get returnCount() { return this.returns.length; },
    get orderStatusCount() {
      const c = {};
      this.orders.forEach(o => c[o.status] = (c[o.status] || 0) + 1);
      return c;
    },
    get recapData() { return this.dashRecapTab === 'income' ? this.recapIncome : this.recapCash; },

    /* ---------- MASTER CUSTOMER ---------- */
    customerSearch: '', customerChannel: '', customerSales: '', customerWeek: '', customerDay: '', customerPrice: '',
    customerModalOpen: false, customerEditId: null,
    customerForm: { name:'', address:'', channel:'Grosir', sales:'Fahri', week:'Genap', day:'Senin', priceType:'in', phone:'', description:'' },
    get filteredCustomers() {
      const q = this.customerSearch.toLowerCase();
      return this.customers.filter(c => {
        if (this.role === 'Sales' && c.sales !== 'Fahri') return false;
        if (q && !(c.name + ' ' + c.code).toLowerCase().includes(q)) return false;
        if (this.customerChannel && c.channel !== this.customerChannel) return false;
        if (this.customerSales && c.sales !== this.customerSales) return false;
        if (this.customerWeek && c.week !== this.customerWeek) return false;
        if (this.customerDay && c.day !== this.customerDay) return false;
        if (this.customerPrice && c.priceType !== this.customerPrice) return false;
        return true;
      });
    },
    openCustomer(c = null) {
      this.customerEditId = c ? c.id : null;
      this.customerForm = c ? { name:c.name, address:c.address, channel:c.channel, sales:c.sales, week:c.week, day:c.day, priceType:c.priceType, phone:c.phone, description:c.description } : { name:'', address:'', channel:'Grosir', sales:'Fahri', week:'Genap', day:'Senin', priceType:'in', phone:'', description:'' };
      this.customerModalOpen = true;
    },
    saveCustomer() {
      if (!this.customerForm.name || !this.customerForm.address) { this.notify('Nama dan alamat wajib diisi', 'error'); return; }
      if (this.customerEditId) {
        const c = this.customers.find(x => x.id === this.customerEditId);
        Object.assign(c, this.customerForm);
        this.notify('Pelanggan berhasil diperbarui');
      } else {
        const id = 'c' + (Date.now());
        this.customers.unshift({ id, code:'C-' + String(this.customers.length + 1).padStart(4,'0'), orderedToday:false, lastOrder:'2026-10-26', ...this.customerForm });
        this.notify('Pelanggan baru berhasil ditambahkan');
      }
      this.customerModalOpen = false;
    },

    /* ---------- PROMO ---------- */
    promoSearch: '', promoModalOpen: false, promoEditId: null,
    promoForm: { name:'', productId:'p1', minAmount:24, early:'2026-10-01', final:'2026-10-31', bonusType:'price', discountPrice:5, multiple:false, bonusProductId:'p3', bonusAmount:1, description:'' },
    get filteredPromos() {
      const q = this.promoSearch.toLowerCase();
      return this.promos.filter(p => !q || (p.name + ' ' + p.code + ' ' + this.productName(p.productId)).toLowerCase().includes(q));
    },
    openPromo(p = null) {
      this.promoEditId = p ? p.id : null;
      this.promoForm = p ? { name:p.name, productId:p.productId, minAmount:p.minAmount, early:p.early, final:p.final, bonusType:p.bonusType, discountPrice:p.discountPrice, multiple:p.multiple, bonusProductId:p.bonusProductId, bonusAmount:p.bonusAmount, description:p.description } : { name:'', productId:'p1', minAmount:24, early:'2026-10-01', final:'2026-10-31', bonusType:'price', discountPrice:5, multiple:false, bonusProductId:'p3', bonusAmount:1, description:'' };
      this.promoModalOpen = true;
    },
    savePromo() {
      if (!this.promoForm.name) { this.notify('Nama promo wajib diisi', 'error'); return; }
      const data = { ...this.promoForm, bonusType: this.promoForm.bonusType, discountPrice: this.promoForm.bonusType === 'price' ? Number(this.promoForm.discountPrice) : 0, bonusProductId: this.promoForm.bonusType === 'product' ? this.promoForm.bonusProductId : null, bonusAmount: this.promoForm.bonusType === 'product' ? Number(this.promoForm.bonusAmount) : 0 };
      if (this.promoEditId) { Object.assign(this.promos.find(p => p.id === this.promoEditId), data); this.notify('Promo berhasil diperbarui'); }
      else { this.promos.unshift({ id:'pr' + Date.now(), code:'PR/2026/10/' + String(this.promos.length + 1).padStart(4,'0'), ...data }); this.notify('Promo baru berhasil ditambahkan'); }
      this.promoModalOpen = false;
    },

    /* ---------- PRODUCT ---------- */
    productSearch: '', productStatus: '', productModalOpen: false, productEditId: null,
    productForm: { name:'', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, status:true },
    get filteredProducts() {
      const q = this.productSearch.toLowerCase();
      return this.products.filter(p => {
        if (q && !(p.name + ' ' + p.code).toLowerCase().includes(q)) return false;
        if (this.productStatus && String(p.status) !== this.productStatus) return false;
        return true;
      });
    },
    openProduct(p = null) {
      this.productEditId = p ? p.id : null;
      this.productForm = p ? { name:p.name, unit:p.unit, cost:p.cost, inSale:p.inSale, outSale:p.outSale, stock:p.stock, status:p.status } : { name:'', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, status:true };
      this.productModalOpen = true;
    },
    saveProduct() {
      if (!this.productForm.name) { this.notify('Nama barang wajib diisi', 'error'); return; }
      const data = { ...this.productForm, cost:Number(this.productForm.cost), inSale:Number(this.productForm.inSale), outSale:Number(this.productForm.outSale), stock:Number(this.productForm.stock), status: !!this.productForm.status };
      if (this.productEditId) { Object.assign(this.products.find(p => p.id === this.productEditId), data); this.notify('Barang berhasil diperbarui'); }
      else { this.products.push({ id:'p' + Date.now(), code:'ABI-' + String(this.products.length + 1).padStart(4,'0'), ...data }); this.notify('Barang baru berhasil ditambahkan'); }
      this.productModalOpen = false;
    },

    /* ---------- WAREHOUSE ---------- */
    warehouseModalOpen: false, warehouseEditId: null,
    warehouseForm: { name:'', address:'' },
    openWarehouse(w = null) {
      this.warehouseEditId = w ? w.id : null;
      this.warehouseForm = w ? { name:w.name, address:w.address } : { name:'', address:'' };
      this.warehouseModalOpen = true;
    },
    saveWarehouse() {
      if (!this.warehouseForm.name) { this.notify('Nama gudang wajib diisi', 'error'); return; }
      if (this.warehouseEditId) { Object.assign(this.warehouses.find(w => w.id === this.warehouseEditId), this.warehouseForm); this.notify('Gudang berhasil diperbarui'); }
      else { this.warehouses.push({ id:'wh' + Date.now(), code:'ST-' + String(this.warehouses.length + 1).padStart(4,'0'), ...this.warehouseForm }); this.notify('Gudang baru berhasil ditambahkan'); }
      this.warehouseModalOpen = false;
    },

    /* ---------- ORDER CUSTOMER / CREATE ---------- */
    orderViewTab: 'schedule', orderCustomerSearch: '', orderDate: '2026-10-26', selectedCustomerId: 'c1',
    get filteredOrderCustomers() {
      const q = this.orderCustomerSearch.toLowerCase();
      return this.customers.filter(c => {
        if (this.role === 'Sales' && c.sales !== 'Fahri') return false;
        if (q && !(c.name + ' ' + c.code + ' ' + c.address).toLowerCase().includes(q)) return false;
        if (this.orderViewTab === 'schedule' && c.day !== this.weekdayName(this.orderDate)) return false;
        return true;
      });
    },
    isOrderedToday(c) {
      return this.orders.some(o => o.customerId === c.id && o.schedule === this.orderDate);
    },
    startOrder(c, tab = 'order') {
      this.selectedCustomerId = c.id;
      this.orderTab = tab;
      this.cart = {};
      this.paymentMethod = '';
      this.customDiscount = 0;
      this.orderSearch = '';
      this.go('order-create');
    },
    cameraOpen: false,
    cameraCustomer: null,
    openCamera(c) {
      this.cameraCustomer = c;
      this.cameraOpen = true;
    },
    confirmCamera() {
      const c = this.cameraCustomer;
      this.cameraOpen = false;
      if (c) this.startOrder(c);
    },
    shiftOrderDate(days) {
      const d = new Date(this.orderDate);
      d.setDate(d.getDate() + Number(days));
      this.orderDate = d.toISOString().slice(0, 10);
    },
    get selectedCustomer() { return this.customer(this.selectedCustomerId); },
    cart: {}, orderSearch: '', paymentMethod: '', customDiscount: 0, ppnPercent: 11, orderTab: 'order',
    get filteredOrderProducts() {
      const q = this.orderSearch.toLowerCase();
      return this.products.filter(p => p.status && (!q || (p.name + ' ' + p.code).toLowerCase().includes(q)));
    },
    get orderHistory() { return this.orders.filter(o => o.customerId === this.selectedCustomerId); },
    qty(id) { return Number(this.cart[id] || 0); },
    setQty(id, value) {
      const v = Math.max(0, Number(value) || 0);
      this.cart = { ...this.cart, [id]: v };
    },
    incQty(id, delta) { this.setQty(id, this.qty(id) + delta); },
    priceFor(p) { return this.selectedCustomer.priceType === 'out' ? p.outSale : p.inSale; },
    bestPromo(productId, type) {
      return this.promos
        .filter(p => p.productId === productId && p.bonusType === type && this.qty(productId) >= p.minAmount)
        .sort((a,b) => b.minAmount - a.minAmount)[0] || null;
    },
    get cartRows() {
      return this.products.filter(p => this.qty(p.id) > 0).map(p => {
        const qty = this.qty(p.id);
        const price = this.priceFor(p);
        const total = price * qty;
        const promo = this.bestPromo(p.id, 'price');
        const discPercent = promo ? Number(promo.discountPrice) : 0;
        const discValue = total * discPercent / 100;
        return { product:p, qty, price, total, promo, discPercent, discValue, totalAfter: total - discValue };
      });
    },
    get cartBonuses() {
      const rows = [];
      this.products.filter(p => this.qty(p.id) > 0).forEach(p => {
        const promo = this.bestPromo(p.id, 'product');
        if (!promo || !promo.bonusProductId) return;
        const times = promo.multiple ? Math.floor(this.qty(p.id) / promo.minAmount) : 1;
        const amount = Number(promo.bonusAmount) * times;
        if (amount > 0) rows.push({ promo, product:this.product(promo.bonusProductId), qty:amount });
      });
      return rows;
    },
    get cartCount() { return this.products.reduce((s,p) => s + this.qty(p.id), 0); },
    get cartSubtotal() { return this.cartRows.reduce((s,r) => s + r.total, 0); },
    get cartDiscount() { return this.cartRows.reduce((s,r) => s + r.discValue, 0); },
    get customDiscountValue() { return (this.cartSubtotal - this.cartDiscount) * (Number(this.customDiscount) || 0) / 100; },
    get cartTax() { return (this.cartSubtotal - this.cartDiscount - this.customDiscountValue) * this.ppnPercent / 100; },
    get cartTotal() { return this.cartSubtotal - this.cartDiscount - this.customDiscountValue + this.cartTax; },
    orderPreviewOpen: false,
    openOrderPreview() {
      if (!this.cartCount) { this.notify('Tambahkan minimal 1 produk terlebih dahulu', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      this.orderPreviewOpen = true;
    },
    submitOrder() {
      if (!this.cartCount) { this.notify('Keranjang masih kosong', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      const c = this.selectedCustomer;
      const id = 'o' + Date.now();
      const code = 'INV/2026/10/' + String(this.orders.length + 49).padStart(4,'0');
      const items = this.cartRows.map(r => ({ productId:r.product.id, qty:r.qty, price:r.price, discPercent:r.discPercent }));
      this.cartBonuses.forEach(b => items.push({ productId:b.product.id, qty:b.qty, price:0, discPercent:100, bonus:true }));
      const order = { id, code, customerId:c.id, sales:c.sales, orderBy:this.role === 'Sales' ? c.sales : 'Admin', status:'pending', payment:'unpaid', delivery:'full', radius:'onsite', date:'2026-10-26', schedule:this.orderDate, dueDate:'2026-11-09', subtotal:this.cartSubtotal, discount:this.cartDiscount, tax:this.cartTax, total:this.cartTotal, customDiscount:Number(this.customDiscount)||0, paymentMethod:this.paymentMethod, items };
      this.orders.unshift(order);
      this.selectedOrderId = id;
      this.orderPreviewOpen = false;
      this.cart = {}; this.paymentMethod = ''; this.customDiscount = 0;
      this.notify('Order berhasil dibuat');
      this.go(this.role === 'Sales' ? 'order-success' : 'invoice');
    },
    get selectedOrder() { return this.order(this.selectedOrderId) || this.orders[0] || {}; },
    selectedOrderId: 'o1',
    viewOrder(id) { this.selectedOrderId = id; this.go('order-detail'); },
    viewInvoice(id) { this.selectedOrderId = id; this.go('invoice'); },
    confirmOrder(o) { o.status = 'already'; if (!o.dueDate) o.dueDate = '2026-11-09'; this.notify('Order dikonfirmasi dan siap dikirim'); },
    orderItemsTotal(order) { return (order.items || []).reduce((s,i) => s + i.price * i.qty * (1 - (i.discPercent||0)/100), 0); },
    itemTotal(item) { return item.price * item.qty * (1 - (item.discPercent || 0) / 100); },
    itemCountText(order) { return (order.items || []).reduce((s,i) => s + i.qty, 0) + ' item'; },

    /* ---------- ORDER LIST ---------- */
    orderSearch: '', orderStatus: '', selectedOrderIds: [], orderBulk: false,
    get filteredOrders() {
      const q = this.orderSearch.toLowerCase();
      return this.orders.filter(o => {
        if (q && !(o.code + ' ' + this.customerName(o.customerId)).toLowerCase().includes(q)) return false;
        if (this.orderStatus && o.status !== this.orderStatus) return false;
        return true;
      });
    },
    toggleOrder(id) {
      this.selectedOrderIds = this.selectedOrderIds.includes(id) ? this.selectedOrderIds.filter(x => x !== id) : [...this.selectedOrderIds, id];
    },
    toggleAllOrders() {
      this.selectedOrderIds = this.selectedOrderIds.length === this.filteredOrders.length ? [] : this.filteredOrders.map(o => o.id);
    },
    bulkConfirm() {
      this.orders.forEach(o => { if (this.selectedOrderIds.includes(o.id) && o.status === 'pending') { o.status = 'already'; o.dueDate = '2026-11-09'; } });
      this.notify('Order terpilih berhasil dikonfirmasi');
      this.selectedOrderIds = [];
    },
    bulkDelete() {
      this.orders = this.orders.filter(o => !(this.selectedOrderIds.includes(o.id) && ['pending','already'].includes(o.status)));
      this.notify('Order terpilih dihapus');
      this.selectedOrderIds = [];
    },
    deleteOrder(o) { this.askConfirm('delete-order', o.id, 'Hapus order?', 'Order ' + o.code + ' akan dihapus dari daftar demo.'); },

    /* ---------- DELIVERY ---------- */
    deliverySearch: '', deliveryStatus: '',
    get filteredDeliveries() {
      const q = this.deliverySearch.toLowerCase();
      return this.deliveries.filter(d => {
        if (q && !d.code.toLowerCase().includes(q)) return false;
        if (this.deliveryStatus && d.status !== this.deliveryStatus) return false;
        return true;
      });
    },
    deliveryDraft: { orderIds:[], driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh1', start:'2026-10-26', end:'2026-11-08' },
    deliveryPreviewOpen: false,
    get deliveryCandidates() {
      return this.orders.filter(o => ['already','holding','partial'].includes(o.status));
    },
    get selectedDeliveryOrders() { return this.deliveryDraft.orderIds.map(id => this.order(id)).filter(Boolean); },
    get deliveryDraftTotal() { return this.selectedDeliveryOrders.reduce((s,o) => s + o.total, 0); },
    get canPreviewDelivery() { return this.deliveryDraft.orderIds.length > 0 && this.deliveryDraft.driver && this.deliveryDraft.car && this.deliveryDraft.warehouseId; },
    startDeliveryCreate() {
      this.deliveryDraft = { orderIds:[], driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh1', start:'2026-10-26', end:'2026-11-08' };
      this.go('delivery-create');
    },
    toggleDeliveryOrder(id) {
      const ids = this.deliveryDraft.orderIds;
      this.deliveryDraft.orderIds = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
    },
    openDeliveryPreview() {
      if (!this.canPreviewDelivery) { this.notify('Lengkapi periode, driver, armada, gudang, dan pilih order', 'error'); return; }
      this.deliveryPreviewOpen = true;
    },
    submitDelivery() {
      const id = 'd' + Date.now();
      const d = { id, code:'DO/2026/10/' + String(this.deliveries.length + 16).padStart(4,'0'), orderIds:[...this.deliveryDraft.orderIds], periodStart:this.deliveryDraft.start, periodEnd:this.deliveryDraft.end, driver:this.deliveryDraft.driver, car:this.deliveryDraft.car, warehouseId:this.deliveryDraft.warehouseId, status:'pending', total:this.deliveryDraftTotal, createdBy:'Admin' };
      this.deliveries.unshift(d);
      d.orderIds.forEach(oid => { const o = this.order(oid); if (o) o.status = 'shipping'; });
      this.selectedDeliveryId = id;
      this.deliveryPreviewOpen = false;
      this.notify('Surat jalan berhasil dibuat');
      this.go('delivery-invoice');
    },
    selectedDeliveryId: 'd1',
    get selectedDelivery() { return this.delivery(this.selectedDeliveryId) || this.deliveries[0] || {}; },
    deliveryOrders(d = null) { const data = d || this.selectedDelivery; return (data.orderIds || []).map(id => this.order(id)).filter(Boolean); },
    deliveryTotal(d = null) { return this.deliveryOrders(d).reduce((s,o) => s + o.total, 0); },
    deliveryInvoiceRows(d = null) {
      const rows = [];
      this.deliveryOrders(d).forEach(order => (order.items || []).forEach(item => rows.push({ order, item })));
      return rows;
    },
    deliveryWarehouse(d) { return (this.warehouses.find(w => w.id === d.warehouseId) || {}).name || '-'; },
    startDeliveryCheck(d, readonly = false) {
      this.selectedDeliveryId = d.id;
      this.deliveryReadOnly = readonly;
      this.checkRows = this.deliveryOrders(d).map(o => ({ orderId:o.id, code:o.code, customerId:o.customerId, date:o.schedule, amount:o.total, cash:0, transfer:0 }));
      this.page = readonly ? 'delivery-detail' : 'delivery-check';
      window.scrollTo({ top: 0 });
    },
    deliveryReadOnly: false,
    checkRows: [],
    receivableFor(row) { return Math.max(0, row.amount - (Number(row.cash)||0) - (Number(row.transfer)||0)); },
    submitDeliveryCheck() {
      const d = this.selectedDelivery;
      let createdReceivable = false;
      this.checkRows.forEach(row => {
        const o = this.order(row.orderId);
        if (!o) return;
        const unpaid = this.receivableFor(row);
        o.status = 'success';
        o.payment = unpaid > 0 ? 'partial' : 'paid';
        const existing = this.receivables.find(r => r.orderId === o.id);
        if (existing) {
          existing.cash += Number(row.cash) || 0;
          existing.transfer += Number(row.transfer) || 0;
          existing.unpaid = Math.max(0, existing.unpaid - ((Number(row.cash) || 0) + (Number(row.transfer) || 0)));
        } else if (unpaid > 0) {
          this.receivables.unshift({ id:'rc' + Date.now() + Math.random(), orderId:o.id, orderCode:o.code, customerId:o.customerId, sales:o.sales, schedule:o.schedule, due:'2026-11-09', total:o.total, cash:Number(row.cash)||0, transfer:Number(row.transfer)||0, unpaid });
          createdReceivable = true;
        }
      });
      d.status = 'success';
      this.notify('Surat jalan berhasil diselesaikan');
      this.go('deliveries');
    },
    removeOrderFromDelivery(o) { this.notify('Order ' + o.code + ' dikeluarkan dari surat jalan (demo)'); },
    deleteDelivery(d) { this.askConfirm('delete-delivery', d.id, 'Hapus surat jalan?', 'Surat jalan ' + d.code + ' akan dihapus.'); },
    openDeliveryInvoice(id) { this.selectedDeliveryId = id; this.go('delivery-invoice'); },

    /* ---------- RETURN ---------- */
    returnSearch: '', returnStatus: '',
    get filteredReturns() {
      const q = this.returnSearch.toLowerCase();
      return this.returns.filter(r => {
        if (q && !(r.code + ' ' + r.name + ' ' + this.customerName(this.order(r.orderId).customerId)).toLowerCase().includes(q)) return false;
        if (this.returnStatus && r.status !== this.returnStatus) return false;
        return true;
      });
    },
    returnModalOpen: false, returnForm: { orderId:'', name:'', productId:'', qty:1, type:'change', condition:'good', description:'' },
    openReturn(o) {
      const item = (o.items || [])[0] || {};
      this.returnForm = { orderId:o.id, name:item.productId ? this.productName(item.productId) : '', productId:item.productId || '', qty:1, type:'change', condition:'good', description:'' };
      this.returnModalOpen = true;
    },
    saveReturn() {
      const o = this.order(this.returnForm.orderId);
      if (!o) { this.notify('Order tidak ditemukan', 'error'); return; }
      const item = (o.items || []).find(i => i.productId === this.returnForm.productId) || (o.items || [])[0] || {};
      const price = (item.price || 0) * (1 - (item.discPercent||0)/100) * Number(this.returnForm.qty);
      this.returns.unshift({ id:'r' + Date.now(), code:'RTN/2026/10/' + String(this.returns.length + 4).padStart(4,'0'), orderId:o.id, name:this.returnForm.name, qty:Number(this.returnForm.qty), price, type:this.returnForm.type, condition:this.returnForm.condition, action:this.returnForm.type === 'change' ? 'discard' : 'return', status:'pending', description:this.returnForm.description, by:'Admin', date:'2026-10-26' });
      this.returnModalOpen = false;
      this.notify('Return barang berhasil ditambahkan');
    },
    processReturn(r) { this.askConfirm('process-return', r.id, 'Proses return?', 'Return ' + r.code + ' akan diproses dan status barang diperbarui.', false); },
    deleteReturn(r) { this.askConfirm('delete-return', r.id, 'Batalkan return?', 'Data return ' + r.code + ' akan dihapus.'); },

    /* ---------- STOCK ---------- */
    stockTab: 'active', stockSearch: '',
    stockModalOpen: false, stockForm: { productId:'p1', warehouseId:'wh1', date:'2026-10-26', qty:10, description:'' },
    opnameModalOpen: false, opnameForm: { productId:'p1', warehouseId:'wh1', date:'2026-10-26', qty:1, description:'' },
    get filteredStockProducts() {
      const q = this.stockSearch.toLowerCase();
      return this.products.filter(p => !q || (p.name + ' ' + p.code).toLowerCase().includes(q));
    },
    openStock() { this.stockForm = { productId:'p1', warehouseId:'wh1', date:'2026-10-26', qty:10, description:'' }; this.stockModalOpen = true; },
    saveStock() {
      const p = this.product(this.stockForm.productId);
      if (!p.id) return;
      p.stock += Number(this.stockForm.qty) || 0;
      this.stockHistory.unshift({ id:'sh' + Date.now(), code:'AS/2026/10/' + String(this.stockHistory.length + 5).padStart(4,'0'), date:this.stockForm.date, warehouseId:this.stockForm.warehouseId, description:this.stockForm.description || 'Stock masuk', by:'Admin', items:[{ productId:p.id, qty:Number(this.stockForm.qty)||0 }] });
      this.stockModalOpen = false;
      this.notify('Stock barang berhasil ditambahkan');
    },
    openOpname() { this.opnameForm = { productId:'p1', warehouseId:'wh1', date:'2026-10-26', qty:1, description:'' }; this.opnameModalOpen = true; },
    saveOpname() {
      const p = this.product(this.opnameForm.productId);
      if (!p.id) return;
      const qty = Number(this.opnameForm.qty) || 0;
      p.stock += qty;
      this.opnames.unshift({ id:'op' + Date.now(), code:'OP/2026/10/' + String(this.opnames.length + 4).padStart(4,'0'), date:this.opnameForm.date, productId:p.id, warehouseId:this.opnameForm.warehouseId, qty, description:this.opnameForm.description || 'Penyesuaian stok', by:'Admin' });
      this.opnameModalOpen = false;
      this.notify('Stock opname berhasil disimpan');
    },
    warehouseName(id) { return (this.warehouses.find(w => w.id === id) || {}).name || '-'; },
    stockItemQty(item) { return item.qty; },
    deleteStockHistory(s) { this.askConfirm('delete-stock', s.id, 'Hapus riwayat stock?', 'Dokumen ' + s.code + ' akan dihapus.'); },
    deleteOpname(o) { this.askConfirm('delete-opname', o.id, 'Hapus opname?', 'Dokumen ' + o.code + ' akan dihapus.'); },

    /* ---------- FINANCE ---------- */
    financeTab: 'income', financeMasterTab: 'income', financeSearch: '', financeTypeSearch: '',
    financeModalOpen: false, financeTypeModalOpen: false, financeEditId: null, financeTypeEditId: null,
    financeForm: { typeId:'ti1', amount:0, date:'2026-10-26', description:'', proof:'' },
    financeTypeForm: { name:'', description:'' },
    get filteredIncomes() {
      const q = this.financeSearch.toLowerCase();
      return this.incomes.filter(i => !q || (i.code + ' ' + i.description + ' ' + this.financeTypeName(i.typeId)).toLowerCase().includes(q));
    },
    get filteredExpenses() {
      const q = this.financeSearch.toLowerCase();
      return this.expenses.filter(i => !q || (i.code + ' ' + i.description + ' ' + this.financeTypeName(i.typeId)).toLowerCase().includes(q));
    },
    get filteredFinance() { return this.financeTab === 'income' ? this.filteredIncomes : this.filteredExpenses; },
    financeTypeName(id) {
      return [...this.financeTypes.income, ...this.financeTypes.expense].find(t => t.id === id)?.name || '-';
    },
    openFinance(kind, item = null) {
      this.financeTab = kind;
      this.financeEditId = item ? item.id : null;
      const types = kind === 'income' ? this.financeTypes.income : this.financeTypes.expense;
      this.financeForm = item ? { typeId:item.typeId, amount:item.amount, date:item.date, description:item.description, proof:item.proof } : { typeId:types[0]?.id || '', amount:0, date:'2026-10-26', description:'', proof:'' };
      this.financeModalOpen = true;
    },
    saveFinance() {
      const list = this.financeTab === 'income' ? this.incomes : this.expenses;
      const prefix = this.financeTab === 'income' ? 'IC' : 'OC';
      if (this.financeEditId) {
        Object.assign(list.find(i => i.id === this.financeEditId), { ...this.financeForm, amount:Number(this.financeForm.amount) });
        this.notify('Transaksi berhasil diperbarui');
      } else {
        list.unshift({ id:'f' + Date.now(), code:prefix + '/2026/10/' + String(list.length + 5).padStart(4,'0'), ...this.financeForm, amount:Number(this.financeForm.amount), by:'Admin' });
        this.notify('Transaksi berhasil ditambahkan');
      }
      this.financeModalOpen = false;
    },
    openFinanceType(kind, item = null) {
      this.financeMasterTab = kind;
      this.financeTypeEditId = item ? item.id : null;
      this.financeTypeForm = item ? { name:item.name, description:item.description } : { name:'', description:'' };
      this.financeTypeModalOpen = true;
    },
    saveFinanceType() {
      const list = this.financeTypes[this.financeMasterTab];
      const prefix = this.financeMasterTab === 'income' ? 'IC' : 'OC';
      if (this.financeTypeEditId) { Object.assign(list.find(t => t.id === this.financeTypeEditId), this.financeTypeForm); this.notify('Jenis transaksi diperbarui'); }
      else { list.push({ id:'t' + Date.now(), code:prefix + '-' + String(list.length + 1).padStart(4,'0'), ...this.financeTypeForm }); this.notify('Jenis transaksi ditambahkan'); }
      this.financeTypeModalOpen = false;
    },

    /* ---------- RECEIVABLES / COLLECTIONS ---------- */
    receivableTab: 'active', receivableSearch: '', receivableSales: '',
    get activeReceivables() { return this.receivables.filter(r => r.unpaid > 0); },
    get paidReceivables() { return this.receivables.filter(r => r.unpaid <= 0); },
    get filteredReceivables() {
      const q = this.receivableSearch.toLowerCase();
      return this.activeReceivables.filter(r => {
        if (q && !(r.orderCode + ' ' + this.customerName(r.customerId)).toLowerCase().includes(q)) return false;
        if (this.receivableSales && r.sales !== this.receivableSales) return false;
        return true;
      });
    },
    get totalUnpaid() { return this.activeReceivables.reduce((s,r) => s + r.unpaid, 0); },
    collectionSales: '', collectionDate: '2026-10-26', collectionIds: [], collectionPreviewOpen: false,
    get collectionCandidates() {
      return this.activeReceivables.filter(r => !this.collectionSales || r.sales === this.collectionSales);
    },
    get selectedCollectionReceivables() { return this.collectionIds.map(id => this.receivable(id)).filter(Boolean); },
    get collectionDraftTotal() { return this.selectedCollectionReceivables.reduce((s,r) => s + r.total, 0); },
    get collectionDraftUnpaid() { return this.selectedCollectionReceivables.reduce((s,r) => s + r.unpaid, 0); },
    startCollectionCreate() {
      this.collectionSales = 'Fahri'; this.collectionDate = '2026-10-26'; this.collectionIds = [];
      this.go('collection-create');
    },
    toggleCollection(id) {
      this.collectionIds = this.collectionIds.includes(id) ? this.collectionIds.filter(x => x !== id) : [...this.collectionIds, id];
    },
    openCollectionPreview() {
      if (!this.collectionSales) { this.notify('Pilih sales terlebih dahulu', 'error'); return; }
      if (!this.collectionIds.length) { this.notify('Pilih minimal 1 piutang', 'error'); return; }
      this.collectionPreviewOpen = true;
    },
    submitCollection() {
      const id = 'cl' + Date.now();
      const c = { id, code:'CL/2026/10/' + String(this.collections.length + 4).padStart(4,'0'), sales:this.collectionSales, date:this.collectionDate, status:'pending', itemIds:[...this.collectionIds], total:this.collectionDraftTotal, paid:0, unpaid:this.collectionDraftUnpaid };
      this.collections.unshift(c);
      this.selectedCollectionId = id;
      this.collectionPreviewOpen = false;
      this.notify('Surat jalan penagihan berhasil dibuat');
      this.startCollection(c);
    },
    selectedCollectionId: 'cl1',
    collectionPayments: {},
    get selectedCollection() { return this.collections.find(c => c.id === this.selectedCollectionId) || this.collections[0] || {}; },
    collectionRows(c = null) { const data = c || this.selectedCollection; return (data.itemIds || []).map(id => this.receivable(id)).filter(Boolean); },
    startCollection(c) {
      this.selectedCollectionId = c.id;
      this.collectionPayments = {};
      this.collectionRows(c).forEach(r => { this.collectionPayments[r.id] = { cash:0, transfer:0 }; });
      this.go('collection-confirm');
    },
    collectionPayment(r) { return this.collectionPayments[r.id] || { cash:0, transfer:0 }; },
    setCollectionPayment(r, field, value) {
      const max = Number(r.unpaid) || 0;
      const current = this.collectionPayment(r);
      let cash = Number(current.cash) || 0;
      let transfer = Number(current.transfer) || 0;
      if (field === 'cash') cash = Math.min(Math.max(0, Number(value) || 0), max);
      if (field === 'transfer') transfer = Math.min(Math.max(0, Number(value) || 0), max);
      if (cash + transfer > max) { if (field === 'cash') cash = max - transfer; else transfer = max - cash; }
      this.collectionPayments = { ...this.collectionPayments, [r.id]: { cash, transfer } };
    },
    collectionReceivable(r) { const p = this.collectionPayment(r); return Math.max(0, Number(r.unpaid) - p.cash - p.transfer); },
    get collectionPayTotal() { return this.collectionRows().reduce((s,r) => s + (this.collectionPayment(r).cash || 0) + (this.collectionPayment(r).transfer || 0), 0); },
    submitCollectionPayment() {
      const c = this.selectedCollection;
      const paidNow = this.collectionRows(c).reduce((s,r) => { const p = this.collectionPayment(r); return s + (Number(p.cash) || 0) + (Number(p.transfer) || 0); }, 0);
      this.collectionRows(c).forEach(r => {
        const p = this.collectionPayment(r);
        const paid = (Number(p.cash) || 0) + (Number(p.transfer) || 0);
        r.cash += Number(p.cash) || 0;
        r.transfer += Number(p.transfer) || 0;
        r.unpaid = Math.max(0, r.unpaid - paid);
        if (paid > 0) this.payments.unshift({ id:'pm' + Date.now() + Math.random(), orderId:r.orderId, orderCode:r.orderCode, customerId:r.customerId, amount:paid, date:this.collectionDate, proof:'', by:'Admin' });
      });
      c.paid = (Number(c.paid) || 0) + paidNow;
      c.unpaid = Math.max(0, c.unpaid - paidNow);
      c.status = 'success';
      this.notify('Penagihan berhasil diselesaikan');
      this.receivableTab = 'collections';
      this.go('receivables');
    },
    paymentModalOpen: false, paymentForm: { proof:'', description:'' }, selectedPaymentId: null,
    openPayment(p) { this.selectedPaymentId = p.id; this.paymentForm = { proof:'', description:'' }; this.paymentModalOpen = true; },
    savePaymentProof() {
      const p = this.payments.find(x => x.id === this.selectedPaymentId);
      if (p) p.proof = this.paymentForm.proof || 'bukti-pembayaran.jpg';
      this.paymentModalOpen = false;
      this.notify('Bukti pembayaran berhasil diunggah');
    },

    /* ---------- USERS / ROLES ---------- */
    userModalOpen: false, userEditId: null, userSearch: '',
    userForm: { name:'', username:'', email:'', password:'', roles:['Sales'] },
    roleModalOpen: false, roleEditId: null,
    roleForm: { name:'', permissions:[] },
    get filteredUsers() {
      const q = this.userSearch.toLowerCase();
      return this.users.filter(u => !q || (u.name + ' ' + u.username + ' ' + u.email).toLowerCase().includes(q));
    },
    openUser(u = null) {
      this.userEditId = u ? u.id : null;
      this.userForm = u ? { name:u.name, username:u.username, email:u.email, password:'', roles:u.roles } : { name:'', username:'', email:'', password:'', roles:['Sales'] };
      this.userModalOpen = true;
    },
    saveUser() {
      if (!this.userForm.name || !this.userForm.username) { this.notify('Nama dan username wajib diisi', 'error'); return; }
      if (this.userEditId) { Object.assign(this.users.find(u => u.id === this.userEditId), { name:this.userForm.name, username:this.userForm.username, email:this.userForm.email, roles:this.userForm.roles }); this.notify('Pengguna berhasil diperbarui'); }
      else { this.users.unshift({ id:'u' + Date.now(), code:'U-' + String(this.users.length + 1).padStart(4,'0'), name:this.userForm.name, username:this.userForm.username, email:this.userForm.email, roles:this.userForm.roles }); this.notify('Pengguna baru berhasil ditambahkan'); }
      this.userModalOpen = false;
    },
    toggleUserRole(name) {
      const r = this.userForm.roles;
      this.userForm.roles = r.includes(name) ? r.filter(x => x !== name) : [...r, name];
    },
    openRole(r = null) {
      this.roleEditId = r ? r.id : null;
      this.roleForm = r ? { name:r.name, permissions:[...r.permissions] } : { name:'', permissions:[] };
      this.roleModalOpen = true;
    },
    saveRole() {
      if (!this.roleForm.name) { this.notify('Nama role wajib diisi', 'error'); return; }
      if (this.roleEditId) { const r = this.roles.find(x => x.id === this.roleEditId); r.name = this.roleForm.name; r.permissions = [...this.roleForm.permissions]; this.notify('Role berhasil diperbarui'); }
      else { this.roles.push({ id:'role' + Date.now(), name:this.roleForm.name, guard:'web', members:0, permissions:[...this.roleForm.permissions] }); this.notify('Role baru berhasil ditambahkan'); }
      this.roleModalOpen = false;
    },
    togglePermission(name) {
      const p = this.roleForm.permissions;
      this.roleForm.permissions = p.includes(name) ? p.filter(x => x !== name) : [...p, name];
    },

    /* ---------- REPORT / SETTINGS ---------- */
    reportOpen: false,
    reportForm: { from:'', to:'', sales:'', customer:'' },
    reportCustomers() { return this.customers.filter(c => !this.reportForm.sales || c.sales === this.reportForm.sales); },
    downloadReport() { this.reportOpen = false; this.notify('Laporan penjualan berhasil diunduh (demo)'); },
    settingsTab: 'profile',
    settingsForm: { name:'Admin', username:'admin', email:'admin@abimineral.com' },
    passwordForm: { current:'', next:'', confirmation:'' },
    saveProfile() { this.notify('Profil berhasil disimpan'); },
    savePassword() {
      if (this.passwordForm.next !== this.passwordForm.confirmation) { this.notify('Konfirmasi kata sandi tidak sama', 'error'); return; }
      this.notify('Kata sandi berhasil diperbarui');
      this.passwordForm = { current:'', next:'', confirmation:'' };
    },

    /* ---------- MISC ---------- */
    get todayLabel() { return this.dateLong(this.demoToday); },
    get formatOrderCount() { return this.orders.length; },
    get displayOrderCount() { return this.orders.filter(o => !['cancel','failed'].includes(o.status)).length; },
    get displayDeliverySuccess() { return this.deliveries.filter(d => d.status === 'success').length; },
    get displayReturnPending() { return this.returns.filter(r => r.status === 'pending').length; }
  }
}
