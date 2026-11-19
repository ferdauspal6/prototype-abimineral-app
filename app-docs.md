# ABI Mineral App — Dokumentasi Aplikasi untuk Prototype UI

> Dokumen ini menjelaskan aplikasi **ABI Mineral System** secara detail dari sisi produk dan antarmuka.
> Tujuannya adalah menjadi acuan tunggal untuk membuat **prototype UI** (high-fidelity mockup atau prototype interaktif) tanpa harus mereplikasi seluruh logika backend.
>
> - Repo: `https://github.com/donisaputradev/abiapp.git`
> - Branch acuan: `master`
> - Nama produk di UI: **ABI MINERAL — Sistem Distributor**
> - Perusahaan pada invoice: **CV TOU MASAGENA MINERAL**, Jl. Dharma Praja, Kersik Putih

---

## 1. Ringkasan Aplikasi

ABI Mineral App adalah sistem distribusi penjualan barang mineral/retail yang menangani siklus lengkap:

1. Master data pelanggan, produk, gudang, promo, channel, unit.
2. Sales membuat order berdasarkan jadwal kunjungan pelanggan (hari + pekan).
3. Order menghasilkan invoice dan dapat dikonfirmasi.
4. Order tidak dikunci oleh stok. Jika qty melebihi stok, muncul konfirmasi **“Stock barang di system tidak mencukup, tetap lanjutkan order ?”** dan order tetap dapat disubmit.
5. Order dikelompokkan menjadi surat jalan (delivery order) berdasarkan armada, driver, gudang, dan periode.
6. Order list memiliki aksi bulk melalui menu **Action**: cetak, konfirmasi, dan hapus. Cetak membuka preview multi-invoice A5 landscape tanpa logo sebelum print.
7. Saat surat jalan diselesaikan, sistem mencatat pembayaran tunai/transfer dan membuat piutang bila ada sisa.
8. Piutang dikelompokkan menjadi surat jalan penagihan (collection), lalu dibayar dan dicatat riwayat pembayarannya.
9. Return barang dari pelanggan diproses (ganti barang atau potong harga).
10. Stok dikelola lewat stock masuk, riwayat, dan stock opname.
11. Pendapatan/pengeluaran lain dicatat di modul keuangan.
12. Dashboard meringkas pendapatan, pengeluaran, laba, piutang, status operasional, dan stok.

Pengguna utama:

- **Sales / Sales Office**: membuat order di lapangan, melihat pelanggan dan riwayat order.
- **Logistik**: mengelola gudang, produk, barang, stok, Purchase Request, dan Penerimaan Barang.
- **Admin / Supervisor / Manager / Owner**: mengelola master data, order, pengiriman, penagihan, stok, keuangan, dan laporan.
- **Developer**: akses teknis penuh, termasuk menghapus role.

---

## 2. Tujuan dan Ruang Lingkup Prototype

### 2.1 Yang perlu dibuat di prototype

- Seluruh **shell aplikasi**: sidebar desktop, header, breadcrumb, bottom navigation mobile, user menu, tombol ekspor laporan.
- Seluruh **layar utama** dengan data dummy realistis.
- **State UI**: hover, active, selected, disabled, loading, empty, error, success toast, modal terbuka/tertutup.
- **Alur navigasi antar layar** untuk demo: login → dashboard → buat order → preview → order list → invoice → surat jalan → konfirmasi → piutang/penagihan → return → stock.
- **Responsive behavior** desktop, tablet, dan mobile (khususnya alur Sales).
- **Print preview** invoice, surat jalan, dan surat jalan penagihan.

### 2.2 Yang tidak perlu dibuat di prototype

- Backend, database, API, queue, upload file nyata, atau perhitungan server.
- Validasi server; validasi dilakukan di sisi klien.
- Autentikasi produksi; prototype memakai **login demo** yang divalidasi terhadap daftar pengguna dan disimpan di localStorage, ditambah **role switcher** untuk memperlihatkan menu dan aksi yang berbeda.
- Integrasi peta nyata; cukup tampilan peta statis/placeholder pada form pelanggan.
- Global search di header (tombol ada, tetapi belum ada fungsionalitas di aplikasi asli).
- Notifikasi, chat, audit log, dan halaman laporan terpisah (laporan berupa modal ekspor).

### 2.3 State demo dan penyimpanan lokal

Prototype ini bukan sekadar mockup statis. Seluruh perubahan data disimpan di **localStorage** browser dengan kunci `abi-mineral-demo` dan skema berversi.

- **Sesi login** disimpan, sehingga refresh tidak mengeluarkan pengguna. Login divalidasi terhadap daftar pengguna (akun demo: `admin`, `fahri`, `rina`, `sari`, `developer`, kata sandi `rahasia123`).
- **CRUD nyata** untuk pelanggan, promo, barang, gudang, order, surat jalan, piutang/penagihan, return, stock/opname, keuangan, pengguna, dan role.
- **Alur saling terhubung**: order mengurangi stok, surat jalan mencatat pembayaran dan piutang, penagihan mengurangi sisa piutang, return menyesuaikan stok/nilai piutang.
- **Dashboard live**: KPI, status operasional, low stock, produk populer, dan grafik dihitung dari data aktual.
- **Kontrol demo** di menu user dan Pengaturan → Data Demo: Export JSON, Import JSON, **Isi Data Dummy**, **Hapus Transaksi**, dan Reset Data.
- **Hapus Transaksi** mengosongkan order, surat jalan, return, piutang, penagihan, pembayaran, riwayat stok, opname, pendapatan/pengeluaran, Purchase Request, Purchase Order, Penerimaan Barang, Return Pembelian, jurnal, dan utang tanpa menghapus master data. Stok barang mentah direset ke 0.
- **Sinkronisasi antar-tab** melalui event `storage`.
- Data terikat pada browser/perangkat. Gunakan Export/Import untuk memindahkan state demo.
- Nomor dokumen dan tanggal dibuat relatif terhadap tanggal hari ini, sehingga demo selalu terlihat baru.
- **Master barang awal** hanya berisi 3 produk ABI Mineral: ABI-0001 (220 ml cup), ABI-0002 (330 ml botol), dan ABI-0003 (600 ml botol), masing-masing dengan stok awal 100 Krt.
- **Panduan alur:** buka `flow.html` untuk melihat flowchart operasional lengkap (order → surat jalan → pembayaran → piutang → penagihan → return), status, efek data, dan hak akses role.
- **Design guideline:** `design-guideline.md` berisi standar shell, header, tombol, form, searchable select + quick-add, tabel, status, modal vs halaman, konvensi Alpine, dan checklist modul baru.

### 2.4 Modul Pembelian — L1 & L2

Prototype sekarang memisahkan dua master:

- **Master Produk** — barang jadi yang dipakai Sales Order, promo, surat jalan, dan piutang (kode `ABI-xxxx`).
- **Master Barang** — bahan mentah/kemasan yang dipakai purchasing (kode `BRG-xxxx`).
- **Kategori** dikelola sebagai tab di masing-masing master (`Kategori Produk` dan `Kategori Barang`).
- **Supplier** menyimpan data pemasok, kontak, alamat, dan termin.

Purchase Request (L2):
- Status: `draft → submitted → approved → processing → completed` (+ `rejected` / `cancelled`).
- Daftar PR menampilkan kolom **PO Terkait** berisi nomor PO yang terhubung.
- PR menjadi `processing` selama masih ada PO terkait yang belum selesai diterima.
- PR menjadi `completed` ketika semua PO terkait sudah fully received/closed.
- Jika seluruh PO terkait dibatalkan/ditolak, PR kembali ke `approved`.
- Hanya memilih Master Barang, tidak bisa memilih produk jadi.
- Tidak membuat jurnal, utang, atau perubahan stok.
- Approve/reject hanya oleh role **Manager**.
- Manager tidak dapat approve PR miliknya sendiri.
- Admin dan Developer tidak dapat approve PR.
- PR ikut terhapus saat **Hapus Transaksi**; master tetap.

Purchase Order (L3):
- Dibuat dari PR `approved`/`processing` atau manual.
- Qty PO dibatasi sisa qty PR; satu PR bisa dipecah ke beberapa PO.
- Semua PO memerlukan approval Manager; Admin/Developer tidak approve; Manager tidak bisa approve PO sendiri.
- Harga awal dari Master Barang dan dapat diubah. Harga master diperbarui saat PO disetujui.
- **Biaya Tambahan** mendukung keterangan, nominal, dan qty; total PO = subtotal barang + biaya tambahan.
- Saat penerimaan, biaya tambahan dialokasikan proporsional ke AP; jurnal mencatat beban tambahan dan utang supplier.
- Saat approve, `orderedQty` PR bertambah dan status PR menjadi `processing`/`completed`.
- Cancel PO approved mengembalikan `orderedQty`; harga master tidak di-rollback.
- PO tidak membuat jurnal, utang, atau perubahan stok.
- Preview A4 + Print + Export PDF tersedia.
- PO ikut terhapus saat **Hapus Transaksi**.
- Tahap berikutnya: Finance F1/F2 (CoA + Jurnal) sebelum Penerimaan Barang (L4).

### 2.5 Finance F1 + F2 — Chart of Accounts & Jurnal Umum

Chart of Accounts:
- 20 akun awal: aset, kewajiban, ekuitas, pendapatan, beban.
- Saldo normal debit/kredit, akun induk, penanda Kas/Bank.
- Akun kontrol (Piutang Usaha, Persediaan, Utang Usaha, Piutang Supplier) bertanda **Sistem** dan terkunci dari jurnal manual.
- Akun sistem tidak dapat diedit/dihapus.
- Akun yang sudah dipakai jurnal tidak dapat dihapus.
- Saldo akun dihitung dari jurnal berstatus `posted`; jurnal void tidak dihitung.

Jurnal Umum:
- Double-entry: minimal 2 baris, total debit = total kredit.
- Satu baris hanya debit atau kredit.
- Akun nonaktif dan akun terkunci tidak bisa dipakai.
- Status `draft → posted`, serta `void` dengan alasan.
- Draft dapat diedit/dihapus; posted immutable.
- Nomor otomatis `JU/YYYY/MM/xxxx`.
- Riwayat aksi tersimpan pada setiap jurnal.
- Jurnal ikut terhapus saat **Hapus Transaksi**; Chart of Accounts tetap.

### 2.5.1 Perubahan konsep Master Keuangan

- Menu **Master Keuangan** dihapus dari prototype.
- `financeTypes` tidak lagi dipakai.
- **Pendapatan Lainnya** dan **Pengeluaran Lainnya** langsung memilih:
  - akun CoA (revenue/expense),
  - akun Kas/Bank.
- Setiap transaksi otomatis membuat jurnal posted:
  - Pendapatan: `Dr Kas/Bank / Cr Akun Pendapatan`
  - Pengeluaran: `Dr Akun Beban / Cr Kas/Bank`
- Edit transaksi → jurnal lama di-void, jurnal baru dibuat.
- Hapus transaksi → jurnal terkait di-void.
- Akun sistem (Pendapatan Penjualan, Diskon Penjualan, HPP) tidak muncul di form transaksi operasional.
- Migrasi v9 → v10 memetakan transaksi lama ke akun CoA dan membuat jurnal otomatis.

### 2.6 Finance F3 — Buku Besar & Laporan

Buku Besar:
- Filter akun, tanggal mulai, dan tanggal akhir.
- Menampilkan saldo awal, total debit, total kredit, saldo akhir.
- Mutasi hanya dari jurnal `posted`; `draft` dan `void` diabaikan.
- Saldo berjalan mengikuti saldo normal akun.
- Nomor jurnal bisa diklik untuk membuka detail.

Laporan:
- Satu halaman dengan 4 tab: **Neraca Saldo**, **Laba Rugi**, **Neraca**, dan **Pendapatan**.
- **Neraca Saldo**: posisi per tanggal; kolom Kode, Nama Akun, Tipe, Debit, Kredit; total debit dan kredit; badge Seimbang; toggle akun saldo 0; export CSV.
- **Laba Rugi**: rentang tanggal; section Pendapatan, HPP, Laba Kotor, Beban Operasional, Laba Bersih.
- **Neraca**: posisi per tanggal; Aset Lancar/Tetap, Kewajiban Jangka Pendek/Panjang, Ekuitas, Laba Berjalan, total kewajiban + ekuitas, dan baris pengecekan.
- **Pendapatan**: rentang tanggal; ringkasan sumber (Penjualan Order dan Pendapatan Lain), rincian pendapatan lain per akun, penjualan per channel/user, dan rincian order.
- Channel penjualan: **Sales** untuk order dari role Sales, **Sales Kantor** untuk order dari role lain.
- Setiap order menyimpan `createdById`, `createdBy`, `createdByRole`, `salesChannel`, dan `salesPerson`.
- Nilai penjualan memakai netto sebelum PPN; order batal tidak dihitung.
- Neraca Saldo memastikan total debit = total kredit. Neraca memastikan aset = kewajiban + ekuitas.
- Kode/nama akun bisa diklik untuk drill-down ke Buku Besar.
- Cetak memakai A4 portrait dan hanya mencetak tab aktif.
- Export CSV mengikuti tab aktif.
- Permission `Laporan Keuangan` untuk Admin, Manager, Developer.

