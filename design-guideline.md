# ABI Mineral — Design Guideline

Versi: 1.0  
Tanggal: 17 November 2026  
Berlaku untuk: prototype ABI Mineral System (HTML + Alpine.js + Tailwind + localStorage)

Dokumen ini adalah acuan UI/UX untuk modul yang sudah ada dan modul baru (Purchasing, Finance, Logistik, dan seterusnya). Tujuannya agar pola halaman, tabel, form, status, dan interaksi tetap konsisten tanpa harus menebak ulang.

---

## 1. Prinsip

1. **Satu pola untuk satu tujuan.** Form pendek memakai modal; transaksi panjang memakai halaman penuh; konfirmasi memakai dialog.
2. **Angka harus mudah dibaca.** Semua nilai uang dan qty rata kanan, memakai `tabular-nums` dan format Indonesia.
3. **Status selalu punya teks.** Jangan hanya mengandalkan warna; gunakan badge dengan label.
4. **Aksi destruktif selalu dikonfirmasi.** Hapus, reset, void, dan pembatalan memakai dialog konfirmasi.
5. **Master data dan transaksi dipisahkan.** Master tidak ikut terhapus saat “Hapus Transaksi”.
6. **Semua perubahan persisten.** Setiap mutasi memanggil `persist()`; skema data memakai versi dan migrasi.
7. **Konsisten dengan shell.** Sidebar compact, top bar hanya path/judul, dan konten halaman tidak mengulang judul atau deskripsi singkat.

---

## 2. Stack dan struktur

| Area | Teknologi |
|---|---|
| Markup | HTML statis (`index.html`, `flow.html`) |
| Interaksi | Alpine.js 3 |
| Styling | Tailwind 3 + `assets/app.css` |
| Data | `localStorage` (`abi-mineral-demo`), skema berversi |
| Format | `Intl.NumberFormat('id-ID')` |

Struktur data di `assets/app.js`:

```text
seedData()        → data awal & master
DOMAIN_KEYS       → daftar data yang dipersist
STORE_VERSION     → versi skema + migrasi
app()             → state, getter, method UI
runConfirm()      → aksi konfirmasi
clearTransactions() → hapus transaksi, master tetap
seedDefaults()    → reset seluruh data
```

---

## 3. Design token

Token warna didefinisikan di `assets/app.css`:

```css
--navy: #0f172b;
--accent: #1d4ed8;
--border: #e2e8f0;
--muted: #f1f5f9;
--muted-text: #64748b;
--green: #16a34a;
--red: #dc2626;
--amber: #d97706;
```

| Fungsi | Token/class |
|---|---|
| Surface | `bg-white`, `.card` |
| Surface muted | `bg-slate-50` |
| Text | `text-slate-900` |
| Text muted | `text-slate-400` / `text-slate-500` |
| Border | `border-slate-200` |
| Primary action | `.btn-primary` (navy) |
| Success | `badge-green`, `text-emerald-600` |
| Warning | `badge-yellow`, `text-amber-600` |
| Danger | `badge-red`, `text-red-600` |
| Info | `badge-blue`, `text-blue-600` |

**Font:** Instrument Sans 400/500/600/700, self-hosted.

**Density:** compact. Sidebar 224px (collapsed 64px), nav item 34px, header 56px.

---

## 4. App shell

### Sidebar
- Desktop: 224px; collapsed 64px; mobile: drawer.
- Logo area 56px.
- Grup menu: Penjualan, Logistik, Pembelian, Keuangan, Pengguna.
- Item menu: ikon 17px, font 13px, tinggi 34px, jarak antar item 2px.
- Label grup: 9px uppercase.

### Top bar
- Tinggi 56px.
- **Hanya menampilkan path halaman**, contoh:
  - `Dashboard`
  - `Order / Pilih Pelanggan`
  - `Pembelian / Purchase Request / Buat`
- Tidak menampilkan badge Prototype atau indikator simpan.
- Kanan: role selector, tombol Laporan, user menu.
- Label dropdown role: **ROLE** (bukan DEMO).
- User menu: role switcher, Akun Saya, Alur Operasional, Export/Import, Hapus Transaksi, Reset, Keluar.

