const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
const rupiah2Fmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const number2Fmt = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STORE_KEY = 'abi-mineral-demo';
const STORE_VERSION = 18;
const DEMO_PASSWORD = 'rahasia123';

const DOMAIN_KEYS = [
  'customers', 'products', 'promos', 'orders', 'deliveries', 'returns', 'warehouses',
  'stockHistory', 'opnames', 'incomes', 'expenses', 'receivables',
  'collections', 'payments', 'users', 'roles', 'monthlyHistory',
  'categories', 'materials', 'suppliers', 'purchaseRequests', 'units', 'purchaseOrders',
  'receipts', 'purchaseReturns', 'stockMovements', 'payables', 'accounts', 'journals',
  'recipes', 'productions', 'productionLogs',
  'hppSettings', 'biayaProduksiBulanan', 'hppHarian', 'hppLog', 'hppBulanan',
  'employees', 'attendanceScans', 'attendanceNotes', 'attendanceBatches', 'payrolls', 'hrSettings'
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
  'bulk-invoice': 'Order',
  deliveries: 'Order',
  'delivery-create': 'Order',
  'delivery-check': 'Order',
  'delivery-detail': 'Order',
  'delivery-invoice': 'Order',
  returns: 'Order',
  warehouses: 'Master Gudang',
  products: 'Master Produk',
  'product-create': 'Master Produk',
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
  'purchase-returns': 'Return Pembelian',
  'purchase-return-create': 'Return Pembelian',
  coa: 'Chart of Accounts',
  'opening-balance': 'Laporan Keuangan',
  hpp: 'Laporan Keuangan',
  'hpp-create': 'Laporan Keuangan',
  'hpp-detail': 'Laporan Keuangan',
  'employees': 'Data Pegawai',
  'attendance': 'Rekap Absensi',
  'payroll': 'Payroll',
  'hpp-bulanan-create': 'Laporan Keuangan',
  'hpp-bulanan-detail': 'Laporan Keuangan',
  journals: 'Jurnal Umum',
  'journal-create': 'Jurnal Umum',
  ledger: 'Laporan Keuangan',
  'trial-balance': 'Laporan Keuangan',
  reports: 'Laporan Keuangan',
  stock: 'Stock',
  receivables: 'Piutang',
  payables: 'Utang',
  'collection-create': 'Piutang',
  'collection-confirm': 'Piutang',
  'finance-income': 'Pendapatan Lainnya',
  'finance-expense': 'Pengeluaran Lainnya',
  'finance-accounts': 'Chart of Accounts',
  users: 'Kelola Role & Pengguna',
  roles: 'Kelola Role & Pengguna',
  settings: null
};

const PAGES = Object.keys(PAGE_PERMISSION).concat(['login']);

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTH_LONG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
function previousMonthKey(period) {
  const parts = String(period || todayISO().slice(0, 7)).split('-');
  let year = Number(parts[0]) || new Date().getFullYear();
  let month = Number(parts[1]) || (new Date().getMonth() + 1);
  month -= 1;
  if (month < 1) { month = 12; year -= 1; }
  return year + '-' + pad2(month);
}
function monthLongLabel(period) {
  const parts = String(period || '').split('-');
  return (MONTH_LONG[Number(parts[1]) - 1] || '') + ' ' + (parts[0] || '');
}
function periodEndDate(period) {
  const parts = String(period || todayISO().slice(0, 7)).split('-');
  const year = Number(parts[0]) || new Date().getFullYear();
  const month = Number(parts[1]) || (new Date().getMonth() + 1);
  return isoLocal(new Date(year, month, 0));
}

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
    { id:'cat6', code:'KAT-0006', name:'Kemasan', type:'material', description:'Karton dan kemasan', status:true },
    { id:'cat7', code:'KAT-0007', name:'Aksesoris', type:'material', description:'Lid, straw, dan lakban', status:true }
  ];

  const products = [
    { id:'p1', code:'ABI-0001', name:'Abi Mineral 220ml - (CUP)', categoryId:'cat1', minStock:20, unit:'Krt', cost:10000, inSale:22000, outSale:24000, stock:100, status:true },
    { id:'p2', code:'ABI-0002', name:'ABI MINERAL 330 ML(BOTOL)', categoryId:'cat2', minStock:20, unit:'Krt', cost:16000, inSale:39000, outSale:40000, stock:100, status:true },
    { id:'p3', code:'ABI-0003', name:'ABI MINERAL 600 ML(BOTOL)', categoryId:'cat2', minStock:20, unit:'Krt', cost:17600, inSale:42000, outSale:43000, stock:100, status:true }
  ];

  const materials = [
    { id:'mat1', code:'BRG-0001', name:'Botol PET 600 ml', categoryId:'cat3', unit:'Pcs', purchasePrice:800, minStock:1000, stock:0, status:true, description:'Botol kosong 600 ml' },
    { id:'mat2', code:'BRG-0002', name:'Cup 220 ml', categoryId:'cat4', unit:'Pcs', purchasePrice:132, minStock:2000, stock:0, status:true, description:'Cup kosong 220 ml' },
    { id:'mat3', code:'BRG-0003', name:'Label 330 ml', categoryId:'cat5', unit:'Pcs', purchasePrice:100, minStock:3000, stock:0, status:true, description:'Label botol 330 ml' },
    { id:'mat4', code:'BRG-0004', name:'Karton Box', categoryId:'cat6', unit:'Pcs', purchasePrice:3309, minStock:300, stock:0, status:true, description:'Karton kemasan produk' },
    { id:'mat5', code:'BRG-0005', name:'LID 220 ml', categoryId:'cat4', unit:'Pcs', purchasePrice:39, minStock:1000, stock:0, status:true, description:'Tutup cup 220 ml' },
    { id:'mat6', code:'BRG-0006', name:'Straw', categoryId:'cat7', unit:'Pcs', purchasePrice:15, minStock:1000, stock:0, status:true, description:'Sedotan produk cup' },
    { id:'mat7', code:'BRG-0007', name:'Lakban', categoryId:'cat7', unit:'Pcs', purchasePrice:31, minStock:20, stock:0, status:true, description:'Lakban kemasan' }
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

  const recipes = [
    { id:'rec1', productId:'p1', materialId:'mat2', qtyPerUnit:48 },
    { id:'rec2', productId:'p1', materialId:'mat5', qtyPerUnit:48 },
    { id:'rec3', productId:'p1', materialId:'mat6', qtyPerUnit:48 },
    { id:'rec4', productId:'p1', materialId:'mat4', qtyPerUnit:1 },
    { id:'rec5', productId:'p1', materialId:'mat7', qtyPerUnit:2 }
  ];
  const productions = [];
  const productionLogs = [];

  const purchaseRequests = [];
  const purchaseOrders = [];
  const receipts = [];
  const purchaseReturns = [];
  const stockMovements = [];
  const payables = [];

  const accounts = [
    { id:'acc1', code:'1-1100', name:'Kas', type:'asset', normalBalance:'debit', parentId:null, isCashBank:true, isSystem:false, isLocked:false, cashType:'cash', bankName:'', accountNumber:'', accountHolder:'', branch:'', status:true, description:'Kas tunai' },
    { id:'acc2', code:'1-1200', name:'Bank BCA', type:'asset', normalBalance:'debit', parentId:null, isCashBank:true, isSystem:false, isLocked:false, cashType:'bank', bankName:'BCA', accountNumber:'1234567890', accountHolder:'CV Tou Masagena Mineral', branch:'Balikpapan', status:true, description:'Rekening bank BCA' },
    { id:'acc3', code:'1-1300', name:'Piutang Usaha', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol piutang pelanggan' },
    { id:'acc4', code:'1-1400', name:'Persediaan', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol persediaan' },
    { id:'acc5', code:'1-1500', name:'Piutang Supplier', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Kelebihan bayar / retur supplier' },
    { id:'acc6', code:'1-1600', name:'Peralatan', type:'asset', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Peralatan operasional' },
    { id:'acc7', code:'2-1100', name:'Utang Usaha', type:'liability', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol utang supplier' },
    { id:'acc23', code:'2-1200', name:'Utang PPN', type:'liability', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun kontrol PPN keluaran' },
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
    { id:'acc21', code:'5-1500', name:'Beban Pemeliharaan', type:'expense', normalBalance:'debit', parentId:null, isCashBank:false, isSystem:false, isLocked:false, status:true, description:'Perawatan gudang dan kendaraan' },
    { id:'acc22', code:'3-1100', name:'Saldo Awal', type:'equity', normalBalance:'credit', parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true, description:'Akun penyeimbang saldo awal' }
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

  const permissions = ['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Produk','Master Barang','Master Supplier','Purchase Request','Approval PR','Purchase Order','Approval PO','Penerimaan Barang','Return Pembelian','Stock','Stock Opname','Piutang','Utang','Pendapatan Lainnya','Pengeluaran Lainnya','Chart of Accounts','Jurnal Umum','Laporan Keuangan','Data Pegawai','Rekap Absensi','Payroll','Kelola Role & Pengguna','Diskon Khusus'];

  const roles = [
    { id:'role1', name:'Admin', guard:'web', members:1, permissions:[...permissions] },
    { id:'role2', name:'Sales', guard:'web', members:2, permissions:['Dashboard','Master Pelanggan','Order'] },
    { id:'role3', name:'Manager', guard:'web', members:1, permissions:['Dashboard','Master Pelanggan','Master Promo','Order','Order Admin','Master Gudang','Master Produk','Master Barang','Master Supplier','Purchase Request','Approval PR','Purchase Order','Approval PO','Penerimaan Barang','Return Pembelian','Stock','Stock Opname','Piutang','Utang','Pendapatan Lainnya','Pengeluaran Lainnya','Chart of Accounts','Jurnal Umum','Laporan Keuangan','Data Pegawai','Rekap Absensi','Payroll'] },
    { id:'role4', name:'Supervisor', guard:'web', members:1, permissions:['Dashboard','Order','Order Admin','Purchase Request','Purchase Order','Penerimaan Barang','Return Pembelian','Stock','Piutang','Utang'] },
    { id:'role5', name:'Developer', guard:'web', members:0, permissions:[...permissions] },
    { id:'role6', name:'Logistik', guard:'web', members:0, permissions:['Dashboard','Master Gudang','Master Produk','Master Barang','Stock','Stock Opname','Purchase Request','Penerimaan Barang'] }
  ];

  const monthlyHistory = [];
  const hppSettings = {
    workingDays: 26,
    waterLitersPerKrt: 10.5,
    waterPricePerM3: 7000,
    electricityFormula: 'allocation',
    roundingMode: 'none',
    updatedBy: '',
    updatedAt: '',
    history: []
  };
  const biayaProduksiBulanan = [];
  const hppHarian = [];
  const hppLog = [];
  const hppBulanan = [];

  const employees = [
    { id:'emp1', nip:'EMP-0001', pin:'1001', name:'Rizky Pratama', group:'Produksi', position:'Operator Mesin', joinDate:'2024-02-01', status:true, resignDate:'', basicSalary:3200000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp2', nip:'EMP-0002', pin:'1002', name:'Dedi Kurniawan', group:'Produksi', position:'Helper Mesin', joinDate:'2024-05-10', status:true, resignDate:'', basicSalary:2800000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp3', nip:'EMP-0003', pin:'1003', name:'Siti Aminah', group:'Produksi', position:'Pengemasan', joinDate:'2023-08-15', status:true, resignDate:'', basicSalary:3000000, mealPerDay:20000, bank:'Mandiri', accountNumber:'', note:'' },
    { id:'emp4', nip:'EMP-0004', pin:'1004', name:'Bayu Saputra', group:'Produksi', position:'Operator Mesin', joinDate:'2025-01-06', status:true, resignDate:'', basicSalary:3100000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp5', nip:'EMP-0005', pin:'1005', name:'Nadia Putri', group:'Operasional', position:'Admin', joinDate:'2023-03-01', status:true, resignDate:'', basicSalary:3000000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp6', nip:'EMP-0006', pin:'1006', name:'Fajar Hidayat', group:'Operasional', position:'Akunting', joinDate:'2022-11-14', status:true, resignDate:'', basicSalary:3300000, mealPerDay:20000, bank:'BRI', accountNumber:'', note:'' },
    { id:'emp7', nip:'EMP-0007', pin:'1007', name:'Yoga Maulana', group:'Operasional', position:'Logistik', joinDate:'2024-07-01', status:true, resignDate:'', basicSalary:2900000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp8', nip:'EMP-0008', pin:'1008', name:'Intan Permata', group:'Operasional', position:'Sales', joinDate:'2024-09-02', status:true, resignDate:'', basicSalary:3100000, mealPerDay:20000, bank:'Mandiri', accountNumber:'', note:'' },
    { id:'emp9', nip:'EMP-0009', pin:'1009', name:'Hendra Wijaya', group:'Manager', position:'Manager Operasional', joinDate:'2021-01-04', status:true, resignDate:'', basicSalary:6000000, mealPerDay:20000, bank:'BCA', accountNumber:'', note:'' },
    { id:'emp10', nip:'EMP-0010', pin:'1010', name:'Lestari Wulandari', group:'Supervisor', position:'Supervisor Produksi', joinDate:'2022-04-11', status:true, resignDate:'', basicSalary:4500000, mealPerDay:20000, bank:'BRI', accountNumber:'', note:'' }
  ];

  const hrSettings = {
    hkStandar:26,
    mealDefault:20000,
    hppGroups:['Produksi'],
    hppSalaryBasis:'before',
    weeklyOff:[0],
    holidays:[],
    groups:{
      Produksi:{ start:'08:00', tolerance:15, lateNoMeal:true },
      Operasional:{ start:'08:00', tolerance:10, lateNoMeal:false },
      Manager:{ start:'08:00', tolerance:15, lateNoMeal:false },
      Supervisor:{ start:'08:00', tolerance:15, lateNoMeal:false }
    },
    hkRules:{ alfa:true, izin:true, sakit:false, cuti:false },
    history:[]
  };

  const attendanceScans = [];
  const attendanceNotes = [];
  const attendanceBatches = [];
  const payrolls = [];

  const seedMonth = '2026-10';
  const seedNoteMap = {
    emp3:{ 7:'izin', 22:'cuti' },
    emp5:{ 14:'sakit' },
    emp8:{ 9:'izin' },
    emp10:{ 19:'sakit' }
  };
  const seedLateDays = { emp1:[6,20], emp2:[13], emp5:[8], emp6:[15], emp7:[21] };
  const seedAlfaDays = { emp2:[21], emp6:[27], emp9:[9] };
  const dayCount = Number(periodEndDate(seedMonth).slice(-2));
  employees.forEach((employee, employeeIndex) => {
    for (let day = 1; day <= dayCount; day += 1) {
      const date = seedMonth + '-' + pad2(day);
      const weekday = new Date(date + 'T12:00:00').getDay();
      const noteType = seedNoteMap[employee.id] && seedNoteMap[employee.id][day];
      if (weekday === 0) {
        if (employeeIndex === 0 && day === 4) {
          attendanceScans.push({ id:'scan' + employee.id + date, employeeId:employee.id, pin:employee.pin, nip:employee.nip, name:employee.name, date, scan1:'08:05:00', scan2:'15:05:00', batchId:'' });
          attendanceNotes.push({ id:'note' + employee.id + date, employeeId:employee.id, date, type:'lembur', note:'Produksi lembur Minggu', by:'Admin', createdAt:date });
        }
        continue;
      }
      if (noteType) {
        attendanceNotes.push({ id:'note' + employee.id + date, employeeId:employee.id, date, type:noteType, note:noteType === 'izin' ? 'Izin keperluan keluarga' : noteType === 'cuti' ? 'Cuti tahunan' : 'Sakit dengan surat', by:'Admin', createdAt:date });
        continue;
      }
      if ((seedAlfaDays[employee.id] || []).includes(day)) continue;
      const late = (seedLateDays[employee.id] || []).includes(day);
      const scan1 = late ? '08:' + pad2(20 + (employeeIndex % 5)) + ':00' : '07:' + pad2(40 + ((employeeIndex + day) % 15)) + ':00';
      const scan2 = (employeeIndex + day) % 7 === 0 ? '17:' + pad2((5 + employeeIndex) % 60) + ':00' : '';
      attendanceScans.push({ id:'scan' + employee.id + date, employeeId:employee.id, pin:employee.pin, nip:employee.nip, name:employee.name, date, scan1, scan2, batchId:'' });
    }
  });
  attendanceNotes.push({ id:'notedisp1', employeeId:'emp1', date:'2026-10-06', type:'dispensasi', note:'Dispensasi telat dari admin', by:'Admin', createdAt:'2026-10-06' });

  return {
    customers, products, promos, orders, deliveries, returns, warehouses,
    stockHistory, opnames, incomes, expenses, receivables,
    collections, payments, users, roles, monthlyHistory,
    categories, materials, suppliers, purchaseRequests, units, purchaseOrders,
    receipts, purchaseReturns, stockMovements, payables, accounts, journals, permissions,
    recipes, productions, productionLogs,
    hppSettings, biayaProduksiBulanan, hppHarian, hppLog, hppBulanan,
    employees, attendanceScans, attendanceNotes, attendanceBatches, payrolls, hrSettings
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
    canvasMode: false, canvasScreenId: null, canvasDefinition: null,
    savedAt: null,
    persistTimer: null,
    pendingImport: null,
    syncing: false,
    toast: { show: false, message: '', type: 'success' },
    toastTimer: null,
    confirm: { open: false, title: '', message: '', action: '', id: null, danger: true, confirmLabel: 'Lanjutkan', cancelLabel: 'Kembali' },
    actionMenu: { open: false, kind: '', id: null, top: 0, left: 0, items: [] },

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
    purchaseReturns: seed.purchaseReturns,
    stockMovements: seed.stockMovements,
    payables: seed.payables,
    recipes: seed.recipes,
    productions: seed.productions,
    productionLogs: seed.productionLogs,
    hppSettings: seed.hppSettings,
    biayaProduksiBulanan: seed.biayaProduksiBulanan,
    hppHarian: seed.hppHarian,
    hppLog: seed.hppLog,
    hppBulanan: seed.hppBulanan,
    employees: seed.employees,
    attendanceScans: seed.attendanceScans,
    attendanceNotes: seed.attendanceNotes,
    attendanceBatches: seed.attendanceBatches,
    payrolls: seed.payrolls,
    hrSettings: seed.hrSettings,
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
      if (this.canvasMode) return;
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
      if (this.canvasMode) return;
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
      if (parsed && parsed.version === 11 && parsed.data) {
        this.migrateFromV11(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 12 && parsed.data) {
        this.migrateFromV12(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 13 && parsed.data) {
        this.migrateFromV13(parsed);
        this.saveStore();
        return;
      }
      if (parsed && (parsed.version === 14 || parsed.version === 15) && parsed.data) {
        this.migrateFromV14(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 16 && parsed.data) {
        this.migrateFromV16(parsed);
        this.saveStore();
        return;
      }
      if (parsed && parsed.version === 17 && parsed.data) {
        this.migrateFromV17(parsed);
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
    migrateFromV16(parsed) {
      this.migrateFromV14(parsed);
    },
    migrateFromV17(parsed) {
      this.migrateFromV16(parsed);
      const fresh = seedData();
      this.employees = Array.isArray(this.employees) && this.employees.length ? this.employees : fresh.employees;
      this.attendanceScans = Array.isArray(this.attendanceScans) ? this.attendanceScans : fresh.attendanceScans;
      this.attendanceNotes = Array.isArray(this.attendanceNotes) ? this.attendanceNotes : fresh.attendanceNotes;
      this.attendanceBatches = Array.isArray(this.attendanceBatches) ? this.attendanceBatches : [];
      this.payrolls = Array.isArray(this.payrolls) ? this.payrolls : [];
      this.hrSettings = Object.assign({}, fresh.hrSettings, this.hrSettings || {});
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (['Admin','Manager','Developer'].includes(role.name)) {
          return { ...role, permissions:[...new Set([...(role.permissions || []), 'Data Pegawai','Rekap Absensi','Payroll'])] };
        }
        return role;
      });
    },
    applyLogisticRoleMigration() {
      const fresh = seedData();
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (role.name === 'Admin' || role.name === 'Developer') {
          return { ...role, permissions: [...fresh.permissions] };
        }
        const permissions = (role.permissions || []).filter(permission => permission !== 'Master Keuangan');
        if (['Manager','Supervisor'].includes(role.name)) {
          if (!permissions.includes('Return Pembelian')) permissions.push('Return Pembelian');
          if (!permissions.includes('Utang')) permissions.push('Utang');
        }
        return { ...role, permissions };
      });
      if (!this.roles.some(role => role.name === 'Logistik')) {
        const logistic = fresh.roles.find(role => role.name === 'Logistik');
        if (logistic) this.roles.push({ ...logistic, permissions: [...logistic.permissions] });
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
      this.purchaseReturns = parsed.data.purchaseReturns || [];
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
      this.applyLogisticRoleMigration();
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
      this.applyLogisticRoleMigration();
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
      this.applyLogisticRoleMigration();
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
    migrateFromV11(parsed) {
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.purchaseReturns = parsed.data.purchaseReturns || [];
      this.applyLogisticRoleMigration();
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
    migrateFromV12(parsed) {
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      this.payables = (this.payables || []).map(payable => ({ ...payable, payments: payable.payments || [] }));
      this.applyLogisticRoleMigration();
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
    migrateFromV14(parsed) {
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      const fresh = seedData();
      this.hppSettings = Object.assign({}, fresh.hppSettings, this.hppSettings || {});
      this.hppSettings.history = Array.isArray(this.hppSettings.history) ? this.hppSettings.history : [];
      this.biayaProduksiBulanan = Array.isArray(this.biayaProduksiBulanan) ? this.biayaProduksiBulanan : [];
      this.hppHarian = Array.isArray(this.hppHarian) ? this.hppHarian : [];
      this.hppLog = Array.isArray(this.hppLog) ? this.hppLog : [];
      this.hppBulanan = Array.isArray(this.hppBulanan) ? this.hppBulanan : [];
      this.hppSettings.electricityFormula = 'allocation';
      this.employees = Array.isArray(this.employees) && this.employees.length ? this.employees : fresh.employees;
      this.attendanceScans = Array.isArray(this.attendanceScans) ? this.attendanceScans : fresh.attendanceScans;
      this.attendanceNotes = Array.isArray(this.attendanceNotes) ? this.attendanceNotes : fresh.attendanceNotes;
      this.attendanceBatches = Array.isArray(this.attendanceBatches) ? this.attendanceBatches : [];
      this.payrolls = Array.isArray(this.payrolls) ? this.payrolls : [];
      this.hrSettings = Object.assign({}, fresh.hrSettings, this.hrSettings || {});
      this.permissions = fresh.permissions;
      this.roles = (this.roles || fresh.roles).map(role => {
        if (['Admin','Manager','Developer'].includes(role.name)) {
          return { ...role, permissions:[...new Set([...(role.permissions || []), 'Data Pegawai','Rekap Absensi','Payroll'])] };
        }
        return role;
      });
      this.ensureOpeningBalanceAccount();
      (this.orders || []).forEach(order => {
        if (order.costAtOrder !== undefined) return;
        order.costAtOrder = (order.items || []).reduce((sum, item) => {
          const product = (this.products || []).find(row => row.id === item.productId) || {};
          return sum + (Number(product.cost) || 0) * (Number(item.qty) || 0);
        }, 0);
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
        if (parsed.ui.selectedOrderId && (this.orders || []).some(order => order.id === parsed.ui.selectedOrderId)) this.selectedOrderId = parsed.ui.selectedOrderId;
        if (parsed.ui.selectedDeliveryId && (this.deliveries || []).some(delivery => delivery.id === parsed.ui.selectedDeliveryId)) this.selectedDeliveryId = parsed.ui.selectedDeliveryId;
        if (parsed.ui.selectedCollectionId && (this.collections || []).some(collection => collection.id === parsed.ui.selectedCollectionId)) this.selectedCollectionId = parsed.ui.selectedCollectionId;
      }
    },
    migrateFromV13(parsed) {
      const fresh = seedData();
      DOMAIN_KEYS.forEach(key => {
        if (parsed.data[key] !== undefined) this[key] = parsed.data[key];
      });
      fresh.categories.forEach(category => {
        if (!(this.categories || []).some(item => item.code === category.code)) this.categories.push(category);
      });
      fresh.materials.forEach(material => {
        if (!(this.materials || []).some(item => item.code === material.code)) this.materials.push(material);
      });
      if (!Array.isArray(this.recipes)) {
        this.recipes = fresh.recipes.filter(recipe =>
          (this.products || []).some(product => product.id === recipe.productId)
          && (this.materials || []).some(material => material.id === recipe.materialId)
        );
      }
      this.productions = Array.isArray(this.productions) ? this.productions : [];
      this.productionLogs = Array.isArray(this.productionLogs) ? this.productionLogs : [];
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
        if (this.actionMenu.open) this.actionMenu.open = false;
      }, true);
      window.addEventListener('resize', () => {
        if (this.formPicker.open) this.closeFormPicker();
        if (this.actionMenu.open) this.actionMenu.open = false;
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
    get bottomNavItems() {
      const home = { label:'Beranda', icon:'i-dashboard', page:'dashboard', match:['dashboard'] };
      const order = {
        label:'Order', icon:'i-cart',
        page: this.role === 'Sales' ? 'order-customer' : 'orders',
        match:['order-customer','order-create','order-success','orders','order-detail','invoice','bulk-invoice','deliveries','delivery-create','delivery-check','delivery-detail','delivery-invoice','returns']
      };
      const customers = { label:'Pelanggan', icon:'i-users', page:'customers', match:['customers'] };
      const stock = { label:'Stock', icon:'i-boxes', page:'stock', match:['stock'] };
      const receivables = { label:'Piutang', icon:'i-wallet', page:'receivables', match:['receivables','collection-create','collection-confirm'] };
      const purchasing = {
        label:'Pembelian', icon:'i-clipboard', page:'purchase-requests',
        match:['purchase-requests','purchase-request-create','purchase-request-preview','purchase-orders','purchase-order-create','purchase-order-preview','receipts','receipt-create','receipt-preview','purchase-returns','purchase-return-create']
      };
      const pr = { label:'PR', icon:'i-clipboard', page:'purchase-requests', match:['purchase-requests','purchase-request-create','purchase-request-preview'] };
      const receipts = { label:'Penerimaan', icon:'i-truck', page:'receipts', match:['receipts','receipt-create','receipt-preview'] };
      const users = { label:'Pengguna', icon:'i-users', page:'users', match:['users','roles'] };
      const account = { label:'Akun', icon:'i-user', page:'settings', match:['settings'] };
      const layouts = {
        Sales: [home, order, customers, account],
        Admin: [home, order, stock, receivables, account],
        Manager: [home, order, purchasing, stock, account],
        Supervisor: [home, order, stock, receivables, account],
        Logistik: [home, stock, pr, receipts, account],
        Developer: [home, order, stock, users, account]
      };
      return (layouts[this.role] || [home, order, customers, account])
        .filter(item => this.canAccessPage(item.page));
    },
    get navGroups() {      const groups = [
        { title: '', items: [
          { page: 'dashboard', label: 'Dashboard', icon: 'i-dashboard', match: ['dashboard'] }
        ]},
        { title: 'Penjualan', items: [
          { page: 'customers', label: 'Master Pelanggan', icon: 'i-users', match: ['customers'] },
          { page: 'promos', label: 'Master Promo', icon: 'i-tag', match: ['promos'] },
          { page: this.role === 'Sales' ? 'order-customer' : 'orders', label: 'Order', icon: 'i-cart', match: ['order-customer','order-create','order-success','orders','order-detail','invoice','bulk-invoice','deliveries','delivery-create','delivery-check','delivery-detail','delivery-invoice','returns'] }
        ]},
        { title: 'Logistik', items: [
          { page: 'warehouses', label: 'Master Gudang', icon: 'i-warehouse', match: ['warehouses'] },
          { page: 'products', label: 'Master Produk', icon: 'i-package', match: ['products','product-create'] },
          { page: 'materials', label: 'Master Barang', icon: 'i-box', match: ['materials'] },
          { page: 'stock', label: 'Stock', icon: 'i-boxes', match: ['stock'] }
        ]},
        { title: 'HR', items: [
          { page: 'employees', label: 'Data Pegawai', icon: 'i-users', match: ['employees'] },
          { page: 'attendance', label: 'Rekap Absensi', icon: 'i-calendar', match: ['attendance'] },
          { page: 'payroll', label: 'Payroll', icon: 'i-banknote', match: ['payroll'] }
        ]},
        { title: 'Pembelian', items: [
          { page: 'suppliers', label: 'Supplier', icon: 'i-store', match: ['suppliers'] },
          { page: 'purchase-requests', label: 'Purchase Request', icon: 'i-clipboard', match: ['purchase-requests','purchase-request-create','purchase-request-preview'] },
          { page: 'purchase-orders', label: 'Purchase Order', icon: 'i-file', match: ['purchase-orders','purchase-order-create','purchase-order-preview'] },
          { page: 'receipts', label: 'Penerimaan Barang', icon: 'i-truck', match: ['receipts','receipt-create','receipt-preview'] },
          { page: 'purchase-returns', label: 'Return', icon: 'i-refresh', match: ['purchase-returns','purchase-return-create'] }
        ]},
        { title: 'Keuangan', items: [
          { page: 'receivables', label: 'Piutang', icon: 'i-wallet', match: ['receivables','collection-create','collection-confirm'] },
          { page: 'payables', label: 'Utang', icon: 'i-coins', match: ['payables'] },
          { page: 'finance-accounts', label: 'Daftar Rekening', icon: 'i-banknote', match: ['finance-accounts'] },
          { page: 'finance-income', label: 'Pendapatan Lainnya', icon: 'i-banknote', match: ['finance-income'] },
          { page: 'finance-expense', label: 'Pengeluaran Lainnya', icon: 'i-banknote-down', match: ['finance-expense'] },
          { page: 'coa', label: 'Chart of Accounts', icon: 'i-clipboard', match: ['coa'] },
          { page: 'opening-balance', label: 'Saldo Awal', icon: 'i-coins', match: ['opening-balance'] },
          { page: 'hpp', label: 'HPP', icon: 'i-calculator', match: ['hpp','hpp-create','hpp-detail','hpp-bulanan-create','hpp-bulanan-detail'] },
          { page: 'journals', label: 'Jurnal Umum', icon: 'i-file', match: ['journals','journal-create'] },
          { page: 'ledger', label: 'Buku Besar', icon: 'i-chart', match: ['ledger'] },
          { page: 'reports', label: 'Laporan', icon: 'i-receipt', match: ['reports'] }
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
        'bulk-invoice': { title: 'Preview Invoice', crumb: 'Order / Preview Invoice' },
        deliveries: { title: 'Surat Jalan', crumb: 'Order / Surat Jalan' },
        'delivery-create': { title: 'Buat Surat Jalan', crumb: 'Order / Surat Jalan / Buat' },
        'delivery-check': { title: 'Konfirmasi Surat Jalan', crumb: 'Order / Surat Jalan / Konfirmasi' },
        'delivery-detail': { title: 'Detail Surat Jalan', crumb: 'Order / Surat Jalan / Detail' },
        'delivery-invoice': { title: 'Preview Delivery', crumb: 'Order / Surat Jalan / Invoice' },
        returns: { title: 'Return', crumb: 'Order / Return' },
        stock: { title: 'Stock', crumb: 'Stock' },
        warehouses: { title: 'Master Gudang', crumb: 'Master Gudang' },
        products: { title: 'Master Produk', crumb: 'Master Produk' },
        'product-create': { title: 'Form Produk', crumb: 'Master Produk / Form Produk' },
        materials: { title: 'Master Barang', crumb: 'Master Barang' },
        employees: { title: 'Data Pegawai', crumb: 'HR / Data Pegawai' },
        attendance: { title: 'Rekap Absensi', crumb: 'HR / Rekap Absensi' },
        payroll: { title: 'Payroll', crumb: 'HR / Payroll' },
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
        'purchase-returns': { title: 'Return Pembelian', crumb: 'Pembelian / Return' },
        'purchase-return-create': { title: 'Buat Return Pembelian', crumb: 'Pembelian / Return / Buat' },
        coa: { title: 'Chart of Accounts', crumb: 'Keuangan / Chart of Accounts' },
        'opening-balance': { title: 'Saldo Awal', crumb: 'Keuangan / Saldo Awal' },
        hpp: { title: 'HPP', crumb: 'Keuangan / HPP' },
        'hpp-create': { title: 'Buat HPP', crumb: 'Keuangan / HPP / Buat' },
        'hpp-detail': { title: 'Detail HPP', crumb: 'Keuangan / HPP / Detail' },
        'hpp-bulanan-create': { title: 'Buat HPP Bulanan', crumb: 'Keuangan / HPP / Bulanan / Buat' },
        'hpp-bulanan-detail': { title: 'Detail HPP Bulanan', crumb: 'Keuangan / HPP / Bulanan / Detail' },
        journals: { title: 'Jurnal Umum', crumb: 'Keuangan / Jurnal Umum' },
        'journal-create': { title: 'Buat Jurnal', crumb: 'Keuangan / Jurnal Umum / Buat' },
        ledger: { title: 'Buku Besar', crumb: 'Keuangan / Buku Besar' },
        reports: { title: 'Laporan', crumb: 'Keuangan / Laporan' },
        'trial-balance': { title: 'Laporan', crumb: 'Keuangan / Laporan' },
        'finance-income': { title: 'Pendapatan Lainnya', crumb: 'Keuangan / Pendapatan Lainnya' },
        'finance-expense': { title: 'Pengeluaran Lainnya', crumb: 'Keuangan / Pengeluaran Lainnya' },
        'finance-accounts': { title: 'Daftar Rekening', crumb: 'Keuangan / Daftar Rekening' },
        receivables: { title: 'Piutang', crumb: 'Keuangan / Piutang' },
        payables: { title: 'Utang', crumb: 'Keuangan / Utang' },
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
      if (page === 'trial-balance') page = 'reports';
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
    ensureCanvasData() {
      if (!this.canvasMode) return;
      const hasTransactions = this.orders.length || this.purchaseRequests.length || this.purchaseOrders.length;
      if (hasTransactions) return;
      const cacheKey = 'canvas-demo-seed-' + STORE_VERSION + '-j';
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          DOMAIN_KEYS.forEach(key => {
            if (data[key] !== undefined) this[key] = data[key];
          });
          if (data.permissions) this.permissions = data.permissions;
          return;
        }
      } catch (error) {}
      try {
        this.seedDummyData();
        this.toast.show = false;
        sessionStorage.setItem(cacheKey, JSON.stringify(Object.assign({}, this.snapshot(), { permissions:this.permissions })));
      } catch (error) {
        console.warn('Canvas dummy data gagal disiapkan:', error);
      }
    },
    initCanvas() {
      if (!new URLSearchParams(location.search).has('canvas')) return;
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        setTimeout(() => this.initCanvasScreen(), 80);
      };
      if (document.readyState === 'complete') start();
      else window.addEventListener('load', start, { once:true });
      setTimeout(start, 2500);
    },
    async initCanvasScreen() {
      this.ensureCanvasData();
      try {
        let response = await fetch('canvas-screens.json', { cache:'no-store' });
        if (!response.ok) response = await fetch('canvas-screens.json', { cache:'reload' });
        if (!response.ok) return;
        const data = await response.json();
        const screens = Array.isArray(data) ? data : (data.screens || []);
        const definition = screens.find(item => item.id === this.canvasScreenId);
        if (!definition) return;
        this.canvasDefinition = definition;
        if (definition.role) this.role = definition.role;
        if (definition.state) {
          Object.keys(definition.state).forEach(key => { this[key] = definition.state[key]; });
        }
        if (definition.page) this.page = definition.page;
        this.applyCanvasSetup(definition);
        this.sessionPage = this.page;
      } catch (error) {
        console.warn('Canvas screen setup gagal:', error);
      }
    },
    applyCanvasSetup(definition) {
      const first = list => (list || [])[0] || null;
      const page = definition.page;
      switch (definition.setup) {
        case 'order-detail': {
          const row = first(this.orders);
          if (row) { this.selectedOrderId = row.id; this.page = 'order-detail'; }
          break;
        }
        case 'invoice': {
          const row = first(this.orders);
          if (row) { this.selectedOrderId = row.id; this.page = 'invoice'; }
          break;
        }
        case 'bulk-invoice': {
          this.selectedOrderIds = this.orders.slice(0, 3).map(row => row.id);
          this.bulkOrderIds = [...this.selectedOrderIds];
          this.page = 'bulk-invoice';
          break;
        }
        case 'delivery-check': {
          const row = first(this.deliveries);
          if (row) this.startDeliveryCheck(row, false);
          break;
        }
        case 'delivery-detail': {
          const row = first(this.deliveries);
          if (row) this.startDeliveryCheck(row, true);
          break;
        }
        case 'delivery-invoice': {
          const row = first(this.deliveries);
          if (row) { this.selectedDeliveryId = row.id; this.page = 'delivery-invoice'; }
          break;
        }
        case 'customer-modal': this.openCustomer(first(this.customers)); break;
        case 'promo-modal': this.openPromo(first(this.promos)); break;
        case 'return-modal': {
          const row = this.orders.find(item => (item.items || []).length);
          if (row) { this.page = 'returns'; this.openReturn(row); }
          break;
        }
        case 'order-preview': {
          const customer = first(this.customers);
          const product = first(this.products);
          if (customer && product) {
            this.selectedCustomerId = customer.id;
            this.cart = { [product.id]: 2 };
            this.paymentMethod = 'Tunai';
            this.page = 'order-create';
            this.orderPreviewOpen = true;
          }
          break;
        }
        case 'order-stock-confirm': {
          const customer = first(this.customers);
          const product = this.products.find(item => (Number(item.stock) || 0) > 0) || first(this.products);
          if (customer && product) {
            this.startOrder(customer);
            this.cart = { [product.id]: (Number(product.stock) || 0) + 5 };
            this.paymentMethod = 'Tunai';
            this.openOrderPreview();
          }
          break;
        }
        case 'order-preview-shortage': {
          const customer = first(this.customers);
          const product = this.products.find(item => (Number(item.stock) || 0) > 0) || first(this.products);
          if (customer && product) {
            this.startOrder(customer);
            this.cart = { [product.id]: (Number(product.stock) || 0) + 5 };
            this.paymentMethod = 'Tunai';
            this.orderStockOverride = true;
            this.orderPreviewOpen = true;
          }
          break;
        }
        case 'delivery-preview': {
          const rows = this.orders.filter(item => ['already','holding','partial'].includes(item.status)).slice(0, 2);
          this.deliveryDraft = {
            orderIds: rows.map(row => row.id),
            driver:'Budi Santoso',
            car:'L300 - DD 1234 AB',
            warehouseId:'wh1',
            start:todayISO(),
            end:shiftISO(todayISO(), 13)
          };
          this.page = 'delivery-create';
          this.deliveryPreviewOpen = true;
          break;
        }
        case 'collection-preview': {
          const rows = this.activeReceivables.slice(0, 2);
          this.collectionSales = rows[0] ? rows[0].sales : 'Fahri';
          this.collectionIds = rows.map(row => row.id);
          this.page = 'collection-create';
          this.collectionPreviewOpen = true;
          break;
        }
        case 'report-modal': this.reportOpen = true; break;
        case 'camera-modal': this.openCamera(first(this.customers)); break;
        case 'confirm-modal': this.askConfirm('canvas-confirm', null, 'Konfirmasi', 'Pastikan data sudah benar.', false); break;
        case 'order-filter-customer': {
          this.page = 'orders';
          this.orderCustomerSearch = '';
          this.orderCustomerOpen = true;
          break;
        }
        case 'action-menu': {
          this.page = 'orders';
          setTimeout(() => {
            const visible = [...document.querySelectorAll('main > section')].find(section => getComputedStyle(section).display !== 'none');
            const trigger = visible && visible.querySelector('tbody td.actions button');
            if (trigger) trigger.click();
          }, 350);
          break;
        }
        case 'warehouse-modal': this.openWarehouse(first(this.warehouses)); break;
        case 'product-form': this.openProduct(first(this.products)); break;
        case 'recipe-preview': this.openRecipePreview(first(this.products)); break;
        case 'product-category-modal': this.openCategory('product', first(this.productCategories)); break;
        case 'material-modal': this.openMaterial(first(this.materials)); break;
        case 'material-category-modal': this.openCategory('material', first(this.materialCategories)); break;
        case 'production-modal': this.openProduction(); break;
        case 'production-detail': {
          const row = first(this.productions);
          if (row) this.viewProduction(row);
          break;
        }
        case 'production-detail-logs': {
          const row = first(this.productions);
          if (row) {
            this.viewProduction(row);
            this.productionDetailTab = 'logs';
          }
          break;
        }
        case 'stock-modal': {
          this.page = 'stock';
          this.stockView = 'product';
          this.openStock();
          break;
        }
        case 'opname-modal': {
          this.page = 'stock';
          this.stockView = 'product';
          this.openOpname();
          break;
        }
        case 'production-correction': {
          const row = first(this.productions);
          if (row) this.openProductionCorrection(row);
          break;
        }
        case 'supplier-modal': this.openSupplier(first(this.suppliers)); break;
        case 'purchase-request-create': this.startPRCreate(); break;
        case 'purchase-request-preview': {
          const row = first(this.purchaseRequests);
          if (row) { this.selectedPRId = row.id; this.page = 'purchase-request-preview'; }
          break;
        }
        case 'purchase-request-detail': {
          const row = first(this.purchaseRequests);
          if (row) this.viewPR(row);
          break;
        }
        case 'purchase-request-reject': {
          this.role = 'Manager';
          const row = this.purchaseRequests.find(item => item.status === 'submitted' && item.requesterId !== this.currentUserId)
            || this.purchaseRequests.find(item => item.status === 'submitted');
          if (row) {
            if (row.requesterId === this.currentUserId) {
              const manager = this.users.find(user => user.id !== row.requesterId && (user.roles || []).includes('Manager'));
              if (manager) this.currentUserId = manager.id;
            }
            this.openRejectPR(row);
          }
          break;
        }
        case 'purchase-order-create': this.openPOCreate(); break;
        case 'purchase-order-preview': {
          const row = first(this.purchaseOrders);
          if (row) { this.selectedPOId = row.id; this.page = 'purchase-order-preview'; }
          break;
        }
        case 'purchase-order-detail': {
          const row = first(this.purchaseOrders);
          if (row) this.viewPO(row);
          break;
        }
        case 'purchase-order-reject': {
          this.role = 'Manager';
          const row = this.purchaseOrders.find(item => item.status === 'pending_approval' && item.createdById !== this.currentUserId)
            || this.purchaseOrders.find(item => item.status === 'pending_approval');
          if (row) {
            if (row.createdById === this.currentUserId) {
              const manager = this.users.find(user => user.id !== row.createdById && (user.roles || []).includes('Manager'));
              if (manager) this.currentUserId = manager.id;
            }
            this.openRejectPO(row);
          }
          break;
        }
        case 'receipt-create': this.openReceiptCreate(); break;
        case 'receipt-preview': {
          const row = first(this.receipts);
          if (row) { this.selectedReceiptId = row.id; this.page = 'receipt-preview'; }
          break;
        }
        case 'receipt-detail': {
          const row = first(this.receipts);
          if (row) this.viewReceipt(row);
          break;
        }
        case 'receipt-history': {
          const row = first(this.receipts);
          if (row) this.viewReceiptHistory(row);
          break;
        }
        case 'purchase-return-create': this.openPurchaseReturnCreate(); break;
        case 'purchase-return-detail': {
          const row = first(this.purchaseReturns);
          if (row) this.viewPurchaseReturn(row);
          break;
        }
        case 'account-modal': {
          const row = this.accounts.find(item => !item.isSystem);
          if (row) this.openAccount(row);
          break;
        }
        case 'report-trial': this.reportTab = 'trial'; this.page = 'reports'; break;
        case 'report-profit': this.reportTab = 'profit'; this.page = 'reports'; break;
        case 'report-balance': this.reportTab = 'balance'; this.page = 'reports'; break;
        case 'report-revenue': this.reportTab = 'revenue'; this.page = 'reports'; break;
        case 'hpp-bulanan-create': {
          this.startHppBulananCreate();
          this.page = 'hpp-bulanan-create';
          break;
        }
        case 'hpp-create': {
          const production = first(this.productions.filter(item => item.status === 'posted'));
          this.startHppCreate();
          if (production) {
            this.hppForm.date = production.date;
            this.hppForm.productId = production.productId;
          }
          break;
        }
        case 'journal-create': this.startJournalCreate(); break;
        case 'journal-detail': {
          const row = first(this.journals);
          if (row) this.viewJournal(row);
          break;
        }
        case 'journal-void': {
          const row = this.journals.find(item => item.status === 'posted' && item.source === 'manual');
          if (row) { this.page = 'journals'; this.voidJournal(row); }
          break;
        }
        case 'payable-detail': {
          const row = first(this.payables);
          if (row) this.viewPayable(row);
          break;
        }
        case 'payable-payment': {
          const row = this.payables.find(item => Number(item.unpaid) > 0);
          if (row) this.openPayablePayment(row);
          break;
        }
        case 'finance-modal': this.openFinance(definition.page === 'finance-expense' ? 'expense' : 'income'); break;
        case 'collection-create': this.startCollectionCreate(); break;
        case 'receivable-payment-modal': {
          this.page = 'receivables';
          this.receivableTab = 'active';
          const row = this.receivables.find(item => Number(item.unpaid) > 0) || first(this.receivables);
          if (row) this.openPayment(row);
          break;
        }
        case 'collection-confirm': {
          const row = first(this.collections);
          if (row) this.startCollection(row);
          break;
        }
        case 'user-modal': this.openUser(first(this.users)); break;
        case 'role-modal': this.openRole(first(this.roles)); break;
        case 'login': this.page = 'login'; break;
        default:
          if (page) this.page = page;
      }
      this.sessionPage = this.page;
    },
    init() {
      const params = new URLSearchParams(location.search);
      this.canvasMode = params.has('canvas');
      this.canvasScreenId = params.get('canvas');
      this.loadStore();
      this.ensureOpeningBalanceAccount();
      if (this.ensureCashBankAccounts()) this.saveStore();
      this.syncOrderAudit();
      this.initHpp();
      if (this.canvasMode && !this.currentUserId) {
        const user = this.users.find(item => (item.roles || []).includes('Admin')) || this.users[0];
        if (user) {
          this.currentUserId = user.id;
          this.role = (user.roles || [])[0] || 'Admin';
        }
      }
      this.purchaseRequests
        .filter(pr => ['approved','processing','completed'].includes(pr.status))
        .forEach(pr => this.updatePRStatus(pr));
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
        if (next === 'trial-balance') next = 'reports';
        if (!this.canAccessPage(next) || !this.pageRequiresData(next)) next = 'dashboard';
        this.page = next;
        this.sessionPage = next;
        try { history.replaceState(null, '', '#' + next); } catch (e) {}
      }
      if (['hpp-bulanan-create','hpp-bulanan-detail'].includes(this.page)) this.hppTab = 'bulanan';
      if (this.page === 'finance-income') this.financeTab = 'income';
      if (this.page === 'finance-expense') this.financeTab = 'expense';
      if (['delivery-check','delivery-detail'].includes(this.page) && this.deliveries.length) {
        this.startDeliveryCheck(this.deliveries[0], this.page === 'delivery-detail');
      }
      this.saveStore();

      window.addEventListener('hashchange', () => {
        if (this.canvasMode) return;
        const next = (location.hash || '').replace('#', '');
        if (!PAGES.includes(next) || next === 'login') return;
        if (next === 'trial-balance') { this.go('reports'); return; }
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
    fmt2(n) { return number2Fmt.format(Number(n) || 0); },
    rp2(n) { return rupiah2Fmt.format(Number(n) || 0); },
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
    userRoleLabel(name, role = '') {
      const actor = String(name || '').trim();
      if (!actor || actor === 'Sistem') return actor || '-';
      const user = this.users.find(item => item.name === actor || item.username === actor);
      const resolvedRole = role || (user && (user.roles || [])[0]) || (actor === this.currentUser ? this.role : '');
      return resolvedRole ? actor + ' (' + resolvedRole + ')' : actor;
    },
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
      this.orderStockOverride = false;
      this.orderCustomerOpen = false;
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
      this.receiptHistoryOpen = false;
      this.purchaseReturnDetailOpen = false;
      this.payableDetailOpen = false;
      this.payablePaymentOpen = false;
      this.recipePreviewOpen = false;
      this.productionModalOpen = false;
      this.productionDetailOpen = false;
      this.actionMenu.open = false;
      this.accountModalOpen = false;
      this.journalDetailOpen = false;
      this.journalVoidOpen = false;
      this.warehouseModalOpen = false;
      this.financeModalOpen = false;
      this.bankAccountModalOpen = false;
      this.bankTransferModalOpen = false;
      this.hppBulananRevisionOpen = false;
      this.employeeModalOpen = false;
      this.attendanceImportOpen = false;
      this.attendanceNoteOpen = false;
      this.attendanceSettingsOpen = false;
      this.payrollRevisionOpen = false;
      this.payrollHppOpen = false;
      this.payrollSettingsOpen = false;
      this.userModalOpen = false;
      this.roleModalOpen = false;
      this.stockModalOpen = false;
      this.opnameModalOpen = false;
      this.returnModalOpen = false;
      this.paymentModalOpen = false;
      this.confirm.open = false;
    },
    askConfirm(action, id, title, message, danger = true, confirmLabel = 'Lanjutkan', cancelLabel = 'Kembali') {
      this.confirm = { open: true, action, id, title, message, danger, confirmLabel, cancelLabel };
    },
    askSave(action, id, message, confirmLabel = 'Simpan') {
      this.askConfirm(action, id, 'Pastikan data sudah benar', message, false, confirmLabel, 'Kembali');
    },
    openActionMenu(event, kind, row) {
      const items = this.actionMenuItems(kind, row).filter(item => item && item.label && item.show !== false);
      if (!items.length) { this.actionMenu.open = false; return; }
      const rect = event.currentTarget.getBoundingClientRect();
      const width = 224;
      const height = Math.min(items.length * 38 + 16, 360);
      const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width));
      const top = rect.bottom + 6 + height > window.innerHeight - 8
        ? Math.max(8, rect.top - height - 6)
        : rect.bottom + 6;
      this.actionMenu = { open:true, kind, id:row.id, top, left, items };
    },
    runActionMenuItem(item) {
      if (!item || item.disabled) return;
      this.actionMenu.open = false;
      item.run();
    },
    actionMenuItems(kind, row) {
      switch (kind) {
        case 'hpp': {
          const items = [{ label:'Lihat Detail', icon:'i-eye', run:() => this.viewHpp(row) }];
          if (row.status === 'draft') {
            items.push({ label:'Edit Draft', icon:'i-pencil', run:() => this.editHpp(row) });
            items.push({ label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteHpp(row) });
          }
          if (row.status === 'final') {
            items.push({ label:'Revisi', icon:'i-refresh', run:() => this.openHppRevision(row) });
            items.push({ label:'Terapkan ke Harga Modal', icon:'i-check', run:() => this.askHppApply(row) });
          }
          return items;
        }
        case 'orders': return [
          { label:'Konfirmasi', icon:'i-check', show:row.status === 'pending', run:() => this.confirmOrder(row) },
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewOrder(row.id) },
          { label:'Lihat Invoice', icon:'i-printer', run:() => this.viewInvoice(row.id) },
          { label:'Hapus', icon:'i-trash', danger:true, show:['pending','already'].includes(row.status), run:() => this.deleteOrder(row) }
        ];
        case 'orders-bulk': {
          const none = this.selectedOrderIds.length === 0;
          return [
            { label:'Cetak', icon:'i-printer', disabled:none, run:() => this.startBulkInvoice() },
            { label:'Konfirmasi', icon:'i-check', disabled:none, run:() => this.bulkConfirm() },
            { label:'Hapus', icon:'i-trash', danger:true, disabled:none, run:() => this.bulkDelete() }
          ];
        }
        case 'deliveries': return [
          { label:'Konfirmasi', icon:'i-check', show:row.status === 'pending', run:() => this.startDeliveryCheck(row, false) },
          { label:'Lihat', icon:'i-eye', run:() => this.startDeliveryCheck(row, true) },
          { label:'Cetak Invoice', icon:'i-printer', run:() => this.openDeliveryInvoice(row.id) },
          { label:'Hapus', icon:'i-trash', danger:true, show:row.status !== 'success', run:() => this.deleteDelivery(row) }
        ];
        case 'returns': return row.status === 'pending' ? [
          { label:'Proses Return', icon:'i-check', run:() => this.processReturn(row) },
          { label:'Batalkan', icon:'i-trash', danger:true, run:() => this.deleteReturn(row) }
        ] : [{ label:'Selesai', icon:'i-circle-check', disabled:true }];
        case 'customers': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openCustomer(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-customer', row.id, 'Hapus pelanggan?', 'Pelanggan ' + row.name + ' akan dihapus.') }
        ];
        case 'promos': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openPromo(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-promo', row.id, 'Hapus promo?', 'Promo ' + row.name + ' akan dihapus.') }
        ];
        case 'warehouses': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openWarehouse(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-warehouse', row.id, 'Hapus gudang?', 'Gudang ' + row.name + ' akan dihapus.') }
        ];
        case 'products': return [
          { label:'Edit Produk', icon:'i-pencil', run:() => this.openProduct(row) },
          { label:'Lihat Resep', icon:'i-box', run:() => this.openRecipePreview(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-product', row.id, 'Hapus produk?', 'Produk ' + row.name + ' akan dihapus.') }
        ];
        case 'product-categories':
        case 'material-categories': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openCategory(kind === 'product-categories' ? 'product' : 'material', row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteCategory(row) }
        ];
        case 'materials': {
          const used = this.productsUsingMaterial(row.id).length > 0;
          return [
            { label:'Edit', icon:'i-pencil', run:() => this.openMaterial(row) },
            { label:'Hapus', icon:'i-trash', danger:true, disabled:used, run:() => used ? null : this.deleteMaterial(row) }
          ];
        }
        case 'suppliers': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openSupplier(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteSupplier(row) }
        ];
        case 'purchase-requests': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewPR(row) },
          { label:'Preview A4', icon:'i-printer', run:() => this.startPRPreview(row) },
          { label:'Buat PO', icon:'i-file', show:['approved','processing'].includes(row.status), run:() => this.openPOCreate(row) },
          { label:'Edit Draft', icon:'i-pencil', show:row.status === 'draft', run:() => this.startPREdit(row) },
          { label:'Submit', icon:'i-send', show:row.status === 'draft', run:() => this.submitPR(row) },
          { label:'Setujui', icon:'i-check', show:this.canApprovePR && row.status === 'submitted' && row.requesterId !== this.currentUserId, run:() => this.approvePR(row) },
          { label:'Tolak', icon:'i-x', danger:true, show:this.canApprovePR && row.status === 'submitted' && row.requesterId !== this.currentUserId, run:() => this.openRejectPR(row) },
          { label:'Batalkan', icon:'i-trash', danger:true, show:['draft','submitted'].includes(row.status) && (row.requesterId === this.currentUserId || ['Admin','Manager'].includes(this.role)), run:() => this.cancelPR(row) }
        ];
        case 'purchase-orders': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewPO(row) },
          { label:'Preview A4', icon:'i-printer', run:() => this.startPOPreview(row) },
          { label:'Edit Draft', icon:'i-pencil', show:row.status === 'draft', run:() => this.startPOEdit(row) },
          { label:'Submit', icon:'i-send', show:row.status === 'draft', run:() => this.submitPO(row) },
          { label:'Setujui', icon:'i-check', show:this.canApprovePO && row.status === 'pending_approval' && row.createdById !== this.currentUserId, run:() => this.approvePO(row) },
          { label:'Tolak', icon:'i-x', danger:true, show:this.canApprovePO && row.status === 'pending_approval' && row.createdById !== this.currentUserId, run:() => this.openRejectPO(row) },
          { label:'Tandai Terkirim', icon:'i-send', show:row.status === 'approved', run:() => this.sendPO(row) },
          { label:'Terima Barang', icon:'i-truck', show:['approved','sent','partially_received'].includes(row.status), run:() => this.openReceiptCreate(row) },
          { label:'Batalkan', icon:'i-trash', danger:true, show:['draft','pending_approval','approved'].includes(row.status), run:() => this.cancelPO(row) }
        ];
        case 'coa': return row.isSystem ? [{ label:'Akun terkunci', icon:'i-shield', disabled:true }] : [
          { label:'Edit', icon:'i-pencil', run:() => this.openAccount(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteAccount(row) }
        ];
        case 'journals': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewJournal(row) },
          { label:'Edit Draft', icon:'i-pencil', show:row.status === 'draft', run:() => this.startJournalEdit(row) },
          { label:'Posting', icon:'i-check', show:row.status === 'draft', run:() => this.postJournal(row) },
          { label:'Void', icon:'i-x', danger:true, show:row.status === 'posted' && this.canVoidJournal && row.source === 'manual', run:() => this.voidJournal(row) },
          { label:'Hapus', icon:'i-trash', danger:true, show:row.status === 'draft', run:() => this.deleteJournal(row) }
        ];
        case 'receipts': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewReceipt(row) },
          { label:'Riwayat', icon:'i-clock', run:() => this.viewReceiptHistory(row) },
          { label:'Preview A4', icon:'i-printer', run:() => this.startReceiptPreview(row) },
          { label:'Edit Draft', icon:'i-pencil', show:row.status === 'draft', run:() => this.startReceiptEdit(row) },
          { label:'Posting', icon:'i-check', show:row.status === 'draft', run:() => this.postReceipt(row) },
          { label:'Hapus', icon:'i-trash', danger:true, show:row.status === 'draft', run:() => this.deleteReceipt(row) }
        ];
        case 'purchase-returns': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewPurchaseReturn(row) },
          { label:'Terima Ganti Barang', icon:'i-box', show:row.status === 'posted' && row.replacementStatus === 'pending', run:() => this.receivePurchaseReturnReplacement(row) },
          { label:'Batalkan', icon:'i-trash', danger:true, show:row.status === 'posted', run:() => this.voidPurchaseReturn(row) }
        ];
        case 'payables': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewPayable(row) },
          { label:'Bayar Utang', icon:'i-banknote-down', show:Number(row.unpaid) > 0, run:() => this.openPayablePayment(row) }
        ];
        case 'finance': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openFinance(this.financeTab, row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-finance', row.id, 'Hapus transaksi?', 'Transaksi ' + row.code + ' akan dihapus dan jurnalnya di-void.') }
        ];
        case 'receivables': return [{ label:'Lihat Invoice', icon:'i-printer', run:() => this.viewInvoice(row.orderId) }];
        case 'collections': return [{ label:row.status === 'success' ? 'Lihat' : 'Konfirmasi', icon:'i-check', run:() => this.startCollection(row) }];
        case 'users': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openUser(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-user', row.id, 'Hapus pengguna?', 'Akun ' + row.name + ' akan dihapus.') }
        ];
        case 'roles': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openRole(row) },
          { label:'Hapus', icon:'i-trash', danger:true, run:() => this.askConfirm('delete-role', row.id, 'Hapus role?', 'Role ' + row.name + ' akan dihapus.') }
        ];
        case 'stock-history': return row.refType === 'production'
          ? [{ label:'Lihat Produksi', icon:'i-eye', run:() => this.openProductionByRef(row.refId) }]
          : [{ label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteStockHistory(row) }];
        case 'opnames': return [{ label:'Hapus', icon:'i-trash', danger:true, run:() => this.deleteOpname(row) }];
        case 'productions': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewProduction(row) },
          { label:'Koreksi', icon:'i-pencil', show:this.canCorrectProduction, run:() => this.openProductionCorrection(row) }
        ];
        case 'employees': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openEmployee(row) },
          { label:row.status ? 'Nonaktifkan' : 'Aktifkan', icon:row.status ? 'i-x' : 'i-check', run:() => this.toggleEmployeeStatus(row) }
        ];
        case 'hpp-bulanan': return [
          { label:'Lihat Detail', icon:'i-eye', run:() => this.viewHppBulanan(row) },
          { label:'Revisi', icon:'i-refresh', show:row.status === 'final', run:() => this.openHppBulananRevision(row) },
          { label:'Terapkan ke Harga Modal', icon:'i-check', show:row.status === 'final', run:() => this.askHppBulananApply(row) },
          { label:'Hapus Draft', icon:'i-trash', danger:true, show:row.status === 'draft', run:() => this.deleteHppBulanan(row) }
        ];
        case 'bank-accounts': return [
          { label:'Edit', icon:'i-pencil', run:() => this.openBankAccount(row) },
          { label:row.status ? 'Nonaktifkan' : 'Aktifkan', icon:row.status ? 'i-x' : 'i-check', run:() => this.toggleBankAccount(row) },
          { label:'Hapus', icon:'i-trash', danger:true, show:!this.accountUsed(row.id), run:() => this.deleteBankAccount(row) }
        ];
        default: return [];
      }
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
      if (order && order.costAtOrder !== undefined) return Number(order.costAtOrder) || 0;
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

      if (action === 'save-pr-form') {
        this.savePR(id === 'submit', true);
      }
      if (action === 'submit-pr') {
        const pr = this.purchaseRequests.find(item => item.id === id);
        if (pr) this.submitPR(pr, true);
      }
      if (action === 'save-po-form') {
        this.savePO(id === 'submit', true);
      }
      if (action === 'submit-po') {
        const po = this.purchaseOrders.find(item => item.id === id);
        if (po) this.submitPO(po, true);
      }
      if (action === 'save-receipt-form') {
        this.saveReceipt(id === 'post', true);
      }
      if (action === 'save-journal-form') {
        this.saveJournal(id === 'post', true);
      }
      if (action === 'post-opening') {
        this.saveOpeningBalance();
      }
      if (action === 'void-opening') {
        const journal = this.journals.find(item => item.id === id && item.source === 'opening');
        if (journal && journal.status === 'posted') {
          journal.status = 'void';
          journal.voidReason = 'Void saldo awal';
          journal.history = journal.history || [];
          journal.history.push({ action:'void', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Void saldo awal' });
          this.notify('Saldo awal berhasil di-void');
        }
      }
      if (action === 'hpp-copy-monthly') {
        this.applyHppMonthlyCopy(id);
      }
      if (action === 'hpp-finalize') {
        this.persistHppFinal();
      }
      if (action === 'hpp-apply') {
        this.applyHppCost(id);
      }
      if (action === 'hpp-delete') {
        const row = this.hppHarian.find(item => item.id === id);
        if (row && row.status === 'draft') {
          this.hppHarian = this.hppHarian.filter(item => item.id !== id);
          this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:id, action:'delete', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Draft dihapus' });
          this.notify('Draft HPP dihapus');
        }
      }
      if (action === 'hpp-bulanan-finalize') {
        this.persistHppBulananFinal();
      }
      if (action === 'hpp-bulanan-delete') {
        const row = (this.hppBulanan || []).find(item => item.id === id);
        if (row && row.status === 'draft') {
          this.hppBulanan = this.hppBulanan.filter(item => item.id !== id);
          this.notify('Draft HPP Bulanan dihapus');
        }
      }
      if (action === 'hpp-bulanan-apply') {
        this.applyHppBulananCost(id);
      }
      if (action === 'save-purchase-return') {
        this.savePurchaseReturn(true);
      }
      if (action === 'save-payable-payment') {
        this.savePayablePayment(true);
      }
      if (action === 'save-production') {
        this.saveProduction(true);
      }
      if (action === 'save-product') {
        this.saveProduct(true);
      }
      if (action === 'save-profile') {
        this.saveProfile(true);
      }
      if (action === 'save-password') {
        this.savePassword(true);
      }
      if (action === 'order-stock-shortage') {
        this.orderStockOverride = true;
        this.orderPreviewOpen = true;
      }

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
        const used = this.purchaseRequests.some(pr => (pr.items || []).some(item => item.materialId === id))
          || this.purchaseOrders.some(po => (po.items || []).some(item => item.materialId === id))
          || this.recipes.some(recipe => recipe.materialId === id)
          || this.productions.some(production => (production.materials || []).some(item => item.materialId === id));
        if (used) {
          this.notify('Barang masih dipakai pada transaksi pembelian atau resep produk', 'error');
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
        pr.history.push({ action:'approved', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
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
        pr.history.push({ action:'cancelled', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
        this.notify('Purchase Request ' + pr.code + ' dibatalkan');
      }
      if (action === 'receive-return-replacement') {
        const purchaseReturn = this.purchaseReturns.find(item => item.id === id);
        if (!purchaseReturn || purchaseReturn.status !== 'posted' || purchaseReturn.replacementStatus !== 'pending') {
          this.notify('Return ini tidak menunggu ganti barang', 'error');
          this.confirm.open = false;
          return;
        }
        this.postPurchaseReturnReplacement(purchaseReturn);
      }
      if (action === 'void-purchase-return') {
        const purchaseReturn = this.purchaseReturns.find(item => item.id === id);
        if (!purchaseReturn || purchaseReturn.status !== 'posted') {
          this.notify('Return pembelian tidak dapat dibatalkan', 'error');
          this.confirm.open = false;
          return;
        }
        this.voidPurchaseReturnDocument(purchaseReturn);
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
        po.history.push({ action:'approved', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
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
        po.history.push({ action:'cancelled', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
        this.syncPRStatusForPO(po);
        this.poDetailOpen = false;
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
      if (action === 'delete-bank-account') {
        const account = this.accountById(id);
        if (!account.id || this.accountUsed(id)) {
          this.notify('Rekening tidak dapat dihapus', 'error');
          this.confirm.open = false;
          return;
        }
        this.accounts = this.accounts.filter(item => item.id !== id);
        this.notify('Rekening berhasil dihapus');
      }
      if (action === 'bank-transfer') {
        this.saveBankTransfer(true);
      }
      if (action === 'delete-attendance-note') {
        this.attendanceNotes = (this.attendanceNotes || []).filter(note => note.id !== id);
        this.persist();
        this.notify('Keterangan absensi dihapus');
      }
      if (action === 'payroll-finalize') {
        this.commitPayrollFinal();
      }
      if (action === 'payroll-send-hpp') {
        this.sendPayrollToHpp(true);
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
        journal.history.push({ action:'posted', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
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
        const usedInProduction = this.productions.some(p => p.productId === id);
        if (usedInOrder || usedInPromo || usedInProduction) {
          this.notify('Produk masih dipakai pada order/promo/produksi', 'error');
          this.confirm.open = false;
          return;
        }
        this.products = this.products.filter(p => p.id !== id);
        this.recipes = this.recipes.filter(recipe => recipe.productId !== id);
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
        const opname = this.opnames.find(o => o.id === id);
        if (opname) {
          if (opname.materialId) {
            const material = this.material(opname.materialId);
            const unitCost = Number(opname.unitCost) || Number(material.avgCost) || Number(material.purchasePrice) || 0;
            material.stock = Math.max(0, (Number(material.stock) || 0) - opname.qty);
            material.stockValue = Math.max(0, (Number(material.stockValue) || 0) - opname.qty * unitCost);
            material.avgCost = material.stock > 0 ? material.stockValue / material.stock : unitCost;
            this.stockMovements = this.stockMovements.filter(movement => !(movement.refType === 'opname' && movement.refId === opname.id));
          } else {
            const product = this.product(opname.productId);
            if (product.id) product.stock = Math.max(0, (Number(product.stock) || 0) - opname.qty);
          }
          this.opnames = this.opnames.filter(o => o.id !== id);
          this.notify('Opname dihapus dan stok dikembalikan');
        }
      }
      if (action === 'seed-dummy') {
        this.closeModals();
        this.seedDummyData();
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
        this.purchaseReturns = [];
        this.stockMovements = [];
        this.productions = [];
        this.productionLogs = [];
        this.attendanceScans = [];
        this.attendanceNotes = [];
        this.attendanceBatches = [];
        this.payrolls = [];
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
        this.purchaseReturnForm = { date:todayISO(), poId:'', warehouseId:'', notes:'', items:[] };
        this.purchaseReturnDetailOpen = false;
        this.purchaseReturnSelectedId = null;
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
      const scope = this.role === 'Sales' ? this.currentUser : '';
      const inScope = order => !scope || order.sales === scope;
      const orders = this.orders.filter(inScope);
      const orderIds = new Set(orders.map(order => order.id));
      const deliveries = scope ? this.deliveries.filter(d => (d.orderIds || []).some(id => orderIds.has(id))) : this.deliveries;
      const returns = scope ? this.returns.filter(r => orderIds.has(r.orderId)) : this.returns;
      const collections = scope ? this.collections.filter(c => c.sales === scope) : this.collections;
      const delivery = {
        pending: deliveries.filter(d => d.status === 'pending').length,
        partial: deliveries.filter(d => d.status === 'shipping').length,
        success: deliveries.filter(d => d.status === 'success').length
      };
      const billing = {
        pending: collections.filter(c => c.status !== 'success').length,
        success: collections.filter(c => c.status === 'success').length
      };
      const invoice = {
        pending: orders.filter(o => o.status === 'pending').length,
        ready: orders.filter(o => o.status === 'already').length,
        shipping: orders.filter(o => o.status === 'shipping').length,
        partial: orders.filter(o => o.payment === 'partial').length,
        success: orders.filter(o => o.status === 'success').length,
        cancel: orders.filter(o => o.status === 'cancel').length
      };
      const returnsSummary = {
        pending: returns.filter(r => r.status === 'pending').length,
        return: returns.filter(r => r.status === 'return').length,
        discard: returns.filter(r => r.status === 'discard').length
      };
      return { delivery, billing, invoice, return:returnsSummary };
    },
    get dashboardAccess() {
      return {
        finance: this.canAccessPage('journals') || this.canAccessPage('finance-income') || this.canAccessPage('finance-expense'),
        recap: this.canAccessPage('orders') || this.canAccessPage('receivables'),
        operations: this.canAccessPage('orders'),
        receivables: this.canAccessPage('receivables'),
        stock: this.canAccessPage('stock'),
        pr: this.canAccessPage('purchase-requests'),
        po: this.canAccessPage('purchase-orders'),
        receipts: this.canAccessPage('receipts'),
        accounting: this.canAccessPage('journals'),
        users: this.canAccessPage('users'),
        customers: this.canAccessPage('customers')
      };
    },
    get dashboardScopeLabel() {
      if (this.role === 'Sales') return 'Data Saya';
      if (this.role === 'Supervisor') return 'Operasional';
      if (this.role === 'Logistik') return 'Logistik';
      return 'Semua Data';
    },
    get orderMonthStats() {
      const key = todayISO().slice(0, 7);
      const rows = this.orders.filter(o =>
        String(o.date || o.schedule || '').slice(0, 7) === key && !['cancel','failed'].includes(o.status)
      );
      return {
        count: rows.length,
        value: rows.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
        pending: rows.filter(o => o.status === 'pending').length,
        shipping: rows.filter(o => o.status === 'shipping').length,
        success: rows.filter(o => o.status === 'success').length
      };
    },
    get salesDashboardStats() {
      const scope = this.currentUser;
      const key = todayISO().slice(0, 7);
      const rows = this.orders.filter(o =>
        o.sales === scope
        && String(o.date || o.schedule || '').slice(0, 7) === key
        && !['cancel','failed'].includes(o.status)
      );
      return {
        orders: rows.length,
        revenue: rows.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
      };
    },
    get myVisitsToday() {
      const day = this.weekdayName(todayISO());
      return this.customers.filter(c => c.sales === this.currentUser && c.day === day);
    },
    get stockDashboardStats() {
      const key = todayISO().slice(0, 7);
      const posted = this.productions.filter(p =>
        String(p.date || '').slice(0, 7) === key && p.status === 'posted'
      );
      return {
        lowProducts: this.lowStock.length,
        lowMaterials: this.lowStockMaterials.length,
        productionMonth: posted.length,
        totalProducts: this.products.length,
        totalMaterials: this.materials.length
      };
    },
    get receiptDashboardStats() {
      return {
        draft: this.receipts.filter(r => r.status === 'draft').length,
        posted: this.receipts.filter(r => r.status === 'posted').length,
        total: this.receipts.length
      };
    },
    get userDashboardStats() {
      return {
        active: this.users.length,
        roles: this.roles.length
      };
    },
    get dashboardKpis() {
      const money = v => this.rp(Number(v) || 0);
      const count = v => this.fmt(Number(v) || 0);
      const deltaText = v => this.signed(v) + '% dari bulan lalu';
      const deltaClass = v => Number(v) >= 0 ? 'text-emerald-600' : 'text-red-600';
      const s = this.summary;
      const incomeKpi = { label:'Pendapatan', value:money(s.income), icon:'i-trending-up', iconClass:'text-emerald-500', sub:deltaText(s.incomeDelta), subClass:deltaClass(s.incomeDelta) };
      const netKpi = { label:'Laba Bersih', value:money(s.net), icon:'i-file', iconClass:'text-blue-500', sub:deltaText(s.netDelta), subClass:deltaClass(s.netDelta) };
      const receivableKpi = { label:'Piutang', value:money(s.receivable), icon:'i-wallet', iconClass:'text-amber-500', sub:'belum tertagih', subClass:'text-amber-600' };
      const payableKpi = { label:'Utang', value:money(this.payableUnpaidTotal), icon:'i-coins', iconClass:'text-red-500', sub:'sisa utang supplier', subClass:'text-red-500' };
      const prKpi = { label:'PR Menunggu', value:count(this.prStats.submitted), icon:'i-clipboard', iconClass:'text-indigo-500', sub:'menunggu approval', subClass:'text-amber-600' };
      const orderKpi = { label:'Order Bulan Ini', value:count(this.orderMonthStats.count), icon:'i-cart', iconClass:'text-blue-500', sub:'order tercatat', subClass:'text-slate-400' };
      const deliveryKpi = { label:'Surat Jalan', value:count(this.info.delivery.pending), icon:'i-truck', iconClass:'text-purple-500', sub:'belum diproses', subClass:'text-amber-600' };
      const lowStockKpi = { label:'Stock Menipis', value:count(this.stockDashboardStats.lowProducts), icon:'i-boxes', iconClass:'text-red-500', sub:'produk di bawah minimum', subClass:'text-red-500' };
      const lowMaterialKpi = { label:'Bahan Menipis', value:count(this.stockDashboardStats.lowMaterials), icon:'i-box', iconClass:'text-amber-500', sub:'bahan baku di bawah minimum', subClass:'text-amber-600' };
      const receiptKpi = { label:'Penerimaan Draft', value:count(this.receiptDashboardStats.draft), icon:'i-truck', iconClass:'text-teal-500', sub:'belum diposting', subClass:'text-slate-400' };
      const salesRevenueKpi = { label:'Nilai Order Saya', value:money(this.salesDashboardStats.revenue), icon:'i-trending-up', iconClass:'text-emerald-500', sub:'bulan ini', subClass:'text-slate-400' };
      const salesOrderKpi = { label:'Order Saya', value:count(this.salesDashboardStats.orders), icon:'i-cart', iconClass:'text-blue-500', sub:'bulan ini', subClass:'text-slate-400' };
      const salesCustomerKpi = { label:'Pelanggan Saya', value:count(this.customers.filter(c => c.sales === this.currentUser).length), icon:'i-users', iconClass:'text-sky-500', sub:'pelanggan terdaftar', subClass:'text-slate-400' };
      const visitsKpi = { label:'Kunjungan Hari Ini', value:count(this.myVisitsToday.length), icon:'i-calendar', iconClass:'text-blue-500', sub:'jadwal hari ini', subClass:'text-slate-400' };
      const map = {
        Admin: [incomeKpi, netKpi, receivableKpi, payableKpi],
        Manager: [incomeKpi, netKpi, receivableKpi, prKpi],
        Developer: [incomeKpi, netKpi, receivableKpi, prKpi],
        Supervisor: [orderKpi, deliveryKpi, receivableKpi, lowStockKpi],
        Sales: [salesRevenueKpi, salesOrderKpi, salesCustomerKpi, visitsKpi],
        Logistik: [lowStockKpi, lowMaterialKpi, prKpi, receiptKpi]
      };
      if (map[this.role]) return map[this.role];
      if (this.dashboardAccess.finance) return [incomeKpi, netKpi, receivableKpi, payableKpi];
      if (this.dashboardAccess.operations) return [orderKpi, deliveryKpi, receivableKpi, lowStockKpi];
      return [lowStockKpi, lowMaterialKpi, prKpi, receiptKpi];
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
      const sales = this.role === 'Sales' ? this.currentUser : this.dashboardSales;
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
    recipePreviewOpen: false, recipePreviewProductId: null,
    formPicker: { open:false, kind:'category', target:'product', query:'', top:0, left:0, width:280 },
    productForm: { name:'', categoryId:'cat1', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, minStock:20, status:true, recipe:[] },
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
        ? {
            name:p.name, categoryId:p.categoryId || '', unit:p.unit, cost:p.cost, inSale:p.inSale, outSale:p.outSale,
            stock:p.stock, minStock:p.minStock || 0, status:p.status,
            recipe:this.recipeRows(p.id).map(row => ({
              materialId:row.materialId,
              qtyPerUnit:row.qtyPerUnit,
              materialOpen:false,
              materialSearch:''
            }))
          }
        : { name:'', categoryId:this.productCategories[0]?.id || '', unit:'Krt', cost:0, inSale:0, outSale:0, stock:0, minStock:20, status:true, recipe:[] };
      this.productModalOpen = false;
      this.go('product-create');
    },
    recipeRows(productId) {
      return this.recipes.filter(recipe => recipe.productId === productId);
    },
    recipeCount(productId) { return this.recipeRows(productId).length; },
    recipeMaterial(materialId) { return this.materials.find(material => material.id === materialId) || {}; },
    recipeLineSubtotal(row) {
      const material = this.recipeMaterial(row.materialId);
      return (Number(row.qtyPerUnit) || 0) * (Number(material.purchasePrice) || 0);
    },
    get recipeEstimatedCost() {
      return (this.productForm.recipe || []).reduce((sum, row) => sum + this.recipeLineSubtotal(row), 0);
    },
    recipeMaterialOptions(index) {
      const row = (this.productForm.recipe || [])[index] || {};
      const selectedElsewhere = (this.productForm.recipe || [])
        .filter((item, itemIndex) => itemIndex !== index)
        .map(item => item.materialId)
        .filter(Boolean);
      const query = String(row.materialSearch || '').toLowerCase();
      return this.materials.filter(material => {
        if (!material.status) return false;
        if (selectedElsewhere.includes(material.id)) return false;
        if (!query) return true;
        return (material.code + ' ' + material.name + ' ' + material.unit).toLowerCase().includes(query);
      });
    },
    selectRecipeMaterial(index, material) {
      const row = (this.productForm.recipe || [])[index];
      if (!row) return;
      row.materialId = material.id;
      row.materialOpen = false;
      row.materialSearch = '';
    },
    addRecipeLine() {
      this.productForm.recipe = this.productForm.recipe || [];
      this.productForm.recipe.push({ materialId:'', qtyPerUnit:1, materialOpen:false, materialSearch:'' });
    },
    removeRecipeLine(index) {
      this.productForm.recipe.splice(index, 1);
    },
    productsUsingMaterial(materialId) {
      const productIds = [...new Set(this.recipes.filter(recipe => recipe.materialId === materialId).map(recipe => recipe.productId))];
      return this.products.filter(product => productIds.includes(product.id));
    },
    openRecipePreview(product) {
      this.recipePreviewProductId = product.id;
      this.recipePreviewOpen = true;
    },
    get recipePreviewProduct() { return this.product(this.recipePreviewProductId) || {}; },
    saveProduct(confirmed = false) {
      if (!this.productForm.name) { this.notify('Nama produk wajib diisi', 'error'); return; }
      const recipeRows = (this.productForm.recipe || []).filter(row => row.materialId);
      const invalidRow = recipeRows.find(row => Number(row.qtyPerUnit) <= 0);
      if (invalidRow) { this.notify('Qty resep harus lebih dari 0', 'error'); return; }
      const duplicate = recipeRows.map(row => row.materialId).find((id, index, list) => list.indexOf(id) !== index);
      if (duplicate) { this.notify('Barang tidak boleh dobel dalam satu resep', 'error'); return; }
      if (!confirmed) {
        this.askSave('save-product', this.productEditId, 'Produk ' + this.productForm.name + ' akan disimpan' + (recipeRows.length ? ' dengan ' + recipeRows.length + ' bahan resep.' : ' tanpa resep.'), 'Simpan');
        return;
      }
      const { recipe, ...base } = this.productForm;
      const data = {
        ...base,
        categoryId:this.productForm.categoryId || null,
        cost:Number(this.productForm.cost),
        inSale:Number(this.productForm.inSale),
        outSale:Number(this.productForm.outSale),
        stock:Number(this.productForm.stock),
        minStock:Number(this.productForm.minStock) || 0,
        status:!!this.productForm.status
      };
      let productId = this.productEditId;
      if (this.productEditId) {
        const prod = this.products.find(p => p.id === this.productEditId);
        if (prod) Object.assign(prod, data);
        this.notify('Produk berhasil diperbarui');
      } else {
        productId = 'p' + Date.now();
        this.products.push({ id:productId, code:nextSimpleCode(this.products, 'ABI-'), ...data });
        this.notify('Produk baru berhasil ditambahkan');
      }
      this.recipes = this.recipes.filter(item => item.productId !== productId);
      recipeRows.forEach((row, index) => {
        this.recipes.push({
          id:'rec' + Date.now() + index,
          productId,
          materialId:row.materialId,
          qtyPerUnit:Number(row.qtyPerUnit) || 0
        });
      });
      this.productModalOpen = false;
      this.persist();
      this.go('products');
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
      const used = this.purchaseRequests.some(pr => (pr.items || []).some(item => item.materialId === material.id))
        || this.purchaseOrders.some(po => (po.items || []).some(item => item.materialId === material.id))
        || this.purchaseReturns.some(pr => (pr.items || []).some(item => item.materialId === material.id))
        || this.recipes.some(recipe => recipe.materialId === material.id);
      if (used) { this.notify('Barang masih dipakai pada transaksi pembelian atau resep produk', 'error'); return; }
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
      return { draft:'Draft', submitted:'Diajukan', approved:'Disetujui', processing:'Proses', completed:'Selesai', rejected:'Ditolak', cancelled:'Dibatalkan' }[status] || status;
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
    savePR(submit = false, confirmed = false) {
      if (!this.prForm.purpose.trim()) { this.notify('Keperluan PR wajib diisi', 'error'); return; }
      const items = (this.prForm.items || [])
        .filter(item => item.materialId && Number(item.qty) > 0)
        .map(item => ({ materialId:item.materialId, qty:Number(item.qty), note:item.note || '', orderedQty:0 }));
      if (!items.length) { this.notify('Tambahkan minimal 1 barang dengan qty lebih dari 0', 'error'); return; }
      const duplicates = items.map(item => item.materialId).filter((id, index, list) => list.indexOf(id) !== index);
      if (duplicates.length) { this.notify('Barang yang sama tidak boleh dipilih dua kali', 'error'); return; }
      const invalid = items.find(item => !this.materials.some(m => m.id === item.materialId && m.status));
      if (invalid) { this.notify('Barang tidak aktif atau tidak ditemukan', 'error'); return; }
      if (!confirmed) {
        const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
        this.askSave(
          'save-pr-form',
          submit ? 'submit' : 'draft',
          (submit ? 'PR akan diajukan untuk approval Manager.' : 'Draft PR akan disimpan.') + ' ' + items.length + ' barang • total qty ' + this.fmt(totalQty) + '.',
          submit ? 'Submit' : 'Simpan'
        );
        return;
      }
      const now = todayISO();
      if (this.prEditId) {
        const pr = this.purchaseRequests.find(item => item.id === this.prEditId);
        if (!pr || pr.status !== 'draft') { this.notify('PR ini tidak dapat diedit', 'error'); return; }
        pr.date = this.prForm.date || now;
        pr.purpose = this.prForm.purpose.trim();
        pr.items = items;
        if (submit) {
          pr.status = 'submitted';
          pr.history.push({ action:'submitted', by:this.currentUser, byRole:this.role, at:now, note:'' });
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
          history:[{ action:submit ? 'submitted' : 'draft', by:this.currentUser, byRole:this.role, at:now, note:'' }],
          rejectReason:''
        };
        this.purchaseRequests.unshift(pr);
        this.prSelectedId = pr.id;
        this.notify(submit ? 'PR berhasil disubmit' : 'Draft PR berhasil dibuat');
      }
      this.persist();
      this.go('purchase-requests');
    },
    submitPR(pr, confirmed = false) {
      if (pr.status !== 'draft') { this.notify('Hanya PR draft yang dapat diajukan', 'error'); return; }
      if (pr.requesterId !== this.currentUserId && !['Admin','Manager'].includes(this.role)) {
        this.notify('Anda tidak berhak mengajukan PR ini', 'error');
        return;
      }
      if (!confirmed) {
        this.askSave('submit-pr', pr.id, 'PR ' + pr.code + ' akan diajukan untuk approval Manager.', 'Submit');
        return;
      }
      pr.status = 'submitted';
      pr.history = pr.history || [];
      pr.history.push({ action:'submitted', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
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
    printBulkInvoice() {
      const styleId = 'bulk-invoice-page-style';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = '@page { size: A5 landscape; margin: 6mm; }';
        document.head.appendChild(style);
      }
      document.body.classList.add('print-pr', 'print-invoice-a5');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-pr', 'print-invoice-a5');
        const current = document.getElementById(styleId);
        if (current) current.remove();
      }, 300);
    },
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
      pr.history.push({ action:'rejected', by:this.currentUser, byRole:this.role, at:todayISO(), note:pr.rejectReason });
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
    poForm: { date:todayISO(), supplierId:'', prId:'', paymentTerms:'', notes:'', items:[{ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' }], additionalCosts:[] },
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
    poTotal(poId) { const po = this.purchaseOrders.find(item => item.id === poId); return Number(po?.total) || 0; },
    poStatusBadge(status) {
      return { draft:'badge-slate', pending_approval:'badge-yellow', approved:'badge-green', sent:'badge-blue', partially_received:'badge-cyan', fully_received:'badge-green', closed:'badge-stone', rejected:'badge-red', cancelled:'badge-red' }[status] || 'badge-slate';
    },
    poStatusLabel(status) {
      return { draft:'Draft', pending_approval:'Menunggu Approval', approved:'Disetujui', sent:'Dikirim', partially_received:'Diterima Sebagian', fully_received:'Diterima Penuh', closed:'Ditutup', rejected:'Ditolak', cancelled:'Dibatalkan' }[status] || status;
    },
    poLineSubtotal(item) { return (Number(item.qty) || 0) * (Number(item.price) || 0); },
    poAdditionalSubtotal(row) { return (Number(row.amount) || 0) * (Number(row.qty) || 0); },
    get poAdditionalTotal() {
      return (this.poForm.additionalCosts || []).reduce((sum, row) => sum + this.poAdditionalSubtotal(row), 0);
    },
    get poGrandTotal() { return this.poSubtotal + this.poAdditionalTotal; },
    addPOAdditionalCost() {
      this.poForm.additionalCosts = this.poForm.additionalCosts || [];
      this.poForm.additionalCosts.push({ description:'', amount:0, qty:1 });
    },
    removePOAdditionalCost(index) {
      this.poForm.additionalCosts.splice(index, 1);
    },
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
          items,
          additionalCosts:[]
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
          items:[{ materialId:'', qty:1, price:0, materialOpen:false, materialSearch:'' }],
          additionalCosts:[]
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
        })),
        additionalCosts:(po.additionalCosts || []).map(row => ({ description:row.description || '', amount:Number(row.amount) || 0, qty:Number(row.qty) || 1 }))
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
      const additionalRows = (this.poForm.additionalCosts || []).filter(row => String(row.description || '').trim() || Number(row.amount) > 0);
      for (const row of additionalRows) {
        if (!String(row.description || '').trim()) return 'Keterangan biaya tambahan wajib diisi';
        if (Number(row.amount) <= 0) return 'Nominal biaya tambahan harus lebih dari 0';
        if (Number(row.qty) <= 0) return 'Qty biaya tambahan harus lebih dari 0';
      }
      return null;
    },
    savePO(submit = false, confirmed = false) {
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
      const materialTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const additionalCosts = (this.poForm.additionalCosts || [])
        .filter(row => String(row.description || '').trim() || Number(row.amount) > 0)
        .map(row => ({
          description:String(row.description || '').trim(),
          amount:Number(row.amount) || 0,
          qty:Number(row.qty) || 0,
          subtotal:this.poAdditionalSubtotal(row)
        }));
      const additionalTotal = additionalCosts.reduce((sum, row) => sum + row.subtotal, 0);
      const total = materialTotal + additionalTotal;
      if (!confirmed) {
        this.askSave(
          'save-po-form',
          submit ? 'submit' : 'draft',
          (submit ? 'PO akan disubmit untuk approval Manager.' : 'Draft PO akan disimpan.') + ' ' + this.supplierName(this.poForm.supplierId) + ' • ' + items.length + ' barang • total ' + this.rp(total) + '.',
          submit ? 'Submit' : 'Simpan'
        );
        return;
      }
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
        po.additionalCosts = additionalCosts;
        po.additionalTotal = additionalTotal;
        po.subtotal = materialTotal;
        po.total = total;
        if (submit) {
          po.status = 'pending_approval';
          po.history.push({ action:'submitted', by:this.currentUser, byRole:this.role, at:now, note:'' });
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
          additionalCosts,
          additionalTotal,
          subtotal:materialTotal,
          total,
          createdBy:this.currentUser,
          createdById:this.currentUserId,
          history:[{ action:submit ? 'submitted' : 'draft', by:this.currentUser, byRole:this.role, at:now, note:'' }],
          rejectReason:''
        };
        this.purchaseOrders.unshift(po);
        this.poSelectedId = po.id;
        this.notify(submit ? 'PO berhasil dibuat dan disubmit' : 'Draft PO berhasil dibuat');
      }
      const relatedPR = this.purchaseRequests.find(pr => pr.id === this.poForm.prId);
      if (relatedPR) this.updatePRStatus(relatedPR);
      this.persist();
      this.go('purchase-orders');
    },
    submitPO(po, confirmed = false) {
      if (po.status !== 'draft') { this.notify('Hanya PO draft yang dapat disubmit', 'error'); return; }
      this.poForm = {
        date:po.date, supplierId:po.supplierId, prId:po.prId || '',
        paymentTerms:po.paymentTerms, notes:po.notes,
        items:(po.items || []).map(item => ({ ...item })),
        additionalCosts:(po.additionalCosts || []).map(row => ({ ...row }))
      };
      const error = this.poValidationError(po.items || []);
      if (error) { this.notify(error, 'error'); return; }
      if (!confirmed) {
        this.askSave('submit-po', po.id, 'PO ' + po.code + ' akan disubmit untuk approval Manager.', 'Submit');
        return;
      }
      po.status = 'pending_approval';
      po.history = po.history || [];
      po.history.push({ action:'submitted', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
      if (po.prId) {
        const pr = this.purchaseRequests.find(item => item.id === po.prId);
        if (pr) this.updatePRStatus(pr);
      }
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
      po.history.push({ action:'rejected', by:this.currentUser, byRole:this.role, at:todayISO(), note:po.rejectReason });
      this.syncPRStatusForPO(po);
      this.poRejectOpen = false;
      this.persist();
      this.notify('PO ditolak');
    },
    sendPO(po) {
      if (po.status !== 'approved') { this.notify('Hanya PO approved yang dapat dikirim', 'error'); return; }
      po.status = 'sent';
      po.sentAt = todayISO();
      po.history = po.history || [];
      po.history.push({ action:'sent', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
      this.syncPRStatusForPO(po);
      this.persist();
      this.notify('PO ditandai terkirim ke supplier');
    },
    closePO(po) {
      if (!['approved','sent','partially_received','fully_received'].includes(po.status)) { this.notify('PO ini tidak dapat ditutup', 'error'); return; }
      po.status = 'closed';
      po.closedAt = todayISO();
      po.history = po.history || [];
      po.history.push({ action:'closed', by:this.currentUser, byRole:this.role, at:todayISO(), note:'' });
      this.syncPRStatusForPO(po);
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
    purchaseRequestPOs(pr) {
      if (!pr || !pr.id) return [];
      return this.purchaseOrders.filter(po => po.prId === pr.id && !['rejected','cancelled'].includes(po.status));
    },
    poFullyReceived(po) {
      if (!po) return false;
      if (po.status === 'closed') return true;
      const items = po.items || [];
      return items.length > 0 && items.every(item => Number(item.receivedQty || 0) >= Number(item.qty || 0));
    },
    updatePRStatus(pr) {
      if (!pr || !['approved','processing','completed'].includes(pr.status)) return;
      const pos = this.purchaseRequestPOs(pr);
      if (!pos.length) {
        pr.status = 'approved';
        return;
      }
      pr.status = pos.every(po => this.poFullyReceived(po)) ? 'completed' : 'processing';
    },
    syncPRStatusForPO(po) {
      if (!po || !po.prId) return;
      const pr = this.purchaseRequests.find(item => item.id === po.prId);
      if (pr) this.updatePRStatus(pr);
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
      pr.history.push({ action:'po-approved', by:this.currentUser, byRole:this.role, at:todayISO(), note:po.code });
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
      pr.history.push({ action:'po-cancelled', by:this.currentUser, byRole:this.role, at:todayISO(), note:po.code });
    },
    updateMaterialPrices(po) {
      (po.items || []).forEach(poItem => {
        const material = this.materials.find(item => item.id === poItem.materialId);
        if (material) material.purchasePrice = Number(poItem.price) || 0;
      });
    },
    /* ---------- GOODS RECEIPT ---------- */
    receiptSearch: '', receiptStatus: '', receiptSupplier: '',
    receiptHistoryOpen: false, receiptHistoryId: null,
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
    saveReceipt(post = false, confirmed = false) {
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
      if (!confirmed) {
        this.askSave(
          'save-receipt-form',
          post ? 'post' : 'draft',
          (post ? 'Penerimaan akan diposting. Stok, jurnal, dan utang supplier akan dibuat otomatis.' : 'Draft penerimaan akan disimpan.') + ' ' + po.code + ' • ' + this.warehouseName(this.receiptForm.warehouseId) + ' • nilai diterima ' + this.rp(total) + '.',
          post ? 'Posting' : 'Simpan'
        );
        return;
      }
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
          additionalCost:0,
          apTotal:0,
          journalId:'',
          payableId:'',
          createdBy:this.currentUser,
          createdById:this.currentUserId,
          postedAt:'',
          history:[{ action:'draft', by:this.currentUser, byRole:this.role, at:now, note:'' }]
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
      this.askSave('post-receipt', receipt.id, 'Penerimaan ' + receipt.code + ' akan diposting. Stok, jurnal, dan utang supplier akan dibuat otomatis.', 'Posting');
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
      po.history.push({ action:'received', by:this.currentUser, byRole:this.role, at:now, note:receipt.code });
      this.syncPRStatusForPO(po);

      const poMaterialSubtotal = Number(po.subtotal) || (po.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
      const previousReceipts = this.receipts.filter(item => item.poId === po.id && item.status === 'posted' && item.id !== receipt.id);
      const previousMaterial = previousReceipts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      const previousAdditional = previousReceipts.reduce((sum, item) => sum + (Number(item.additionalCost) || 0), 0);
      let additionalCost = 0;
      if (Number(po.additionalTotal) > 0 && poMaterialSubtotal > 0) {
        const cumulativeMaterial = previousMaterial + (Number(receipt.total) || 0);
        additionalCost = cumulativeMaterial >= poMaterialSubtotal - 0.01
          ? Math.max(0, Number(po.additionalTotal) - previousAdditional)
          : Math.round(Number(po.additionalTotal) * (Number(receipt.total) || 0) / poMaterialSubtotal);
      }
      const apTotal = (Number(receipt.total) || 0) + additionalCost;
      receipt.additionalCost = additionalCost;
      receipt.apTotal = apTotal;
      const journalLines = [
        { accountId:'acc4', debit:receipt.total, credit:0, memo:'Persediaan ' + receipt.code }
      ];
      if (additionalCost > 0) {
        journalLines.push({ accountId:'acc14', debit:additionalCost, credit:0, memo:'Biaya tambahan PO ' + receipt.code });
      }
      journalLines.push({ accountId:'acc7', debit:0, credit:apTotal, memo:'Utang supplier ' + receipt.code });
      const journal = this.createSystemJournal({
        date:receipt.date,
        description:'Penerimaan barang ' + receipt.code,
        source:'receipt',
        sourceId:receipt.id,
        lines:journalLines
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
        total:apTotal,
        paid:0,
        unpaid:apTotal,
        status:'unpaid',
        payments:[],
        history:[{ action:'created', by:this.currentUser, byRole:this.role, at:now, note:receipt.code }]
      };
      this.payables.unshift(payable);
      receipt.status = 'posted';
      receipt.postedAt = now;
      receipt.journalId = journal ? journal.id : '';
      receipt.payableId = payable.id;
      receipt.history = receipt.history || [];
      receipt.history.push({ action:'posted', by:this.currentUser, byRole:this.role, at:now, note:'' });
      this.notify('Penerimaan ' + receipt.code + ' diposting');
    },
    dueDateFromTerms(terms, date) {
      const match = String(terms || '').match(/(\d+)/);
      return shiftISO(date || todayISO(), match ? Number(match[1]) : 0);
    },
    createSystemJournal({ date, description, source, sourceId, lines, by, byRole }) {
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
        postedBy:by || 'Sistem',
        postedAt:todayISO(),
        voidReason:'',
        createdBy:by || 'Sistem',
        history:[{ action:'posted', by:by || 'Sistem', byRole:byRole || 'System', at:todayISO(), note:'Jurnal otomatis' }]
      };
      this.journals.unshift(journal);
      return journal;
    },
    viewReceipt(receipt) { this.receiptSelectedId = receipt.id; this.receiptDetailOpen = true; },
    viewReceiptHistory(receipt) {
      this.receiptHistoryId = receipt.id;
      this.receiptHistoryOpen = true;
    },
    get selectedReceiptHistory() {
      return this.receipts.find(receipt => receipt.id === this.receiptHistoryId) || {};
    },
    receiptHistoryLabel(action) {
      return { draft:'Draft dibuat', posted:'Diposting', void:'Dibatalkan' }[action] || action;
    },
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

    /* ---------- PURCHASE RETURN ---------- */
    purchaseReturnSearch: '', purchaseReturnStatus: '',
    purchaseReturnDetailOpen: false, purchaseReturnSelectedId: null,
    purchaseReturnForm: { date:todayISO(), poId:'', warehouseId:'', notes:'', items:[] },
    get filteredPurchaseReturns() {
      const q = this.purchaseReturnSearch.toLowerCase();
      return this.purchaseReturns.filter(pr => {
        if (q && !(pr.code + ' ' + (pr.poCode || '') + ' ' + this.supplierName(pr.supplierId)).toLowerCase().includes(q)) return false;
        if (this.purchaseReturnStatus && pr.status !== this.purchaseReturnStatus) return false;
        return true;
      });
    },
    get selectedPurchaseReturn() {
      return this.purchaseReturns.find(pr => pr.id === this.purchaseReturnSelectedId) || this.purchaseReturns[0] || {};
    },
    get purchaseReturnSourcePO() {
      return this.purchaseOrders.find(po => po.id === this.purchaseReturnForm.poId) || null;
    },
    get purchaseReturnPOOptions() {
      return this.purchaseOrders.filter(po => {
        if (!['partially_received','fully_received','closed'].includes(po.status)) return false;
        return (po.items || []).some(item => this.purchaseReturnRemainingQty(item) > 0);
      });
    },
    get purchaseReturnFormQty() {
      return (this.purchaseReturnForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    },
    get purchaseReturnFormTotal() {
      return (this.purchaseReturnForm.items || []).reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
    },
    purchaseReturnStatusBadge(status) {
      return { posted:'badge-green', void:'badge-red' }[status] || 'badge-slate';
    },
    purchaseReturnStatusLabel(status) {
      return { posted:'Posted', void:'Void' }[status] || status;
    },
    purchaseReturnConditionLabel(condition) {
      return { good:'Bagus', damaged:'Rusak' }[condition] || condition;
    },
    purchaseReturnActionLabel(action) {
      return { replace:'Ganti Barang', credit:'Ganti Biaya' }[action] || action;
    },
    purchaseReturnRemainingQty(poItem) {
      return Math.max(0, Number(poItem.receivedQty || 0) - Number(poItem.returnedQty || 0));
    },
    purchaseReturnMaxQty(materialId) {
      const po = this.purchaseReturnSourcePO;
      if (!po) return 0;
      const item = (po.items || []).find(row => row.materialId === materialId);
      return item ? this.purchaseReturnRemainingQty(item) : 0;
    },
    purchaseReturnLineSubtotal(item) {
      return (Number(item.qty) || 0) * (Number(item.price) || 0);
    },
    purchaseReturnReceiptsFor(poId) {
      return this.receipts.filter(receipt => receipt.poId === poId && receipt.status === 'posted');
    },
    purchaseReturnWarehouseOptions() {
      const ids = [...new Set(this.purchaseReturnReceiptsFor(this.purchaseReturnForm.poId).map(receipt => receipt.warehouseId))];
      return this.warehouses.filter(warehouse => ids.includes(warehouse.id));
    },
    purchaseReturnWarehouseQty(materialId, warehouseId) {
      return this.stockMovements
        .filter(movement => movement.materialId === materialId && movement.warehouseId === warehouseId)
        .reduce((sum, movement) => sum + (Number(movement.qty) || 0), 0);
    },
    purchaseReturnReplaceCount(pr) {
      return (pr.items || []).filter(item => item.action === 'replace').length;
    },
    purchaseReturnCreditCount(pr) {
      return (pr.items || []).filter(item => item.action === 'credit').length;
    },
    onPurchaseReturnPOChange() {
      const po = this.purchaseReturnSourcePO;
      const receipts = this.purchaseReturnReceiptsFor(po?.id);
      this.purchaseReturnForm.warehouseId = receipts[0]?.warehouseId || this.warehouses[0]?.id || '';
      this.purchaseReturnForm.items = (po?.items || [])
        .filter(item => this.purchaseReturnRemainingQty(item) > 0)
        .map(item => ({
          materialId:item.materialId,
          qty:0,
          price:Number(item.price) || 0,
          condition:'damaged',
          action:'replace',
          note:''
        }));
    },
    openPurchaseReturnCreate() {
      const source = this.purchaseReturnPOOptions[0];
      if (!source) { this.notify('Belum ada PO yang memiliki barang untuk diretur', 'error'); return; }
      this.purchaseReturnForm = {
        date:todayISO(),
        poId:source.id,
        warehouseId:'',
        notes:'',
        items:[]
      };
      this.onPurchaseReturnPOChange();
      this.go('purchase-return-create');
    },
    purchaseReturnValidationError() {
      const po = this.purchaseReturnSourcePO;
      if (!po) return 'Purchase Order wajib dipilih';
      if (!this.purchaseReturnForm.warehouseId) return 'Gudang asal retur wajib dipilih';
      const rows = (this.purchaseReturnForm.items || []).filter(item => Number(item.qty) > 0);
      if (!rows.length) return 'Isi minimal 1 qty return';
      for (const item of rows) {
        const poItem = (po.items || []).find(row => row.materialId === item.materialId);
        if (!poItem) return 'Barang tidak ada pada PO sumber';
        if (Number(item.qty) > this.purchaseReturnRemainingQty(poItem)) {
          return 'Qty ' + this.materialName(item.materialId) + ' melebihi sisa yang dapat diretur';
        }
        if (!['good','damaged'].includes(item.condition)) return 'Kondisi barang wajib dipilih';
        if (!['replace','credit'].includes(item.action)) return 'Tindakan return wajib dipilih';
        const stock = this.purchaseReturnWarehouseQty(item.materialId, this.purchaseReturnForm.warehouseId);
        if (Number(item.qty) > stock) {
          return 'Stok ' + this.materialName(item.materialId) + ' di gudang asal tidak mencukupi';
        }
      }
      const creditTotal = rows
        .filter(item => item.action === 'credit')
        .reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
      if (creditTotal > 0) {
        const unpaid = this.payables
          .filter(payable => payable.poId === po.id)
          .reduce((sum, payable) => sum + (Number(payable.unpaid) || 0), 0);
        if (creditTotal > unpaid + 0.0001) {
          return 'Nilai Ganti Biaya melebihi sisa utang supplier (' + this.rp(unpaid) + ')';
        }
      }
      return null;
    },
    applyPurchaseReturnCredit(po, amount, note, adjustments) {
      let remaining = Number(amount) || 0;
      const payables = this.payables
        .filter(payable => payable.poId === po.id && Number(payable.unpaid) > 0)
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
      for (const payable of payables) {
        if (remaining <= 0) break;
        const applied = Math.min(remaining, Number(payable.unpaid) || 0);
        payable.unpaid = Math.max(0, (Number(payable.unpaid) || 0) - applied);
        payable.total = Math.max(0, (Number(payable.total) || 0) - applied);
        payable.status = payable.unpaid <= 0 ? 'paid' : (Number(payable.paid) > 0 ? 'partial' : 'unpaid');
        payable.history = payable.history || [];
        payable.history.push({ action:'purchase-return-credit', by:this.currentUser, byRole:this.role, at:todayISO(), note });
        adjustments.push({ payableId:payable.id, payableCode:payable.code, amount:applied });
        remaining -= applied;
      }
      return remaining;
    },
    savePurchaseReturn(confirmed = false) {
      const error = this.purchaseReturnValidationError();
      if (error) { this.notify(error, 'error'); return; }
      const po = this.purchaseReturnSourcePO;
      const rows = (this.purchaseReturnForm.items || [])
        .filter(item => Number(item.qty) > 0)
        .map(item => ({
          materialId:item.materialId,
          qty:Number(item.qty),
          price:Number(item.price) || 0,
          condition:item.condition,
          action:item.action,
          note:String(item.note || '').trim()
        }));
      const total = rows.reduce((sum, item) => sum + item.qty * item.price, 0);
      const replaceTotal = rows.filter(item => item.action === 'replace').reduce((sum, item) => sum + item.qty * item.price, 0);
      const creditTotal = rows.filter(item => item.action === 'credit').reduce((sum, item) => sum + item.qty * item.price, 0);
      if (!confirmed) {
        this.askSave(
          'save-purchase-return',
          null,
          'Return pembelian akan diposting. Stok, jurnal, dan utang/piutang supplier akan disesuaikan. ' + po.code + ' • ' + rows.length + ' barang • total ' + this.rp(total) + '.',
          'Posting'
        );
        return;
      }
      const date = this.purchaseReturnForm.date || todayISO();
      const code = docCode('PRT', date, nextDocSeq(this.purchaseReturns, 'PRT', date));
      const returnId = 'prt' + Date.now();
      const now = todayISO();
      const apAdjustments = [];
      if (creditTotal > 0) this.applyPurchaseReturnCredit(po, creditTotal, code, apAdjustments);
      rows.forEach(item => {
        const poItem = (po.items || []).find(row => row.materialId === item.materialId);
        if (poItem) poItem.returnedQty = Number(poItem.returnedQty || 0) + item.qty;
        const material = this.materials.find(row => row.id === item.materialId);
        if (material) {
          const oldQty = Number(material.stock) || 0;
          const oldValue = Number(material.stockValue) || 0;
          const newQty = Math.max(0, oldQty - item.qty);
          const newValue = Math.max(0, oldValue - item.qty * item.price);
          material.stock = newQty;
          material.stockValue = newValue;
          material.avgCost = newQty > 0 ? newValue / newQty : item.price;
        }
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date,
          materialId:item.materialId,
          warehouseId:this.purchaseReturnForm.warehouseId,
          type:'purchase-return',
          qty:-item.qty,
          value:-(item.qty * item.price),
          unitCost:item.price,
          refType:'purchase-return',
          refId:returnId,
          refNumber:code,
          createdAt:now
        });
      });
      const journalLines = [];
      if (replaceTotal > 0) journalLines.push({ accountId:'acc5', debit:replaceTotal, credit:0, memo:'Klaim ganti barang ' + code });
      if (creditTotal > 0) journalLines.push({ accountId:'acc7', debit:creditTotal, credit:0, memo:'Potongan utang supplier ' + code });
      journalLines.push({ accountId:'acc4', debit:0, credit:total, memo:'Persediaan keluar ' + code });
      const journal = this.createSystemJournal({
        date,
        description:'Return pembelian ' + code,
        source:'purchase-return',
        sourceId:returnId,
        lines:journalLines
      });
      const purchaseReturn = {
        id:returnId,
        code,
        date,
        poId:po.id,
        poCode:po.code,
        supplierId:po.supplierId,
        warehouseId:this.purchaseReturnForm.warehouseId,
        notes:this.purchaseReturnForm.notes || '',
        items:rows,
        total,
        replaceTotal,
        creditTotal,
        status:'posted',
        replacementStatus:replaceTotal > 0 ? 'pending' : 'none',
        journalId:journal ? journal.id : '',
        apAdjustments,
        createdBy:this.currentUser,
        createdById:this.currentUserId,
        postedAt:now,
        history:[{ action:'posted', by:this.currentUser, byRole:this.role, at:now, note:code }]
      };
      this.purchaseReturns.unshift(purchaseReturn);
      this.purchaseReturnSelectedId = purchaseReturn.id;
      po.history = po.history || [];
      po.history.push({ action:'purchase-return', by:this.currentUser, byRole:this.role, at:now, note:code });
      this.persist();
      this.notify('Return pembelian ' + code + ' berhasil diposting');
      this.go('purchase-returns');
    },
    viewPurchaseReturn(pr) {
      this.purchaseReturnSelectedId = pr.id;
      this.purchaseReturnDetailOpen = true;
    },
    voidPurchaseReturn(pr) {
      if (!pr || pr.status !== 'posted') { this.notify('Return ini tidak dapat dibatalkan', 'error'); return; }
      if (pr.replacementStatus === 'received') { this.notify('Return yang penggantinya sudah diterima tidak dapat dibatalkan', 'error'); return; }
      this.askConfirm('void-purchase-return', pr.id, 'Batalkan return?', 'Return ' + pr.code + ' akan dibatalkan. Stok, utang supplier, dan jurnal akan dikembalikan.');
    },
    receivePurchaseReturnReplacement(pr) {
      if (!pr || pr.status !== 'posted' || pr.replacementStatus !== 'pending') {
        this.notify('Return ini tidak menunggu ganti barang', 'error');
        return;
      }
      this.askConfirm('receive-return-replacement', pr.id, 'Terima ganti barang?', 'Stok pengganti akan ditambahkan dan Piutang Supplier dikurangi.');
    },
    postPurchaseReturnReplacement(pr) {
      if (!pr || pr.status !== 'posted' || pr.replacementStatus !== 'pending') return;
      const items = (pr.items || []).filter(item => item.action === 'replace');
      if (!items.length) return;
      const now = todayISO();
      const total = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
      items.forEach(item => {
        const material = this.materials.find(row => row.id === item.materialId);
        if (material) {
          const oldQty = Number(material.stock) || 0;
          const oldValue = Number(material.stockValue) || 0;
          const newQty = oldQty + item.qty;
          const newValue = oldValue + item.qty * item.price;
          material.stock = newQty;
          material.stockValue = newValue;
          material.avgCost = newQty > 0 ? newValue / newQty : item.price;
        }
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date:now,
          materialId:item.materialId,
          warehouseId:pr.warehouseId,
          type:'purchase-return-replacement',
          qty:item.qty,
          value:item.qty * item.price,
          unitCost:item.price,
          refType:'purchase-return',
          refId:pr.id,
          refNumber:pr.code,
          createdAt:now
        });
      });
      const journal = this.createSystemJournal({
        date:now,
        description:'Penerimaan ganti barang ' + pr.code,
        source:'purchase-return-replacement',
        sourceId:pr.id,
        lines:[
          { accountId:'acc4', debit:total, credit:0, memo:'Persediaan ganti barang ' + pr.code },
          { accountId:'acc5', debit:0, credit:total, memo:'Piutang supplier ' + pr.code }
        ]
      });
      pr.replacementStatus = 'received';
      pr.replacementAt = now;
      pr.replacementJournalId = journal ? journal.id : '';
      pr.history = pr.history || [];
      pr.history.push({ action:'replacement-received', by:this.currentUser, byRole:this.role, at:now, note:pr.code });
      this.persist();
      this.notify('Ganti barang ' + pr.code + ' diterima dan stok diperbarui');
    },
    voidPurchaseReturnDocument(pr) {
      if (!pr || pr.status !== 'posted') return;
      const now = todayISO();
      (pr.items || []).forEach(item => {
        const material = this.materials.find(row => row.id === item.materialId);
        if (material) {
          const oldQty = Number(material.stock) || 0;
          const oldValue = Number(material.stockValue) || 0;
          const newQty = oldQty + item.qty;
          const newValue = oldValue + item.qty * item.price;
          material.stock = newQty;
          material.stockValue = newValue;
          material.avgCost = newQty > 0 ? newValue / newQty : item.price;
        }
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date:now,
          materialId:item.materialId,
          warehouseId:pr.warehouseId,
          type:'purchase-return-void',
          qty:item.qty,
          value:item.qty * item.price,
          unitCost:item.price,
          refType:'purchase-return',
          refId:pr.id,
          refNumber:pr.code,
          createdAt:now
        });
        const po = this.purchaseOrders.find(row => row.id === pr.poId);
        const poItem = po ? (po.items || []).find(row => row.materialId === item.materialId) : null;
        if (poItem) poItem.returnedQty = Math.max(0, Number(poItem.returnedQty || 0) - item.qty);
      });
      (pr.apAdjustments || []).forEach(adjustment => {
        const payable = this.payables.find(row => row.id === adjustment.payableId);
        if (!payable) return;
        payable.unpaid = (Number(payable.unpaid) || 0) + (Number(adjustment.amount) || 0);
        payable.total = (Number(payable.total) || 0) + (Number(adjustment.amount) || 0);
        payable.status = payable.unpaid <= 0 ? 'paid' : (Number(payable.paid) > 0 ? 'partial' : 'unpaid');
        payable.history = payable.history || [];
        payable.history.push({ action:'purchase-return-void', by:this.currentUser, byRole:this.role, at:now, note:pr.code });
      });
      const journal = this.journals.find(item => item.id === pr.journalId);
      if (journal && journal.status === 'posted') {
        journal.status = 'void';
        journal.voidReason = 'Return pembelian dibatalkan';
        journal.history = journal.history || [];
        journal.history.push({ action:'void', by:this.currentUser, byRole:this.role, at:now, note:'Return pembelian dibatalkan' });
      }
      pr.status = 'void';
      pr.voidedAt = now;
      pr.voidedBy = this.currentUser;
      pr.history = pr.history || [];
      pr.history.push({ action:'void', by:this.currentUser, byRole:this.role, at:now, note:'' });
      this.persist();
      this.notify('Return pembelian ' + pr.code + ' dibatalkan');
    },
    /* ---------- CHART OF ACCOUNTS ---------- */
    coaSearch: '', coaType: '', coaStatus: '', accountModalOpen: false, accountEditId: null,
    accountForm: { code:'', name:'', type:'asset', normalBalance:'debit', parentId:'', isCashBank:false, status:true, description:'' },
    accountById(id) { return this.accounts.find(account => account.id === id) || {}; },
    accountName(id) { return this.accountById(id).name || '-'; },
    accountCode(id) { return this.accountById(id).code || '-'; },
    ensureOpeningBalanceAccount() {
      let changed = false;
      if (!this.accounts.some(account => account.code === '3-1100')) {
        this.accounts.push({
          id:'acc22', code:'3-1100', name:'Saldo Awal', type:'equity', normalBalance:'credit',
          parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true,
          description:'Akun penyeimbang saldo awal'
        });
        changed = true;
      }
      if (!this.accounts.some(account => account.code === '2-1200')) {
        this.accounts.push({
          id:'acc23', code:'2-1200', name:'Utang PPN', type:'liability', normalBalance:'credit',
          parentId:null, isCashBank:false, isSystem:true, isLocked:true, status:true,
          description:'Akun kontrol PPN keluaran'
        });
        changed = true;
      }
      if (changed) this.accounts.sort((a, b) => String(a.code).localeCompare(String(b.code)));
      return changed;
    },
    ensureCashBankAccounts() {
      let changed = false;
      (this.accounts || []).forEach(account => {
        if (!account.isCashBank || account.type !== 'asset') return;
        if (account.cashType !== 'cash' && account.cashType !== 'bank') {
          account.cashType = account.code === '1-1100' ? 'cash' : 'bank';
          changed = true;
        }
        if (account.cashType === 'bank') {
          const defaults = account.code === '1-1200'
            ? { bankName:'BCA', accountNumber:'1234567890', accountHolder:'CV Tou Masagena Mineral', branch:'Balikpapan' }
            : { bankName:'', accountNumber:'', accountHolder:'', branch:'' };
          ['bankName','accountNumber','accountHolder','branch'].forEach(key => {
            if (account[key] === undefined) { account[key] = defaults[key]; changed = true; }
          });
        }
      });
      return changed;
    },
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

    /* ---------- CASH & BANK ACCOUNTS ---------- */
    bankAccountSearch: '', bankAccountType: '', bankAccountStatus: '',
    bankAccountModalOpen: false, bankAccountEditId: null,
    bankAccountForm: { code:'', name:'', cashType:'bank', bankName:'', accountNumber:'', accountHolder:'', branch:'', status:true, description:'' },
    bankTransferModalOpen: false,
    bankTransferForm: { date:todayISO(), fromId:'', toId:'', amount:0, note:'' },
    get canManageBankAccounts() { return ['Admin','Developer'].includes(this.role); },
    get cashBankAccounts() {
      return (this.accounts || [])
        .filter(account => account.type === 'asset' && account.isCashBank)
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    bankAccountKind(account) { return account && account.cashType === 'cash' ? 'Kas' : 'Bank'; },
    get filteredBankAccounts() {
      const q = String(this.bankAccountSearch || '').toLowerCase();
      return this.cashBankAccounts.filter(account => {
        if (q && !(account.code + ' ' + account.name + ' ' + (account.bankName || '') + ' ' + (account.accountNumber || '') + ' ' + (account.accountHolder || '')).toLowerCase().includes(q)) return false;
        if (this.bankAccountType && (account.cashType || 'bank') !== this.bankAccountType) return false;
        if (this.bankAccountStatus && String(account.status) !== this.bankAccountStatus) return false;
        return true;
      });
    },
    get bankAccountTotals() {
      return this.cashBankAccounts.reduce((totals, account) => {
        const balance = Number(this.accountBalance(account.id)) || 0;
        totals.total += balance;
        if (account.cashType === 'cash') totals.cash += balance; else totals.bank += balance;
        totals.count += 1;
        return totals;
      }, { total:0, cash:0, bank:0, count:0 });
    },
    bankAccountLastDate(account) {
      let last = '';
      (this.journals || []).filter(journal => journal.status === 'posted').forEach(journal => {
        if (!(journal.lines || []).some(line => line.accountId === account.id)) return;
        if (String(journal.date) > last) last = journal.date;
      });
      return last;
    },
    nextBankAccountCode() {
      const used = new Set((this.accounts || []).map(account => String(account.code)));
      let n = 1201;
      while (used.has('1-' + n)) n += 1;
      return '1-' + n;
    },
    openBankAccount(account = null) {
      if (!this.canManageBankAccounts) { this.notify('Hanya Admin atau Developer yang dapat mengelola rekening', 'error'); return; }
      this.bankAccountEditId = account ? account.id : null;
      this.bankAccountForm = account
        ? {
            code:account.code,
            name:account.name,
            cashType:account.cashType || (account.code === '1-1100' ? 'cash' : 'bank'),
            bankName:account.bankName || '',
            accountNumber:account.accountNumber || '',
            accountHolder:account.accountHolder || '',
            branch:account.branch || '',
            status:account.status !== false,
            description:account.description || ''
          }
        : { code:this.nextBankAccountCode(), name:'', cashType:'bank', bankName:'', accountNumber:'', accountHolder:'', branch:'', status:true, description:'' };
      this.bankAccountModalOpen = true;
    },
    saveBankAccount() {
      if (!this.canManageBankAccounts) { this.notify('Hanya Admin atau Developer yang dapat mengelola rekening', 'error'); return; }
      const form = this.bankAccountForm;
      const name = String(form.name || '').trim();
      if (!name) { this.notify('Nama rekening wajib diisi', 'error'); return; }
      const cashType = form.cashType === 'cash' ? 'cash' : 'bank';
      const bankName = String(form.bankName || '').trim();
      const accountNumber = String(form.accountNumber || '').trim();
      const accountHolder = String(form.accountHolder || '').trim();
      if (cashType === 'bank' && (!bankName || !accountNumber || !accountHolder)) {
        this.notify('Nama bank, nomor rekening, dan atas nama wajib diisi', 'error');
        return;
      }
      const code = String(form.code || '').trim() || this.nextBankAccountCode();
      const duplicate = (this.accounts || []).find(account => account.id !== this.bankAccountEditId && String(account.code).toLowerCase() === code.toLowerCase());
      if (duplicate) { this.notify('Kode rekening sudah dipakai akun lain', 'error'); return; }
      const payload = {
        code, name, cashType, type:'asset', normalBalance:'debit', isCashBank:true,
        status:form.status !== false, description:String(form.description || '').trim(),
        bankName:cashType === 'bank' ? bankName : '',
        accountNumber:cashType === 'bank' ? accountNumber : '',
        accountHolder:cashType === 'bank' ? accountHolder : '',
        branch:cashType === 'bank' ? String(form.branch || '').trim() : ''
      };
      if (this.bankAccountEditId) {
        const account = this.accountById(this.bankAccountEditId);
        if (!account.id) { this.notify('Rekening tidak ditemukan', 'error'); return; }
        Object.assign(account, payload);
        this.notify('Rekening berhasil diperbarui');
      } else {
        this.accounts.push({ id:'acc' + Date.now(), isSystem:false, isLocked:false, ...payload });
        this.notify('Rekening baru berhasil ditambahkan');
      }
      this.accounts.sort((a, b) => String(a.code).localeCompare(String(b.code)));
      this.bankAccountModalOpen = false;
      this.persist();
    },
    toggleBankAccount(account) {
      if (!this.canManageBankAccounts) { this.notify('Hanya Admin atau Developer yang dapat mengelola rekening', 'error'); return; }
      if (!account || !account.id) return;
      account.status = !account.status;
      this.persist();
      this.notify('Rekening ' + account.name + (account.status ? ' diaktifkan' : ' dinonaktifkan'));
    },
    deleteBankAccount(account) {
      if (!this.canManageBankAccounts) { this.notify('Hanya Admin atau Developer yang dapat mengelola rekening', 'error'); return; }
      if (!account || !account.id) return;
      if (this.accountUsed(account.id)) { this.notify('Rekening sudah dipakai jurnal. Nonaktifkan saja.', 'error'); return; }
      this.askConfirm('delete-bank-account', account.id, 'Hapus rekening?', 'Rekening ' + account.code + ' — ' + account.name + ' akan dihapus.');
    },
    get bankTransferAccounts() { return this.cashBankAccounts.filter(account => account.status); },
    openBankTransfer() {
      const accounts = this.bankTransferAccounts;
      if (accounts.length < 2) { this.notify('Minimal 2 rekening aktif untuk mutasi', 'error'); return; }
      this.bankTransferForm = {
        date:todayISO(),
        fromId:accounts[0].id,
        toId:(accounts[1] || accounts[0]).id,
        amount:0,
        note:''
      };
      this.bankTransferModalOpen = true;
    },
    saveBankTransfer(confirmed = false) {
      const form = this.bankTransferForm;
      const from = this.accountById(form.fromId);
      const to = this.accountById(form.toId);
      const amount = Math.max(0, Number(form.amount) || 0);
      if (!from.id || !to.id || !from.isCashBank || !to.isCashBank) { this.notify('Pilih rekening asal dan tujuan', 'error'); return; }
      if (from.id === to.id) { this.notify('Rekening asal dan tujuan tidak boleh sama', 'error'); return; }
      if (!from.status || !to.status) { this.notify('Rekening harus aktif', 'error'); return; }
      if (amount <= 0) { this.notify('Nominal mutasi harus lebih dari 0', 'error'); return; }
      const available = Number(this.accountBalance(from.id)) || 0;
      if (amount > available + 0.0001) { this.notify('Saldo rekening asal tidak mencukupi', 'error'); return; }
      if (!confirmed) {
        this.askSave('bank-transfer', null,
          'Mutasi ' + this.rp(amount) + ' dari ' + from.name + ' ke ' + to.name + '. Jurnal otomatis: Dr ' + to.name + ' / Cr ' + from.name + '.',
          'Mutasi');
        return;
      }
      const description = 'Mutasi rekening ' + from.name + ' → ' + to.name + (String(form.note || '').trim() ? ' • ' + String(form.note).trim() : '');
      const journal = this.createSystemJournal({
        date:form.date || todayISO(),
        description,
        source:'bank-transfer',
        sourceId:'bt' + Date.now(),
        by:this.currentUser,
        byRole:this.role,
        lines:[
          { accountId:to.id, debit:amount, credit:0, memo:'Mutasi masuk' },
          { accountId:from.id, debit:0, credit:amount, memo:'Mutasi keluar' }
        ]
      });
      if (!journal) { this.notify('Mutasi rekening gagal disimpan', 'error'); return; }
      this.bankTransferModalOpen = false;
      this.persist();
      this.notify('Mutasi rekening berhasil disimpan');
    },
    get bankTransfers() {
      return (this.journals || [])
        .filter(journal => journal.source === 'bank-transfer' && journal.status === 'posted')
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.code).localeCompare(String(a.code)))
        .map(journal => {
          const lines = journal.lines || [];
          const credit = lines.find(line => Number(line.credit) > 0) || {};
          const debit = lines.find(line => Number(line.debit) > 0) || {};
          return {
            id:journal.id,
            code:journal.code,
            date:journal.date,
            fromId:credit.accountId || '',
            toId:debit.accountId || '',
            from:this.accountName(credit.accountId),
            to:this.accountName(debit.accountId),
            amount:Number(debit.debit) || 0,
            note:journal.description || ''
          };
        });
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
    journalSourceLabel(journal) {
      const source = (journal && journal.source) || 'manual';
      return {
        manual:'Manual',
        receipt:'Penerimaan Barang',
        income:'Pendapatan Lainnya',
        expense:'Pengeluaran Lainnya',
        'purchase-return':'Return Pembelian',
        'purchase-return-replacement':'Ganti Barang',
        'payable-payment':'Pembayaran Utang',
        'bank-transfer':'Mutasi Rekening',
        opening:'Saldo Awal'
      }[source] || source;
    },
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
    saveJournal(post = false, confirmed = false) {
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
      if (!confirmed) {
        const debit = lines.reduce((sum, line) => sum + line.debit, 0);
        this.askSave(
          'save-journal-form',
          post ? 'post' : 'draft',
          (post ? 'Jurnal akan diposting dan memengaruhi saldo akun.' : 'Draft jurnal akan disimpan.') + ' ' + (this.journalForm.description || 'Tanpa keterangan') + ' • total ' + this.rp(debit) + '.',
          post ? 'Posting' : 'Simpan'
        );
        return;
      }
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
          journal.history.push({ action:'posted', by:this.currentUser, byRole:this.role, at:now, note:'' });
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
          history:[{ action:post ? 'posted' : 'draft', by:this.currentUser, byRole:this.role, at:now, note:'' }]
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
      this.askSave('post-journal', journal.id, 'Jurnal ' + journal.code + ' akan diposting dan memengaruhi saldo akun.', 'Posting');
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
      journal.history.push({ action:'void', by:this.currentUser, byRole:this.role, at:todayISO(), note:journal.voidReason });
      this.journalVoidOpen = false;
      this.persist();
      this.notify('Jurnal di-void');
    },
    deleteJournal(journal) {
      if (journal.status !== 'draft') { this.notify('Hanya jurnal draft yang dapat dihapus', 'error'); return; }
      this.askConfirm('delete-journal', journal.id, 'Hapus jurnal?', 'Draft jurnal ' + journal.code + ' akan dihapus.');
    },

    /* ---------- OPENING BALANCE ---------- */
    openingMode: 'quick',
    openingDate: todayISO(),
    openingQuickAmounts: {},
    openingFullAmounts: {},
    openingNote: '',
    get openingAccount() { return this.accounts.find(account => account.code === '3-1100') || {}; },
    get openingPostedJournal() { return this.journals.find(journal => journal.source === 'opening' && journal.status === 'posted') || null; },
    get openingJournalView() { return this.openingPostedJournal || {}; },
    get openingQuickAccounts() {
      return this.accounts
        .filter(account => account.isCashBank && account.type === 'asset' && account.status)
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    get openingFullAccounts() {
      return this.accounts
        .filter(account => ['asset', 'liability', 'equity'].includes(account.type) && account.code !== '3-1100')
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    openingQuickAmount(id) { return Number(this.openingQuickAmounts[id]) || 0; },
    setOpeningQuick(id, value) {
      this.openingQuickAmounts = { ...this.openingQuickAmounts, [id]: Math.max(0, Number(value) || 0) };
    },
    openingFullRow(id) { return this.openingFullAmounts[id] || { debit:0, credit:0 }; },
    openingDebit(id) { return Number(this.openingFullRow(id).debit) || 0; },
    openingCredit(id) { return Number(this.openingFullRow(id).credit) || 0; },
    setOpeningFull(id, side, value) {
      const row = { ...this.openingFullRow(id) };
      const amount = Math.max(0, Number(value) || 0);
      if (side === 'debit') {
        row.debit = amount;
        if (amount > 0) row.credit = 0;
      } else {
        row.credit = amount;
        if (amount > 0) row.debit = 0;
      }
      this.openingFullAmounts = { ...this.openingFullAmounts, [id]: row };
    },
    get openingRows() {
      if (this.openingMode === 'quick') {
        return this.openingQuickAccounts
          .map(account => ({ accountId:account.id, debit:this.openingQuickAmount(account.id), credit:0 }))
          .filter(row => row.debit > 0);
      }
      return this.openingFullAccounts
        .map(account => ({ accountId:account.id, debit:this.openingDebit(account.id), credit:this.openingCredit(account.id) }))
        .filter(row => row.debit > 0 || row.credit > 0);
    },
    get openingTotals() {
      return this.openingRows.reduce((sum, row) => ({
        debit:sum.debit + row.debit,
        credit:sum.credit + row.credit
      }), { debit:0, credit:0 });
    },
    get openingBalancingAmount() { return Math.abs(this.openingTotals.debit - this.openingTotals.credit); },
    get openingBalancingSide() {
      const difference = this.openingTotals.debit - this.openingTotals.credit;
      if (difference > 0) return 'credit';
      if (difference < 0) return 'debit';
      return '';
    },
    get openingPostingLines() {
      const lines = this.openingRows.map(row => ({
        accountId:row.accountId,
        debit:row.debit,
        credit:row.credit,
        memo:'Saldo awal'
      }));
      const amount = this.openingBalancingAmount;
      if (amount > 0 && this.openingAccount.id) {
        lines.push({
          accountId:this.openingAccount.id,
          debit:this.openingBalancingSide === 'debit' ? amount : 0,
          credit:this.openingBalancingSide === 'credit' ? amount : 0,
          memo:'Saldo awal'
        });
      }
      return lines.filter(line => line.debit > 0 || line.credit > 0);
    },
    get openingHasAmounts() { return this.openingRows.length > 0; },
    get openingPreviousJournals() {
      return this.journals.filter(journal =>
        journal.status === 'posted' && journal.source !== 'opening' && journal.date < this.openingDate
      );
    },
    resetOpeningForm() {
      this.openingMode = 'quick';
      this.openingDate = todayISO();
      this.openingQuickAmounts = {};
      this.openingFullAmounts = {};
      this.openingNote = '';
    },
    confirmOpeningBalance() {
      if (this.openingPostedJournal) { this.notify('Saldo awal sudah diposting. Void terlebih dahulu untuk mengubah.', 'error'); return; }
      if (!this.openingDate) { this.notify('Tanggal saldo awal wajib diisi', 'error'); return; }
      if (!this.openingRows.length) { this.notify('Isi minimal satu saldo akun', 'error'); return; }
      this.askConfirm('post-opening', null, 'Posting saldo awal?', 'Saldo awal akan membuat jurnal pembuka dan langsung memengaruhi Neraca Saldo, Neraca, dan Buku Besar.', false, 'Posting');
    },
    saveOpeningBalance() {
      if (this.openingPostedJournal) { this.notify('Saldo awal sudah diposting. Void terlebih dahulu untuk mengubah.', 'error'); return; }      if (!this.openingDate) { this.notify('Tanggal saldo awal wajib diisi', 'error'); return; }
      if (!this.openingRows.length) { this.notify('Isi minimal satu saldo akun', 'error'); return; }
      if (!this.openingAccount.id) { this.notify('Akun Saldo Awal tidak ditemukan', 'error'); return; }
      const lines = this.openingPostingLines;
      const journal = this.createSystemJournal({
        date:this.openingDate,
        description:'Saldo awal per ' + this.openingDate + (this.openingNote ? ' — ' + this.openingNote : ''),
        source:'opening',
        sourceId:'opening-balance',
        lines,
        by:this.currentUser,
        byRole:this.role
      });
      if (!journal) { this.notify('Saldo awal belum seimbang', 'error'); return; }
      this.persist();
      this.notify('Saldo awal berhasil diposting');
    },
    voidOpeningBalance() {
      const journal = this.openingPostedJournal;
      if (!journal) return;
      this.askConfirm('void-opening', journal.id, 'Void saldo awal?', 'Jurnal saldo awal ' + journal.code + ' akan di-void. Laporan akan kembali tanpa saldo awal sampai diposting ulang.', true, 'Void');
    },

    /* ---------- HPP ---------- */
    hppTab: 'daily',
    hppBulananSearch: '', hppBulananStatus: '', hppBulananPeriodFilter: '',
    hppBulananForm: null, hppBulananEditId: null, hppBulananDetailId: null,
    hppBulananRevisionOpen: false, hppBulananRevisionId: null, hppBulananRevisionReason: '',
    hppBulananSelfTestResult: null,
    employeeSearch: '', employeeGroup: '', employeeStatus: '',
    employeeModalOpen: false, employeeEditId: null,
    employeeForm: { nip:'', pin:'', name:'', group:'Produksi', position:'Operator Mesin', joinDate:todayISO(), status:true, resignDate:'', basicSalary:0, mealPerDay:20000, bank:'', accountNumber:'', note:'' },
    attendancePeriod: previousMonthKey(todayISO().slice(0, 7)),
    attendanceTab: 'recap',
    attendanceSearch: '', attendanceEmployeeFilter: '',
    attendanceImportOpen: false, attendanceImportStep: 1, attendanceImportRows: [], attendanceImportFileName: '', attendanceImportPeriod: '',
    attendanceNoteOpen: false, attendanceNoteForm: { employeeId:'', date:todayISO(), dateEnd:'', type:'izin', note:'' },
    attendanceSettingsOpen: false,
    attendanceSettingsForm: {
      hkStandar:26,
      groups:{
        Produksi:{ start:'08:00', tolerance:15, lateNoMeal:true },
        Operasional:{ start:'08:00', tolerance:10, lateNoMeal:false },
        Manager:{ start:'08:00', tolerance:15, lateNoMeal:false },
        Supervisor:{ start:'08:00', tolerance:15, lateNoMeal:false }
      },
      weeklyOff:[0], holidayText:'', hkRules:{ alfa:true, izin:true, sakit:false, cuti:false }
    },
    payrollPeriod: todayISO().slice(0, 7),
    payrollAttendancePeriod: previousMonthKey(todayISO().slice(0, 7)),
    payrollSearch: '',
    payrollRevisionOpen: false, payrollRevisionReason: '',
    payrollHppOpen: false,
    payrollHppForm: { period:previousMonthKey(todayISO().slice(0, 7)), basis:'before' },
    payrollSettingsOpen: false,
    payrollSettingsForm: { hkStandar:26, mealDefault:20000, hppGroups:['Produksi'], hppSalaryBasis:'before' },
    hrSelfTestResult: null,
    hppSearch: '', hppStatus: '', hppProduct: '', hppDateFrom: '', hppDateTo: '',
    hppMonthlyPeriod: todayISO().slice(0, 7),
    hppMonthlyForm: {},
    hppSourcePeriod: '',
    hppSettingsForm: { workingDays: 26, waterLitersPerKrt: 10.5, waterPricePerM3: 7000, roundingMode:'none' },
    hppForm: { date:todayISO(), productId:'', allocationPercent:100, bonusQty:0, bonusNote:'', materialMode:'actual', materialOverrides:{}, depreciationTotal:0, costPeriods:{} },
    hppEditId: null,
    hppDetailId: null,
    hppRevisionOpen: false,
    hppRevisionId: null,
    hppRevisionReason: '',
    hppHistoryOpen: false,
    hppHistoryTitle: '',
    hppHistoryRows: [],
    hppSelfTestResult: null,
    get hppDailyComponents() {
      return [
        { key:'gaji', label:'Gaji Produksi', employee:true },
        { key:'uang_makan', label:'Uang Makan Produksi', employee:true },
        { key:'bpjs', label:'BPJS Produksi', employee:false },
        { key:'listrik', label:'Listrik', employee:false },
        { key:'overhead', label:'Overhead', employee:false }
      ];
    },
    get hppMonthlyComponents() {
      return [
        { key:'gaji', label:'Gaji Produksi', employee:true },
        { key:'uang_makan', label:'Uang Makan Produksi', employee:true },
        { key:'bpjs', label:'BPJS Produksi', employee:false },
        { key:'listrik', label:'Listrik', employee:false },
        { key:'overhead', label:'Overhead', employee:false },
        { key:'air', label:'Air', employee:false },
        { key:'bonusan', label:'Bonusan', employee:false },
        { key:'reject', label:'Reject', employee:false }
      ];
    },
    get hppComponents() { return this.hppMonthlyComponents; },
    initHpp() {
      this.loadHppSettingsForm();
      this.loadHppMonthly();
    },
    loadHppSettingsForm() {
      const settings = this.hppSettings || {};
      this.hppSettingsForm = {
        workingDays:Number(settings.workingDays) || 26,
        waterLitersPerKrt:Number(settings.waterLitersPerKrt) || 10.5,
        waterPricePerM3:Number(settings.waterPricePerM3) || 7000,
        roundingMode:settings.roundingMode || 'none'
      };
    },
    saveHppSettings() {
      const form = this.hppSettingsForm;
      const workingDays = Number(form.workingDays) || 0;
      const waterLitersPerKrt = Number(form.waterLitersPerKrt) || 0;
      const waterPricePerM3 = Number(form.waterPricePerM3) || 0;
      const roundingMode = ['none','component','final'].includes(form.roundingMode) ? form.roundingMode : 'none';
      if (workingDays < 1 || workingDays > 31) { this.notify('Hari kerja harus antara 1 dan 31', 'error'); return; }
      if (waterLitersPerKrt < 0 || waterPricePerM3 < 0) { this.notify('Parameter air tidak boleh negatif', 'error'); return; }
      const old = {
        workingDays:Number(this.hppSettings.workingDays) || 0,
        waterLitersPerKrt:Number(this.hppSettings.waterLitersPerKrt) || 0,
        waterPricePerM3:Number(this.hppSettings.waterPricePerM3) || 0,
        roundingMode:this.hppSettings.roundingMode || 'none'
      };
      const changes = [];
      if (old.workingDays !== workingDays) changes.push('Hari kerja: ' + old.workingDays + ' → ' + workingDays);
      if (old.waterLitersPerKrt !== waterLitersPerKrt) changes.push('Liter air per Krt: ' + old.waterLitersPerKrt + ' → ' + waterLitersPerKrt);
      if (old.waterPricePerM3 !== waterPricePerM3) changes.push('Harga air per m³: ' + old.waterPricePerM3 + ' → ' + waterPricePerM3);
      if (old.roundingMode !== roundingMode) changes.push('Pembulatan: ' + this.hppRoundingLabel(old.roundingMode) + ' → ' + this.hppRoundingLabel(roundingMode));
      if (!changes.length) { this.notify('Tidak ada perubahan pengaturan'); return; }
      this.hppSettings = Object.assign({}, this.hppSettings, {
        workingDays, waterLitersPerKrt, waterPricePerM3, electricityFormula:'allocation', roundingMode,
        updatedBy:this.currentUser, updatedAt:todayISO()
      });
      this.hppSettings.history = this.hppSettings.history || [];
      this.hppSettings.history.unshift({ at:todayISO(), by:this.currentUser, byRole:this.role, changes });
      this.persist();
      this.notify('Pengaturan HPP disimpan');
    },
    getBiayaBulanan(period, component) {
      return (this.biayaProduksiBulanan || []).find(row => row.period === period && row.component === component) || null;
    },
    get hppRoundingMode() { return ['none','component','final'].includes(this.hppSettings.roundingMode) ? this.hppSettings.roundingMode : 'none'; },
    hppElectricityFormulaLabel() { return 'Alokasi biaya bulanan'; },
    hppRoundingLabel(value) {
      return { none:'Tidak dibulatkan', component:'Bulatkan tiap komponen', final:'Bulatkan HPP akhir' }[value || 'none'] || 'Tidak dibulatkan';
    },
    get hppCopySourcePeriods() {
      const periods = new Set(['2026-09','2026-10','2026-11']);
      (this.biayaProduksiBulanan || []).forEach(row => { if (row.period) periods.add(row.period); });
      return [...periods].filter(period => period !== this.hppMonthlyPeriod).sort();
    },
    hppHasMonthlyData(period) {
      return (this.biayaProduksiBulanan || []).some(row => row.period === period);
    },
    seedDummyMonthlyPeriod(period) {
      const factors = { '2026-09':0.95, '2026-10':1, '2026-11':1.03 };
      const factor = factors[period] != null ? factors[period] : 1;
      const isOctober = period === '2026-10';
      const base = { gaji:32637692, uang_makan:7720000, bpjs:3382080, listrik:14567560, overhead:0 };
      const counts = { gaji:12, uang_makan:12, bpjs:12 };
      this.biayaProduksiBulanan = (this.biayaProduksiBulanan || []).filter(row => row.period !== period);
      const rows = Object.keys(base).map(component => ({
        id:'bpb' + Date.now() + Math.random().toString(16).slice(2),
        period,
        component,
        value:Math.round(base[component] * factor),
        employeeCount:counts[component] != null ? counts[component] : null,
        sourceType:'manual',
        type:isOctober ? 'aktual' : 'estimasi',
        note:isOctober ? 'Data client HPP 30 Oktober' : 'Data dummy prototipe',
        createdBy:this.currentUser || 'Admin',
        updatedBy:this.currentUser || 'Admin',
        updatedAt:todayISO(),
        history:[]
      }));
      this.biayaProduksiBulanan.push(...rows);
      return rows;
    },
    seedDummyMonthlyPeriods() {
      ['2026-09','2026-10','2026-11'].forEach(period => this.seedDummyMonthlyPeriod(period));
    },
    copyHppMonthlyFromPeriod(period) {
      if (!period) return;
      let rows = (this.biayaProduksiBulanan || []).filter(row => row.period === period);
      let loadedDummy = false;
      if (!rows.length) {
        rows = this.seedDummyMonthlyPeriod(period);
        loadedDummy = true;
      }
      if (!rows.length) { this.notify('Belum ada data biaya pada ' + monthLongLabel(period), 'error'); return; }
      rows.forEach(row => {
        this.hppMonthlyForm[row.component] = {
          value:Number(row.value) || 0,
          employeeCount:row.employeeCount != null ? row.employeeCount : '',
          sourceType:'manual',
          type:'estimasi',
          note:'Salinan ' + monthLongLabel(period)
        };
      });
      this.hppSourcePeriod = '';
      this.persist();
      this.notify(loadedDummy
        ? 'Data dummy ' + monthLongLabel(period) + ' dimuat sebagai Estimasi. Sesuaikan sebelum disimpan.'
        : 'Biaya ' + monthLongLabel(period) + ' dimuat sebagai Estimasi');
    },
    loadHppDummyCost(period) {
      if (!period) return;
      this.seedDummyMonthlyPeriod(period);
      this.persist();
      this.notify('Data dummy ' + monthLongLabel(period) + ' dimuat. Angka ini hanya untuk demo.');
    },
    hppComponentLabel(key) {
      if (key === 'penyusutan') return 'Penyusutan';
      const component = this.hppMonthlyComponents.find(row => row.key === key);
      return component ? component.label : key;
    },
    loadHppMonthly() {
      const form = {};
      this.hppMonthlyComponents.forEach(component => {
        const row = this.getBiayaBulanan(this.hppMonthlyPeriod, component.key);
        form[component.key] = row ? {
          value:Number(row.value) || 0,
          employeeCount:row.employeeCount != null ? row.employeeCount : '',
          sourceType:row.sourceType || 'manual',
          type:row.type || 'estimasi',
          note:row.note || ''
        } : {
          value:0, employeeCount:'', sourceType:'manual', type:'estimasi', note:''
        };
      });
      this.hppMonthlyForm = form;
    },
    setHppMonthlyPeriod(value) {
      this.hppMonthlyPeriod = value;
      this.loadHppMonthly();
    },
    saveHppMonthly() {
      const period = this.hppMonthlyPeriod;
      if (!period) { this.notify('Pilih periode biaya', 'error'); return; }
      let changed = 0;
      this.hppMonthlyComponents.forEach(component => {
        const form = this.hppMonthlyForm[component.key] || {};
        let row = this.getBiayaBulanan(period, component.key);
        const next = {
          value:Number(form.value) || 0,
          employeeCount:form.employeeCount === '' ? null : Number(form.employeeCount) || 0,
          sourceType:form.sourceType || 'manual',
          type:form.type || 'estimasi',
          note:form.note || ''
        };
        if (!row) {
          row = {
            id:'bpb' + Date.now() + Math.random().toString(16).slice(2),
            period,
            component:component.key,
            ...next,
            createdBy:this.currentUser,
            updatedBy:this.currentUser,
            updatedAt:todayISO(),
            history:[]
          };
          this.biayaProduksiBulanan.push(row);
          changed += 1;
          return;
        }
        const before = {
          value:Number(row.value) || 0,
          employeeCount:row.employeeCount,
          sourceType:row.sourceType,
          type:row.type,
          note:row.note || ''
        };
        const different = ['value','employeeCount','sourceType','type','note'].some(key => String(before[key] == null ? '' : before[key]) !== String(next[key] == null ? '' : next[key]));
        if (!different) return;
        row.history = row.history || [];
        row.history.unshift({ at:todayISO(), by:this.currentUser, byRole:this.role, before, after:next });
        Object.assign(row, next, { updatedBy:this.currentUser, updatedAt:todayISO() });
        changed += 1;
      });
      this.persist();
      this.notify(changed ? 'Biaya bulanan disimpan' : 'Tidak ada perubahan biaya');
    },
    askCopyHppMonthly() {
      const sources = this.hppCopySourcePeriods;
      if (!sources.length) { this.notify('Belum ada periode sumber lain', 'error'); return; }
      this.copyHppMonthlyFromPeriod(sources[sources.length - 1]);
    },
    applyHppMonthlyCopy(period) { this.copyHppMonthlyFromPeriod(period); },
    openHppHistory(component) {
      const row = this.getBiayaBulanan(this.hppMonthlyPeriod, component);
      if (!row || !(row.history || []).length) { this.notify('Belum ada riwayat perubahan untuk komponen ini'); return; }
      this.hppHistoryTitle = this.hppComponentLabel(component) + ' • ' + monthLongLabel(this.hppMonthlyPeriod);
      this.hppHistoryRows = row.history;
      this.hppHistoryOpen = true;
    },
    get hppFilteredList() {
      const q = String(this.hppSearch || '').toLowerCase();
      return (this.hppHarian || []).filter(row => {
        if (q && !(row.code + ' ' + this.productName(row.productId)).toLowerCase().includes(q)) return false;
        if (this.hppStatus && row.status !== this.hppStatus) return false;
        if (this.hppProduct && row.productId !== this.hppProduct) return false;
        if (this.hppDateFrom && row.date < this.hppDateFrom) return false;
        if (this.hppDateTo && row.date > this.hppDateTo) return false;
        return true;
      }).sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.code).localeCompare(String(a.code)));
    },
    hppStatusLabel(status) { return { draft:'Draft', final:'Final', superseded:'Digantikan' }[status] || status; },
    hppStatusBadge(status) { return { draft:'badge-slate', final:'badge-green', superseded:'badge-stone' }[status] || 'badge-slate'; },
    nextHppCode() {
      const year = todayISO().slice(0, 4);
      const prefix = 'HPP-' + year + '-';
      const max = (this.hppHarian || []).reduce((value, row) => {
        const code = String(row.code || '');
        if (!code.startsWith(prefix)) return value;
        return Math.max(value, Number(code.slice(prefix.length)) || 0);
      }, 0);
      return prefix + String(max + 1).padStart(4, '0');
    },
    hppDefaultCostPeriods(date) {
      const key = previousMonthKey(String(date || todayISO()).slice(0, 7));
      const periods = {};
      ['gaji','uang_makan','bpjs','listrik','overhead'].forEach(component => { periods[component] = key; });
      return periods;
    },
    get hppDemoAvailable() { return (this.productions || []).some(row => row.date === '2026-10-30' && row.productId === 'p1'); },
    startHppDemo() {
      const demo = this.hppDemoScenario();
      this.startHppCreate();
      this.hppForm.date = demo.date;
      this.hppForm.productId = demo.productId;
      this.onHppDateChange();
      this.onHppProductChange();
      this.notify('Skenario demo 30 Oktober dimuat: 1.515 Krt dengan harga bahan client.');
    },
    startHppCreate() {
      this.hppEditId = null;
      this.hppForm = {
        date:todayISO(), productId:'', allocationPercent:100,
        bonusQty:0, bonusNote:'', materialMode:'actual',
        materialOverrides:{}, depreciationTotal:0,
        costPeriods:this.hppDefaultCostPeriods(todayISO())
      };
      this.applyHppDemoScenario();
      this.go('hpp-create');
    },
    hppDemoScenario() {
      return { date:'2026-10-30', productId:'p1', outputQty:1515, bonusQty:32, bonusNote:'Bonusan 32 dus' };
    },
    applyHppDemoScenario() {
      if (!this.hppForm) return false;
      const demo = this.hppDemoScenario();
      if (this.hppForm.date !== demo.date || this.hppForm.productId !== demo.productId) {
        if (this.hppForm.demoScenario) {
          this.hppForm.demoScenario = false;
          this.hppForm.materialOverrides = {};
          this.hppForm.costPeriods = this.hppDefaultCostPeriods(this.hppForm.date);
          this.hppForm.bonusQty = 0;
          this.hppForm.bonusNote = '';
        }
        return false;
      }
      this.hppForm.materialOverrides = {};
      this.hppForm.costPeriods = { gaji:'2026-10', uang_makan:'2026-10', bpjs:'2026-10', listrik:'2026-10', overhead:'2026-10' };
      this.hppForm.bonusQty = demo.bonusQty;
      this.hppForm.bonusNote = demo.bonusNote;
      this.hppForm.demoScenario = true;
      return true;
    },
    onHppDateChange() {
      if (!this.hppForm) return;
      this.hppForm.costPeriods = this.hppDefaultCostPeriods(this.hppForm.date);
      if (this.applyHppDemoScenario()) this.notify('Skenario demo 30 Oktober aktif: periode biaya dan bonus diisi otomatis.');
    },
    onHppProductChange() {
      if (this.applyHppDemoScenario()) this.notify('Skenario demo 30 Oktober aktif: periode biaya dan bonus diisi otomatis.');
    },
    editHpp(row) {
      if (!row || row.status !== 'draft') return;
      this.hppEditId = row.id;
      const overrides = {};
      (row.materials || []).forEach(material => {
        if (material.priceOverridden) overrides[material.materialId] = { price:material.price, reason:material.overrideReason || '' };
      });
      const periods = {};
      ['gaji','uang_makan','bpjs','listrik','overhead'].forEach(component => {
        const cost = (row.costs || []).find(item => item.component === component);
        periods[component] = cost ? cost.sourcePeriod : previousMonthKey(String(row.date).slice(0, 7));
      });
      this.hppForm = {
        date:row.date, productId:row.productId,
        allocationPercent:Number(row.allocationPercent) || 100,
        bonusQty:Number(row.bonusQty) || 0, bonusNote:row.bonusNote || '',
        materialMode:row.materialMode || 'actual',
        materialOverrides:overrides,
        depreciationTotal:Number(row.depreciationTotal) || 0,
        costPeriods:periods
      };
      this.go('hpp-create');
    },
    get hppProductionDocs() {
      if (!this.hppForm || !this.hppForm.date || !this.hppForm.productId) return [];
      return (this.productions || []).filter(row => row.status === 'posted' && row.date === this.hppForm.date && row.productId === this.hppForm.productId);
    },
    get hppOutputQty() { return this.hppProductionDocs.reduce((sum, row) => sum + (Number(row.qty) || 0), 0); },
    get hppProductionIds() { return this.hppProductionDocs.map(row => row.id); },
    materialAveragePriceAt(materialId, asOf) {
      const movements = (this.stockMovements || [])
        .filter(row => row.materialId === materialId && (!asOf || row.date <= asOf))
        .sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.id).localeCompare(String(b.id)));
      let qty = 0;
      let value = 0;
      movements.forEach(row => {
        const delta = Number(row.qty) || 0;
        const rowValue = Number(row.value) || 0;
        if (delta > 0) {
          qty += delta;
          value += rowValue || delta * (Number(row.unitCost) || 0);
        } else if (delta < 0) {
          const unit = qty > 0 ? value / qty : (Number(row.unitCost) || 0);
          const used = Math.min(qty, Math.abs(delta));
          qty -= used;
          value -= used * unit;
        }
      });
      return qty > 0 ? value / qty : null;
    },
    hppMaterialPrice(materialId) {
      const override = this.hppForm && this.hppForm.materialOverrides[materialId];
      if (override && override.price !== '' && override.price !== null && override.price !== undefined) return Number(override.price) || 0;
      const average = this.materialAveragePriceAt(materialId, this.hppForm ? this.hppForm.date : '');
      if (average != null) return average;
      return Number(this.material(materialId).purchasePrice) || 0;
    },
    hppMaterialPriceStatus(materialId) {
      const override = this.hppForm && this.hppForm.materialOverrides[materialId];
      if (override && override.price !== '' && override.price !== null && override.price !== undefined) return 'override';
      if (this.materialAveragePriceAt(materialId, this.hppForm ? this.hppForm.date : '') != null) return 'auto';
      return (Number(this.material(materialId).purchasePrice) || 0) > 0 ? 'auto' : 'missing';
    },
    setHppMaterialPrice(materialId, value) {
      if (!this.hppForm) return;
      const current = this.hppForm.materialOverrides[materialId] || { price:'', reason:'' };
      this.hppForm.materialOverrides = {
        ...this.hppForm.materialOverrides,
        [materialId]: { price:Math.max(0, Number(value) || 0), reason:current.reason || '' }
      };
    },
    setHppMaterialReason(materialId, value) {
      if (!this.hppForm) return;
      const current = this.hppForm.materialOverrides[materialId] || { price:'', reason:'' };
      this.hppForm.materialOverrides = { ...this.hppForm.materialOverrides, [materialId]: { ...current, reason:value } };
    },
    resetHppMaterialPrice(materialId) {
      if (!this.hppForm) return;
      const copy = { ...this.hppForm.materialOverrides };
      delete copy[materialId];
      this.hppForm.materialOverrides = copy;
    },
    get hppMaterialRows() {
      if (!this.hppForm || !this.hppForm.productId || !this.hppForm.date || this.hppOutputQty <= 0) return [];
      const output = this.hppOutputQty;
      const totals = {};
      if (this.hppForm.materialMode === 'standard') {
        (this.recipes || []).filter(recipe => recipe.productId === this.hppForm.productId).forEach(recipe => {
          totals[recipe.materialId] = (totals[recipe.materialId] || 0) + (Number(recipe.qtyPerUnit) || 0) * output;
        });
      } else {
        this.hppProductionDocs.forEach(doc => (doc.materials || []).forEach(row => {
          if (!row.materialId) return;
          totals[row.materialId] = (totals[row.materialId] || 0) + (Number(row.qty) || 0);
        }));
      }
      return Object.keys(totals).map(materialId => {
        const material = this.material(materialId);
        const qtyTotal = totals[materialId];
        const qtyPerDus = output > 0 ? qtyTotal / output : 0;
        const price = this.hppMaterialPrice(materialId);
        const status = this.hppMaterialPriceStatus(materialId);
        const override = this.hppForm.materialOverrides[materialId] || {};
        return {
          materialId, code:material.code || '-', name:material.name || '-', unit:material.unit || '',
          qtyTotal, qtyPerDus, price, subtotalPerDus:qtyPerDus * price,
          priceOverridden:status === 'override', priceMissing:status === 'missing' || price <= 0,
          overrideReason:override.reason || '', status
        };
      }).sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    get hppMaterialTotal() { return this.hppMaterialRows.reduce((sum, row) => sum + row.subtotalPerDus, 0); },
    hppCostPeriod(component) {
      return (this.hppForm && this.hppForm.costPeriods && this.hppForm.costPeriods[component]) || previousMonthKey(String(this.hppForm ? this.hppForm.date : todayISO()).slice(0, 7));
    },
    setHppCostPeriod(component, value) {
      if (!this.hppForm) return;
      this.hppForm.costPeriods = { ...this.hppForm.costPeriods, [component]:value };
    },
    get hppCostRows() {
      if (!this.hppForm) return [];
      const output = this.hppOutputQty;
      const workingDays = Number(this.hppSettings.workingDays) || 0;
      const allocation = Number(this.hppForm.allocationPercent) || 0;
      const rounding = this.hppRoundingMode;
      const rows = [];
      this.hppDailyComponents.forEach(component => {
        const period = this.hppCostPeriod(component.key);
        const source = this.getBiayaBulanan(period, component.key);
        const value = source ? Number(source.value) || 0 : 0;
        const rawPerDus = output > 0 && workingDays > 0 ? (value / workingDays / output) * (allocation / 100) : 0;
        const perDus = rounding === 'component' ? Math.round(rawPerDus) : rawPerDus;
        rows.push({
          component:component.key,
          label:component.label,
          period,
          source,
          value,
          type:source ? source.type : '',
          perDus,
          rawPerDus,
          note:Math.abs(perDus - rawPerDus) >= 0.005 ? 'Nilai asli ' + this.fmt2(rawPerDus) : '',
          missing:!source,
          formula:'(' + this.fmt(value) + ' ÷ ' + this.fmt(workingDays) + ') ÷ ' + this.fmt(output) + ' × ' + this.fmt(allocation) + '% = ' + this.fmt2(rawPerDus)
        });
      });
      const waterLiters = Number(this.hppSettings.waterLitersPerKrt) || 0;
      const waterPrice = Number(this.hppSettings.waterPricePerM3) || 0;
      const waterRaw = (waterLiters / 1000) * waterPrice;
      const waterPerDus = rounding === 'component' ? Math.round(waterRaw) : waterRaw;
      rows.push({
        component:'air', label:'Air', period:'', source:null, value:null, type:'', perDus:waterPerDus, rawPerDus:waterRaw,
        note:Math.abs(waterPerDus - waterRaw) >= 0.005 ? 'Nilai asli ' + this.fmt2(waterRaw) : '',
        missing:false,
        formula:'(' + this.fmt(waterLiters) + ' ÷ 1.000) × ' + this.fmt(waterPrice) + ' = ' + this.fmt2(waterRaw)
      });
      const depreciation = Number(this.hppForm.depreciationTotal) || 0;
      const depreciationRaw = output > 0 ? (depreciation / output) * (allocation / 100) : 0;
      const depreciationPerDus = rounding === 'component' ? Math.round(depreciationRaw) : depreciationRaw;
      rows.push({
        component:'penyusutan', label:'Penyusutan', period:'', source:null, value:depreciation, type:'', perDus:depreciationPerDus, rawPerDus:depreciationRaw,
        note:Math.abs(depreciationPerDus - depreciationRaw) >= 0.005 ? 'Nilai asli ' + this.fmt2(depreciationRaw) : '',
        missing:false,
        formula:'(' + this.fmt(depreciation) + ' ÷ ' + this.fmt(output) + ') × ' + this.fmt(allocation) + '% = ' + this.fmt2(depreciationRaw)
      });
      return rows;
    },
    get hppCostTotal() { return this.hppCostRows.reduce((sum, row) => sum + row.perDus, 0); },
    get hppPerDus() {
      const raw = this.hppMaterialTotal + this.hppCostTotal;
      return this.hppRoundingMode === 'final' ? Math.round(raw) : raw;
    },
    get hppTotal() { return this.hppPerDus * this.hppOutputQty; },
    get hppProductCost() { return Number(this.product(this.hppForm ? this.hppForm.productId : '').cost) || 0; },
    get hppCostDifference() { return this.hppPerDus - this.hppProductCost; },
    get hppCostDifferencePct() { return this.hppProductCost ? (this.hppCostDifference / this.hppProductCost) * 100 : 0; },
    get hppMissingCosts() { return this.hppCostRows.filter(row => row.missing); },
    get hppAllocationWarning() {
      if (!this.hppForm) return false;
      const others = (this.hppHarian || []).filter(row =>
        row.date === this.hppForm.date
        && row.status !== 'superseded'
        && row.id !== this.hppEditId
        && row.productId !== this.hppForm.productId
      );
      return others.reduce((sum, row) => sum + (Number(row.allocationPercent) || 0), Number(this.hppForm.allocationPercent) || 0) > 100;
    },
    get hppCanFinalize() {
      return !!this.hppForm
        && !!this.hppForm.date
        && !!this.hppForm.productId
        && this.hppOutputQty > 0
        && this.hppMaterialRows.length > 0
        && this.hppMaterialRows.every(row => row.price > 0 && (!row.priceOverridden || String(row.overrideReason || '').trim()))
        && this.hppMissingCosts.length === 0
        && Number(this.hppForm.depreciationTotal) >= 0
        && Number(this.hppForm.allocationPercent) >= 0
        && Number(this.hppForm.allocationPercent) <= 100;
    },
    hppPayload(status) {
      const form = this.hppForm;
      const costs = this.hppCostRows;
      return {
        id:'hpp' + Date.now(),
        code:this.nextHppCode(),
        date:form.date,
        productId:form.productId,
        version:(this.hppHarian || []).filter(row => row.date === form.date && row.productId === form.productId).reduce((max, row) => Math.max(max, Number(row.version) || 0), 0) + 1,
        status,
        workingDays:Number(this.hppSettings.workingDays) || 0,
        allocationPercent:Number(form.allocationPercent) || 0,
        outputQty:this.hppOutputQty,
        bonusQty:Number(form.bonusQty) || 0,
        bonusNote:form.bonusNote || '',
        materialMode:form.materialMode,
        materialPerDus:this.hppMaterialTotal,
        productionCostPerDus:this.hppCostTotal,
        hppPerDus:this.hppPerDus,
        totalHpp:this.hppTotal,
        depreciationTotal:Number(form.depreciationTotal) || 0,
        materials:this.hppMaterialRows.map(row => ({
          materialId:row.materialId, qtyTotal:row.qtyTotal, qtyPerDus:row.qtyPerDus,
          price:row.price, priceOverridden:row.priceOverridden,
          overrideReason:row.overrideReason
        })),
        costs:costs.map(row => ({
          component:row.component, sourcePeriod:row.period, sourceType:row.source ? row.source.sourceType : 'manual',
          type:row.type || '', monthlyValue:row.value, divisor:Number(this.hppSettings.workingDays) || 0,
          perDus:row.perDus, rawPerDus:row.rawPerDus, note:row.note || '', formula:row.formula
        })),
        productionIds:this.hppProductionIds,
        snapshot:JSON.parse(JSON.stringify({
          settings:{ ...this.hppSettings },
          productionDocs:this.hppProductionDocs.map(row => ({ id:row.id, code:row.code, qty:row.qty, materials:row.materials })),
          monthlyCosts:costs.map(row => ({ component:row.component, period:row.period, source:row.source ? { ...row.source } : null, value:row.value, type:row.type })),
          materials:this.hppMaterialRows,
          outputQty:this.hppOutputQty,
          allocationPercent:Number(form.allocationPercent) || 0,
          bonusQty:Number(form.bonusQty) || 0,
          bonusNote:form.bonusNote || '',
          materialMode:form.materialMode,
          depreciationTotal:Number(form.depreciationTotal) || 0
        })),
        createdBy:this.currentUser,
        createdById:this.currentUserId,
        createdAt:todayISO(),
        finalizedBy:'', finalizedAt:'',
        supersededBy:'', supersededAt:'', revisionReason:'',
        appliedBy:'', appliedAt:''
      };
    },
    saveHppDraft() {
      if (!this.hppForm) return;
      if (!this.hppForm.date || !this.hppForm.productId) { this.notify('Tanggal dan produk wajib diisi', 'error'); return; }
      if (this.hppOutputQty <= 0) { this.notify('Belum ada produksi untuk produk ini pada tanggal tersebut', 'error'); return; }
      if (this.hppMaterialRows.length === 0) { this.notify('Bahan baku belum tersedia', 'error'); return; }
      const payload = this.hppPayload('draft');
      if (this.hppEditId) {
        const row = this.hppHarian.find(item => item.id === this.hppEditId);
        if (!row) { this.notify('Draft HPP tidak ditemukan', 'error'); return; }
        Object.assign(row, payload, { id:row.id, code:row.code, version:row.version, createdAt:row.createdAt, createdBy:row.createdBy, createdById:row.createdById });
        this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:row.id, action:'draft', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Draft diperbarui' });
        this.hppDetailId = row.id;
      } else {
        this.hppHarian.unshift(payload);
        this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:payload.id, action:'draft', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Draft dibuat' });
        this.hppDetailId = payload.id;
        this.hppEditId = payload.id;
      }
      this.persist();
      this.notify('Draft HPP disimpan');
      this.go('hpp-detail');
    },
    askHppFinalize() {
      if (!this.hppCanFinalize) { this.notify('Lengkapi bahan, harga, dan biaya bulanan sebelum finalisasi', 'error'); return; }
      const duplicate = this.hppHarian.find(row => row.date === this.hppForm.date && row.productId === this.hppForm.productId && row.status === 'final' && row.id !== this.hppEditId);
      if (duplicate) { this.notify('Sudah ada HPP final untuk tanggal dan produk ini. Gunakan Revisi.', 'error'); return; }
      this.askConfirm('hpp-finalize', null, 'Finalisasi HPP?', 'Dokumen akan dikunci dan tidak bisa diedit langsung. HPP per Krt: ' + this.rp2(this.hppPerDus) + '.', false, 'Finalisasi');
    },
    persistHppFinal() {
      if (!this.hppForm) return;
      if (!this.hppCanFinalize) { this.notify('Data HPP belum lengkap', 'error'); return; }
      const payload = this.hppPayload('final');
      payload.finalizedBy = this.currentUser;
      payload.finalizedAt = todayISO();
      let row;
      if (this.hppEditId) {
        row = this.hppHarian.find(item => item.id === this.hppEditId);
        if (row) Object.assign(row, payload, { id:row.id, code:row.code, version:row.version, createdAt:row.createdAt, createdBy:row.createdBy, createdById:row.createdById });
      } else {
        row = payload;
        this.hppHarian.unshift(row);
      }
      if (row) {
        this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:row.id, action:'final', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Finalisasi HPP' });
        this.hppDetailId = row.id;
        this.persist();
        this.notify('HPP berhasil difinalisasi');
        this.go('hpp-detail');
      }
    },
    viewHpp(row) { if (!row) return; this.hppDetailId = row.id; this.go('hpp-detail'); },
    get selectedHpp() { return (this.hppHarian || []).find(row => row.id === this.hppDetailId) || {}; },
    get selectedHppProductionDocs() {
      return (this.selectedHpp.productionIds || []).map(id => (this.productions || []).find(row => row.id === id)).filter(Boolean);
    },
    hppVersionRows(row) {
      if (!row) return [];
      return (this.hppHarian || []).filter(item => item.date === row.date && item.productId === row.productId).sort((a, b) => Number(a.version) - Number(b.version));
    },
    openHppRevision(row) {
      if (!row || row.status !== 'final') return;
      this.hppRevisionId = row.id;
      this.hppRevisionReason = '';
      this.hppRevisionOpen = true;
    },
    saveHppRevision() {
      const old = this.hppHarian.find(row => row.id === this.hppRevisionId);
      if (!old) { this.notify('HPP tidak ditemukan', 'error'); return; }
      if (!String(this.hppRevisionReason || '').trim()) { this.notify('Alasan revisi wajib diisi', 'error'); return; }
      old.status = 'superseded';
      old.supersededBy = this.currentUser;
      old.supersededAt = todayISO();
      old.revisionReason = this.hppRevisionReason.trim();
      const next = JSON.parse(JSON.stringify(old));
      next.id = 'hpp' + Date.now();
      next.code = this.nextHppCode();
      next.version = (Number(old.version) || 1) + 1;
      next.status = 'draft';
      next.createdBy = this.currentUser;
      next.createdById = this.currentUserId;
      next.createdAt = todayISO();
      next.finalizedBy = '';
      next.finalizedAt = '';
      next.supersededBy = '';
      next.supersededAt = '';
      next.appliedBy = '';
      next.appliedAt = '';
      this.hppHarian.unshift(next);
      this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:next.id, action:'revisi', by:this.currentUser, byRole:this.role, at:todayISO(), note:this.hppRevisionReason.trim() });
      this.hppRevisionOpen = false;
      this.hppEditId = next.id;
      const overrides = {};
      (next.materials || []).forEach(material => {
        if (material.priceOverridden) overrides[material.materialId] = { price:material.price, reason:material.overrideReason || '' };
      });
      this.hppForm = {
        date:next.date, productId:next.productId,
        allocationPercent:next.allocationPercent,
        bonusQty:next.bonusQty, bonusNote:next.bonusNote,
        materialMode:next.materialMode,
        materialOverrides:overrides,
        depreciationTotal:next.depreciationTotal,
        costPeriods:(next.costs || []).reduce((periods, cost) => { periods[cost.component] = cost.sourcePeriod; return periods; }, {})
      };
      this.persist();
      this.notify('Revisi dibuat. Versi lama ditandai Digantikan.');
      this.go('hpp-create');
    },
    askHppApply(row) {
      if (!row || row.status !== 'final') { this.notify('Hanya HPP final yang dapat diterapkan', 'error'); return; }
      const product = this.product(row.productId);
      this.askConfirm('hpp-apply', row.id, 'Terapkan ke Harga Modal?', 'Produk ' + product.name + '. Harga modal lama ' + this.rp2(product.cost) + ' menjadi ' + this.rp2(Math.round(row.hppPerDus)) + '.', false, 'Terapkan');
    },
    applyHppCost(id) {
      const row = this.hppHarian.find(item => item.id === id);
      if (!row || row.status !== 'final') return;
      const product = this.product(row.productId);
      if (!product.id) return;
      const oldCost = Number(product.cost) || 0;
      const newCost = Math.round(row.hppPerDus);
      product.cost = newCost;
      product.costHistory = product.costHistory || [];
      product.costHistory.unshift({ at:todayISO(), by:this.currentUser, old:oldCost, new:newCost, hppId:row.id, hppCode:row.code });
      row.appliedBy = this.currentUser;
      row.appliedAt = todayISO();
      this.hppLog.unshift({ id:'hlog' + Date.now(), hppId:row.id, action:'apply-cost', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Harga modal ' + oldCost + ' → ' + newCost });
      this.persist();
      this.notify('Harga modal produk diperbarui');
    },
    deleteHpp(row) {
      if (!row || row.status !== 'draft') return;
      this.askConfirm('hpp-delete', row.id, 'Hapus draft HPP?', 'Draft ' + row.code + ' akan dihapus.');
    },

    /* ---------- HPP BULANAN ---------- */
    hppBulananStatusLabel(status) { return { draft:'Draft', final:'Final', revised:'Direvisi' }[status] || status; },
    hppBulananStatusBadge(status) { return { draft:'badge-slate', final:'badge-green', revised:'badge-stone' }[status] || 'badge-slate'; },
    get filteredHppBulanan() {
      const q = String(this.hppBulananSearch || '').toLowerCase();
      return (this.hppBulanan || [])
        .filter(row => {
          if (q && !((row.code || '') + ' ' + monthLongLabel(row.period)).toLowerCase().includes(q)) return false;
          if (this.hppBulananStatus && row.status !== this.hppBulananStatus) return false;
          if (this.hppBulananPeriodFilter && row.period !== this.hppBulananPeriodFilter) return false;
          return true;
        })
        .sort((a, b) => String(b.period).localeCompare(String(a.period)) || Number(b.version) - Number(a.version));
    },
    get hppBulananPeriodOptions() {
      return [...new Set((this.hppBulanan || []).map(row => row.period).filter(Boolean))].sort().reverse();
    },
    getHppBulananFinal(period, productId = '') {
      const docs = (this.hppBulanan || []).filter(row => row.period === period && row.status === 'final');
      if (!productId) return docs[0] || null;
      return docs.find(row => (row.products || []).some(product => product.productId === productId)) || null;
    },
    getCogsBulanan(period) {
      const doc = this.getHppBulananFinal(period);
      return doc ? Number(doc.cogsTotal) || 0 : 0;
    },
    hppBulananCostValue(period, component, fallbackPeriod = '') {
      const primary = this.getBiayaBulanan(period, component);
      if (primary) return Number(primary.value) || 0;
      const fallback = fallbackPeriod ? this.getBiayaBulanan(fallbackPeriod, component) : null;
      return fallback ? Number(fallback.value) || 0 : 0;
    },
    hppBulananSource(component, usePeriod = false) {
      if (!this.hppBulananForm) return 'manual';
      const period = usePeriod ? this.hppBulananForm.period : this.hppBulananForm.costPeriod;
      const row = this.getBiayaBulanan(period, component);
      return row ? (row.sourceType || 'manual') : 'manual';
    },
    hppBulananSourceLabel(component, usePeriod = false) {
      return { manual:'Manual', payroll:'Payroll', jurnal:'Jurnal' }[this.hppBulananSource(component, usePeriod)] || 'Manual';
    },
    defaultHppBulananPool(period, costPeriod) {
      return {
        gaji:this.hppBulananCostValue(costPeriod, 'gaji'),
        uang_makan:this.hppBulananCostValue(costPeriod, 'uang_makan'),
        bpjs:this.hppBulananCostValue(costPeriod, 'bpjs'),
        air:this.hppBulananCostValue(period, 'air', costPeriod),
        listrik:this.hppBulananCostValue(period, 'listrik', costPeriod),
        overhead:this.hppBulananCostValue(period, 'overhead', costPeriod),
        bonusan:this.hppBulananCostValue(period, 'bonusan', costPeriod),
        reject:this.hppBulananCostValue(period, 'reject', costPeriod)
      };
    },
    buildHppBulananProducts(period) {
      const map = new Map();
      (this.productions || [])
        .filter(production => production.status === 'posted' && String(production.date || '').slice(0, 7) === period && !this.isDemoProduction(production))
        .forEach(production => {
          map.set(production.productId, (map.get(production.productId) || 0) + (Number(production.qty) || 0));
        });
      const end = periodEndDate(period);
      return [...map.entries()].map(([productId, qtyDus]) => {
        const recipes = (this.recipes || []).filter(recipe => recipe.productId === productId);
        const materials = recipes.map(recipe => {
          const material = this.material(recipe.materialId);
          const average = this.materialAveragePriceAt(recipe.materialId, end);
          const price = average != null ? average : (Number(material.purchasePrice) || 0);
          return {
            materialId:recipe.materialId,
            pcsPerDus:Number(recipe.qtyPerUnit) || 0,
            price,
            priceSource:'avg',
            note:'',
            subtotal:(Number(recipe.qtyPerUnit) || 0) * price
          };
        });
        return {
          productId,
          qtyDus,
          qtySource:'produksi',
          qtyNote:'',
          pcsPerDus:Math.max(0, ...materials.map(material => Number(material.pcsPerDus) || 0)),
          materials
        };
      });
    },
    startHppBulananCreate() {
      this.hppTab = 'bulanan';
      const period = todayISO().slice(0, 7);
      const costPeriod = previousMonthKey(period);
      const pool = this.defaultHppBulananPool(period, costPeriod);
      this.hppBulananEditId = null;
      this.hppBulananForm = {
        period,
        costPeriod,
        includeBonus:true,
        roundTariff:true,
        pool,
        bonusMode:'total',
        bonusTotal:pool.bonusan,
        bonusanRows:[],
        rejectMode:'total',
        rejectTotal:pool.reject,
        rejectRows:[],
        products:this.buildHppBulananProducts(period)
      };
      this.go('hpp-bulanan-create');
    },
    reloadHppBulananPeriod() {
      if (!this.hppBulananForm) return;
      const form = this.hppBulananForm;
      const pool = this.defaultHppBulananPool(form.period, form.costPeriod);
      form.pool = { ...form.pool, ...pool };
      if (form.bonusMode === 'total') form.bonusTotal = pool.bonusan;
      if (form.rejectMode === 'total') form.rejectTotal = pool.reject;
      form.products = this.buildHppBulananProducts(form.period);
    },
    reloadHppBulananCostPeriod() {
      if (!this.hppBulananForm) return;
      const form = this.hppBulananForm;
      form.pool.gaji = this.hppBulananCostValue(form.costPeriod, 'gaji');
      form.pool.uang_makan = this.hppBulananCostValue(form.costPeriod, 'uang_makan');
      form.pool.bpjs = this.hppBulananCostValue(form.costPeriod, 'bpjs');
    },
    setHppBulananBonusMode(mode) {
      if (!this.hppBulananForm) return;
      this.hppBulananForm.bonusMode = mode;
      if (mode === 'detail' && !this.hppBulananForm.bonusanRows.length) this.addHppBulananBonusRow();
    },
    setHppBulananRejectMode(mode) {
      if (!this.hppBulananForm) return;
      this.hppBulananForm.rejectMode = mode;
      if (mode === 'detail' && !this.hppBulananForm.rejectRows.length) this.addHppBulananRejectRow();
    },
    addHppBulananBonusRow() {
      if (!this.hppBulananForm) return;
      const product = (this.products || []).find(item => item.status) || {};
      this.hppBulananForm.bonusanRows.push({ productId:product.id || '', qtyDus:0, valuePerDus:0, valueSource:'hpp-dasar', total:0 });
    },
    removeHppBulananBonusRow(index) {
      if (!this.hppBulananForm) return;
      this.hppBulananForm.bonusanRows.splice(index, 1);
    },
    hppBulananDasarForProduct(productId) {
      const recipes = (this.recipes || []).filter(recipe => recipe.productId === productId);
      if (!recipes.length) return 0;
      const end = periodEndDate(this.hppBulananForm ? this.hppBulananForm.period : todayISO().slice(0, 7));
      const bahan = recipes.reduce((sum, recipe) => {
        const material = this.material(recipe.materialId);
        const average = this.materialAveragePriceAt(recipe.materialId, end);
        const price = average != null ? average : (Number(material.purchasePrice) || 0);
        return sum + (Number(recipe.qtyPerUnit) || 0) * price;
      }, 0);
      return bahan + this.hppBulananBaseTariff;
    },
    hppBulananBonusRowValue(row) {
      if (!row) return 0;
      if (row.valueSource === 'manual') return Math.max(0, Number(row.valuePerDus) || 0);
      return this.hppBulananDasarForProduct(row.productId);
    },
    addHppBulananRejectRow() {
      if (!this.hppBulananForm) return;
      const material = (this.materials || []).find(item => item.status) || {};
      const end = periodEndDate(this.hppBulananForm.period);
      const average = material.id ? this.materialAveragePriceAt(material.id, end) : null;
      this.hppBulananForm.rejectRows.push({
        materialId:material.id || '',
        qty:0,
        price:average != null ? average : (Number(material.purchasePrice) || 0),
        note:''
      });
    },
    removeHppBulananRejectRow(index) {
      if (!this.hppBulananForm) return;
      this.hppBulananForm.rejectRows.splice(index, 1);
    },
    addHppBulananRejectFromOpname() {
      const form = this.hppBulananForm;
      if (!form) return;
      const rows = (this.opnames || []).filter(row => row.materialId && String(row.date || '').slice(0, 7) === form.period && (Number(row.qty) || 0) > 0);
      if (!rows.length) { this.notify('Tidak ada opname bahan positif pada periode ini', 'error'); return; }
      const totals = {};
      rows.forEach(row => { totals[row.materialId] = (totals[row.materialId] || 0) + (Number(row.qty) || 0); });
      const end = periodEndDate(form.period);
      form.rejectMode = 'detail';
      Object.keys(totals).forEach(materialId => {
        const average = this.materialAveragePriceAt(materialId, end);
        const material = this.material(materialId);
        form.rejectRows.push({
          materialId,
          qty:totals[materialId],
          price:average != null ? average : (Number(material.purchasePrice) || 0),
          note:'Dari opname'
        });
      });
    },
    syncHppBulananCostComponents() {
      const form = this.hppBulananForm;
      if (!form) return;
      const values = { air:Number(form.pool.air) || 0, bonusan:this.hppBulananBonusTotal, reject:this.hppBulananRejectTotal };
      this.biayaProduksiBulanan = this.biayaProduksiBulanan || [];
      Object.keys(values).forEach(component => {
        let row = this.getBiayaBulanan(form.period, component);
        if (!row) {
          row = {
            id:'bpb' + Date.now() + Math.random().toString(16).slice(2),
            period:form.period,
            component,
            value:values[component],
            employeeCount:null,
            sourceType:'manual',
            type:'estimasi',
            note:'HPP Bulanan',
            createdBy:this.currentUser,
            updatedBy:this.currentUser,
            updatedAt:todayISO(),
            history:[]
          };
          this.biayaProduksiBulanan.push(row);
          return;
        }
        row.value = values[component];
        row.sourceType = 'manual';
        row.type = 'estimasi';
        row.note = 'HPP Bulanan';
        row.updatedBy = this.currentUser;
        row.updatedAt = todayISO();
      });
    },
    onHppBulananRejectMaterial(row) {
      if (!row || !this.hppBulananForm) return;
      const end = periodEndDate(this.hppBulananForm.period);
      const average = this.materialAveragePriceAt(row.materialId, end);
      const material = this.material(row.materialId);
      row.price = average != null ? average : (Number(material.purchasePrice) || 0);
    },
    get hppBulananBonusTotal() {
      const form = this.hppBulananForm;
      if (!form) return 0;
      if (form.bonusMode === 'total') return Math.max(0, Number(form.bonusTotal) || 0);
      return (form.bonusanRows || []).reduce((sum, row) => sum + (Number(row.qtyDus) || 0) * this.hppBulananBonusRowValue(row), 0);
    },
    get hppBulananRejectTotal() {
      const form = this.hppBulananForm;
      if (!form) return 0;
      if (form.rejectMode === 'total') return Math.max(0, Number(form.rejectTotal) || 0);
      return (form.rejectRows || []).reduce((sum, row) => sum + (Number(row.qty) || 0) * (Number(row.price) || 0), 0);
    },
    get hppBulananBasePool() {
      const pool = this.hppBulananForm ? this.hppBulananForm.pool : {};
      return ['gaji','uang_makan','bpjs','air','listrik','overhead'].reduce((sum, key) => sum + (Number(pool[key]) || 0), 0);
    },
    get hppBulananEffectivePool() {
      const form = this.hppBulananForm;
      if (!form) return 0;
      return this.hppBulananBasePool + (form.includeBonus ? this.hppBulananBonusTotal : 0) + this.hppBulananRejectTotal;
    },
    get hppBulananTotalDus() {
      return (this.hppBulananForm ? this.hppBulananForm.products : []).reduce((sum, product) => sum + (Number(product.qtyDus) || 0), 0);
    },
    get hppBulananTariffRaw() {
      const total = this.hppBulananTotalDus;
      return total > 0 ? this.hppBulananEffectivePool / total : 0;
    },
    get hppBulananTariffPerDus() {
      return this.hppBulananForm && this.hppBulananForm.roundTariff ? Math.round(this.hppBulananTariffRaw) : this.hppBulananTariffRaw;
    },
    get hppBulananBaseTariff() {
      const total = this.hppBulananTotalDus;
      return total > 0 ? this.hppBulananBasePool / total : 0;
    },
    hppBulananProductComputed(product) {
      const tariff = this.hppBulananTariffPerDus;
      const baseTariff = this.hppBulananBaseTariff;
      const materials = (product.materials || []).map(material => ({
        ...material,
        subtotal:(Number(material.pcsPerDus) || 0) * (Number(material.price) || 0)
      }));
      const bahanPerDus = materials.reduce((sum, material) => sum + material.subtotal, 0);
      const pcsPerDus = Number(product.pcsPerDus) || Math.max(0, ...materials.map(material => Number(material.pcsPerDus) || 0));
      const hppPerDus = bahanPerDus + tariff;
      const qtyDus = Number(product.qtyDus) || 0;
      return {
        ...product,
        materials,
        bahanPerDus,
        pcsPerDus,
        hppDasarPerDus:bahanPerDus + baseTariff,
        hppPerDus,
        hppPerPcs:pcsPerDus > 0 ? hppPerDus / pcsPerDus : 0,
        totalCost:hppPerDus * qtyDus
      };
    },
    get hppBulananProductsComputed() {
      return (this.hppBulananForm ? this.hppBulananForm.products : []).map(product => this.hppBulananProductComputed(product));
    },
    get hppBulananCogsTotal() {
      return this.hppBulananProductsComputed.reduce((sum, product) => sum + product.totalCost, 0);
    },
    hppBulananValidationError() {
      const form = this.hppBulananForm;
      if (!form) return 'Form HPP Bulanan belum tersedia';
      if (!form.period) return 'Periode wajib dipilih';
      if (!(form.products || []).length) return 'Tidak ada produk dengan resep dan produksi pada periode ini';
      if (this.hppBulananTotalDus <= 0) return 'Total dus harus lebih dari 0';
      for (const product of form.products) {
        const name = this.productName(product.productId);
        if ((Number(product.qtyDus) || 0) <= 0) return 'Qty dus ' + name + ' harus lebih dari 0';
        if (product.qtySource === 'manual' && !String(product.qtyNote || '').trim()) return 'Alasan wajib diisi untuk qty manual ' + name;
        if (!(product.materials || []).length) return 'Produk ' + name + ' belum punya resep';
        for (const material of product.materials) {
          if (!material.materialId) return 'Bahan pada ' + name + ' belum dipilih';
          if ((Number(material.pcsPerDus) || 0) <= 0) return 'Pcs per dus bahan ' + this.materialName(material.materialId) + ' harus lebih dari 0';
          if ((Number(material.price) || 0) < 0) return 'Harga bahan ' + this.materialName(material.materialId) + ' tidak boleh negatif';
          if (material.priceSource === 'manual' && !String(material.note || '').trim()) return 'Catatan wajib diisi untuk harga manual ' + this.materialName(material.materialId);
        }
      }
      if (form.bonusMode === 'detail' && (form.bonusanRows || []).some(row => !row.productId)) return 'Produk bonusan wajib dipilih';
      if (form.rejectMode === 'detail' && (form.rejectRows || []).some(row => !row.materialId)) return 'Barang reject wajib dipilih';
      return null;
    },
    hppBulananPayload(status) {
      const form = this.hppBulananForm;
      const products = this.hppBulananProductsComputed.map(product => ({
        productId:product.productId,
        qtyDus:Number(product.qtyDus) || 0,
        qtySource:product.qtySource || 'produksi',
        qtyNote:product.qtyNote || '',
        pcsPerDus:Number(product.pcsPerDus) || 0,
        materials:(product.materials || []).map(material => ({
          materialId:material.materialId,
          pcsPerDus:Number(material.pcsPerDus) || 0,
          price:Number(material.price) || 0,
          priceSource:material.priceSource || 'avg',
          note:material.note || '',
          subtotal:Number(material.subtotal) || 0
        })),
        bahanPerDus:product.bahanPerDus,
        hppDasarPerDus:product.hppDasarPerDus,
        hppPerDus:product.hppPerDus,
        hppPerPcs:product.hppPerPcs,
        totalCost:product.totalCost
      }));
      const bonusanTotal = this.hppBulananBonusTotal;
      const rejectTotal = this.hppBulananRejectTotal;
      const pool = {
        gaji:Number(form.pool.gaji) || 0,
        uang_makan:Number(form.pool.uang_makan) || 0,
        bpjs:Number(form.pool.bpjs) || 0,
        air:Number(form.pool.air) || 0,
        listrik:Number(form.pool.listrik) || 0,
        overhead:Number(form.pool.overhead) || 0,
        bonusan:bonusanTotal,
        reject:rejectTotal
      };
      const version = (this.hppBulanan || []).filter(row => row.period === form.period).reduce((max, row) => Math.max(max, Number(row.version) || 0), 0) + 1;
      return {
        id:'hpb' + Date.now(),
        code:'HPB-' + form.period + '-' + String(version).padStart(4, '0'),
        period:form.period,
        version,
        status,
        costPeriod:form.costPeriod,
        includeBonus:!!form.includeBonus,
        roundTariff:!!form.roundTariff,
        pool,
        bonusanRows:(form.bonusanRows || []).map(row => ({
          productId:row.productId,
          qtyDus:Number(row.qtyDus) || 0,
          valuePerDus:this.hppBulananBonusRowValue(row),
          valueSource:row.valueSource || 'hpp-dasar',
          total:(Number(row.qtyDus) || 0) * this.hppBulananBonusRowValue(row)
        })),
        rejectRows:(form.rejectRows || []).map(row => ({
          materialId:row.materialId,
          qty:Number(row.qty) || 0,
          price:Number(row.price) || 0,
          total:(Number(row.qty) || 0) * (Number(row.price) || 0),
          note:row.note || ''
        })),
        poolTotal:this.hppBulananEffectivePool,
        totalDus:this.hppBulananTotalDus,
        tariffRaw:this.hppBulananTariffRaw,
        tariffPerDus:this.hppBulananTariffPerDus,
        products,
        cogsTotal:products.reduce((sum, product) => sum + product.totalCost, 0),
        createdBy:this.currentUser,
        createdAt:todayISO(),
        finalizedBy:'',
        finalizedAt:'',
        reviseReason:'',
        appliedBy:'',
        appliedAt:'',
        history:[]
      };
    },
    saveHppBulananDraft() {
      const error = this.hppBulananValidationError();
      if (error) { this.notify(error, 'error'); return; }
      const payload = this.hppBulananPayload('draft');
      if (this.hppBulananEditId) {
        const row = (this.hppBulanan || []).find(item => item.id === this.hppBulananEditId);
        if (!row) { this.notify('Draft HPP Bulanan tidak ditemukan', 'error'); return; }
        const history = row.history || [];
        Object.assign(row, payload, { id:row.id, code:row.code, version:row.version, createdAt:row.createdAt, createdBy:row.createdBy });
        this.hppBulananDetailId = row.id;
        this.hppBulananEditId = row.id;
        row.history = history;
        row.history.unshift({ action:'draft', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Draft diperbarui' });
      } else {
        payload.history = [{ action:'draft', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Draft dibuat' }];
        (this.hppBulanan = this.hppBulanan || []).unshift(payload);
        this.hppBulananDetailId = payload.id;
        this.hppBulananEditId = payload.id;
      }
      this.syncHppBulananCostComponents();
      this.persist();
      this.notify('Draft HPP Bulanan disimpan');
      this.go('hpp-bulanan-detail');
    },
    askHppBulananFinalize() {
      const error = this.hppBulananValidationError();
      if (error) { this.notify(error, 'error'); return; }
      const duplicate = (this.hppBulanan || []).find(row => row.period === this.hppBulananForm.period && row.status === 'final' && row.id !== this.hppBulananEditId);
      if (duplicate) { this.notify('Sudah ada HPP Bulanan final untuk periode ini. Gunakan Revisi.', 'error'); return; }
      this.askConfirm('hpp-bulanan-finalize', null, 'Finalisasi HPP Bulanan?', 'Dokumen akan dikunci. COGS bulan: ' + this.rp(this.hppBulananCogsTotal) + '.', false, 'Finalisasi');
    },
    persistHppBulananFinal() {
      const error = this.hppBulananValidationError();
      if (error) { this.notify(error, 'error'); return; }
      const payload = this.hppBulananPayload('final');
      payload.finalizedBy = this.currentUser;
      payload.finalizedAt = todayISO();
      let row;
      if (this.hppBulananEditId) {
        row = (this.hppBulanan || []).find(item => item.id === this.hppBulananEditId);
        if (row) {
          const history = row.history || [];
          Object.assign(row, payload, { id:row.id, code:row.code, version:row.version, createdAt:row.createdAt, createdBy:row.createdBy });
          row.history = history;
        }
      } else {
        row = payload;
        (this.hppBulanan = this.hppBulanan || []).unshift(row);
      }
      if (row) {
        row.history = row.history || [];
        row.history.unshift({ action:'final', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Finalisasi HPP Bulanan' });
        this.syncHppBulananCostComponents();
        this.hppBulananDetailId = row.id;
        this.persist();
        this.notify('HPP Bulanan berhasil difinalisasi');
        this.go('hpp-bulanan-detail');
      }
    },
    editHppBulanan(row) {
      if (!row || row.status !== 'draft') return;
      this.hppBulananEditId = row.id;
      this.hppBulananDetailId = row.id;
      this.hppBulananForm = {
        period:row.period,
        costPeriod:row.costPeriod,
        includeBonus:row.includeBonus !== false,
        roundTariff:row.roundTariff !== false,
        pool:{ ...row.pool },
        bonusMode:(row.bonusanRows || []).length ? 'detail' : 'total',
        bonusTotal:Number(row.pool && row.pool.bonusan) || 0,
        bonusanRows:JSON.parse(JSON.stringify(row.bonusanRows || [])),
        rejectMode:(row.rejectRows || []).length ? 'detail' : 'total',
        rejectTotal:Number(row.pool && row.pool.reject) || 0,
        rejectRows:JSON.parse(JSON.stringify(row.rejectRows || [])),
        products:JSON.parse(JSON.stringify(row.products || []))
      };
      this.hppTab = 'bulanan';
      this.go('hpp-bulanan-create');
    },
    viewHppBulanan(row) {
      if (!row) return;
      this.hppTab = 'bulanan';
      this.hppBulananDetailId = row.id;
      this.go('hpp-bulanan-detail');
    },
    get selectedHppBulanan() {
      return (this.hppBulanan || []).find(row => row.id === this.hppBulananDetailId) || {};
    },
    hppBulananVersionRows(row) {
      if (!row) return [];
      return (this.hppBulanan || []).filter(item => item.period === row.period).sort((a, b) => Number(a.version) - Number(b.version));
    },
    openHppBulananRevision(row) {
      if (!row || row.status !== 'final') return;
      this.hppBulananRevisionId = row.id;
      this.hppBulananRevisionReason = '';
      this.hppBulananRevisionOpen = true;
    },
    saveHppBulananRevision() {
      const old = (this.hppBulanan || []).find(row => row.id === this.hppBulananRevisionId);
      if (!old) { this.notify('HPP Bulanan tidak ditemukan', 'error'); return; }
      if (!String(this.hppBulananRevisionReason || '').trim()) { this.notify('Alasan revisi wajib diisi', 'error'); return; }
      old.status = 'revised';
      old.reviseReason = this.hppBulananRevisionReason.trim();
      const next = JSON.parse(JSON.stringify(old));
      next.id = 'hpb' + Date.now();
      next.version = (Number(old.version) || 1) + 1;
      next.code = 'HPB-' + old.period + '-' + String(next.version).padStart(4, '0');
      next.status = 'draft';
      next.createdBy = this.currentUser;
      next.createdAt = todayISO();
      next.finalizedBy = '';
      next.finalizedAt = '';
      next.appliedBy = '';
      next.appliedAt = '';
      next.history = next.history || [];
      next.history.unshift({ action:'revisi', by:this.currentUser, byRole:this.role, at:todayISO(), note:this.hppBulananRevisionReason.trim() });
      old.history = old.history || [];
      old.history.unshift({ action:'revised', by:this.currentUser, byRole:this.role, at:todayISO(), note:this.hppBulananRevisionReason.trim() });
      (this.hppBulanan = this.hppBulanan || []).unshift(next);
      this.hppBulananRevisionOpen = false;
      this.hppBulananEditId = next.id;
      this.hppBulananForm = {
        period:next.period,
        costPeriod:next.costPeriod,
        includeBonus:next.includeBonus !== false,
        roundTariff:next.roundTariff !== false,
        pool:{ ...next.pool },
        bonusMode:(next.bonusanRows || []).length ? 'detail' : 'total',
        bonusTotal:Number(next.pool && next.pool.bonusan) || 0,
        bonusanRows:JSON.parse(JSON.stringify(next.bonusanRows || [])),
        rejectMode:(next.rejectRows || []).length ? 'detail' : 'total',
        rejectTotal:Number(next.pool && next.pool.reject) || 0,
        rejectRows:JSON.parse(JSON.stringify(next.rejectRows || [])),
        products:JSON.parse(JSON.stringify(next.products || []))
      };
      this.persist();
      this.notify('Revisi HPP Bulanan dibuat. Versi lama ditandai Direvisi.');
      this.go('hpp-bulanan-create');
    },
    askHppBulananApply(row) {
      if (!row || row.status !== 'final') { this.notify('Hanya HPP Bulanan final yang dapat diterapkan', 'error'); return; }
      this.askConfirm('hpp-bulanan-apply', row.id, 'Terapkan ke Harga Modal?', 'Harga modal ' + (row.products || []).length + ' produk akan diperbarui dari HPP Bulanan ' + row.code + '.', false, 'Terapkan');
    },
    applyHppBulananCost(id) {
      const row = (this.hppBulanan || []).find(item => item.id === id);
      if (!row || row.status !== 'final') return;
      (row.products || []).forEach(item => {
        const product = this.product(item.productId);
        if (!product.id) return;
        const oldCost = Number(product.cost) || 0;
        const newCost = Math.round(Number(item.hppPerDus) || 0);
        product.cost = newCost;
        product.costHistory = product.costHistory || [];
        product.costHistory.unshift({ at:todayISO(), by:this.currentUser, old:oldCost, new:newCost, hppId:row.id, hppCode:row.code });
      });
      row.appliedBy = this.currentUser;
      row.appliedAt = todayISO();
      row.history = row.history || [];
      row.history.unshift({ action:'apply-cost', by:this.currentUser, byRole:this.role, at:todayISO(), note:'Harga modal diperbarui' });
      this.persist();
      this.notify('Harga modal produk diperbarui');
    },
    deleteHppBulanan(row) {
      if (!row || row.status !== 'draft') return;
      this.askConfirm('hpp-bulanan-delete', row.id, 'Hapus draft HPP Bulanan?', 'Draft ' + row.code + ' akan dihapus.');
    },
    calculateHppBulanan(input) {
      const pool = input.pool || {};
      const includeBonus = input.includeBonus !== false;
      const roundTariff = input.roundTariff !== false;
      const basePool = ['gaji','uang_makan','bpjs','air','listrik','overhead'].reduce((sum, key) => sum + (Number(pool[key]) || 0), 0);
      const bonusTotal = input.bonusTotal != null ? Number(input.bonusTotal) || 0 : Number(pool.bonusan) || 0;
      const rejectTotal = input.rejectTotal != null ? Number(input.rejectTotal) || 0 : Number(pool.reject) || 0;
      const products = (input.products || []).map(product => {
        const materials = (product.materials || []).map(material => ({
          ...material,
          subtotal:(Number(material.pcsPerDus) || 0) * (Number(material.price) || 0)
        }));
        const bahanPerDus = materials.reduce((sum, material) => sum + material.subtotal, 0);
        const pcsPerDus = Number(product.pcsPerDus) || Math.max(0, ...materials.map(material => Number(material.pcsPerDus) || 0));
        return { ...product, materials, bahanPerDus, pcsPerDus };
      });
      const totalDus = input.totalDus != null ? Number(input.totalDus) || 0 : products.reduce((sum, product) => sum + (Number(product.qtyDus) || 0), 0);
      const effectivePool = basePool + (includeBonus ? bonusTotal : 0) + rejectTotal;
      const tariffRaw = totalDus > 0 ? effectivePool / totalDus : 0;
      const tariffPerDus = roundTariff ? Math.round(tariffRaw) : tariffRaw;
      const baseTariff = totalDus > 0 ? basePool / totalDus : 0;
      const computedProducts = products.map(product => {
        const hppPerDus = product.bahanPerDus + tariffPerDus;
        const qtyDus = Number(product.qtyDus) || 0;
        return {
          ...product,
          hppDasarPerDus:product.bahanPerDus + baseTariff,
          hppPerDus,
          hppPerPcs:product.pcsPerDus > 0 ? hppPerDus / product.pcsPerDus : 0,
          totalCost:hppPerDus * qtyDus
        };
      });
      return {
        basePool,
        effectivePool,
        bonusTotal,
        rejectTotal,
        totalDus,
        tariffRaw,
        tariffPerDus,
        baseTariff,
        products:computedProducts,
        cogsTotal:computedProducts.reduce((sum, product) => sum + product.totalCost, 0)
      };
    },
    runHppBulananSelfTest() {
      const pool = {
        gaji:32637692,
        uang_makan:7720000,
        bpjs:3382080,
        air:286400,
        listrik:14567560,
        overhead:3587000,
        bonusan:9187785,
        reject:4902758
      };
      const products = [
        { productId:'cup', qtyDus:38288, pcsPerDus:48, materials:[
          { materialId:'lid', pcsPerDus:48, price:41 }, { materialId:'cup', pcsPerDus:48, price:123 },
          { materialId:'straw', pcsPerDus:48, price:15 }, { materialId:'box', pcsPerDus:1, price:3309 },
          { materialId:'lakban', pcsPerDus:2, price:31 }
        ] },
        { productId:'b660', qtyDus:85, pcsPerDus:24, materials:[
          { materialId:'botol', pcsPerDus:24, price:815 }, { materialId:'tutup', pcsPerDus:24, price:122 },
          { materialId:'shiring', pcsPerDus:24, price:46 }, { materialId:'box', pcsPerDus:1, price:4667 },
          { materialId:'lakban', pcsPerDus:2, price:32 }
        ] },
        { productId:'b330', qtyDus:423, pcsPerDus:24, materials:[
          { materialId:'botol', pcsPerDus:24, price:836 }, { materialId:'tutup', pcsPerDus:24, price:122 },
          { materialId:'shiring', pcsPerDus:24, price:46 }, { materialId:'box', pcsPerDus:1, price:3314 },
          { materialId:'lakban', pcsPerDus:2, price:31 }
        ] }
      ];
      const rounded = this.calculateHppBulanan({ pool, products, includeBonus:true, roundTariff:true });
      const raw = this.calculateHppBulanan({ pool, products, includeBonus:true, roundTariff:false });
      const noBonus = this.calculateHppBulanan({ pool, products, includeBonus:false, roundTariff:true });
      const hppExpected = [13929, 30289, 29438];
      const costExpected = [533313552, 2574565, 12452274];
      const ok = rounded.tariffPerDus === 1966
        && rounded.products.every((product, index) => Math.abs(product.hppPerDus - hppExpected[index]) < 0.01)
        && rounded.products.every((product, index) => Math.abs(product.totalCost - costExpected[index]) < 0.5)
        && Math.abs(rounded.cogsTotal - 548340391) < 0.5
        && Math.abs(raw.tariffRaw - 1965.96) < 0.01
        && noBonus.tariffPerDus === 1729;
      this.hppBulananSelfTestResult = { ok, rounded, raw, noBonus, expected:{ tariff:1966, hpp:hppExpected, cost:costExpected, cogs:548340391 } };
      this.notify(ok ? 'Self-test HPP Bulanan berhasil: COGS ' + this.rp(rounded.cogsTotal) : 'Self-test HPP Bulanan gagal', ok ? 'success' : 'error');
    },
    calculateHpp(input) {
      const output = Number(input.outputQty) || 0;
      const workingDays = Number(input.workingDays) || 0;
      const allocation = Number(input.allocationPercent) || 0;
      const rounding = input.roundingMode || 'none';
      const material = (input.materials || []).reduce((sum, row) => sum + (Number(row.qtyPerDus) || 0) * (Number(row.price) || 0), 0);
      let monthly = 0;
      (input.monthlyCosts || []).forEach(row => {
        let per = 0;
        if (output > 0 && workingDays > 0) {
          per = ((Number(row.value) || 0) / workingDays / output) * (allocation / 100);
          if (rounding === 'component') per = Math.round(per);
        }
        monthly += per;
      });
      const waterRaw = ((Number(input.waterLitersPerKrt) || 0) / 1000) * (Number(input.waterPricePerM3) || 0);
      const water = rounding === 'component' ? Math.round(waterRaw) : waterRaw;
      const depreciationRaw = output > 0 ? ((Number(input.depreciationTotal) || 0) / output) * (allocation / 100) : 0;
      const depreciation = rounding === 'component' ? Math.round(depreciationRaw) : depreciationRaw;
      const production = monthly + water + depreciation;
      let hpp = material + production;
      if (rounding === 'final') hpp = Math.round(hpp);
      return { material, monthly, water, depreciation, production, hpp };
    },
    runHppSelfTest() {
      const result = this.calculateHpp({
        outputQty:1515,
        workingDays:26,
        allocationPercent:100,
        materials:[
          { qtyPerDus:48, price:39 }, { qtyPerDus:48, price:132 }, { qtyPerDus:48, price:15 },
          { qtyPerDus:1, price:3309 }, { qtyPerDus:2, price:31 }
        ],
        monthlyCosts:[
          { component:'gaji', value:32637692 }, { component:'uang_makan', value:7720000 },
          { component:'bpjs', value:3382080 }, { component:'listrik', value:14567560 },
          { component:'overhead', value:0 }
        ],
        waterLitersPerKrt:10.5,
        waterPricePerM3:7000,
        depreciationTotal:0,
        roundingMode:'none'
      });
      const expected = 13852.76;
      const ok = Math.abs(result.hpp - expected) <= 0.05;
      this.hppSelfTestResult = { ok, result, expected };
      this.notify(ok ? 'Self-test HPP berhasil: ' + this.rp2(result.hpp) : 'Self-test HPP gagal: ' + this.rp2(result.hpp), ok ? 'success' : 'error');
    },
    /* ---------- HR ---------- */
    get employeePositions() {
      const base = ['Admin','Akunting','Logistik','Sales','Operator Mesin','Helper Mesin','Pengemasan','Kepala Gudang','Supir','Security'];
      return [...new Set([...base, ...(this.employees || []).map(employee => employee.position).filter(Boolean)])].sort();
    },
    employee(id) { return (this.employees || []).find(item => item.id === id) || {}; },
    employeeName(id) { return this.employee(id).name || '-'; },
    get employeesActive() { return (this.employees || []).filter(employee => employee.status).sort((a, b) => String(a.nip).localeCompare(String(b.nip))); },
    get filteredEmployees() {
      const q = String(this.employeeSearch || '').toLowerCase();
      return (this.employees || []).filter(employee => {
        if (q && !((employee.nip || '') + ' ' + (employee.name || '') + ' ' + (employee.position || '')).toLowerCase().includes(q)) return false;
        if (this.employeeGroup && employee.group !== this.employeeGroup) return false;
        if (this.employeeStatus && String(employee.status) !== this.employeeStatus) return false;
        return true;
      }).sort((a, b) => String(a.nip).localeCompare(String(b.nip)));
    },
    openEmployee(employee = null) {
      this.employeeEditId = employee ? employee.id : null;
      this.employeeForm = employee
        ? { nip:employee.nip, pin:employee.pin || '', name:employee.name, group:employee.group, position:employee.position, joinDate:employee.joinDate || todayISO(), status:employee.status !== false, resignDate:employee.resignDate || '', basicSalary:Number(employee.basicSalary) || 0, mealPerDay:Number(employee.mealPerDay) || Number(this.hrSettings.mealDefault) || 20000, bank:employee.bank || '', accountNumber:employee.accountNumber || '', note:employee.note || '' }
        : { nip:'', pin:'', name:'', group:'Produksi', position:'Operator Mesin', joinDate:todayISO(), status:true, resignDate:'', basicSalary:0, mealPerDay:Number(this.hrSettings.mealDefault) || 20000, bank:'', accountNumber:'', note:'' };
      this.employeeModalOpen = true;
    },
    saveEmployee() {
      const form = this.employeeForm;
      const nip = String(form.nip || '').trim();
      const pin = String(form.pin || '').trim();
      if (!nip || !String(form.name || '').trim()) { this.notify('NIP dan nama wajib diisi', 'error'); return; }
      if ((this.employees || []).some(employee => employee.id !== this.employeeEditId && String(employee.nip).toLowerCase() === nip.toLowerCase())) { this.notify('NIP sudah dipakai', 'error'); return; }
      if (pin && (this.employees || []).some(employee => employee.id !== this.employeeEditId && String(employee.pin) === pin)) { this.notify('PIN mesin sudah dipakai', 'error'); return; }
      if ((Number(form.basicSalary) || 0) < 0) { this.notify('Gaji pokok tidak boleh negatif', 'error'); return; }
      const payload = {
        nip, pin, name:String(form.name).trim(), group:form.group, position:String(form.position || '').trim() || '-',
        joinDate:form.joinDate || todayISO(), status:form.status !== false,
        resignDate:form.status === false ? (form.resignDate || todayISO()) : '',
        basicSalary:Number(form.basicSalary) || 0,
        mealPerDay:Number(form.mealPerDay) || Number(this.hrSettings.mealDefault) || 20000,
        bank:String(form.bank || '').trim(), accountNumber:String(form.accountNumber || '').trim(),
        note:String(form.note || '').trim()
      };
      if (this.employeeEditId) {
        const employee = this.employee(this.employeeEditId);
        if (employee.id) Object.assign(employee, payload);
        this.notify('Data pegawai diperbarui');
      } else {
        (this.employees = this.employees || []).push({ id:'emp' + Date.now(), ...payload });
        this.notify('Pegawai baru ditambahkan');
      }
      this.employeeModalOpen = false;
      this.persist();
    },
    toggleEmployeeStatus(employee) {
      if (!employee || !employee.id) return;
      employee.status = !employee.status;
      employee.resignDate = employee.status ? '' : todayISO();
      this.persist();
      this.notify('Status pegawai diperbarui');
    },
    hrPeriodDays(period) {
      const last = Number(periodEndDate(period).slice(-2));
      return Array.from({ length:last }, (_, index) => period + '-' + pad2(index + 1));
    },
    isWeeklyOffDate(date) {
      const day = new Date(date + 'T12:00:00').getDay();
      return (this.hrSettings.weeklyOff || [0]).includes(day);
    },
    isHolidayDate(date) { return (this.hrSettings.holidays || []).includes(date); },
    attendanceScanFor(employeeId, date) { return (this.attendanceScans || []).find(scan => scan.employeeId === employeeId && scan.date === date) || null; },
    attendanceNotesFor(employeeId, date) { return (this.attendanceNotes || []).filter(note => note.employeeId === employeeId && note.date === date); },
    attendanceNoteFor(employeeId, date, types = []) {
      return this.attendanceNotesFor(employeeId, date).find(note => !types.length || types.includes(note.type)) || null;
    },
    attendanceGroupSettings(employee) {
      const groups = this.hrSettings.groups || {};
      return groups[employee.group] || { start:'08:00', tolerance:15, lateNoMeal:false };
    },
    attendanceTimeMinutes(time) {
      const match = String(time || '').match(/(\d{1,2}):(\d{2})/);
      return match ? Number(match[1]) * 60 + Number(match[2]) : null;
    },
    attendanceLate(employee, date) {
      if (this.attendanceNoteFor(employee.id, date, ['dispensasi'])) return false;
      const scan = this.attendanceScanFor(employee.id, date);
      if (!scan || !scan.scan1) return false;
      const group = this.attendanceGroupSettings(employee);
      const start = this.attendanceTimeMinutes(group.start || '08:00');
      const actual = this.attendanceTimeMinutes(scan.scan1);
      if (start == null || actual == null) return false;
      return actual > start + (Number(group.tolerance) || 0);
    },
    attendancePerluCek(scan) {
      if (!scan || !scan.scan1) return false;
      const minutes = this.attendanceTimeMinutes(scan.scan1);
      return minutes != null && (minutes < 300 || minutes > 720);
    },
    attendanceStatus(employee, date) {
      const note = this.attendanceNoteFor(employee.id, date);
      if (this.isWeeklyOffDate(date) || this.isHolidayDate(date)) return note && note.type === 'lembur' ? 'L' : '·';
      const special = this.attendanceNoteFor(employee.id, date, ['izin','sakit','cuti','alfa']);
      if (special) return { izin:'I', sakit:'S', cuti:'C', alfa:'A' }[special.type] || 'A';
      const scan = this.attendanceScanFor(employee.id, date);
      return scan ? 'H' : 'A';
    },
    attendanceStatusLabel(code) {
      return { H:'Hadir', I:'Izin', S:'Sakit/Urgent', C:'Cuti', A:'Alfa', L:'Lembur', '·':'Libur' }[code] || code;
    },
    attendanceStatusClass(code) {
      return { H:'bg-emerald-50 text-emerald-700', I:'bg-blue-50 text-blue-700', S:'bg-amber-50 text-amber-700', C:'bg-purple-50 text-purple-700', A:'bg-yellow-100 text-yellow-800', L:'bg-indigo-50 text-indigo-700', '·':'bg-slate-100 text-slate-400' }[code] || 'bg-slate-50 text-slate-500';
    },
    attendanceSummary(employee, period) {
      const summary = { hadir:0, izin:0, sakit:0, cuti:0, alfa:0, lembur:0, telat:0, telatTanpaMakan:0, hkPotong:0, hkDibayar:Number(this.hrSettings.hkStandar) || 26 };
      const group = this.attendanceGroupSettings(employee);
      this.hrPeriodDays(period).forEach(date => {
        const code = this.attendanceStatus(employee, date);
        if (this.attendanceNoteFor(employee.id, date, ['lembur'])) summary.lembur += 1;
        if (code === 'H') {
          summary.hadir += 1;
          if (this.attendanceLate(employee, date)) {
            summary.telat += 1;
            if (group.lateNoMeal) summary.telatTanpaMakan += 1;
          }
        } else if (code === 'I') summary.izin += 1;
        else if (code === 'S') summary.sakit += 1;
        else if (code === 'C') summary.cuti += 1;
        else if (code === 'A') summary.alfa += 1;
      });
      const rules = this.hrSettings.hkRules || {};
      summary.hkPotong = (rules.alfa ? summary.alfa : 0) + (rules.izin ? summary.izin : 0) + (rules.sakit ? summary.sakit : 0) + (rules.cuti ? summary.cuti : 0);
      summary.hkDibayar = Math.max(0, (Number(this.hrSettings.hkStandar) || 26) - summary.hkPotong);
      return summary;
    },
    attendanceCell(employee, date) {
      const scan = this.attendanceScanFor(employee.id, date);
      return { status:this.attendanceStatus(employee, date), late:this.attendanceLate(employee, date), perluCek:this.attendancePerluCek(scan), scan, notes:this.attendanceNotesFor(employee.id, date) };
    },
    get attendanceEmployees() {
      return this.employeesActive.filter(employee => !this.attendanceEmployeeFilter || employee.id === this.attendanceEmployeeFilter);
    },
    get attendanceRecapRows() {
      return this.attendanceEmployees.map(employee => ({ employee, days:this.hrPeriodDays(this.attendancePeriod).map(date => ({ date, ...this.attendanceCell(employee, date) })), summary:this.attendanceSummary(employee, this.attendancePeriod) }));
    },
    get attendanceAutoAlfaCount() {
      return this.attendanceRecapRows.reduce((sum, row) => sum + row.days.filter(day => day.status === 'A').length, 0);
    },
    get attendanceScanRows() {
      const q = String(this.attendanceSearch || '').toLowerCase();
      return (this.attendanceScans || [])
        .filter(scan => String(scan.date || '').slice(0, 7) === this.attendancePeriod)
        .filter(scan => !this.attendanceEmployeeFilter || scan.employeeId === this.attendanceEmployeeFilter)
        .filter(scan => {
          const employee = this.employee(scan.employeeId);
          return !q || ((scan.pin || '') + ' ' + (scan.nip || '') + ' ' + (employee.name || scan.name || '') + ' ' + scan.date).toLowerCase().includes(q);
        })
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(a.name || '').localeCompare(String(b.name || '')));
    },
    openAttendanceNote(employeeId = '', date = '') {
      this.attendanceNoteForm = { employeeId:employeeId || (this.attendanceEmployees[0] || {}).id || '', date:date || this.attendancePeriod + '-01', dateEnd:'', type:'izin', note:'' };
      this.attendanceNoteOpen = true;
    },
    saveAttendanceNote() {
      const form = this.attendanceNoteForm;
      const employee = this.employee(form.employeeId);
      if (!employee.id || !form.date) { this.notify('Pegawai dan tanggal wajib diisi', 'error'); return; }
      const end = form.dateEnd && form.dateEnd >= form.date ? form.dateEnd : form.date;
      const dates = [];
      let cursor = form.date;
      while (cursor <= end) { dates.push(cursor); cursor = shiftISO(cursor, 1); if (dates.length > 62) break; }
      dates.forEach(date => {
        const existing = this.attendanceNoteFor(employee.id, date, [form.type]);
        if (existing) {
          existing.note = form.note || existing.note;
          existing.by = this.currentUser;
          return;
        }
        (this.attendanceNotes = this.attendanceNotes || []).push({
          id:'note' + Date.now() + Math.random().toString(16).slice(2),
          employeeId:employee.id, date, type:form.type, note:form.note || '',
          by:this.currentUser, createdAt:todayISO()
        });
      });
      this.attendanceNoteOpen = false;
      this.persist();
      this.notify('Keterangan absensi disimpan');
    },
    addAttendanceLembur(employeeId, date) {
      if (this.attendanceNoteFor(employeeId, date, ['lembur'])) return;
      (this.attendanceNotes = this.attendanceNotes || []).push({ id:'note' + Date.now() + Math.random().toString(16).slice(2), employeeId, date, type:'lembur', note:'Lembur dari scan hari libur', by:this.currentUser, createdAt:todayISO() });
      this.persist();
      this.notify('Lembur ditandai');
    },
    deleteAttendanceNote(note) {
      if (!note) return;
      this.askConfirm('delete-attendance-note', note.id, 'Hapus keterangan?', 'Keterangan ' + this.attendanceStatusLabel(this.attendanceTypeCode(note.type)) + ' pada ' + dateShort(note.date) + ' akan dihapus.');
    },
    attendanceTypeCode(type) { return { izin:'I', sakit:'S', cuti:'C', alfa:'A', lembur:'L', dispensasi:'H', resign:'H' }[type] || type; },
    attendanceTypeLabel(type) { return { izin:'Izin', sakit:'Sakit/Urgent', cuti:'Cuti', alfa:'Alfa', lembur:'Lembur', dispensasi:'Dispensasi Telat', resign:'Resign' }[type] || type; },
    openAttendanceSettings() {
      const settings = this.hrSettings || {};
      this.attendanceSettingsForm = {
        hkStandar:Number(settings.hkStandar) || 26,
        groups:JSON.parse(JSON.stringify(settings.groups || {})),
        weeklyOff:[...(settings.weeklyOff || [0])],
        holidayText:(settings.holidays || []).join(', '),
        hkRules:{ ...(settings.hkRules || {}) }
      };
      this.attendanceSettingsOpen = true;
    },
    saveAttendanceSettings() {
      const form = this.attendanceSettingsForm;
      if (!form) return;
      const holidays = String(form.holidayText || '').split(/[,\n]/).map(value => value.trim()).filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value));
      this.hrSettings = {
        ...this.hrSettings,
        hkStandar:Math.max(1, Number(form.hkStandar) || 26),
        groups:form.groups,
        weeklyOff:form.weeklyOff,
        holidays,
        hkRules:form.hkRules
      };
      this.hrSettings.history = this.hrSettings.history || [];
      this.hrSettings.history.unshift({ at:todayISO(), by:this.currentUser, note:'Pengaturan absensi diperbarui' });
      this.attendanceSettingsOpen = false;
      this.persist();
      this.notify('Pengaturan absensi disimpan');
    },
    openAttendanceImport() {
      this.attendanceImportOpen = true;
      this.attendanceImportStep = 1;
      this.attendanceImportRows = [];
      this.attendanceImportFileName = '';
      this.attendanceImportPeriod = this.attendancePeriod;
    },
    normalizeHrHeader(value) {
      return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    },
    parseHrDate(value) {
      if (value == null || value === '') return '';
      if (typeof value === 'number' && window.XLSX && XLSX.SSF) {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (parsed) return parsed.y + '-' + pad2(parsed.m) + '-' + pad2(parsed.d);
      }
      const text = String(value).trim();
      let match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
      if (match) return match[3] + '-' + pad2(match[2]) + '-' + pad2(match[1]);
      match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (match) return match[1] + '-' + pad2(match[2]) + '-' + pad2(match[3]);
      return '';
    },
    parseHrTime(value) {
      if (value == null || value === '') return '';
      if (typeof value === 'number') {
        const total = Math.round((value % 1) * 86400);
        return pad2(Math.floor(total / 3600)) + ':' + pad2(Math.floor((total % 3600) / 60)) + ':' + pad2(total % 60);
      }
      const match = String(value).trim().match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      return match ? pad2(match[1]) + ':' + pad2(match[2]) + ':' + pad2(match[3] || '00') : '';
    },
    matchAttendanceEmployee(row) {
      const pin = String(row.pin || '').trim();
      const nip = String(row.nip || '').trim().toLowerCase();
      const name = String(row.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
      return (this.employees || []).find(employee => pin && String(employee.pin || '') === pin)
        || (this.employees || []).find(employee => nip && String(employee.nip || '').toLowerCase() === nip)
        || (this.employees || []).find(employee => name && String(employee.name || '').toLowerCase().replace(/\s+/g, ' ') === name)
        || null;
    },
    handleAttendanceFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!window.XLSX) { this.notify('Library Excel belum tersedia', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const workbook = XLSX.read(new Uint8Array(reader.result), { type:'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const matrix = XLSX.utils.sheet_to_json(sheet, { header:1, raw:true, defval:'' });
          const headerIndex = matrix.findIndex(row => row.some(cell => ['pin','nip','tanggal'].includes(this.normalizeHrHeader(cell))));
          if (headerIndex < 0) throw new Error('header');
          const headers = matrix[headerIndex].map(cell => this.normalizeHrHeader(cell));
          const getIndex = names => headers.findIndex(header => names.includes(header));
          const pinIndex = getIndex(['pin']);
          const nipIndex = getIndex(['nip']);
          const nameIndex = getIndex(['nama','namapegawai']);
          const dateIndex = getIndex(['tanggal','tgl']);
          const scanIndexes = headers.map((header, index) => ({ header, index })).filter(item => /^scan\d+$/.test(item.header)).map(item => item.index);
          const rows = matrix.slice(headerIndex + 1).map(cells => {
            const raw = {
              pin:pinIndex >= 0 ? cells[pinIndex] : '',
              nip:nipIndex >= 0 ? cells[nipIndex] : '',
              name:nameIndex >= 0 ? cells[nameIndex] : '',
              date:this.parseHrDate(dateIndex >= 0 ? cells[dateIndex] : ''),
              scan1:scanIndexes.length ? this.parseHrTime(cells[scanIndexes[0]]) : '',
              scan2:scanIndexes.length > 1 ? this.parseHrTime(cells[scanIndexes[scanIndexes.length - 1]]) : ''
            };
            const employee = this.matchAttendanceEmployee(raw);
            return { ...raw, employeeId:employee ? employee.id : '', skip:false };
          }).filter(row => row.date);
          if (!rows.length) throw new Error('empty');
          this.attendanceImportRows = rows;
          this.attendanceImportFileName = file.name;
          this.attendanceImportPeriod = rows[0].date.slice(0, 7);
          this.attendanceImportStep = 2;
        } catch (error) {
          this.notify('File tidak dikenali. Gunakan format ALL DAY.xls', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
      event.target.value = '';
    },
    attendanceImportSetEmployee(index, employeeId) {
      const row = this.attendanceImportRows[index];
      if (row) row.employeeId = employeeId;
    },
    get attendanceImportStats() {
      const rows = this.attendanceImportRows || [];
      return { total:rows.length, matched:rows.filter(row => row.employeeId).length, unmatched:rows.filter(row => !row.employeeId).length };
    },
    proceedAttendanceImport() {
      if (this.attendanceImportRows.some(row => !row.employeeId && !row.skip)) { this.notify('Petakan atau lewati semua baris yang belum cocok', 'error'); return; }
      this.attendanceImportStep = 3;
    },
    commitAttendanceImport() {
      const batchId = 'batch' + Date.now();
      const map = new Map();
      this.attendanceImportRows.filter(row => row.employeeId && !row.skip).forEach(row => {
        map.set(row.employeeId + '|' + row.date, row);
      });
      const rows = [...map.values()];
      if (!rows.length) { this.notify('Tidak ada baris untuk diimpor', 'error'); return; }
      const keys = new Set(rows.map(row => row.employeeId + '|' + row.date));
      this.attendanceScans = (this.attendanceScans || []).filter(scan => !keys.has(scan.employeeId + '|' + scan.date));
      rows.forEach(row => {
        const employee = this.employee(row.employeeId);
        if (employee.id && row.pin) employee.pin = String(row.pin);
        (this.attendanceScans = this.attendanceScans || []).push({
          id:'scan' + row.employeeId + row.date,
          employeeId:row.employeeId,
          pin:row.pin,
          nip:row.nip,
          name:row.name,
          date:row.date,
          scan1:row.scan1,
          scan2:row.scan2,
          batchId
        });
      });
      (this.attendanceBatches = this.attendanceBatches || []).unshift({ id:batchId, fileName:this.attendanceImportFileName, at:todayISO(), by:this.currentUser, period:this.attendanceImportPeriod, rows:rows.length });
      this.attendancePeriod = this.attendanceImportPeriod;
      this.attendanceImportOpen = false;
      this.persist();
      this.notify('Import absensi berhasil: ' + rows.length + ' baris');
    },
    lastPayrollRowFor(employeeId) {
      const docs = (this.payrolls || [])
        .filter(doc => (doc.rows || []).some(row => row.employeeId === employeeId))
        .sort((a, b) => String(b.period).localeCompare(String(a.period)) || Number(b.version) - Number(a.version));
      const doc = docs[0];
      return doc ? (doc.rows || []).find(row => row.employeeId === employeeId) || null : null;
    },
    payrollForPeriod(period) {
      return (this.payrolls || [])
        .filter(doc => doc.period === period)
        .sort((a, b) => Number(b.version) - Number(a.version))[0] || null;
    },
    get payrollDoc() { return this.payrollForPeriod(this.payrollPeriod); },
    payrollStatusLabel(status) { return { draft:'Draft', final:'Final', revised:'Direvisi' }[status] || 'Belum dibuat'; },
    payrollStatusBadge(status) { return { draft:'badge-slate', final:'badge-green', revised:'badge-stone' }[status] || 'badge-slate'; },
    payrollRowCalc(row) {
      const hkStandar = Number(row.hkStandar) || Number(this.hrSettings.hkStandar) || 26;
      const basicSalary = Number(row.basicSalary) || 0;
      const mealPerDay = Number(row.mealPerDay) || 0;
      const hk = Math.max(0, Number(row.hk) || 0);
      const hkLembur = Math.max(0, Number(row.hkLembur) || 0);
      const hariMakan = Math.max(0, Number(row.hariMakan) || 0);
      const gajiPerHari = hkStandar > 0 ? basicSalary / hkStandar : 0;
      const gajiSesuaiHK = Math.round(gajiPerHari * hk);
      const tunjMakan = mealPerDay * hariMakan;
      const tunjLembur = Math.round(hkLembur * (gajiPerHari + mealPerDay));
      const totalDiterima = gajiSesuaiHK + tunjMakan + tunjLembur
        - (Number(row.potAbsSakit) || 0) - (Number(row.potHutang) || 0)
        - (Number(row.potTelat) || 0) - (Number(row.potBpjsKet) || 0)
        + (Number(row.penyesuaian) || 0);
      return { gajiPerHari, gajiSesuaiHK, tunjMakan, tunjLembur, totalDiterima };
    },
    get payrollComputedRows() {
      const doc = this.payrollDoc;
      if (!doc) return [];
      return (doc.rows || []).map(row => ({ ...row, ...this.payrollRowCalc(row) }));
    },
    get payrollTotals() {
      return this.payrollComputedRows.reduce((totals, row) => {
        totals.employees += 1;
        ['basicSalary','gajiSesuaiHK','tunjMakan','tunjLembur','potAbsSakit','potHutang','potTelat','potBpjsKet','penyesuaian','totalDiterima','bpjsPerusahaan'].forEach(key => { totals[key] += Number(row[key]) || 0; });
        return totals;
      }, { employees:0, basicSalary:0, gajiSesuaiHK:0, tunjMakan:0, tunjLembur:0, potAbsSakit:0, potHutang:0, potTelat:0, potBpjsKet:0, penyesuaian:0, totalDiterima:0, bpjsPerusahaan:0 });
    },
    get payrollByGroup() {
      const map = {};
      this.payrollComputedRows.forEach(row => {
        const key = row.group || '-';
        map[key] = map[key] || { group:key, employees:0, basicSalary:0, tunjMakan:0, totalDiterima:0, bpjsPerusahaan:0 };
        map[key].employees += 1;
        map[key].basicSalary += Number(row.basicSalary) || 0;
        map[key].tunjMakan += Number(row.tunjMakan) || 0;
        map[key].totalDiterima += Number(row.totalDiterima) || 0;
        map[key].bpjsPerusahaan += Number(row.bpjsPerusahaan) || 0;
      });
      return Object.values(map).sort((a, b) => String(a.group).localeCompare(String(b.group)));
    },
    buildPayrollRows(period, attendancePeriod) {
      return this.employeesActive.map(employee => {
        const summary = this.attendanceSummary(employee, attendancePeriod);
        const last = this.lastPayrollRowFor(employee.id);
        const group = this.attendanceGroupSettings(employee);
        const hk = summary.hkDibayar;
        const lateNoMeal = !!group.lateNoMeal;
        return {
          employeeId:employee.id,
          nip:employee.nip,
          name:employee.name,
          group:employee.group,
          position:employee.position,
          basicSalary:Number(employee.basicSalary) || 0,
          mealPerDay:Number(employee.mealPerDay) || Number(this.hrSettings.mealDefault) || 20000,
          hkStandar:Number(this.hrSettings.hkStandar) || 26,
          hkAbsensi:hk,
          hk,
          hariTelat:summary.telat,
          lateNoMeal,
          hariMakan:Math.max(0, hk - (lateNoMeal ? summary.telatTanpaMakan : 0)),
          hkLembur:summary.lembur,
          potAbsSakit:0,
          potHutang:0,
          potTelat:0,
          potBpjsKet:last ? Number(last.potBpjsKet) || 0 : 0,
          penyesuaian:0,
          penyesuaianNote:'',
          bpjsPerusahaan:last ? Number(last.bpjsPerusahaan) || 0 : 0,
          note:''
        };
      });
    },
    onPayrollPeriodChange() {
      this.payrollAttendancePeriod = previousMonthKey(this.payrollPeriod);
    },
    openPayrollSettings() {
      this.payrollSettingsForm = {
        hkStandar:Number(this.hrSettings.hkStandar) || 26,
        mealDefault:Number(this.hrSettings.mealDefault) || 20000,
        hppGroups:[...(this.hrSettings.hppGroups || ['Produksi'])],
        hppSalaryBasis:this.hrSettings.hppSalaryBasis || 'before'
      };
      this.payrollSettingsOpen = true;
    },
    savePayrollSettings() {
      const form = this.payrollSettingsForm;
      if (!form) return;
      this.hrSettings = {
        ...this.hrSettings,
        hkStandar:Math.max(1, Number(form.hkStandar) || 26),
        mealDefault:Math.max(0, Number(form.mealDefault) || 0),
        hppGroups:form.hppGroups.length ? form.hppGroups : ['Produksi'],
        hppSalaryBasis:form.hppSalaryBasis === 'after' ? 'after' : 'before'
      };
      this.hrSettings.history = this.hrSettings.history || [];
      this.hrSettings.history.unshift({ at:todayISO(), by:this.currentUser, note:'Pengaturan payroll diperbarui' });
      this.payrollSettingsOpen = false;
      this.persist();
      this.notify('Pengaturan payroll disimpan');
    },
    startPayroll() {
      if (!this.payrollPeriod) { this.notify('Pilih periode payroll', 'error'); return; }
      const existing = this.payrollForPeriod(this.payrollPeriod);
      if (existing) { this.notify('Payroll periode ini sudah ada. Gunakan Revisi bila sudah final.', 'error'); return; }
      const rows = this.buildPayrollRows(this.payrollPeriod, this.payrollAttendancePeriod);
      if (!rows.length) { this.notify('Tidak ada pegawai aktif', 'error'); return; }
      const doc = {
        id:'pay' + Date.now(),
        code:'PAY-' + this.payrollPeriod + '-0001',
        period:this.payrollPeriod,
        attendancePeriod:this.payrollAttendancePeriod,
        version:1,
        status:'draft',
        rows,
        createdBy:this.currentUser,
        finalizedBy:'',
        finalizedAt:'',
        reviseReason:'',
        hppSentAt:'',
        history:[{ action:'draft', by:this.currentUser, at:todayISO(), note:'Payroll dibuat' }]
      };
      (this.payrolls = this.payrolls || []).unshift(doc);
      this.persist();
      this.notify('Payroll ' + this.payrollPeriod + ' dibuat');
    },
    onPayrollHkChange(row) {
      row.hk = Math.max(0, Number(row.hk) || 0);
      row.hariMakan = Math.max(0, row.hk - (row.lateNoMeal ? Number(row.hariTelat) || 0 : 0));
      this.persist();
    },
    onPayrollRowChange() { this.persist(); },
    recalcPayroll() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'draft') return;
      (doc.rows || []).forEach(row => {
        const employee = this.employee(row.employeeId);
        if (!employee.id) return;
        const summary = this.attendanceSummary(employee, doc.attendancePeriod);
        const group = this.attendanceGroupSettings(employee);
        row.hkAbsensi = summary.hkDibayar;
        row.hk = summary.hkDibayar;
        row.hariTelat = summary.telat;
        row.lateNoMeal = !!group.lateNoMeal;
        row.hariMakan = Math.max(0, row.hk - (row.lateNoMeal ? summary.telatTanpaMakan : 0));
        row.hkLembur = summary.lembur;
      });
      this.persist();
      this.notify('HK dan lembur dihitung ulang dari absensi');
    },
    payrollWarnings() {
      const doc = this.payrollDoc;
      if (!doc) return [];
      const warnings = [];
      const autoAlfa = this.employeesActive.reduce((sum, employee) => {
        return sum + this.hrPeriodDays(doc.attendancePeriod).filter(date => this.attendanceStatus(employee, date) === 'A').length;
      }, 0);
      if (autoAlfa > 0) warnings.push(autoAlfa + ' hari alfa otomatis belum dikonfirmasi');
      const zeroBpjs = this.payrollComputedRows.filter(row => row.group === 'Produksi' && !(Number(row.bpjsPerusahaan) > 0)).length;
      if (zeroBpjs > 0) warnings.push(zeroBpjs + ' pegawai Produksi belum punya BPJS perusahaan');
      const zeroSalary = this.payrollComputedRows.filter(row => !(Number(row.basicSalary) > 0)).length;
      if (zeroSalary > 0) warnings.push(zeroSalary + ' pegawai belum punya gaji pokok');
      return warnings;
    },
    askPayrollFinalize() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'draft') return;
      const warnings = this.payrollWarnings();
      this.askConfirm('payroll-finalize', doc.id, 'Finalisasi payroll?', (warnings.length ? 'Peringatan: ' + warnings.join('; ') + '. ' : '') + 'Payroll akan dikunci setelah finalisasi.', false, 'Finalisasi');
    },
    commitPayrollFinal() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'draft') return;
      doc.status = 'final';
      doc.finalizedBy = this.currentUser;
      doc.finalizedAt = todayISO();
      doc.history = doc.history || [];
      doc.history.unshift({ action:'final', by:this.currentUser, at:todayISO(), note:'Finalisasi payroll' });
      this.persist();
      this.notify('Payroll berhasil difinalisasi');
      this.payrollHppForm = { period:doc.attendancePeriod, basis:this.hrSettings.hppSalaryBasis || 'before' };
      this.payrollHppOpen = true;
    },
    openPayrollRevision() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'final') return;
      this.payrollRevisionReason = '';
      this.payrollRevisionOpen = true;
    },
    savePayrollRevision() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'final') return;
      if (!String(this.payrollRevisionReason || '').trim()) { this.notify('Alasan revisi wajib diisi', 'error'); return; }
      const old = doc;
      old.status = 'revised';
      const next = JSON.parse(JSON.stringify(old));
      next.id = 'pay' + Date.now();
      next.version = (Number(old.version) || 1) + 1;
      next.code = 'PAY-' + old.period + '-' + String(next.version).padStart(4, '0');
      next.status = 'draft';
      next.createdBy = this.currentUser;
      next.finalizedBy = '';
      next.finalizedAt = '';
      next.hppSentAt = '';
      next.history = next.history || [];
      next.history.unshift({ action:'revisi', by:this.currentUser, at:todayISO(), note:this.payrollRevisionReason.trim() });
      (this.payrolls = this.payrolls || []).unshift(next);
      this.payrollRevisionOpen = false;
      this.persist();
      this.notify('Revisi payroll dibuat');
    },
    getPayrollSummary(period, group = 'Produksi', basisOverride = '') {
      const doc = (this.payrolls || [])
        .filter(item => item.period === period && item.status === 'final')
        .sort((a, b) => Number(b.version) - Number(a.version))[0];
      if (!doc) return { gaji:0, uangMakan:0, lembur:0, bpjsPerusahaan:0, headcount:0 };
      const rows = (doc.rows || []).filter(row => row.group === group).map(row => ({ ...row, ...this.payrollRowCalc(row) }));
      const basis = basisOverride || this.hrSettings.hppSalaryBasis || 'before';
      return {
        gaji:rows.reduce((sum, row) => sum + (basis === 'after' ? row.totalDiterima : row.gajiSesuaiHK + row.tunjLembur), 0),
        uangMakan:rows.reduce((sum, row) => sum + row.tunjMakan, 0),
        lembur:rows.reduce((sum, row) => sum + row.tunjLembur, 0),
        bpjsPerusahaan:rows.reduce((sum, row) => sum + (Number(row.bpjsPerusahaan) || 0), 0),
        headcount:rows.length
      };
    },
    askPayrollSendHpp() {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'final') { this.notify('Finalisasi payroll sebelum mengirim ke HPP', 'error'); return; }
      this.payrollHppForm = { period:doc.attendancePeriod, basis:this.hrSettings.hppSalaryBasis || 'before' };
      this.payrollHppOpen = true;
    },
    sendPayrollToHpp(confirmed = false) {
      const doc = this.payrollDoc;
      if (!doc || doc.status !== 'final') { this.notify('Payroll harus final', 'error'); return; }
      const form = this.payrollHppForm;
      const groups = this.hrSettings.hppGroups || ['Produksi'];
      const summaries = groups.map(group => ({ group, ...this.getPayrollSummary(doc.period, group, form.basis) }));
      const totals = summaries.reduce((sum, item) => ({
        gaji:sum.gaji + item.gaji,
        uangMakan:sum.uangMakan + item.uangMakan,
        bpjs:sum.bpjs + item.bpjsPerusahaan,
        headcount:sum.headcount + item.headcount
      }), { gaji:0, uangMakan:0, bpjs:0, headcount:0 });
      const values = {
        gaji:{ value:totals.gaji, employeeCount:totals.headcount },
        uang_makan:{ value:totals.uangMakan, employeeCount:totals.headcount },
        bpjs:{ value:totals.bpjs, employeeCount:totals.headcount }
      };
      const existing = Object.keys(values).map(component => ({ component, row:this.getBiayaBulanan(form.period, component), value:values[component].value })).filter(item => item.row && Number(item.row.value) !== item.value);
      if (existing.length && !confirmed) {
        this.askConfirm('payroll-send-hpp', null, 'Timpa biaya bulanan?', 'Nilai ' + existing.map(item => this.hppComponentLabel(item.component)).join(', ') + ' pada ' + monthLongLabel(form.period) + ' akan diperbarui dari payroll.', false, 'Kirim');
        return;
      }
      this.biayaProduksiBulanan = this.biayaProduksiBulanan || [];
      Object.keys(values).forEach(component => {
        const payload = values[component];
        let row = this.getBiayaBulanan(form.period, component);
        if (!row) {
          row = {
            id:'bpb' + Date.now() + Math.random().toString(16).slice(2),
            period:form.period,
            component,
            value:payload.value,
            employeeCount:payload.employeeCount,
            sourceType:'payroll',
            type:'aktual',
            note:doc.code + ' v' + doc.version,
            createdBy:this.currentUser,
            updatedBy:this.currentUser,
            updatedAt:todayISO(),
            history:[]
          };
          this.biayaProduksiBulanan.push(row);
          return;
        }
        row.history = row.history || [];
        row.history.unshift({ at:todayISO(), by:this.currentUser, before:{ value:row.value, sourceType:row.sourceType }, after:{ value:payload.value, sourceType:'payroll' }, note:doc.code + ' v' + doc.version });
        row.value = payload.value;
        row.employeeCount = payload.employeeCount;
        row.sourceType = 'payroll';
        row.type = 'aktual';
        row.note = doc.code + ' v' + doc.version;
        row.updatedBy = this.currentUser;
        row.updatedAt = todayISO();
      });
      doc.hppSentAt = todayISO();
      this.payrollHppOpen = false;
      this.persist();
      this.notify('Payroll dikirim ke biaya bulanan ' + monthLongLabel(form.period));
    },
    attendanceHkFromCounts(counts) {
      const rules = this.hrSettings.hkRules || {};
      const hkPotong = (rules.alfa ? Number(counts.alfa) || 0 : 0) + (rules.izin ? Number(counts.izin) || 0 : 0) + (rules.sakit ? Number(counts.sakit) || 0 : 0) + (rules.cuti ? Number(counts.cuti) || 0 : 0);
      return { hkPotong, hkDibayar:Math.max(0, (Number(this.hrSettings.hkStandar) || 26) - hkPotong) };
    },
    runHrSelfTest() {
      const t1 = this.payrollRowCalc({ basicSalary:4000000, mealPerDay:20000, hkStandar:26, hk:26, hariMakan:26, hkLembur:0, potBpjsKet:120000 });
      const t2 = this.payrollRowCalc({ basicSalary:1500000, mealPerDay:20000, hkStandar:26, hk:24, hariMakan:24, hkLembur:0, potBpjsKet:45000 });
      const t3 = this.payrollRowCalc({ basicSalary:3000000, mealPerDay:20000, hkStandar:26, hk:26, hariMakan:26, hkLembur:1, potBpjsKet:90000 });
      const meal3 = Math.max(0, 26 - 3);
      const mealDisp = Math.max(0, 26 - (3 - 1));
      const mealNoToggle = 26;
      const t4 = this.attendanceHkFromCounts({ alfa:1, izin:1, cuti:1, sakit:1 });
      const t5 = this.matchAttendanceEmployee({ pin:'1001', nip:'', name:'NAMA MESIN BERBEDA' });
      const checks = {
        t1: t1.gajiSesuaiHK === 4000000 && t1.tunjMakan === 520000 && t1.totalDiterima === 4400000,
        t2: Math.round(t2.gajiSesuaiHK) === 1384615 && t2.tunjMakan === 480000 && t2.totalDiterima === 1819615,
        t3: t3.tunjLembur === 135385 && t3.totalDiterima === 3565385,
        t7: meal3 === 23 && mealDisp === 24 && mealNoToggle === 26,
        t4: t4.hkPotong === 2 && t4.hkDibayar === 24,
        t5: !!t5 && t5.pin === '1001'
      };
      const ok = Object.values(checks).every(Boolean);
      this.hrSelfTestResult = { ok, checks, t1, t2, t3, t4 };
      this.notify(ok ? 'Self-test HR berhasil' : 'Self-test HR gagal', ok ? 'success' : 'error');
    },
    downloadBlob(filename, content, type) {
      const blob = new Blob([content], { type });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 500);
    },
    exportRows(filename, headers, rows, format = 'csv', extraSheets = []) {
      const baseName = String(filename || 'export').replace(/\.(csv|xlsx)$/i, '');
      if (format === 'xlsx') {
        if (!window.XLSX) { this.notify('Library Excel belum tersedia', 'error'); return; }
        const workbook = XLSX.utils.book_new();
        const main = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        main['!cols'] = headers.map((header, index) => ({ wch:Math.max(12, Math.min(32, String(header).length + 4, ...rows.slice(0, 50).map(row => String(row[index] == null ? '' : row[index]).length + 2))) }));
        XLSX.utils.book_append_sheet(workbook, main, 'Data');
        extraSheets.forEach(sheet => XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([sheet.headers, ...sheet.rows]), sheet.name));
        XLSX.writeFile(workbook, baseName + '.xlsx');
        return;
      }
      const cell = value => '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
      const lines = [headers.map(cell).join(';'), ...rows.map(row => row.map(cell).join(';'))];
      this.downloadBlob(baseName + '.csv', '\ufeff' + lines.join('\r\n'), 'text/csv;charset=utf-8');
    },
    exportEmployees(format = 'csv') {
      const headers = ['NIP','Nama','Kelompok','Posisi','Gaji Pokok','Uang Makan/Hari','Status','Tanggal Masuk','Bank','No. Rekening'];
      const rows = this.filteredEmployees.map(employee => [employee.nip, employee.name, employee.group, employee.position, Number(employee.basicSalary) || 0, Number(employee.mealPerDay) || 0, employee.status ? 'Aktif' : 'Nonaktif', employee.joinDate || '', employee.bank || '', employee.accountNumber || '']);
      this.exportRows('pegawai-' + todayISO(), headers, rows, format);
    },
    exportAttendance(format = 'csv') {
      const days = this.hrPeriodDays(this.attendancePeriod);
      const headers = ['NIP','Nama', ...days.map(date => date.slice(-2)), 'Hadir','Izin','Sakit','Cuti','Alfa','Lembur','Telat','HK Dibayar'];
      const rows = this.attendanceRecapRows.map(row => [row.employee.nip, row.employee.name, ...row.days.map(day => day.status), row.summary.hadir, row.summary.izin, row.summary.sakit, row.summary.cuti, row.summary.alfa, row.summary.lembur, row.summary.telat, row.summary.hkDibayar]);
      const scanRows = this.attendanceScanRows.map(scan => [scan.pin, scan.nip, this.employeeName(scan.employeeId) || scan.name, scan.date, scan.scan1, scan.scan2]);
      this.exportRows('rekap-absensi-' + this.attendancePeriod, headers, rows, format, [{ name:'Data Scan', headers:['PIN','NIP','Nama','Tanggal','Scan 1','Scan 2'], rows:scanRows }]);
    },
    exportPayroll(format = 'csv') {
      const doc = this.payrollDoc;
      if (!doc) { this.notify('Belum ada payroll', 'error'); return; }
      const headers = ['NIP','Nama','Kelompok','Posisi','Gaji Pokok','Gaji/Hari','HK','Gaji Sesuai HK','Uang Makan/Hari','Hari Telat','Hari Makan','Tunj. Makan','HK Lembur','Tunj. Lembur','Pot. Abs Sakit','Pot. Hutang','Pot. Telat','Pot. BPJS Ket','Penyesuaian','Total Diterima','BPJS Perusahaan','Catatan'];
      const rows = this.payrollComputedRows.map(row => [row.nip, row.name, row.group, row.position, row.basicSalary, Math.round(row.gajiPerHari), row.hk, row.gajiSesuaiHK, row.mealPerDay, row.hariTelat, row.hariMakan, row.tunjMakan, row.hkLembur, row.tunjLembur, row.potAbsSakit, row.potHutang, row.potTelat, row.potBpjsKet, row.penyesuaian, row.totalDiterima, row.bpjsPerusahaan, row.note]);
      const totals = this.payrollTotals;
      rows.push(['TOTAL','','','', totals.basicSalary, '', '', totals.gajiSesuaiHK, '', '', '', totals.tunjMakan, '', totals.tunjLembur, totals.potAbsSakit, totals.potHutang, totals.potTelat, totals.potBpjsKet, totals.penyesuaian, totals.totalDiterima, totals.bpjsPerusahaan, '']);
      const groupRows = this.payrollByGroup.map(group => [group.group, group.employees, group.basicSalary, group.tunjMakan, group.totalDiterima, group.bpjsPerusahaan]);
      this.exportRows('payroll-' + doc.period, headers, rows, format, [{ name:'Ringkasan Kelompok', headers:['Kelompok','Jumlah Pegawai','Gaji Pokok','Tunj. Makan','Total Diterima','BPJS Perusahaan'], rows:groupRows }]);
    },
    /* ---------- LEDGER & TRIAL BALANCE ---------- */
    ledgerAccountId: 'acc1', ledgerFrom: '', ledgerTo: todayISO(),
    reportTab: 'trial', reportAsOf: todayISO(), reportFrom: todayISO().slice(0, 8) + '01', reportTo: todayISO(), reportShowZero: false,
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
    reportMovement(accountId, from = '', to = '', excludeSource = '') {
      let debit = 0;
      let credit = 0;
      this.journals
        .filter(journal => journal.status === 'posted')
        .filter(journal => (!from || journal.date >= from) && (!to || journal.date <= to))
        .filter(journal => !excludeSource || journal.source !== excludeSource)
        .forEach(journal => (journal.lines || []).forEach(line => {
          if (line.accountId !== accountId) return;
          debit += Number(line.debit) || 0;
          credit += Number(line.credit) || 0;
        }));
      return { debit, credit };
    },
    reportAccountValue(account, from = '', to = '') {
      const movement = this.reportMovement(account.id, from, to);
      if (['asset', 'expense'].includes(account.type)) return movement.debit - movement.credit;
      return movement.credit - movement.debit;
    },
    reportValue(value) {
      const n = Number(value) || 0;
      return n < 0 ? '(' + this.rp(Math.abs(n)) + ')' : this.rp(n);
    },
    isReportHpp(account) {
      return String(account.code || '').startsWith('5-10');
    },
    get reportTrialRows() {
      return this.accounts
        .map(account => {
          const movement = this.reportMovement(account.id, '', this.reportAsOf);
          const net = movement.debit - movement.credit;
          return {
            accountId:account.id,
            code:account.code,
            name:account.name,
            type:account.type,
            debit:net > 0 ? net : 0,
            credit:net < 0 ? Math.abs(net) : 0
          };
        })
        .filter(row => this.reportShowZero || row.debit !== 0 || row.credit !== 0)
        .sort((a, b) => String(a.code).localeCompare(String(b.code)));
    },
    get reportTrialTotals() {
      return this.reportTrialRows.reduce((sum, row) => ({
        debit:sum.debit + row.debit,
        credit:sum.credit + row.credit
      }), { debit:0, credit:0 });
    },
    get reportTrialDifference() { return this.reportTrialTotals.debit - this.reportTrialTotals.credit; },
    reportProfitLossRange(from, to) {
      const rows = this.accounts.map(account => ({
        account,
        value:this.reportAccountValue(account, from, to)
      }));
      const sortRows = list => list.sort((a, b) => String(a.account.code).localeCompare(String(b.account.code)));
      const revenue = sortRows(rows.filter(row => row.account.type === 'revenue' && row.value !== 0));
      const hpp = sortRows(rows.filter(row => row.account.type === 'expense' && this.isReportHpp(row.account) && row.value !== 0));
      const opex = sortRows(rows.filter(row => row.account.type === 'expense' && !this.isReportHpp(row.account) && row.value !== 0));
      const totalRevenue = revenue.reduce((sum, row) => sum + row.value, 0);
      const totalHpp = hpp.reduce((sum, row) => sum + row.value, 0);
      const totalOpex = opex.reduce((sum, row) => sum + row.value, 0);
      return {
        from, to, revenue, hpp, opex,
        totalRevenue, totalHpp, totalOpex,
        gross:totalRevenue - totalHpp,
        net:totalRevenue - totalHpp - totalOpex
      };
    },
    get reportProfitLoss() {
      return this.reportProfitLossRange(this.reportFrom, this.reportTo);
    },
    get reportBalanceSheet() {
      const asOf = this.reportAsOf;
      const rows = this.accounts.map(account => ({
        account,
        value:this.reportAccountValue(account, '', asOf)
      }));
      const sortRows = list => list.sort((a, b) => String(a.account.code).localeCompare(String(b.account.code)));
      const assets = sortRows(rows.filter(row => row.account.type === 'asset' && row.value !== 0));
      const liabilities = sortRows(rows.filter(row => row.account.type === 'liability' && row.value !== 0));
      const equity = sortRows(rows.filter(row => row.account.type === 'equity' && row.value !== 0));
      const asetLancar = assets.filter(row => String(row.account.code).startsWith('1-1'));
      const asetTetap = assets.filter(row => !String(row.account.code).startsWith('1-1'));
      const kewajibanPendek = liabilities.filter(row => String(row.account.code).startsWith('2-1'));
      const kewajibanPanjang = liabilities.filter(row => !String(row.account.code).startsWith('2-1'));
      const totalAset = assets.reduce((sum, row) => sum + row.value, 0);
      const totalAsetLancar = asetLancar.reduce((sum, row) => sum + row.value, 0);
      const totalAsetTetap = asetTetap.reduce((sum, row) => sum + row.value, 0);
      const totalKewajiban = liabilities.reduce((sum, row) => sum + row.value, 0);
      const totalEkuitasAkun = equity.reduce((sum, row) => sum + row.value, 0);
      const year = String(asOf || todayISO()).slice(0, 4);
      const labaBerjalan = this.reportProfitLossRange(year + '-01-01', asOf).net;
      const totalEkuitas = totalEkuitasAkun + labaBerjalan;
      const totalKewajibanEkuitas = totalKewajiban + totalEkuitas;
      const difference = totalAset - totalKewajibanEkuitas;
      return {
        asOf, assets, asetLancar, asetTetap, liabilities, kewajibanPendek, kewajibanPanjang, equity,
        totalAset, totalAsetLancar, totalAsetTetap, totalKewajiban, totalEkuitasAkun, labaBerjalan, totalEkuitas,
        totalKewajibanEkuitas, difference, seimbang:Math.abs(difference) < 0.005
      };
    },
    get revenueReport() {
      const from = this.reportFrom;
      const to = this.reportTo;
      const inRange = date => (!from || date >= from) && (!to || date <= to);
      const orders = this.orders
        .filter(order => inRange(order.date) && !['cancel','failed'].includes(order.status))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      const netSales = order => Math.max(0, (Number(order.total) || 0) - (Number(order.tax) || 0));
      const salesValue = orders.reduce((sum, order) => sum + netSales(order), 0);
      const channels = [
        { channel:'Sales', orders:0, value:0 },
        { channel:'Sales Kantor', orders:0, value:0 }
      ];
      const users = {};
      orders.forEach(order => {
        const channel = this.orderSalesChannel(order);
        const user = channel === 'Sales' ? this.orderSalesPerson(order) : this.orderCreatorName(order);
        const value = netSales(order);
        const channelRow = channels.find(row => row.channel === channel) || channels[0];
        channelRow.orders += 1;
        channelRow.value += value;
        const key = channel + '|' + user;
        if (!users[key]) users[key] = { channel, user, orders:0, value:0 };
        users[key].orders += 1;
        users[key].value += value;
      });
      const otherRows = this.accounts
        .filter(account => account.type === 'revenue')
        .map(account => {
          const movement = this.reportMovement(account.id, from, to, 'order');
          return { account, value:movement.credit - movement.debit };
        })
        .filter(row => row.value !== 0)
        .sort((a, b) => String(a.account.code).localeCompare(String(b.account.code)));
      const otherTotal = otherRows.reduce((sum, row) => sum + row.value, 0);
      const total = salesValue + otherTotal;
      const pct = value => total ? Math.round(value / total * 1000) / 10 : 0;
      return {
        from, to, orders, salesValue, salesPct:pct(salesValue),
        otherRows, otherTotal, otherPct:pct(otherTotal),
        total,
        channels:channels.filter(row => row.orders > 0),
        users:Object.values(users).sort((a, b) => a.channel.localeCompare(b.channel) || b.value - a.value)
      };
    },
    openReportLedger(accountId) {
      if (!accountId) return;
      this.ledgerAccountId = accountId;
      if (this.reportTab === 'profit') {
        this.ledgerFrom = this.reportFrom;
        this.ledgerTo = this.reportTo;
      } else {
        this.ledgerFrom = '';
        this.ledgerTo = this.reportAsOf;
      }
      this.go('ledger');
    },
    downloadReportCSV() {
      const cell = value => '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
      let lines = [];
      let filename = 'laporan-';
      if (this.reportTab === 'revenue') {
        const data = this.revenueReport;
        lines.push(['Sumber','Keterangan','Nilai'].map(cell).join(';'));
        lines.push(['Penjualan Order','Penjualan netto tanpa PPN', data.salesValue].map(cell).join(';'));
        data.otherRows.forEach(row => lines.push(['Pendapatan Lain', row.account.code + ' — ' + row.account.name, row.value].map(cell).join(';')));
        lines.push(['TOTAL','', data.total].map(cell).join(';'));
        lines.push('');
        lines.push(['Channel','User','Order','Nilai'].map(cell).join(';'));
        data.users.forEach(row => lines.push([row.channel, row.user, row.orders, row.value].map(cell).join(';')));
        filename += 'pendapatan-' + this.reportFrom + '_' + this.reportTo;
      } else if (this.reportTab === 'profit') {
        const data = this.reportProfitLoss;
        lines.push(['Section','Kode','Akun','Nilai'].map(cell).join(';'));
        const add = (section, rows, sign = 1) => rows.forEach(row => lines.push([section, row.account.code, row.account.name, row.value * sign].map(cell).join(';')));
        add('Pendapatan', data.revenue);
        lines.push(['','','Subtotal Pendapatan', data.totalRevenue].map(cell).join(';'));
        add('HPP', data.hpp, 1);
        lines.push(['','','Subtotal HPP', data.totalHpp].map(cell).join(';'));
        lines.push(['','','Laba Kotor', data.gross].map(cell).join(';'));
        add('Beban Operasional', data.opex);
        lines.push(['','','Subtotal Beban', data.totalOpex].map(cell).join(';'));
        lines.push(['','','Laba Bersih', data.net].map(cell).join(';'));
        filename += 'laba-rugi-' + this.reportFrom + '_' + this.reportTo;
      } else if (this.reportTab === 'balance') {
        const data = this.reportBalanceSheet;
        lines.push(['Section','Kode','Akun','Nilai'].map(cell).join(';'));
        const add = (section, rows) => rows.forEach(row => lines.push([section, row.account.code, row.account.name, row.value].map(cell).join(';')));
        add('Aset Lancar', data.asetLancar);
        add('Aset Tetap', data.asetTetap);
        lines.push(['','','Total Aset', data.totalAset].map(cell).join(';'));
        add('Kewajiban Jangka Pendek', data.kewajibanPendek);
        add('Kewajiban Jangka Panjang', data.kewajibanPanjang);
        lines.push(['','','Total Kewajiban', data.totalKewajiban].map(cell).join(';'));
        add('Ekuitas', data.equity);
        lines.push(['','','Laba Berjalan', data.labaBerjalan].map(cell).join(';'));
        lines.push(['','','Total Ekuitas', data.totalEkuitas].map(cell).join(';'));
        lines.push(['','','Total Kewajiban + Ekuitas', data.totalKewajibanEkuitas].map(cell).join(';'));
        lines.push(['','','Selisih', data.difference].map(cell).join(';'));
        filename += 'neraca-' + this.reportAsOf;
      } else {
        lines.push(['Tipe','Kode','Nama Akun','Debit','Kredit'].map(cell).join(';'));
        this.reportTrialRows.forEach(row => lines.push([this.accountTypeLabel(row.type), row.code, row.name, row.debit, row.credit].map(cell).join(';')));
        const totals = this.reportTrialTotals;
        lines.push(['TOTAL','','', totals.debit, totals.credit].map(cell).join(';'));
        filename += 'neraca-saldo-' + this.reportAsOf;
      }
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename + '.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.notify('Laporan berhasil diexport');
    },
    printReport() {
      const styleId = 'report-print-page-style';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = '@page { size: A4 portrait; margin: 12mm; }';
        document.head.appendChild(style);
      }
      document.body.classList.add('print-report');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-report');
        const current = document.getElementById(styleId);
        if (current) current.remove();
      }, 300);
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
      this.orderStockOverride = false;
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
    orderStockOverride: false,
    get filteredOrderProducts() {
      const q = this.orderSearch.toLowerCase();
      return this.products.filter(p => p.status && (!q || (p.name + ' ' + p.code).toLowerCase().includes(q)));
    },
    get orderHistory() { return this.orders.filter(o => o.customerId === this.selectedCustomerId); },
    qty(id) { return Number(this.cart[id] || 0); },
    setQty(id, value) {
      const v = Math.max(0, Number(value) || 0);
      this.cart = { ...this.cart, [id]: v };
      this.orderStockOverride = false;
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
    get orderStockShortages() {
      return this.cartRows
        .map(row => ({
          ...row,
          stock: Math.max(0, Number(row.product.stock) || 0),
          shortfall: Math.max(0, row.qty - (Number(row.product.stock) || 0))
        }))
        .filter(row => row.shortfall > 0);
    },
    get cartSubtotal() { return this.cartRows.reduce((sum, r) => sum + r.total, 0); },
    get cartDiscount() { return this.cartRows.reduce((sum, r) => sum + r.discValue, 0); },
    get customDiscountValue() { return (this.cartSubtotal - this.cartDiscount) * (Number(this.customDiscount) || 0) / 100; },
    get cartTax() { return (this.cartSubtotal - this.cartDiscount - this.customDiscountValue) * this.ppnPercent / 100; },
    get cartTotal() { return this.cartSubtotal - this.cartDiscount - this.customDiscountValue + this.cartTax; },
    orderPreviewOpen: false,
    closeOrderPreview() {
      this.orderPreviewOpen = false;
      this.orderStockOverride = false;
    },
    openOrderPreview() {
      if (!this.cartCount) { this.notify('Tambahkan minimal 1 produk terlebih dahulu', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      if (this.orderStockShortages.length) {
        this.askConfirm(
          'order-stock-shortage',
          null,
          'Stock tidak mencukupi',
          'Stock barang di system tidak mencukup, tetap lanjutkan order ?',
          false,
          'Tetap Lanjutkan',
          'Kembali'
        );
        return;
      }
      this.orderPreviewOpen = true;
    },
    submitOrder() {
      if (!this.cartCount) { this.notify('Keranjang masih kosong', 'error'); return; }
      if (!this.paymentMethod) { this.notify('Metode pembayaran wajib dipilih', 'error'); return; }
      if (this.orderStockShortages.length && !this.orderStockOverride) {
        this.notify('Stock barang di system tidak mencukup, tetap lanjutkan order ?', 'error');
        return;
      }
      const c = this.selectedCustomer;
      if (!c.id) { this.notify('Pelanggan tidak ditemukan', 'error'); return; }
      const salesChannel = this.role === 'Sales' ? 'Sales' : 'Sales Kantor';
      const costAtOrder = this.cartRows.reduce((sum, row) => sum + (Number(row.product.cost) || 0) * row.qty, 0)
        + this.cartBonuses.reduce((sum, bonus) => sum + (Number(bonus.product.cost) || 0) * bonus.qty, 0);
      const id = 'o' + Date.now();
      const items = this.cartRows.map(row => ({ productId:row.product.id, qty:row.qty, price:row.price, discPercent:row.discPercent }));
      this.cartBonuses.forEach(bonus => items.push({ productId:bonus.product.id, qty:bonus.qty, price:0, discPercent:100, bonus:true }));
      items.forEach(item => {
        const prod = this.product(item.productId);
        if (prod.id) prod.stock = (Number(prod.stock) || 0) - (Number(item.qty) || 0);
      });
      const order = {
        id,
        code:this.nextCode('INV', this.orders),
        customerId:c.id,
        sales:c.sales,
        orderBy:this.role === 'Sales' ? c.sales : this.currentUser,
        createdById:this.currentUserId,
        createdBy:this.currentUser,
        createdByRole:this.role,
        salesChannel,
        salesPerson:salesChannel === 'Sales' ? this.currentUser : 'Sales Kantor',
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
        costAtOrder,
        items
      };
      this.orders.unshift(order);
      c.lastOrder = todayISO();
      this.selectedOrderId = id;
      this.orderPreviewOpen = false;
      this.orderStockOverride = false;
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
    orderCreatorName(order) {
      return (order && (order.createdBy || order.orderBy)) || '-';
    },
    orderCreatorRole(order) {
      if (!order) return 'Admin';
      if (order.createdByRole) return order.createdByRole;
      const name = order.createdBy || order.orderBy || '';
      const user = this.users.find(item => item.name === name || item.username === name);
      if (user && (user.roles || []).includes('Sales')) return 'Sales';
      return user ? ((user.roles || [])[0] || 'Sales Kantor') : 'Sales Kantor';
    },
    orderSalesChannel(order) {
      if (order && order.salesChannel) return order.salesChannel;
      return this.orderCreatorRole(order) === 'Sales' ? 'Sales' : 'Sales Kantor';
    },
    orderSalesPerson(order) {
      if (order && order.salesPerson) return order.salesPerson;
      return this.orderSalesChannel(order) === 'Sales' ? this.orderCreatorName(order) : 'Sales Kantor';
    },
    syncOrderAudit() {
      let changed = false;
      this.orders.forEach(order => {
        const name = order.createdBy || order.orderBy || 'Admin';
        const user = this.users.find(item => item.name === name || item.username === name);
        const role = order.createdByRole || (user ? ((user.roles || [])[0] || 'Admin') : 'Admin');
        const channel = order.salesChannel || (role === 'Sales' ? 'Sales' : 'Sales Kantor');
        const salesPerson = order.salesPerson || (channel === 'Sales' ? name : 'Sales Kantor');
        const userId = order.createdById || (user ? user.id : null);
        if (order.createdBy !== name || order.createdByRole !== role || order.salesChannel !== channel || order.salesPerson !== salesPerson || order.createdById !== userId) {
          order.createdBy = name;
          order.createdByRole = role;
          order.salesChannel = channel;
          order.salesPerson = salesPerson;
          order.createdById = userId;
          changed = true;
        }
        if (order.costAtOrder === undefined) {
          order.costAtOrder = (order.items || []).reduce((sum, item) => {
            const product = this.product(item.productId);
            return sum + (Number(product.cost) || 0) * (Number(item.qty) || 0);
          }, 0);
          changed = true;
        }
      });
      return changed;
    },
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
    orderSearch: '', orderStatus: '', selectedOrderIds: [], orderBulk: false, bulkOrderIds: [],
    orderCustomerIds: [], orderCustomerOpen: false, orderCustomerSearch: '',
    orderDate: '', orderSales: '',
    get orderCustomerOptions() {
      const q = String(this.orderCustomerSearch || '').toLowerCase();
      return this.customers.filter(c =>
        !q || (c.name + ' ' + c.code + ' ' + (c.address || '') + ' ' + (c.sales || '')).toLowerCase().includes(q)
      );
    },
    get orderCustomerFilterLabel() {
      if (!this.orderCustomerIds.length) return 'Pelanggan';
      if (this.orderCustomerIds.length === 1) return this.customer(this.orderCustomerIds[0]).name || 'Pelanggan';
      return 'Pelanggan (' + this.orderCustomerIds.length + ')';
    },
    get orderSalesOptions() {
      const values = new Set();
      this.customers.forEach(c => { if (c.sales) values.add(c.sales); });
      this.orders.forEach(o => { if (o.sales) values.add(o.sales); });
      return [...values].sort();
    },
    toggleOrderCustomerFilter(id) {
      this.orderCustomerIds = this.orderCustomerIds.includes(id)
        ? this.orderCustomerIds.filter(x => x !== id)
        : [...this.orderCustomerIds, id];
    },
    selectAllOrderCustomers() {
      this.orderCustomerIds = [...new Set(this.orderCustomerOptions.map(c => c.id))];
    },
    clearOrderCustomers() {
      this.orderCustomerIds = [];
      this.orderCustomerSearch = '';
    },
    get bulkOrders() { return this.bulkOrderIds.map(id => this.order(id)).filter(order => order.id); },
    startBulkInvoice() {
      if (!this.selectedOrderIds.length) {
        this.notify('Pilih minimal 1 order untuk dicetak', 'error');
        return;
      }
      this.bulkOrderIds = [...this.selectedOrderIds];
      this.go('bulk-invoice');
    },
    get filteredOrders() {
      const q = String(this.orderSearch || '').toLowerCase();
      return this.orders.filter(o => {
        const customer = this.customer(o.customerId);
        if (q && !(o.code + ' ' + (customer.name || '') + ' ' + (customer.address || '') + ' ' + (o.sales || '')).toLowerCase().includes(q)) return false;
        if (this.orderCustomerIds.length && !this.orderCustomerIds.includes(o.customerId)) return false;
        if (this.orderDate && (o.schedule || o.date) !== this.orderDate) return false;
        if (this.orderSales && o.sales !== this.orderSales) return false;
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
    materialStockTab: 'active',
    materialVarianceFrom: todayISO().slice(0, 8) + '01',
    materialVarianceTo: todayISO(),
    materialVarianceMaterial: '',
    materialVarianceSearch: '',
    materialVarianceOnlyDiff: true,
    materialVarianceIncludeDemo: false,
    materialVarianceProductIds: [],
    materialVarianceProductOpen: false,
    materialVarianceProductSearch: '',
    materialVarianceSelectedMaterial: '',
    materialOpnameModalOpen: false,
    materialOpnameForm: { materialId:'mat1', warehouseId:'wh1', date:todayISO(), qty:0, description:'' },
    productionSearch: '', productionDateFrom: '', productionDateTo: '', productionProductFilter: '',
    productionModalOpen: false, productionEditId: null, productionCorrection: false,
    productionDetailOpen: false, productionSelectedId: null, productionDetailTab: 'summary',
    productionForm: { warehouseId:'wh1', productId:'', date:todayISO(), qty:1, description:'', materials:[], correctionReason:'' },
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
    openMaterialOpname() {
      this.materialOpnameForm = { materialId:'mat1', warehouseId:'wh1', date:todayISO(), qty:0, description:'' };
      this.materialOpnameModalOpen = true;
    },
    get productOpnames() { return this.opnames.filter(row => !row.materialId); },
    get materialOpnames() { return this.opnames.filter(row => !!row.materialId); },
    get filteredMaterialOpnames() {
      const q = this.materialStockSearch.toLowerCase();
      return this.materialOpnames.filter(row => {
        const material = this.material(row.materialId);
        if (this.materialStockWarehouse && row.warehouseId !== this.materialStockWarehouse) return false;
        if (q && !((material.code || '') + ' ' + (material.name || '') + ' ' + (row.code || '')).toLowerCase().includes(q)) return false;
        return true;
      });
    },
    isDemoProduction(production) {
      return !!production && (production.demo === true || String(production.description || '').toLowerCase().includes('skenario demo'));
    },
    get materialVarianceBaseProductions() {
      return (this.productions || [])
        .filter(production => production.status === 'posted')
        .filter(production => !this.materialVarianceFrom || String(production.date) >= this.materialVarianceFrom)
        .filter(production => !this.materialVarianceTo || String(production.date) <= this.materialVarianceTo)
        .filter(production => !this.materialStockWarehouse || production.warehouseId === this.materialStockWarehouse)
        .filter(production => this.materialVarianceIncludeDemo || !this.isDemoProduction(production));
    },
    get materialVarianceProductions() {
      return this.materialVarianceBaseProductions
        .filter(production => !this.materialVarianceProductIds.length || this.materialVarianceProductIds.includes(production.productId));
    },
    get materialVarianceDateInvalid() {
      return !!(this.materialVarianceFrom && this.materialVarianceTo && this.materialVarianceFrom > this.materialVarianceTo);
    },
    get materialVarianceProductOptions() {
      const q = String(this.materialVarianceProductSearch || '').toLowerCase();
      return (this.products || [])
        .filter(product => product.status)
        .filter(product => !q || (product.name + ' ' + product.code).toLowerCase().includes(q))
        .sort((a, b) => String(a.name).localeCompare(String(b.name)));
    },
    materialVarianceProductCount(productId) {
      return this.materialVarianceBaseProductions.filter(production => production.productId === productId).length;
    },
    get materialVarianceProductLabel() {
      const ids = this.materialVarianceProductIds || [];
      if (!ids.length) return 'Semua Produk';
      if (ids.length === 1) return this.productName(ids[0]);
      return 'Produk (' + ids.length + ')';
    },
    toggleMaterialVarianceProduct(productId) {
      this.materialVarianceProductIds = this.materialVarianceProductIds.includes(productId)
        ? this.materialVarianceProductIds.filter(id => id !== productId)
        : [...this.materialVarianceProductIds, productId];
      this.materialVarianceSelectedMaterial = '';
    },
    selectAllMaterialVarianceProducts() {
      this.materialVarianceProductIds = [...new Set(this.materialVarianceProductOptions.map(product => product.id))];
      this.materialVarianceSelectedMaterial = '';
    },
    clearMaterialVarianceProducts() {
      this.materialVarianceProductIds = [];
      this.materialVarianceProductSearch = '';
      this.materialVarianceSelectedMaterial = '';
    },
    resetMaterialVarianceFilters() {
      this.materialVarianceFrom = todayISO().slice(0, 8) + '01';
      this.materialVarianceTo = todayISO();
      this.materialVarianceMaterial = '';
      this.materialVarianceSearch = '';
      this.materialVarianceOnlyDiff = true;
      this.materialVarianceIncludeDemo = false;
      this.materialVarianceProductIds = [];
      this.materialVarianceProductSearch = '';
      this.materialVarianceSelectedMaterial = '';
      this.materialStockWarehouse = '';
    },
    get materialVarianceRows() {
      const q = String(this.materialVarianceSearch || '').toLowerCase();
      const rows = [];
      this.materialVarianceProductions.forEach(production => {
        (production.materials || []).forEach(materialRow => {
          if (!materialRow.materialId) return;
          const material = this.material(materialRow.materialId);
          if (!material.id) return;
          const standardQty = Number(materialRow.standardQty) || 0;
          const actualQty = Number(materialRow.qty) || 0;
          const varianceQty = actualQty - standardQty;
          if (this.materialVarianceOnlyDiff && Math.abs(varianceQty) < 0.0001) return;
          if (this.materialVarianceMaterial && materialRow.materialId !== this.materialVarianceMaterial) return;
          if (q && !((production.code || '') + ' ' + (production.description || '') + ' ' + this.productName(production.productId) + ' ' + (material.code || '') + ' ' + (material.name || '') + ' ' + (materialRow.note || '')).toLowerCase().includes(q)) return;
          const price = Number(materialRow.price) || Number(material.avgCost) || Number(material.purchasePrice) || 0;
          rows.push({
            id:production.id + '-' + materialRow.materialId,
            productionId:production.id,
            productionCode:production.code,
            date:production.date,
            productId:production.productId,
            productName:this.productName(production.productId),
            warehouseId:production.warehouseId,
            warehouseName:this.warehouseName(production.warehouseId),
            materialId:materialRow.materialId,
            materialCode:material.code || '-',
            materialName:material.name || '-',
            unit:material.unit || '',
            standardQty,
            actualQty,
            varianceQty,
            variancePct:standardQty > 0 ? (varianceQty / standardQty) * 100 : 0,
            price,
            varianceValue:varianceQty * price,
            note:materialRow.note || '',
            createdBy:production.createdBy || '',
            corrected:!!(production.updatedAt && production.createdAt && production.updatedAt !== production.createdAt),
            demo:this.isDemoProduction(production)
          });
        });
      });
      return rows.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.productionCode).localeCompare(String(a.productionCode)) || String(a.materialCode).localeCompare(String(b.materialCode)));
    },
    get materialVarianceSummary() {
      const map = new Map();
      this.materialVarianceRows.forEach(row => {
        let summary = map.get(row.materialId);
        if (!summary) {
          summary = { materialId:row.materialId, code:row.materialCode, name:row.materialName, unit:row.unit, productionIds:new Set(), standardQty:0, actualQty:0, varianceQty:0, actualValue:0, varianceValue:0, lastDate:'' };
          map.set(row.materialId, summary);
        }
        summary.productionIds.add(row.productionId);
        summary.standardQty += row.standardQty;
        summary.actualQty += row.actualQty;
        summary.varianceQty += row.varianceQty;
        summary.actualValue += row.actualQty * row.price;
        summary.varianceValue += row.varianceValue;
        if (String(row.date) > summary.lastDate) summary.lastDate = row.date;
      });
      return [...map.values()]
        .map(summary => ({
          materialId:summary.materialId,
          code:summary.code,
          name:summary.name,
          unit:summary.unit,
          standardQty:summary.standardQty,
          actualQty:summary.actualQty,
          varianceQty:summary.varianceQty,
          varianceValue:summary.varianceValue,
          lastDate:summary.lastDate,
          productionCount:summary.productionIds.size,
          avgPrice:summary.actualQty > 0 ? summary.actualValue / summary.actualQty : 0,
          variancePct:summary.standardQty > 0 ? (summary.varianceQty / summary.standardQty) * 100 : 0
        }))
        .sort((a, b) => Math.abs(b.varianceValue) - Math.abs(a.varianceValue) || String(a.code).localeCompare(String(b.code)));
    },
    get materialVarianceSelectedMaterialRow() {
      return this.materialVarianceSummary.find(row => row.materialId === this.materialVarianceSelectedMaterial) || null;
    },
    get filteredMaterialVarianceDetail() {
      const selected = this.materialVarianceSelectedMaterialRow ? this.materialVarianceSelectedMaterial : '';
      return this.materialVarianceRows.filter(row => !selected || row.materialId === selected);
    },
    get materialVarianceDetailTotals() {
      return this.filteredMaterialVarianceDetail.reduce((totals, row) => {
        totals.standardQty += row.standardQty;
        totals.actualQty += row.actualQty;
        totals.varianceQty += row.varianceQty;
        totals.varianceValue += row.varianceValue;
        return totals;
      }, { standardQty:0, actualQty:0, varianceQty:0, varianceValue:0 });
    },
    get materialVarianceTotals() {
      const productionIds = new Set(this.materialVarianceRows.filter(row => Math.abs(row.varianceQty) > 0.0001).map(row => row.productionId));
      return {
        productions:this.materialVarianceProductions.length,
        productionsWithVariance:productionIds.size,
        materials:this.materialVarianceSummary.filter(row => Math.abs(row.varianceQty) > 0.0001).length,
        value:this.materialVarianceSummary.reduce((sum, row) => sum + row.varianceValue, 0)
      };
    },
    get materialOpnameWarehouseQty() {
      return this.materialStockAt(this.materialOpnameForm.materialId, this.materialOpnameForm.warehouseId);
    },
    saveMaterialOpname() {
      const form = this.materialOpnameForm;
      const material = this.material(form.materialId);
      const qty = Number(form.qty) || 0;
      if (!material.id || !form.warehouseId) { this.notify('Pilih barang dan gudang', 'error'); return; }
      if (qty === 0) { this.notify('Quantity penyesuaian tidak boleh 0', 'error'); return; }
      const currentQty = this.materialStockAt(material.id, form.warehouseId);
      if (currentQty + qty < 0) { this.notify('Penyesuaian melebihi stok yang ada (' + this.fmt(currentQty) + ' ' + (material.unit || '') + ')', 'error'); return; }
      const opname = {
        id:'op' + Date.now(),
        code:this.nextCode('OP', this.opnames),
        date:form.date || todayISO(),
        materialId:material.id,
        warehouseId:form.warehouseId,
        qty,
        unitCost:Number(material.avgCost) || Number(material.purchasePrice) || 0,
        description:form.description || 'Penyesuaian stok barang',
        by:this.currentUser,
        byRole:this.role,
        kind:'material'
      };
      material.stock = (Number(material.stock) || 0) + qty;
      material.stockValue = Math.max(0, (Number(material.stockValue) || 0) + qty * opname.unitCost);
      material.avgCost = material.stock > 0 ? material.stockValue / material.stock : opname.unitCost;
      this.stockMovements.unshift({
        id:'mv' + Date.now() + Math.random().toString(16).slice(2),
        date:opname.date,
        materialId:material.id,
        warehouseId:opname.warehouseId,
        type:'opname',
        qty,
        value:qty * opname.unitCost,
        unitCost:opname.unitCost,
        refType:'opname',
        refId:opname.id,
        refNumber:opname.code,
        createdAt:opname.date
      });
      this.opnames.unshift(opname);
      this.materialOpnameModalOpen = false;
      this.persist();
      this.notify('Stock opname barang berhasil disimpan');
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
    deleteStockHistory(s) {
      if (s.refType === 'production') { this.notify('Riwayat produksi tidak dapat dihapus', 'error'); return; }
      this.askConfirm('delete-stock', s.id, 'Hapus riwayat stock?', 'Dokumen ' + s.code + ' akan dihapus.');
    },
    deleteOpname(o) { this.askConfirm('delete-opname', o.id, 'Hapus opname?', 'Dokumen ' + o.code + ' akan dihapus.'); },

    materialStockAt(materialId, warehouseId) {
      return this.stockMovements
        .filter(movement => movement.materialId === materialId && movement.warehouseId === warehouseId)
        .reduce((sum, movement) => sum + (Number(movement.qty) || 0), 0);
    },
    get productionProductOptions() { return this.products.filter(product => product.status); },
    get productionList() {
      const q = this.productionSearch.toLowerCase();
      return [...this.productions]
        .filter(production => {
          if (q && !(production.code + ' ' + this.productName(production.productId)).toLowerCase().includes(q)) return false;
          if (this.productionProductFilter && production.productId !== this.productionProductFilter) return false;
          if (this.productionDateFrom && production.date < this.productionDateFrom) return false;
          if (this.productionDateTo && production.date > this.productionDateTo) return false;
          return true;
        })
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.code).localeCompare(String(a.code)));
    },
    get selectedProduction() {
      return this.productions.find(production => production.id === this.productionSelectedId) || this.productions[0] || {};
    },
    productionLogsFor(productionId) {
      return this.productionLogs
        .filter(log => log.productionId === productionId)
        .sort((a, b) => String(b.at).localeCompare(String(a.at)) || String(b.id).localeCompare(String(a.id)));
    },
    productionUnitPrice(materialId) {
      const material = this.material(materialId);
      return Number(material.avgCost) || Number(material.purchasePrice) || 0;
    },
    recipeQtyFor(productId, materialId) {
      const recipe = this.recipes.find(row => row.productId === productId && row.materialId === materialId);
      return Number(recipe?.qtyPerUnit) || 0;
    },
    productionRowsFromProduct(productId, qty) {
      return this.recipes
        .filter(recipe => recipe.productId === productId)
        .map(recipe => {
          const standard = (Number(recipe.qtyPerUnit) || 0) * (Number(qty) || 0);
          return {
            materialId:recipe.materialId,
            standardQty:standard,
            qty:standard,
            manual:false,
            fromRecipe:true,
            note:'',
            materialOpen:false,
            materialSearch:''
          };
        });
    },
    openProduction() {
      const product = this.productionProductOptions[0];
      this.productionEditId = null;
      this.productionCorrection = false;
      this.productionForm = {
        warehouseId:'wh1',
        productId:product ? product.id : '',
        date:todayISO(),
        qty:1,
        description:'',
        materials:product ? this.productionRowsFromProduct(product.id, 1) : [],
        correctionReason:''
      };
      this.productionModalOpen = true;
    },
    onProductionProductChange() {
      if (this.productionCorrection) return;
      this.productionForm.materials = this.productionRowsFromProduct(this.productionForm.productId, this.productionForm.qty);
    },
    onProductionQtyChange() {
      if (this.productionCorrection) return;
      const qty = Number(this.productionForm.qty) || 0;
      (this.productionForm.materials || []).forEach(row => {
        if (!row.fromRecipe) return;
        row.standardQty = this.recipeQtyFor(this.productionForm.productId, row.materialId) * qty;
        if (!row.manual) row.qty = row.standardQty;
      });
    },
    productionMaterialOptions(index) {
      const row = (this.productionForm.materials || [])[index] || {};
      const selectedElsewhere = (this.productionForm.materials || [])
        .filter((item, itemIndex) => itemIndex !== index)
        .map(item => item.materialId)
        .filter(Boolean);
      const query = String(row.materialSearch || '').toLowerCase();
      return this.materials.filter(material => {
        if (!material.status) return false;
        if (selectedElsewhere.includes(material.id)) return false;
        if (!query) return true;
        return (material.code + ' ' + material.name + ' ' + material.unit).toLowerCase().includes(query);
      });
    },
    selectProductionMaterial(index, material) {
      const row = (this.productionForm.materials || [])[index];
      if (!row) return;
      row.materialId = material.id;
      row.materialOpen = false;
      row.materialSearch = '';
    },
    addProductionMaterial() {
      if (this.productionCorrection) return;
      this.productionForm.materials.push({
        materialId:'',
        standardQty:0,
        qty:0,
        manual:true,
        fromRecipe:false,
        note:'',
        materialOpen:true,
        materialSearch:''
      });
    },
    removeProductionMaterial(index) {
      if (this.productionCorrection) return;
      this.productionForm.materials.splice(index, 1);
    },
    setProductionQty(index, value) {
      const row = this.productionForm.materials[index];
      if (!row) return;
      row.qty = Math.max(0, Number(value) || 0);
      row.manual = true;
    },
    resetProductionRow(index) {
      const row = this.productionForm.materials[index];
      if (!row || !row.fromRecipe) return;
      row.qty = Number(row.standardQty) || 0;
      row.manual = false;
    },
    productionRowDifference(row) { return (Number(row.qty) || 0) - (Number(row.standardQty) || 0); },
    productionRowAvailable(row) { return this.materialStockAt(row.materialId, this.productionForm.warehouseId); },
    productionRowCost(row) { return (Number(row.qty) || 0) * this.productionUnitPrice(row.materialId); },
    get productionTotalCost() {
      return (this.productionForm.materials || []).reduce((sum, row) => sum + this.productionRowCost(row), 0);
    },
    get productionCostPerUnit() {
      const qty = Number(this.productionForm.qty) || 0;
      return qty > 0 ? this.productionTotalCost / qty : 0;
    },
    get productionChangedRows() {
      return (this.productionForm.materials || []).filter(row =>
        row.materialId && (row.manual || Number(row.qty) !== Number(row.standardQty) || (row.fromRecipe === false && Number(row.qty) > 0))
      ).length;
    },
    get productionHasShortage() {
      return (this.productionForm.materials || []).some(row => Number(row.qty) > this.productionRowAvailable(row) + 0.0001);
    },
    productionRowNeedsReason(row) {
      return Number(row.qty) !== Number(row.standardQty) || (row.fromRecipe === false && Number(row.qty) > 0);
    },
    productionValidationError() {
      const form = this.productionForm;
      const product = this.product(form.productId);
      if (!product.id || !product.status) return 'Pilih produk aktif';
      if (!form.warehouseId) return 'Gudang wajib dipilih';
      if (Number(form.qty) <= 0) return 'Hasil produksi harus lebih dari 0';
      if (this.productionCorrection && !String(form.correctionReason || '').trim()) return 'Alasan koreksi wajib diisi';
      const rows = (form.materials || []).filter(row => row.materialId);
      const usedRows = rows.filter(row => Number(row.qty) > 0);
      if (!usedRows.length) return 'Tambahkan minimal 1 bahan baku yang dipakai';
      const duplicates = rows.map(row => row.materialId).filter((id, index, list) => list.indexOf(id) !== index);
      if (duplicates.length) return 'Bahan baku tidak boleh dobel';
      for (const row of usedRows) {
        const material = this.material(row.materialId);
        if (!material.id || !material.status) return 'Bahan baku tidak aktif atau tidak ditemukan';
        const available = this.productionRowAvailable(row);
        if (Number(row.qty) > available + 0.0001) {
          return 'Stok ' + (material.name || 'bahan') + ' tidak mencukupi. Tersedia ' + this.fmt(available) + ' ' + (material.unit || '');
        }
      }
      for (const row of rows) {
        const material = this.material(row.materialId);
        if (this.productionRowNeedsReason(row) && !String(row.note || '').trim()) {
          return 'Alasan wajib diisi untuk bahan ' + (material.name || '') + ' karena selisih / bahan tambahan';
        }
      }
      if (this.productionCorrection) {
        const original = this.productions.find(item => item.id === this.productionEditId);
        if (!original) return 'Data produksi tidak ditemukan';
        const originalIds = (original.materials || []).map(row => row.materialId);
        const invalid = (form.materials || []).find(row => row.materialId && !originalIds.includes(row.materialId));
        if (invalid) return 'Koreksi tidak boleh menambah bahan baru';
        const productDelta = Number(form.qty) - (Number(original.qty) || 0);
        if (productDelta < 0 && (Number(product.stock) || 0) + productDelta < 0) {
          return 'Stok produk tidak mencukupi untuk koreksi hasil produksi';
        }
      }
      return null;
    },
    nextProductionCode(date) {
      const year = String(date || todayISO()).slice(0, 4);
      const prefix = 'PRD-' + year + '-';
      const max = this.productions.reduce((value, production) => {
        if (!String(production.code || '').startsWith(prefix)) return value;
        return Math.max(value, Number(String(production.code).slice(prefix.length)) || 0);
      }, 0);
      return prefix + String(max + 1).padStart(4, '0');
    },
    saveProduction(confirmed = false) {
      const error = this.productionValidationError();
      if (error) { this.notify(error, 'error'); return; }
      if (!confirmed) {
        this.askSave(
          'save-production',
          this.productionEditId,
          (this.productionCorrection ? 'Koreksi produksi akan disimpan. Stok akan disesuaikan sebesar selisih.' : 'Produksi akan disimpan. Stok produk bertambah dan stok bahan baku berkurang.') + ' ' + this.productName(this.productionForm.productId) + ' • ' + this.fmt(this.productionForm.qty) + ' ' + (this.product(this.productionForm.productId).unit || ''),
          'Simpan'
        );
        return;
      }
      if (this.productionCorrection) {
        this.commitProductionCorrection();
      } else {
        this.commitProductionCreate();
      }
    },
    commitProductionCreate() {
      const form = this.productionForm;
      const product = this.product(form.productId);
      const rows = (form.materials || [])
        .filter(row => Number(row.qty) > 0)
        .map(row => ({
          materialId:row.materialId,
          standardQty:Number(row.standardQty) || 0,
          qty:Number(row.qty) || 0,
          price:this.productionUnitPrice(row.materialId),
          note:String(row.note || '').trim(),
          fromRecipe:row.fromRecipe !== false
        }));
      const code = this.nextProductionCode(form.date);
      const now = todayISO();
      const totalCost = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
      const production = {
        id:'prd' + Date.now(),
        code,
        date:form.date || now,
        productId:product.id,
        warehouseId:form.warehouseId,
        qty:Number(form.qty) || 0,
        description:form.description || '',
        status:'posted',
        materials:rows,
        totalCost,
        costPerUnit:Number(form.qty) > 0 ? totalCost / Number(form.qty) : 0,
        createdBy:this.currentUser,
        createdById:this.currentUserId,
        createdByRole:this.role,
        createdAt:now,
        updatedAt:now
      };
      product.stock = (Number(product.stock) || 0) + production.qty;
      this.stockHistory.unshift({
        id:'sh' + Date.now() + 'a',
        code,
        date:production.date,
        warehouseId:production.warehouseId,
        description:'Produksi (hasil) ' + code,
        by:this.currentUser,
        byRole:this.role,
        type:'production-result',
        refType:'production',
        refId:production.id,
        refNumber:code,
        items:[{ productId:product.id, qty:production.qty }]
      });
      const usageItems = [];
      rows.forEach(row => {
        const material = this.material(row.materialId);
        if (!material.id) return;
        material.stock = Math.max(0, (Number(material.stock) || 0) - row.qty);
        material.stockValue = Math.max(0, (Number(material.stockValue) || 0) - row.qty * row.price);
        material.avgCost = material.stock > 0 ? material.stockValue / material.stock : row.price;
        usageItems.push({ materialId:row.materialId, qty:-row.qty });
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date:production.date,
          materialId:row.materialId,
          warehouseId:production.warehouseId,
          type:'production-usage',
          qty:-row.qty,
          value:-(row.qty * row.price),
          unitCost:row.price,
          refType:'production',
          refId:production.id,
          refNumber:code,
          createdAt:now
        });
      });
      this.stockHistory.unshift({
        id:'sh' + Date.now() + 'b',
        code,
        date:production.date,
        warehouseId:production.warehouseId,
        description:'Produksi (pemakaian) ' + code,
        by:this.currentUser,
        byRole:this.role,
        type:'production-usage',
        refType:'production',
        refId:production.id,
        refNumber:code,
        items:usageItems
      });
      this.productions.unshift(production);
      this.productionLogs.unshift({
        id:'plog' + Date.now(),
        productionId:production.id,
        at:now,
        user:this.currentUser,
        role:this.role,
        action:'buat',
        detail:'Produksi ' + code + ' dibuat: ' + this.fmt(production.qty) + ' ' + (product.unit || '') + ', ' + rows.length + ' jenis bahan.',
        reason:''
      });
      this.productionModalOpen = false;
      this.productionEditId = null;
      this.productionSelectedId = production.id;
      this.stockTab = 'production';
      this.persist();
      this.notify('Produksi ' + code + ' berhasil disimpan');
    },
    commitProductionCorrection() {
      const form = this.productionForm;
      const original = this.productions.find(item => item.id === this.productionEditId);
      if (!original) { this.notify('Data produksi tidak ditemukan', 'error'); return; }
      const product = this.product(original.productId);
      const oldQty = Number(original.qty) || 0;
      const newQty = Number(form.qty) || 0;
      const changes = [];
      const productDelta = newQty - oldQty;
      if (productDelta !== 0) {
        product.stock = Math.max(0, (Number(product.stock) || 0) + productDelta);
        this.stockHistory.unshift({
          id:'sh' + Date.now() + 'c',
          code:original.code,
          date:todayISO(),
          warehouseId:original.warehouseId,
          description:'Koreksi Produksi ' + original.code,
          by:this.currentUser,
          byRole:this.role,
          type:'production-correction',
          refType:'production',
          refId:original.id,
          refNumber:original.code,
          items:[{ productId:product.id, qty:productDelta }]
        });
        changes.push('Hasil: ' + this.fmt(oldQty) + ' menjadi ' + this.fmt(newQty) + ' ' + (product.unit || ''));
      }
      (original.materials || []).forEach(materialRow => {
        const formRow = (form.materials || []).find(row => row.materialId === materialRow.materialId);
        if (!formRow) return;
        const material = this.material(materialRow.materialId);
        const oldUsed = Number(materialRow.qty) || 0;
        const newUsed = Number(formRow.qty) || 0;
        const delta = newUsed - oldUsed;
        const price = Number(materialRow.price) || this.productionUnitPrice(materialRow.materialId);
        if (delta !== 0) {
          material.stock = Math.max(0, (Number(material.stock) || 0) - delta);
          material.stockValue = Math.max(0, (Number(material.stockValue) || 0) - delta * price);
          material.avgCost = material.stock > 0 ? material.stockValue / material.stock : price;
          this.stockMovements.unshift({
            id:'mv' + Date.now() + Math.random().toString(16).slice(2),
            date:todayISO(),
            materialId:materialRow.materialId,
            warehouseId:original.warehouseId,
            type:'production-correction',
            qty:-delta,
            value:-(delta * price),
            unitCost:price,
            refType:'production',
            refId:original.id,
            refNumber:original.code,
            createdAt:todayISO()
          });
          changes.push((material.name || 'Bahan') + ': ' + this.fmt(oldUsed) + ' menjadi ' + this.fmt(newUsed) + ' ' + (material.unit || ''));
        }
        materialRow.qty = newUsed;
        materialRow.note = String(formRow.note || '').trim();
      });
      original.qty = newQty;
      original.materials = (original.materials || []).map(materialRow => ({ ...materialRow, price:Number(materialRow.price) || 0 }));
      original.totalCost = original.materials.reduce((sum, row) => sum + (Number(row.qty) || 0) * (Number(row.price) || 0), 0);
      original.costPerUnit = newQty > 0 ? original.totalCost / newQty : 0;
      original.updatedAt = todayISO();
      original.updatedBy = this.currentUser;
      original.updatedByRole = this.role;
      this.productionLogs.unshift({
        id:'plog' + Date.now(),
        productionId:original.id,
        at:todayISO(),
        user:this.currentUser,
        role:this.role,
        action:'koreksi',
        detail:changes.length ? changes.join('; ') : 'Tidak ada perubahan nilai',
        reason:String(form.correctionReason || '').trim()
      });
      this.productionModalOpen = false;
      this.productionCorrection = false;
      this.productionEditId = null;
      this.productionSelectedId = original.id;
      this.persist();
      this.notify('Koreksi produksi ' + original.code + ' berhasil disimpan');
    },
    get canCorrectProduction() { return ['Admin','Manager','Developer'].includes(this.role); },
    viewProduction(production) {
      this.productionSelectedId = production.id;
      this.productionDetailTab = 'summary';
      this.productionDetailOpen = true;
    },
    openProductionByRef(refId) {
      const production = this.productions.find(item => item.id === refId);
      if (production) this.viewProduction(production);
    },
    openProductionCorrection(production) {
      if (!this.canCorrectProduction) { this.notify('Role Anda tidak berhak mengoreksi produksi', 'error'); return; }
      if (!production || production.status !== 'posted') { this.notify('Produksi ini tidak dapat dikoreksi', 'error'); return; }
      this.productionEditId = production.id;
      this.productionCorrection = true;
      this.productionForm = {
        warehouseId:production.warehouseId,
        productId:production.productId,
        date:production.date,
        qty:production.qty,
        description:production.description || '',
        correctionReason:'',
        materials:(production.materials || []).map(row => ({
          materialId:row.materialId,
          standardQty:Number(row.standardQty) || 0,
          qty:Number(row.qty) || 0,
          manual:Number(row.qty) !== Number(row.standardQty),
          fromRecipe:row.fromRecipe !== false,
          note:row.note || '',
          materialOpen:false,
          materialSearch:''
        }))
      };
      this.productionDetailOpen = false;
      this.productionModalOpen = true;
    },
    productionChangedCount(production) {
      return (production.materials || []).filter(row => Number(row.qty) !== Number(row.standardQty) || row.fromRecipe === false).length;
    },
    productionDifferenceLabel(production) {
      const count = this.productionChangedCount(production);
      return count ? count + ' bahan berbeda' : 'Sesuai standar';
    },
    stockHistoryTypeLabel(type) {
      return {
        'production-result':'Produksi (hasil)',
        'production-usage':'Produksi (pemakaian)',
        'production-correction':'Koreksi Produksi'
      }[type] || 'Stock Masuk';
    },
    materialMovementLabel(type) {
      return {
        receipt:'Penerimaan Barang',
        'purchase-return':'Return Pembelian',
        'purchase-return-void':'Pembatalan Return',
        'purchase-return-replacement':'Ganti Barang',
        'production-usage':'Produksi (pemakaian)',
        'production-correction':'Koreksi Produksi',
        opname:'Stock Opname'
      }[type] || type;
    },
    get filteredMaterialMovements() {
      const q = this.materialStockSearch.toLowerCase();
      return [...this.stockMovements]
        .filter(movement => {
          const material = this.material(movement.materialId);
          if (this.materialStockWarehouse && movement.warehouseId !== this.materialStockWarehouse) return false;
          if (q && !(material.code + ' ' + material.name + ' ' + (movement.refNumber || '')).toLowerCase().includes(q)) return false;
          return true;
        })
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    },

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
      journal.history.push({ action:'void', by:this.currentUser, byRole:this.role, at:todayISO(), note:reason || 'Revisi transaksi' });
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

    /* ---------- PAYABLES / UTANG ---------- */
    payableSearch: '', payableStatus: '', payableSupplier: '',
    payableDetailOpen: false, payableSelectedId: null,
    payablePaymentOpen: false, payablePaymentId: null,
    payablePaymentForm: { date:todayISO(), cashAccountId:'acc1', amount:0, note:'', proof:'' },
    get filteredPayables() {
      const q = this.payableSearch.toLowerCase();
      return this.payables.filter(payable => {
        if (q && !(payable.code + ' ' + (payable.poCode || '') + ' ' + (payable.receiptCode || '') + ' ' + this.supplierName(payable.supplierId)).toLowerCase().includes(q)) return false;
        if (this.payableStatus && payable.status !== this.payableStatus) return false;
        if (this.payableSupplier && payable.supplierId !== this.payableSupplier) return false;
        return true;
      });
    },
    get selectedPayable() {
      return this.payables.find(payable => payable.id === this.payableSelectedId) || this.payables[0] || {};
    },
    get payablePayments() {
      return this.payables.flatMap(payable => (payable.payments || []).map(payment => ({
        ...payment,
        payableId:payable.id,
        payableCode:payable.code,
        supplierId:payable.supplierId,
        poCode:payable.poCode
      })));
    },
    get payableUnpaidTotal() {
      return this.payables.reduce((sum, payable) => sum + (Number(payable.unpaid) || 0), 0);
    },
    get payablePaidTotal() {
      return this.payables.reduce((sum, payable) => sum + (Number(payable.paid) || 0), 0);
    },
    get payableTotalValue() {
      return this.payables.reduce((sum, payable) => sum + (Number(payable.total) || 0), 0);
    },
    payableStatusBadge(status) {
      return { unpaid:'badge-red', partial:'badge-yellow', paid:'badge-green' }[status] || 'badge-slate';
    },
    payableStatusLabel(status) {
      return { unpaid:'Belum Dibayar', partial:'Dibayar Sebagian', paid:'Lunas' }[status] || status;
    },
    viewPayable(payable) {
      this.payableSelectedId = payable.id;
      this.payableDetailOpen = true;
    },
    openPayablePayment(payable) {
      if (!payable || payable.status === 'paid' || Number(payable.unpaid) <= 0) {
        this.notify('Utang ini sudah lunas', 'error');
        return;
      }
      this.payablePaymentId = payable.id;
      this.payablePaymentForm = {
        date:todayISO(),
        cashAccountId:this.cashAccountOptions()[0]?.id || 'acc1',
        amount:Number(payable.unpaid) || 0,
        note:'',
        proof:''
      };
      this.payablePaymentOpen = true;
    },
    savePayablePayment(confirmed = false) {
      const payable = this.payables.find(item => item.id === this.payablePaymentId);
      if (!payable) { this.notify('Utang tidak ditemukan', 'error'); return; }
      const amount = Number(this.payablePaymentForm.amount) || 0;
      const unpaid = Number(payable.unpaid) || 0;
      if (!this.payablePaymentForm.date) { this.notify('Tanggal pembayaran wajib diisi', 'error'); return; }
      if (amount <= 0) { this.notify('Nominal pembayaran harus lebih dari 0', 'error'); return; }
      if (amount > unpaid + 0.0001) { this.notify('Nominal melebihi sisa utang ' + this.rp(unpaid), 'error'); return; }
      const cash = this.accountById(this.payablePaymentForm.cashAccountId);
      if (!cash.id || !cash.isCashBank || !cash.status) { this.notify('Pilih akun Kas/Bank yang aktif', 'error'); return; }
      if (!confirmed) {
        this.askSave('save-payable-payment', payable.id, 'Pembayaran utang ' + payable.code + ' sebesar ' + this.rp(amount) + ' akan disimpan dan jurnal dibuat otomatis.', 'Simpan');
        return;
      }
      const date = this.payablePaymentForm.date;
      const code = docCode('PP', date, nextDocSeq(this.payablePayments, 'PP', date));
      const paymentId = 'pp' + Date.now();
      const journal = this.createSystemJournal({
        date,
        description:'Pembayaran utang ' + payable.code,
        source:'payable-payment',
        sourceId:paymentId,
        lines:[
          { accountId:'acc7', debit:amount, credit:0, memo:'Pelunasan utang ' + payable.code },
          { accountId:cash.id, debit:0, credit:amount, memo:'Kas keluar ' + code }
        ]
      });
      const payment = {
        id:paymentId,
        code,
        date,
        amount,
        cashAccountId:cash.id,
        cashAccountName:cash.name,
        note:this.payablePaymentForm.note || '',
        proof:this.payablePaymentForm.proof || '',
        journalId:journal ? journal.id : '',
        by:this.currentUser,
        byRole:this.role,
        createdAt:todayISO()
      };
      payable.payments = payable.payments || [];
      payable.payments.unshift(payment);
      payable.paid = (Number(payable.paid) || 0) + amount;
      payable.unpaid = Math.max(0, unpaid - amount);
      payable.status = payable.unpaid <= 0 ? 'paid' : 'partial';
      payable.history = payable.history || [];
      payable.history.push({ action:'payment', by:this.currentUser, byRole:this.role, at:todayISO(), note:code });
      this.payablePaymentOpen = false;
      this.persist();
      this.notify('Pembayaran utang ' + code + ' berhasil disimpan');
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
        'Order, surat jalan, return, piutang, penagihan, pembayaran, riwayat stok, opname, pendapatan/pengeluaran, Purchase Request, Purchase Order, Penerimaan Barang, Return Pembelian, jurnal, dan utang akan dihapus. Master data tetap; stok barang mentah direset ke 0.'
      );
    },
    fillDummyData() {
      this.askConfirm(
        'seed-dummy',
        null,
        'Isi data dummy?',
        'Data transaksi saat ini akan diganti dengan data demo lengkap: pembelian, penerimaan, produksi, order, surat jalan, piutang, utang, dan keuangan. Master data serta resep tetap.',
        false,
        'Isi Data'
      );
    },
    seedDummyData() {
      const requiredMaterials = ['mat1','mat2','mat3','mat4','mat5','mat6','mat7'];
      const requiredProducts = ['p1','p2','p3'];
      const requiredCustomers = ['c1','c2','c3','c4','c5','c6','c7'];
      if (!requiredMaterials.every(id => this.material(id).id)
        || !requiredProducts.every(id => this.product(id).id)
        || !requiredCustomers.every(id => this.customer(id).id)
        || !this.warehouses.some(w => w.id === 'wh1')) {
        this.notify('Master data demo belum lengkap. Gunakan Reset Data Demo terlebih dahulu.', 'error');
        return;
      }
      const now = todayISO();
      const d = (n) => shiftISO(now, n);
      const actor = (name, role) => ({ by:name, byRole:role });
      const seq = {};
      const code = (prefix, iso) => {
        const key = prefix + '|' + String(iso || now).slice(0, 7);
        seq[key] = (seq[key] || 0) + 1;
        return docCode(prefix, iso || now, seq[key]);
      };
      let productionSeq = 0;
      const productionCode = (iso) => {
        productionSeq += 1;
        return 'PRD-' + String(iso || now).slice(0, 4) + '-' + String(productionSeq).padStart(4, '0');
      };
      const accId = (accountCode) => (this.accounts.find(account => account.code === accountCode) || {}).id || '';
      const post = (date, description, source, sourceId, lines) => {
        const journal = this.createSystemJournal({ date, description, source, sourceId, lines });
        return journal ? journal.id : '';
      };
      const reset = ['orders','deliveries','returns','receivables','collections','payments','stockHistory','opnames','incomes','expenses','monthlyHistory','purchaseRequests','purchaseOrders','receipts','purchaseReturns','stockMovements','payables','productions','productionLogs','journals'];
      reset.forEach(key => { this[key] = []; });
      const openingEquity = accId('3-1100') || accId('3-1000');
      if (openingEquity) {
        post(d(-30), 'Saldo awal demo', 'opening-demo', 'opening-demo', [
          { accountId:accId('1-1100'), debit:10000000, credit:0, memo:'Kas awal' },
          { accountId:accId('1-1200'), debit:50000000, credit:0, memo:'Bank awal' },
          { accountId:accId('1-1600'), debit:15000000, credit:0, memo:'Peralatan awal' },
          { accountId:openingEquity, debit:0, credit:75000000, memo:'Saldo awal ekuitas' }
        ]);
      }
      const demoMaterialPrices = { mat2:132, mat5:39, mat6:15, mat4:3309, mat7:31 };
      this.materials.forEach(material => {
        if (demoMaterialPrices[material.id] != null) material.purchasePrice = demoMaterialPrices[material.id];
        material.stock = 0;
        material.stockValue = 0;
        material.avgCost = Number(material.purchasePrice) || 0;
      });
      this.products.forEach((product, index) => { product.stock = index === 0 ? 800 : 300; });
      this.seedDummyMonthlyPeriods();
      const addMaterialStock = (materialId, warehouseId, qty, value, type, refType, refId, refNumber, date, unitCost) => {
        const material = this.material(materialId);
        if (!material.id) return;
        material.stock = Math.max(0, (Number(material.stock) || 0) + qty);
        material.stockValue = Math.max(0, (Number(material.stockValue) || 0) + value);
        material.avgCost = material.stock > 0 ? material.stockValue / material.stock : unitCost;
        this.stockMovements.unshift({
          id:'mv' + Date.now() + Math.random().toString(16).slice(2),
          date,
          materialId,
          warehouseId,
          type,
          qty,
          value,
          unitCost,
          refType,
          refId,
          refNumber,
          createdAt:date
        });
      };
      const makeOrder = (customerId, specs, status, paymentStatus, date, extra = {}) => {
        const customer = this.customer(customerId);
        const items = specs.map(([productId, qty]) => {
          const product = this.product(productId);
          const price = customer.priceType === 'out' ? product.outSale : product.inSale;
          return { productId, qty, price, discPercent:0 };
        });
        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const tax = Math.round(subtotal * 0.11);
        const total = subtotal + tax;
        const creator = extra.orderBy || 'Admin';
        const creatorUser = this.users.find(user => user.name === creator || user.username === creator);
        const creatorRole = extra.createdByRole || (creatorUser ? (creatorUser.roles || [])[0] : 'Admin');
        const salesChannel = creatorRole === 'Sales' ? 'Sales' : 'Sales Kantor';
        items.forEach(item => {
          const product = this.product(item.productId);
          if (product.id) product.stock = Math.max(0, (Number(product.stock) || 0) - item.qty);
        });
        const order = {
          id:'o' + Date.now() + Math.random().toString(16).slice(2),
          code:code('INV', date),
          customerId,
          sales:customer.sales,
          orderBy:creator,
          createdById:creatorUser ? creatorUser.id : null,
          createdBy:creator,
          createdByRole:creatorRole,
          salesChannel,
          salesPerson:salesChannel === 'Sales' ? creator : 'Sales Kantor',
          status,
          payment:paymentStatus,
          delivery:'full',
          radius:extra.radius || 'onsite',
          date,
          schedule:date,
          dueDate:shiftISO(date, 14),
          subtotal,
          discount:0,
          tax,
          total,
          customDiscount:0,
          paymentMethod:extra.paymentMethod || 'Transfer',
          stockApplied:true,
          costAtOrder:items.reduce((sum, item) => sum + (Number(this.product(item.productId).cost) || 0) * item.qty, 0),
          items
        };
        this.orders.unshift(order);
        return order;
      };
      const makeDelivery = (orders, status, date, createdBy) => {
        const list = orders.filter(order => order && order.id);
        if (!list.length) return null;
        const delivery = {
          id:'d' + Date.now() + Math.random().toString(16).slice(2),
          code:code('DO', date),
          orderIds:list.map(order => order.id),
          periodStart:date,
          periodEnd:shiftISO(date, 7),
          driver:'Budi Santoso',
          car:'L300 - DD 1234 AB',
          warehouseId:'wh1',
          status,
          total:list.reduce((sum, order) => sum + order.total, 0),
          createdBy
        };
        this.deliveries.unshift(delivery);
        return delivery;
      };
      const makeReceivable = (order, cash, transfer, dueDate) => {
        const receivable = {
          id:'rc' + Date.now() + Math.random().toString(16).slice(2),
          orderId:order.id,
          orderCode:order.code,
          customerId:order.customerId,
          sales:order.sales,
          schedule:order.schedule,
          due:dueDate || order.dueDate,
          total:order.total,
          cash,
          transfer,
          unpaid:Math.max(0, order.total - cash - transfer)
        };
        this.receivables.unshift(receivable);
        return receivable;
      };
      const makeCollection = (sales, date, status, items, paid) => {
        const total = items.reduce((sum, item) => sum + item.total, 0);
        const unpaid = Math.max(0, total - paid);
        const collection = {
          id:'cl' + Date.now() + Math.random().toString(16).slice(2),
          code:code('CL', date),
          sales,
          date,
          status,
          itemIds:items.map(item => item.id),
          total,
          paid,
          unpaid
        };
        this.collections.unshift(collection);
        return collection;
      };
      const addFinance = (kind, amount, date, accountCode, cashAccountCode, description, person) => {
        const journalId = post(
          date,
          description,
          kind,
          '',
          kind === 'income'
            ? [{ accountId:accId(cashAccountCode), debit:amount, credit:0, memo:'Kas masuk' }, { accountId:accId(accountCode), debit:0, credit:amount, memo:description }]
            : [{ accountId:accId(accountCode), debit:amount, credit:0, memo:description }, { accountId:accId(cashAccountCode), debit:0, credit:amount, memo:'Kas keluar' }]
        );
        const item = {
          id:'f' + Date.now() + Math.random().toString(16).slice(2),
          code:code(kind === 'income' ? 'IC' : 'OC', date),
          accountId:accId(accountCode),
          cashAccountId:accId(cashAccountCode),
          amount,
          date,
          description,
          proof:'',
          by:person,
          journalId
        };
        (kind === 'income' ? this.incomes : this.expenses).unshift(item);
        return item;
      };

      const pr1Date = d(-20);
      const po1Date = d(-18);
      const gr1Date = d(-17);
      const pr1Items = [
        { materialId:'mat2', qty:130000, note:'Cup produksi, stok minimal 2.000 Krt' },
        { materialId:'mat5', qty:130000, note:'Lid produksi, stok minimal 2.000 Krt' },
        { materialId:'mat6', qty:130000, note:'Straw produksi, stok minimal 2.000 Krt' },
        { materialId:'mat4', qty:3000, note:'Karton box' },
        { materialId:'mat7', qty:6000, note:'Lakban' }
      ];
      const pr1 = {
        id:'pr' + Date.now() + '1',
        code:code('PR', pr1Date),
        date:pr1Date,
        requesterId:'u5',
        requester:'Rina',
        purpose:'Restock bahan kemasan untuk produksi bulan ini',
        status:'completed',
        items:pr1Items.map(item => ({ ...item, orderedQty:item.qty })),
        history:[
          { action:'submitted', ...actor('Rina','Manager'), at:pr1Date, note:'' },
          { action:'approved', ...actor('Sari','Supervisor'), at:shiftISO(pr1Date,1), note:'' },
          { action:'po-approved', ...actor('Rina','Manager'), at:po1Date, note:'PO/2026/11/0001' }
        ],
        rejectReason:''
      };
      this.purchaseRequests.unshift(pr1);
      const po1Items = [
        { materialId:'mat2', qty:130000, price:132 },
        { materialId:'mat5', qty:130000, price:39 },
        { materialId:'mat6', qty:130000, price:15 },
        { materialId:'mat4', qty:3000, price:3309 },
        { materialId:'mat7', qty:6000, price:31 }
      ];
      const po1Total = po1Items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const po1AdditionalCosts = [
        { description:'Ongkos kirim', amount:750000, qty:1, subtotal:750000 },
        { description:'Biaya buruh bongkar', amount:250000, qty:2, subtotal:500000 }
      ];
      const po1AdditionalTotal = po1AdditionalCosts.reduce((sum, row) => sum + row.subtotal, 0);
      const po1GrandTotal = po1Total + po1AdditionalTotal;
      const po1 = {
        id:'po' + Date.now() + '1',
        code:code('PO', po1Date),
        date:po1Date,
        supplierId:'sup1',
        prId:pr1.id,
        prCode:pr1.code,
        paymentTerms:'30 hari',
        notes:'Pengadaan bahan kemasan produksi',
        status:'fully_received',
        items:po1Items.map(item => ({ ...item, receivedQty:item.qty, returnedQty:0 })),
        additionalCosts:po1AdditionalCosts,
        additionalTotal:po1AdditionalTotal,
        subtotal:po1Total,
        total:po1GrandTotal,
        createdBy:'Rina',
        createdById:'u5',
        history:[
          { action:'submitted', ...actor('Rina','Manager'), at:po1Date, note:'' },
          { action:'approved', ...actor('Sari','Supervisor'), at:shiftISO(po1Date,1), note:'' },
          { action:'received', ...actor('Rina','Manager'), at:gr1Date, note:'GR/2026/11/0001' }
        ],
        rejectReason:''
      };
      this.purchaseOrders.unshift(po1);
      const gr1 = {
        id:'gr' + Date.now() + '1',
        code:code('GR', gr1Date),
        date:gr1Date,
        poId:po1.id,
        poCode:po1.code,
        supplierId:po1.supplierId,
        warehouseId:'wh1',
        deliveryNote:'SJ-SKM-1024',
        status:'posted',
        items:po1Items.map(item => ({ ...item })),
        total:po1Total,
        additionalCost:po1AdditionalTotal,
        apTotal:po1GrandTotal,
        journalId:'',
        payableId:'',
        createdBy:'Rina',
        createdById:'u5',
        postedAt:gr1Date,
        history:[{ action:'draft', ...actor('Rina','Manager'), at:gr1Date, note:'' }, { action:'posted', ...actor('Rina','Manager'), at:gr1Date, note:'' }]
      };
      this.receipts.unshift(gr1);
      po1Items.forEach(item => addMaterialStock(item.materialId, 'wh1', item.qty, item.qty * item.price, 'receipt', 'receipt', gr1.id, gr1.code, gr1Date, item.price));
      gr1.journalId = post(gr1Date, 'Penerimaan barang ' + gr1.code, 'receipt', gr1.id, [
        { accountId:accId('1-1400'), debit:po1Total, credit:0, memo:'Persediaan ' + gr1.code },
        { accountId:accId('5-1100'), debit:po1AdditionalTotal, credit:0, memo:'Biaya tambahan ' + gr1.code },
        { accountId:accId('2-1100'), debit:0, credit:po1GrandTotal, memo:'Utang supplier ' + gr1.code }
      ]);
      const ap1 = {
        id:'ap' + Date.now() + '1',
        code:code('AP', gr1Date),
        supplierId:'sup1',
        receiptId:gr1.id,
        receiptCode:gr1.code,
        poId:po1.id,
        poCode:po1.code,
        date:gr1Date,
        dueDate:shiftISO(gr1Date, 30),
        total:po1GrandTotal,
        paid:0,
        unpaid:po1GrandTotal,
        status:'unpaid',
        payments:[],
        history:[{ action:'created', ...actor('Rina','Manager'), at:gr1Date, note:gr1.code }]
      };
      this.payables.unshift(ap1);
      gr1.payableId = ap1.id;
      const apPayDate = d(-5);
      const apPayAmount = 5000000;
      ap1.paid = apPayAmount;
      ap1.unpaid = ap1.total - apPayAmount;
      ap1.status = 'partial';
      const apPayCode = code('PP', apPayDate);
      ap1.payments.unshift({
        id:'pp' + Date.now() + '1',
        code:apPayCode,
        date:apPayDate,
        amount:apPayAmount,
        cashAccountId:accId('1-1200'),
        cashAccountName:'Bank BCA',
        note:'Pembayaran sebagian',
        proof:'',
        journalId:post(apPayDate, 'Pembayaran utang ' + ap1.code, 'payable-payment', ap1.id, [
          { accountId:accId('2-1100'), debit:apPayAmount, credit:0, memo:'Pelunasan utang' },
          { accountId:accId('1-1200'), debit:0, credit:apPayAmount, memo:'Kas keluar' }
        ]),
        by:'Rina',
        byRole:'Manager',
        createdAt:apPayDate
      });
      ap1.history.push({ action:'payment', ...actor('Rina','Manager'), at:apPayDate, note:apPayCode });

      const pr2Date = d(-14);
      const po2Date = d(-12);
      const gr2Date = d(-10);
      const pr2 = {
        id:'pr' + Date.now() + '2',
        code:code('PR', pr2Date),
        date:pr2Date,
        requesterId:'u5',
        requester:'Rina',
        purpose:'Restock botol dan label produksi',
        status:'processing',
        items:[{ materialId:'mat1', qty:20000, note:'Botol PET', orderedQty:20000 }, { materialId:'mat3', qty:15000, note:'Label', orderedQty:15000 }],
        history:[
          { action:'submitted', ...actor('Rina','Manager'), at:pr2Date, note:'' },
          { action:'approved', ...actor('Sari','Supervisor'), at:shiftISO(pr2Date,1), note:'' },
          { action:'po-approved', ...actor('Rina','Manager'), at:po2Date, note:'PO/2026/11/0002' }
        ],
        rejectReason:''
      };
      this.purchaseRequests.unshift(pr2);
      const po2 = {
        id:'po' + Date.now() + '2',
        code:code('PO', po2Date),
        date:po2Date,
        supplierId:'sup2',
        prId:pr2.id,
        prCode:pr2.code,
        paymentTerms:'14 hari',
        notes:'Pengadaan botol dan label',
        status:'partially_received',
        items:[
          { materialId:'mat1', qty:20000, price:900, receivedQty:12000, returnedQty:0 },
          { materialId:'mat3', qty:15000, price:100, receivedQty:5000, returnedQty:0 }
        ],
        subtotal:19500000,
        total:19500000,
        createdBy:'Rina',
        createdById:'u5',
        history:[
          { action:'submitted', ...actor('Rina','Manager'), at:po2Date, note:'' },
          { action:'approved', ...actor('Sari','Supervisor'), at:shiftISO(po2Date,1), note:'' },
          { action:'received', ...actor('Rina','Manager'), at:gr2Date, note:'GR/2026/11/0002' }
        ],
        rejectReason:''
      };
      this.purchaseOrders.unshift(po2);
      const gr2 = {
        id:'gr' + Date.now() + '2',
        code:code('GR', gr2Date),
        date:gr2Date,
        poId:po2.id,
        poCode:po2.code,
        supplierId:po2.supplierId,
        warehouseId:'wh1',
        deliveryNote:'SJ-AB-2048',
        status:'posted',
        items:[{ materialId:'mat1', qty:12000, price:900 }, { materialId:'mat3', qty:5000, price:100 }],
        total:11300000,
        journalId:'',
        payableId:'',
        createdBy:'Rina',
        createdById:'u5',
        postedAt:gr2Date,
        history:[{ action:'draft', ...actor('Rina','Manager'), at:gr2Date, note:'' }, { action:'posted', ...actor('Rina','Manager'), at:gr2Date, note:'' }]
      };
      this.receipts.unshift(gr2);
      addMaterialStock('mat1', 'wh1', 12000, 10800000, 'receipt', 'receipt', gr2.id, gr2.code, gr2Date, 900);
      addMaterialStock('mat3', 'wh1', 5000, 500000, 'receipt', 'receipt', gr2.id, gr2.code, gr2Date, 100);
      gr2.journalId = post(gr2Date, 'Penerimaan barang ' + gr2.code, 'receipt', gr2.id, [
        { accountId:accId('1-1400'), debit:11300000, credit:0, memo:'Persediaan ' + gr2.code },
        { accountId:accId('2-1100'), debit:0, credit:11300000, memo:'Utang supplier ' + gr2.code }
      ]);
      const ap2 = {
        id:'ap' + Date.now() + '2',
        code:code('AP', gr2Date),
        supplierId:'sup2',
        receiptId:gr2.id,
        receiptCode:gr2.code,
        poId:po2.id,
        poCode:po2.code,
        date:gr2Date,
        dueDate:shiftISO(gr2Date, 14),
        total:11300000,
        paid:0,
        unpaid:11300000,
        status:'unpaid',
        payments:[],
        history:[{ action:'created', ...actor('Rina','Manager'), at:gr2Date, note:gr2.code }]
      };
      this.payables.unshift(ap2);
      gr2.payableId = ap2.id;
      const gr3 = {
        id:'gr' + Date.now() + '3',
        code:code('GR', d(-2)),
        date:d(-2),
        poId:po2.id,
        poCode:po2.code,
        supplierId:po2.supplierId,
        warehouseId:'wh1',
        deliveryNote:'SJ-AB-2051',
        status:'draft',
        items:[{ materialId:'mat3', qty:5000, price:100 }],
        total:500000,
        journalId:'',
        payableId:'',
        createdBy:'Sari',
        createdById:'u4',
        postedAt:'',
        history:[{ action:'draft', ...actor('Sari','Supervisor'), at:d(-2), note:'' }]
      };
      this.receipts.unshift(gr3);

      const pr3Date = d(-5);
      const pr3 = {
        id:'pr' + Date.now() + '3',
        code:code('PR', pr3Date),
        date:pr3Date,
        requesterId:'u2',
        requester:'Fahri',
        purpose:'Kebutuhan bahan kemasan bulan depan',
        status:'submitted',
        items:[{ materialId:'mat2', qty:25000, note:'Cup', orderedQty:0 }, { materialId:'mat4', qty:500, note:'Karton', orderedQty:0 }],
        history:[{ action:'submitted', ...actor('Fahri','Sales'), at:pr3Date, note:'' }],
        rejectReason:''
      };
      this.purchaseRequests.unshift(pr3);
      const pr4Date = d(-2);
      const pr4 = {
        id:'pr' + Date.now() + '4',
        code:code('PR', pr4Date),
        date:pr4Date,
        requesterId:'u1',
        requester:'Admin',
        purpose:'Rencana restock lid awal bulan',
        status:'draft',
        items:[{ materialId:'mat5', qty:10000, note:'Lid', orderedQty:0 }],
        history:[{ action:'draft', ...actor('Admin','Admin'), at:pr4Date, note:'' }],
        rejectReason:''
      };
      this.purchaseRequests.unshift(pr4);
      const po3Date = d(-1);
      const po3 = {
        id:'po' + Date.now() + '3',
        code:code('PO', po3Date),
        date:po3Date,
        supplierId:'sup3',
        prId:'',
        prCode:'',
        paymentTerms:'Cash',
        notes:'Pembelian tambahan label dan lakban',
        status:'pending_approval',
        items:[{ materialId:'mat2', qty:5000, price:132, receivedQty:0, returnedQty:0 }, { materialId:'mat7', qty:1000, price:31, receivedQty:0, returnedQty:0 }],
        subtotal:691000,
        total:691000,
        createdBy:'Admin',
        createdById:'u1',
        history:[{ action:'submitted', ...actor('Admin','Admin'), at:po3Date, note:'' }],
        rejectReason:''
      };
      this.purchaseOrders.unshift(po3);
      const po4Date = now;
      const po4 = {
        id:'po' + Date.now() + '4',
        code:code('PO', po4Date),
        date:po4Date,
        supplierId:'sup1',
        prId:'',
        prCode:'',
        paymentTerms:'30 hari',
        notes:'Draft pembelian karton box',
        status:'draft',
        items:[{ materialId:'mat4', qty:100, price:3309, receivedQty:0, returnedQty:0 }],
        subtotal:330900,
        total:330900,
        createdBy:'Admin',
        createdById:'u1',
        history:[{ action:'draft', ...actor('Admin','Admin'), at:po4Date, note:'' }],
        rejectReason:''
      };
      this.purchaseOrders.unshift(po4);

      const return1Date = d(-4);
      const return1 = {
        id:'prt' + Date.now() + '1',
        code:code('PRT', return1Date),
        date:return1Date,
        poId:po1.id,
        poCode:po1.code,
        supplierId:'sup1',
        warehouseId:'wh1',
        notes:'Cup penyok saat penerimaan',
        items:[{ materialId:'mat2', qty:100, price:132, condition:'damaged', action:'credit', note:'Cup penyok' }],
        total:13200,
        replaceTotal:0,
        creditTotal:13200,
        status:'posted',
        replacementStatus:'none',
        journalId:'',
        apAdjustments:[],
        createdBy:'Rina',
        createdById:'u5',
        postedAt:return1Date,
        history:[{ action:'posted', ...actor('Rina','Manager'), at:return1Date, note:'' }]
      };
      const po1Mat2 = po1.items.find(item => item.materialId === 'mat2');
      if (po1Mat2) po1Mat2.returnedQty = 100;
      addMaterialStock('mat2', 'wh1', -100, -13200, 'purchase-return', 'purchase-return', return1.id, return1.code, return1Date, 132);
      ap1.total = Math.max(0, ap1.total - 13200);
      ap1.unpaid = Math.max(0, ap1.unpaid - 13200);
      ap1.status = ap1.unpaid <= 0 ? 'paid' : 'partial';
      ap1.history.push({ action:'purchase-return-credit', ...actor('Rina','Manager'), at:return1Date, note:return1.code });
      return1.apAdjustments.push({ payableId:ap1.id, payableCode:ap1.code, amount:13200 });
      return1.journalId = post(return1Date, 'Return pembelian ' + return1.code, 'purchase-return', return1.id, [
        { accountId:accId('2-1100'), debit:13200, credit:0, memo:'Potongan utang supplier' },
        { accountId:accId('1-1400'), debit:0, credit:13200, memo:'Persediaan keluar' }
      ]);
      this.purchaseReturns.unshift(return1);
      const return2Date = d(-3);
      const return2 = {
        id:'prt' + Date.now() + '2',
        code:code('PRT', return2Date),
        date:return2Date,
        poId:po1.id,
        poCode:po1.code,
        supplierId:'sup1',
        warehouseId:'wh1',
        notes:'LID pecah, menunggu penggantian',
        items:[{ materialId:'mat5', qty:50, price:39, condition:'damaged', action:'replace', note:'LID pecah' }],
        total:1950,
        replaceTotal:1950,
        creditTotal:0,
        status:'posted',
        replacementStatus:'pending',
        journalId:'',
        apAdjustments:[],
        createdBy:'Rina',
        createdById:'u5',
        postedAt:return2Date,
        history:[{ action:'posted', ...actor('Rina','Manager'), at:return2Date, note:'' }]
      };
      const po1Mat5 = po1.items.find(item => item.materialId === 'mat5');
      if (po1Mat5) po1Mat5.returnedQty = 50;
      addMaterialStock('mat5', 'wh1', -50, -1950, 'purchase-return', 'purchase-return', return2.id, return2.code, return2Date, 39);
      return2.journalId = post(return2Date, 'Return pembelian ' + return2.code, 'purchase-return', return2.id, [
        { accountId:accId('1-1500'), debit:1950, credit:0, memo:'Klaim ganti barang' },
        { accountId:accId('1-1400'), debit:0, credit:1950, memo:'Persediaan keluar' }
      ]);
      this.purchaseReturns.unshift(return2);

      const makeProduction = (date, qty, overrides = {}, description = '') => {
        const product = this.product('p1');
        const rows = this.recipes.filter(recipe => recipe.productId === product.id).map(recipe => {
          const material = this.material(recipe.materialId);
          const standardQty = (Number(recipe.qtyPerUnit) || 0) * qty;
          const used = overrides[recipe.materialId] !== undefined ? overrides[recipe.materialId] : standardQty;
          return {
            materialId:recipe.materialId,
            standardQty,
            qty:used,
            price:Number(material.avgCost) || Number(material.purchasePrice) || 0,
            note:used !== standardQty ? 'Penyesuaian lapangan' : '',
            fromRecipe:true
          };
        });
        const totalCost = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
        const prod = {
          id:'prd' + Date.now() + Math.random().toString(16).slice(2),
          code:productionCode(date),
          date,
          productId:product.id,
          warehouseId:'wh1',
          qty,
          description,
          status:'posted',
          materials:rows,
          totalCost,
          costPerUnit:qty > 0 ? totalCost / qty : 0,
          createdBy:'Rina',
          createdById:'u5',
          createdByRole:'Manager',
          createdAt:date,
          updatedAt:date
        };
        product.stock = (Number(product.stock) || 0) + qty;
        rows.forEach(row => addMaterialStock(row.materialId, 'wh1', -row.qty, -(row.qty * row.price), 'production-usage', 'production', prod.id, prod.code, date, row.price));
        this.stockHistory.unshift({ id:'sh' + Date.now() + 'r' + productionSeq, code:prod.code, date, warehouseId:'wh1', description:'Produksi (hasil) ' + prod.code, by:'Rina', byRole:'Manager', type:'production-result', refType:'production', refId:prod.id, refNumber:prod.code, items:[{ productId:product.id, qty }] });
        this.stockHistory.unshift({ id:'sh' + Date.now() + 'u' + productionSeq, code:prod.code, date, warehouseId:'wh1', description:'Produksi (pemakaian) ' + prod.code, by:'Rina', byRole:'Manager', type:'production-usage', refType:'production', refId:prod.id, refNumber:prod.code, items:rows.map(row => ({ materialId:row.materialId, qty:-row.qty })) });
        this.productions.unshift(prod);
        this.productionLogs.unshift({ id:'plog' + Date.now() + Math.random().toString(16).slice(2), productionId:prod.id, at:date, user:'Rina', role:'Manager', action:'buat', detail:'Produksi ' + prod.code + ' dibuat: ' + this.fmt(qty) + ' ' + product.unit + '.', reason:'' });
        return prod;
      };
      const prod1 = makeProduction(d(-7), 500, {}, 'Batch produksi awal bulan');
      const prod2 = makeProduction(d(-2), 200, { mat2:9500 }, 'Batch produksi shift 2');

      const demoQty = this.hppDemoScenario().outputQty;
      const demoMaterials = this.recipes.filter(recipe => recipe.productId === 'p1').map(recipe => {
        const material = this.material(recipe.materialId);
        const qty = (Number(recipe.qtyPerUnit) || 0) * demoQty;
        return {
          materialId:recipe.materialId,
          standardQty:qty,
          qty,
          price:Number(material.avgCost) || Number(material.purchasePrice) || 0,
          note:'Skenario demo',
          fromRecipe:true
        };
      });
      const demoProduction = {
        id:'prddemo' + Date.now(),
        code:productionCode('2026-10-30'),
        date:'2026-10-30',
        productId:'p1',
        warehouseId:'wh1',
        qty:demoQty,
        description:'Skenario demo HPP 30 Oktober (tanpa pergerakan stok)',
        status:'posted',
        materials:demoMaterials,
        totalCost:demoMaterials.reduce((sum, row) => sum + row.qty * row.price, 0),
        costPerUnit:0,
        createdBy:'Rina',
        createdById:'u5',
        createdByRole:'Manager',
        createdAt:'2026-10-30',
        updatedAt:'2026-10-30'
      };
      demoProduction.costPerUnit = demoProduction.totalCost / demoQty;
      this.productions.unshift(demoProduction);
      this.productionLogs.unshift({ id:'plog' + Date.now() + 'demo', productionId:demoProduction.id, at:'2026-10-30', user:'Rina', role:'Manager', action:'demo', detail:'Skenario demo HPP 30 Oktober: ' + this.fmt(demoQty) + ' Krt tanpa pergerakan stok.', reason:'' });

      const order1Date = d(-6);
      const order1 = makeOrder('c1', [['p1', 10], ['p2', 5]], 'pending', 'unpaid', order1Date, { orderBy:'Fahri' });
      const order2 = makeOrder('c2', [['p2', 20]], 'already', 'unpaid', d(-5), { orderBy:'Zainudin' });
      const order3 = makeOrder('c3', [['p1', 30], ['p3', 10]], 'shipping', 'partial', d(-4), { orderBy:'Fahri', radius:'offsite' });
      const order4 = makeOrder('c4', [['p3', 15]], 'success', 'paid', d(-3), { orderBy:'Zainudin' });
      const order5 = makeOrder('c5', [['p1', 25]], 'success', 'partial', d(-2), { orderBy:'Fahri' });
      const order6 = makeOrder('c6', [['p2', 8]], 'partial', 'partial', d(-1), { orderBy:'Zainudin' });
      const order7 = makeOrder('c7', [['p1', 12]], 'cancel', 'unpaid', d(-1), { orderBy:'Fahri' });
      this.orders.filter(order => !['cancel','failed'].includes(order.status)).forEach(order => {
        const tax = Number(order.tax) || 0;
        const net = Math.max(0, (Number(order.total) || 0) - tax);
        post(order.date, 'Penjualan ' + order.code, 'order', order.id, [
          { accountId:accId('1-1300'), debit:Number(order.total) || 0, credit:0, memo:'Piutang penjualan' },
          { accountId:accId('4-1000'), debit:0, credit:net, memo:'Pendapatan penjualan' },
          { accountId:accId('2-1200'), debit:0, credit:tax, memo:'PPN keluaran' }
        ]);
        const cogs = (order.items || []).reduce((sum, item) => sum + (Number(this.product(item.productId).cost) || 0) * (Number(item.qty) || 0), 0);
        if (cogs > 0) {
          post(order.date, 'HPP ' + order.code, 'order-cogs', order.id, [
            { accountId:accId('5-1000'), debit:cogs, credit:0, memo:'HPP penjualan' },
            { accountId:accId('1-1400'), debit:0, credit:cogs, memo:'Persediaan keluar' }
          ]);
        }
      });
      makeDelivery([order3], 'shipping', d(-3), 'Rina');
      makeDelivery([order4, order5], 'success', d(-1), 'Sari');
      makeDelivery([order2], 'pending', now, 'Rina');
      const rec1 = makeReceivable(order5, 300000, 100000, shiftISO(order5.date, 14));
      const rec2 = makeReceivable(order4, order4.total, 0, shiftISO(order4.date, 14));
      const rec3 = makeReceivable(order6, 0, 0, shiftISO(order6.date, 14));
      const col1 = makeCollection('Fahri', d(-1), 'pending', [rec1], 400000);
      const col2 = makeCollection('Zainudin', d(-1), 'processing', [rec3], 0);
      const col3 = makeCollection('Zainudin', d(-1), 'success', [rec2], rec2.total);
      this.payments.unshift({ id:'pm' + Date.now() + '1', orderId:order4.id, orderCode:order4.code, customerId:order4.customerId, amount:rec2.total, cash:rec2.total, transfer:0, date:d(-1), proof:'', by:'Sari' });
      this.payments.unshift({ id:'pm' + Date.now() + '2', orderId:order5.id, orderCode:order5.code, customerId:order5.customerId, amount:400000, cash:300000, transfer:100000, date:d(-1), proof:'', by:'Fahri' });
      this.returns.unshift({
        id:'r' + Date.now(),
        code:code('RTN', d(-1)),
        orderId:order5.id,
        productId:'p1',
        name:this.productName('p1'),
        qty:1,
        price:this.product('p1').inSale,
        type:'change',
        condition:'damaged',
        action:'discard',
        status:'pending',
        description:'Kemasan penyok saat diterima pelanggan',
        by:'Sari',
        date:d(-1)
      });
      this.opnames.unshift({ id:'op' + Date.now(), code:code('OP', d(-6)), date:d(-6), productId:'p2', warehouseId:'wh1', qty:-5, description:'Barang rusak di gudang', by:'Sari' });

      addFinance('income', 750000, d(-6), '4-9100', '1-1100', 'Pendapatan jasa pengiriman', 'Admin');
      addFinance('income', 2500000, d(-3), '4-9000', '1-1100', 'Pendapatan proyek distributor', 'Admin');
      addFinance('income', 1250000, d(-4), '4-9200', '1-1200', 'Komisi mitra distributor', 'Admin');
      addFinance('expense', 500000, d(-5), '5-1100', '1-1100', 'Operasional gudang', 'Admin');
      addFinance('expense', 4000000, d(-3), '5-1200', '1-1200', 'Gaji karyawan bulan ini', 'Admin');
      addFinance('expense', 350000, d(-2), '5-1300', '1-1100', 'BBM dan transportasi', 'Admin');

      post(d(-2), 'Penyesuaian beban operasional', 'manual', '', [
        { accountId:accId('5-1100'), debit:150000, credit:0, memo:'Penyesuaian operasional' },
        { accountId:accId('1-1100'), debit:0, credit:150000, memo:'Kas keluar' }
      ]);

      this.selectedOrderId = order3.id;
      this.selectedDeliveryId = this.deliveries[0]?.id || null;
      this.selectedCollectionId = col1.id;
      this.prSelectedId = pr2.id;
      this.poSelectedId = po2.id;
      this.receiptSelectedId = gr2.id;
      this.purchaseReturnSelectedId = return1.id;
      this.productionSelectedId = prod1.id;
      this.stockTab = 'production';
      this.materialStockTab = 'active';
      this.persist();
      if (!this.canvasMode) this.notify('Data dummy berhasil diisi. Silakan jelajahi modul aplikasi.');
      this.go('dashboard');
    },
    resetDemo() {
      this.askConfirm('reset-data', null, 'Reset data demo?', 'Semua perubahan (order, pembayaran, stok, pengguna) akan dikembalikan ke data awal.');
    },
    settingsTab: 'profile',
    settingsForm: { name:'Admin', username:'admin', email:'admin@abimineral.com' },
    passwordForm: { current:'', next:'', confirmation:'' },
    saveProfile(confirmed = false) {
      const user = this.currentUserRecord;
      if (!user) { this.notify('Sesi login tidak ditemukan', 'error'); return; }
      if (!this.settingsForm.name || !this.settingsForm.username) { this.notify('Nama dan username wajib diisi', 'error'); return; }
      const username = String(this.settingsForm.username).trim().toLowerCase();
      if (this.users.some(u => u.id !== user.id && String(u.username).toLowerCase() === username)) {
        this.notify('Username sudah dipakai pengguna lain', 'error');
        return;
      }
      if (!confirmed) {
        this.askSave('save-profile', null, 'Profil ' + this.settingsForm.name + ' akan disimpan.', 'Simpan');
        return;
      }
      user.name = this.settingsForm.name;
      user.username = username;
      user.email = this.settingsForm.email;
      this.syncProfileForm();
      this.persist();
      this.notify('Profil berhasil disimpan');
    },
    savePassword(confirmed = false) {
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
      if (!confirmed) {
        this.askSave('save-password', null, 'Kata sandi akun akan diperbarui.', 'Simpan');
        return;
      }
      user.password = this.passwordForm.next;
      this.passwordForm = { current:'', next:'', confirmation:'' };
      this.persist();
      this.notify('Kata sandi berhasil diperbarui');
    }
  };
}
