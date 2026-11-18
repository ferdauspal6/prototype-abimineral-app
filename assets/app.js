const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

const STORE_KEY = 'abi-mineral-demo';
const STORE_VERSION = 11;
const DEMO_PASSWORD = 'rahasia123';

const DOMAIN_KEYS = [
  'customers', 'products', 'promos', 'orders', 'deliveries', 'returns', 'warehouses',
  'stockHistory', 'opnames', 'incomes', 'expenses', 'receivables',
  'collections', 'payments', 'users', 'roles', 'monthlyHistory',
  'categories', 'materials', 'suppliers', 'purchaseRequests', 'units', 'purchaseOrders',
  'receipts', 'stockMovements', 'payables', 'accounts', 'journals'
];

const PAGE_PERMISSION = {
  dashboard: 'Dashboard',
  customers: 'Master Pelanggan',
  promos: 'Master Promo',
  'order-customer': 'Order',
  'order-create': 'Order',
  'order-success': 'Order',
  orders: 'Order',
  'order-detail': 'Order',
  invoice: 'Order',
  deliveries: 'Order',
  'delivery-create': 'Order',
  'delivery-check': 'Order',
  'delivery-detail': 'Order',
  'delivery-invoice': 'Order',
  returns: 'Order',
  warehouses: 'Master Gudang',
  products: 'Master Produk',
  materials: 'Master Barang',
  suppliers: 'Master Supplier',
  'purchase-requests': 'Purchase Request',
  'purchase-request-create': 'Purchase Request',
  'purchase-request-preview': 'Purchase Request',
  'purchase-orders': 'Purchase Order',
  'purchase-order-create': 'Purchase Order',
  'purchase-order-preview': 'Purchase Order',
  receipts: 'Penerimaan Barang',
  'receipt-create': 'Penerimaan Barang',
  'receipt-preview': 'Penerimaan Barang',
  coa: 'Chart of Accounts',
  journals: 'Jurnal Umum',
  'journal-create': 'Jurnal Umum',
  ledger: 'Laporan Keuangan',
  'trial-balance': 'Laporan Keuangan',
  stock: 'Stock',
  receivables: 'Piutang',
  'collection-create': 'Piutang',
  'collection-confirm': 'Piutang',
  'finance-income': 'Pendapatan Lainnya',
  'finance-expense': 'Pengeluaran Lainnya',
  users: 'Kelola Role & Pengguna',
  roles: 'Kelola Role & Pengguna',
  settings: null
};