### Mobile
- Bottom nav 4 item: Beranda, Order, Pelanggan, Akun.
- Tabel boleh horizontal scroll.

---

## 5. Page header

Judul halaman hanya ditampilkan di **top bar**. Konten halaman tidak mengulang judul atau deskripsi singkat.

Pola toolbar halaman list:

```html
<div class="flex flex-wrap items-center justify-end gap-2 mb-4">
  <button class="btn btn-primary">Aksi utama</button>
</div>
```

Pola halaman detail/transaksi:

```html
<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
  <div class="flex items-center gap-2">
    <button class="icon-btn"><svg class="icon"><use href="#i-chevron-left"></use></svg></button>
    <span class="badge badge-slate">KODE-DOKUMEN</span>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <button class="btn btn-outline btn-sm">Aksi sekunder</button>
    <button class="btn btn-primary btn-sm">Aksi utama</button>
  </div>
</div>
```

Aturan:
- Jangan memakai `.page-title` atau `.page-sub` di dalam konten halaman.
- Top bar adalah satu-satunya sumber judul halaman.
- Tidak ada deskripsi singkat di bawah judul.
- Aksi utama di kanan; tombol kembali di kiri.
- Kode dokumen boleh tampil sebagai badge konteks di samping tombol kembali.
- Halaman tanpa aksi tidak perlu toolbar kosong.
- Jika halaman memiliki tab, aksi utama harus sejajar dengan baris tab: tab di kiri, tombol di kanan. Jangan menumpuk toolbar aksi di atas baris tab.
- Jika halaman tidak memiliki tab tetapi memiliki search/filter, aksi utama harus sejajar dengan baris search/filter: pencarian dan filter di kiri, tombol di kanan. Jangan membuat baris toolbar terpisah di atasnya.
- Jika halaman tidak memiliki tab maupun search/filter, toolbar aksi boleh berdiri sendiri di kanan atas.
- Semua tombol simpan/submit pada halaman input non-popup wajib memunculkan konfirmasi **Pastikan data sudah benar** dengan tombol **Kembali** dan tombol aksi (`Simpan`, `Submit`, atau `Posting`).
- Form di dalam modal tidak memakai konfirmasi tambahan.

```html
<div class="flex flex-wrap items-center justify-between gap-2 mb-4">
  <div class="seg">
    <button class="seg-btn active">Tab 1</button>
    <button class="seg-btn">Tab 2</button>
  </div>
  <button class="btn btn-primary">Aksi utama</button>
</div>
```

---

## 6. Tombol

| Kelas | Penggunaan |
|---|---|
| `btn btn-primary` | Aksi utama: Simpan, Submit, Buat, Konfirmasi |
| `btn btn-outline` | Aksi sekunder: Batal, Export, Tambah Baris |
| `btn btn-danger` | Destruktif: Hapus, Reset, Tolak/Void |
| `btn btn-ghost` | Tautan aksi ringan |
| `btn-sm` | Toolbar, modal footer, page action |
| `btn-xs` | Aksi baris tabel |
| `icon-btn` | Aksi ikon di tabel |
| `icon-btn-danger` | Aksi hapus baris |

Aturan:
- Jangan memakai lebih dari satu `btn-primary` dalam satu toolbar.
- Tombol nonaktif memakai atribut `disabled`.
- Teks tombol berupa kata kerja: **Simpan Draft**, **Submit**, **Setujui**, **Tolak**.
- Aksi baris > 3 sebaiknya memakai dropdown; saat ini prototype masih memakai ikon dengan `title`.

---

## 7. Form dan input

### Struktur field

```html
<div>
  <label class="label">Nama <span class="req">*</span></label>
  <input class="input" x-model="form.name" placeholder="...">
</div>
```

| Komponen | Class |
|---|---|
| Input teks | `.input` |
| Select | `.select` |
| Textarea | `.textarea` |
| Checkbox | `.checkbox` |
| Radio | `.radio` |
| Input + satuan | `.input-group` + `.addon` |
| Input pencarian | `.input-icon` + ikon `#i-search` |
| Label wajib | `<span class="req">*</span>` |