**Apa itu Neraca Saldo (trial balance):** daftar saldo akhir seluruh akun pada satu tanggal, sebelum jurnal penutup. Fungsinya memastikan total debit sama dengan total kredit. Neraca Saldo bukan laporan laba/rugi dan bukan neraca; ia hanya alat kontrol keseimbangan pembukuan.

### 2.6.1 Saldo Awal

Menu: **Keuangan → Saldo Awal**.
Permission: `Laporan Keuangan` (Admin, Manager, Developer).

- **Mode Cepat**: input saldo Kas dan Bank. Selisih otomatis menjadi saldo awal ekuitas.
- **Mode Lengkap**: input seluruh akun Aset, Kewajiban, dan Ekuitas.
- Akun penyeimbang: **3-1100 Saldo Awal**.
- Total debit dan kredit ditampilkan; selisih otomatis masuk ke akun penyeimbang.
- Posting membuat satu jurnal `source=opening` dan langsung memengaruhi Neraca Saldo, Neraca, dan Buku Besar.
- Jurnal saldo awal tidak masuk Laba Rugi dan tidak dihitung sebagai uang masuk kas.
- Jika sudah ada jurnal posted sebelum tanggal saldo awal, sistem menampilkan peringatan.
- Saldo awal hanya boleh satu yang posted; untuk mengubah, gunakan **Void Saldo Awal** lalu posting ulang.
- Jurnal saldo awal menyimpan pembuat dan waktu posting.

### 2.6.2 HPP Harian

Menu: **Keuangan → HPP**.
Permission: `Laporan Keuangan` (Admin, Manager, Developer).

Tab:

1. **HPP Harian**
2. **Biaya Bulanan**
3. **Pengaturan**

Aturan utama:

- Satuan memakai **Krt**.
- Hasil produksi diambil dari dokumen Produksi posted, bukan diketik.
- HPP per Krt = bahan baku per Krt + biaya produksi per Krt.
- Bahan memakai qty aktual dari PRD atau standar dari resep.
- Harga bahan memakai rata-rata bergerak per tanggal produksi, bisa dioverride dengan alasan.
- Biaya bulanan: gaji, uang makan, BPJS, listrik, overhead.
- Biaya produksi per Krt = `(nilai bulanan ÷ hari kerja ÷ hasil produksi) × alokasi%`.
- Air = `(liter per Krt ÷ 1.000) × harga per m³`.
- Penyusutan = `nilai penyusutan ÷ hasil produksi × alokasi%`.
- **Rumus Listrik** dapat dipilih di Pengaturan:
  - **Alokasi biaya bulanan** (default): `biaya bulanan ÷ hari kerja ÷ hasil produksi`.
  - **Tarif per kWh (client)**: `(biaya bulanan ÷ kWh) ÷ hasil produksi`; nilai per Krt ditampilkan **Rp 1** dengan keterangan nilai asli **Rp 0,18** dan tarif **Rp 274,86/kWh**.
- **Pembulatan** dapat dipilih di Pengaturan:
  - **Tidak dibulatkan** (default, presisi penuh),
  - **Bulatkan tiap komponen**,
  - **Bulatkan HPP akhir**.
  - Nilai asli komponen yang dibulatkan tetap ditampilkan sebagai keterangan.
- Panel **Perbandingan dengan Sheet Client** hanya ada di tab Pengaturan:
  - Sheet client: listrik Rp 1, air 73, HPP **13.483,40/Krt**.
  - Rumus benar: listrik Rp 369,83, air 73,50, HPP **13.852,76/Krt**.
  - Selisih **369,36/Krt**, bersumber dari listrik dan pembulatan manual client.
- **Ambil dari periode** (dropdown) menggantikan tombol salin:
  - pilihan September, Oktober, November 2026, dan periode lain yang punya data;
  - periode aktif dinonaktifkan;
  - periode kosong menampilkan label `(belum ada data)` dan otomatis memuat data dummy sebagai **Estimasi**.
- **Isi Data Dummy** membuat biaya September (95%), Oktober (angka sheet client, **Aktual**), dan November (103%) 2026.
- **Skenario demo 30 Oktober**: produksi 1.515 Krt tanpa pergerakan stok; tombol **Demo 30 Oktober** di tab HPP Harian langsung membuka form dengan tanggal 30 Oktober 2026, produk ABI-0001, override harga bahan (LID 39, CUP 132, STRAW 15, BOX 3.309, LAKBAN 31) beralasan `Data uji HPP 30 Oktober`, dan periode biaya Oktober. Memilih tanggal/produk yang sama secara manual juga mengisi otomatis.
- Satu HPP final per tanggal + produk.
- Revisi membuat versi baru dan menandai versi lama **Digantikan**.
- Draft boleh dihitung ulang dari data sumber; harga override dan penyusutan dipertahankan.
- Final mengunci snapshot.
- Terapkan ke Harga Modal memakai pembulatan rupiah dan dicatat di riwayat.
- Order baru menyimpan `costAtOrder` agar perubahan Harga Modal tidak mengubah COGS historis.
- Self-test internal memverifikasi contoh HPP 13.852,76 dan listrik client Rp 1.

### 2.7 L4 — Penerimaan Barang

- Penerimaan dibuat dari PO `approved`, `sent`, atau `partially_received`.
- Satu penerimaan memiliki satu gudang; qty tidak boleh melebihi sisa PO.
- Status `draft → posted`; draft bisa diedit/dihapus, posted immutable.
- Saat posting:
  - `receivedQty` PO bertambah,
  - stok material bertambah,
  - `stockValue`, `avgCost`, dan `stockMovements` diperbarui,
  - jurnal otomatis `Dr Persediaan / Cr Utang Usaha`,
  - payable/AP otomatis dengan jatuh tempo dari termin supplier,
  - status PO menjadi `partially_received` / `fully_received`.
- Stok per gudang dihitung dari `stockMovements` dan ditampilkan di **Stock → Barang**.
- Daftar penerimaan menampilkan **Nilai Diterima** dan **Total PO**.
- Action **Riwayat** menampilkan riwayat draft/posted beserta user dan jabatan.
- Preview A4 + Print/Export PDF tersedia.
- Penerimaan tidak melakukan pembayaran utang; pembayaran AP masuk F5.
- Permission `Penerimaan Barang` untuk Admin, Manager, Supervisor, Developer.

### 2.8 L5 — Return Pembelian

- Return dibuat dari PO yang sudah memiliki penerimaan `posted`.
- Flow: **Buat Return → Pilih Purchase Order → isi qty, kondisi, tindakan, keterangan → Posting**.
- Satu return memakai satu gudang asal; gudang diambil dari penerimaan PO.
- Setiap baris memiliki:
  - qty return,
  - kondisi `Bagus` / `Rusak`,
  - tindakan `Ganti Barang` / `Ganti Biaya`,
  - keterangan bebas.
- Qty return dibatasi oleh `receivedQty - returnedQty` dan stok gudang asal.
- Saat posting:
  - stok material berkurang dan `stockMovements` mencatat qty negatif,
  - `returnedQty` PO bertambah,
  - **Ganti Barang** → `Dr Piutang Supplier / Cr Persediaan`,
  - **Ganti Biaya** → `Dr Utang Usaha / Cr Persediaan` dan payable PO dikurangi,
  - jurnal otomatis dibuat dengan source `purchase-return`.
- Aksi **Terima Ganti Barang** menambah stok pengganti dan mengurangi Piutang Supplier.
- Return posted dapat dibatalkan selama penggantian belum diterima; pembatalan mengembalikan stok, `returnedQty`, payable, dan mem-void jurnal.
- Permission `Return Pembelian` untuk Admin, Manager, Supervisor, Developer.

### 2.9 Utang Supplier

- Menu **Keuangan → Utang** menampilkan payable yang terbentuk otomatis dari penerimaan barang posted.
- Kolom: nilai utang, dibayar, sisa, jatuh tempo, status, PO/penerimaan.
- Aksi **Bayar** membuka form pembayaran:
  - tanggal,
  - nominal (maksimal sisa utang),
  - akun Kas/Bank,
  - keterangan dan bukti.
- Saat pembayaran disimpan:
  - `paid` bertambah dan `unpaid` berkurang,
  - status menjadi `partial` atau `paid`,
  - jurnal otomatis `Dr Utang Usaha / Cr Kas/Bank`,
  - riwayat pembayaran tersimpan di detail utang.
- Permission `Utang` untuk Admin, Manager, Supervisor, Developer.

### 2.10 Produksi & Resep (BOM)

- Master Produk memiliki resep bahan baku per 1 satuan produk.
- Tambah/Edit Produk memakai halaman penuh karena form dan resep cukup panjang.
- Resep disimpan di `recipes` dan tidak menimpa Harga Modal.
- Buat Produksi mengurangi stok bahan baku dan menambah stok produk jadi.
- Pemakaian bahan mengikuti standar resep × qty hasil, tetapi dapat diedit manual.
- Setiap produksi menyimpan snapshot bahan, harga, standar, dan pemakaian.
- Nomor produksi memakai format `PRD-YYYY-0001`.
- Produksi menghasilkan dua pergerakan stok: hasil produk (+) dan pemakaian bahan (-).
- Koreksi produksi hanya mengubah hasil dan pemakaian; standar snapshot tetap.
- Koreksi menyesuaikan stok sebesar selisih dan tercatat di `productionLogs`.
- Tab Produksi menyediakan daftar, detail, dan riwayat perubahan.
- Stok Barang memiliki tab Riwayat untuk pemakaian bahan baku.

---

## 3. Stack dan Fondasi UI

| Area | Teknologi |
|---|---|
| Backend | Laravel 12, Inertia.js 2, Fortify, Spatie Permission |
| Frontend | React 19, TypeScript, Inertia React |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Komponen | shadcn/ui berbasis Radix UI, Headless UI |
| Ikon | `lucide-react` |
| Chart | Recharts |
| Peta | Leaflet + React Leaflet |
| Tanggal | react-day-picker, date-fns |
| Notifikasi | Sonner (`toast.success`) |
| Print | `react-to-print` |
| Tabel | Komponen tabel internal + pagination kustom |
| Font | Instrument Sans |

### 3.1 Prinsip visual

- **Enterprise dashboard yang bersih**, dominan putih, abu muda, dan navy gelap.
- Sidebar selalu **navy gelap** (`#0F172B`) baik mode terang maupun gelap.
- Warna aksen utama adalah **biru** (`#1D4ED8`) untuk item sidebar aktif.
- Status menggunakan **badge outline pastel** (kuning/oranye/biru/cyan/amber/hijau/merah).
- Kartu dan tabel memakai border tipis, radius sedang, tanpa bayangan berlebihan.
- Aksi utama selalu di kanan atas toolbar; aksi per baris berada di dropdown `⋯`.
- Form CRUD memakai **dialog/modal** dengan area scroll `max-h-[70vh]`.
- Konfirmasi destruktif atau submit penting memakai dialog konfirmasi terpisah.

---

## 4. Design System

### 4.1 Design token warna

| Token | Light | Dark | Penggunaan |
|---|---|---|---|
| `background` | putih | near-black | Latar halaman |
| `foreground` | near-black | putih | Teks utama |
| `card` | putih | near-black | Kartu |
| `primary` | `#0F172B` | `#FFFFFF` | Tombol utama, teks tebal |
| `primary-foreground` | putih | `#0F172B` | Teks tombol utama |
| `secondary` | abu sangat muda | abu gelap | Badge sekunder, tombol sekunder |
| `muted` | abu sangat muda | abu gelap | Header tabel, tab container |
| `muted-foreground` | abu medium | abu terang | Teks sekunder |
| `accent` | abu sangat muda | abu gelap | Hover |
| `destructive` | merah | merah gelap | Hapus, error |
| `border` | abu muda | abu gelap | Border tabel/kartu |
| `sidebar` | `#0F172B` | `#0F172B` | Sidebar |
| `sidebar-accent` | `#1D4ED8` | `#1D4ED8` | Item sidebar aktif |
| `chart-1` | oranye | indigo | Pengeluaran di dashboard |
| `chart-2` | teal | hijau | Pendapatan di dashboard |
| `chart-3` | biru gelap | oranye | Chart lain |
| `chart-4` | kuning | magenta | Chart lain |
| `chart-5` | oranye | merah | Chart lain |