const PAGES = Object.keys(PAGE_PERMISSION).concat(['login']);

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/* ---------- DATE & CODE HELPERS ---------- */
function pad2(n) { return String(n).padStart(2, '0'); }
function isoLocal(date) {
  return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
}
function todayISO() { return isoLocal(new Date()); }
function shiftISO(iso, days) {
  const d = new Date((iso || todayISO()) + 'T12:00:00');
  d.setDate(d.getDate() + (Number(days) || 0));
  return isoLocal(d);
}
function monthKeyOffset(months) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + Number(months || 0));
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1);
}
function monthShortOf(key) {
  const parts = String(key || '').split('-');
  return MONTH_SHORT[Number(parts[1]) - 1] || '';
}
function docCode(prefix, iso, seq) {
  const parts = String(iso || todayISO()).split('-');
  return prefix + '/' + parts[0] + '/' + parts[1] + '/' + String(seq).padStart(4, '0');
}
function nextDocSeq(list, prefix, iso) {
  const parts = String(iso || todayISO()).split('-');
  const re = new RegExp('^' + prefix + '/' + parts[0] + '/' + parts[1] + '/(\\d+)$');
  return (list || []).reduce((max, item) => {
    const match = re.exec((item && item.code) || '');
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0) + 1;
}
function nextSimpleCode(list, prefix, digits) {
  const pad = digits || 4;
  const max = (list || []).reduce((m, item) => {
    const raw = String((item && item.code) || '');
    if (!raw.startsWith(prefix)) return m;
    const n = Number(raw.slice(prefix.length).replace(/\D/g, ''));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return prefix + String(max + 1).padStart(pad, '0');
}
function niceMax(value) {
  const v = Number(value) || 0;
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
  const factor = steps.find(step => n <= step) || 10;
  return factor * pow;
}

/* ---------- SEED DATA (relative to today) ---------- */
function seedData() {
  const T = todayISO();
  const d = (n) => shiftISO(T, n);
  const code = (prefix, date, seq) => docCode(prefix, date, seq);

  const customers = [
    { id:'c1', code:'C-0001', name:'Toko Sumber Rejeki', address:'Jl. Merdeka No. 12, Kersik Putih', channel:'Grosir', week:'Genap', day:'Senin', priceType:'in', phone:'081234567890', sales:'Fahri', lastOrder:null, orderedToday:false, description:'Pelanggan rutin pekan genap' },
    { id:'c2', code:'C-0002', name:'Aneka Jaya', address:'Jl. Pahlawan No. 88, Balikpapan', channel:'Retail', week:'Ganjil', day:'Selasa', priceType:'out', phone:'081298765432', sales:'Zainudin', lastOrder:null, orderedToday:false, description:'' },
    { id:'c3', code:'C-0003', name:'Berkah Mineral', address:'Kawasan Industri Blok C-4', channel:'Grosir', week:'Genap', day:'Senin', priceType:'in', phone:'081355667788', sales:'Fahri', lastOrder:null, orderedToday:false, description:'Pembayaran tempo 14 hari' },
    { id:'c4', code:'C-0004', name:'Sinar Abadi', address:'Jl. Soekarno Hatta No. 45', channel:'Modern Market', week:'Ganjil', day:'Rabu', priceType:'in', phone:'081377889900', sales:'Zainudin', lastOrder:null, orderedToday:false, description:'' },
    { id:'c5', code:'C-0005', name:'Mitra Bangunan', address:'Jl. Ahmad Yani No. 21', channel:'Grosir', week:'Genap', day:'Kamis', priceType:'in', phone:'081255667799', sales:'Fahri', lastOrder:null, orderedToday:false, description:'' },
    { id:'c6', code:'C-0006', name:'Cahaya Putih', address:'Jl. Sudirman No. 9', channel:'Apotik', week:'Ganjil', day:'Jumat', priceType:'in', phone:'081399887766', sales:'Zainudin', lastOrder:null, orderedToday:false, description:'' },
    { id:'c7', code:'C-0007', name:'Toko Sejahtera', address:'Jl. Gatot Subroto No. 3', channel:'Retail', week:'Genap', day:'Sabtu', priceType:'out', phone:'081211223344', sales:'Fahri', lastOrder:null, orderedToday:false, description:'' },
    { id:'c8', code:'C-0008', name:'Grosir Makmur', address:'Jl. Mulawarman No. 17', channel:'Star Outlet', week:'Ganjil', day:'Senin', priceType:'in', phone:'081322334455', sales:'Zainudin', lastOrder:null, orderedToday:false, description:'' }
  ];

  const units = ['Pcs', 'Krt', 'Box', 'Sak', 'Kg', 'Roll', 'Liter', 'Set'];

  const categories = [
    { id:'cat1', code:'KAT-0001', name:'Cup', type:'product', description:'Produk kemasan cup', status:true },
    { id:'cat2', code:'KAT-0002', name:'Botol', type:'product', description:'Produk kemasan botol', status:true },
    { id:'cat3', code:'KAT-0003', name:'Botol', type:'material', description:'Bahan botol kosong', status:true },
    { id:'cat4', code:'KAT-0004', name:'Cup', type:'material', description:'Bahan cup kosong', status:true },
    { id:'cat5', code:'KAT-0005', name:'Label', type:'material', description:'Label dan stiker', status:true },
    { id:'cat6', code:'KAT-0006', name:'Kemasan', type:'material', description:'Karton dan kemasan', status:true }
  ];

  const products = [
    { id:'p1', code:'ABI-0001', name:'Abi Mineral 220ml - (CUP)', categoryId:'cat1', minStock:20, unit:'Krt', cost:10000, inSale:22000, outSale:24000, stock:100, status:true },
    { id:'p2', code:'ABI-0002', name:'ABI MINERAL 330 ML(BOTOL)', categoryId:'cat2', minStock:20, unit:'Krt', cost:16000, inSale:39000, outSale:40000, stock:100, status:true },
    { id:'p3', code:'ABI-0003', name:'ABI MINERAL 600 ML(BOTOL)', categoryId:'cat2', minStock:20, unit:'Krt', cost:17600, inSale:42000, outSale:43000, stock:100, status:true }
  ];

  const materials = [
    { id:'mat1', code:'BRG-0001', name:'Botol PET 600 ml', categoryId:'cat3', unit:'Pcs', purchasePrice:800, minStock:1000, stock:0, status:true, description:'Botol kosong 600 ml' },
    { id:'mat2', code:'BRG-0002', name:'Cup 220 ml', categoryId:'cat4', unit:'Pcs', purchasePrice:250, minStock:2000, stock:0, status:true, description:'Cup kosong 220 ml' },
    { id:'mat3', code:'BRG-0003', name:'Label 330 ml', categoryId:'cat5', unit:'Pcs', purchasePrice:100, minStock:3000, stock:0, status:true, description:'Label botol 330 ml' },
    { id:'mat4', code:'BRG-0004', name:'Karton Box', categoryId:'cat6', unit:'Pcs', purchasePrice:3500, minStock:300, stock:0, status:true, description:'Karton kemasan produk' }
  ];

  materials.forEach(material => {
    material.stockValue = Number(material.stock || 0) * Number(material.purchasePrice || 0);
    material.avgCost = Number(material.purchasePrice) || 0;
  });

  const suppliers = [
    { id:'sup1', code:'SUP-0001', name:'PT Sumber Kemasan', contact:'Budi Hartono', phone:'081122334455', email:'sales@sumberkemasan.co.id', address:'Kawasan Industri Blok A-12, Balikpapan', paymentTerms:'30 hari', status:true, notes:'Supplier botol dan cup' },
    { id:'sup2', code:'SUP-0002', name:'CV Aneka Botol', contact:'Siti Rahma', phone:'081255667788', email:'order@anekabotol.co.id', address:'Jl. Soekarno Hatta No. 77, Balikpapan', paymentTerms:'14 hari', status:true, notes:'' },
    { id:'sup3', code:'SUP-0003', name:'PT Cetak Label Nusantara', contact:'Andi Wijaya', phone:'081399887766', email:'produksi@cetaklabel.co.id', address:'Jl. Mulawarman No. 45, Samarinda', paymentTerms:'Cash', status:true, notes:'Supplier label dan stiker' }
  ];

  const purchaseRequests = [];
  const purchaseOrders = [];
  const receipts = [];
  const stockMovements = [];
  const payables = [];

  const accounts = [
    { id:'acc1', code:'1-1100', name:'Kas', type:'asset', normalBalance:'debit', parentId:null, isCashBank:true, isSystem:false, isLocked:false, status:true, description:'Kas tunai' },
    { id:'acc2', code:'1-1200', name:'Bank BCA', type:'asset', normalBalance:'debit', parentId:null, isCashBank:true, isSystem:false, isLocked:false, status:true, description:'Rekening bank BCA' },
    { id:'acc3', code:'1-1300', name:'Piutang Usaha', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol piutang pelanggan' },
    { id:'acc4', code:'1-1400', name:'Persediaan', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol persediaan' },
    { id:'acc5', code:'1-1500', name:'Piutang Supplier', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Kelebihan bayar / retur supplier' },
    { id:'acc6', code:'1-1600', name:'Peralatan', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Peralatan operasional' },
    { id:'acc7', code:'2-1100', name:'Utang Usaha', type:'liability', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol utang supplier' },
    { id:'acc8', code:'3-1000', name:'Modal', type:'equity', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Modal pemilik' },
    { id:'acc10', code:'3-3000', name:'Laba Ditahan', type:'equity', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Akumulasi laba' },
    { id:'acc11', code:'4-1000', name:'Pendapatan Penjualan', type:'revenue', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Pendapatan penjualan' },
    { id:'acc12', code:'4-2000', name:'Diskon Penjualan', type:'revenue', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Kontra pendapatan penjualan' },
    { id:'acc18', code:'4-9000', name:'Pendapatan Lain-lain', type:'revenue', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Pendapatan di luar penjualan utama' },
    { id:'acc19', code:'4-9100', name:'Pendapatan Jasa Pengiriman', type:'revenue', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Pendapatan jasa antar barang' },
    { id:'acc20', code:'4-9200', name:'Pendapatan Komisi', type:'revenue', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Komisi dari mitra' },
    { id:'acc13', code:'5-1000', name:'Harga Pokok Penjualan', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'HPP penjualan' },
    { id:'acc14', code:'5-1100', name:'Beban Operasional', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Beban operasional harian' },
    { id:'acc15', code:'5-1200', name:'Beban Gaji', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Beban gaji karyawan' },
    { id:'acc16', code:'5-1300', name:'Beban Transportasi', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'BBM dan transportasi' },
    { id:'acc17', code:'5-1400', name:'Beban Selisih Persediaan', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Selisih stock opname' },
    { id:'acc21', code:'5-1500', name:'Beban Pemeliharaan', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Perawatan gudang dan kendaraan' }
  ];

  const journals = [];

  const promos = [
    { id:'pr1', code:code('PR', d(-2), 1), name:'Promo Grosir 220 ml', productId:'p1', minAmount:24, early:d(-2), final:d(+30), bonusType:'price', discountPrice:5, multiple:false, bonusProductId:null, bonusAmount:0, description:'Potongan 5% untuk pembelian minimal 24 karton ABI Mineral 220 ml.' },
    { id:'pr2', code:code('PR', d(-2), 2), name:'Bonus 600 ml', productId:'p2', minAmount:12, early:d(-2), final:d(+30), bonusType:'product', discountPrice:0, multiple:true, bonusProductId:'p3', bonusAmount:1, description:'Setiap kelipatan 12 karton ABI Mineral 330 ml mendapat 1 karton ABI Mineral 600 ml.' }
  ];

  const orders = [];

  const deliveries = [];
  const returns = [];

  const warehouses = [
    { id:'wh1', code:'ST-0001', name:'Gudang Utama', address:'Jl. Dharma Praja, Kersik Putih' },
    { id:'wh2', code:'ST-0002', name:'Gudang Cabang', address:'Jl. Soekarno Hatta No. 88' },
    { id:'wh3', code:'ST-0003', name:'Gudang Transit', address:'Kawasan Pelabuhan KM 12' }
  ];

  const stockHistory = [];
  const opnames = [];

  const incomes = [];
  const expenses = [];

  const receivables = [];
  const collections = [];
  const payments = [];

  const users = [
    { id:'u1', code:'U-0001', name:'Admin', username:'admin', email:'admin@abimineral.com', password:DEMO_PASSWORD, roles:['Admin'] },
    { id:'u2', code:'U-0002', name:'Fahri', username:'fahri', email:'fahri@abimineral.com', password:DEMO_PASSWORD, roles:['Sales'] },
    { id:'u3', code:'U-0003', name:'Zainudin', username:'zainudin', email:'zainudin@abimineral.com', password:DEMO_PASSWORD, roles:['Sales'] },
    { id:'u4', code:'U-0004', name:'Sari', username:'sari', email:'sari@abimineral.com', password:DEMO_PASSWORD, roles:['Supervisor'] },
    { id:'u5', code:'U-0005', name:'Rina', username:'rina', email:'rina@abimineral.com', password:DEMO_PASSWORD, roles:['Manager'] },
    { id:'u6', code:'U-0006', name:'Developer', username:'developer', email:'developer@abimineral.com', password:DEMO_PASSWORD, roles:['Developer'] }
  ];

  const permissions = ['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Produk','Master Barang','Master Supplier','Purchase Request','Approval PR','Purchase Order','Approval PO','Penerimaan Barang','Stock','Stock Opname','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya','Chart of Accounts','Jurnal Umum','Laporan Keuangan','Kelola Role & Pengguna','Diskon Khusus'];

  const roles = [
    { id:'role1', name:'Admin', guard:'web', members:1, permissions:[...permissions] },
    { id:'role2', name:'Sales', guard:'web', members:2, permissions:['Dashboard','Master Pelanggan','Order'] },
    { id:'role3', name:'Manager', guard:'web', members:1, permissions:['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Produk','Master Barang','Master Supplier','Purchase Request','Approval PR','Purchase Order','Approval PO','Penerimaan Barang','Stock','Stock Opname','Piutang','Pendapatan Lainnya','Pengeluaran Lainnya','Chart of Accounts','Jurnal Umum','Laporan Keuangan'] },
    { id:'role4', name:'Supervisor', guard:'web', members:1, permissions:['Dashboard','Order','Order Admin','Purchase Request','Purchase Order','Penerimaan Barang','Stock','Piutang'] },
    { id:'role5', name:'Developer', guard:'web', members:0, permissions:[...permissions] }
  ];

  const monthlyHistory = [];

  return {
    customers, products, promos, orders, deliveries, returns, warehouses,
    stockHistory, opnames, incomes, expenses, receivables,
    collections, payments, users, roles, monthlyHistory,
    categories, materials, suppliers, purchaseRequests, units, purchaseOrders,
    receipts, stockMovements, payables, accounts, journals, permissions
  };
}

function app() {
  const seed = seedData();

  return {
    /* ---------- SESSION / STORE ---------- */
    page: 'login',
    role: 'Admin',
    collapsed: false,
    mobileMenu: false,
    userMenu: false,
    currentUserId: null,
    sessionPage: null,
    loginError: '',
    storeError: '',
    savedAt: null,
    persistTimer: null,
    pendingImport: null,
    syncing: false,
    toast: { show: false, message: '', type: 'success' },
    toastTimer: null,
    confirm: { open: false, title: '', message: '', action: '', id: null, danger: true },

    /* ---------- DATA ---------- */
    customers: seed.customers,
    products: seed.products,
    promos: seed.promos,
    orders: seed.orders,
    deliveries: seed.deliveries,
    returns: seed.returns,
    warehouses: seed.warehouses,
    stockHistory: seed.stockHistory,
    opnames: seed.opnames,
    incomes: seed.incomes,
    expenses: seed.expenses,
    receivables: seed.receivables,
    collections: seed.collections,
    payments: seed.payments,
    users: seed.users,
    roles: seed.roles,
    permissions: seed.permissions,
    monthlyHistory: seed.monthlyHistory,
    categories: seed.categories,
    materials: seed.materials,
    suppliers: seed.suppliers,
    purchaseRequests: seed.purchaseRequests,
    purchaseOrders: seed.purchaseOrders,
    receipts: seed.receipts,
    stockMovements: seed.stockMovements,
    payables: seed.payables,
    units: seed.units,
    accounts: seed.accounts,
    journals: seed.journals,

    /* ---------- STORE ---------- */
    snapshot() {
      const out = {};
      DOMAIN_KEYS.forEach(key => { out[key] = this[key]; });
      return out;
    },
    seedDefaults() {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => { this[key] = fresh[key]; });
      this.permissions = fresh.permissions;
    },
    saveStore() {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
          version: STORE_VERSION,
          savedAt: Date.now(),
          data: this.snapshot(),
          session: { userId: this.currentUserId, role: this.role },
          ui: {
            page: this.currentUserId ? this.page : null,
            collapsed: this.collapsed,
            selectedOrderId: this.selectedOrderId,
            selectedDeliveryId: this.selectedDeliveryId,
            selectedCollectionId: this.selectedCollectionId
          }
        }));
        this.savedAt = Date.now();
        this.storeError = '';
      } catch (e) {
        this.storeError = 'Penyimpanan browser penuh atau tidak tersedia.';
        if (!this.syncing) this.notify(this.storeError, 'error');
      }
    },
    persist() {
      clearTimeout(this.persistTimer);
      this.persistTimer = setTimeout(() => this.saveStore(), 180);
    },
    loadStore() {
      let raw = null;
      try {
        raw = localStorage.getItem(STORE_KEY);
      } catch (e) {
        this.storeError = 'Browser menonaktifkan localStorage. Data tidak akan tersimpan.';
        return;
      }
      if (!raw) { this.saveStore(); return; }
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
      if (parsed && parsed.version === 2 && parsed.data) {
        this.migrateFromV2(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 3 && parsed.data) {
        this.migrateFromV3(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 4 && parsed.data) {
        this.migrateFromV4(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 5 && parsed.data) {
        this.migrateFromV5(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 6 && parsed.data) {
        this.migrateFromV6(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 7 && parsed.data) {
        this.migrateFromV7(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 8 && parsed.data) {
        this.migrateFromV8(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 9 && parsed.data) {
        this.migrateFromV9(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 10 && parsed.data) {
        this.migrateFromV10(parsed);
        this.saveStore();
        return;
      }
      if (!parsed || parsed.version !== STORE_VERSION || !parsed.data) {
        this.seedDefaults();
        this.saveStore();
        return;
      }
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      if (session.userId) {
        const user = this.users.find(u => u.id === session.userId);
        if (user) {
          this.currentUserId = user.id;
          this.role = (user.roles || [])[0] || session.role || 'Sales';
        }
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        if (parsed.ui.page) this.sessionPage = parsed.ui.page;
        if (parsed.ui.selectedOrderId && this.orders.some(o => o.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && this.deliveries.some(d => d.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && this.collections.some(c => c.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV2(parsed) {
      const fresh = seedData();
      ['customers', 'warehouses', 'users', 'roles', 'incomes'].forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.products = fresh.products;
      this.promos = fresh.promos;
      this.categories = fresh.categories;
      this.materials = fresh.materials;
      this.suppliers = fresh.suppliers;
      this.purchaseRequests = [];
      this.purchaseOrders = [];
      this.accounts = fresh.accounts;
      this.journals = [];
      this.units = fresh.units;
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const mapped = (role.permissions || []).map(permission => permission === 'Master Barang' ? 'Master Produk' : permission);
        const additions = ['Manager'].includes(role.name)
          ? ['Master Produk', 'Master Barang', 'Master Supplier', 'Purchase Request', 'Approval PR', 'Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan']
          : role.name === 'Supervisor' ? ['Purchase Request', 'Purchase Order'] : [];
        return { ...role, permissions: [...new Set([...mapped, ...additions])] };
      });
      this.orders = [];
      this.deliveries = [];
      this.returns = [];
      this.receivables = [];
      this.collections = [];
      this.payments = [];
      this.stockHistory = [];
      this.opnames = [];
      this.incomes = [];
      this.expenses = [];
      this.monthlyHistory = [];
      this.customers = (this.customers || []).map(customer => ({
        ...customer,
        lastOrder: null,
        orderedToday: false
      }));
      this.selectedOrderId = null;
      this.selectedDeliveryId = null;
      this.selectedCollectionId = null;
      this.selectedOrderIds = [];
      this.collectionIds = [];
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
      }
      const transactionPages = [
        'order-detail', 'order-create', 'order-success', 'invoice',
        'delivery-create', 'delivery-check', 'delivery-detail', 'delivery-invoice',
        'collection-create', 'collection-confirm'
      ];
      if (transactionPages.includes(this.sessionPage)) this.sessionPage = 'dashboard';
      this.savedAt = parsed.savedAt || null;
    },
    migrateFromV3(parsed) {
      const fresh = seedData();
      const preserved = [
        'customers', 'promos', 'orders', 'deliveries', 'returns', 'warehouses',
        'stockHistory', 'opnames', 'incomes', 'expenses',
        'receivables', 'collections', 'payments', 'users', 'roles', 'monthlyHistory'
      ];
      preserved.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.products = (parsed.data.products || fresh.products).map(product => {
        let categoryId = product.categoryId || null;
        if (!categoryId) {
          if (product.id === 'p1' || product.code === 'ABI-0001') categoryId = 'cat1';
          else if (product.id === 'p2' || product.id === 'p3' || ['ABI-0002','ABI-0003'].includes(product.code)) categoryId = 'cat2';
        }
        return {
          ...product,
          categoryId,
          minStock: product.minStock !== undefined ? product.minStock : 20
        };
      });
      this.categories = fresh.categories;
      this.materials = fresh.materials;
      this.suppliers = fresh.suppliers;
      this.purchaseRequests = [];
      this.purchaseOrders = [];
      this.accounts = fresh.accounts;
      this.journals = [];
      this.units = fresh.units;
      this.permissions = fresh.permissions;
      const addByRole = {
        Admin: ['Master Produk', 'Master Barang', 'Master Supplier', 'Purchase Request', 'Approval PR', 'Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan'],
        Manager: ['Master Produk', 'Master Barang', 'Master Supplier', 'Purchase Request', 'Approval PR', 'Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan'],
        Developer: ['Master Produk', 'Master Barang', 'Master Supplier', 'Purchase Request', 'Approval PR', 'Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan'],
        Supervisor: ['Purchase Request', 'Purchase Order'],
        Sales: []
      };
      this.roles = (this.roles && this.roles.length ? this.roles : fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const mapped = (role.permissions || []).map(permission => permission === 'Master Barang' ? 'Master Produk' : permission);
        return { ...role, permissions: [...new Set([...mapped, ...(addByRole[role.name] || [])])] };
      });
      this.selectedOrderId = null;
      this.selectedDeliveryId = null;
      this.selectedCollectionId = null;
      this.selectedOrderIds = [];
      this.collectionIds = [];
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
      this.savedAt = parsed.savedAt || null;
    },
    migrateFromV4(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.purchaseOrders = [];
      this.accounts = fresh.accounts;
      this.journals = [];
      this.units = parsed.data.units || fresh.units;
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const additions = role.name === 'Manager'
          ? ['Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan']
          : role.name === 'Supervisor' ? ['Purchase Order'] : [];
        return { ...role, permissions: [...new Set([...(role.permissions || []), ...additions])] };
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV5(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.purchaseOrders = [];
      this.accounts = fresh.accounts;
      this.journals = [];
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const additions = role.name === 'Manager'
          ? ['Purchase Order', 'Approval PO', 'Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan']
          : role.name === 'Supervisor' ? ['Purchase Order'] : [];
        return { ...role, permissions: [...new Set([...(role.permissions || []), ...additions])] };
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV6(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.accounts = parsed.data.accounts || fresh.accounts;
      this.journals = parsed.data.journals || [];
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const additions = role.name === 'Manager' ? ['Chart of Accounts', 'Jurnal Umum', 'Laporan Keuangan'] : [];
        return { ...role, permissions: [...new Set([...(role.permissions || []), ...additions])] };
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV7(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const additions = role.name === 'Manager' ? ['Laporan Keuangan'] : [];
        return { ...role, permissions: [...new Set([...(role.permissions || []), ...additions])] };
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV8(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.receipts = parsed.data.receipts || [];
      this.stockMovements = parsed.data.stockMovements || [];
      this.payables = parsed.data.payables || [];
      this.materials = (this.materials || fresh.materials).map(material => ({
        ...material,
        stockValue: material.stockValue !== undefined ? material.stockValue : Number(material.stock || 0) * Number(material.purchasePrice || 0),
        avgCost: material.avgCost !== undefined ? material.avgCost : Number(material.purchasePrice || 0)
      }));
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const additions = ['Manager','Supervisor'].includes(role.name) ? ['Penerimaan Barang'] : [];
        return { ...role, permissions: [...new Set([...(role.permissions || []).filter(permission => permission !== 'Master Keuangan'), ...additions])] };
      });
      this.applyFinanceAccountMigration(parsed);
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV9(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        return { ...role, permissions: (role.permissions || []).filter(permission => permission !== 'Master Keuangan') };
      });
      this.applyFinanceAccountMigration(parsed);
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    migrateFromV10(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      const prive = (this.accounts || []).find(account => account.code === '3-2000');
      const priveUsed = prive && (this.journals || []).some(journal => (journal.lines || []).some(line => line.accountId === prive.id));
      if (prive && !priveUsed) this.accounts = this.accounts.filter(account => account.id !== prive.id);
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        return { ...role, permissions: (role.permissions || []).filter(permission => permission !== 'Master Keuangan') };
      });
      this.savedAt = parsed.savedAt || null;
      const session = parsed.session || {};
      this.currentUserId = null;
      if (session.userId && (this.users || []).some(user => user.id === session.userId)) {
        const user = this.users.find(u => u.id === session.userId);
        this.currentUserId = user.id;
        this.role = (user.roles || [])[0] || session.role || 'Admin';
      }
      if (parsed.ui) {
        this.collapsed = !!parsed.ui.collapsed;
        this.sessionPage = parsed.ui.page || null;
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) {
          this.selectedOrderId = parsed.ui.selectedOrderId;
        }
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) {
          this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        }
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) {
          this.selectedCollectionId = parsed.ui.selectedCollectionId;
        }
      }
    },
    applyFinanceAccountMigration(parsed) {
      const fresh = seedData();
      fresh.accounts.forEach(account => {
        if (!(this.accounts || []).some(item => item.code === account.code)) this.accounts.push(account);
      });
      const typeToCode = {
        ti1:'4-9000', ti2:'4-9100', ti3:'4-9200',
        te1:'5-1100', te2:'5-1200', te3:'5-1300', te4:'5-1500'
      };
      const nameToCode = {
        'Penjualan Lain':'4-9000',
        'Jasa Pengiriman':'4-9100',
        'Komisi':'4-9200',
        'Operasional':'5-1100',
        'Gaji':'5-1200',
        'Transportasi':'5-1300',
        'Maintenance':'5-1500'
      };
      const oldTypes = parsed.data.financeTypes || {};
      [...(oldTypes.income || []), ...(oldTypes.expense || [])].forEach(type => {
        if (type && type.id && nameToCode[type.name]) typeToCode[type.id] = nameToCode[type.name];
      });
      const accountByCode = code => (this.accounts || []).find(account => account.code === code);
      ['4-1000','4-2000','5-1000'].forEach(code => {
        const account = accountByCode(code);
        if (account) {
          account.isSystem = true;
          account.isLocked = true;
        }
      });
      const cashAccount = accountByCode('1-1100') || this.accounts.find(account => account.isCashBank);
      const migrateItem = (item, kind) => {
        if (!item.accountId) {
          const code = typeToCode[item.typeId] || (kind === 'income' ? '4-9000' : '5-1100');
          const account = accountByCode(code) || accountByCode(kind === 'income' ? '4-9000' : '5-1100');
          item.accountId = account ? account.id : '';
        }
        item.cashAccountId = item.cashAccountId || (cashAccount ? cashAccount.id : '');
        delete item.typeId;
        if (!item.journalId && item.accountId && item.amount > 0) {
          item.journalId = this.createFinanceJournal(item, kind);
        }
      };
      this.incomes = (this.incomes || []).map(item => ({ ...item }));
      this.expenses = (this.expenses || []).map(item => ({ ...item }));
      this.incomes.forEach(item => migrateItem(item, 'income'));
      this.expenses.forEach(item => migrateItem(item, 'expense'));
      const prive = (this.accounts || []).find(account => account.code === '3-2000');
      const priveUsed = prive && (this.journals || []).some(journal => (journal.lines || []).some(line => line.accountId === prive.id));
      if (prive && !priveUsed) this.accounts = this.accounts.filter(account => account.id !== prive.id);
    },
    applyExternalStore() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
        if (!parsed || parsed.version !== STORE_VERSION || !parsed.data) return;
        this.syncing = true;
        DOMAIN_KEYS.forEach(key => {
          if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
        });
        this.savedAt = parsed.savedAt || this.savedAt;
        if (parsed.session) {
          this.currentUserId = parsed.session.userId || null;
          this.role = parsed.session.role || this.role;
        }
        if (!this.currentUserId && this.page !== 'login') {
          this.page = 'login';
          this.sessionPage = null;
          try { history.replaceState(null, '', '#login'); } catch (e) {}
        }
        this.syncRoleCounts();
        this.syncProfileForm();
        this.syncing = false;
        this.notify('Data demo diperbarui dari tab lain');
      } catch (e) {
        this.syncing = false;
      }
    },
    wirePersistence() {
      window.addEventListener('beforeunload', () => this.saveStore());
      window.addEventListener('pagehide', () => this.saveStore());
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && event.reason.isFromCancelledTransition) event.preventDefault();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.saveStore();
      });
      window.addEventListener('storage', (event) => {
        if (event.key === STORE_KEY) this.applyExternalStore();
      });
      window.addEventListener('scroll', () => {
        if (this.formPicker.open) this.closeFormPicker();
      }, true);
      window.addEventListener('resize', () => {
        if (this.formPicker.open) this.closeFormPicker();
      });
    },
    get savedLabel() {
      if (this.storeError) return 'Penyimpanan tidak aktif';
      if (!this.savedAt) return 'Belum disimpan';
      const d = new Date(this.savedAt);
      return 'Tersimpan ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    },

    /* ---------- NAVIGATION ---------- */
    get currentUserRecord() {
      return this.users.find(u => u.id === this.currentUserId) || null;
    },
    get currentUser() {
      const user = this.currentUserRecord;
      if (user) return user.name;
      const fallback = { Admin:'Admin', Sales:'Fahri', Manager:'Rina', Supervisor:'Sari', Developer:'Developer' };
      return fallback[this.role] || this.role;
    },
    get availableRoles() {
      const order = ['Admin', 'Manager', 'Sales', 'Supervisor', 'Developer'];
      const names = (this.roles || []).map(r => r.name);
      return order.filter(n => names.includes(n)).concat(names.filter(n => !order.includes(n)));
    },
    get navGroups() {
      const groups = [
        { title: '', items: [
          { page: 'dashboard', label: 'Dashboard', icon: 'i-dashboard', match: ['dashboard'] }
        ]},
        { title: 'Penjualan', items: [
          { page: 'customers', label: 'Master Pelanggan', icon: 'i-users', match: ['customers'] },
          { page: 'promos', label: 'Master Promo', icon: 'i-tag', match: ['promos'] },
          { page: this.role === 'Sales' ? 'order-customer' : 'orders', label: 'Order', icon: 'i-cart', match: ['order-customer','order-create','order-success','orders','order-detail','invoice','deliveries','delivery-create','delivery-check','delivery-detail','delivery-invoice','returns'] }
        ]},
        { title: 'Logistik', items: [
          { page: 'warehouses', label: 'Master Gudang', icon: 'i-warehouse', match: ['warehouses'] },
          { page: 'products', label: 'Master Produk', icon: 'i-package', match: ['products'] },
          { page: 'materials', label: 'Master Barang', icon: 'i-box', match: ['materials'] },
          { page: 'stock', label: 'Stock', icon: 'i-boxes', match: ['stock'] }
        ]},
        { title: 'Pembelian', items: [
          { page: 'suppliers', label: 'Supplier', icon: 'i-store', match: ['suppliers'] },
          { page: 'purchase-requests', label: 'Purchase Request', icon: 'i-clipboard', match: ['purchase-requests','purchase-request-create','purchase-request-preview'] },
          { page: 'purchase-orders', label: 'Purchase Order', icon: 'i-file', match: ['purchase-orders','purchase-order-create','purchase-order-preview'] },
          { page: 'receipts', label: 'Penerimaan Barang', icon: 'i-truck', match: ['receipts','receipt-create','receipt-preview'] }
        ]},
        { title: 'Keuangan', items: [
          { page: 'receivables', label: 'Piutang', icon: 'i-wallet', match: ['receivables','collection-create','collection-confirm'] },
          { page: 'finance-income', label: 'Pendapatan Lainnya', icon: 'i-banknote', match: ['finance-income'] },
          { page: 'finance-expense', label: 'Pengeluaran Lainnya', icon: 'i-banknote-down', match: ['finance-expense'] },
          { page: 'coa', label: 'Chart of Accounts', icon: 'i-clipboard', match: ['coa'] },
          { page: 'journals', label: 'Jurnal Umum', icon: 'i-file', match: ['journals','journal-create'] },
          { page: 'ledger', label: 'Buku Besar', icon: 'i-chart', match: ['ledger'] },
          { page: 'trial-balance', label: 'Neraca Saldo', icon: 'i-receipt', match: ['trial-balance'] }
        ]},
        { title: 'Pengguna', items: [
          { page: 'settings', label: 'Akun Saya', icon: 'i-user', match: ['settings'] },
          { page: 'users', label: 'Kelola Pengguna', icon: 'i-users', match: ['users'] },
          { page: 'roles', label: 'Kelola Role', icon: 'i-shield', match: ['roles'] }
        ]}
      ];
      return groups
        .map(group => ({ ...group, items: group.items.filter(item => this.canAccessPage(item.page)) }))
        .filter(group => group.items.length);
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
        products: { title: 'Master Produk', crumb: 'Master Produk' },
        materials: { title: 'Master Barang', crumb: 'Master Barang' },
        suppliers: { title: 'Supplier', crumb: 'Pembelian / Supplier' },
        'purchase-requests': { title: 'Purchase Request', crumb: 'Pembelian / Purchase Request' },
        'purchase-request-create': { title: 'Buat Purchase Request', crumb: 'Pembelian / Purchase Request / Buat' },
        'purchase-request-preview': { title: 'Preview Purchase Request', crumb: 'Pembelian / Purchase Request / Preview' },
        'purchase-orders': { title: 'Purchase Order', crumb: 'Pembelian / Purchase Order' },
        'purchase-order-create': { title: 'Buat Purchase Order', crumb: 'Pembelian / Purchase Order / Buat' },
        'purchase-order-preview': { title: 'Preview Purchase Order', crumb: 'Pembelian / Purchase Order / Preview' },
        receipts: { title: 'Penerimaan Barang', crumb: 'Pembelian / Penerimaan Barang' },
        'receipt-create': { title: 'Buat Penerimaan', crumb: 'Pembelian / Penerimaan Barang / Buat' },
        'receipt-preview': { title: 'Preview Penerimaan', crumb: 'Pembelian / Penerimaan Barang / Preview' },
        coa: { title: 'Chart of Accounts', crumb: 'Keuangan / Chart of Accounts' },
        journals: { title: 'Jurnal Umum', crumb: 'Keuangan / Jurnal Umum' },
        'journal-create': { title: 'Buat Jurnal', crumb: 'Keuangan / Jurnal Umum / Buat' },
        ledger: { title: 'Buku Besar', crumb: 'Keuangan / Buku Besar' },
        'trial-balance': { title: 'Neraca Saldo', crumb: 'Keuangan / Neraca Saldo' },
        'finance-income': { title: 'Pendapatan Lainnya', crumb: 'Keuangan / Pendapatan Lainnya' },
        'finance-expense': { title: 'Pengeluaran Lainnya', crumb: 'Keuangan / Pengeluaran Lainnya' },
        receivables: { title: 'Piutang', crumb: 'Keuangan / Piutang' },
        'collection-create': { title: 'Buat Penagihan', crumb: 'Keuangan / Piutang / Penagihan / Buat' },
        'collection-confirm': { title: 'Konfirmasi Penagihan', crumb: 'Keuangan / Piutang / Penagihan / Konfirmasi' },
        users: { title: 'Kelola Pengguna', crumb: 'Kelola Pengguna' },
        roles: { title: 'Kelola Role', crumb: 'Kelola Role' },
        settings: { title: 'Akun Saya', crumb: 'Pengaturan' }
      };
      return map[this.page] || map.dashboard;
    },
    rolePermissions(name) {
      const role = (this.roles || []).find(r => r.name === name);
      if (!role) return ['Dashboard', 'Master Pelanggan', 'Order'];
      return role.permissions || [];
    },
    canAccessPage(page) {
      if (page === 'login') return true;
      if (!PAGE_PERMISSION[page]) return true;
      const perm = PAGE_PERMISSION[page];
      if (!perm) return true;
      if (!this.currentUserId) return false;
      if (this.role === 'Admin') return true;
      return this.rolePermissions(this.role).includes(perm);
    },
    isNavActive(item) { return item.match.includes(this.page); },
    pageRequiresData(page) {
      if (['order-detail', 'invoice'].includes(page)) return this.orders.length > 0;
      if (['delivery-check', 'delivery-detail', 'delivery-invoice'].includes(page)) return this.deliveries.length > 0;
      if (page === 'collection-confirm') return this.collections.length > 0;
      if (page === 'purchase-request-preview') return this.purchaseRequests.length > 0;
      if (page === 'purchase-order-preview') return this.purchaseOrders.length > 0;
      if (page === 'receipt-preview') return this.receipts.length > 0;
      return true;
    },
    go(page) {
      if (page !== 'login' && !this.currentUserId) {
        this.page = 'login';
        try { history.replaceState(null, '', '#login'); } catch (e) {}
        return;
      }
      if (!this.canAccessPage(page)) {
        this.notify('Role ' + this.role + ' tidak memiliki akses ke halaman ini', 'error');
        return;
      }
      if (!this.pageRequiresData(page)) {
        this.notify('Belum ada data transaksi untuk halaman ini', 'error');
        page = 'dashboard';
      }
      this.page = page;
      this.sessionPage = page;
      if (page === 'finance-income') this.financeTab = 'income';
      if (page === 'finance-expense') this.financeTab = 'expense';
      this.mobileMenu = false;
      this.userMenu = false;
      this.closeModals();
      try { history.replaceState(null, '', '#' + page); } catch (e) {}
      this.persist();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    init() {
      this.loadStore();
      this.syncRoleCounts();
      this.syncProfileForm();
      this.wirePersistence();

      const hash = (location.hash || '').replace('#', '');
      if (!this.currentUserId) {
        this.page = 'login';
        try { history.replaceState(null, '', '#login'); } catch (e) {}
      } else {
        let next = null;
        if (hash && PAGES.includes(hash) && hash !== 'login') next = hash;
        else if (this.sessionPage && PAGES.includes(this.sessionPage)) next = this.sessionPage;
        if (!next || next === 'login') next = 'dashboard';
        if (!this.canAccessPage(next) || !this.pageRequiresData(next)) next = 'dashboard';
        this.page = next;
        this.sessionPage = next;
        try { history.replaceState(null, '', '#' + next); } catch (e) {}
      }
      if (this.page === 'finance-income') this.financeTab = 'income';
      if (this.page === 'finance-expense') this.financeTab = 'expense';
      if (['delivery-check','delivery-detail'].includes(this.page) && this.deliveries.length) {
        this.startDeliveryCheck(this.deliveries[0], this.page === 'delivery-detail');
      }

      window.addEventListener('hashchange', () => {
        const next = (location.hash || '').replace('#', '');
        if (!PAGES.includes(next) || next === 'login') return;
        if (!this.currentUserId) { this.page = 'login'; return; }
        if (!this.canAccessPage(next) || !this.pageRequiresData(next)) { this.go('dashboard'); return; }
        this.page = next;
        this.sessionPage = next;
        if (next === 'finance-income') this.financeTab = 'income';
        if (next === 'finance-expense') this.financeTab = 'expense';
        if (['delivery-check','delivery-detail'].includes(next) && this.deliveries.length) {
          this.startDeliveryCheck(this.deliveries[0], next === 'delivery-detail');
        }
        this.persist();
      });
    },

    /* ---------- LOGIN ---------- */
    loginRole: 'Admin',
    loginForm: { username: 'admin', password: DEMO_PASSWORD },
    selectLoginRole(role) {
      this.loginRole = role;
      this.loginError = '';
      const user = this.users.find(u => (u.roles || []).includes(role)) || this.users[0];
      if (user) this.loginForm = { username: user.username, password: user.password || DEMO_PASSWORD };
    },
    doLogin() {
      const username = (this.loginForm.username || '').trim().toLowerCase();
      const password = this.loginForm.password || '';
      const user = this.users.find(u => String(u.username || '').toLowerCase() === username);
      if (!user || String(user.password || DEMO_PASSWORD) !== password) {
        this.loginError = 'Username atau kata sandi tidak sesuai.';
        this.notify('Login gagal: periksa username dan kata sandi', 'error');
        return;
      }
      this.currentUserId = user.id;
      this.role = (user.roles || [])[0] || 'Sales';
      this.loginError = '';
      this.syncProfileForm();
      this.loginRole = this.role;
      this.sessionPage = this.sessionPage && this.canAccessPage(this.sessionPage) ? this.sessionPage : 'dashboard';
      this.page = this.sessionPage;
      this.saveStore();
      try { history.replaceState(null, '', '#' + this.page); } catch (e) {}
      this.notify('Selamat datang, ' + user.name);
    },
    logout() {
      this.userMenu = false;
      this.page = 'login';
      this.sessionPage = null;
      this.currentUserId = null;
      this.role = 'Admin';
      this.loginRole = 'Admin';
      this.loginError = '';
      this.selectLoginRole('Admin');
      try { history.replaceState(null, '', '#login'); } catch (e) {}
      this.saveStore();
    },
    demoSwitch(role) {
      this.role = role;
      this.onRoleChange();
    },
    onRoleChange() {
      const user = this.users.find(u => (u.roles || []).includes(this.role));
      if (user) this.currentUserId = user.id;
      this.syncProfileForm();
      if (this.currentUserId && !this.canAccessPage(this.page) && this.page !== 'login') {
        this.page = 'dashboard';
        this.sessionPage = 'dashboard';
        try { history.replaceState(null, '', '#dashboard'); } catch (e) {}
      }
      this.persist();
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
    signed(n) {
      const v = Number(n) || 0;
      return (v > 0 ? '+' : '') + v;
    },
    dateShort(v) {
      if (!v) return '-';
      const d = new Date(v);
      if (isNaN(d.getTime())) return v;
      return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
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
    initials(name) { return (name || '').split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase(); },
    customer(id) { return this.customers.find(c => c.id === id) || {}; },
    product(id) { return this.products.find(p => p.id === id) || {}; },
    customerName(id) { return this.customer(id).name || '-'; },
    productName(id) { return this.product(id).name || '-'; },
    order(id) { return this.orders.find(o => o.id === id) || {}; },
    delivery(id) { return this.deliveries.find(d => d.id === id) || {}; },
    receivable(id) { return this.receivables.find(r => r.id === id) || {}; },
    warehouseName(id) { return (this.warehouses.find(w => w.id === id) || {}).name || '-'; },
    statusBadge(s) {
      return { pending:'badge-yellow', processing:'badge-orange', already:'badge-blue', holding:'badge-cyan', shipping:'badge-amber', success:'badge-green', partial:'badge-green', failed:'badge-red', cancel:'badge-red', return:'badge-blue', discard:'badge-red' }[s] || 'badge-slate';
    },
    statusLabel(s) {
      return { pending:'Belum Diproses', processing:'Sedang Diproses', already:'Siap Dikirim', holding:'Ditahan', shipping:'Dikirim', success:'Selesai', partial:'Selesai Parsial', failed:'Gagal', cancel:'Dibatalkan', return:'Stocked', discard:'Dihapus' }[s] || s;
    },
    paymentBadge(p) { return p === 'paid' || p === 'partial' ? 'badge-green' : 'badge-yellow'; },
    paymentLabel(p) { return p === 'paid' ? 'Lunas' : p === 'partial' ? 'Lunas Partial' : 'Belum Lunas'; },
    printPage() { window.print(); },
    notify(message, type = 'success') {
      this.toast = { show: true, message, type };
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast.show = false; }, 3200);
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
      this.categoryModalOpen = false;
      this.materialModalOpen = false;
      this.supplierModalOpen = false;
      this.closeFormPicker();
      this.prDetailOpen = false;
      this.prRejectOpen = false;
      this.poDetailOpen = false;
      this.poRejectOpen = false;
      this.receiptDetailOpen = false;
      this.accountModalOpen = false;
      this.journalDetailOpen = false;
      this.journalVoidOpen = false;
      this.warehouseModalOpen = false;
      this.financeModalOpen = false;
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
    nextCode(prefix, list) {
      return docCode(prefix, todayISO(), nextDocSeq(list, prefix, todayISO()));
    },
    syncRoleCounts() {
      this.roles.forEach(role => {
        role.members = this.users.filter(u => (u.roles || []).includes(role.name)).length;
      });
    },
    syncProfileForm() {
      const user = this.currentUserRecord;
      this.settingsForm = user
        ? { name:user.name, username:user.username, email:user.email }
        : { name:this.currentUser, username:'', email:'' };
    },
    orderCogs(order) {
      return (order.items || []).reduce((sum, item) => {
        const prod = this.product(item.productId);
        return sum + (Number(prod.cost) || 0) * (Number(item.qty) || 0);
      }, 0);
    },
    restoreOrderStock(order) {
      if (!order || !order.stockApplied) return;
      (order.items || []).forEach(item => {
        const prod = this.product(item.productId);
        if (prod.id) prod.stock = (Number(prod.stock) || 0) + (Number(item.qty) || 0);
      });
      order.stockApplied = false;
    },
    removeOrderReferences(orderId) {
      this.deliveries.forEach(del => {
        if (!(del.orderIds || []).includes(orderId)) return;
        del.orderIds = del.orderIds.filter(id => id !== orderId);
        del.total = del.orderIds.reduce((sum, id) => sum + Number((this.order(id).total) || 0), 0);
      });
      this.deliveries = this.deliveries.filter(del => (del.orderIds || []).length > 0);
      this.receivables = this.receivables.filter(r => r.orderId !== orderId);
      this.collections.forEach(col => {
        col.itemIds = (col.itemIds || []).filter(rid => this.receivables.some(r => r.id === rid));
        col.total = col.itemIds.reduce((sum, rid) => sum + Number((this.receivable(rid).total) || 0), 0);
        col.unpaid = Math.max(0, col.total - Number(col.paid || 0));
      });
      this.payments = this.payments.filter(p => p.orderId !== orderId);
      this.returns = this.returns.filter(r => r.orderId !== orderId);
    },
    runConfirm() {
      const { action, id } = this.confirm;

      if (action === 'delete-order') {
        const order = this.order(id);
        const rec = this.receivables.find(r => r.orderId === id);
        if (rec && (Number(rec.cash) || 0) + (Number(rec.transfer) || 0) > 0) {
          this.notify('Order sudah memiliki pembayaran. Hapus pembayaran terlebih dahulu.', 'error');
          this.confirm.open = false;
          return;
        }
        this.restoreOrderStock(order);
        this.removeOrderReferences(id);
        this.orders = this.orders.filter(o => o.id !== id);
        this.notify('Order berhasil dihapus');
      }
      if (action === 'delete-customer') {
        if (this.orders.some(o => o.customerId === id)) {
          this.notify('Pelanggan masih memiliki riwayat order', 'error');
          this.confirm.open = false;
          return;
        }
        this.customers = this.customers.filter(c => c.id !== id);
        this.notify('Pelanggan berhasil dihapus');
      }
      if (action === 'delete-promo') {
        this.promos = this.promos.filter(p => p.id !== id);
        this.notify('Promo berhasil dihapus');
      }
      if (action === 'delete-category') {
        if (this.categoryUsed(id)) {
          this.notify('Kategori masih dipakai produk/barang', 'error');
          this.confirm.open = false;
          return;
        }
        this.categories = this.categories.filter(category => category.id !== id);
        this.notify('Kategori berhasil dihapus');
      }
      if (action === 'delete-material') {
        const used = this.purchaseRequests.some(pr => (pr.items || []).some(item => item.materialId === id));
        if (used) {
          this.notify('Barang masih dipakai pada Purchase Request', 'error');
          this.confirm.open = false;
          return;
        }
        this.materials = this.materials.filter(material => material.id !== id);
        this.notify('Barang berhasil dihapus');
      }
      if (action === 'delete-supplier') {
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
        this.notify('Supplier berhasil dihapus');
      }
      if (action === 'approve-pr') {
        const pr = this.purchaseRequests.find(item => item.id === id);
        if (!pr) { this.confirm.open = false; return; }
        if (!this.canApprovePR || pr.requesterId === this.currentUserId || pr.status !== 'submitted') {
          this.notify('PR tidak dapat disetujui', 'error');
          this.confirm.open = false;
          return;
        }
        pr.status = 'approved';
        pr.approvedBy = this.currentUser;
        pr.approvedAt = todayISO();
        pr.history = pr.history || [];
        pr.history.push({ action:'approved', by:this.currentUser, at:todayISO(), note:'' });
        this.notify('Purchase Request ' + pr.code + ' disetujui');
      }
      if (action === 'cancel-pr') {
        const pr = this.purchaseRequests.find(item => item.id === id);
        if (!pr || !['draft','submitted'].includes(pr.status)) {
          this.notify('PR tidak dapat dibatalkan', 'error');
          this.confirm.open = false;
          return;
        }
        pr.status = 'cancelled';
        pr.history = pr.history || [];
        pr.history.push({ action:'cancelled', by:this.currentUser, at:todayISO(), note:'' });
        this.notify('Purchase Request ' + pr.code + ' dibatalkan');
      }
      if (action === 'post-receipt') {
        const receipt = this.receipts.find(item => item.id === id);
        if (!receipt || receipt.status !== 'draft') {
          this.notify('Penerimaan tidak dapat diposting', 'error');
          this.confirm.open = false;
          return;
        }
        const receiptError = this.receiptValidationError(receipt.poId, receipt.warehouseId, receipt.items);
        if (receiptError) {
          this.notify(receiptError, 'error');
          this.confirm.open = false;
          return;
        }
        this.postReceiptDocument(receipt);
      }
      if (action === 'delete-receipt') {
        const receipt = this.receipts.find(item => item.id === id);
        if (!receipt || receipt.status !== 'draft') {
          this.notify('Hanya draft penerimaan yang dapat dihapus', 'error');
          this.confirm.open = false;
          return;
        }
        this.receipts = this.receipts.filter(item => item.id !== id);
        this.notify('Draft penerimaan dihapus');
      }
      if (action === 'approve-po') {
        const po = this.purchaseOrders.find(item => item.id === id);
        if (!po) { this.confirm.open = false; return; }
        if (!this.canApprovePO || po.createdById === this.currentUserId || po.status !== 'pending_approval') {
          this.notify('PO tidak dapat disetujui', 'error');
          this.confirm.open = false;
          return;
        }
        const poError = this.poApprovalError(po);
        if (poError) {
          this.notify(poError, 'error');
          this.confirm.open = false;
          return;
        }
        po.status = 'approved';
        po.approvedBy = this.currentUser;
        po.approvedAt = todayISO();
        po.history = po.history || [];
        po.history.push({ action:'approved', by:this.currentUser, at:todayISO(), note:'' });
        this.reservePRQuantities(po);
        this.updateMaterialPrices(po);
        this.notify('Purchase Order ' + po.code + ' disetujui');
      }
      if (action === 'cancel-po') {
        const po = this.purchaseOrders.find(item => item.id === id);
        if (!po || !['draft','pending_approval','approved'].includes(po.status)) {
          this.notify('PO tidak dapat dibatalkan', 'error');
          this.confirm.open = false;
          return;
        }
        if (po.status === 'approved') this.releasePRQuantities(po);
        po.status = 'cancelled';
        po.history = po.history || [];
        po.history.push({ action:'cancelled', by:this.currentUser, at:todayISO(), note:'' });
        this.notify('Purchase Order ' + po.code + ' dibatalkan');
      }
      if (action === 'delete-account') {
        const account = this.accountById(id);
        if (!account.id || account.isSystem || this.accountUsed(id)) {
          this.notify('Akun tidak dapat dihapus', 'error');
          this.confirm.open = false;
          return;
        }
        this.accounts = this.accounts.filter(item => item.id !== id);
        this.notify('Akun berhasil dihapus');
      }
      if (action === 'post-journal') {
        const journal = this.journals.find(item => item.id === id);
        if (!journal || journal.status !== 'draft') {
          this.notify('Jurnal tidak dapat diposting', 'error');
          this.confirm.open = false;
          return;
        }
        this.journalForm = { date:journal.date, description:journal.description, lines:(journal.lines || []).map(line => ({ ...line })) };
        const journalError = this.validateJournalLines(journal.lines);
        if (journalError) {
          this.notify(journalError, 'error');
          this.confirm.open = false;
          return;
        }
        journal.status = 'posted';
        journal.postedBy = this.currentUser;
        journal.postedAt = todayISO();
        journal.history = journal.history || [];
        journal.history.push({ action:'posted', by:this.currentUser, at:todayISO(), note:'' });
        this.notify('Jurnal ' + journal.code + ' berhasil diposting');
      }
      if (action === 'delete-journal') {
        const journal = this.journals.find(item => item.id === id);
        if (!journal || journal.status !== 'draft') {
          this.notify('Hanya draft yang dapat dihapus', 'error');
          this.confirm.open = false;
          return;
        }
        this.journals = this.journals.filter(item => item.id !== id);
        this.notify('Draft jurnal dihapus');
      }
      if (action === 'delete-product') {
        const usedInOrder = this.orders.some(o => (o.items || []).some(i => i.productId === id));
        const usedInPromo = this.promos.some(p => p.productId === id || p.bonusProductId === id);
        if (usedInOrder || usedInPromo) {
          this.notify('Barang masih dipakai pada order/promo', 'error');
          this.confirm.open = false;
          return;
        }
        this.products = this.products.filter(p => p.id !== id);
        this.stockHistory.forEach(sh => { sh.items = (sh.items || []).filter(i => i.productId !== id); });
        this.opnames = this.opnames.filter(o => o.productId !== id);
        this.notify('Barang berhasil dihapus');
      }
      if (action === 'delete-warehouse') {
        const used = this.deliveries.some(d => d.warehouseId === id)
          || this.stockHistory.some(s => s.warehouseId === id)
          || this.opnames.some(o => o.warehouseId === id);
        if (used) {
          this.notify('Gudang masih dipakai pada surat jalan / stock', 'error');
          this.confirm.open = false;
          return;
        }
        this.warehouses = this.warehouses.filter(w => w.id !== id);
        this.notify('Gudang berhasil dihapus');
      }
      if (action === 'delete-user') {
        if (id === this.currentUserId) {
          this.notify('Tidak dapat menghapus akun yang sedang digunakan', 'error');
          this.confirm.open = false;
          return;
        }
        this.users = this.users.filter(u => u.id !== id);
        this.syncRoleCounts();
        this.notify('Pengguna berhasil dihapus');
      }
      if (action === 'delete-role') {
        const role = this.roles.find(r => r.id === id);
        if (role && this.users.some(u => (u.roles || []).includes(role.name))) {
          this.notify('Role masih dipakai oleh pengguna', 'error');
          this.confirm.open = false;
          return;
        }
        this.roles = this.roles.filter(r => r.id !== id);
        this.notify('Role berhasil dihapus');
      }
      if (action === 'delete-finance') {
        const item = [...this.incomes, ...this.expenses].find(row => row.id === id);
        if (item && item.journalId) this.voidFinanceJournal(item.journalId, 'Transaksi dihapus');
        this.incomes = this.incomes.filter(i => i.id !== id);
        this.expenses = this.expenses.filter(i => i.id !== id);
        this.notify('Transaksi berhasil dihapus dan jurnal di-void');
      }
      if (action === 'process-return') {
        const r = this.returns.find(x => x.id === id);
        if (r) {
          if (r.status !== 'pending') {
            this.notify('Return ini sudah diproses', 'error');
            this.confirm.open = false;
            return;
          }
          r.status = r.action;
          if (r.action === 'return' && r.productId) {
            const prod = this.product(r.productId);
            if (prod.id) prod.stock = (Number(prod.stock) || 0) + (Number(r.qty) || 0);
          }
          if (r.type === 'cut') {
            const rec = this.receivables.find(x => x.orderId === r.orderId);
            if (rec) {
              rec.total = Math.max(0, (Number(rec.total) || 0) - (Number(r.price) || 0));
              rec.unpaid = Math.max(0, (Number(rec.unpaid) || 0) - (Number(r.price) || 0));
            }
          }
          this.notify('Return berhasil diproses');
        }
      }
      if (action === 'delete-return') {
        this.returns = this.returns.filter(r => r.id !== id);
        this.notify('Return dibatalkan');
      }
      if (action === 'delete-delivery') {
        const del = this.deliveries.find(x => x.id === id);
        if (del) {
          (del.orderIds || []).forEach(oid => {
            const order = this.order(oid);
            if (order && order.status === 'shipping') order.status = 'already';
          });
        }
        this.deliveries = this.deliveries.filter(d => d.id !== id);
        this.notify('Surat jalan berhasil dihapus');
      }
      if (action === 'delete-stock') {
        this.stockHistory = this.stockHistory.filter(s => s.id !== id);
        this.notify('Riwayat stock dihapus');
      }
      if (action === 'delete-opname') {
        this.opnames = this.opnames.filter(o => o.id !== id);
        this.notify('Opname dihapus');
      }
      if (action === 'clear-transactions') {
        this.closeModals();
        this.orders = [];
        this.deliveries = [];
        this.returns = [];
        this.receivables = [];
        this.collections = [];
        this.payments = [];
        this.stockHistory = [];
        this.opnames = [];
        this.incomes = [];
        this.expenses = [];
        this.monthlyHistory = [];
        this.purchaseRequests = [];
        this.purchaseOrders = [];
        this.receipts = [];
        this.stockMovements = [];
        this.payables = [];
        this.materials = this.materials.map(material => ({
          ...material,
          stock:0,
          stockValue:0,
          avgCost:Number(material.purchasePrice) || 0
        }));
        this.journals = [];
        this.customers = this.customers.map(customer => ({
          ...customer,
          lastOrder: null,
          orderedToday: false
        }));
        this.selectedOrderId = null;
        this.selectedDeliveryId = null;
        this.selectedCollectionId = null;
        this.selectedOrderIds = [];
        this.collectionIds = [];
        this.prEditId = null;
        this.prEditRequester = '';
        this.prForm = { date:todayISO(), purpose:'', items:[{ materialId:'', qty:1, note:'' }] };
        this.page = 'dashboard';
        this.sessionPage = 'dashboard';
        try { history.replaceState(null, '', '#dashboard'); } catch (e) {}
        this.notify('Semua data transaksi berhasil dihapus');
      }
      if (action === 'reset-data') {
        this.closeModals();
        this.seedDefaults();
        this.syncRoleCounts();
        this.currentUserId = null;
        this.role = 'Admin';
        this.sessionPage = null;
        this.page = 'login';
        this.prEditId = null;
        this.prEditRequester = '';
        this.prForm = { date:todayISO(), purpose:'', items:[{ materialId:'', qty:1, note:'' }] };
        this.loginError = '';
        this.selectLoginRole('Admin');
        this.savedAt = null;
        try { history.replaceState(null, '', '#login'); } catch (e) {}
        this.saveStore();
        this.notify('Data demo berhasil direset');
      }
      if (action === 'import-data' && this.pendingImport) {
        const data = this.pendingImport;
        this.pendingImport = null;
        DOMAIN_KEYS.forEach(key => { if (data[key] !== undefined) this[key] = data[key]; });
        this.syncRoleCounts();
        if (!this.users.some(u => u.id === this.currentUserId)) {
          this.currentUserId = null;
          this.role = 'Admin';
          this.page = 'login';
          try { history.replaceState(null, '', '#login'); } catch (e) {}
        } else {
          this.syncProfileForm();
          this.sessionPage = 'dashboard';
          this.page = 'dashboard';
          try { history.replaceState(null, '', '#dashboard'); } catch (e) {}
        }
        this.saveStore();
        this.notify('Data demo berhasil diimpor');
      }

      this.confirm.open = false;
      this.persist();
    },

    /* ---------- DASHBOARD ---------- */
    dashRecapTab: 'income',
    dashStockTab: 'active',
    dashboardSales: 'all',
    dashboardDate: todayISO(),
    get monthlySummary() {
      const key = todayISO().slice(0, 7);
      const inMonth = (date) => String(date || '').slice(0, 7) === key;
      const monthOrders = this.orders.filter(o => inMonth(o.date) && !['cancel','failed'].includes(o.status));
      const revenue = monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const cogs = monthOrders.reduce((sum, o) => sum + this.orderCogs(o), 0);
      const otherIncome = this.incomes.filter(i => inMonth(i.date)).reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const opex = this.expenses.filter(i => inMonth(i.date)).reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const income = revenue + otherIncome;
      return { income, cogs, expense:opex, gross:income - cogs, net:income - cogs - opex };
    },
    get prevMonthSummary() {
      const key = todayISO().slice(0, 7);
      const history = (this.monthlyHistory || []).filter(h => h.key !== key);
      return history[history.length - 1] || null;
    },
    get summary() {
      const cur = this.monthlySummary;
      const prev = this.prevMonthSummary;
      const pct = (a, b) => (!b || !isFinite(b)) ? 0 : Math.round(((a - b) / Math.abs(b)) * 1000) / 10;
      const prevGross = prev ? Number(prev.income || 0) - Number(prev.cogs || 0) : 0;
      const prevNet = prev ? Number(prev.income || 0) - Number(prev.cogs || 0) - Number(prev.expense || 0) : 0;
      const receivable = this.totalUnpaid;
      return {
        income: cur.income,
        incomeDelta: pct(cur.income, prev ? prev.income : 0),
        expense: cur.expense,
        expenseDelta: pct(cur.expense, prev ? prev.expense : 0),
        gross: cur.gross,
        grossDelta: pct(cur.gross, prevGross),
        net: cur.net,
        netDelta: pct(cur.net, prevNet),
        receivable,
        receivableDelta: pct(receivable, prev ? prev.receivable : 0)
      };
    },
    get totalUnpaid() {
      return this.receivables.reduce((sum, r) => sum + Math.max(0, Number(r.unpaid) || 0), 0);
    },
    get chartSeries() {
      const key = todayISO().slice(0, 7);
      const cur = this.monthlySummary;
      const history = (this.monthlyHistory || []).map(h => ({ ...h }));
      const last = history[history.length - 1];
      if (last && last.key === key) {
        last.income = cur.income;
        last.expense = cur.expense;
      } else {
        history.push({ key, income:cur.income, expense:cur.expense });
      }
      return history.slice(-10);
    },
    get chartMonths() { return this.chartSeries.map(h => ({ m: monthShortOf(h.key) })); },
    get hasChartData() {
      return this.chartSeries.some(item => Number(item.income) > 0 || Number(item.expense) > 0);
    },
    get chartRangeLabel() {
      const series = this.chartSeries;
      if (!series.length) return '-';
      const first = series[0];
      const last = series[series.length - 1];
      return monthShortOf(first.key) + ' ' + first.key.slice(0, 4) + ' — ' + monthShortOf(last.key) + ' ' + last.key.slice(0, 4);
    },
    get chartScale() {
      if (!this.hasChartData) return { max:1, labels:['', '', '', '', '0'] };
      const series = this.chartSeries;
      const max = niceMax(Math.max(1, ...series.flatMap(h => [Number(h.income) || 0, Number(h.expense) || 0])));
      return { max, labels:[max, max * 0.75, max * 0.5, max * 0.25, 0].map(v => this.short(v)) };
    },
    chartPoints(key) {
      const series = this.chartSeries;
      const max = this.chartScale.max || 1;
      return series.map((item, index) => {
        const x = 42 + index * (series.length > 1 ? 588 / (series.length - 1) : 0);
        const y = 180 - ((Number(item[key]) || 0) / max) * 150;
        return x + ',' + y;
      }).join(' ');
    },
    get chartIncomePoints() { return this.chartPoints('income'); },
    get chartExpensePoints() { return this.chartPoints('expense'); },
    get lowStock() {
      return [...this.products]
        .filter(product => Number(product.stock) <= Number(product.minStock || 10))
        .sort((a, b) => a.stock - b.stock);
    },
    get lowStockMaterials() {
      return [...this.materials]
        .filter(material => material.status && Number(material.stock) <= Number(material.minStock || 0))
        .sort((a, b) => a.stock - b.stock);
    },
    get prStats() {
      return {
        draft: this.purchaseRequests.filter(pr => pr.status === 'draft').length,
        submitted: this.purchaseRequests.filter(pr => pr.status === 'submitted').length,
        approved: this.purchaseRequests.filter(pr => pr.status === 'approved').length,
        processing: this.purchaseRequests.filter(pr => pr.status === 'processing').length,
        completed: this.purchaseRequests.filter(pr => pr.status === 'completed').length,
        rejected: this.purchaseRequests.filter(pr => pr.status === 'rejected').length
      };
    },
    get poStats() {
      return {
        draft: this.purchaseOrders.filter(po => po.status === 'draft').length,
        pending: this.purchaseOrders.filter(po => po.status === 'pending_approval').length,
        approved: this.purchaseOrders.filter(po => po.status === 'approved').length,
        sent: this.purchaseOrders.filter(po => po.status === 'sent').length,
        openValue: this.purchaseOrders
          .filter(po => ['approved','sent'].includes(po.status))
          .reduce((sum, po) => sum + (Number(po.total) || 0), 0)
      };
    },
    get invoiceCount() { return this.orders.length; },
    get deliveryCount() { return this.deliveries.length; },
    get returnCount() { return this.returns.length; },
    get orderStatusCount() {
      const count = {};
      this.orders.forEach(o => { count[o.status] = (count[o.status] || 0) + 1; });
      return count;
    },
    get info() {
      const delivery = {
        pending: this.deliveries.filter(d => d.status === 'pending').length,
        partial: this.deliveries.filter(d => d.status === 'shipping').length,
        success: this.deliveries.filter(d => d.status === 'success').length
      };
      const billing = {
        pending: this.collections.filter(c => c.status !== 'success').length,
        success: this.collections.filter(c => c.status === 'success').length
      };
      const invoice = {
        pending: this.orders.filter(o => o.status === 'pending').length,
        ready: this.orders.filter(o => o.status === 'already').length,
        shipping: this.orders.filter(o => o.status === 'shipping').length,
        partial: this.orders.filter(o => o.payment === 'partial').length,
        success: this.orders.filter(o => o.status === 'success').length,
        cancel: this.orders.filter(o => o.status === 'cancel').length
      };
      const returns = {
        pending: this.returns.filter(r => r.status === 'pending').length,
        return: this.returns.filter(r => r.status === 'return').length,
        discard: this.returns.filter(r => r.status === 'discard').length
      };
      return { delivery, billing, invoice, return:returns };
    },
    get popularProducts() {
      const cutoff = shiftISO(todayISO(), -60);
      const map = {};
      this.orders
        .filter(o => String(o.date || '') >= cutoff && !['cancel','failed'].includes(o.status))
        .forEach(o => (o.items || []).forEach(item => {
          if (item.bonus) return;
          map[item.productId] = (map[item.productId] || 0) + (Number(item.qty) || 0);
        }));
      return Object.keys(map)
        .map(id => ({ name:this.productName(id), qty:map[id], unit:this.product(id).unit || '' }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 4);
    },
    get holdingProducts() {
      const map = {};
      this.orders.filter(o => o.status === 'holding').forEach(o => (o.items || []).forEach(item => {
        map[item.productId] = (map[item.productId] || 0) + (Number(item.qty) || 0);
      }));
      return Object.keys(map)
        .map(id => ({ name:this.productName(id), qty:map[id], unit:this.product(id).unit || '' }))
        .sort((a, b) => b.qty - a.qty);
    },
    get recapData() {
      const date = this.dashboardDate;
      const sales = this.dashboardSales;
      const matchSales = (value) => !sales || sales === 'all' || value === sales;
      if (this.dashRecapTab === 'income') {
        const rows = this.orders.filter(o => o.schedule === date && o.status !== 'cancel' && matchSales(o.sales));
        const total = rows.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        let cash = 0;
        let transfer = 0;
        let credit = 0;
        rows.forEach(o => {
          const rec = this.receivables.find(r => r.orderId === o.id);
          if (rec) {
            cash += Number(rec.cash) || 0;
            transfer += Number(rec.transfer) || 0;
            credit += Math.max(0, Number(rec.unpaid) || 0);
          } else {
            credit += Number(o.total) || 0;
          }
        });
        return { total, credit, cash, transfer };
      }
      const rows = this.collections.filter(c => c.date === date && matchSales(c.sales));
      const paid = rows.reduce((sum, c) => sum + (Number(c.paid) || 0), 0);
      const unpaid = rows.reduce((sum, c) => sum + (Number(c.unpaid) || 0), 0);
      return { total:paid, credit:unpaid, cash:paid, transfer:0 };
    },
    get todayLabel() { return this.dateLong(todayISO()); },
    get formatOrderCount() { return this.orders.length; },
    get displayOrderCount() { return this.orders.filter(o => !['cancel','failed'].includes(o.status)).length; },
    get displayDeliverySuccess() { return this.deliveries.filter(d => d.status === 'success').length; },
    get displayReturnPending() { return this.returns.filter(r => r.status === 'pending').length; },

    /* ---------- CUSTOMER ---------- */
    customerSearch: '', customerChannel: '', customerSales: '', customerWeek: '', customerDay: '', customerPrice: '',
    customerModalOpen: false, customerEditId: null,
    customerForm: { name:'', address:'', channel:'Grosir', sales:'Fahri', week:'Genap', day:'Senin', priceType:'in', phone:'', description:'' },
    get filteredCustomers() {
      const q = this.customerSearch.toLowerCase();
      return this.customers.filter(c => {
        if (this.role === 'Sales' && c.sales !== this.currentUser) return false;
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
      this.customerForm = c
        ? { name:c.name, address:c.address, channel:c.channel, sales:c.sales, week:c.week, day:c.day, priceType:c.priceType, phone:c.phone, description:c.description }
        : { name:'', address:'', channel:'Grosir', sales:this.role === 'Sales' ? this.currentUser : 'Fahri', week:'Genap', day:'Senin', priceType:'in', phone:'', description:'' };
      this.customerModalOpen = true;
    },
    saveCustomer() {
      if (!this.customerForm.name || !this.customerForm.address) { this.notify('Nama dan alamat wajib diisi', 'error'); return; }
      if (this.customerEditId) {
        const c = this.customers.find(x => x.id === this.customerEditId);
        if (c) Object.assign(c, this.customerForm);
        this.notify('Pelanggan berhasil diperbarui');
      } else {
        this.customers.unshift({
          id:'c' + Date.now(),
          code:nextSimpleCode(this.customers, 'C-'),
          orderedToday:false,
          lastOrder:todayISO(),
          ...this.customerForm
        });
        this.notify('Pelanggan baru berhasil ditambahkan');
      }
      this.customerModalOpen = false;
      this.persist();
    },

    /* ---------- PROMO ---------- */
    promoSearch: '', promoModalOpen: false, promoEditId: null,
    promoForm: { name:'', productId:'p1', minAmount:24, early:todayISO(), final:shiftISO(todayISO(), 30), bonusType:'price', discountPrice:5, multiple:false, bonusProductId:'p3', bonusAmount:1, description:'' },
    get filteredPromos() {
      const q = this.promoSearch.toLowerCase();
      return this.promos.filter(p => !q || (p.name + ' ' + p.code + ' ' + this.productName(p.productId)).toLowerCase().includes(q));
    },
    openPromo(p = null) {
      this.promoEditId = p ? p.id : null;
      this.promoForm = p
        ? { name:p.name, productId:p.productId, minAmount:p.minAmount, early:p.early, final:p.final, bonusType:p.bonusType, discountPrice:p.discountPrice, multiple:p.multiple, bonusProductId:p.bonusProductId, bonusAmount:p.bonusAmount, description:p.description }
        : { name:'', productId:'p1', minAmount:24, early:todayISO(), final:shiftISO(todayISO(), 30), bonusType:'price', discountPrice:5, multiple:false, bonusProductId:'p3', bonusAmount:1, description:'' };
      this.promoModalOpen = true;
    },
    savePromo() {
      if (!this.promoForm.name) { this.notify('Nama promo wajib diisi', 'error'); return; }
      const data = {
        ...this.promoForm,
        bonusType:this.promoForm.bonusType,
        discountPrice:this.promoForm.bonusType === 'price' ? Number(this.promoForm.discountPrice) : 0,
        bonusProductId:this.promoForm.bonusType === 'product' ? this.promoForm.bonusProductId : null,
        bonusAmount:this.promoForm.bonusType === 'product' ? Number(this.promoForm.bonusAmount) : 0
      };
      if (this.promoEditId) {
        const promo = this.promos.find(p => p.id === this.promoEditId);
        if (promo) Object.assign(promo, data);
        this.notify('Promo berhasil diperbarui');
      } else {
        this.promos.unshift({ id:'pr' + Date.now(), code:this.nextCode('PR', this.promos), ...data });
        this.notify('Promo baru berhasil ditambahkan');
      }
      this.promoModalOpen = false;
      this.persist();
    },

    /* ---------- PRODUCT (Master Produk) ---------- */
    productTab: 'items', productSearch: '', productStatus: '', productCategory: '', productModalOpen: false, productEditId: null,
    formPicker: { open:false, kind:'category', target:'product', query:'', top:0, left:0, width:280 },
    productForm: { name:'', categoryId:'cat1', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, minStock:20, status:true },
    get filteredProducts() {
      const q = this.productSearch.toLowerCase();
      return this.products.filter(p => {
        if (q && !(p.name + ' ' + p.code).toLowerCase().includes(q)) return false;
        if (this.productStatus && String(p.status) !== this.productStatus) return false;
        if (this.productCategory && p.categoryId !== this.productCategory) return false;
        return true;
      });
    },
    get productCategories() { return this.categories.filter(c => c.type === 'product'); },
    get materialCategories() { return this.categories.filter(c => c.type === 'material'); },
    categoryName(id) { return (this.categories.find(c => c.id === id) || {}).name || '-'; },
    openProduct(p = null) {
      this.closeFormPicker();
      this.productEditId = p ? p.id : null;
      this.productForm = p
        ? { name:p.name, categoryId:p.categoryId || '', unit:p.unit, cost:p.cost, inSale:p.inSale, outSale:p.outSale, stock:p.stock, minStock:p.minStock || 0, status:p.status }
        : { name:'', categoryId:this.productCategories[0]?.id || '', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, minStock:20, status:true };
      this.productModalOpen = true;
    },
    saveProduct() {
      if (!this.productForm.name) { this.notify('Nama produk wajib diisi', 'error'); return; }
      const data = {
        ...this.productForm,
        categoryId:this.productForm.categoryId || null,
        cost:Number(this.productForm.cost),
        inSale:Number(this.productForm.inSale),
        outSale:Number(this.productForm.outSale),
        stock:Number(this.productForm.stock),
        minStock:Number(this.productForm.minStock) || 0,
        status:!!this.productForm.status
      };
      if (this.productEditId) {
        const prod = this.products.find(p => p.id === this.productEditId);
        if (prod) Object.assign(prod, data);
        this.notify('Produk berhasil diperbarui');
      } else {
        this.products.push({ id:'p' + Date.now(), code:nextSimpleCode(this.products, 'ABI-'), ...data });
        this.notify('Produk baru berhasil ditambahkan');
      }
      this.productModalOpen = false;
      this.persist();
    },

    /* ---------- CATEGORY ---------- */
    categorySearch: '', categoryModalOpen: false, categoryEditId: null, categoryType: 'product',
    categoryForm: { name:'', description:'', status:true },
    filteredCategories(type) {
      const q = this.categorySearch.toLowerCase();
      return this.categories.filter(c => c.type === type && (!q || (c.name + ' ' + c.code + ' ' + c.description).toLowerCase().includes(q)));
    },
    categoryOptions(type, query = '') {
      const q = String(query || '').toLowerCase();
      return this.categories.filter(category => category.type === type && category.status
        && (!q || (category.name + ' ' + category.code).toLowerCase().includes(q)));
    },
    addCategoryValue(type, name) {
      const clean = String(name || '').trim();
      if (!clean) { this.notify('Nama kategori wajib diisi', 'error'); return null; }
      const existing = this.categories.find(category => category.type === type && category.name.toLowerCase() === clean.toLowerCase());
      if (existing) {
        if (!existing.status) existing.status = true;
        this.persist();
        return existing;
      }
      const category = {
        id:'cat' + Date.now(),
        code:nextSimpleCode(this.categories, 'KAT-'),
        name:clean,
        type,
        description:'',
        status:true
      };
      this.categories.push(category);
      this.persist();
      this.notify('Kategori ' + clean + ' ditambahkan');
      return category;
    },
    unitOptions(query = '') {
      const q = String(query || '').toLowerCase();
      return this.units.filter(unit => !q || unit.toLowerCase().includes(q));
    },
    addUnitValue(name) {
      const clean = String(name || '').trim();
      if (!clean) { this.notify('Nama satuan wajib diisi', 'error'); return null; }
      const existing = this.units.find(unit => unit.toLowerCase() === clean.toLowerCase());
      if (existing) return existing;
      this.units.push(clean);
      this.persist();
      this.notify('Satuan ' + clean + ' ditambahkan');
      return clean;
    },
    get formPickerOptions() {
      if (this.formPicker.kind === 'category') {
        return this.categoryOptions(this.formPicker.target, this.formPicker.query)
          .map(category => ({ id:category.id, label:category.name, code:category.code }));
      }
      return this.unitOptions(this.formPicker.query)
        .map(unit => ({ id:unit, label:unit, code:'' }));
    },
    formPickerTitle() {
      const targetLabel = this.formPicker.target === 'material' ? 'Barang' : 'Produk';
      return this.formPicker.kind === 'category' ? 'Kategori ' + targetLabel : 'Satuan';
    },
    formPickerAddLabel() {
      const name = String(this.formPicker.query || '').trim();
      const prefix = this.formPicker.kind === 'category' ? 'Tambah kategori ' : 'Tambah satuan ';
      return prefix + '"' + name + '"';
    },
    openFormPicker(kind, target, event) {
      const button = event && event.currentTarget;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
      const estimatedHeight = 330;
      const openUp = rect.bottom + estimatedHeight > window.innerHeight;
      const top = openUp ? Math.max(12, rect.top - estimatedHeight - 6) : rect.bottom + 6;
      this.formPicker = { open:true, kind, target, query:'', top, left, width };
    },
    closeFormPicker() {
      this.formPicker.open = false;
    },
    selectFormPickerValue(option) {
      if (!option) return;
      if (this.formPicker.kind === 'category') {
        if (this.formPicker.target === 'material') this.materialForm.categoryId = option.id;
        else this.productForm.categoryId = option.id;
      } else {
        if (this.formPicker.target === 'material') this.materialForm.unit = option.id;
        else this.productForm.unit = option.id;
      }
      this.closeFormPicker();
    },
    addFormPickerValue() {
      const name = String(this.formPicker.query || '').trim();
      if (!name) return;
      if (this.formPicker.kind === 'category') {
        const category = this.addCategoryValue(this.formPicker.target, name);
        if (category) this.selectFormPickerValue({ id:category.id, label:category.name, code:category.code });
      } else {
        const unit = this.addUnitValue(name);
        if (unit) this.selectFormPickerValue({ id:unit, label:unit, code:'' });
      }
    },
    openCategory(type, category = null) {
      this.categoryType = type;
      this.categoryEditId = category ? category.id : null;
      this.categoryForm = category
        ? { name:category.name, description:category.description, status:category.status }
        : { name:'', description:'', status:true };
      this.categoryModalOpen = true;
    },
    saveCategory() {
      if (!this.categoryForm.name) { this.notify('Nama kategori wajib diisi', 'error'); return; }
      const name = this.categoryForm.name.trim();
      const duplicate = this.categories.find(c => c.type === this.categoryType && c.id !== this.categoryEditId && c.name.toLowerCase() === name.toLowerCase());
      if (duplicate) { this.notify('Nama kategori sudah dipakai pada tipe ini', 'error'); return; }
      if (this.categoryEditId) {
        const category = this.categories.find(c => c.id === this.categoryEditId);
        if (category) Object.assign(category, { ...this.categoryForm, name });
        this.notify('Kategori berhasil diperbarui');
      } else {
        this.categories.push({
          id:'cat' + Date.now(),
          code:nextSimpleCode(this.categories, 'KAT-'),
          type:this.categoryType,
          ...this.categoryForm,
          name
        });
        this.notify('Kategori baru berhasil ditambahkan');
      }
      this.categoryModalOpen = false;
      this.persist();
    },
    categoryUsed(id) {
      return this.products.some(p => p.categoryId === id) || this.materials.some(m => m.categoryId === id);
    },
    deleteCategory(category) {
      if (this.categoryUsed(category.id)) {
        this.notify('Kategori masih dipakai produk/barang', 'error');
        return;
      }
      this.askConfirm('delete-category', category.id, 'Hapus kategori?', 'Kategori ' + category.name + ' akan dihapus.');
    },

    /* ---------- MATERIAL (Master Barang) ---------- */
    materialTab: 'items', materialSearch: '', materialStatus: '', materialCategory: '',
    materialModalOpen: false, materialEditId: null,
    materialForm: { name:'', categoryId:'', unit:'Pcs', purchasePrice:0, minStock:0, stock:0, status:true, description:'' },
    get filteredMaterials() {
      const q = this.materialSearch.toLowerCase();
      return this.materials.filter(m => {
        if (q && !(m.name + ' ' + m.code).toLowerCase().includes(q)) return false;
        if (this.materialStatus && String(m.status) !== this.materialStatus) return false;
        if (this.materialCategory && m.categoryId !== this.materialCategory) return false;
        return true;
      });
    },
    material(id) { return this.materials.find(m => m.id === id) || {}; },
    materialName(id) { return (this.materials.find(m => m.id === id) || {}).name || '-'; },
    openMaterial(material = null, forPR = false) {
      if (!forPR) this.prMaterialTargetIndex = null;
      this.closeFormPicker();
      this.materialEditId = material ? material.id : null;
      this.materialForm = material
        ? {
            name:material.name, categoryId:material.categoryId || '', unit:material.unit,
            purchasePrice:material.purchasePrice, minStock:material.minStock, stock:material.stock,
            status:material.status, description:material.description || ''
          }
        : {
            name:'', categoryId:this.materialCategories[0]?.id || '', unit:'Pcs',
            purchasePrice:0, minStock:0, stock:0, status:true, description:''
          };
      this.materialModalOpen = true;
    },
    saveMaterial() {
      if (!this.materialForm.name) { this.notify('Nama barang wajib diisi', 'error'); return; }
      const data = {
        ...this.materialForm,
        categoryId:this.materialForm.categoryId || null,
        purchasePrice:Number(this.materialForm.purchasePrice) || 0,
        minStock:Number(this.materialForm.minStock) || 0,
        stock:Number(this.materialForm.stock) || 0,
        status:!!this.materialForm.status
      };
      let created = null;
      if (this.materialEditId) {
        const material = this.materials.find(m => m.id === this.materialEditId);
        if (material) Object.assign(material, data);
        this.notify('Barang berhasil diperbarui');
      } else {
        created = { id:'mat' + Date.now(), code:nextSimpleCode(this.materials, 'BRG-'), ...data };
        this.materials.push(created);
        this.notify('Barang baru berhasil ditambahkan');
      }
      if (created && this.prMaterialTargetIndex !== null) {
        const target = this.prMaterialTargetIndex;
        if (target === 'new' || !this.prForm.items[target]) {
          this.prForm.items.push({ materialId:created.id, qty:1, note:'', materialOpen:false, materialSearch:'' });
        } else {
          this.prForm.items[target].materialId = created.id;
          this.prForm.items[target].materialOpen = false;
          this.prForm.items[target].materialSearch = '';
        }
        this.prMaterialTargetIndex = null;
      }
      this.materialModalOpen = false;
      this.persist();
    },
    deleteMaterial(material) {
      const used = this.purchaseRequests.some(pr => (pr.items || []).some(item => item.materialId === material.id));
      if (used) { this.notify('Barang masih dipakai pada Purchase Request', 'error'); return; }
      this.askConfirm('delete-material', material.id, 'Hapus barang?', 'Barang ' + material.name + ' akan dihapus.');
    },

    /* ---------- SUPPLIER ---------- */
    supplierSearch: '', supplierStatus: '', supplierModalOpen: false, supplierEditId: null,
    supplierForm: { name:'', contact:'', phone:'', email:'', address:'', paymentTerms:'', status:true, notes:'' },
    get filteredSuppliers() {
      const q = this.supplierSearch.toLowerCase();
      return this.suppliers.filter(supplier => {
        if (q && !(supplier.name + ' ' + supplier.code + ' ' + supplier.contact).toLowerCase().includes(q)) return false;
        if (this.supplierStatus && String(supplier.status) !== this.supplierStatus) return false;
        return true;
      });
    },
    openSupplier(supplier = null) {
      this.supplierEditId = supplier ? supplier.id : null;
      this.supplierForm = supplier
        ? {
            name:supplier.name, contact:supplier.contact, phone:supplier.phone, email:supplier.email,
            address:supplier.address, paymentTerms:supplier.paymentTerms, status:supplier.status, notes:supplier.notes || ''
          }
        : { name:'', contact:'', phone:'', email:'', address:'', paymentTerms:'', status:true, notes:'' };
      this.supplierModalOpen = true;
    },
    saveSupplier() {
      if (!this.supplierForm.name) { this.notify('Nama supplier wajib diisi', 'error'); return; }
      if (this.supplierEditId) {
        const supplier = this.suppliers.find(s => s.id === this.supplierEditId);
        if (supplier) Object.assign(supplier, this.supplierForm);
        this.notify('Supplier berhasil diperbarui');
      } else {
        this.suppliers.push({ id:'sup' + Date.now(), code:nextSimpleCode(this.suppliers, 'SUP-'), ...this.supplierForm });
        this.notify('Supplier baru berhasil ditambahkan');
      }
      this.supplierModalOpen = false;
      this.persist();
    },
    deleteSupplier(supplier) {
      this.askConfirm('delete-supplier', supplier.id, 'Hapus supplier?', 'Supplier ' + supplier.name + ' akan dihapus.');
    },

    /* ---------- PURCHASE REQUEST ---------- */
    prSearch: '', prStatus: '', prEditId: null, prEditRequester: '', prMaterialTargetIndex: null,
    prDetailOpen: false, prSelectedId: null, prRejectOpen: false, prRejectId: null, prRejectReason: '',
    prForm: { date: todayISO(), purpose:'', items:[{ materialId:'', qty:1, note:'', materialOpen:false, materialSearch:'' }] },
    get filteredPurchaseRequests() {
      const q = this.prSearch.toLowerCase();
      return this.purchaseRequests.filter(pr => {
        if (q && !(pr.code + ' ' + pr.purpose + ' ' + pr.requester).toLowerCase().includes(q)) return false;
        if (this.prStatus && pr.status !== this.prStatus) return false;
        return true;
      });
    },
    get selectedPR() {
      return this.purchaseRequests.find(pr => pr.id === this.prSelectedId) || this.purchaseRequests[0] || {};
    },
    get canApprovePR() { return this.role === 'Manager'; },
    get activeMaterials() { return this.materials.filter(m => m.status); },
    get prFormQty() {
      return (this.prForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    },
    prStatusBadge(status) {
      return { draft:'badge-slate', submitted:'badge-yellow', approved:'badge-green', processing:'badge-blue', completed:'badge-cyan', rejected:'badge-red', cancelled:'badge-stone' }[status] || 'badge-slate';
    },
    prStatusLabel(status) {
      return { draft:'Draft', submitted:'Diajukan', approved:'Disetujui', processing:'Diproses', completed:'Selesai', rejected:'Ditolak', cancelled:'Dibatalkan' }[status] || status;
    },
    startPRCreate() {
      this.prEditId = null;
      this.prEditRequester = this.currentUser;
      this.prForm = { date:todayISO(), purpose:'', items:[{ materialId:'', qty:1, note:'', materialOpen:false, materialSearch:'' }] };
      this.go('purchase-request-create');
    },
    startPREdit(pr) {
      if (!pr) return;
      if (pr.status !== 'draft') { this.notify('Hanya PR draft yang dapat diedit', 'error'); return; }
      if (pr.requesterId !== this.currentUserId && !['Admin','Manager'].includes(this.role)) {
        this.notify('Anda tidak berhak mengedit PR ini', 'error');
        return;
      }
      this.prEditId = pr.id;
      this.prEditRequester = pr.requester;
      this.prForm = {
        date:pr.date,
        purpose:pr.purpose,
        items:(pr.items || []).map(item => ({
          materialId:item.materialId,
          qty:item.qty,
          note:item.note || '',
          materialOpen:false,
          materialSearch:''
        }))
      };
      this.go('purchase-request-create');
    },
    openPR(pr = null) {
      return pr ? this.startPREdit(pr) : this.startPRCreate();
    },
    addPRLine() {
      this.prForm.items.push({ materialId:'', qty:1, note:'', materialOpen:false, materialSearch:'' });
    },
    removePRLine(index) {
      this.prForm.items.splice(index, 1);
      if (!this.prForm.items.length) this.prForm.items.push({ materialId:'', qty:1, note:'', materialOpen:false, materialSearch:'' });
    },
    materialLabel(id) {
      const material = this.materials.find(item => item.id === id);
      return material ? material.code + ' — ' + material.name + ' (' + material.unit + ')' : '';
    },
    materialOptionsFor(index) {
      const item = this.prForm.items[index] || {};
      const selectedElsewhere = this.prForm.items
        .filter((row, rowIndex) => rowIndex !== index)
        .map(row => row.materialId)
        .filter(Boolean);
      const query = String(item.materialSearch || '').toLowerCase();
      return this.activeMaterials.filter(material => {
        if (selectedElsewhere.includes(material.id)) return false;
        if (!query) return true;
        return (material.code + ' ' + material.name + ' ' + material.unit).toLowerCase().includes(query);
      });
    },
    selectPRMaterial(index, material) {
      const item = this.prForm.items[index];
      if (!item) return;
      item.materialId = material.id;
      item.materialOpen = false;
      item.materialSearch = '';
    },
    openMaterialForPR(index = null) {
      if (index !== null && this.prForm.items[index]) this.prForm.items[index].materialOpen = false;
      this.prMaterialTargetIndex = index === null ? 'new' : index;
      this.openMaterial(null, true);
    },
    savePR(submit = false) {
      if (!this.prForm.purpose.trim()) { this.notify('Keperluan PR wajib diisi', 'error'); return; }
      const items = (this.prForm.items || [])
        .filter(item => item.materialId && Number(item.qty) > 0)
        .map(item => ({ materialId:item.materialId, qty:Number(item.qty), note:item.note || '', orderedQty:0 }));
      if (!items.length) { this.notify('Tambahkan minimal 1 barang dengan qty lebih dari 0', 'error'); return; }
      const duplicates = items.map(item => item.materialId).filter((id, index, list) => list.indexOf(id) !== index);
      if (duplicates.length) { this.notify('Barang yang sama tidak boleh dipilih dua kali', 'error'); return; }
      const invalid = items.find(item => !this.materials.some(m => m.id === item.materialId && m.status));
      if (invalid) { this.notify('Barang tidak aktif atau tidak ditemukan', 'error'); return; }
      const now = todayISO();
      if (this.prEditId) {
        const pr = this.purchaseRequests.find(item => item.id === this.prEditId);
        if (!pr || pr.status !== 'draft') { this.notify('PR ini tidak dapat diedit', 'error'); return; }
        pr.date = this.prForm.date || now;
        pr.purpose = this.prForm.purpose.trim();
        pr.items = items;
        if (submit) {
          pr.status = 'submitted';
          pr.history.push({ action:'submitted', by:this.currentUser, at:now, note:'' });
        }
        this.notify(submit ? 'PR berhasil disubmit' : 'Draft PR berhasil diperbarui');
      } else {
        const pr = {
          id:'pr' + Date.now(),
          code:docCode('PR', this.prForm.date || now, nextDocSeq(this.purchaseRequests, 'PR', this.prForm.date || now)),
          date:this.prForm.date || now,
          requesterId:this.currentUserId,
          requester:this.currentUser,
          purpose:this.prForm.purpose.trim(),
          status:submit ? 'submitted' : 'draft',
          items,
          history:[{ action:submit ? 'submitted' : 'draft', by:this.currentUser, at:now, note:'' }],
          rejectReason:''
        };
        this.purchaseRequests.unshift(pr);
        this.prSelectedId = pr.id;
        this.notify(submit ? 'PR berhasil disubmit' : 'Draft PR berhasil dibuat');
      }
      this.persist();
      this.go('purchase-requests');
    },
    submitPR(pr) {
      if (pr.status !== 'draft') { this.notify('Hanya PR draft yang dapat diajukan', 'error'); return; }
      if (pr.requesterId !== this.currentUserId && !['Admin','Manager'].includes(this.role)) {
        this.notify('Anda tidak berhak mengajukan PR ini', 'error');
        return;
      }
      pr.status = 'submitted';
      pr.history = pr.history || [];
      pr.history.push({ action:'submitted', by:this.currentUser, at:todayISO(), note:'' });
      this.persist();
      this.notify('PR berhasil disubmit');
    },
    viewPR(pr) { this.prSelectedId = pr.id; this.prDetailOpen = true; },
    startPRPreview(pr) {
      if (!pr) return;
      this.prSelectedId = pr.id;
      this.prDetailOpen = false;
      this.go('purchase-request-preview');
    },
    printPR() {
      const styleId = 'pr-print-page-style';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = '@page { size: A4 portrait; margin: 12mm; }';
        document.head.appendChild(style);
      }
      document.body.classList.add('print-pr');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-pr');
        const current = document.getElementById(styleId);
        if (current) current.remove();
      }, 300);
    },
    exportPRPDF() {
      this.notify('Pada dialog print, pilih "Save as PDF" untuk menyimpan file.');
      setTimeout(() => this.printPR(), 120);
    },
    printPO() { return this.printPR(); },
    exportPOPDF() {
      this.notify('Pada dialog print, pilih "Save as PDF" untuk menyimpan file.');
      setTimeout(() => this.printPR(), 120);
    },
    approvePR(pr) {
      if (!this.canApprovePR) { this.notify('Approval PR hanya dapat dilakukan oleh role Manager', 'error'); return; }
      if (pr.requesterId === this.currentUserId) { this.notify('Manager tidak dapat menyetujui PR miliknya sendiri', 'error'); return; }
      if (pr.status !== 'submitted') { this.notify('PR ini tidak dalam status diajukan', 'error'); return; }
      this.askConfirm('approve-pr', pr.id, 'Setujui Purchase Request?', 'Purchase Request ' + pr.code + ' akan disetujui atas nama ' + this.currentUser + '.', false);
    },
    openRejectPR(pr) {
      if (!this.canApprovePR) { this.notify('Approval PR hanya dapat dilakukan oleh role Manager', 'error'); return; }
      if (pr.requesterId === this.currentUserId) { this.notify('Manager tidak dapat menolak PR miliknya sendiri', 'error'); return; }
      this.prRejectId = pr.id;
      this.prRejectReason = '';
      this.prRejectOpen = true;
    },
    submitRejectPR() {
      const pr = this.purchaseRequests.find(item => item.id === this.prRejectId);
      if (!pr) return;
      if (!this.prRejectReason.trim()) { this.notify('Alasan penolakan wajib diisi', 'error'); return; }
      pr.status = 'rejected';
      pr.rejectReason = this.prRejectReason.trim();
      pr.history = pr.history || [];
      pr.history.push({ action:'rejected', by:this.currentUser, at:todayISO(), note:pr.rejectReason });
      this.prRejectOpen = false;
      this.persist();
      this.notify('PR ditolak');
    },
    cancelPR(pr) {
      if (!['draft','submitted'].includes(pr.status)) { this.notify('PR ini tidak dapat dibatalkan', 'error'); return; }
      if (pr.requesterId !== this.currentUserId && !['Admin','Manager'].includes(this.role)) {
        this.notify('Anda tidak berhak membatalkan PR ini', 'error');
        return;
      }
      this.askConfirm('cancel-pr', pr.id, 'Batalkan PR?', 'PR ' + pr.code + ' akan dibatalkan.', true);
    },

    /* ---------- PURCHASE ORDER ---------- */
    poSearch: '', poStatus: '', poSupplier: '',
    poSelectedId: null, poDetailOpen: false, poRejectOpen: false, poRejectId: null, poRejectReason: '',
    poEditId: null,
    poForm: { date:todayISO(), supplierId:'', prId:'', paymentTerms:'', notes:'', items:[{ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' }] },
    get filteredPurchaseOrders() {
      const q = this.poSearch.toLowerCase();
      return this.purchaseOrders.filter(po => {
        const supplier = this.suppliers.find(s => s.id === po.supplierId) || {};
        if (q && !(po.code + ' ' + (po.prCode || '') + ' ' + (supplier.name || '')).toLowerCase().includes(q)) return false;
        if (this.poStatus && po.status !== this.poStatus) return false;
        if (this.poSupplier && po.supplierId !== this.poSupplier) return false;
        return true;
      });
    },
    get selectedPO() {
      return this.purchaseOrders.find(po => po.id === this.poSelectedId) || this.purchaseOrders[0] || {};
    },
    get poSourcePR() {
      return this.purchaseRequests.find(pr => pr.id === this.poForm.prId) || null;
    },
    get canApprovePO() { return this.role === 'Manager'; },
    get poSubtotal() {
      return (this.poForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    },
    get poFormQty() {
      return (this.poForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    },
    get activeSuppliers() { return this.suppliers.filter(supplier => supplier.status); },
    supplierName(id) { return (this.suppliers.find(s => s.id === id) || {}).name || '-'; },
    poStatusBadge(status) {
      return { draft:'badge-slate', pending_approval:'badge-yellow', approved:'badge-green', sent:'badge-blue', partially_received:'badge-cyan', fully_received:'badge-green', closed:'badge-stone', rejected:'badge-red', cancelled:'badge-red' }[status] || 'badge-slate';
    },
    poStatusLabel(status) {
      return { draft:'Draft', pending_approval:'Menunggu Approval', approved:'Disetujui', sent:'Dikirim', partially_received:'Diterima Sebagian', fully_received:'Diterima Penuh', closed:'Ditutup', rejected:'Ditolak', cancelled:'Dibatalkan' }[status] || status;
    },
    poLineSubtotal(item) { return (Number(item.qty) || 0) * (Number(item.price) || 0); },
    poMaterialOptionsFor(index) {
      const item = this.poForm.items[index] || {};
      const selectedElsewhere = this.poForm.items
        .filter((row, rowIndex) => rowIndex !== index)
        .map(row => row.materialId)
        .filter(Boolean);
      const query = String(item.materialSearch || '').toLowerCase();
      const source = this.poSourcePR;
      const allowed = source
        ? (source.items || []).filter(prItem => Number(prItem.qty) - Number(prItem.orderedQty || 0) > 0).map(prItem => prItem.materialId)
        : null;
      return this.activeMaterials.filter(material => {
        if (allowed && !allowed.includes(material.id)) return false;
        if (selectedElsewhere.includes(material.id)) return false;
        if (!query) return true;
        return (material.code + ' ' + material.name + ' ' + material.unit).toLowerCase().includes(query);
      });
    },
    poMaterialMaxQty(index) {
      const item = this.poForm.items[index] || {};
      const source = this.poSourcePR;
      if (!source || !item.materialId) return null;
      const prItem = (source.items || []).find(row => row.materialId === item.materialId);
      if (!prItem) return 0;
      return Math.max(0, Number(prItem.qty) - Number(prItem.orderedQty || 0));
    },
    selectPOMaterial(index, material) {
      const item = this.poForm.items[index];
      if (!item) return;
      item.materialId = material.id;
      item.price = Number(material.purchasePrice) || 0;
      item.materialOpen = false;
      item.materialSearch = '';
    },
    addPOLine() {
      this.poForm.items.push({ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' });
    },
    removePOLine(index) {
      this.poForm.items.splice(index, 1);
      if (!this.poForm.items.length) this.poForm.items.push({ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' });
    },
    onPOSupplierChange() {
      const supplier = this.suppliers.find(s => s.id === this.poForm.supplierId);
      if (supplier) this.poForm.paymentTerms = supplier.paymentTerms || '';
    },
    openPOCreate(pr = null) {
      if (pr) {
        if (!['approved','processing'].includes(pr.status)) {
          this.notify('PO hanya dapat dibuat dari PR yang disetujui dan belum selesai', 'error');
          return;
        }
        const items = (pr.items || [])
          .filter(item => Number(item.qty) - Number(item.orderedQty || 0) > 0)
          .map(item => ({
            materialId:item.materialId,
            qty:Number(item.qty) - Number(item.orderedQty || 0),
            price:Number(this.material(item.materialId).purchasePrice) || 0,
            materialOpen:false,
            materialSearch:''
          }));
        if (!items.length) { this.notify('Semua qty PR sudah dipesan', 'error'); return; }
        const supplier = this.activeSuppliers[0];
        this.poEditId = null;
        this.poForm = {
          date:todayISO(),
          supplierId:supplier ? supplier.id : '',
          prId:pr.id,
          paymentTerms:supplier ? supplier.paymentTerms : '',
          notes:'',
          items
        };
      } else {
        const supplier = this.activeSuppliers[0];
        this.poEditId = null;
        this.poForm = {
          date:todayISO(),
          supplierId:supplier ? supplier.id : '',
          prId:'',
          paymentTerms:supplier ? supplier.paymentTerms : '',
          notes:'',
          items:[{ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' }]
        };
      }
      this.go('purchase-order-create');
    },
    startPOEdit(po) {
      if (!po || po.status !== 'draft') { this.notify('Hanya PO draft yang dapat diedit', 'error'); return; }
      this.poEditId = po.id;
      this.poForm = {
        date:po.date,
        supplierId:po.supplierId,
        prId:po.prId || '',
        paymentTerms:po.paymentTerms || '',
        notes:po.notes || '',
        items:(po.items || []).map(item => ({
          materialId:item.materialId,
          qty:item.qty,
          price:item.price,
          materialOpen:false,
          materialSearch:''
        }))
      };
      this.go('purchase-order-create');
    },
    poValidationError(items) {
      if (!this.poForm.supplierId) return 'Supplier wajib dipilih';
      const rows = (items || []).filter(item => item.materialId && Number(item.qty) > 0);
      if (!rows.length) return 'Tambahkan minimal 1 barang dengan qty lebih dari 0';
      const duplicates = rows.map(item => item.materialId).filter((id, index, list) => list.indexOf(id) !== index);
      if (duplicates.length) return 'Barang yang sama tidak boleh dipilih dua kali';
      for (const item of rows) {
        const material = this.materials.find(m => m.id === item.materialId);
        if (!material || !material.status) return 'Barang tidak aktif atau tidak ditemukan';
        if (Number(item.price) < 0) return 'Harga tidak boleh negatif';
      }
      const pr = this.poForm.prId ? this.purchaseRequests.find(item => item.id === this.poForm.prId) : null;
      if (this.poForm.prId && !pr) return 'PR sumber tidak ditemukan';
      if (pr) {
        for (const item of rows) {
          const prItem = (pr.items || []).find(row => row.materialId === item.materialId);
          if (!prItem) return 'Barang tidak ada pada PR sumber';
          if (Number(item.qty) > Number(prItem.qty) - Number(prItem.orderedQty || 0)) {
            return 'Qty ' + this.materialName(item.materialId) + ' melebihi sisa PR';
          }
        }
      }
      return null;
    },
    savePO(submit = false) {
      const items = (this.poForm.items || [])
        .filter(item => item.materialId && Number(item.qty) > 0)
        .map(item => ({
          materialId:item.materialId,
          qty:Number(item.qty),
          price:Number(item.price) || 0,
          receivedQty:0,
          returnedQty:0
        }));
      const error = this.poValidationError(items);
      if (error) { this.notify(error, 'error'); return; }
      const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const now = todayISO();
      if (this.poEditId) {
        const po = this.purchaseOrders.find(item => item.id === this.poEditId);
        if (!po || po.status !== 'draft') { this.notify('PO ini tidak dapat diedit', 'error'); return; }
        po.date = this.poForm.date || now;
        po.supplierId = this.poForm.supplierId;
        po.prId = this.poForm.prId || '';
        po.prCode = po.prId ? (this.purchaseRequests.find(pr => pr.id === po.prId) || {}).code || '' : '';
        po.paymentTerms = this.poForm.paymentTerms || '';
        po.notes = this.poForm.notes || '';
        po.items = items;
        po.subtotal = total;
        po.total = total;
        if (submit) {
          po.status = 'pending_approval';
          po.history.push({ action:'submitted', by:this.currentUser, at:now, note:'' });
        }
        this.notify(submit ? 'PO berhasil disubmit' : 'Draft PO berhasil diperbarui');
      } else {
        const po = {
          id:'po' + Date.now(),
          code:docCode('PO', this.poForm.date || now, nextDocSeq(this.purchaseOrders, 'PO', this.poForm.date || now)),
          date:this.poForm.date || now,
          supplierId:this.poForm.supplierId,
          prId:this.poForm.prId || '',
          prCode:this.poForm.prId ? (this.purchaseRequests.find(pr => pr.id === this.poForm.prId) || {}).code || '' : '',
          paymentTerms:this.poForm.paymentTerms || '',
          notes:this.poForm.notes || '',
          status:submit ? 'pending_approval' : 'draft',
          items,
          subtotal:total,
          total,
          createdBy:this.currentUser,
          createdById:this.currentUserId,
          history:[{ action:submit ? 'submitted' : 'draft', by:this.currentUser, at:now, note:'' }],
          rejectReason:''
        };
        this.purchaseOrders.unshift(po);
        this.poSelectedId = po.id;
        this.notify(submit ? 'PO berhasil dibuat dan disubmit' : 'Draft PO berhasil dibuat');
      }
      this.persist();
      this.go('purchase-orders');
    },
    submitPO(po) {
      if (po.status !== 'draft') { this.notify('Hanya PO draft yang dapat disubmit', 'error'); return; }
      this.poForm = {
        date:po.date, supplierId:po.supplierId, prId:po.prId || '',
        paymentTerms:po.paymentTerms, notes:po.notes,
        items:(po.items || []).map(item => ({ ...item }))
      };
      const error = this.poValidationError(po.items || []);
      if (error) { this.notify(error, 'error'); return; }
      po.status = 'pending_approval';
      po.history = po.history || [];
      po.history.push({ action:'submitted', by:this.currentUser, at:todayISO(), note:'' });
      this.persist();
      this.notify('PO berhasil disubmit');
    },
    viewPO(po) { this.poSelectedId = po.id; this.poDetailOpen = true; },
    startPOPreview(po) {
      if (!po) return;
      this.poSelectedId = po.id;
      this.poDetailOpen = false;
      this.go('purchase-order-preview');
    },
    poApprovalError(po) {
      if (!po.prId) return null;
      const pr = this.purchaseRequests.find(item => item.id === po.prId);
      if (!pr) return 'PR sumber tidak ditemukan';
      for (const poItem of (po.items || [])) {
        const prItem = (pr.items || []).find(item => item.materialId === poItem.materialId);
        if (!prItem) return 'Barang tidak ada pada PR sumber';
        if (Number(poItem.qty) > Number(prItem.qty) - Number(prItem.orderedQty || 0)) {
          return 'Qty ' + this.materialName(poItem.materialId) + ' melebihi sisa PR';
        }
      }
      return null;
    },
    approvePO(po) {
      if (!this.canApprovePO) { this.notify('Approval PO hanya dapat dilakukan oleh role Manager', 'error'); return; }
      if (po.createdById === this.currentUserId) { this.notify('Manager tidak dapat menyetujui PO miliknya sendiri', 'error'); return; }
      if (po.status !== 'pending_approval') { this.notify('PO ini tidak menunggu approval', 'error'); return; }
      const error = this.poApprovalError(po);
      if (error) { this.notify(error, 'error'); return; }
      this.askConfirm('approve-po', po.id, 'Setujui Purchase Order?', 'PO ' + po.code + ' akan disetujui dan qty PR akan dipesan.', false);
    },
    openRejectPO(po) {
      if (!this.canApprovePO) { this.notify('Approval PO hanya dapat dilakukan oleh role Manager', 'error'); return; }
      if (po.createdById === this.currentUserId) { this.notify('Manager tidak dapat menolak PO miliknya sendiri', 'error'); return; }
      this.poRejectId = po.id;
      this.poRejectReason = '';
      this.poRejectOpen = true;
    },
    submitRejectPO() {
      const po = this.purchaseOrders.find(item => item.id === this.poRejectId);
      if (!po) return;
      if (!this.poRejectReason.trim()) { this.notify('Alasan penolakan wajib diisi', 'error'); return; }
      po.status = 'rejected';
      po.rejectReason = this.poRejectReason.trim();
      po.history = po.history || [];
      po.history.push({ action:'rejected', by:this.currentUser, at:todayISO(), note:po.rejectReason });
      this.poRejectOpen = false;
      this.persist();
      this.notify('PO ditolak');
    },
    sendPO(po) {
      if (po.status !== 'approved') { this.notify('Hanya PO approved yang dapat dikirim', 'error'); return; }
      po.status = 'sent';
      po.sentAt = todayISO();
      po.history = po.history || [];
      po.history.push({ action:'sent', by:this.currentUser, at:todayISO(), note:'' });
      this.persist();
      this.notify('PO ditandai terkirim ke supplier');
    },
    closePO(po) {
      if (!['approved','sent','partially_received','fully_received'].includes(po.status)) { this.notify('PO ini tidak dapat ditutup', 'error'); return; }
      po.status = 'closed';
      po.closedAt = todayISO();
      po.history = po.history || [];
      po.history.push({ action:'closed', by:this.currentUser, at:todayISO(), note:'' });
      this.persist();
      this.notify('PO ditutup');
    },
    cancelPO(po) {
      if (!['draft','pending_approval','approved'].includes(po.status)) {
        this.notify('PO yang sudah dikirim tidak dapat dibatalkan', 'error');
        return;
      }
      if (po.createdById !== this.currentUserId && !['Admin','Manager'].includes(this.role)) {
        this.notify('Anda tidak berhak membatalkan PO ini', 'error');
        return;
      }
      this.askConfirm('cancel-po', po.id, 'Batalkan PO?', 'PO ' + po.code + ' akan dibatalkan.', true);
    },
    updatePRStatus(pr) {
      if (!pr || !['approved','processing','completed'].includes(pr.status)) return;
      const allOrdered = (pr.items || []).every(item => Number(item.orderedQty || 0) >= Number(item.qty));
      const anyOrdered = (pr.items || []).some(item => Number(item.orderedQty || 0) > 0);
      pr.status = allOrdered ? 'completed' : anyOrdered ? 'processing' : 'approved';
    },
    reservePRQuantities(po) {
      if (!po.prId) return;
      const pr = this.purchaseRequests.find(item => item.id === po.prId);
      if (!pr) return;
      (po.items || []).forEach(poItem => {
        const prItem = (pr.items || []).find(item => item.materialId === poItem.materialId);
        if (prItem) prItem.orderedQty = Number(prItem.orderedQty || 0) + Number(poItem.qty || 0);
      });
      this.updatePRStatus(pr);
      pr.history = pr.history || [];
      pr.history.push({ action:'po-approved', by:this.currentUser, at:todayISO(), note:po.code });
    },
    releasePRQuantities(po) {
      if (!po.prId) return;
      const pr = this.purchaseRequests.find(item => item.id === po.prId);
      if (!pr) return;
      (po.items || []).forEach(poItem => {
        const prItem = (pr.items || []).find(item => item.materialId === poItem.materialId);
        if (prItem) prItem.orderedQty = Math.max(0, Number(prItem.orderedQty || 0) - Number(poItem.qty || 0));
      });
      this.updatePRStatus(pr);
      pr.history = pr.history || [];
      pr.history.push({ action:'po-cancelled', by:this.currentUser, at:todayISO(), note:po.code });
    },
    updateMaterialPrices(po) {
      (po.items || []).forEach(poItem => {
        const material = this.materials.find(item => item.id === poItem.materialId);
        if (material) material.purchasePrice = Number(poItem.price) || 0;
      });
    },
    /* ---------- GOODS RECEIPT ---------- */
    receiptSearch: '', receiptStatus: '', receiptSupplier: '',
    receiptSelectedId: null, receiptDetailOpen: false, receiptEditId: null,
    receiptForm: { date:todayISO(), poId:'', warehouseId:'wh1', deliveryNote:'', items:[] },
    stockView: 'product', materialStockSearch: '', materialStockWarehouse: '',
    get filteredReceipts() {
      const q = this.receiptSearch.toLowerCase();
      return this.receipts.filter(receipt => {
        const po = this.purchaseOrders.find(item => item.id === receipt.poId) || {};
        if (q && !(receipt.code + ' ' + (po.code || '') + ' ' + this.supplierName(receipt.supplierId)).toLowerCase().includes(q)) return false;
        if (this.receiptStatus && receipt.status !== this.receiptStatus) return false;
        if (this.receiptSupplier && receipt.supplierId !== this.receiptSupplier) return false;
        return true;
      });
    },
    get selectedReceipt() {
      return this.receipts.find(receipt => receipt.id === this.receiptSelectedId) || this.receipts[0] || {};
    },
    get receiptSourcePO() { return this.purchaseOrders.find(po => po.id === this.receiptForm.poId) || null; },
    get receiptTotal() {
      return (this.receiptForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    },
    receiptStatusBadge(status) { return status === 'posted' ? 'badge-green' : 'badge-slate'; },
    receiptStatusLabel(status) { return status === 'posted' ? 'Posted' : 'Draft'; },
    poRemainingQty(po) {
      return (po.items || []).reduce((sum, item) => sum + Math.max(0, Number(item.qty) - Number(item.receivedQty || 0)), 0);
    },
    get receiptPOOptions() {
      return this.purchaseOrders.filter(po => ['approved','sent','partially_received'].includes(po.status) && this.poRemainingQty(po) > 0);
    },
    receiptLinesFromPO(po) {
      if (!po) return [];
      return (po.items || [])
        .filter(item => Number(item.qty) - Number(item.receivedQty || 0) > 0)
        .map(item => ({
          materialId:item.materialId,
          qty:Number(item.qty) - Number(item.receivedQty || 0),
          price:Number(item.price) || 0,
          materialOpen:false,
          materialSearch:''
        }));
    },
    openReceiptCreate(po = null) {
      const source = po || this.receiptPOOptions[0];
      if (!source) { this.notify('Tidak ada PO dengan sisa qty untuk diterima', 'error'); return; }
      const items = this.receiptLinesFromPO(source);
      if (!items.length) { this.notify('Semua qty PO sudah diterima', 'error'); return; }
      this.receiptEditId = null;
      this.receiptForm = {
        date:todayISO(),
        poId:source.id,
        warehouseId:'wh1',
        deliveryNote:'',
        items
      };
      this.go('receipt-create');
    },
    onReceiptPOChange() {
      this.receiptForm.items = this.receiptLinesFromPO(this.receiptSourcePO);
    },
    receiptPOMaxQty(materialId) {
      const po = this.receiptSourcePO;
      if (!po) return 0;
      const item = (po.items || []).find(row => row.materialId === materialId) || {};
      return Math.max(0, Number(item.qty || 0) - Number(item.receivedQty || 0));
    },
    startReceiptEdit(receipt) {
      if (!receipt || receipt.status !== 'draft') { this.notify('Hanya penerimaan draft yang dapat diedit', 'error'); return; }
      this.receiptEditId = receipt.id;
      this.receiptForm = {
        date:receipt.date,
        poId:receipt.poId,
        warehouseId:receipt.warehouseId,
        deliveryNote:receipt.deliveryNote || '',
        items:(receipt.items || []).map(item => ({
          materialId:item.materialId,
          qty:item.qty,
          price:item.price,
          materialOpen:false,
          materialSearch:''
        }))
      };
      this.go('receipt-create');
    },
    receiptValidationError(poId, warehouseId, items) {
      const po = this.purchaseOrders.find(item => item.id === poId);
      if (!po) return 'PO sumber tidak ditemukan';
      if (!['approved','sent','partially_received'].includes(po.status)) return 'PO tidak dapat diterima pada status ini';
      if (!warehouseId) return 'Gudang wajib dipilih';
      const rows = (items || []).filter(item => Number(item.qty) > 0);
      if (!rows.length) return 'Isi minimal 1 qty penerimaan';
      for (const item of rows) {
        const poItem = (po.items || []).find(row => row.materialId === item.materialId);
        if (!poItem) return 'Barang tidak ada pada PO';
        if (Number(item.qty) > Number(poItem.qty) - Number(poItem.receivedQty || 0)) {
          return 'Qty ' + this.materialName(item.materialId) + ' melebihi sisa PO';
        }
      }
      return null;
    },
    saveReceipt(post = false) {
      const items = (this.receiptForm.items || [])
        .filter(item => Number(item.qty) > 0)
        .map(item => ({
          materialId:item.materialId,
          qty:Number(item.qty),
          price:Number(item.price) || 0
        }));
      const error = this.receiptValidationError(this.receiptForm.poId, this.receiptForm.warehouseId, items);
      if (error) { this.notify(error, 'error'); return; }
      const po = this.purchaseOrders.find(item => item.id === this.receiptForm.poId);
      const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const now = todayISO();
      let receipt = null;
      if (this.receiptEditId) {
        receipt = this.receipts.find(item => item.id === this.receiptEditId);
        if (!receipt || receipt.status !== 'draft') { this.notify('Penerimaan ini tidak dapat diedit', 'error'); return; }
        receipt.date = this.receiptForm.date || now;
        receipt.poId = this.receiptForm.poId;
        receipt.poCode = po.code;
        receipt.supplierId = po.supplierId;
        receipt.warehouseId = this.receiptForm.warehouseId;
        receipt.deliveryNote = this.receiptForm.deliveryNote || '';
        receipt.items = items;
        receipt.total = total;
        this.notify(post ? 'Penerimaan diposting' : 'Draft penerimaan diperbarui');
      } else {
        receipt = {
          id:'gr' + Date.now(),
          code:docCode('GR', this.receiptForm.date || now, nextDocSeq(this.receipts, 'GR', this.receiptForm.date || now)),
          date:this.receiptForm.date || now,
          poId:po.id,
          poCode:po.code,
          supplierId:po.supplierId,
          warehouseId:this.receiptForm.warehouseId,
          deliveryNote:this.receiptForm.deliveryNote || '',
          status:'draft',
          items,
          total,
          journalId:'',
          payableId:'',
          createdBy:this.currentUser,
          createdById:this.currentUserId,
          postedAt:'',
          history:[{ action:'draft', by:this.currentUser, at:now, note:'' }]
        };
        this.receipts.unshift(receipt);
        this.receiptSelectedId = receipt.id;
        this.notify(post ? 'Penerimaan dibuat dan diposting' : 'Draft penerimaan dibuat');
      }
      if (post) this.postReceiptDocument(receipt);
      this.persist();
      this.go('receipts');
    },
    postReceipt(receipt) {
      if (!receipt || receipt.status !== 'draft') { this.notify('Hanya penerimaan draft yang dapat diposting', 'error'); return; }
      const error = this.receiptValidationError(receipt.poId, receipt.warehouseId, receipt.items);
      if (error) { this.notify(error, 'error'); return; }
      this.askConfirm('post-receipt', receipt.id, 'Posting penerimaan?', 'Stok, jurnal, dan utang supplier akan dibuat otomatis.', false);
    },
    postReceiptDocument(receipt) {
      const po = this.purchaseOrders.find(item => item.id === receipt.poId);
      if (!po) { this.notify('PO tidak ditemukan', 'error'); return; }
      const now = todayISO();
      (receipt.items || []).forEach(item => {
        const poItem = (po.items || []).find(row => row.materialId === item.materialId);
        if (!poItem) return;
        const remaining = Number(poItem.qty) - Number(poItem.receivedQty || 0);
        const qty = Math.min(Number(item.qty) || 0, remaining);
        if (qty <= 0) return;
        poItem.receivedQty = Number(poItem.receivedQty || 0) + qty;
        const material = this.materials.find(row => row.id === item.materialId);
        if (material) {
          const oldQty = Number(material.stock) || 0;
          const oldValue = Number(material.stockValue) || 0;
          const newQty = oldQty + qty;
          const newValue = oldValue + qty * (Number(item.price) || 0);
          material.stock = newQty;
          material.stockValue = newValue;
          material.avgCost = newQty > 0 ? newValue / newQty : Number(material.purchasePrice) || 0;
          material.purchasePrice = Number(item.price) || material.purchasePrice;
        }
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date:receipt.date,
          materialId:item.materialId,
          warehouseId:receipt.warehouseId,
          type:'receipt',
          qty,
          value:qty * (Number(item.price) || 0),
          unitCost:Number(item.price) || 0,
          refType:'receipt',
          refId:receipt.id,
          refNumber:receipt.code,
          createdAt:now
        });
      });
      const allReceived = (po.items || []).every(item => Number(item.receivedQty || 0) >= Number(item.qty));
      const anyReceived = (po.items || []).some(item => Number(item.receivedQty || 0) > 0);
      po.status = allReceived ? 'fully_received' : anyReceived ? 'partially_received' : po.status;
      po.history = po.history || [];
      po.history.push({ action:'received', by:this.currentUser, at:now, note:receipt.code });

      const journal = this.createSystemJournal({
        date:receipt.date,
        description:'Penerimaan barang ' + receipt.code,
        source:'receipt',
        sourceId:receipt.id,
        lines:[
          { accountId:'acc4', debit:receipt.total, credit:0, memo:'Persediaan ' + receipt.code },
          { accountId:'acc7', debit:0, credit:receipt.total, memo:'Utang supplier ' + receipt.code }
        ]
      });
      const dueDate = this.dueDateFromTerms(po.paymentTerms, receipt.date);
      const payable = {
        id:'ap' + Date.now(),
        code:docCode('AP', receipt.date, nextDocSeq(this.payables, 'AP', receipt.date)),
        supplierId:po.supplierId,
        receiptId:receipt.id,
        receiptCode:receipt.code,
        poId:po.id,
        poCode:po.code,
        date:receipt.date,
        dueDate,
        total:receipt.total,
        paid:0,
        unpaid:receipt.total,
        status:'unpaid',
        history:[{ action:'created', by:this.currentUser, at:now, note:receipt.code }]
      };
      this.payables.unshift(payable);
      receipt.status = 'posted';
      receipt.postedAt = now;
      receipt.journalId = journal ? journal.id : '';
      receipt.payableId = payable.id;
      receipt.history = receipt.history || [];
      receipt.history.push({ action:'posted', by:this.currentUser, at:now, note:'' });
      this.notify('Penerimaan ' + receipt.code + ' diposting');
    },
    dueDateFromTerms(terms, date) {
      const match = String(terms || '').match(/(\d+)/);
      return shiftISO(date || todayISO(), match ? Number(match[1]) : 0);
    },
    createSystemJournal({ date, description, source, sourceId, lines }) {
      const debit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
      const credit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
      if (Math.abs(debit - credit) > 0.0001 || debit <= 0) return null;
      const journal = {
        id:'ju' + Date.now() + Math.random().toString(16).slice(2),
        code:docCode('JU', date || todayISO(), nextDocSeq(this.journals, 'JU', date || todayISO())),
        date:date || todayISO(),
        description:description || 'Jurnal otomatis',
        source:source || 'system',
        sourceId:sourceId || '',
        status:'posted',
        lines,
        postedBy:'Sistem',
        postedAt:todayISO(),
        voidReason:'',
        createdBy:'Sistem',
        history:[{ action:'posted', by:'Sistem', at:todayISO(), note:'Jurnal otomatis' }]
      };
      this.journals.unshift(journal);
      return journal;
    },
    viewReceipt(receipt) { this.receiptSelectedId = receipt.id; this.receiptDetailOpen = true; },
    startReceiptPreview(receipt) {
      if (!receipt) return;
      this.receiptSelectedId = receipt.id;
      this.receiptDetailOpen = false;
      this.go('receipt-preview');
    },
    printReceipt() { return this.printPR(); },
    exportReceiptPDF() {
      this.notify('Pada dialog print, pilih "Save as PDF" untuk menyimpan file.');
      setTimeout(() => this.printPR(), 120);
    },
    deleteReceipt(receipt) {
      if (receipt.status !== 'draft') { this.notify('Hanya draft penerimaan yang dapat dihapus', 'error'); return; }
      this.askConfirm('delete-receipt', receipt.id, 'Hapus penerimaan?', 'Draft ' + receipt.code + ' akan dihapus.');
    },
    get materialStockRows() {
      const grouped = {};
      this.stockMovements.forEach(movement => {
        const key = movement.materialId + '|' + movement.warehouseId;
        if (!grouped[key]) grouped[key] = { materialId:movement.materialId, warehouseId:movement.warehouseId, qty:0, value:0 };
        grouped[key].qty += Number(movement.qty) || 0;
        grouped[key].value += Number(movement.value) || 0;
      });
      return Object.values(grouped).map(row => {
        const material = this.material(row.materialId);
        return {
          ...row,
          code:material.code || '-',
          name:material.name || '-',
          unit:material.unit || '',
          minStock:Number(material.minStock) || 0,
          avgCost:row.qty > 0 ? row.value / row.qty : 0,
          warehouse:this.warehouseName(row.warehouseId),
          status:material.status
        };
      }).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    get filteredMaterialStocks() {
      const q = this.materialStockSearch.toLowerCase();
      return this.materialStockRows.filter(row => {
        if (q && !(row.code + ' ' + row.name + ' ' + row.warehouse).toLowerCase().includes(q)) return false;
        if (this.materialStockWarehouse && row.warehouseId !== this.materialStockWarehouse) return false;
        return true;
      });
    },

    /* ---------- CHART OF ACCOUNTS ---------- */
    coaSearch: '', coaType: '', coaStatus: '', accountModalOpen: false, accountEditId: null,
    accountForm: { code:'', name:'', type:'asset', normalBalance:'debit', parentId:'', isCashBank:false, status:true, description:'' },
    accountById(id) { return this.accounts.find(account => account.id === id) || {}; },
    accountName(id) { return this.accountById(id).name || '-'; },
    accountCode(id) { return this.accountById(id).code || '-'; },
    accountTypeLabel(type) {
      return { asset:'Aset', liability:'Kewajiban', equity:'Ekuitas', revenue:'Pendapatan', expense:'Beban' }[type] || type;
    },
    accountNormalLabel(balance) {
      return { debit:'Debit', credit:'Kredit' }[balance] || balance;
    },
    defaultNormalBalance(type) {
      return ['liability','equity','revenue'].includes(type) ? 'credit' : 'debit';
    },
    get filteredAccounts() {
      const q = this.coaSearch.toLowerCase();
      return this.accounts.filter(account => {
        if (q && !(account.code + ' ' + account.name).toLowerCase().includes(q)) return false;
        if (this.coaType && account.type !== this.coaType) return false;
        if (this.coaStatus && String(account.status) !== this.coaStatus) return false;
        return true;
      });
    },
    accountsByType(type) {
      return this.filteredAccounts.filter(account => account.type === type).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    accountBalance(id) {
      const account = this.accountById(id);
      let debit = 0;
      let credit = 0;
      this.journals.filter(journal => journal.status === 'posted').forEach(journal => {
        (journal.lines || []).forEach(line => {
          if (line.accountId !== id) return;
          debit += Number(line.debit) || 0;
          credit += Number(line.credit) || 0;
        });
      });
      return (account.normalBalance === 'credit') ? credit - debit : debit - credit;
    },
    accountUsed(id) {
      return this.journals.some(journal => (journal.lines || []).some(line => line.accountId === id));
    },
    openAccount(account = null) {
      if (account && account.isSystem) { this.notify('Akun sistem tidak dapat diedit', 'error'); return; }
      this.accountEditId = account ? account.id : null;
      this.accountForm = account
        ? {
            code:account.code, name:account.name, type:account.type,
            normalBalance:account.normalBalance, parentId:account.parentId || '',
            isCashBank:account.isCashBank, status:account.status, description:account.description || ''
          }
        : { code:'', name:'', type:'asset', normalBalance:'debit', parentId:'', isCashBank:false, status:true, description:'' };
      this.accountModalOpen = true;
    },
    saveAccount() {
      if (!this.accountForm.code.trim() || !this.accountForm.name.trim()) {
        this.notify('Kode dan nama akun wajib diisi', 'error');
        return;
      }
      const code = this.accountForm.code.trim();
      const duplicate = this.accounts.find(account => account.id !== this.accountEditId && account.code.toLowerCase() === code.toLowerCase());
      if (duplicate) { this.notify('Kode akun sudah dipakai', 'error'); return; }
      const normalBalance = this.accountForm.normalBalance || this.defaultNormalBalance(this.accountForm.type);
      if (this.accountEditId) {
        const account = this.accountById(this.accountEditId);
        if (!account.id || account.isSystem) { this.notify('Akun sistem tidak dapat diedit', 'error'); return; }
        Object.assign(account, {
          code,
          name:this.accountForm.name.trim(),
          type:this.accountForm.type,
          normalBalance,
          parentId:this.accountForm.parentId || null,
          isCashBank:!!this.accountForm.isCashBank,
          status:!!this.accountForm.status,
          description:this.accountForm.description || ''
        });
        this.notify('Akun berhasil diperbarui');
      } else {
        this.accounts.push({
          id:'acc' + Date.now(),
          code,
          name:this.accountForm.name.trim(),
          type:this.accountForm.type,
          normalBalance,
          parentId:this.accountForm.parentId || null,
          isCashBank:!!this.accountForm.isCashBank,
          isSystem:false,
          isLocked:false,
          status:!!this.accountForm.status,
          description:this.accountForm.description || ''
        });
        this.notify('Akun baru berhasil ditambahkan');
      }
      this.accountModalOpen = false;
      this.persist();
    },
    deleteAccount(account) {
      if (account.isSystem) { this.notify('Akun sistem tidak dapat dihapus', 'error'); return; }
      if (this.accountUsed(account.id)) { this.notify('Akun sudah dipakai pada jurnal', 'error'); return; }
      this.askConfirm('delete-account', account.id, 'Hapus akun?', 'Akun ' + account.code + ' — ' + account.name + ' akan dihapus.');
    },

    /* ---------- JOURNAL ---------- */
    journalSearch: '', journalStatus: '', journalDateFrom: '', journalDateTo: '',
    journalSelectedId: null, journalDetailOpen: false, journalEditId: null,
    journalVoidOpen: false, journalVoidId: null, journalVoidReason: '',
    journalForm: {
      date:todayISO(),
      description:'',
      lines:[
        { accountId:'', debit:0, credit:0, memo:'' },
        { accountId:'', debit:0, credit:0, memo:'' }
      ]
    },
    get filteredJournals() {
      const q = this.journalSearch.toLowerCase();
      return this.journals.filter(journal => {
        if (q && !(journal.code + ' ' + journal.description).toLowerCase().includes(q)) return false;
        if (this.journalStatus && journal.status !== this.journalStatus) return false;
        if (this.journalDateFrom && journal.date < this.journalDateFrom) return false;
        if (this.journalDateTo && journal.date > this.journalDateTo) return false;
        return true;
      });
    },
    get selectedJournal() {
      return this.journals.find(journal => journal.id === this.journalSelectedId) || this.journals[0] || {};
    },
    get canVoidJournal() { return ['Admin','Manager','Developer'].includes(this.role); },
    get journalDebitTotal() {
      return (this.journalForm.lines || []).reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    },
    get journalCreditTotal() {
      return (this.journalForm.lines || []).reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
    },
    get journalDifference() { return this.journalDebitTotal - this.journalCreditTotal; },
    journalTotals(journal) {
      const debit = (journal.lines || []).reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
      const credit = (journal.lines || []).reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
      return { debit, credit };
    },
    get journalStats() {
      const posted = this.journals.filter(journal => journal.status === 'posted');
      const debit = posted.reduce((sum, journal) => sum + this.journalTotals(journal).debit, 0);
      const credit = posted.reduce((sum, journal) => sum + this.journalTotals(journal).credit, 0);
      return {
        draft: this.journals.filter(journal => journal.status === 'draft').length,
        posted: posted.length,
        voided: this.journals.filter(journal => journal.status === 'void').length,
        debit,
        credit,
        difference: debit - credit
      };
    },
    journalStatusBadge(status) {
      return { draft:'badge-slate', posted:'badge-green', void:'badge-red' }[status] || 'badge-slate';
    },
    journalStatusLabel(status) {
      return { draft:'Draft', posted:'Posted', void:'Void' }[status] || status;
    },
    journalSourceLabel() { return 'Manual'; },
    journalAccountOptions() {
      return this.accounts.filter(account => account.status && !account.isLocked).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    startJournalCreate() {
      this.journalEditId = null;
      this.journalForm = {
        date:todayISO(),
        description:'',
        lines:[
          { accountId:'', debit:0, credit:0, memo:'' },
          { accountId:'', debit:0, credit:0, memo:'' }
        ]
      };
      this.go('journal-create');
    },
    startJournalEdit(journal) {
      if (!journal || journal.status !== 'draft') { this.notify('Hanya jurnal draft yang dapat diedit', 'error'); return; }
      this.journalEditId = journal.id;
      this.journalForm = {
        date:journal.date,
        description:journal.description,
        lines:(journal.lines || []).map(line => ({
          accountId:line.accountId,
          debit:line.debit,
          credit:line.credit,
          memo:line.memo || ''
        }))
      };
      if (!this.journalForm.lines.length) this.addJournalLine();
      this.go('journal-create');
    },
    addJournalLine() {
      this.journalForm.lines.push({ accountId:'', debit:0, credit:0, memo:'' });
    },
    removeJournalLine(index) {
      this.journalForm.lines.splice(index, 1);
      if (!this.journalForm.lines.length) this.addJournalLine();
    },
    validateJournalLines(lines) {
      if (!this.journalForm.date) return 'Tanggal jurnal wajib diisi';
      if (!this.journalForm.description.trim()) return 'Keterangan jurnal wajib diisi';
      const rows = (lines || []).filter(line => line.accountId || Number(line.debit) > 0 || Number(line.credit) > 0);
      if (rows.length < 2) return 'Jurnal minimal memiliki 2 baris';
      let debit = 0;
      let credit = 0;
      for (const line of rows) {
        const account = this.accountById(line.accountId);
        if (!account.id || !account.status) return 'Akun tidak aktif atau tidak ditemukan';
        if (account.isLocked) return 'Akun ' + account.name + ' terkunci dari jurnal manual';
        const d = Number(line.debit) || 0;
        const c = Number(line.credit) || 0;
        if (d < 0 || c < 0) return 'Nilai debit/kredit tidak boleh negatif';
        if (d > 0 && c > 0) return 'Satu baris hanya boleh debit atau kredit';
        if (d === 0 && c === 0) return 'Setiap baris harus memiliki nilai debit atau kredit';
        debit += d;
        credit += c;
      }
      if (Math.abs(debit - credit) > 0.0001) return 'Total debit dan kredit harus seimbang';
      if (debit <= 0) return 'Total jurnal harus lebih dari 0';
      return null;
    },
    saveJournal(post = false) {
      const error = this.validateJournalLines(this.journalForm.lines);
      if (error) { this.notify(error, 'error'); return; }
      const lines = this.journalForm.lines
        .filter(line => line.accountId)
        .map(line => ({
          accountId:line.accountId,
          debit:Number(line.debit) || 0,
          credit:Number(line.credit) || 0,
          memo:line.memo || ''
        }));
      const now = todayISO();
      if (this.journalEditId) {
        const journal = this.journals.find(item => item.id === this.journalEditId);
        if (!journal || journal.status !== 'draft') { this.notify('Jurnal ini tidak dapat diedit', 'error'); return; }
        journal.date = this.journalForm.date;
        journal.description = this.journalForm.description.trim();
        journal.lines = lines;
        if (post) {
          journal.status = 'posted';
          journal.postedBy = this.currentUser;
          journal.postedAt = now;
          journal.history.push({ action:'posted', by:this.currentUser, at:now, note:'' });
        }
        this.notify(post ? 'Jurnal diposting' : 'Draft jurnal diperbarui');
      } else {
        const journal = {
          id:'ju' + Date.now(),
          code:docCode('JU', this.journalForm.date, nextDocSeq(this.journals, 'JU', this.journalForm.date)),
          date:this.journalForm.date,
          description:this.journalForm.description.trim(),
          source:'manual',
          status:post ? 'posted' : 'draft',
          lines,
          postedBy:post ? this.currentUser : '',
          postedAt:post ? now : '',
          voidReason:'',
          createdBy:this.currentUser,
          history:[{ action:post ? 'posted' : 'draft', by:this.currentUser, at:now, note:'' }]
        };
        this.journals.unshift(journal);
        this.journalSelectedId = journal.id;
        this.notify(post ? 'Jurnal berhasil diposting' : 'Draft jurnal berhasil dibuat');
      }
      this.persist();
      this.go('journals');
    },
    viewJournal(journal) { this.journalSelectedId = journal.id; this.journalDetailOpen = true; },
    postJournal(journal) {
      if (journal.status !== 'draft') { this.notify('Hanya jurnal draft yang dapat diposting', 'error'); return; }
      this.journalForm = { date:journal.date, description:journal.description, lines:(journal.lines || []).map(line => ({ ...line })) };
      const error = this.validateJournalLines(journal.lines);
      if (error) { this.notify(error, 'error'); return; }
      this.askConfirm('post-journal', journal.id, 'Posting jurnal?', 'Jurnal ' + journal.code + ' akan memengaruhi saldo akun.', false);
    },
    voidJournal(journal) {
      if (journal.status !== 'posted') { this.notify('Hanya jurnal posted yang dapat di-void', 'error'); return; }
      if (journal.source !== 'manual') { this.notify('Jurnal otomatis harus dikoreksi dari dokumen sumbernya', 'error'); return; }
      if (!this.canVoidJournal) { this.notify('Anda tidak berhak void jurnal', 'error'); return; }
      this.journalVoidId = journal.id;
      this.journalVoidReason = '';
      this.journalVoidOpen = true;
    },
    submitVoidJournal() {
      const journal = this.journals.find(item => item.id === this.journalVoidId);
      if (!journal) return;
      if (!this.journalVoidReason.trim()) { this.notify('Alasan void wajib diisi', 'error'); return; }
      journal.status = 'void';
      journal.voidReason = this.journalVoidReason.trim();
      journal.history = journal.history || [];
      journal.history.push({ action:'void', by:this.currentUser, at:todayISO(), note:journal.voidReason });
      this.journalVoidOpen = false;
      this.persist();
      this.notify('Jurnal di-void');
    },
    deleteJournal(journal) {
      if (journal.status !== 'draft') { this.notify('Hanya jurnal draft yang dapat dihapus', 'error'); return; }
      this.askConfirm('delete-journal', journal.id, 'Hapus jurnal?', 'Draft jurnal ' + journal.code + ' akan dihapus.');
    },

    /* ---------- LEDGER & TRIAL BALANCE ---------- */
    ledgerAccountId: 'acc1', ledgerFrom: '', ledgerTo: todayISO(),
    trialAsOf: todayISO(), trialShowZero: false,
    get ledgerAccountData() { return this.accountById(this.ledgerAccountId) || this.accounts[0] || {}; },
    ledgerAccountOptions() { return [...this.accounts].sort((a, b) => String(a.code).localeCompare(String(b.code))); },
    get ledgerOpening() {
      const account = this.ledgerAccountData;
      if (!account.id || !this.ledgerFrom) return 0;
      let debit = 0;
      let credit = 0;
      this.journals
        .filter(journal => journal.status === 'posted' && journal.date < this.ledgerFrom)
        .forEach(journal => (journal.lines || []).forEach(line => {
          if (line.accountId !== account.id) return;
          debit += Number(line.debit) || 0;
          credit += Number(line.credit) || 0;
        }));
      return account.normalBalance === 'credit' ? credit - debit : debit - credit;
    },
    get ledgerEntries() {
      const account = this.ledgerAccountData;
      if (!account.id) return [];
      const rows = [];
      this.journals
        .filter(journal => journal.status === 'posted')
        .filter(journal => !this.ledgerFrom || journal.date >= this.ledgerFrom)
        .filter(journal => !this.ledgerTo || journal.date <= this.ledgerTo)
        .sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.code).localeCompare(String(b.code)))
        .forEach(journal => (journal.lines || []).forEach(line => {
          if (line.accountId !== account.id) return;
          rows.push({
            journalId:journal.id,
            journalCode:journal.code,
            date:journal.date,
            description:journal.description,
            memo:line.memo || '',
            debit:Number(line.debit) || 0,
            credit:Number(line.credit) || 0,
            source:journal.source || 'manual'
          });
        }));
      return rows;
    },
    get ledgerRows() {
      const account = this.ledgerAccountData;
      let balance = this.ledgerOpening;
      return this.ledgerEntries.map(row => {
        balance += account.normalBalance === 'credit'
          ? row.credit - row.debit
          : row.debit - row.credit;
        return { ...row, balance };
      });
    },
    get ledgerTotals() {
      return this.ledgerEntries.reduce((sum, row) => ({
        debit:sum.debit + row.debit,
        credit:sum.credit + row.credit
      }), { debit:0, credit:0 });
    },
    get ledgerEnding() {
      const rows = this.ledgerRows;
      return rows.length ? rows[rows.length - 1].balance : this.ledgerOpening;
    },
    goLedger(accountId, asOf = '') {
      this.ledgerAccountId = accountId;
      this.ledgerFrom = '';
      this.ledgerTo = asOf || todayISO();
      this.go('ledger');
    },
    accountMovement(accountId, asOf = '') {
      let debit = 0;
      let credit = 0;
      this.journals
        .filter(journal => journal.status === 'posted')
        .filter(journal => !asOf || journal.date <= asOf)
        .forEach(journal => (journal.lines || []).forEach(line => {
          if (line.accountId !== accountId) return;
          debit += Number(line.debit) || 0;
          credit += Number(line.credit) || 0;
        }));
      return { debit, credit };
    },
    trialRow(account) {
      const movement = this.accountMovement(account.id, this.trialAsOf);
      const net = movement.debit - movement.credit;
      return {
        accountId:account.id,
        code:account.code,
        name:account.name,
        type:account.type,
        normalBalance:account.normalBalance,
        debit:net > 0 ? net : 0,
        credit:net < 0 ? Math.abs(net) : 0,
        balance:account.normalBalance === 'credit' ? movement.credit - movement.debit : net
      };
    },
    get trialBalanceRows() {
      return this.accounts
        .map(account => this.trialRow(account))
        .filter(row => this.trialShowZero || row.debit !== 0 || row.credit !== 0)
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    trialRowsForType(type) {
      return this.trialBalanceRows.filter(row => row.type === type);
    },
    get trialBalanceTotals() {
      return this.trialBalanceRows.reduce((sum, row) => ({
        debit:sum.debit + row.debit,
        credit:sum.credit + row.credit
      }), { debit:0, credit:0 });
    },
    get trialBalanceDifference() { return this.trialBalanceTotals.debit - this.trialBalanceTotals.credit; },
    viewJournalById(id) {
      const journal = this.journals.find(item => item.id === id);
      if (journal) this.viewJournal(journal);
    },
    downloadTrialBalanceCSV() {
      const rows = this.trialBalanceRows;
      const lines = [['Tipe','Kode','Nama Akun','Debit','Kredit'].join(';')].concat(rows.map(row => [
        this.accountTypeLabel(row.type), row.code, row.name, row.debit, row.credit
      ].map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';')));
      const totals = this.trialBalanceTotals;
      lines.push(['TOTAL','','', totals.debit, totals.credit].map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';'));
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'neraca-saldo-' + this.trialAsOf + '.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.notify('Neraca Saldo berhasil diexport');
    },

    warehouseModalOpen: false, warehouseEditId: null,
    warehouseForm: { name:'', address:'' },
    openWarehouse(w = null) {
      this.warehouseEditId = w ? w.id : null;
      this.warehouseForm = w ? { name:w.name, address:w.address } : { name:'', address:'' };
      this.warehouseModalOpen = true;
    },
    saveWarehouse() {
      if (!this.warehouseForm.name) { this.notify('Nama gudang wajib diisi', 'error'); return; }
      if (this.warehouseEditId) {
        const wh = this.warehouses.find(w => w.id === this.warehouseEditId);
        if (wh) Object.assign(wh, this.warehouseForm);
        this.notify('Gudang berhasil diperbarui');
      } else {
        this.warehouses.push({ id:'wh' + Date.now(), code:nextSimpleCode(this.warehouses, 'ST-'), ...this.warehouseForm });
        this.notify('Gudang baru berhasil ditambahkan');
      }
      this.warehouseModalOpen = false;
      this.persist();
    },

    /* ---------- ORDER CUSTOMER / CREATE ---------- */
    orderViewTab: 'schedule', orderCustomerSearch: '', orderDate: todayISO(), selectedCustomerId: 'c1',
    get filteredOrderCustomers() {
      const q = this.orderCustomerSearch.toLowerCase();
      return this.customers.filter(c => {
        if (this.role === 'Sales' && c.sales !== this.currentUser) return false;
        if (q && !(c.name + ' ' + c.code + ' ' + c.address).toLowerCase().includes(q)) return false;
        if (this.orderViewTab === 'schedule' && c.day !== this.weekdayName(this.orderDate)) return false;
        return true;
      });
    },
    isOrderedToday(c) {
      return this.orders.some(o => o.customerId === c.id && o.schedule === this.orderDate);
    },
    startOrder(c, tab = 'order') {
      if (!c || !c.id) { this.notify('Pelanggan tidak ditemukan', 'error'); return; }
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
      this.orderDate = shiftISO(this.orderDate, days);
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
      const today = todayISO();
      return this.promos
        .filter(p => p.productId === productId
          && p.bonusType === type
          && this.qty(productId) >= p.minAmount
          && (!p.early || p.early <= today)
          && (!p.final || p.final >= today))
        .sort((a, b) => b.minAmount - a.minAmount)[0] || null;
    },
    get cartRows() {
      return this.products.filter(p => this.qty(p.id) > 0).map(p => {
        const qty = this.qty(p.id);
        const price = this.priceFor(p);
        const total = price * qty;
        const promo = this.bestPromo(p.id, 'price');
        const discPercent = promo ? Number(promo.discountPrice) : 0;
        const discValue = total * discPercent / 100;
        return { product:p, qty, price, total, promo, discPercent, discValue, totalAfter:total - discValue };
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
    get cartCount() { return this.products.reduce((sum, p) => sum + this.qty(p.id), 0); },
    get cartSubtotal() { return this.cartRows.reduce((sum, r) => sum + r.total, 0); },
    get cartDiscount() { return this.cartRows.reduce((sum, r) => sum + r.discValue, 0); },
    get customDiscountValue() { return (this.cartSubtotal - this.cartDiscount) * (Number(this.customDiscount) || 0) / 100; },
    get cartTax() { return (this.cartSubtotal - this.cartDiscount - this.customDiscountValue) * this.ppnPercent / 100; },
    get cartTotal() { return this.cartSubtotal - this.cartDiscount - this.customDiscountValue + this.cartTax; },
    orderPreviewOpen: false,
    openOrderPreview() {
      if (!this.cartCount) { this.notify('Tambahkan minimal 1 produk terlebih dahulu', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      const shortages = this.cartRows.filter(row => Number(row.product.stock) < row.qty);
      if (shortages.length) {
        this.notify('Stok tidak cukup: ' + shortages.map(row => row.product.name).join(', '), 'error');
        return;
      }
      this.orderPreviewOpen = true;
    },
    submitOrder() {
      if (!this.cartCount) { this.notify('Keranjang masih kosong', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      const shortages = this.cartRows.filter(row => Number(row.product.stock) < row.qty);
      if (shortages.length) {
        this.notify('Stok tidak cukup: ' + shortages.map(row => row.product.name).join(', '), 'error');
        return;
      }
      const c = this.selectedCustomer;
      if (!c.id) { this.notify('Pelanggan tidak ditemukan', 'error'); return; }
      const id = 'o' + Date.now();
      const items = this.cartRows.map(row => ({ productId:row.product.id, qty:row.qty, price:row.price, discPercent:row.discPercent }));
      this.cartBonuses.forEach(bonus => items.push({ productId:bonus.product.id, qty:bonus.qty, price:0, discPercent:100, bonus:true }));
      items.forEach(item => {
        const prod = this.product(item.productId);
        if (prod.id) prod.stock = Math.max(0, (Number(prod.stock) || 0) - (Number(item.qty) || 0));
      });
      const order = {
        id,
        code:this.nextCode('INV', this.orders),
        customerId:c.id,
        sales:c.sales,
        orderBy:this.role === 'Sales' ? c.sales : this.currentUser,
        status:'pending',
        payment:'unpaid',
        delivery:'full',
        radius:'onsite',
        date:todayISO(),
        schedule:this.orderDate,
        dueDate:this.paymentMethod === 'Tunai' ? todayISO() : shiftISO(todayISO(), 14),
        subtotal:this.cartSubtotal,
        discount:this.cartDiscount,
        tax:this.cartTax,
        total:this.cartTotal,
        customDiscount:Number(this.customDiscount) || 0,
        paymentMethod:this.paymentMethod,
        stockApplied:true,
        items
      };
      this.orders.unshift(order);
      c.lastOrder = todayISO();
      this.selectedOrderId = id;
      this.orderPreviewOpen = false;
      this.cart = {};
      this.paymentMethod = '';
      this.customDiscount = 0;
      this.persist();
      this.notify('Order berhasil dibuat');
      this.go(this.role === 'Sales' ? 'order-success' : 'invoice');
    },
    get selectedOrder() { return this.order(this.selectedOrderId) || this.orders[0] || {}; },
    selectedOrderId: 'o1',
    viewOrder(id) { this.selectedOrderId = id; this.go('order-detail'); },
    viewInvoice(id) { this.selectedOrderId = id; this.go('invoice'); },
    confirmOrder(o) {
      if (!o || !o.id) return;
      o.status = 'already';
      if (!o.dueDate) o.dueDate = shiftISO(todayISO(), 14);
      this.persist();
      this.notify('Order dikonfirmasi dan siap dikirim');
    },
    orderItemsTotal(order) { return (order.items || []).reduce((sum, i) => sum + i.price * i.qty * (1 - (i.discPercent || 0) / 100), 0); },
    itemTotal(item) { return item.price * item.qty * (1 - (item.discPercent || 0) / 100); },
    itemCountText(order) { return (order.items || []).reduce((sum, i) => sum + i.qty, 0) + ' item'; },

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
      this.selectedOrderIds = this.selectedOrderIds.includes(id)
        ? this.selectedOrderIds.filter(x => x !== id)
        : [...this.selectedOrderIds, id];
    },
    toggleAllOrders() {
      this.selectedOrderIds = this.selectedOrderIds.length === this.filteredOrders.length
        ? []
        : this.filteredOrders.map(o => o.id);
    },
    bulkConfirm() {
      let changed = 0;
      this.orders.forEach(o => {
        if (this.selectedOrderIds.includes(o.id) && o.status === 'pending') {
          o.status = 'already';
          o.dueDate = o.dueDate || shiftISO(todayISO(), 14);
          changed += 1;
        }
      });
      this.selectedOrderIds = [];
      this.persist();
      this.notify(changed + ' order berhasil dikonfirmasi');
    },
    bulkDelete() {
      const targets = this.orders.filter(o => this.selectedOrderIds.includes(o.id) && ['pending','already'].includes(o.status));
      let skipped = this.selectedOrderIds.length - targets.length;
      targets.forEach(o => {
        const rec = this.receivables.find(r => r.orderId === o.id);
        if (rec && (Number(rec.cash) || 0) + (Number(rec.transfer) || 0) > 0) {
          skipped += 1;
          return;
        }
        this.restoreOrderStock(o);
        this.removeOrderReferences(o.id);
        this.orders = this.orders.filter(x => x.id !== o.id);
      });
      this.selectedOrderIds = [];
      this.persist();
      this.notify(skipped > 0 ? 'Order terpilih dihapus, ' + skipped + ' dilewati' : 'Order terpilih dihapus');
    },
    deleteOrder(o) {
      const rec = this.receivables.find(r => r.orderId === o.id);
      if (rec && (Number(rec.cash) || 0) + (Number(rec.transfer) || 0) > 0) {
        this.notify('Order sudah memiliki pembayaran, tidak dapat dihapus', 'error');
        return;
      }
      this.askConfirm('delete-order', o.id, 'Hapus order?', 'Order ' + o.code + ' akan dihapus. Stok produk akan dikembalikan.');
    },

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
    deliveryDraft: { orderIds:[], driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh1', start:todayISO(), end:shiftISO(todayISO(), 13) },
    deliveryPreviewOpen: false,
    get deliveryCandidates() {
      return this.orders.filter(o => ['already','holding','partial'].includes(o.status));
    },
    get selectedDeliveryOrders() { return this.deliveryDraft.orderIds.map(id => this.order(id)).filter(o => o.id); },
    get deliveryDraftTotal() { return this.selectedDeliveryOrders.reduce((sum, o) => sum + o.total, 0); },
    get canPreviewDelivery() { return this.deliveryDraft.orderIds.length > 0 && this.deliveryDraft.driver && this.deliveryDraft.car && this.deliveryDraft.warehouseId; },
    startDeliveryCreate() {
      this.deliveryDraft = { orderIds:[], driver:'Budi Santoso', car:'L300 - DD 1234 AB', warehouseId:'wh1', start:todayISO(), end:shiftISO(todayISO(), 13) };
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
      const del = {
        id,
        code:this.nextCode('DO', this.deliveries),
        orderIds:[...this.deliveryDraft.orderIds],
        periodStart:this.deliveryDraft.start,
        periodEnd:this.deliveryDraft.end,
        driver:this.deliveryDraft.driver,
        car:this.deliveryDraft.car,
        warehouseId:this.deliveryDraft.warehouseId,
        status:'pending',
        total:this.deliveryDraftTotal,
        createdBy:this.currentUser
      };
      this.deliveries.unshift(del);
      del.orderIds.forEach(oid => {
        const order = this.order(oid);
        if (order && ['already','holding','partial'].includes(order.status)) order.status = 'shipping';
      });
      this.selectedDeliveryId = id;
      this.deliveryPreviewOpen = false;
      this.persist();
      this.notify('Surat jalan berhasil dibuat');
      this.go('delivery-invoice');
    },
    selectedDeliveryId: 'd1',
    get selectedDelivery() { return this.delivery(this.selectedDeliveryId) || this.deliveries[0] || {}; },
    deliveryOrders(d = null) { const data = d || this.selectedDelivery; return (data.orderIds || []).map(id => this.order(id)).filter(o => o.id); },
    deliveryTotal(d = null) { return this.deliveryOrders(d).reduce((sum, o) => sum + o.total, 0); },
    deliveryInvoiceRows(d = null) {
      const rows = [];
      this.deliveryOrders(d).forEach(order => (order.items || []).forEach(item => rows.push({ order, item })));
      return rows;
    },
    deliveryWarehouse(d) { return this.warehouseName(d.warehouseId); },
    startDeliveryCheck(d, readonly = false) {
      if (!d) return;
      this.selectedDeliveryId = d.id;
      this.deliveryReadOnly = readonly;
      this.checkRows = this.deliveryOrders(d).map(o => ({
        orderId:o.id, code:o.code, customerId:o.customerId, date:o.schedule, amount:o.total,
        cash:0, transfer:0
      }));
      this.page = readonly ? 'delivery-detail' : 'delivery-check';
      this.sessionPage = this.page;
      window.scrollTo({ top: 0 });
    },
    deliveryReadOnly: false,
    checkRows: [],
    receivableFor(row) { return Math.max(0, row.amount - (Number(row.cash) || 0) - (Number(row.transfer) || 0)); },
    submitDeliveryCheck() {
      const del = this.selectedDelivery;
      if (!del.id) return;
      this.checkRows.forEach(row => {
        const order = this.order(row.orderId);
        if (!order.id) return;
        const amount = Number(order.total) || 0;
        let cash = Math.max(0, Math.min(Number(row.cash) || 0, amount));
        let transfer = Math.max(0, Math.min(Number(row.transfer) || 0, amount - cash));
        const paid = cash + transfer;
        const unpaid = Math.max(0, amount - paid);
        order.status = 'success';
        order.payment = unpaid > 0 ? 'partial' : 'paid';
        let rec = this.receivables.find(r => r.orderId === order.id);
        if (!rec) {
          rec = {
            id:'rc' + Date.now() + Math.random().toString(16).slice(2),
            orderId:order.id,
            orderCode:order.code,
            customerId:order.customerId,
            sales:order.sales,
            schedule:order.schedule,
            due:order.dueDate || shiftISO(todayISO(), 14),
            total:amount,
            cash:0,
            transfer:0,
            unpaid:amount
          };
          this.receivables.unshift(rec);
        }
        rec.cash = (Number(rec.cash) || 0) + cash;
        rec.transfer = (Number(rec.transfer) || 0) + transfer;
        rec.total = Math.max(Number(rec.total) || 0, amount);
        rec.unpaid = Math.max(0, Number(rec.total) - rec.cash - rec.transfer);
        if (paid > 0) {
          this.payments.unshift({
            id:'pm' + Date.now() + Math.random().toString(16).slice(2),
            orderId:order.id,
            orderCode:order.code,
            customerId:order.customerId,
            amount:paid,
            cash,
            transfer,
            date:todayISO(),
            proof:'',
            by:this.currentUser
          });
        }
      });
      del.status = 'success';
      this.persist();
      this.notify('Surat jalan berhasil diselesaikan');
      this.go('deliveries');
    },
    removeOrderFromDelivery(o) {
      const del = this.selectedDelivery;
      if (!del.id || !(del.orderIds || []).includes(o.id)) return;
      del.orderIds = del.orderIds.filter(id => id !== o.id);
      del.total = del.orderIds.reduce((sum, id) => sum + Number(this.order(id).total || 0), 0);
      const order = this.order(o.id);
      if (order.status === 'shipping') order.status = 'already';
      this.persist();
      this.notify('Order ' + o.code + ' dikeluarkan dari surat jalan');
    },
    deleteDelivery(d) {
      this.askConfirm('delete-delivery', d.id, 'Hapus surat jalan?', 'Surat jalan ' + d.code + ' akan dihapus dan order kembali ke status siap kirim.');
    },
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
      this.returnForm = {
        orderId:o.id,
        name:item.productId ? this.productName(item.productId) : '',
        productId:item.productId || '',
        qty:1,
        type:'change',
        condition:'good',
        description:''
      };
      this.returnModalOpen = true;
    },
    saveReturn() {
      const order = this.order(this.returnForm.orderId);
      if (!order.id) { this.notify('Order tidak ditemukan', 'error'); return; }
      if (!this.returnForm.productId) { this.notify('Pilih barang yang diretur', 'error'); return; }
      if (!this.returnForm.description) { this.notify('Keterangan return wajib diisi', 'error'); return; }
      const item = (order.items || []).find(i => i.productId === this.returnForm.productId) || {};
      const qty = Math.max(1, Number(this.returnForm.qty) || 1);
      const price = (Number(item.price) || 0) * (1 - (Number(item.discPercent) || 0) / 100) * qty;
      this.returns.unshift({
        id:'r' + Date.now(),
        code:this.nextCode('RTN', this.returns),
        orderId:order.id,
        productId:this.returnForm.productId,
        name:this.returnForm.name || this.productName(this.returnForm.productId),
        qty,
        price,
        type:this.returnForm.type,
        condition:this.returnForm.condition,
        action:this.returnForm.type === 'change' ? 'discard' : 'return',
        status:'pending',
        description:this.returnForm.description,
        by:this.currentUser,
        date:todayISO()
      });
      this.returnModalOpen = false;
      this.persist();
      this.notify('Return barang berhasil ditambahkan');
    },
    processReturn(r) { this.askConfirm('process-return', r.id, 'Proses return?', 'Return ' + r.code + ' akan diproses dan stok barang diperbarui.', false); },
    deleteReturn(r) { this.askConfirm('delete-return', r.id, 'Batalkan return?', 'Data return ' + r.code + ' akan dihapus.'); },

    /* ---------- STOCK ---------- */
    stockTab: 'active', stockSearch: '',
    stockModalOpen: false, stockForm: { productId:'p1', warehouseId:'wh1', date:todayISO(), qty:10, description:'' },
    opnameModalOpen: false, opnameForm: { productId:'p1', warehouseId:'wh1', date:todayISO(), qty:1, description:'' },
    get filteredStockProducts() {
      const q = this.stockSearch.toLowerCase();
      return this.products.filter(p => !q || (p.name + ' ' + p.code).toLowerCase().includes(q));
    },
    openStock() {
      this.stockForm = { productId:'p1', warehouseId:'wh1', date:todayISO(), qty:10, description:'' };
      this.stockModalOpen = true;
    },
    saveStock() {
      const prod = this.product(this.stockForm.productId);
      const qty = Number(this.stockForm.qty) || 0;
      if (!prod.id || qty <= 0) { this.notify('Pilih barang dan isi qty lebih dari 0', 'error'); return; }
      prod.stock = (Number(prod.stock) || 0) + qty;
      this.stockHistory.unshift({
        id:'sh' + Date.now(),
        code:this.nextCode('AS', this.stockHistory),
        date:this.stockForm.date || todayISO(),
        warehouseId:this.stockForm.warehouseId,
        description:this.stockForm.description || 'Stock masuk',
        by:this.currentUser,
        items:[{ productId:prod.id, qty }]
      });
      this.stockModalOpen = false;
      this.persist();
      this.notify('Stock barang berhasil ditambahkan');
    },
    openOpname() {
      this.opnameForm = { productId:'p1', warehouseId:'wh1', date:todayISO(), qty:1, description:'' };
      this.opnameModalOpen = true;
    },
    saveOpname() {
      const prod = this.product(this.opnameForm.productId);
      const qty = Number(this.opnameForm.qty) || 0;
      if (!prod.id || qty === 0) { this.notify('Pilih barang dan isi qty selain 0', 'error'); return; }
      prod.stock = (Number(prod.stock) || 0) + qty;
      this.opnames.unshift({
        id:'op' + Date.now(),
        code:this.nextCode('OP', this.opnames),
        date:this.opnameForm.date || todayISO(),
        productId:prod.id,
        warehouseId:this.opnameForm.warehouseId,
        qty,
        description:this.opnameForm.description || 'Penyesuaian stok',
        by:this.currentUser
      });
      this.opnameModalOpen = false;
      this.persist();
      this.notify('Stock opname berhasil disimpan');
    },
    stockItemQty(item) { return item.qty; },
    deleteStockHistory(s) { this.askConfirm('delete-stock', s.id, 'Hapus riwayat stock?', 'Dokumen ' + s.code + ' akan dihapus.'); },
    deleteOpname(o) { this.askConfirm('delete-opname', o.id, 'Hapus opname?', 'Dokumen ' + o.code + ' akan dihapus.'); },

    /* ---------- FINANCE OPERASIONAL ---------- */
    financeTab: 'income', financeSearch: '',
    financeModalOpen: false, financeEditId: null,
    financeForm: { accountId:'', cashAccountId:'acc1', amount:0, date:todayISO(), description:'', proof:'' },
    financeAccountsFor(kind) {
      const type = kind === 'income' ? 'revenue' : 'expense';
      return this.accounts.filter(account => account.status && account.type === type && !account.isLocked).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    cashAccountOptions() {
      return this.accounts.filter(account => account.status && account.isCashBank).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    financeAccountName(id) {
      const account = this.accountById(id);
      return account.id ? account.code + ' — ' + account.name : '-';
    },
    get filteredIncomes() {
      const q = this.financeSearch.toLowerCase();
      return this.incomes.filter(item => !q || (item.code + ' ' + item.description + ' ' + this.financeAccountName(item.accountId)).toLowerCase().includes(q));
    },
    get filteredExpenses() {
      const q = this.financeSearch.toLowerCase();
      return this.expenses.filter(item => !q || (item.code + ' ' + item.description + ' ' + this.financeAccountName(item.accountId)).toLowerCase().includes(q));
    },
    get filteredFinance() { return this.financeTab === 'income' ? this.filteredIncomes : this.filteredExpenses; },
    openFinance(kind, item = null) {
      this.financeTab = kind;
      this.financeEditId = item ? item.id : null;
      const accountOptions = this.financeAccountsFor(kind);
      const cashOptions = this.cashAccountOptions();
      this.financeForm = item
        ? { accountId:item.accountId, cashAccountId:item.cashAccountId || 'acc1', amount:item.amount, date:item.date, description:item.description, proof:item.proof }
        : { accountId:accountOptions[0]?.id || '', cashAccountId:cashOptions[0]?.id || 'acc1', amount:0, date:todayISO(), description:'', proof:'' };
      this.financeModalOpen = true;
    },
    createFinanceJournal(item, kind) {
      const cash = this.accountById(item.cashAccountId);
      const account = this.accountById(item.accountId);
      if (!cash.id || !account.id) return '';
      const lines = kind === 'income'
        ? [
            { accountId:cash.id, debit:Number(item.amount) || 0, credit:0, memo:'Kas masuk' },
            { accountId:account.id, debit:0, credit:Number(item.amount) || 0, memo:item.description || '' }
          ]
        : [
            { accountId:account.id, debit:Number(item.amount) || 0, credit:0, memo:item.description || '' },
            { accountId:cash.id, debit:0, credit:Number(item.amount) || 0, memo:'Kas keluar' }
          ];
      const journal = this.createSystemJournal({
        date:item.date,
        description:item.description || (kind === 'income' ? 'Pendapatan lainnya' : 'Pengeluaran lainnya'),
        source:kind,
        sourceId:item.id,
        lines
      });
      return journal ? journal.id : '';
    },
    voidFinanceJournal(journalId, reason) {
      const journal = this.journals.find(item => item.id === journalId);
      if (!journal || journal.status !== 'posted') return;
      journal.status = 'void';
      journal.voidReason = reason || 'Revisi transaksi';
      journal.history = journal.history || [];
      journal.history.push({ action:'void', by:this.currentUser, at:todayISO(), note:reason || 'Revisi transaksi' });
    },
    saveFinance() {
      const list = this.financeTab === 'income' ? this.incomes : this.expenses;
      const prefix = this.financeTab === 'income' ? 'IC' : 'OC';
      const amount = Number(this.financeForm.amount) || 0;
      if (amount <= 0) { this.notify('Nominal harus lebih dari 0', 'error'); return; }
      const account = this.accountById(this.financeForm.accountId);
      const expectedType = this.financeTab === 'income' ? 'revenue' : 'expense';
      if (!account.id || account.type !== expectedType || !account.status) {
        this.notify(this.financeTab === 'income' ? 'Pilih akun pendapatan yang aktif' : 'Pilih akun beban yang aktif', 'error');
        return;
      }
      const cash = this.accountById(this.financeForm.cashAccountId);
      if (!cash.id || !cash.isCashBank || !cash.status) {
        this.notify('Pilih akun Kas/Bank yang aktif', 'error');
        return;
      }
      if (this.financeEditId) {
        const item = list.find(row => row.id === this.financeEditId);
        if (!item) { this.notify('Transaksi tidak ditemukan', 'error'); return; }
        if (item.journalId) this.voidFinanceJournal(item.journalId, 'Revisi transaksi');
        item.accountId = this.financeForm.accountId;
        item.cashAccountId = this.financeForm.cashAccountId;
        item.amount = amount;
        item.date = this.financeForm.date;
        item.description = this.financeForm.description;
        item.proof = this.financeForm.proof;
        item.journalId = this.createFinanceJournal(item, this.financeTab);
        this.notify('Transaksi berhasil diperbarui dan jurnal diperbarui');
      } else {
        const item = {
          id:'f' + Date.now(),
          code:this.nextCode(prefix, list),
          accountId:this.financeForm.accountId,
          cashAccountId:this.financeForm.cashAccountId,
          amount,
          date:this.financeForm.date,
          description:this.financeForm.description,
          proof:this.financeForm.proof,
          by:this.currentUser
        };
        item.journalId = this.createFinanceJournal(item, this.financeTab);
        list.unshift(item);
        this.notify('Transaksi berhasil ditambahkan dan jurnal dibuat');
      }
      this.financeModalOpen = false;
      this.persist();
    },

    /* ---------- RECEIVABLES / COLLECTIONS ---------- */
    receivableTab: 'active', receivableSearch: '', receivableSales: '',
    get activeReceivables() { return this.receivables.filter(r => Number(r.unpaid) > 0); },
    get paidReceivables() { return this.receivables.filter(r => Number(r.unpaid) <= 0); },
    get filteredReceivables() {
      const q = this.receivableSearch.toLowerCase();
      return this.activeReceivables.filter(r => {
        if (q && !(r.orderCode + ' ' + this.customerName(r.customerId)).toLowerCase().includes(q)) return false;
        if (this.receivableSales && r.sales !== this.receivableSales) return false;
        return true;
      });
    },
    collectionSales: '', collectionDate: todayISO(), collectionIds: [], collectionPreviewOpen: false,
    get collectionCandidates() {
      return this.activeReceivables.filter(r => !this.collectionSales || r.sales === this.collectionSales);
    },
    get selectedCollectionReceivables() { return this.collectionIds.map(id => this.receivable(id)).filter(r => r.id); },
    get collectionDraftTotal() { return this.selectedCollectionReceivables.reduce((sum, r) => sum + r.total, 0); },
    get collectionDraftUnpaid() { return this.selectedCollectionReceivables.reduce((sum, r) => sum + r.unpaid, 0); },
    startCollectionCreate() {
      this.collectionSales = 'Fahri';
      this.collectionDate = todayISO();
      this.collectionIds = [];
      this.go('collection-create');
    },
    toggleCollection(id) {
      this.collectionIds = this.collectionIds.includes(id)
        ? this.collectionIds.filter(x => x !== id)
        : [...this.collectionIds, id];
    },
    openCollectionPreview() {
      if (!this.collectionSales) { this.notify('Pilih sales terlebih dahulu', 'error'); return; }
      if (!this.collectionIds.length) { this.notify('Pilih minimal 1 piutang', 'error'); return; }
      this.collectionPreviewOpen = true;
    },
    submitCollection() {
      const id = 'cl' + Date.now();
      const col = {
        id,
        code:this.nextCode('CL', this.collections),
        sales:this.collectionSales,
        date:this.collectionDate,
        status:'pending',
        itemIds:[...this.collectionIds],
        total:this.collectionDraftTotal,
        paid:0,
        unpaid:this.collectionDraftUnpaid
      };
      this.collections.unshift(col);
      this.selectedCollectionId = id;
      this.collectionPreviewOpen = false;
      this.persist();
      this.notify('Surat jalan penagihan berhasil dibuat');
      this.startCollection(col);
    },
    selectedCollectionId: 'cl1',
    collectionPayments: {},
    get selectedCollection() { return this.collections.find(c => c.id === this.selectedCollectionId) || this.collections[0] || {}; },
    collectionRows(c = null) { const data = c || this.selectedCollection; return (data.itemIds || []).map(id => this.receivable(id)).filter(r => r.id); },
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
      if (cash + transfer > max) {
        if (field === 'cash') cash = max - transfer;
        else transfer = max - cash;
      }
      this.collectionPayments = { ...this.collectionPayments, [r.id]: { cash, transfer } };
    },
    collectionReceivable(r) { const p = this.collectionPayment(r); return Math.max(0, Number(r.unpaid) - p.cash - p.transfer); },
    get collectionPayTotal() { return this.collectionRows().reduce((sum, r) => sum + (this.collectionPayment(r).cash || 0) + (this.collectionPayment(r).transfer || 0), 0); },
    submitCollectionPayment() {
      const col = this.selectedCollection;
      if (!col.id) return;
      let paidNow = 0;
      this.collectionRows(col).forEach(r => {
        const p = this.collectionPayment(r);
        const remaining = Number(r.unpaid) || 0;
        const cash = Math.max(0, Math.min(Number(p.cash) || 0, remaining));
        const transfer = Math.max(0, Math.min(Number(p.transfer) || 0, remaining - cash));
        const paid = cash + transfer;
        if (paid <= 0) return;
        r.cash = (Number(r.cash) || 0) + cash;
        r.transfer = (Number(r.transfer) || 0) + transfer;
        r.unpaid = Math.max(0, (Number(r.total) || 0) - r.cash - r.transfer);
        this.payments.unshift({
          id:'pm' + Date.now() + Math.random().toString(16).slice(2),
          orderId:r.orderId,
          orderCode:r.orderCode,
          customerId:r.customerId,
          amount:paid,
          cash,
          transfer,
          date:this.collectionDate,
          proof:'',
          by:this.currentUser
        });
        paidNow += paid;
      });
      if (paidNow <= 0) { this.notify('Isi nominal pembayaran terlebih dahulu', 'error'); return; }
      col.paid = (Number(col.paid) || 0) + paidNow;
      col.unpaid = Math.max(0, (Number(col.unpaid) || 0) - paidNow);
      col.status = col.unpaid > 0 ? 'processing' : 'success';
      this.persist();
      this.notify(col.status === 'success' ? 'Penagihan selesai dan lunas' : 'Pembayaran penagihan disimpan');
      this.receivableTab = 'collections';
      this.go('receivables');
    },
    paymentModalOpen: false, paymentForm: { proof:'', description:'' }, selectedPaymentId: null,
    openPayment(p) { this.selectedPaymentId = p.id; this.paymentForm = { proof:'', description:'' }; this.paymentModalOpen = true; },
    savePaymentProof() {
      const payment = this.payments.find(x => x.id === this.selectedPaymentId);
      if (payment) payment.proof = this.paymentForm.proof || payment.proof || 'bukti-pembayaran.jpg';
      this.paymentModalOpen = false;
      this.persist();
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
      this.userForm = u
        ? { name:u.name, username:u.username, email:u.email, password:'', roles:[...u.roles] }
        : { name:'', username:'', email:'', password:'', roles:['Sales'] };
      this.userModalOpen = true;
    },
    saveUser() {
      if (!this.userForm.name || !this.userForm.username) { this.notify('Nama dan username wajib diisi', 'error'); return; }
      const username = this.userForm.username.trim().toLowerCase();
      const duplicate = this.users.find(u => u.id !== this.userEditId && String(u.username).toLowerCase() === username);
      if (duplicate) { this.notify('Username sudah dipakai pengguna lain', 'error'); return; }
      if (this.userEditId) {
        const user = this.users.find(u => u.id === this.userEditId);
        if (user) {
          user.name = this.userForm.name;
          user.username = username;
          user.email = this.userForm.email;
          user.roles = [...this.userForm.roles];
          if (this.userForm.password) user.password = this.userForm.password;
          if (user.id === this.currentUserId) {
            this.role = (user.roles || [])[0] || this.role;
            this.syncProfileForm();
          }
        }
        this.notify('Pengguna berhasil diperbarui');
      } else {
        this.users.unshift({
          id:'u' + Date.now(),
          code:nextSimpleCode(this.users, 'U-'),
          name:this.userForm.name,
          username,
          email:this.userForm.email,
          password:this.userForm.password || DEMO_PASSWORD,
          roles:[...this.userForm.roles]
        });
        this.notify('Pengguna baru berhasil ditambahkan');
      }
      this.syncRoleCounts();
      this.userModalOpen = false;
      this.persist();
    },
    toggleUserRole(name) {
      const roles = this.userForm.roles;
      this.userForm.roles = roles.includes(name) ? roles.filter(x => x !== name) : [...roles, name];
    },
    openRole(r = null) {
      this.roleEditId = r ? r.id : null;
      this.roleForm = r ? { name:r.name, permissions:[...r.permissions] } : { name:'', permissions:[] };
      this.roleModalOpen = true;
    },
    saveRole() {
      if (!this.roleForm.name) { this.notify('Nama role wajib diisi', 'error'); return; }
      if (this.roleEditId) {
        const role = this.roles.find(x => x.id === this.roleEditId);
        if (role) {
          const oldName = role.name;
          role.name = this.roleForm.name;
          role.permissions = [...this.roleForm.permissions];
          if (oldName !== role.name) {
            this.users.forEach(u => {
              u.roles = (u.roles || []).map(name => name === oldName ? role.name : name);
            });
            if (this.role === oldName) this.role = role.name;
            if (this.loginRole === oldName) this.loginRole = role.name;
          }
        }
        this.notify('Role berhasil diperbarui');
      } else {
        this.roles.push({
          id:'role' + Date.now(),
          name:this.roleForm.name,
          guard:'web',
          members:0,
          permissions:[...this.roleForm.permissions]
        });
        this.notify('Role baru berhasil ditambahkan');
      }
      this.syncRoleCounts();
      if (this.currentUserId && !this.canAccessPage(this.page) && this.page !== 'login') {
        this.page = 'dashboard';
      }
      this.roleModalOpen = false;
      this.persist();
    },
    togglePermission(name) {
      const permissions = this.roleForm.permissions;
      this.roleForm.permissions = permissions.includes(name)
        ? permissions.filter(x => x !== name)
        : [...permissions, name];
    },

    /* ---------- REPORT / SETTINGS ---------- */
    reportOpen: false,
    reportForm: { from:'', to:'', sales:'', customer:'' },
    reportCustomers() { return this.customers.filter(c => !this.reportForm.sales || c.sales === this.reportForm.sales); },
    downloadReport() {
      const from = this.reportForm.from;
      const to = this.reportForm.to;
      const sales = this.reportForm.sales;
      const customer = this.reportForm.customer;
      const rows = this.orders.filter(o => {
        if (from && String(o.date || '') < from) return false;
        if (to && String(o.date || '') > to) return false;
        if (sales && o.sales !== sales) return false;
        if (customer && o.customerId !== customer) return false;
        return true;
      });
      const header = ['Kode Order','Tanggal','Pelanggan','Sales','Status','Pembayaran','Total'];
      const lines = [header.join(';')].concat(rows.map(o => [
        o.code,
        o.date,
        this.customerName(o.customerId),
        o.sales,
        this.statusLabel(o.status),
        this.paymentLabel(o.payment),
        Number(o.total) || 0
      ].map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';')));
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'laporan-penjualan-' + todayISO() + '.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.reportOpen = false;
      this.notify(rows.length + ' baris laporan berhasil diunduh');
    },
    exportData() {
      const payload = {
        app: 'abi-mineral-demo',
        version: STORE_VERSION,
        exportedAt: new Date().toISOString(),
        data: this.snapshot()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'abi-mineral-demo-' + todayISO() + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.notify('Data demo berhasil diexport');
    },
    pickImport() {
      const input = document.getElementById('import-file');
      if (!input) return;
      input.value = '';
      input.click();
    },
    handleImport(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || '{}'));
          if (parsed.version && parsed.version !== STORE_VERSION) throw new Error('version');
          const data = parsed.data || parsed;
          if (!data || !Array.isArray(data.customers) || !Array.isArray(data.orders)) {
            throw new Error('format');
          }
          this.pendingImport = data;
          this.askConfirm('import-data', null, 'Import data demo?', 'Seluruh data saat ini akan diganti dengan data dari file. Tindakan ini tidak dapat dibatalkan.');
        } catch (e) {
          this.notify('File tidak valid atau berasal dari versi lama. Gunakan hasil export terbaru.', 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    clearTransactions() {
      this.askConfirm(
        'clear-transactions',
        null,
        'Hapus semua transaksi?',
        'Order, surat jalan, return, piutang, penagihan, pembayaran, riwayat stok, opname, pendapatan/pengeluaran, Purchase Request, Purchase Order, Penerimaan Barang, jurnal, dan utang akan dihapus. Master data tetap; stok barang mentah direset ke 0.'
      );
    },
    resetDemo() {
      this.askConfirm('reset-data', null, 'Reset data demo?', 'Semua perubahan (order, pembayaran, stok, pengguna) akan dikembalikan ke data awal.');
    },
    settingsTab: 'profile',
    settingsForm: { name:'Admin', username:'admin', email:'admin@abimineral.com' },
    passwordForm: { current:'', next:'', confirmation:'' },
    saveProfile() {
      const user = this.currentUserRecord;
      if (!user) { this.notify('Sesi login tidak ditemukan', 'error'); return; }
      if (!this.settingsForm.name || !this.settingsForm.username) { this.notify('Nama dan username wajib diisi', 'error'); return; }
      const username = String(this.settingsForm.username).trim().toLowerCase();
      if (this.users.some(u => u.id !== user.id && String(u.username).toLowerCase() === username)) {
        this.notify('Username sudah dipakai pengguna lain', 'error');
        return;
      }
      user.name = this.settingsForm.name;
      user.username = username;
      user.email = this.settingsForm.email;
      this.syncProfileForm();
      this.persist();
      this.notify('Profil berhasil disimpan');
    },
    savePassword() {
      const user = this.currentUserRecord;
      if (!user) { this.notify('Sesi login tidak ditemukan', 'error'); return; }
      if (String(user.password || DEMO_PASSWORD) !== this.passwordForm.current) {
        this.notify('Kata sandi saat ini salah', 'error');
        return;
      }
      if (!this.passwordForm.next || this.passwordForm.next.length < 6) {
        this.notify('Kata sandi baru minimal 6 karakter', 'error');
        return;
      }
      if (this.passwordForm.next !== this.passwordForm.confirmation) {
        this.notify('Konfirmasi kata sandi tidak sama', 'error');
        return;
      }
      user.password = this.passwordForm.next;
      this.passwordForm = { current:'', next:'', confirmation:'' };
      this.persist();
      this.notify('Kata sandi berhasil diperbarui');
    }
  };
}