Aturan:
- Wajib divalidasi di method `save*`, bukan hanya HTML `required`.
- Error memakai toast (`notify(msg, 'error')`) dan/atau teks merah inline.
- Field readonly diberi `readonly` dan gaya abu.
- Angka uang memakai input `type="number"` dan `x-model.number`.
- Tanggal memakai `type="date"` dan format ISO `YYYY-MM-DD`.

### Modal vs halaman

| Kebutuhan | Pola |
|---|---|
| Form singkat ≤ 8 field | Modal (`modal-md` / `modal-lg`) |
| Form panjang / banyak baris | Halaman penuh |
| Form transaksi panjang, banyak baris | **Halaman penuh** |
| Detail dokumen | Modal `modal-2xl` atau halaman |
| Konfirmasi destruktif | Modal `modal-sm` |
| Picker nilai master di dalam modal | **Floating picker global** (`fixed z-[120]`) |

Aturan footer modal:
- Aksi positif (`Setujui`, `Submit`, `Posting`, `Simpan`, `Bayar`, `Konfirmasi`) selalu paling kanan.
- Aksi destruktif (`Batalkan`, `Void`, `Hapus`) dipisahkan di kiri.
- Untuk footer kompleks, gunakan `.modal-foot-split` dengan `.modal-actions-left` dan `.modal-actions-right`.
- Contoh PO: `Batalkan PO` di kiri; `Preview A4`, `Tolak`, `Setujui` di kanan dengan `Setujui` paling akhir.
| Picker nilai master di halaman/tabel | Popover lokal atau floating picker |

Contoh halaman transaksi: **Buat Surat Jalan**, **Buat Purchase Request**.

---

## 8. Searchable select + tambah nilai (standar baru)

Pola ini wajib dipakai untuk memilih master yang bisa bertambah tanpa pindah halaman:
- kategori produk/barang,
- satuan,
- barang pada baris Purchase Request,
- supplier pada modul berikutnya bila diperlukan.

### 8.1 Di dalam modal — floating picker (wajib)

Picker **tidak boleh mengubah tinggi/ukuran modal**. Gunakan satu panel global `position: fixed` dengan `z-index` di atas modal (`z-[120]`), lalu posisikan berdasarkan bounding box tombol pemicu.

- Tinggi modal tidak berubah.
- Panel tidak terpotong oleh `overflow: auto/hidden` milik modal atau tabel.
- Panel menutup saat klik di luar, scroll, resize, atau Escape.
- Trigger wajib memakai `@click.stop` agar tidak langsung tertutup oleh handler `@click.outside`.
- Posisi dihitung ulang setiap kali dibuka.

```html
<button type="button"
        class="input w-full flex items-center justify-between gap-2 text-left"
        @click.stop="openFormPicker('category', 'material', $event)">
  <span x-text="materialForm.categoryId ? categoryName(materialForm.categoryId) : 'Pilih kategori'"></span>
  <svg class="icon icon-xs"><use href="#i-chevron-down"></use></svg>
</button>
```

Panel global, diletakkan di akhir body (di dalam `x-data`):

```html
<div x-show="formPicker.open" x-cloak
     @click.outside="closeFormPicker()"
     class="fixed z-[120] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl"
     :style="'top:' + formPicker.top + 'px; left:' + formPicker.left + 'px; width:' + formPicker.width + 'px'">
  <div class="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
       x-text="formPickerTitle()"></div>

  <div class="input-icon mb-2">
    <svg class="icon icon-sm"><use href="#i-search"></use></svg>
    <input class="input input-sm"
           :placeholder="formPicker.kind === 'category' ? 'Cari kategori...' : 'Cari satuan...'"
           x-model="formPicker.query">
  </div>

  <div class="max-h-48 overflow-y-auto space-y-0.5">
    <template x-for="option in formPickerOptions" :key="option.id">
      <button type="button"
              class="w-full rounded-lg px-2 py-1.5 text-left text-xs hover:bg-slate-50"
              @click="selectFormPickerValue(option)">
        <b x-text="option.label"></b>
        <span class="text-[10px] text-slate-400" x-text="option.code"></span>
      </button>
    </template>

    <div x-show="formPickerOptions.length === 0" class="px-2 py-2 text-center text-xs text-slate-400">
      <div>Data tidak ditemukan</div>
      <button type="button" x-show="formPicker.query.trim()" @click="addFormPickerValue()"
              class="mt-2 w-full rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-left text-xs font-semibold text-blue-600 hover:bg-blue-100"
              x-text="formPickerAddLabel()"></button>
    </div>
  </div>
</div>
```