**Radius:** `--radius: 0.625rem` (10px); `md` = 8px, `sm` = 6px.

**Tipografi:** `Instrument Sans`; ukuran umum:
- Judul halaman: `text-lg font-bold` atau heading layout.
- Judul kartu: `font-semibold`.
- Teks tabel: `text-sm`.
- Metadata: `text-xs text-muted-foreground`.
- Nominal uang: `formatRupiah` → `Rp 1.234.567` (tanpa desimal).

### 4.2 Ikon navigasi

| Menu | Ikon Lucide |
|---|---|
| Dashboard | `LayoutDashboard` |
| Master Pelanggan | `Users` |
| Master Promo | `Tags` |
| Order | `ShoppingCart` |
| Master Gudang | `Warehouse` |
| Master Barang | `Package` |
| Stock | `Boxes` |
| Master Keuangan | `FileChartPie` |
| Piutang | `WalletMinimal` |
| Pendapatan Lainnya | `Banknote` |
| Pengeluaran Lainnya | `BanknoteArrowDown` |
| Akun Saya | `User` |
| Kelola Pengguna | `Users` |
| Kelola Role | `ShieldHalf` |

### 4.3 Format angka & tanggal

- Uang: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })`.
- Angka: pemisah ribuan titik, maksimal 2 desimal, contoh `1.250` atau `1.250,5`.
- Tanggal tabel: `dd/MM/yyyy`.
- Tanggal panjang Indonesia: `Senin, 26 Oktober 2026`.
- Input tanggal Indonesia pada filter: `dd/mm/yyyy`.
- Singkatan chart: `rb`, `jt`, `m` (contoh `12,5jt`).
- Nominal invoice disertai terbilang bahasa Indonesia, contoh `*** seratus dua puluh lima ribu rupiah`.

---

## 5. Arsitektur Informasi & Navigasi

### 5.1 Sidebar desktop

Sidebar `collapsible="icon"` dengan header logo:
- Logo `favicon-192.png`
- Teks **ABI MINERAL**
- Subteks **Sistem Distributor**

Urutan grup:

1. **Dashboard** (tanpa label grup, hanya jika punya permission `Dashboard`)
2. **Penjualan**
   - Master Pelanggan
   - Master Promo
   - Order
3. **Logistik**
   - Master Gudang
   - Master Produk
   - Master Barang
   - Stock
4. **Pembelian**
   - Supplier
   - Purchase Request
   - Purchase Order
   - Penerimaan Barang
   - Return
5. **Keuangan**
   - Piutang
   - Utang
   - Pendapatan Lainnya
   - Pengeluaran Lainnya
   - Chart of Accounts
   - Saldo Awal
   - HPP
   - Jurnal Umum
   - Buku Besar
   - Laporan
6. **Pengguna**
   - Akun Saya
   - Kelola Pengguna
   - Kelola Role

Item aktif ditandai background biru `sidebar-accent` dan teks putih. Menu dengan wildcard (`/dashboard/order*`) tetap aktif untuk semua subhalaman.

### 5.2 Header

- Tombol collapse sidebar.
- Breadcrumb halaman.
- Kanan: tombol **Laporan** (ikon download) dan avatar/nama pengguna dengan dropdown:
  - Pengaturan / Profil
  - Logout
- Di mobile: bottom navigation mengikuti role, maksimal 5 item:
  - **Sales**: Beranda, Order, Pelanggan, Akun.
  - **Admin**: Beranda, Order, Stock, Piutang, Akun.
  - **Manager**: Beranda, Order, Pembelian, Stock, Akun.
  - **Supervisor**: Beranda, Order, Stock, Piutang, Akun.
  - **Logistik**: Beranda, Stock, PR, Penerimaan, Akun.
  - **Developer**: Beranda, Order, Stock, Pengguna, Akun.
  - Setiap item difilter lagi berdasarkan permission role.

### 5.3 Peta halaman

| Halaman | Route | Permission |
|---|---|---|
| Login | `/login` | publik |
| Register | `/register` | publik (jika aktif) |
| Forgot/reset password | `/forgot-password`, `/reset-password` | publik |
| Dashboard | `/dashboard` | `Dashboard` untuk widget tambahan |
| Master Pelanggan | `/dashboard/customer` | `Master Pelanggan` |
| Master Promo | `/dashboard/discount` | `Master Promo` |
| Pilih Pelanggan untuk Order | `/dashboard/order/customer` | `Order` |
| Buat Order | `/dashboard/order/customer/{customer}` | `Order` |
| Order List | `/dashboard/order` | `Order Admin` |
| Order Detail | `/dashboard/order/detail/{order}` | `Order Admin` |
| Edit Order | `/dashboard/order/edit/{order}` | `Order Admin` |
| Invoice single/multi | `/dashboard/order/invoice?id=...` / `?ids=...` | `Order` / `Order Admin` |
| Surat Jalan List | `/dashboard/order/delivery` | `Order Admin` |
| Buat Surat Jalan | `/dashboard/order/delivery/create` | `Order Admin` |
| Konfirmasi Surat Jalan | `/dashboard/order/delivery/check/{delivery}` | `Order Admin` |
| Detail Surat Jalan | `/dashboard/order/delivery/detail/{delivery}` | `Order Admin` |
| Invoice Delivery | `/dashboard/order/delivery/invoice/{delivery}` | `Order Admin` |
| Produk Delivery | `/dashboard/order/delivery/product/{delivery}` | `Order Admin` |
| Return | `/dashboard/order/retur` | `Order Admin` |
| Stock Aktif | `/dashboard/inventory/stock` | `Stock` |
| Riwayat Stock | `/dashboard/inventory/history` | `Stock` |
| Stock Opname | `/dashboard/inventory/opname` | `Stock` + `Stock Opname` |
| Master Gudang | `/dashboard/warehouse` | `Master Gudang` |
| Master Barang | `/dashboard/product` | `Master Barang` |
| Master Keuangan | `/dashboard/finance/master/income` dan `/expense` | `Master Keuangan` |
| Pendapatan Lainnya | `/dashboard/finance/income` | `Pendapatan Lainnya` |
| Pengeluaran Lainnya | `/dashboard/finance/expense` | `Pengeluaran Lainnya` |
| Piutang Aktif | `/dashboard/piutang` | `Piutang` |
| Penagihan | `/dashboard/piutang/penagihan` | `Piutang` |
| Buat Penagihan | `/dashboard/piutang/penagihan/create` | `Piutang` |
| Preview Penagihan | `/dashboard/piutang/penagihan/preview/{debt}` | `Piutang` |
| Konfirmasi Penagihan | `/dashboard/piutang/penagihan/confirm/{debt}` | `Piutang` |
| Piutang Lunas | `/dashboard/piutang/lunas` | `Piutang` |
| Riwayat Pembayaran | `/dashboard/piutang/payment` | `Piutang` |
| Kelola Pengguna | `/dashboard/users` | `Kelola Role & Pengguna` |
| Kelola Role | `/dashboard/role` | `Kelola Role & Pengguna` |
| Profil | `/settings/profile` | login |
| Kata sandi | `/settings/password` | login |
| 2FA | `/settings/two-factor` | login |
| Tampilan | `/settings/appearance` | login |

---

## 6. Peran, Permission, dan Visibilitas UI

### 6.1 Daftar permission

1. `Dashboard`
2. `Master Pelanggan`
3. `Master Promo`
4. `Order`
5. `Order Admin`
6. `Master Gudang`
7. `Master Barang`
8. `Stock`
9. `Stock Opname`
10. `Master Keuangan`
11. `Piutang`
12. `Pendapatan Lainnya`
13. `Pengeluaran Lainnya`
14. `Kelola Role & Pengguna`
15. `Diskon Khusus`

### 6.2 Role seed

- Owner
- Manager
- Supervisor
- Admin
- Sales
- Sales Office
- Logistik
- Developer (dibuat oleh `PermissionSeeder`, mendapat semua permission)

Role tidak otomatis memiliki permission; permission diatur per role melalui halaman **Kelola Role**. Untuk prototype, sediakan role switcher dengan contoh:

| Role | Menu yang ditampilkan |
|---|---|
| Admin / Developer | Semua menu |
| Sales / Sales Office | Dashboard (versi ringkas), Order (alur mobile), Master Pelanggan (hanya pelanggan miliknya), Akun |
| Manager / Owner | Dashboard, Penjualan, Logistik, Pembelian, Keuangan, Pengguna |
| Supervisor | Order Admin, Logistik, Pembelian (PR/PO/Penerimaan/Return), Piutang, Utang, laporan |
| Logistik | Dashboard, Logistik, Purchase Request, Penerimaan Barang |

### 6.3 Perilaku khusus

- Sales/Sales Office hanya melihat **pelanggan miliknya** dan **data dashboard miliknya**.
- Sales tidak melihat filter Sales pada rekap harian (otomatis dirinya).
- Sales memakai **alur order mobile-first** dan setelah submit diarahkan ke halaman sukses, bukan invoice.
- Admin setelah submit order langsung diarahkan ke invoice untuk dicetak.
- Hanya pengguna dengan `Diskon Khusus` yang melihat input **Diskon Khusus**.
- Hanya role `Developer` yang boleh menghapus role (aksi hapus disembunyikan untuk role lain).
- Tombol print invoice disembunyikan untuk Sales, tetapi halaman preview tetap dapat dibuka.

---

## 7. Alur Bisnis Utama

### 7.1 Order → Invoice

1. Sales memilih pelanggan dari daftar jadwal (atau semua).
2. Sales memilih produk dan qty.
3. Harga otomatis dipilih berdasarkan `price_type` pelanggan:
   - `in` → harga dalam kota
   - `out` → harga luar kota
4. Diskon aktif dihitung otomatis (satu promo terbaik per produk per tipe).
5. Jika promo bonus produk, baris bonus ditambahkan dengan harga 0 dan diskon 100%.
6. Diskon khusus (jika berizin) mengurangi total.
7. PPN dihitung dari konfigurasi (`PPN`, default 0%).
8. Order disimpan dengan status awal `pending`.
9. Admin mengonfirmasi order → status `already`, `due_date` diisi +2 minggu.
10. Invoice dapat dicetak (single atau multiple).

### 7.2 Surat Jalan / Delivery

1. Admin membuat surat jalan dari order yang sudah siap (`already`, `holding`, `partial`).
2. Pilih periode, driver, armada, gudang.
3. Sistem mengurangi stok gudang sesuai `qty_sent`.
4. Order berubah menjadi `shipping`.
5. Halaman invoice delivery dapat dicetak.
6. Saat pengiriman selesai, admin membuka halaman konfirmasi:
   - Input tunai, transfer, dan sisa piutang per order.
   - Submit → delivery `success`, order `success`/`partial`, piutang dibuat bila ada sisa.
7. Jika dihapus, stok dikembalikan dan order kembali `already`.

### 7.3 Piutang → Penagihan → Pembayaran

1. Piutang aktif berasal dari delivery yang memiliki sisa bayar.
2. Admin membuat **surat jalan penagihan** dari piutang aktif milik satu sales.
3. Pada halaman konfirmasi, isi tunai/transfer per order lalu submit.
4. Sistem membuat `DebtPayment`, menambah total bayar, mengurangi sisa piutang.
5. Piutang yang lunas pindah ke tab **Lunas**.
6. Riwayat pembayaran menampilkan bukti pembayaran; jika belum ada bukti, tombol **Upload** tersedia.

### 7.4 Return

1. Return dibuat dari detail surat jalan (per order).
2. Pilih barang, qty (maksimum qty terkirim), jenis return:
   - **Ganti Barang** → status akhir `discard` (stok tidak dikembalikan pada proses ini).
   - **Potong Harga** → status akhir `return` dan stok dikembalikan.
3. Kondisi barang: bagus/rusak.
4. Return berstatus `pending` hingga diproses.
5. Aksi **Proses** mengubah total order/piutang/stok sesuai jenis return.
6. Return pending dapat dibatalkan/dihapus.

### 7.5 Stock

1. **Stock Aktif**: daftar produk + total stok dari semua gudang.
2. **Produksi**: membuat produk jadi dari bahan baku berdasarkan resep; standar dapat disesuaikan dengan pemakaian aktual.
3. **Riwayat**: pergerakan stock masuk, produksi, koreksi produksi; nomor PRD dapat diklik menuju detail.
4. **Opname**: penyesuaian stok per produk/gudang; qty positif menambah, negatif mengurangi.
5. **Barang → Stock Aktif**: qty dan nilai bahan per gudang.
6. **Barang → Riwayat**: pergerakan bahan baku dari penerimaan, return, produksi, dan opname.
7. **Barang → Opname**: penyesuaian stok bahan baku per gudang; qty positif menambah, negatif mengurangi; tersimpan sebagai pergerakan `opname`.
8. **Master Barang**: status aktif/nonaktif; barang yang dipakai resep tidak dapat dihapus.
9. **Master Gudang**: kode otomatis `ST-0001`.

### 7.6 Keuangan & Laporan

1. **Master Keuangan**: kategori pemasukan/pengeluaran.
2. **Pendapatan/Pengeluaran Lainnya**: transaksi nominal, tanggal, bukti pembayaran (gambar), keterangan.
3. Dashboard menggabungkan pendapatan order + pendapatan lain, serta pengeluaran lain.
4. Tombol **Laporan** di header membuka modal ekspor Excel laporan penjualan:
   - Filter tanggal dari/sampai (opsional; kosong = semua waktu).
   - Filter sales (default semua sales).
   - Filter customer (opsional; hanya aktif setelah sales dipilih).
   - File `.xlsx` dengan 21 kolom (invoice, customer, sales, gudang, barang, qty, diskon, harga, alamat, channel, no surat jalan).

---

## 8. Spesifikasi Layar

### 8.0 Autentikasi

**Login**
- Layout split-screen: panel kiri gelap dengan logo, nama perusahaan, subteks, quote; panel kanan form.
- Mobile: logo di tengah atas, tanpa panel kiri.
- Field: **Username**, **Kata Sandi**, checkbox **Ingat saya**.
- Tombol utama: **Login**.
- Link: lupa kata sandi dan daftar (jika aktif).
- State: loading spinner di tombol, error di bawah field, status sukses hijau.

**Halaman auth lain**
- Register: nama lengkap, email, password, konfirmasi password.
- Forgot password: email.
- Reset password: email, password baru, konfirmasi.
- Confirm password, verify email, two-factor challenge (kode OTP / recovery code).

> Untuk prototype, cukup tampilkan login dengan dua pilihan demo: **Masuk sebagai Admin** dan **Masuk sebagai Sales**, atau dropdown role.

---

### 8.1 Dashboard

Route: `/dashboard`
Permission: login; widget tambahan hanya jika `Dashboard`.

**KPI per role (selalu 4 kartu)**
| Role | KPI |
|---|---|
| Sales | Nilai Order Saya, Order Saya, Pelanggan Saya, Kunjungan Hari Ini |
| Admin | Pendapatan, Laba Bersih, Piutang, Utang |
| Manager | Pendapatan, Laba Bersih, Piutang, PR Menunggu |
| Supervisor | Order Bulan Ini, Surat Jalan, Piutang, Stock Menipis |
| Logistik | Stock Menipis, Bahan Menipis, PR Menunggu, Penerimaan Draft |
| Developer | Pendapatan, Laba Bersih, Piutang, PR Menunggu |

**Modul dashboard**
| Modul | Tampil untuk |
|---|---|
| Grafik Pendapatan vs Pengeluaran | Role dengan akses keuangan: Admin, Manager, Developer |
| Rekap Harian | Role dengan akses Order/Piutang |
| Informasi Operasional (delivery, billing, invoice, return) | Role dengan akses Order |
| Informasi Stock + Produksi bulan ini | Role dengan akses Stock |
| Pembelian: PR, PO, Penerimaan | Sesuai permission masing-masing |
| Akuntansi | Role dengan akses Jurnal |
| Pengguna & Role | Role dengan akses Pengguna |
| Kunjungan Hari Ini | Sales |

- Dashboard mengikuti permission halaman, bukan hanya nama role.
- Sales hanya melihat order, pelanggan, rekap, dan piutang miliknya sendiri.
- Logistik tidak melihat pendapatan, laba, piutang, utang, order, atau akuntansi.
- Supervisor tetap melihat Rekap Harian operasional tanpa laba/rugi.
- Badge kanan atas: **Data Saya**, **Operasional**, **Logistik**, atau **Semua Data**.

**State & interaksi prototype**
- Filter tanggal dan sales mengubah angka (mock).
- Hover kartu sedikit terangkat/border berubah.
- Chart tooltip aktif.
- Tab stock berpindah konten.
- Loading skeleton untuk kartu/chart (opsional).

---

### 8.2 Master Pelanggan

Route: `/dashboard/customer`

**Toolbar**
- Search "Cari..." (aktif saat Enter).
- Multi-select: Channel, Sales, Pekan (Genap/Ganjil), Hari (Senin–Minggu), Jenis Harga (Dalam Kota/Luar Kota).
- Tombol kanan: **+ Tambah Pelanggan**.

**Tabel**
Kolom: `#`, `ID` (sortable), `Nama Pelanggan` (sortable), `Alamat`, `Channel`, `Sales`, `Pekan`, `Hari`, `Jenis Harga`, `Action`.

