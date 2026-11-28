/* Flow canvas — alur penjualan ABI Mineral.
   Data dipisah dari renderer agar modul lain bisa ditambahkan sebagai lane baru. */
window.FLOW_DATA = {
  meta: {
    title: 'Alur Penjualan',
    subtitle: 'Order → invoice → pengiriman → pembayaran → piutang → return',
    version: '2026.11'
  },
  lanes: [
    { id: 'master', title: 'Master & Aturan', hint: 'Sumber data dan aturan main', x: 40, width: 360, tone: 'slate' },
    { id: 'order', title: 'Order', hint: 'Sales membuat dan memvalidasi order', x: 440, width: 420, tone: 'blue' },
    { id: 'invoice', title: 'Approval & Invoice', hint: 'Persetujuan dan dokumen penjualan', x: 900, width: 360, tone: 'indigo' },
    { id: 'delivery', title: 'Pengiriman', hint: 'Surat jalan dan pembayaran', x: 1300, width: 400, tone: 'cyan' },
    { id: 'ar', title: 'Piutang & Penagihan', hint: 'Sisa tagihan sampai lunas', x: 1740, width: 400, tone: 'amber' },
    { id: 'returns', title: 'Return Penjualan', hint: 'Persetujuan dan proses return', x: 2180, width: 400, tone: 'rose' },
    { id: 'accounting', title: 'Akuntansi', hint: 'Jurnal otomatis dan COA', x: 2620, width: 960, tone: 'violet' }
  ],
  nodes: [
    /* ---------- MASTER ---------- */
    {
      id: 'customer', lane: 'master', x: 70, y: 100, w: 300, type: 'entity', icon: 'user',
      title: 'Pelanggan', kicker: 'Master pelanggan', role: 'Admin',
      summary: 'Identitas, jadwal kunjungan, jenis harga, syarat kredit, dan status kena PPN.',
      tags: ['Jenis harga', 'Syarat kredit', 'Kena PPN'],
      formulas: [{ label: 'Sisa kredit', expr: 'max(0, syarat − jumlah order)' }],
      coa: [],
      detail: {
        fields: ['Kode', 'Nama', 'Alamat', 'Channel', 'Sales', 'Pekan / hari', 'Jenis harga', 'Syarat kredit (order)', 'Kena PPN'],
        notes: [
          'Syarat kredit default 3 order dan menurun otomatis.',
          'Jika sisa order 0, metode Kredit aktif.',
          'PPN hanya dikenakan ke pelanggan dengan checkbox Kena PPN.'
        ]
      }
    },
    {
      id: 'product', lane: 'master', x: 70, y: 300, w: 300, type: 'entity', icon: 'box',
      title: 'Produk & Harga', kicker: 'Master produk', role: 'Admin',
      summary: 'Harga jual per jenis harga, stok, HPP, dan resep bahan.',
      tags: ['Harga dalam/luar kota', 'Stok', 'HPP'],
      formulas: [{ label: 'Harga jual', expr: 'harga[jenis harga pelanggan]' }],
      coa: [],
      detail: {
        fields: ['Kode', 'Nama', 'Satuan', 'Kategori', 'Harga per tipe', 'Stok', 'HPP / modal', 'Resep'],
        notes: ['Harga default dipakai jika harga tipe pelanggan kosong.', 'Stok berkurang saat order dibuat.']
      }
    },
    {
      id: 'promo', lane: 'master', x: 70, y: 500, w: 300, type: 'entity', icon: 'percent',
      title: 'Promo', kicker: 'Diskon & bonus', role: 'Admin',
      summary: 'Diskon harga atau bonus barang dengan periode berlaku.',
      tags: ['Diskon', 'Bonus', 'Kelipatan'],
      formulas: [{ label: 'Diskon', expr: 'harga × qty × persen promo' }],
      coa: [],
      detail: {
        fields: ['Kode', 'Nama', 'Produk', 'Minimal qty', 'Periode', 'Tipe bonus', 'Nilai diskon', 'Bonus produk'],
        notes: ['Satu promo terbaik dipakai per produk per tipe harga.', 'Bonus masuk sebagai baris harga 0.']
      }
    },
    {
      id: 'ppn', lane: 'master', x: 70, y: 700, w: 300, type: 'formula', icon: 'percent',
      title: 'PPN 11%', kicker: 'Pengaturan pajak', role: 'Keuangan',
      summary: 'Rate global. Hanya pelanggan bertanda Kena PPN yang dihitung.',
      tags: ['DPP', 'PPN', 'PPN Keluaran'],
      formulas: [
        { label: 'DPP', expr: 'subtotal − diskon − diskon khusus' },
        { label: 'PPN', expr: 'round(DPP × rate ÷ 100)' },
        { label: 'Total', expr: 'DPP + PPN' }
      ],
      coa: [{ side: 'Cr', code: '2-1200', name: 'PPN Keluaran' }],
      detail: {
        fields: ['Aktif PPN', 'Rate (%)', 'Kena PPN per pelanggan'],
        example: 'DPP Rp 1.000.000 × 11% = PPN Rp 110.000; total Rp 1.110.000.',
        notes: ['Rate disimpan saat order dibuat.', 'Invoice lama memakai rate yang tersimpan.']
      }
    },
    {
      id: 'credit', lane: 'master', x: 70, y: 900, w: 300, type: 'formula', icon: 'wallet',
      title: 'Syarat Kredit', kicker: 'Aturan order', role: 'Sistem',
      summary: 'Jumlah order yang harus masuk sebelum pelanggan boleh berutang.',
      tags: ['Default 3', 'Menurun otomatis', '0 = aktif'],
      formulas: [{ label: 'Sisa', expr: 'max(0, syarat − jumlah order)' }],
      coa: [],
      detail: {
        example: 'Syarat 3, sudah 2 order → sisa 1; Kredit belum aktif. Setelah order ke-3 → sisa 0; Kredit aktif.',
        notes: ['Nilai 0 membuat Kredit langsung aktif.', 'Order batal tidak dihitung.']
      }
    },
    {
      id: 'product-cost', lane: 'master', x: 70, y: 1100, w: 300, type: 'formula', icon: 'calculator',
      title: 'HPP Produk', kicker: 'Dasar HPP penjualan', role: 'Sistem',
      summary: 'HPP per Krt berasal dari HPP Harian, termasuk bahan, biaya produksi, dan penyesuaian.',
      tags: ['HPP Harian', 'Moving average', 'Biaya produksi'],
      formulas: [
        { label: 'HPP penjualan', expr: 'qty × HPP / Krt' },
        { label: 'HPP Harian', expr: 'bahan/Krt + biaya produksi/Krt + penyesuaian/Krt' }
      ],
      coa: [{ side: 'Dr', code: '5-1000', name: 'HPP' }],
      simulation: 'moving-average',
      detail: {
        notes: [
          'HPP bahan memakai rata-rata bergerak global perusahaan.',
          'Pemakaian dinilai pada rata-rata saat itu dan tidak mengubah rata-rata.',
          'Rata-rata berubah hanya saat penerimaan barang atau penyesuaian masuk.'
        ]
      }
    },

    /* ---------- ORDER ---------- */
    {
      id: 'pick-customer', lane: 'order', x: 470, y: 100, w: 340, type: 'entity', icon: 'calendar',
      title: 'Pilih Pelanggan', kicker: 'Langkah 1', role: 'Sales',
      summary: 'Pilih pelanggan sesuai jadwal kunjungan atau dari tab Semua.',
      tags: ['Jadwal hari/pekan', 'Sales sendiri'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Tab Jadwal', 'Tab Semua', 'Kamera kunjungan', 'Konfirmasi foto'],
        notes: ['Sales hanya melihat pelanggan miliknya.', 'Jadwal mengikuti hari dan pekan.']
      }
    },
    {
      id: 'create-order', lane: 'order', x: 470, y: 300, w: 340, type: 'entity', icon: 'cart',
      title: 'Buat Order', kicker: 'Langkah 2', role: 'Sales / Admin',
      summary: 'Pilih produk, qty, promo, metode bayar, diskon khusus, dan PPN.',
      tags: ['Promo otomatis', 'Diskon khusus', 'PPN'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Produk', 'Qty', 'Harga', 'Promo', 'Metode bayar', 'Diskon khusus (Admin)', 'PPN'],
        notes: ['Metode Kredit dikunci jika syarat kredit belum terpenuhi.', 'Stok dicek sebelum preview.']
      }
    },
    {
      id: 'order-formula', lane: 'order', x: 470, y: 520, w: 340, type: 'formula', icon: 'calculator',
      title: 'Grand Total Order', kicker: 'Rumus', role: 'Sistem',
      summary: 'Total invoice setelah promo, diskon khusus, dan PPN.',
      tags: ['DPP', 'PPN', 'Total'],
      formulas: [
        { label: 'DPP', expr: 'subtotal − diskon − diskon khusus' },
        { label: 'PPN', expr: 'DPP × rate (jika kena PPN)' },
        { label: 'Total', expr: 'DPP + PPN' }
      ],
      coa: [{ side: 'Cr', code: '4-1000', name: 'Pendapatan Penjualan' }, { side: 'Cr', code: '2-1200', name: 'PPN Keluaran' }],
      simulation: 'order-total',
      detail: {
        example: 'Subtotal Rp 1.000.000 − diskon Rp 50.000 = DPP Rp 950.000. PPN 11% Rp 104.500. Total Rp 1.054.500.'
      }
    },
    {
      id: 'stock-check', lane: 'order', x: 470, y: 760, w: 340, type: 'decision', icon: 'boxes',
      title: 'Cek Stok', kicker: 'Percabangan', role: 'Sistem',
      summary: 'Jika qty melebihi stok, muncul konfirmasi untuk tetap lanjut.',
      tags: ['Stok cukup', 'Stok kurang'],
      formulas: [{ label: 'Sisa stok', expr: 'stok awal − qty order' }],
      coa: [],
      detail: {
        notes: ['Order tetap dapat disubmit meski stok kurang setelah konfirmasi.', 'Stok langsung berkurang saat order tersimpan.']
      }
    },
    {
      id: 'order-saved', lane: 'order', x: 470, y: 960, w: 340, type: 'entity', icon: 'file',
      title: 'Order Tersimpan', kicker: 'Hasil', role: 'Sistem',
      summary: 'Kode INV dibuat, stok berkurang, jatuh tempo dihitung.',
      tags: ['pending', 'pending_approval', 'INV/YYYY/MM/xxxx'],
      formulas: [{ label: 'Jatuh tempo', expr: 'Tunai: hari ini; lainnya: +14 hari' }],
      coa: [],
      detail: {
        fields: ['Kode invoice', 'Tanggal', 'Jadwal', 'Total', 'Status', 'Metode bayar', 'Jatuh tempo'],
        notes: ['Admin atau pelanggan dengan piutang masuk pending_approval.', 'Stok produk langsung dikurangi.']
      }
    },
    {
      id: 'approval', lane: 'order', x: 470, y: 1160, w: 340, type: 'decision', icon: 'check',
      title: 'Approval Manager', kicker: 'Jika diperlukan', role: 'Manager',
      summary: 'Order dari Admin atau pelanggan dengan piutang harus disetujui Manager.',
      tags: ['Setujui', 'Tolak', 'Alasan'],
      formulas: [],
      coa: [],
      detail: {
        notes: ['Manager dapat menyetujui atau menolak dengan alasan.', 'Setelah disetujui status menjadi pending / siap diproses.']
      }
    },

    /* ---------- INVOICE ---------- */
    {
      id: 'invoice', lane: 'invoice', x: 930, y: 300, w: 300, type: 'entity', icon: 'receipt',
      title: 'Invoice', kicker: 'Dokumen penjualan', role: 'Admin / Sales',
      summary: 'Invoice single atau multiple, menampilkan DPP, PPN, dan Grand Total.',
      tags: ['Cetak', 'PPN', 'Multi invoice'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['No. invoice', 'Pelanggan', 'Item', 'DPP', 'PPN', 'Grand Total'],
        notes: ['Sales tidak melihat tombol print, tetapi preview tetap bisa dibuka.', 'Invoice mengikuti nilai yang tersimpan di order.']
      }
    },

    /* ---------- DELIVERY ---------- */
    {
      id: 'delivery', lane: 'delivery', x: 1330, y: 300, w: 340, type: 'entity', icon: 'truck',
      title: 'Surat Jalan', kicker: 'Pengiriman', role: 'Admin',
      summary: 'Pilih order siap kirim, driver, armada, gudang, dan periode.',
      tags: ['Status shipping', 'Driver', 'Armada'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Order', 'Periode', 'Driver', 'Armada', 'Gudang'],
        notes: ['Order berubah menjadi shipping.', 'Order bisa dikeluarkan dari surat jalan sebelum dikonfirmasi.']
      }
    },
    {
      id: 'delivery-confirm', lane: 'delivery', x: 1330, y: 520, w: 340, type: 'entity', icon: 'check',
      title: 'Konfirmasi Surat Jalan', kicker: 'Pembayaran di lapangan', role: 'Admin / Gudang',
      summary: 'Input tunai dan transfer per order saat barang sampai.',
      tags: ['Tunai', 'Transfer', 'Selesai'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Tunai', 'Transfer', 'Akun bank', 'Sisa'],
        notes: ['Nominal maksimal sebesar nilai order.', 'Jurnal penjualan dan HPP dibuat saat konfirmasi.']
      }
    },
    {
      id: 'payment-split', lane: 'delivery', x: 1330, y: 740, w: 340, type: 'decision', icon: 'wallet',
      title: 'Lunas atau Sisa?', kicker: 'Percabangan', role: 'Sistem',
      summary: 'Sisa 0 menjadi Lunas; sisa lebih dari 0 membentuk piutang.',
      tags: ['paid', 'partial', 'Piutang'],
      formulas: [{ label: 'Sisa', expr: 'total − tunai − transfer' }],
      coa: [],
      detail: {
        notes: ['Status order dan surat jalan menjadi success.', 'Piutang aktif muncul bila ada sisa.']
      }
    },
    {
      id: 'cogs-formula', lane: 'delivery', x: 1330, y: 960, w: 340, type: 'formula', icon: 'calculator',
      title: 'HPP Penjualan', kicker: 'Rumus', role: 'Sistem',
      summary: 'HPP dihitung dari qty terjual × HPP produk saat order.',
      tags: ['COGS', 'Persediaan'],
      formulas: [{ label: 'HPP', expr: 'qty × HPP / Krt' }],
      coa: [
        { side: 'Dr', code: '5-1000', name: 'HPP' },
        { side: 'Cr', code: '1-1400', name: 'Persediaan' }
      ],
      simulation: 'cogs',
      detail: {
        example: '10 Krt × HPP Rp 13.853 = Rp 138.530.'
      }
    },

    /* ---------- PIUTANG ---------- */
    {
      id: 'receivable', lane: 'ar', x: 1770, y: 300, w: 340, type: 'entity', icon: 'wallet',
      title: 'Piutang', kicker: 'Tagihan aktif', role: 'Keuangan',
      summary: 'Sisa tagihan per invoice, jatuh tempo, dan riwayat pembayaran.',
      tags: ['Aktif', 'Lunas', 'Jatuh tempo'],
      formulas: [{ label: 'Sisa piutang', expr: 'total − pembayaran' }],
      coa: [{ side: 'Dr', code: '1-1300', name: 'Piutang Usaha' }],
      detail: {
        fields: ['No. piutang', 'Invoice', 'Pelanggan', 'Total', 'Dibayar', 'Sisa', 'Jatuh tempo', 'Status'],
        notes: ['Piutang aktif adalah yang sisa > 0.', 'Pelanggan dengan piutang memicu approval order berikutnya.']
      }
    },
    {
      id: 'collection', lane: 'ar', x: 1770, y: 520, w: 340, type: 'entity', icon: 'truck',
      title: 'Penagihan', kicker: 'Surat jalan penagihan', role: 'Keuangan',
      summary: 'Pilih piutang per sales, lalu input tunai/transfer.',
      tags: ['Buat penagihan', 'Konfirmasi', 'Sebagian'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Sales', 'Tanggal', 'Piutang', 'Tunai', 'Transfer', 'Sisa'],
        notes: ['Status processing bila belum lunas.', 'Status success bila seluruh piutang lunas.']
      }
    },
    {
      id: 'paid', lane: 'ar', x: 1770, y: 740, w: 340, type: 'entity', icon: 'check',
      title: 'Lunas', kicker: 'Hasil', role: 'Keuangan',
      summary: 'Piutang pindah ke tab Lunas dan tidak lagi muncul di tagihan aktif.',
      tags: ['Sisa 0', 'Riwayat'],
      formulas: [],
      coa: [],
      detail: {
        notes: ['Bukti pembayaran dapat diunggah.', 'Riwayat pembayaran menyimpan nomor dan akun kas/bank.']
      }
    },
    {
      id: 'payment-formula', lane: 'ar', x: 1770, y: 960, w: 340, type: 'formula', icon: 'calculator',
      title: 'Rumus Pembayaran', kicker: 'Rumus', role: 'Sistem',
      summary: 'Sisa tagihan dihitung setelah tunai dan transfer.',
      tags: ['Tunai', 'Transfer', 'Sisa'],
      formulas: [{ label: 'Sisa', expr: 'total − tunai − transfer' }],
      coa: [{ side: 'Cr', code: '1-1300', name: 'Piutang Usaha' }],
      simulation: 'payment',
      detail: {
        example: 'Total Rp 1.054.500 − tunai Rp 500.000 − transfer Rp 300.000 = sisa Rp 254.500.'
      }
    },

    /* ---------- RETURN ---------- */
    {
      id: 'return-create', lane: 'returns', x: 2210, y: 300, w: 340, type: 'entity', icon: 'refresh',
      title: 'Return Penjualan', kicker: 'Dari delivery', role: 'Admin',
      summary: 'Pilih barang, qty, jenis return, kondisi, dan keterangan.',
      tags: ['Ganti Barang', 'Potong Harga', 'Qty terkirim'],
      formulas: [],
      coa: [],
      detail: {
        fields: ['Barang', 'Qty', 'Jenis return', 'Kondisi', 'Keterangan'],
        notes: ['Qty dibatasi qty terkirim.', 'Nilai return memakai harga setelah diskon + PPN.']
      }
    },
    {
      id: 'return-approval', lane: 'returns', x: 2210, y: 520, w: 340, type: 'decision', icon: 'check',
      title: 'Approval Return', kicker: 'Wajib Manager', role: 'Manager',
      summary: 'Return harus disetujui Manager sebelum diproses.',
      tags: ['pending_approval', 'Setujui', 'Tolak'],
      formulas: [],
      coa: [],
      detail: {
        notes: ['Return buatan Manager otomatis disetujui.', 'Penolakan wajib menyertakan alasan.']
      }
    },
    {
      id: 'return-process', lane: 'returns', x: 2210, y: 740, w: 340, type: 'decision', icon: 'refresh',
      title: 'Proses Return', kicker: 'Efek stok & piutang', role: 'Admin',
      summary: 'Ganti Barang tidak menambah stok; Potong Harga menambah stok dan mengurangi piutang.',
      tags: ['return', 'discard', 'Piutang'],
      formulas: [],
      coa: [],
      detail: {
        notes: ['Hanya return berstatus pending yang bisa diproses.', 'Return yang sudah diproses tidak dapat diproses ulang.']
      }
    },
    {
      id: 'return-formula', lane: 'returns', x: 2210, y: 960, w: 340, type: 'formula', icon: 'calculator',
      title: 'Rumus Return', kicker: 'Rumus', role: 'Sistem',
      summary: 'Nilai return dihitung dari harga setelah diskon dan PPN.',
      tags: ['Nilai return', 'PPN', 'Piutang'],
      formulas: [
        { label: 'Nilai return', expr: 'harga setelah diskon × qty × (1 + PPN)' },
        { label: 'Piutang baru', expr: 'piutang − nilai return' }
      ],
      coa: [
        { side: 'Dr', code: '4-1000', name: 'Pendapatan Penjualan' },
        { side: 'Dr', code: '2-1200', name: 'PPN Keluaran' },
        { side: 'Cr', code: '1-1300', name: 'Piutang Usaha' }
      ],
      simulation: 'return',
      detail: {
        example: 'Harga setelah diskon Rp 500.000 + PPN 11% = Rp 555.000; piutang berkurang Rp 555.000.'
      }
    },

    /* ---------- ACCOUNTING ---------- */
    {
      id: 'journal-sale', lane: 'accounting', x: 2650, y: 100, w: 300, type: 'journal', icon: 'file',
      title: 'Jurnal Penjualan', kicker: 'Otomatis saat konfirmasi', role: 'Sistem',
      summary: 'Kas/bank/piutang didebit sebesar total; pendapatan dan PPN dikredit.',
      tags: ['Penjualan', 'PPN'],
      formulas: [],
      coa: [],
      detail: {
        lines: [
          { side: 'Dr', code: '1-1100', name: 'Kas', note: 'pembayaran tunai' },
          { side: 'Dr', code: '1-1200', name: 'Bank', note: 'pembayaran transfer' },
          { side: 'Dr', code: '1-1300', name: 'Piutang Usaha', note: 'sisa tagihan' },
          { side: 'Cr', code: '4-1000', name: 'Pendapatan Penjualan', note: 'DPP' },
          { side: 'Cr', code: '2-1200', name: 'PPN Keluaran', note: 'PPN' }
        ]
      }
    },
    {
      id: 'journal-cogs', lane: 'accounting', x: 2650, y: 340, w: 300, type: 'journal', icon: 'file',
      title: 'Jurnal HPP', kicker: 'Otomatis saat konfirmasi', role: 'Sistem',
      summary: 'Mencatat HPP penjualan dan pengurangan persediaan.',
      tags: ['HPP', 'Persediaan'],
      formulas: [],
      coa: [],
      detail: {
        lines: [
          { side: 'Dr', code: '5-1000', name: 'HPP' },
          { side: 'Cr', code: '1-1400', name: 'Persediaan' }
        ]
      }
    },
    {
      id: 'journal-collection', lane: 'accounting', x: 2650, y: 580, w: 300, type: 'journal', icon: 'file',
      title: 'Jurnal Penagihan', kicker: 'Saat pembayaran piutang', role: 'Sistem',
      summary: 'Kas/bank bertambah dan piutang berkurang.',
      tags: ['Penagihan', 'Piutang'],
      formulas: [],
      coa: [],
      detail: {
        lines: [
          { side: 'Dr', code: '1-1100', name: 'Kas' },
          { side: 'Dr', code: '1-1200', name: 'Bank' },
          { side: 'Cr', code: '1-1300', name: 'Piutang Usaha' }
        ]
      }
    },
    {
      id: 'journal-return', lane: 'accounting', x: 2650, y: 820, w: 300, type: 'journal', icon: 'file',
      title: 'Jurnal Return', kicker: 'Saat return diproses', role: 'Sistem',
      summary: 'Pendapatan dan PPN didebit; piutang dikredit.',
      tags: ['Return', 'PPN'],
      formulas: [],
      coa: [],
      detail: {
        lines: [
          { side: 'Dr', code: '4-1000', name: 'Pendapatan Penjualan' },
          { side: 'Dr', code: '2-1200', name: 'PPN Keluaran' },
          { side: 'Cr', code: '1-1300', name: 'Piutang Usaha' }
        ]
      }
    },
    { id: 'acc-kas', lane: 'accounting', x: 3040, y: 100, w: 300, type: 'account', icon: 'coins', title: 'Kas', code: '1-1100', side: 'Debit', summary: 'Kas tunai.', tags: [], formulas: [], coa: [] },
    { id: 'acc-bank', lane: 'accounting', x: 3040, y: 220, w: 300, type: 'account', icon: 'banknote', title: 'Bank', code: '1-1200', side: 'Debit', summary: 'Rekening bank.', tags: [], formulas: [], coa: [] },
    { id: 'acc-ar', lane: 'accounting', x: 3040, y: 340, w: 300, type: 'account', icon: 'wallet', title: 'Piutang Usaha', code: '1-1300', side: 'Debit', summary: 'Hak tagih pelanggan.', tags: [], formulas: [], coa: [] },
    { id: 'acc-ppn', lane: 'accounting', x: 3040, y: 460, w: 300, type: 'account', icon: 'percent', title: 'PPN Keluaran', code: '2-1200', side: 'Kredit', summary: 'Kewajiban PPN penjualan.', tags: [], formulas: [], coa: [] },
    { id: 'acc-revenue', lane: 'accounting', x: 3040, y: 580, w: 300, type: 'account', icon: 'trending-up', title: 'Pendapatan Penjualan', code: '4-1000', side: 'Kredit', summary: 'Pendapatan neto (DPP).', tags: [], formulas: [], coa: [] },
    { id: 'acc-hpp', lane: 'accounting', x: 3040, y: 700, w: 300, type: 'account', icon: 'calculator', title: 'HPP', code: '5-1000', side: 'Debit', summary: 'Harga pokok penjualan.', tags: [], formulas: [], coa: [] },
    { id: 'acc-inventory', lane: 'accounting', x: 3040, y: 820, w: 300, type: 'account', icon: 'boxes', title: 'Persediaan', code: '1-1400', side: 'Debit', summary: 'Nilai stok produk.', tags: [], formulas: [], coa: [] }
  ],
  edges: [
    { from: 'customer', to: 'pick-customer', type: 'reference', label: 'jadwal & harga' },
    { from: 'product', to: 'create-order', type: 'reference', label: 'harga & stok' },
    { from: 'promo', to: 'create-order', type: 'reference', label: 'promo aktif' },
    { from: 'ppn', to: 'create-order', type: 'reference', label: 'PPN pelanggan' },
    { from: 'credit', to: 'create-order', type: 'reference', label: 'syarat kredit' },
    { from: 'pick-customer', to: 'create-order', type: 'flow', label: 'mulai order' },
    { from: 'create-order', to: 'order-formula', type: 'formula', label: 'hitung total' },
    { from: 'create-order', to: 'stock-check', type: 'flow', label: 'preview' },
    { from: 'stock-check', to: 'order-saved', type: 'flow', label: 'cukup / lanjut' },
    { from: 'order-saved', to: 'approval', type: 'flow', label: 'jika perlu' },
    { from: 'order-saved', to: 'invoice', type: 'flow', label: 'normal' },
    { from: 'approval', to: 'invoice', type: 'flow', label: 'disetujui' },
    { from: 'invoice', to: 'delivery', type: 'flow', label: 'siap kirim' },
    { from: 'delivery', to: 'delivery-confirm', type: 'flow', label: 'barang sampai' },
    { from: 'delivery-confirm', to: 'payment-split', type: 'flow', label: 'hitung bayar' },
    { from: 'payment-split', to: 'receivable', type: 'flow', label: 'sisa > 0' },
    { from: 'payment-split', to: 'paid', type: 'flow', label: 'sisa 0' },
    { from: 'delivery-confirm', to: 'cogs-formula', type: 'formula', label: 'HPP' },
    { from: 'receivable', to: 'collection', type: 'flow', label: 'tagih' },
    { from: 'collection', to: 'paid', type: 'flow', label: 'lunas' },
    { from: 'collection', to: 'payment-formula', type: 'formula', label: 'hitung sisa' },
    { from: 'invoice', to: 'return-create', type: 'flow', label: 'retur' },
    { from: 'return-create', to: 'return-approval', type: 'flow', label: 'ajukan' },
    { from: 'return-approval', to: 'return-process', type: 'flow', label: 'disetujui' },
    { from: 'return-process', to: 'return-formula', type: 'formula', label: 'hitung nilai' },
    { from: 'return-formula', to: 'receivable', type: 'flow', label: 'potong harga' },
    { from: 'product-cost', to: 'cogs-formula', type: 'formula', label: 'dasar HPP' },
    { from: 'delivery-confirm', to: 'journal-sale', type: 'journal', label: 'jurnal otomatis' },
    { from: 'delivery-confirm', to: 'journal-cogs', type: 'journal', label: 'jurnal HPP' },
    { from: 'journal-sale', to: 'acc-kas', type: 'journal', label: 'Dr' },
    { from: 'journal-sale', to: 'acc-bank', type: 'journal', label: 'Dr' },
    { from: 'journal-sale', to: 'acc-ar', type: 'journal', label: 'Dr' },
    { from: 'journal-sale', to: 'acc-revenue', type: 'journal', label: 'Cr' },
    { from: 'journal-sale', to: 'acc-ppn', type: 'journal', label: 'Cr' },
    { from: 'journal-cogs', to: 'acc-hpp', type: 'journal', label: 'Dr' },
    { from: 'journal-cogs', to: 'acc-inventory', type: 'journal', label: 'Cr' },
    { from: 'collection', to: 'journal-collection', type: 'journal', label: 'jurnal otomatis' },
    { from: 'journal-collection', to: 'acc-kas', type: 'journal', label: 'Dr' },
    { from: 'journal-collection', to: 'acc-bank', type: 'journal', label: 'Dr' },
    { from: 'journal-collection', to: 'acc-ar', type: 'journal', label: 'Cr' },
    { from: 'return-process', to: 'journal-return', type: 'journal', label: 'jurnal return' },
    { from: 'journal-return', to: 'acc-revenue', type: 'journal', label: 'Dr' },
    { from: 'journal-return', to: 'acc-ppn', type: 'journal', label: 'Dr' },
    { from: 'journal-return', to: 'acc-ar', type: 'journal', label: 'Cr' }
  ],
  simulations: {
    'order-total': {
      title: 'Simulasi Grand Total Order',
      subtitle: 'Promo, diskon khusus, dan PPN',
      steps: [
        { label: 'Subtotal', value: 'Rp 1.000.000' },
        { label: 'Diskon promo', value: '− Rp 50.000' },
        { label: 'Diskon khusus', value: '− Rp 0' },
        { label: 'DPP', value: 'Rp 950.000', strong: true },
        { label: 'PPN 11%', value: 'Rp 104.500' },
        { label: 'Grand Total', value: 'Rp 1.054.500', strong: true }
      ],
      formula: 'Total = (subtotal − diskon − diskon khusus) + PPN'
    },
    'payment': {
      title: 'Simulasi Pembayaran',
      subtitle: 'Tunai + transfer terhadap total invoice',
      steps: [
        { label: 'Total invoice', value: 'Rp 1.054.500' },
        { label: 'Tunai', value: '− Rp 500.000' },
        { label: 'Transfer', value: '− Rp 300.000' },
        { label: 'Sisa piutang', value: 'Rp 254.500', strong: true }
      ],
      formula: 'Sisa = total − tunai − transfer'
    },
    'return': {
      title: 'Simulasi Return Potong Harga',
      subtitle: 'Nilai return termasuk PPN',
      steps: [
        { label: 'Harga setelah diskon', value: 'Rp 500.000' },
        { label: 'PPN 11%', value: 'Rp 55.000' },
        { label: 'Nilai return', value: 'Rp 555.000', strong: true },
        { label: 'Piutang sebelum', value: 'Rp 1.054.500' },
        { label: 'Piutang setelah', value: 'Rp 499.500', strong: true }
      ],
      formula: 'Nilai return = harga setelah diskon × (1 + PPN)'
    },
    'cogs': {
      title: 'Simulasi HPP Penjualan',
      subtitle: 'Qty terjual × HPP per Krt',
      steps: [
        { label: 'Qty terjual', value: '10 Krt' },
        { label: 'HPP / Krt', value: 'Rp 13.853' },
        { label: 'HPP penjualan', value: 'Rp 138.530', strong: true }
      ],
      formula: 'HPP = qty × HPP / Krt'
    },
    'moving-average': {
      title: 'Simulasi Moving Average Bahan',
      subtitle: 'Contoh November → Desember',
      months: [
        {
          title: 'November',
          steps: [
            { label: '1. Beli 10 pcs × 10.000', value: 'Nilai masuk = 100.000' },
            { label: '2. Stok setelah beli', value: '10 pcs · nilai 100.000', note: 'Rata-rata = 100.000 ÷ 10 = 10.000', strong: true },
            { label: '3. Pakai 6 pcs × 10.000', value: '= 60.000 → HPP Nov', note: 'Rata-rata (10.000) tidak berubah', strong: true },
            { label: '4. Sisa stok akhir Nov', value: '4 pcs · nilai 40.000', note: 'Menjadi stok awal Desember' }
          ]
        },
        {
          title: 'Desember',
          steps: [
            { label: '5. Beli 70 pcs × 12.000', value: 'Nilai masuk = 840.000' },
            { label: '6. Stok gabungan', value: '4 + 70 = 74 pcs', note: '40.000 + 840.000 = 880.000; rata-rata = 880.000 ÷ 74 = 11.891,89', strong: true },
            { label: '7. Pakai 50 pcs × 11.891,89', value: '= 594.595 → HPP Des', note: 'Pembelian baru mengubah rata-rata', strong: true },
            { label: '8. Sisa stok akhir Des', value: '24 pcs · nilai 285.405', note: '1 pcs = 11.891' }
          ]
        }
      ],
      formula: 'Rata-rata baru = (nilai stok lama + nilai pembelian baru) ÷ (qty lama + qty beli)',
      footer: 'Pemakaian dinilai = qty pakai × rata-rata saat itu (tidak mengubah rata-rata). Cek: 594.595 + 285.405 = 880.000.'
    }
  }
};