Label tombol tambah dibentuk oleh method:

```js
formPickerAddLabel() {
  const name = String(this.formPicker.query || '').trim();
  const prefix = this.formPicker.kind === 'category' ? 'Tambah kategori ' : 'Tambah satuan ';
  return prefix + '"' + name + '"';
}
```

Perhitungan posisi:

```js
openFormPicker(kind, target, event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
  const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
  const openUp = rect.bottom + 330 > window.innerHeight;
  const top = openUp ? Math.max(12, rect.top - 336) : rect.bottom + 6;
  this.formPicker = { open:true, kind, target, query:'', top, left, width };
}
```

### 8.2 Di halaman/tabel — popover lokal

Untuk tabel, popover `absolute` boleh dipakai asalkan container tidak memotong:

```html
<div class="table-wrap" style="overflow: visible">
```

Aturan yang sama tetap berlaku: search, quick-add, pilihan unik, dan tutup saat klik luar. Jika tabel membutuhkan horizontal scroll, gunakan floating picker global seperti 8.1.

### 8.3 Aturan quick-add

- **Tidak ada field “nilai baru” dan tombol Tambah di bawah panel.** Pengguna cukup mengetik di kolom search.
- Jika hasil pencarian kosong, tampilkan tombol `Tambah kategori "X"` / `Tambah satuan "X"`.
- Tekan Enter pada kolom search juga menjalankan quick-add saat hasil kosong.
- Nama kosong → jangan tampilkan tombol tambah.
- Duplikat dalam tipe yang sama → pilih data existing, jangan membuat duplikat.
- Data nonaktif dengan nama sama → aktifkan kembali.
- Nilai baru langsung dipilih pada field.
- Simpan master baru ke array dan panggil `persist()`.
- Kode dibuat otomatis (`KAT-0001`, `BRG-0001`, `SUP-0001`).

### 8.4 Aturan pilihan unik

Untuk pemilihan berulang (baris PR/PO):
- Opsi yang sudah dipilih di baris lain **disembunyikan**.
- Validasi duplikat tetap dilakukan saat submit.
- Search memfilter kode, nama, dan satuan.
- Baris menampilkan: nama, kode, satuan, stok.

---

## 9. Tabel

### Struktur wajib

```html
<div class="table-wrap">
  <table class="data-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Kode</th>
        <th>Nama</th>
        <th class="num">Qty</th>
        <th class="actions">Action</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="(row, i) in rows" :key="row.id">
        <tr>
          <td x-text="i + 1"></td>
          <td class="font-semibold" x-text="row.code"></td>
          <td x-text="row.name"></td>
          <td class="num" x-text="fmt(row.qty)"></td>
          <td class="actions">
            <button class="icon-btn icon-btn-sm" title="Aksi" @click.stop="openActionMenu($event, 'rows', row)">
              <svg class="icon icon-sm"><use href="#i-more"></use></svg>
            </button>
          </td>
        </tr>
      </template>
      <tr x-show="rows.length === 0">
        <td colspan="5"><div class="empty">...</div></td>
      </tr>
    </tbody>
  </table>
</div>
```

Aturan action tabel:
- Tabel daftar memakai satu tombol ellipsis (`i-more`) di kolom Action, bukan kumpulan ikon.
- Menu action tampil floating di atas tabel, boleh berisi ikon + label.
- Aksi destruktif memakai warna merah.
- Aksi yang tidak tersedia ditampilkan disabled atau tidak dimasukkan.
- Tabel input (baris PR/PO, jurnal, resep, produksi) tetap memakai tombol baris langsung, bukan ellipsis.

Aturan:
- Angka uang/qty: `class="num"` + `tabular-nums`.
- Aksi di kolom paling kanan dengan `class="actions"`.
- Kode dan nama penting memakai `font-semibold`.
- Baris kosong wajib punya empty state dan `colspan` sesuai jumlah kolom.
- Header tabel sticky (`data-table th` sudah sticky).
- Filter bar di atas tabel.
- Jangan memakai warna sebagai satu-satunya penanda status.

### Empty state