- Pekan Genap: badge biru; Ganjil: badge kuning.
- Jenis harga: teks biru (Dalam Kota) / amber (Luar Kota).
- Action dropdown: **Edit**, separator, **Hapus** (merah).
- Empty state standar.
- Pagination 10 baris.

**Modal Tambah/Edit Pelanggan**
Dua kolom, scroll:

Kolom kiri:
- Peta pemilih lokasi (Leaflet) — lingkaran marker/posisi.
- Field **Koordinat** (otomatis dari peta, bisa diketik).
- **Nama Pelanggan** *.
- **Alamat Lengkap** * (textarea).

Kolom kanan:
- **Channel** * — select dengan opsi `+ Tambah Channel` (membuka modal kecil).
- **Sales** * — select; untuk Sales/Sales Office otomatis user sendiri (hidden).
- **Pekan** * — Genap/Ganjil.
- **Hari** * — Senin–Minggu.
- **Jenis Harga** * — radio Dalam Kota / Luar Kota.
- **Nomor Telepon** * — tel, 8–15 digit.
- **Keterangan** (textarea).
- Footer: **Batal**, **Simpan** (spinner saat proses).
- Toast sukses: "Pelanggan baru berhasil ditambahkan 🎉".

**Hapus**
- Dialog konfirmasi, tombol Batal/Hapus.
- Soft delete di aplikasi asli.

**Modal Channel**
- Field nama channel, simpan; langsung muncul di pilihan channel.

---

### 8.3 Master Promo

Route: `/dashboard/discount`

**Toolbar**
- Search.
- Tombol **+ Buat Promo**.

**Tabel**
Kolom: `#`, `ID`, `Nama Promo`, `Barang`, `Minimum Order`, `Periode Awal`, `Periode Akhir`, `Bonus`, `Kelipatan`, `Action`.

- Minimum order ditampilkan dengan satuan produk, contoh `24 Krt`.
- Bonus:
  - Tipe harga: `Potongan 5%`.
  - Tipe produk: `Produk B 1 Krt`.
- Kelipatan: ikon centang hijau jika ya, `-` jika tidak.
- Action: Edit / Hapus.

**Modal Buat/Edit Promo**
- Nama Promo *.
- Produk * (combobox).
- Jumlah Minimum * (number + satuan produk).
- Keterangan.
- Periode Awal * dan Periode Akhir * (date input).
- **Jenis Bonus** * radio:
  - **Potongan Harga** → Nilai Potongan * (0–100%, ikon persen).
  - **Bonus Barang** → Produk Bonus *, radio **Berlaku Kelipatan?** Ya/Tidak, Jumlah Bonus * (satuan).
- Footer Batal/Simpan; toast sukses.

---

### 8.4 Alur Order

#### 8.4.1 Pilih Pelanggan (Admin)

Route: `/dashboard/order/customer`

- Header: tombol back, tab **Jadwal** / **Semua**.
- Toolbar: search, date picker (jika tab Jadwal), multi-select Sales, multi-select Status (jika Jadwal).
- Daftar berupa **kartu pelanggan**:
  - Nama + ID pelanggan.
  - Badge hari, badge pekan (biru), badge jenis harga (kuning).
  - Alamat dengan ikon map pin.
  - Channel + Sales dengan avatar.
  - Tombol **+ Order**.
  - Ikon centang hijau jika pelanggan sudah punya order pada tanggal tersebut.
- Empty state standar.
- Pagination.

#### 8.4.2 Pilih Pelanggan (Sales — mobile first)

Route yang sama untuk role Sales.

- Header "Order" + tanggal hari ini.
- Tombol filter ikon.
- Tab besar Jadwal/Semua.
- Search full-width.
- Navigasi tanggal: panah kiri, tanggal, panah kanan.
- Kartu pelanggan:
  - Nama + ID.
  - Centang hijau bila sudah order.
  - Badge hari, pekan, jenis harga.
  - Alamat.
  - "Terakhir Order: Hari Ini/Kemarin/12 Okt 2026".
  - Dua tombol: **Order** (membuka kamera) dan **Riwayat**.
- Scroll area tinggi 70vh.

#### 8.4.3 Kamera Order (Sales)

- Dialog kamera untuk mengambil foto kunjungan/order.
- Foto disimpan sementara (sessionStorage di aplikasi asli) dan dikirim saat submit.
- Untuk prototype: tampilkan modal kamera palsu dengan tombol **Ambil Foto**, preview, **Gunakan Foto**.

#### 8.4.4 Buat Order

Route: `/dashboard/order/customer/{customer}`

**Header**
- Tombol back "Kembali".
- Kanan: tombol **Preview** (disabled jika belum ada produk / metode pembayaran belum dipilih).

**Mode Desktop**
Dua kolom:

Kolom kiri — **Pilih Produk**
- Search.
- Daftar kartu produk:
  - Ikon kotak biru, nama, kode.
  - Harga sesuai tipe pelanggan.
  - Stok tersedia + satuan.
  - Number input qty (di kanan).
- Empty state standar.

Kolom kanan — **Ringkasan**
- **Metode Pembayaran** * — select: Tunai, Kredit, Transfer.
- **Diskon Khusus** (jika berizin) — input persen + validasi.
- Tabel ringkasan:
  - Kolom: Produk, Qty, Disc, Total.
  - Diskon promo tampil badge hijau, contoh `5%`.
  - Baris bonus produk (jika ada) dengan qty dan Rp 0.
- Ringkasan total:
  - Total Harga
  - Disc (merah, minus)
  - Disc Khusus (merah, minus) — jika ada
  - PPN (%) — jika > 0
  - **Grand Total** tebal
- Tombol **Preview** (jika desktop, di header).

**Mode Sales Mobile**
- Informasi pelanggan (ikon toko, nama, ID, alamat).
- Tab **Order** / **Riwayat**.
- Pilih Produk:
  - Kartu produk dengan ikon, nama, kode.
  - Harga + stok.
  - Kontrol qty: tombol minus bulat, number input, tombol plus bulat.
- Fixed bottom summary (muncul jika ada produk):
  - Metode Pembayaran *
  - Diskon Khusus (jika berizin)
  - Grand Total
  - Tombol Preview
- Spacer bawah agar konten tidak tertutup.

**Riwayat Order**
- Mobile: kartu berisi Order ID (link invoice), sales, tanggal, badge status, badge pembayaran, nominal.
- Desktop: tabel `Tanggal`, `Order ID`, `Pelanggan`, `Nilai Transaksi`, `Sales`, `Status`, `Pembayaran`.
- Sortable kolom tanggal/ID/amount.
- Pagination.

**Preview Order (modal besar)**
- Judul "Preview Order".
- Untuk Sales:
  - Info pelanggan (ikon toko, nama, ID, alamat).
  - Metode Pembayaran * (select) + error.
  - Diskon Khusus (jika berizin).
  - Ringkasan order 3 kolom: Produk / Disc / Total.
  - Baris bonus.
- Untuk Admin:
  - Header perusahaan.
  - Info pelanggan, order ID, tanggal, metode pembayaran, jatuh tempo, sales, no surat jalan.
  - Tabel produk lengkap: Kode, Nama, Harga, Qty, Total, Disc %, Total + Disc.
- Total: Total Harga, Discount, Diskon Khusus, PPN, **Grand Total**, terbilang.
- Footer: **Batal**, **Submit** (Sales) atau **Submit & Cetak** (Admin).
- Disabled jika metode pembayaran belum dipilih.
- Setelah submit:
  - Sales → halaman sukses.
  - Admin → invoice print.

#### 8.4.5 Order Sukses

- Ikon centang hijau besar.
- Judul "Proses Selesai".
- Subteks "Pesanan Kamu Berhasil Dikirim".
- Tombol **Kembali ke Beranda**.

---

### 8.5 Order List, Detail, Edit, Invoice

#### 8.5.1 Order List

Route: `/dashboard/order`
Permission: `Order Admin`

- **Tabs**: Order (badge count), Surat Jalan (badge count), Return (badge count).
- Toolbar:
  - Search.
  - Multi-select Pelanggan, tanggal, Sales, Status.
  - Jika ada baris terpilih: dropdown **Action** → **Cetak** (invoice multi), **Konfirmasi** (bulk), **Hapus** (bulk).
  - Tombol **+ Buat Order**.
- Tabel:
  - Checkbox select-all.
  - `Order ID`, `Pelanggan` (nama + alamat), `Tanggal`, `Nilai Transaksi` (rata kanan), `Sales` (avatar), `Dibuat Oleh` (avatar + channel Sales/Sales Kantor), `Order Radius`, `Delivery`, `Status`, `Action`.
  - Radius: badge Onsite hijau / Offsite merah.
  - Delivery: badge Penuh hijau / Parsial abu.
  - Status badge sesuai tabel status.
  - Action dropdown:
    - **Konfirmasi** (jika pending)
    - **View Detail**
    - **View Invoice**
    - **Edit Order** (jika processing/pending)
    - **Edit Delivery** (jika pending/already/partial) → membuka dialog pengiriman
    - **Hapus** (jika pending/already)
- Pagination.

#### 8.5.2 Order Detail / Preview Invoice

Route: `/dashboard/order/detail/{order}`

- Header: back, tombol **Edit Delivery**, **Edit Order** (pending/processing), **Print**, **Konfirmasi** (pending).
- Metadata horizontal: foto order (jika ada), Sales (avatar), Order By (avatar), Order Radius, Delivery, Status Konfirmasi.
- Kartu invoice putih dengan area print:
  - Header perusahaan + label **INVOICE**.
  - Info pelanggan dan info invoice.
  - Tabel produk (Kode, Nama Barang, Harga, Quantity, Total, Disc %, Total + Disc).
  - Produk dengan kode sama digabung dengan `rowSpan`.
  - Ringkasan: Total Harga, Discount, Diskon Khusus (jika ada), PPN (jika > 0), Grand Total, terbilang.
  - Kolom tanda tangan: **Admin**, **Gudang**, **Driver/Helper**, **Customer**.
- Dialog konfirmasi order.
- Dialog Edit Pengiriman (qty dikirim/ditahan).

#### 8.5.3 Edit Order

- Mirip Buat Order desktop: pilih produk + ringkasan.
- Qty awal diisi dari item order yang bukan bonus.
- Tombol preview membuka dialog edit/save.
- Setelah simpan → kembali ke invoice.

#### 8.5.4 Invoice Single & Multi

- Single: `/dashboard/order/invoice?id=INV/...`
- Multi: `/dashboard/order/invoice?ids=id1,id2,...`
- Layout print **A5 landscape**, margin 6mm.
- Tanpa logo ABI; header invoice hanya memuat nama dan alamat perusahaan agar cocok untuk printer dot matrix.
- Multi invoice memiliki page break antar order.
- Tombol **Print** memakai `react-to-print`.
- Sales tidak melihat tombol print pada invoice single.

---

### 8.6 Surat Jalan (Delivery)

#### 8.6.1 Daftar Surat Jalan

Route: `/dashboard/order/delivery`

- Tabs Order / Surat Jalan / Return.
- Toolbar: search, tanggal, multi-select status, tombol **+ Buat Surat Jalan**.
- Tabel:
  - `#`
  - `No. Surat Jalan` (sortable)
  - `Dari Periode` (sortable)
  - `Akhir Periode` (sortable)
  - `Nilai Transaksi` (sortable, rata kanan)
  - `Produk` → tombol outline **Produk**
  - `File` → tombol outline **Preview**
  - `Status`
  - `Created By` (avatar)
  - `Action`
- Action:
  - **Konfirmasi** (hanya status pending) → halaman check
  - **View** → detail
  - **Hapus** (status ≠ success)
- Pagination.

#### 8.6.2 Buat Surat Jalan

Route: `/dashboard/order/delivery/create`

- Header back + **Preview** (disabled hingga lengkap).
- Form 4 kolom:
  - **Periode Pengiriman** * — date range, default hari ini s/d +14 hari, 2 bulan kalender.
  - **Driver** * — select + `+ Tambah Driver` (dialog nama driver).
  - **Armada** * — select + `+ Tambah Armada` (dialog nama armada).
  - **Gudang** * — select.
- Filter order:
  - Search, multi-select pelanggan, tanggal, sales, status.
  - Status yang tersedia: **Siap Dikirim**, **Ditahan**, **Selesai Parsial** (pending/processing/shipping/success dikecualikan).
- Tabel order:
  - Checkbox, `Order ID`, `Pelanggan` (nama + alamat), `Tanggal`, `Nilai Transaksi`, `Sales` (avatar), `Pesanan` (tombol **Detail** buka tab baru), `Status`.
- Preview button aktif jika minimal 1 order dipilih + driver + armada + gudang terisi.
- **Preview Surat Jalan** (modal lebar):
  - Ringkasan periode, driver, armada, gudang.
  - Tabel per pelanggan: Sales, Pelanggan, Order ID, Tanggal, Pesanan, Qty Dikirim, Qty Ditahan, Nilai Transaksi, Keterangan.
  - Submit → sukses → halaman invoice delivery.

#### 8.6.3 Detail Surat Jalan

Route: `/dashboard/order/delivery/detail/{delivery}`

- Header back.
- Jika ada baris dicentang: dropdown **Action** → **Cetak Invoice** (multi).
- Metadata: Delivery Order ID, Periode, Driver, Armada, Gudang.
- Tabel:
  - Checkbox, `Order ID`, `Pelanggan`, `Tanggal`, `Nilai Transaksi`, `Sales`, `Tunai`, `Transfer`, `Piutang`, `Status`, `Action`.
- Action per baris:
  - **Return** → modal return.
  - **Hapus** → hapus order dari delivery (jika lebih dari 1).
- Pagination.

#### 8.6.4 Konfirmasi Surat Jalan (Check)

Route: `/dashboard/order/delivery/check/{delivery}`

- Header back; dropdown Action Cetak Invoice; tombol **Submit** (jika status ≠ success).
- Metadata sama.
- Tabel sama, tetapi kolom **Tunai** dan **Transfer** berupa input angka sebelum submit.
  - Piutang dihitung otomatis: `total_amount - (cash + transfer)` minimal 0.
  - Input tidak boleh melebihi total (clamp).
- Baris dengan order `success` menampilkan nilai read-only.
- Action Return / Hapus.
- Dialog **Selesaikan Surat Jalan**:
  - "Apakah Anda yakin ingin selesaikan surat jalan ini?"
  - "Pastikan data sudah benar."
  - Tombol Kembali / Submit.
  - Toast: "Surat jalan berhasil diselesaikan 🎉".

#### 8.6.5 Invoice Delivery & Produk Delivery

**Invoice Delivery** (`/dashboard/order/delivery/invoice/{delivery}`)
- Header back + **Print**.
- Dokumen **DELIVERY ORDER**:
  - Header perusahaan.
  - Metadata delivery.
  - Tabel: Sales, Pelanggan, Order ID, Tanggal, Pesanan, Kirim, Tahan, Nilai, Keterangan.
  - Dikelompokkan per pelanggan.
- Print A5 landscape.

**Produk Delivery** (`/dashboard/order/delivery/product/{delivery}`)
- Header back.
- Metadata delivery.
- Ringkasan produk per pelanggan: Produk, Qty Total.
- Digunakan untuk cek muatan kendaraan.

#### 8.6.6 Return List

Route: `/dashboard/order/retur`

- Tabs Order / Surat Jalan / Return.
- Toolbar: search, tanggal, status.
- Tabel:
  - `#`, `Barang` (sortable), `Order ID` (sortable), `Pelanggan` (sortable), `Tanggal Return` (sortable), `Nilai Return` (sortable), `Return By`, `Keterangan`, `Status Barang`, `Action`.
- Keterangan berupa badge:
  - **Ganti Barang** biru.
  - **Potong Harga** merah.
- Status Barang:
  - `return` → **Stocked** biru.
  - `discard` → **Dihapus** merah.
  - `pending` → **Pending** kuning.
- Action hanya untuk pending: **Proses** / **Batalkan**.
- Dialog proses: "Apakah Anda yakin ingin proses return ini?" → Lanjutkan.
- Dialog batalkan/hapus.

**Modal Return** (dibuka dari detail delivery)
- Nama Barang * (combobox dari item delivery).
- Qty Return * — max qty_sent; helper "dari X unit".
- Nilai Return — otomatis dari harga setelah diskon × qty (read-only).
- Jenis Return * — Ganti Barang / Potong Harga.
- Kondisi Barang * — Bagus / Rusak.
- Keterangan * (textarea).
- Batal / Simpan.

---

### 8.7 Inventory / Stock

#### 8.7.1 Stock Aktif

Route: `/dashboard/inventory/stock`

- Tabs: **Stock Aktif**, **Riwayat**, **Opname**.
- Toolbar: search, multi-select status barang, tombol **+ Tambah Stock**.
- Tabel: `#`, `Kode Barang`, `Nama Barang`, `Stock Aktif` (rata kanan, angka + satuan).
- Pagination.

#### 8.7.2 Riwayat Stock

Route: `/dashboard/inventory/history`

- Toolbar: search, tanggal, **+ Tambah Stock**.
- Tabel: `#`, `ID`, `Tanggal`, `Gudang`, `Keterangan`, `Input by` (avatar), `Action`.
- Action: **Edit** → halaman edit stock, **Hapus**.
- Pagination.

#### 8.7.3 Tambah/Edit Stock

- Header back + **Submit** (dialog konfirmasi).
- Form: Gudang *, Tanggal *, Keterangan.
- Tabel barang dipilih: `#`, `Kode Barang`, `Nama Barang`, `Qty` (input number), `Satuan`, `Action` (hapus).
- Tombol **+ Tambah Barang** membuka command dialog pencarian produk; pilih produk → masuk daftar.
- Submit dialog: "Submit Data? Mohon Pastikan Data Sudah Benar" → Batal/Submit.
- Toast sukses.

#### 8.7.4 Opname

Route: `/dashboard/inventory/opname`

- Toolbar: search, tanggal, **+ Buat Opname**.
- Tabel: `#`, `Tanggal`, `Kode Opname`, `Nama Barang`, `Gudang`, `Keterangan`, `Quantity`, `Input by`, `Action`.
- Quantity berwarna: positif hijau `+10`, nol netral, negatif merah `-5`, diikuti satuan.
- Action Edit / Hapus.

**Modal Opname**
- Pilih Gudang * (combobox).
- Pilih Barang * (combobox).
- Quantity * (number + satuan); helper: "Input (+) jika ingin stock bertambah dan (-) untuk mengurangi stock".
- Tanggal *.
- Keterangan.
- Batal/Simpan.

---

### 8.8 Master Gudang

Route: `/dashboard/warehouse`

- Toolbar: search, **+ Tambah Gudang**.
- Tabel: `#`, `Kode Gudang`, `Nama Gudang` (sortable), `Alamat`, `Action`.
- Action: Edit / Hapus.
- Modal tambah/edit: Nama Gudang *, Alamat Lengkap * (textarea).
- Kode otomatis `ST-0001` (tidak diinput).

---

### 8.9 Master Barang

Route: `/dashboard/product`

- Toolbar: search, multi-select Status Barang (Aktif/Nonaktif), **+ Tambah Barang**.
- Tabel:
  - `#`, `Kode Barang`, `Nama Barang` (sortable), `Satuan`, `Harga Modal` (sortable), `Harga Jual (Dalam Kota)` (sortable), `Harga Jual (Luar Kota)` (sortable), `Status Barang`, `Action`.
- Status: badge **Aktif** hijau / **Nonaktif** abu.
- Action: Edit / Hapus.

**Modal Tambah/Edit**
- Status Barang * radio Aktif/Nonaktif.
- Kode Barang (opsional; otomatis `ABI-0001` bila kosong).
- Nama Barang *.
- Satuan * — select dengan `+ Tambah Satuan`.
- Harga Modal * (Rp).
- Harga Jual Dalam Kota * (Rp).
- Harga Jual Luar Kota * (Rp).
- Keterangan.
- Batal/Simpan.

**Modal Satuan**
- Nama satuan, simpan.

---

### 8.10 Keuangan

#### 8.10.1 Pendapatan Lainnya

Route: `/dashboard/finance/income`