```html
<div class="empty">
  <svg class="icon icon-lg text-slate-300"><use href="#i-folder-search"></use></svg>
  <div class="font-semibold mt-2">Belum ada data</div>
  <div class="text-xs text-slate-400">Tambahkan data atau ubah filter.</div>
</div>
```

---

## 10. Badge dan status

| Makna | Class | Contoh |
|---|---|---|
| Netral/draft | `badge-slate` | Draft |
| Menunggu | `badge-yellow` | Diajukan, Belum Lunas |
| Sedang proses | `badge-orange` / `badge-blue` | Diproses |
| Sukses | `badge-green` | Disetujui, Lunas, Selesai |
| Gagal/ditolak | `badge-red` | Ditolak, Dibatalkan |
| Informasi | `badge-blue` / `badge-cyan` | Siap Kirim |
| Arsip | `badge-stone` | Nonaktif |

Gunakan helper:

```js
statusBadge(status)   // class badge
statusLabel(status)   // label Indonesia
```

Lifecycle dokumen:
```text
draft → submitted → approved / rejected
                  → cancelled
```

Aturan approval:
- Tombol hanya muncul untuk capability/role yang berhak.
- Pembuat tidak boleh menyetujui dokumennya sendiri.
- Alasan penolakan wajib.
- Semua aksi tercatat di `history`.

---

## 11. Konfirmasi, toast, dan feedback

### Konfirmasi

```js
this.askConfirm('delete-x', id, 'Hapus data?', 'Data X akan dihapus.', true);
```

- `danger=true` → tombol merah.
- `danger=false` → tombol primary.
- Aksi dieksekusi di `runConfirm()`.
- Setelah selesai: `confirm.open = false` dan `persist()`.

### Toast

```js
notify('Data berhasil disimpan');
notify('Stok tidak cukup', 'error');
```

- Sukses: hijau.
- Error: merah.
- Maksimal satu pesan singkat.
- Jangan memakai toast untuk informasi yang harus dibaca lama; gunakan panel.

---

## 12. Pola modul Purchasing

### Master
- **Master Produk** → barang jadi untuk Sales Order (`ABI-xxxx`).
- **Master Barang** → bahan mentah/kemasan untuk purchasing (`BRG-xxxx`).
- **Kategori** → tab di masing-masing master, memiliki `type` (`product`/`material`).
- **Satuan** → master global (`units`), bisa ditambah dari form.
- **Supplier** → pemasok purchasing.

### Purchase Request
- Halaman penuh, bukan modal.
- Header: Tanggal, Keperluan, Requester.
- Baris: barang searchable, qty, catatan, hapus baris.
- Tombol: **Simpan Draft**, **Submit**, **Tambah Barang**, **Tambah Baris**.
- Tombol **Tambah Baris** tersedia di atas dan di bawah tabel Rincian Barang.
- Tidak membuat jurnal, utang, atau perubahan stok.
- Approve/reject hanya Manager.
- Daftar PR menampilkan kolom **PO Terkait**.
- Status PR: `draft → submitted → approved → processing → completed`.
- `processing` selama PO terkait belum selesai diterima; `completed` saat semua PO related fully received/closed.

### Tahap berikutnya
- Purchase Order (L3)
- Penerimaan Barang (L4, setelah CoA/Jurnal)
- Retur Pembelian (L5)

### 12.1 Print A4 dan Export PDF

Setiap dokumen yang perlu dicetak memakai pola yang sama:

1. **Halaman preview** terpisah, contoh `purchase-request-preview`.
2. Area cetak memakai `.print-area`; tombol dan riwayat memakai `.no-print`.
3. Lembar A4 memakai `.pr-sheet`:
   - lebar `210mm`, min-height `297mm`, padding `15mm` di layar;
   - di mobile menjadi lebar penuh;
   - saat print, padding dihapus dan margin diatur oleh `@page`.
4. Tombol:
   - **Print A4** → `printPR()`
   - **Export PDF** → `exportPRPDF()` (membuka dialog print, user memilih **Save as PDF**).
5. Saat print, inject aturan:

```js
style.textContent = '@page { size: A4 portrait; margin: 12mm; }';
document.body.classList.add('print-pr');
window.print();
```

6. CSS print wajib:
   - menyembunyikan semua elemen kecuali `.print-area`;
   - menyembunyikan `.no-print`;
   - tabel dokumen memakai border hitam;
   - warna teks menjadi hitam.
7. Isi dokumen cetak:
   - kop perusahaan + logo;
   - jenis dokumen dan nomor;
   - informasi dokumen (tanggal, pihak, status);
   - tabel baris;
   - total;
   - area tanda tangan;
   - footer “Dicetak dari ABI Mineral System • tanggal”.
8. Riwayat approval **tidak** ikut dicetak; tampilkan di bawah preview dengan `.no-print`.
9. Riwayat di dalam popup memakai disclosure yang tertutup secara default (`.history-details` / `.history-summary`) agar hemat ruang; buka hanya saat dibutuhkan.

Jangan memakai `@page` A4 secara global jika ada dokumen lain yang memakai ukuran berbeda. Inject aturan A4 hanya saat print dokumen tersebut, lalu hapus setelah selesai.

---

### 12.2 Purchase Order

- Dibuat dari PR `approved`/`processing` atau manual.
- Satu PO hanya untuk satu supplier.
- Qty tiap baris ≤ sisa qty PR (`qty - orderedQty`).
- Satu PR boleh dipecah ke beberapa PO.
- Harga awal = `materials.purchasePrice`, boleh diubah.
- **Biaya Tambahan** memakai baris keterangan + nominal + qty; total PO adalah subtotal barang + biaya tambahan.
- Biaya tambahan dialokasikan proporsional ke AP saat penerimaan dan dicatat sebagai beban tambahan pada jurnal penerimaan.
- Tombol **Tambah Baris** tersedia di atas dan di bawah tabel Rincian Barang; PO juga memiliki **Tambah Biaya** di bawah tabel.
- Harga master diperbarui **saat PO approved**, bukan saat draft/submit.
- Approval hanya Manager; Admin/Developer tidak approve; Manager tidak approve PO sendiri.
- Status:
  ```text
  draft → pending_approval → approved / rejected
  approved → sent → closed
  draft/pending_approval/approved → cancelled
  ```
- Approve menambah `orderedQty` PR dan mengubah status PR menjadi `processing`.
- Status PR menjadi `completed` ketika semua PO terkait selesai diterima/closed.
- Cancel PO approved mengembalikan `orderedQty`; harga master tidak di-rollback.
- PO tidak membuat jurnal, utang, atau perubahan stok.
- Preview A4/Print/Export PDF memakai pola yang sama dengan PR.

### 12.3 Chart of Accounts & Jurnal Umum

Chart of Accounts:
- Akun dikelompokkan per tipe: Aset, Kewajiban, Ekuitas, Pendapatan, Beban.
- Tabel menampilkan kode, nama, saldo normal, saldo, status, aksi.
- Akun **Sistem** diberi badge dan tidak boleh diedit/dihapus.
- Akun Kas/Bank diberi badge.
- Akun yang sudah dipakai jurnal tidak boleh dihapus.
- Saldo dihitung dari jurnal `posted`; jurnal `void` diabaikan.

Jurnal Umum:
- Form halaman penuh, bukan modal.
- Minimal 2 baris.
- Setiap baris hanya debit atau kredit.
- Total debit harus sama dengan total kredit sebelum posting.
- Akun terkunci/nonaktif tidak muncul di picker jurnal manual.
- Draft boleh diedit/dihapus; posted tidak.
- Void wajib alasan.
- Tampilkan total debit, kredit, dan selisih secara real-time.

### 12.3.1 Pendapatan & Pengeluaran Operasional

- Master Keuangan dihapus; tidak ada master “jenis transaksi” terpisah.
- Form memilih **akun CoA** dan **akun Kas/Bank**.
- Simpan langsung membuat jurnal posted.
- Edit = void jurnal lama + buat jurnal baru.
- Hapus = void jurnal lama.
- Akun sistem/terkunci tidak muncul di picker.
- Gunakan akun revenue untuk Pendapatan Lainnya dan expense untuk Pengeluaran Lainnya.

### 12.4 Buku Besar & Neraca Saldo