- Toolbar: search, tanggal, multi-select Jenis Pendapatan, **Buat Transaksi Pendapatan**.
- Tabel:
  - `#`, `ID Transaksi` (sortable), `Tanggal` (sortable), `Nominal` (sortable), `Jenis Pendapatan`, `Keterangan`, `Bukti Pembayaran` (thumbnail/preview), `Input by` (avatar), `Action`.
- Action Edit / Hapus.
- Modal transaksi:
  - Jenis Pendapatan * (combobox).
  - Nominal * (number, Rp).
  - Tanggal *.
  - Bukti Pembayaran (file gambar jpg/png/webp; tampilkan dropzone/upload).
  - Keterangan.
- Modal edit menampilkan ID transaksi (read-only) dan data lama.

#### 8.10.2 Pengeluaran Lainnya

Route: `/dashboard/finance/expense`

- Struktur identik dengan Pendapatan, dengan label **Pengeluaran** dan **Jenis Pengeluaran**.

#### 8.10.3 Master Keuangan (Tipe)

Route: `/dashboard/finance/master/income` dan `/expense`

- Tabs: **Pendapatan** / **Pengeluaran**.
- Toolbar: search, **Tambah Jenis Pendapatan/Pengeluaran**.
- Tabel: `#`, `Kode Chart`, `Nama`, `Keterangan`, `Action`.
- Action Edit / Hapus.
- Modal: Nama * dan Keterangan.
- Kode otomatis `IC-0001` (income) / `OC-0001` (expense).

---

### 8.11 Piutang

Tabs utama: **Piutang Aktif**, **Penagihan**, **Lunas**, **Riwayat Pembayaran**.

#### 8.11.1 Piutang Aktif

Route: `/dashboard/piutang`

- Toolbar:
  - Search.
  - Dropdown **Jadwal / Semua**.
  - Tanggal (jika Jadwal).
  - Multi-select Pelanggan, Sales.
  - Kanan: **Total** piutang (input read-only dengan awalan Rp).
- Tabel:
  - `#`, `Order ID` (sortable), `Pelanggan` (sortable, nama + alamat), `Tanggal` (sortable), `Tempo` (sortable), `Nilai Utang` (sortable), `Terbayar` (sortable), `Sisa Utang` (sortable), `Sales` (avatar), `Pekan`, `Hari`, `Action`.
- Pekan badge: Genap biru / Ganjil kuning.
- Action: **View Invoice**.
- Pagination.

#### 8.11.2 Penagihan

Route: `/dashboard/piutang/penagihan`

- Toolbar: search, tanggal, Pelanggan, Sales, Status, **+ Buat Penagihan**.
- Tabel:
  - `#`, `Debt ID`, `Sales` (avatar), `Tanggal`, `Nilai Utang`, `Dibayar`, `Sisa Utang`, `Status`, `Action`.
- Status:
  - pending → **Belum Diproses** kuning.
  - processing → **Sedang Diproses** oranye.
  - success → **Selesai** hijau.
- Action: **Konfirmasi** → halaman confirm, **View** → preview print.
- Pagination.

#### 8.11.3 Buat Penagihan

Route: `/dashboard/piutang/penagihan/create`

- Header back + **Preview** (aktif jika ada piutang dipilih dan sales dipilih).
- Form:
  - **Pilih Sales** * (combobox).
  - **Tanggal Penagihan** * (date picker; default hari ini; format `yyyy/MM/dd`).
- Filter: search, Pelanggan, Pekan, Hari.
- Tabel:
  - Checkbox, `Order ID`, `Pelanggan`, `Pekan`, `Hari`, `Tanggal` (jatuh tempo), `Nilai Transaksi`, `Terbayar`, `Sisa Utang`, `Invoice` (tombol **Preview** buka invoice).
- Sortable kolom.
- Modal **Preview Surat Jalan Penagihan**:
  - Pilih sales + tanggal.
  - Ringkasan total transaksi dan total sisa utang.
  - Tabel per pelanggan: Pelanggan, Order ID, Tanggal Invoice, Delivery ID, Total Transaksi, Sisa Utang.
  - Submit → membuat debt dan diarahkan ke konfirmasi.

#### 8.11.4 Konfirmasi Penagihan

Route: `/dashboard/piutang/penagihan/confirm/{debt}`

- Header back + tombol **Konfirmasi**.
- Metadata: Collection ID, Tanggal Penagihan, Sales.
- Filter: search, Pelanggan, Status, tanggal.
- Tabel:
  - `#`, `Order` (Order ID), `Pelanggan`, `Tanggal`, `Nilai`, `Tunai` (input), `Transfer` (input), `Sisa Piutang` (otomatis), `Status`, `Action`.
- Input tunai/transfer dibatasi maksimum sisa piutang.
- Action: hapus item dari penagihan.
- Dialog **Selesaikan Penagihan**:
  - "Apakah Anda yakin ingin selesaikan penagihan ini?"
  - Submit → membuat pembayaran, update piutang, kembali ke daftar penagihan.
  - Toast: "Surat jalan berhasil diselesaikan 🎉".

#### 8.11.5 Preview Surat Jalan Penagihan

- Dokumen print dengan header perusahaan.
- Tabel: Pelanggan, Order ID, Tanggal Invoice, Delivery ID, Total Transaksi, Sisa Utang, Keterangan.
- Tombol Print.

#### 8.11.6 Piutang Lunas

Route: `/dashboard/piutang/lunas`

- Toolbar: search, tanggal, Pelanggan, Sales.
- Tabel: `#`, `Order ID`, `Pelanggan`, `Tanggal`, `Sales`, `Nilai Transaksi`, `Status` (badge **Lunas** hijau), `Invoice` (Preview).
- Pagination.

#### 8.11.7 Riwayat Pembayaran

Route: `/dashboard/piutang/payment`

- Toolbar: search, tanggal, Pelanggan.
- Tabel: `#`, `Tanggal`, `Order ID`, `Pelanggan`, `Nominal`, `Bukti Pembayaran` (preview atau tombol **Upload**), `Input By`.
- Jika belum ada bukti: tombol **Upload** membuka modal:
  - Bukti Pembayaran (file gambar).
  - Keterangan.
- Toast sukses upload.

---

### 8.12 Kelola Pengguna & Role

#### 8.12.1 Kelola Pengguna

Route: `/dashboard/users`

- Toolbar: search, **+ Tambah Pengguna**.
- Tabel: `#`, `Nama Pengguna`, `Username`, `Alamat Email`, `Role` (badge), `Action`.
- Action: Edit / Hapus.

**Modal Pengguna Baru**
- Nama, Username, Email, Kata sandi.
- **Pilih role** — grid 2 kolom checkbox role.
- Batal/Simpan; toast sukses.

**Modal Edit Pengguna**
- Sama, password opsional (kosongkan jika tidak diubah).

#### 8.12.2 Kelola Role

Route: `/dashboard/role`

- Toolbar: search, **+ Tambah Role**.
- Tabel: `#`, `Judul`, `Guard` (badge), `Anggota`, `Fitur`, `Action`.
- Action: Edit / Hapus (hapus hanya role Developer).
- Modal Role:
  - Judul.
  - **Pilih izin** — grid checkbox semua permission.
- Konfirmasi hapus role.

---

### 8.13 Pengaturan Akun

Route: `/settings/*`
Layout: heading "Pengaturan", sidebar kiri (Profil, Kata sandi, Otentikasi 2FA, Tampilan).

- **Profil**: nama, username, email; tombol Simpan; status "Berhasil disimpan".
- **Kata sandi**: kata sandi saat ini, kata sandi baru, konfirmasi.
- **2FA**: status aktif/nonaktif, tombol aktifkan, QR code, recovery codes, konfirmasi kode.
- **Tampilan**: pilihan Light / Dark / System dengan preview.

---

### 8.14 Modal Ekspor Laporan (Header)

- Trigger: tombol **Laporan** (ikon download) di header, tampil di semua halaman.
- Modal **Download Laporan Penjualan**:
  - Dari Tanggal, Sampai Tanggal (opsional).
  - Catatan: "Jika Tanggal Tidak Dipilih maka akan mengunduh data sepanjang waktu".
  - Sales * (combobox; default **Semua Sales**).
  - Customer * (combobox; disabled sampai sales dipilih; default **Semua Customer**).
  - Footer: Batalkan, **Download Laporan** (spinner).
- Toast sukses: "Laporan penjualan berhasil di download 🎉".
- Untuk prototype: tampilkan state loading lalu toast, tanpa file nyata.

---

## 9. Komponen dan Pattern UI yang Harus Konsisten

### 9.1 Shell

- `AppShell` sidebar: sidebar fixed navy, konten dengan padding dan `pb-20` di mobile untuk bottom nav.
- `AppSidebar`: logo, grup menu, collapse icon.
- `AppSidebarHeader`: trigger, breadcrumb, tombol Laporan, user menu.
- `MobileBottomNav`: fixed bottom, 4 item, active biru tebal.
- `Breadcrumbs`: teks kecil, halaman aktif tebal.

### 9.2 Toolbar pattern

```
[Search] [Filter chips/multiselect] [Date]        [Primary action]
```

- Search aktif saat Enter.
- Filter multi-select menampilkan chip/ringkasan.
- Tombol aksi utama selalu di kanan.
- Bulk action muncul hanya saat ada checkbox terpilih.

### 9.3 Tabel pattern

- Container `rounded-lg border overflow-hidden`.
- Header `bg-muted sticky top-0 z-10`.
- Kolom sortable menampilkan ikon `ArrowUpDown`; aktif hijau.
- Baris hover `bg-muted/50`.
- Nominal rata kanan.
- Aksi di dropdown `⋯` (`Ellipsis`).
- Pagination bawah dengan info "Menampilkan X–Y dari Z" dan tombol prev/next/nomor.
- Empty state: ikon folder search, judul "Data Tidak Ditemukan", deskripsi "Tidak ada data yang dapat ditampilkan saat ini. Coba ubah filter anda atau tambahkan data baru untuk memulai."

### 9.4 Dialog & form

- Header: judul + deskripsi.
- Body scroll `max-h-[70vh]`.
- Footer: Batal (outline) + Simpan/Submit (primary).
- Toast Sonner di kanan bawah.
- Error field merah di bawah input.
- Loading spinner di tombol.
- Dialog konfirmasi: judul pertanyaan, deskripsi "Pastikan data sudah benar", tombol Batal/Kembali + aksi.

### 9.5 Komponen khusus

| Komponen | Kegunaan |
|---|---|
| `ComboboxInput` | Pencarian + pilih satu item (produk, sales, customer, gudang, jenis). |
| `MultiSelect` | Filter multi-nilai dengan chip. |
| `NumberInput` | Input angka dengan format ribuan Indonesia. |
| `LocationPicker` | Peta Leaflet + marker + koordinat. |
| `ImagePreview` | Thumbnail bukti pembayaran / foto order. |
| `CustomDiscountInput` | Input persen diskon khusus + validasi izin. |
| `DataTablePagination` | Pagination tabel. |
| `Empty` | Empty state. |
| `Badge` | Status dan label. |
| `Calendar` | Date picker single/range dengan dropdown bulan/tahun. |
| `ScrollArea` | Modal panjang. |
| `Spinner` | Loading di tombol. |
| `Toaster` | Notifikasi sukses. |

---

## 10. Model Data & Bentuk Data untuk Mock

### 10.1 Entitas inti