Buku Besar:
- Filter akun + rentang tanggal.
- Ringkasan: saldo awal, total debit, total kredit, saldo akhir.
- Saldo berjalan mengikuti saldo normal akun.
- Hanya jurnal `posted`; `void` tidak dihitung.
- Nomor jurnal dapat diklik menuju detail jurnal.

Neraca Saldo:
- Satu tanggal posisi, bukan rentang.
- Kolom kode, nama, tipe, debit, kredit.
- Total debit harus sama dengan total kredit; tampilkan badge selisih.
- Klik akun untuk drill-down ke Buku Besar pada tanggal yang sama.
- Sediakan export CSV.
- Jangan menulis saldo manual; semua dihitung dari jurnal.

### 12.5 Penerimaan Barang

- Dibuat dari PO approved/sent/partially_received.
- Satu penerimaan = satu gudang.
- Qty ≤ sisa PO; partial receipt diperbolehkan.
- Status `draft → posted`; draft editable, posted immutable.
- Posting wajib menghasilkan:
  - stock movement per gudang,
  - stok total + nilai persediaan + moving average,
  - jurnal otomatis `Dr Persediaan / Cr Utang Usaha`,
  - payable/AP otomatis,
  - update `receivedQty` dan status PO.
- Dokumen penerimaan memakai halaman preview A4 + Print/Export PDF.
- Daftar penerimaan menampilkan **Nilai Diterima** (qty diterima × harga) dan **Total PO**.
- Action **Riwayat** membuka modal riwayat draft/posted dengan aktor `Nama (Role)`.
- Stok per gudang ditampilkan di Stock → Barang; jangan menyimpan saldo gudang manual.
- Pembayaran utang bukan bagian penerimaan; itu modul AP/F5.

### 12.6 Return Pembelian

- Return dibuat dari PO yang sudah memiliki penerimaan posted.
- Pilih PO, lalu gudang asal otomatis mengikuti penerimaan PO.
- Setiap baris wajib memiliki qty, kondisi (`Bagus` / `Rusak`), dan tindakan (`Ganti Barang` / `Ganti Biaya`).
- Qty dibatasi oleh sisa qty yang belum diretur dan stok gudang asal.
- `Ganti Barang` membentuk Piutang Supplier; `Ganti Biaya` mengurangi Utang Usaha.
- Posting mengurangi stok, menambah `returnedQty` PO, dan membuat jurnal otomatis.
- Aksi **Terima Ganti Barang** menambah stok pengganti dan mengurangi Piutang Supplier; return yang penggantinya sudah diterima tidak dapat dibatalkan.
- Pembatalan return mengembalikan stok, payable, dan mem-void jurnal.
- Jangan mencampur return pembelian dengan return penjualan; keduanya modul dan permission berbeda.

### 12.7 Utang Supplier

- Utang/AP dibuat otomatis dari penerimaan posted; jangan input ulang manual.
- Daftar utang menampilkan total, dibayar, sisa, jatuh tempo, dan status.
- Pembayaran utang memilih akun Kas/Bank dan nominal ≤ sisa utang.
- Posting pembayaran menghasilkan jurnal `Dr Utang Usaha / Cr Kas/Bank`.
- Riwayat pembayaran ditampilkan di detail utang.
- Pembayaran tidak boleh melebihi sisa utang.

### 12.8 Produksi & Resep (BOM)

- Resep produk dikelola di halaman penuh Master Produk (Tambah/Edit Produk), bukan modal, karena form dan resep cukup panjang.
- Tabel produk menampilkan badge jumlah bahan; klik untuk pratinjau resep read-only.
- Harga Modal tidak dihitung otomatis dari resep.
- Buat Produksi memakai dialog lebar, bukan halaman baru.
- Standar = qty resep × hasil produksi; baris manual tidak ditimpa saat qty hasil berubah.
- Selisih wajib alasan; bahan tambahan juga wajib alasan.
- Stok bahan yang kurang memblokir simpan.
- Produksi menyimpan snapshot resep, harga, standar, dan pemakaian.
- Koreksi hanya mengubah hasil dan pemakaian; standar snapshot tetap.
- Setiap koreksi mencatat Riwayat Perubahan dan menyesuaikan stok sebesar selisih.
- Riwayat stok produk dan barang harus menautkan nomor `PRD-YYYY-0001` ke detail produksi.