| Entitas | Field penting |
|---|---|
| User | `id`, `user_id` (`U-0001`), `username`, `name`, `email`, `avatar`, `phone_number`, `roles` |
| Customer | `id`, `customer_id` (`C-0001`), `name`, `address`, `lat`, `lng`, `channel`, `week`, `day`, `price_type` (`in`/`out`), `phone`, `description`, `sales_id`, `last_order_dates[]` |
| Product | `id`, `product_id` (`ABI-0001`), `name`, `unit`, `cost`, `in_sale`, `out_sale`, `description`, `status`, `stock_total` |
| Warehouse | `id`, `warehouse_id` (`ST-0001`), `name`, `address` |
| CustomerChannel | `id`, `name` |
| ProductUnit | `id`, `name` |
| Discount | `id`, `discount_id` (`PR/YYYY/MM/0001`), `name`, `min_amount`, `early_period`, `final_period`, `bonus_type` (`price`/`product`), `discount_price`, `multiple`, `bonus_amount`, `bonus_product_id`, `product_id` |
| Order | `id`, `order_id` (`INV/YYYY/MM/0001`), `delivery` (`full`/`partial`), `radius` (`onsite`/`offsite`), `status`, `payment` (`unpaid`/`partial`/`paid`), `payment_method`, `sub_amount`, `disc_amount`, `tax_amount`, `total_amount`, `short_amount`, `ppn`, `custom_discount`, `original_amount`, `image`, `customer`, `sales`, `order_by`, `items[]`, `schedule_date`, `due_date` |
| ProductOrder | `id`, `order_id`, `product_id`, `product_code`, `name`, `unit`, `cost`, `price`, `disc_percent`, `disc_amount`, `qty_total`, `qty_sent`, `qty_hold`, `qty_success`, `total_amount`, `short_amount` |
| Delivery | `id`, `delivery_id` (`DO/YYYY/MM/0001`), `status`, `driver`, `car`, `warehouse`, `start_date`, `end_date`, `total_amount`, `orders[]`, `order_by` |
| DeliveryOrder | `id`, `order_id`, `delivery_id`, `driver`, `car`, `price_type`, `custom_discount`, `original_amount`, `total_amount`, `total_cash`, `total_transfer`, `total_receivable`, `order`, `items[]` |
| DeliveryItem | `id`, `delivery_order_id`, `product_order_id`, `product_id`, `name`, `unit`, `cost`, `price`, `disc_percent`, `disc_amount`, `qty_total`, `qty_sent`, `qty_hold`, `total_amount` |
| ReturnOrder | `id`, `return_id` (`RTN/YYYY/MM/0001`), `order_id`, `name`, `qty`, `price`, `type` (`change`/`cut`), `condition` (`good`/`bad`), `action` (`return`/`discard`), `status` (`pending`/`return`/`discard`), `description`, `product`, `customer`, `user` |
| Piutang | `id`, `order_code`, `delivery_code`, `invoice_date`, `schedule_date`, `due_date`, `total_amount`, `total_transfer`, `total_cash`, `total_unpaid`, `sales`, `customer`, `order` |
| Debt | `id`, `debt_id` (`CL/YYYY/MM/0001`), `debt_date`, `sales`, `orders[]` |
| DebtOrder | `id`, `status` (`pending`/`processing`/`success`), `total_unpaid`, `total_transfer`, `total_cash`, `total_amount`, `start_date`, `end_date`, `order_id`, `piutang`, `customer` |
| DebtPayment | `id`, `proof_payment`, `order_id`, `total_amount`, `description`, `payment_at`, `customer`, `user` |
| Inventory | `id`, `inventory_id` (`AS/YYYY/MM/0001`), `description`, `inventory_date`, `warehouse`, `user`, `products[]` |
| InventoryOpname | `id`, `opname_id` (`OP/YYYY/MM/0001`), `qty`, `description`, `opname_date`, `warehouse`, `product`, `user` |
| OtherIncome | `id`, `income_id` (`IC/YYYY/MM/0001`), `amount`, `income_date`, `proof_payment`, `description`, `type`, `user` |
| OtherExpense | `id`, `expense_id` (`OC/YYYY/MM/0001`), `amount`, `expense_date`, `proof_payment`, `description`, `type`, `user` |
| TypeIncome / TypeExpense | `id`, `type_id` (`IC-0001`/`OC-0001`), `name`, `description`, `status` |
| Role / Permission | `id`, `name`, `guard_name`, relasi permissions/users |

### 10.2 Contoh data dummy yang disarankan

```json
{
  "user": {
    "id": "01JUSER000000000000000001",
    "user_id": "U-0001",
    "name": "Fahri",
    "username": "fahri",
    "email": "fahri@abimineral.com",
    "roles": ["Sales"]
  },
  "customer": {
    "id": "01JCUST000000000000000001",
    "customer_id": "C-0001",
    "name": "Toko Sumber Rejeki",
    "address": "Jl. Merdeka No. 12, Kersik Putih",
    "channel": "Grosir",
    "week": "Genap",
    "day": "Senin",
    "price_type": "in",
    "phone": "081234567890",
    "sales": { "name": "Fahri", "avatar": null },
    "last_order_dates": ["2026-10-19T09:00:00Z"]
  },
  "product": {
    "id": "01JPROD000000000000000001",
    "product_id": "ABI-0001",
    "name": "Kapur Aji 1 Kg",
    "unit": "Krt",
    "cost": 18000,
    "in_sale": 24000,
    "out_sale": 25500,
    "stock_total": 120,
    "status": true
  },
  "discount": {
    "discount_id": "PR/2026/10/0001",
    "name": "Promo Grosir Oktober",
    "product": { "name": "Kapur Aji 1 Kg", "id": "01JPROD000000000000000001" },
    "min_amount": 24,
    "early_period": "2026-10-01",
    "final_period": "2026-10-31",
    "bonus_type": "price",
    "discount_price": 5,
    "multiple": false,
    "bonus_amount": 0,
    "bonus": null
  },
  "order": {
    "order_id": "INV/2026/10/0042",
    "status": "already",
    "payment": "unpaid",
    "delivery": "full",
    "radius": "onsite",
    "sub_amount": 1200000,
    "disc_amount": 60000,
    "tax_amount": 0,
    "total_amount": 1140000,
    "schedule_date": "2026-10-26",
    "customer": { "name": "Toko Sumber Rejeki" },
    "sales": { "name": "Fahri" },
    "order_by": { "name": "Admin" },
    "items": [
      {
        "product_code": "ABI-0001",
        "name": "Kapur Aji 1 Kg",
        "unit": "Krt",
        "price": 24000,
        "qty_total": 50,
        "disc_percent": 5,
        "total_amount": 1140000
      }
    ]
  }
}
```

### 10.3 Format ID otomatis

| Dokumen | Format |
|---|---|
| Customer | `C-0001` |
| User | `U-0001` |
| Produk | `ABI-0001` |
| Gudang | `ST-0001` |
| Order / Invoice | `INV/2026/10/0001` |
| Surat Jalan | `DO/2026/10/0001` |
| Promo | `PR/2026/10/0001` |
| Stock masuk | `AS/2026/10/0001` |
| Opname | `OP/2026/10/0001` |
| Pendapatan lain | `IC/2026/10/0001` |
| Pengeluaran lain | `OC/2026/10/0001` |
| Penagihan | `CL/2026/10/0001` |
| Return | `RTN/2026/10/0001` |
| Tipe pendapatan | `IC-0001` |
| Tipe pengeluaran | `OC-0001` |

---

## 11. Status, Label, dan Warna Badge

| Domain | Value | Label UI | Warna |
|---|---|---|---|
| Order | `pending` | Belum Diproses | Kuning |
| Order | `processing` | Sedang Diproses | Oranye |
| Order | `already` | Siap Dikirim | Biru |
| Order | `holding` | Ditahan | Cyan |
| Order | `shipping` | Dikirim | Amber |
| Order | `success` | Selesai | Hijau |
| Order | `partial` | Selesai Parsial | Hijau |
| Order | `failed` | Gagal | Merah |
| Order | `cancel` | Dibatalkan | Merah |
| Payment | `unpaid` | Belum Lunas | Kuning |
| Payment | `partial` | Lunas Partial | Hijau |
| Payment | `paid` | Lunas | Hijau |
| Delivery | `pending` | Belum Diproses | Kuning |
| Delivery | `processing` | Sedang Diproses | Oranye |
| Delivery | `shipping` | Dikirim | Amber |
| Delivery | `success` | Selesai | Hijau |
| Delivery | `cancel` | Dibatalkan | Merah |
| Delivery type | `full` | Penuh | Hijau |
| Delivery type | `partial` | Parsial | Abu |
| Radius | `onsite` | Onsite | Hijau |
| Radius | `offsite` | Offsite | Merah |
| Return type | `change` | Ganti Barang | Biru |
| Return type | `cut` | Potong Harga | Merah |
| Return status | `pending` | Pending | Kuning |
| Return status | `return` | Stocked | Biru |
| Return status | `discard` | Dihapus | Merah |
| Debt order | `pending` | Belum Diproses | Kuning |
| Debt order | `processing` | Sedang Diproses | Oranye |
| Debt order | `success` | Selesai | Hijau |
| Pekan | `Genap` | Genap | Biru |
| Pekan | `Ganjil` | Ganjil | Kuning |
| Produk | `status=true` | Aktif | Hijau |
| Produk | `status=false` | Nonaktif | Abu |

---

## 12. Template Cetak

Semua template memakai:
- `@page { size: A5 landscape; margin: 8mm; }`
- Warna teks hitam.
- Header/footer/nav/sidebar disembunyikan.
- Border tabel tipis (primary).
- Font ukuran 9–10pt.

### 12.1 Invoice

- Header kiri: nama perusahaan + alamat. Kanan: **INVOICE**.
- Grid 5 kolom:
  - Kiri 3 kolom: Kode Pelanggan, Nama Pelanggan, Alamat, No. Telepon, Order ID.
  - Kanan 2 kolom: Tanggal Invoice, Metode Pembayaran, Tanggal Jatuh Tempo (jika bukan Tunai), Sales, No. Surat Jalan.
- Tabel: Kode, Nama Barang, Harga, Quantity, Total, Disc (%), Total + Disc.
- Ringkasan: Total Harga, Discount, Diskon Khusus, PPN, Grand Total, terbilang.
- Tanda tangan: Admin, Gudang, Driver/Helper, Customer (4 kolom).
- Multi invoice: satu halaman per order dengan page break.

### 12.2 Surat Jalan (Delivery Order)

- Header kiri: perusahaan + alamat. Kanan: **DELIVERY ORDER**.
- Metadata: Delivery Order ID, Periode Pengiriman, Driver, Armada, Gudang.
- Tabel: Sales, Pelanggan, Order ID, Tanggal, Pesanan, Kirim, Tahan, Nilai, Keterangan.
- Dikelompokkan per pelanggan/order.
- Halaman produk delivery: ringkasan Produk + Qty Total per pelanggan.

### 12.3 Surat Jalan Penagihan

- Header perusahaan.
- Metadata collection ID, tanggal, sales.
- Tabel: Pelanggan, Order ID, Tanggal Invoice, Delivery ID, Total Transaksi, Sisa Utang, Keterangan.
- Tombol Print di halaman preview.

---

## 13. Responsive, State, dan Aksesibilitas

### 13.1 Breakpoint perilaku

- **< 768px (mobile)**
  - Sidebar diganti bottom navigation sesuai role, maksimal 5 item.
  - Sales memakai 4 item; role lain memakai 5 item dengan **Akun** di posisi terakhir.
  - Tabel lebar dapat di-scroll horizontal atau diganti kartu (khusus alur Sales).
  - Alur order Sales memakai kartu produk dan fixed bottom summary.
  - Toolbar filter membungkus.
  - Tombol aksi utama dapat menjadi ikon.
- **768–1024px**
  - Sidebar dapat collapse.
  - Grid dashboard 2 kolom.
- **≥ 1024px**
  - Sidebar penuh.
  - Tabel penuh dengan semua kolom.
  - Grid dashboard 2 kolom, kartu ringkasan 5 kolom.

### 13.2 State wajib di prototype

- Default, hover, focus, active, disabled.
- Search kosong vs terisi.
- Filter aktif (chip).
- Tabel kosong (empty state).
- Modal terbuka, form valid, form error.
- Loading tombol (spinner) dan loading halaman (skeleton opsional).
- Toast sukses.
- Dialog konfirmasi destruktif.
- Selected rows + bulk action.
- Status badge semua varian.
- Print preview.

### 13.3 Aksesibilitas

- Semua input memiliki label.
- Tombol ikon memiliki `aria-label`/tooltip.
- Kontras teks minimal WCAG AA.
- Fokus terlihat pada elemen interaktif.
- Dialog memiliki judul dan deskripsi.
- Jangan hanya mengandalkan warna untuk status; sertakan teks label.

---

## 14. Catatan Keanehan / Quirk Aplikasi Asli

Bagian ini penting agar prototype tidak "memperbaiki" hal yang justru menjadi ciri aplikasi, atau agar tim sadar jika ingin merapikannya.

1. **Custom discount: urutan perhitungan berbeda**
   - Preview frontend menghitung diskon khusus sebelum PPN.
   - Backend menerapkan diskon khusus setelah grand total (termasuk PPN).
   - Untuk prototype, tampilkan sesuai UI saat ini (diskon khusus sebelum PPN) dan beri catatan ke tim produk.

2. **Beberapa label copy-paste di modul keuangan**
   - Dialog edit pengeluaran memakai label "Jenis Pendapatan" dan "ID Transaksi".
   - Dialog tipe pengeluaran memakai judul "Tambah Jenis Pendapatan".
   - Prototype dapat meniru atau memperbaiki; sebaiknya diperbaiki agar konsisten.

3. **Judul halaman Stock Create/Edit**
   - `Head title` pada halaman tambah/edit stock tertulis "Master Pelanggan".
   - Sebaiknya diperbaiki menjadi "Tambah Stock"/"Edit Stock".

4. **Badge pekan pada halaman order Sales**
   - Halaman sales-order menampilkan teks "Pekan Genap" secara hardcoded, bukan dari data pelanggan.

5. **Indikator "sudah order"**
   - Logika `hasOrderOnDate` di aplikasi asli membandingkan format tanggal yang bisa tidak konsisten.
   - Prototype sebaiknya memakai perbandingan tanggal yang robust.

6. **Status penagihan di tabel**
   - Status yang ditampilkan mengambil status order pertama (`orders[0].status`), bukan agregat seluruh order dalam debt.

7. **Hapus order**
   - Hanya status `pending` dan `already` yang boleh dihapus.
   - Bulk delete juga menolak jika ada item berstatus lain.

8. **Global search**
   - Tombol search ada di header alternatif, tetapi tidak ada halaman/fungsi pencarian global di aplikasi utama (sidebar layout tidak menampilkan search).

9. **Laporan bukan halaman**
   - Tidak ada halaman report; ekspor berupa modal di header dan file Excel.

10. **Login memakai username**
    - Bukan email. Pastikan prototype menampilkan field username, bukan email.

11. **Sales tidak melihat tombol print invoice**
    - Namun tetap bisa membuka preview invoice.
    - Halaman sukses order hanya untuk Sales.

12. **Promo terbaik**
    - Hanya satu promo harga dan satu promo bonus per produk yang dipakai, dipilih berdasarkan `min_amount` terbesar yang terpenuhi.
    - Promo bonus dengan `multiple=true` dikalikan `floor(qty / min_amount)`.

13. **PPN**
    - Default 0% (`config('ppn')`), jadi sering tidak muncul. Prototype sebaiknya sediakan contoh PPN 11% untuk memperlihatkan state.

14. **Foto order**
    - Disimpan sebagai base64 di sessionStorage lalu diunggah; preview foto ada di detail order.
    - Untuk prototype, cukup gunakan placeholder image.

15. **Peta pelanggan**
    - Koordinat diambil dari geolocation browser; default `-6.2, 106.81` (Jakarta) jika gagal.
    - Prototype bisa menampilkan peta statis dengan marker.

---

## 15. Rencana Pembuatan Prototype

### 15.1 Urutan pengerjaan yang disarankan

**Fase 1 — Shell & Design System**
1. Layout desktop: sidebar navy, header, breadcrumb, content.
2. Layout mobile: bottom navigation, header ringkas.
3. Token warna, tipografi, tombol, badge, card, input, tabel, dialog, toast.
4. Role switcher di header/prototype toolbar.

**Fase 2 — Halaman pipeline utama**
1. Login (demo role).
2. Dashboard.
3. Pilih pelanggan (admin + sales mobile).
4. Buat order + preview modal + sukses.
5. Order list + detail/invoice.
6. Surat jalan list + create + check + invoice.
7. Return list + modal + proses.

**Fase 3 — Master & operasional**
1. Master Pelanggan + modal + channel.
2. Master Promo + modal.
3. Master Barang + modal + satuan.
4. Master Gudang.
5. Stock aktif/riwayat/opname.
6. Master Keuangan + pendapatan/pengeluaran.
7. Piutang + penagihan + lunas + riwayat pembayaran.
8. Pengguna + role.
9. Pengaturan akun.
10. Modal ekspor laporan.

**Fase 4 — Polish**
1. Empty/loading/error states.
2. Print preview.
3. Konsistensi responsive.
4. Micro-interaction: toast, hover, selected, bulk action.
5. Review bersama stakeholder.

### 15.2 Prioritas layar untuk demo 10 menit

1. Login sebagai Sales.
2. Dashboard versi Sales.
3. Order mobile: pilih pelanggan → produk → preview → sukses.
4. Switch ke Admin.
5. Dashboard penuh.
6. Order list → detail → invoice print.
7. Buat surat jalan → preview → invoice delivery.
8. Konfirmasi surat jalan → input tunai/transfer → selesai.
9. Piutang → buat penagihan → konfirmasi → pembayaran.
10. Return → proses.
11. Stock opname.
12. Laporan ekspor.

### 15.3 Route map prototype yang disarankan

| Prototype route | Layar |
|---|---|
| `/login` | Login |
| `/dashboard` | Dashboard (role-aware) |
| `/customers` | Master Pelanggan |
| `/promos` | Master Promo |
| `/orders/select-customer` | Pilih Pelanggan (Admin) |
| `/orders/select-customer-mobile` | Pilih Pelanggan (Sales) |
| `/orders/create/:customerId` | Buat Order (desktop/mobile switch) |
| `/orders/create/:customerId/preview` | Modal preview |
| `/orders/success` | Sukses |
| `/orders` | Order List |
| `/orders/:id` | Order Detail / Invoice |
| `/orders/:id/invoice` | Invoice print preview |
| `/deliveries` | Surat Jalan List |
| `/deliveries/create` | Buat Surat Jalan |
| `/deliveries/:id/check` | Konfirmasi Surat Jalan |
| `/deliveries/:id` | Detail Surat Jalan |
| `/deliveries/:id/invoice` | Invoice Delivery |
| `/returns` | Return List |
| `/inventory/stock` | Stock Aktif |
| `/inventory/history` | Riwayat Stock |
| `/inventory/opname` | Opname |
| `/warehouses` | Master Gudang |
| `/products` | Master Barang |
| `/finance/income` | Pendapatan Lainnya |
| `/finance/expense` | Pengeluaran Lainnya |
| `/finance/master` | Master Keuangan |
| `/receivables` | Piutang Aktif |
| `/collections` | Penagihan |
| `/collections/create` | Buat Penagihan |
| `/collections/:id/confirm` | Konfirmasi Penagihan |
| `/receivables/paid` | Lunas |
| `/receivables/payments` | Riwayat Pembayaran |
| `/users` | Kelola Pengguna |
| `/roles` | Kelola Role |
| `/settings/profile` | Profil |
| `/settings/password` | Kata sandi |
| `/settings/two-factor` | 2FA |
| `/settings/appearance` | Tampilan |

### 15.4 Skenario interaksi yang perlu didemokan

- Mengubah filter tabel → data/tabel berubah (mock).
- Mengetik search lalu Enter → chip/hasil berubah.
- Memilih beberapa baris → muncul bulk action.
- Membuka dropdown aksi baris.
- Membuka modal tambah/edit → submit → toast sukses → data mock bertambah.
- Membuka dialog hapus → konfirmasi → toast → data hilang.
- Menambah produk ke cart, mengubah qty, melihat total berubah.
- Memilih metode pembayaran; tombol Preview disabled jika belum dipilih.
- Mengisi diskon khusus; total berubah dan baris diskon khusus muncul.
- Mencetak invoice (tampilan print preview).
- Switch role Sales ↔ Admin; menu dan alur order berubah.

---

## 16. Checklist Acceptance Prototype

- [ ] Semua menu sidebar sesuai permission dan role.
- [ ] Sidebar dapat collapse dan tetap nyaman di desktop.
- [ ] Bottom navigation muncul di mobile dan menandai halaman aktif.
- [ ] Breadcrumb sesuai halaman.
- [ ] Semua tabel memiliki header, sort indicator, hover row, empty state, dan pagination.
- [ ] Semua form CRUD memakai dialog dengan footer Batal/Simpan dan spinner.
- [ ] Semua status memakai label dan warna yang konsisten.
- [ ] Format Rupiah, angka, tanggal, dan terbilang benar.
- [ ] Dashboard menampilkan 5 kartu untuk Admin dan 2 kartu untuk Sales.
- [ ] Chart, rekap harian, informasi lainnya, dan informasi stok tampil.
- [ ] Alur order desktop dan mobile Sales dapat didemokan end-to-end.
- [ ] Preview order menghitung total, diskon, PPN, dan grand total.
- [ ] Invoice, surat jalan, dan surat jalan penagihan dapat dipreview dan dicetak.
- [ ] Halaman konfirmasi surat jalan memiliki input tunai/transfer dan perhitungan piutang.
- [ ] Halaman konfirmasi penagihan memiliki input tunai/transfer dan perhitungan sisa.
- [ ] Return memiliki jenis, kondisi, status, dan aksi proses/batal.
- [ ] Stock aktif, riwayat, dan opname saling terhubung secara navigasi.
- [ ] Modul keuangan dan master tipe konsisten.
- [ ] Piutang memiliki 4 tab dan alur pembayaran.
- [ ] Pengguna dan role dapat dikelola; hapus role hanya untuk Developer.
- [ ] Pengaturan profil, password, 2FA, dan tampilan tersedia.
- [ ] Modal ekspor laporan memiliki filter dan state loading.
- [ ] Semua toast, dialog konfirmasi, disabled, hover, dan focus state konsisten.
- [ ] Tampilan print A5 landscape bersih tanpa sidebar/header.
- [ ] Tidak ada teks Lorem Ipsum; gunakan data dummy Indonesia yang realistis.

---

## 17. Referensi Implementasi (untuk fidelity)

| Kebutuhan | File sumber |
|---|---|
| Navigasi sidebar | `resources/js/components/app-sidebar.tsx` |
| Bottom nav mobile | `resources/js/components/mobile-bottom-nav.tsx` |
| Header & ekspor | `resources/js/components/app-sidebar-header.tsx`, `app-export.tsx` |
| Layout aplikasi | `resources/js/layouts/app/app-sidebar-layout.tsx` |
| Design token | `resources/css/app.css` |
| Tipe data frontend | `resources/js/types/index.d.ts` |
| Format angka/tanggal | `resources/js/lib/utils.ts` |
| Dashboard | `resources/js/pages/dashboard/*` |
| Pelanggan | `resources/js/pages/customers/*` |
| Promo | `resources/js/pages/discounts/*` |
| Order | `resources/js/pages/orders/order*.tsx`, `components/order-*.tsx` |
| Delivery | `resources/js/pages/orders/delivery*.tsx` |
| Return | `resources/js/pages/orders/retur.tsx`, `components/retur-*.tsx` |
| Stock | `resources/js/pages/inventories/*` |
| Keuangan | `resources/js/pages/finances/*` |
| Piutang | `resources/js/pages/piutang/*` |
| Pengguna/Role | `resources/js/pages/users/*` |
| Pengaturan | `resources/js/pages/settings/*` |
| Auth | `resources/js/pages/auth/*` |
| Route & permission | `routes/*.php` |
| Aturan bisnis order | `app/Http/Controllers/Orders/OrderController.php` |
| Aturan delivery | `app/Http/Controllers/Orders/DeliveryController.php` |
| Aturan piutang | `app/Http/Controllers/Debt/*.php` |
| Aturan return | `app/Http/Controllers/Orders/ReturController.php` |
| Aturan stok | `app/Http/Controllers/Inventories/*.php` |
| Permission seeder | `database/seeders/PermissionSeeder.php` |

---

## 18. Design Canvas (katalog seluruh layar)

Prototype ini adalah SPA satu file, sehingga halaman, sub-tab, dan popup tidak
muncul sebagai file HTML terpisah. Untuk inspeksi desain, seluruh state SPA
didaftarkan di `canvas-screens.json` dan dirender sebagai:

```text
index.html?canvas=<id>
```

Alur kerjanya:

1. `node canvas/build.mjs` membaca `canvas-screens.json` dan menambahkan virtual
   screen ke `screens.json` berdasarkan modul.
2. Buka `http://localhost:8123/canvas/` untuk melihat katalog.
3. Setiap frame dimuat saat diklik, dipilih dari menu **Jump**, atau lewat
   tombol **Muat Semua**. Placeholder menampilkan nama layar.
4. Saat `?canvas=` aktif, aplikasi berjalan **read-only**: `persist()` dan
   `saveStore()` tidak menulis ke localStorage. Jika data transaksi kosong,
   data dummy dibuat di memori agar layar detail dan popup tetap terisi.
5. `state` di manifest mengatur tab, dan `setup` membuka halaman detail, modal,
   preview, atau action menu yang sesuai.

Cakupan saat ini: 107 layar virtual (halaman, sub-tab, form, detail, preview,
dan popup) di grup Penjualan, Logistik, Pembelian, Keuangan, Pengguna, dan Auth.

---

### Penutup

Dokumen ini cukup untuk membangun prototype UI yang merepresentasikan seluruh modul ABI Mineral App. Fokuskan prototype pada **alur order → delivery → piutang → return** karena itu adalah inti nilai produk, lalu lengkapi master data dan keuangan. Pertahankan konsistensi visual dan status badge agar prototype terasa seperti aplikasi nyata, bukan sekadar kumpulan layar.