## 13. Persistensi dan migrasi

Setiap perubahan model data wajib:

1. Tambah key ke `DOMAIN_KEYS`.
2. Tambah data awal di `seedData()`.
3. Naikkan `STORE_VERSION`.
4. Tambah migrasi dari versi sebelumnya.
5. Pastikan `snapshot()` menyimpan data baru.
6. Pastikan `seedDefaults()` mengembalikan data baru.
7. Perbarui `clearTransactions()` bila data termasuk transaksi.
8. Uji reload dan import/export.

Aturan:
- Key localStorage: `abi-mineral-demo`.
- Jangan menghapus data master saat “Hapus Transaksi”.
- Export JSON harus membawa versi terbaru.
- Import versi lama ditolak dengan pesan jelas.

---

## 14. Konvensi kode Alpine

| Kebutuhan | Konvensi |
|---|---|
| State halaman | `page: 'purchase-requests'` |
| Modal | `xxxModalOpen: false` |
| Form | `xxxForm: { ... }` |
| Edit | `xxxEditId: null` |
| Picker | `xxxOpen`, `xxxSearch`, `xxxNew` |
| List filter | `xxxSearch`, `xxxStatus` |
| Getter turunan | `get filteredXxx()` |
| Aksi | `openXxx()`, `saveXxx()`, `deleteXxx()` |
| Konfirmasi | `askConfirm('action', id, title, message)` |
| Persist | panggil `persist()` setelah mutasi |
| Permission | `canAccessPage(page)` + `PAGE_PERMISSION` |
| Navigasi | `go(page)` |
| Path header | `pageMeta.crumb` |

Aturan:
- Jangan memutasi array master langsung dari template.
- Jangan menyimpan status pembayaran yang bisa dihitung.
- Jangan menulis angka laporan secara manual.
- Tambah page baru → daftarkan di `PAGE_PERMISSION`, `pageMeta`, `navGroups`, dan section HTML.
- Modal baru → tambahkan flag close di `closeModals()`.
- Aksi baru di confirm → tambahkan case di `runConfirm()`.

---

## 15. Aksesibilitas dan copywriting

- Label selalu terhubung ke input (`for`/`id` atau pembungkus).
- Tombol ikon wajib punya `title`.
- Status memakai teks, bukan warna saja.
- Kontras teks minimal 4.5:1 untuk teks utama.
- Fokus terlihat; Escape menutup modal.
- Bahasa UI: Indonesia, singkat, kata kerja.
- Gunakan “Anda” untuk sapaan, bukan “kamu”.
- Istilah konsisten:
  - Produk (barang jadi)
  - Barang (bahan mentah purchasing)
  - Purchase Request (PR)
  - Surat Jalan
  - Piutang
  - Penagihan

---

## 16. Checklist modul baru

- [ ] Page key + permission + nav + pageMeta.
- [ ] State form, edit, search, filter, picker.
- [ ] Data model + seed + migrasi versi.
- [ ] List table + filter + empty state.
- [ ] Form dengan validasi dan toast error.
- [ ] Konfirmasi untuk aksi destruktif.
- [ ] Persist setelah setiap mutasi.
- [ ] Permission dan role action.
- [ ] Tidak mengubah stok/jurnal kecuali modul memang berwenang.
- [ ] Uji reload, migrasi, export/import.
- [ ] Uji desktop dan mobile.
- [ ] Tidak ada console error.

---

## 17. Contoh cepat: picker satuan

Trigger di form:

```html
<button type="button"
        class="input w-full flex items-center justify-between gap-2 text-left"
        @click.stop="openFormPicker('unit', 'material', $event)">
  <span x-text="materialForm.unit || 'Pilih satuan'"></span>
  <svg class="icon icon-xs"><use href="#i-chevron-down"></use></svg>
</button>
```

Panel global `fixed z-[120]` dan method `openFormPicker()` mengikuti pola pada bagian 8.1. Jangan membuat panel inline di dalam modal karena akan mengubah tinggi modal dan berisiko terpotong.

Dengan pola ini, modul Finance, Logistik, dan Purchasing berikutnya memakai pengalaman input yang sama: cari, pilih, atau tambah nilai baru tanpa berpindah halaman dan tanpa layout shift.
