// --- Inisialisasi Data ---
let pemasukan = JSON.parse(localStorage.getItem("pemasukan")) || [];
let pengeluaran = JSON.parse(localStorage.getItem("pengeluaran")) || [];
let tabungan = JSON.parse(localStorage.getItem("tabungan")) || [];

function simpanData() {
  localStorage.setItem("pemasukan", JSON.stringify(pemasukan));
  localStorage.setItem("pengeluaran", JSON.stringify(pengeluaran));
  localStorage.setItem("tabungan", JSON.stringify(tabungan));
}

// --- Register ---
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const [nama, email, password] = this.querySelectorAll("input");
  const user = {
    nama: nama.value,
    email: email.value,
    password: password.value
  };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Registrasi berhasil. Silakan login.");
  window.location.href = "index.html";
});

// --- Login ---
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const [emailInput, passInput] = this.querySelectorAll("input");
  const saved = JSON.parse(localStorage.getItem("user"));
  if (saved && saved.email === emailInput.value && saved.password === passInput.value) {
    alert("Login berhasil!");
    window.location.href = "dashboard.html";
  } else {
    alert("Email atau password salah!");
  }
});

// --- Tambah Pemasukan ---
document.querySelector("#pemasukan form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const [tanggal, deskripsi, jumlah] = this.querySelectorAll("input");
  const kategori = this.querySelector("#kategoriPemasukan");
  pemasukan.push({
    tanggal: tanggal.value,
    deskripsi: deskripsi.value,
    jumlah: parseFloat(jumlah.value),
    kategori: kategori.value
  });
  simpanData();
  alert("Pemasukan ditambahkan!");
  this.reset();
  updateRingkasan();
});

// --- Tambah Pengeluaran ---
document.querySelector("#pengeluaran form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const [tanggal, deskripsi, jumlah] = this.querySelectorAll("input");
  const kategori = this.querySelector("#kategoriPengeluaran");
  const catatan = this.querySelector("textarea").value;
  pengeluaran.push({
    tanggal: tanggal.value,
    deskripsi: deskripsi.value,
    jumlah: parseFloat(jumlah.value),
    kategori: kategori.value,
    catatan: catatan
  });
  simpanData();
  alert("Pengeluaran ditambahkan!");
  this.reset();
  updateRingkasan();
});

// --- Dropdown Target Tabungan ---
function updateDropdownTarget() {
  const dropdown = document.getElementById("pilihTarget");
  if (!dropdown) return;
  dropdown.innerHTML = '<option value="">-- Pilih Target Sebelumnya --</option>';
  tabungan.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.nama;
    opt.textContent = t.nama;
    dropdown.appendChild(opt);
  });
}

document.getElementById("pilihTarget")?.addEventListener("change", function () {
  const selected = tabungan.find(t => t.nama === this.value);
  if (selected) {
    document.getElementById("namaTarget").value = selected.nama;
    document.getElementById("nominalTarget").value = selected.target;
  } else {
    document.getElementById("namaTarget").value = "";
    document.getElementById("nominalTarget").value = "";
  }
});

// --- Tambah atau Update Tabungan ---
document.getElementById("tabunganForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const nama = document.getElementById("namaTarget").value;
  const target = parseFloat(document.getElementById("nominalTarget").value);
  const tambah = parseFloat(document.getElementById("terkumpulTarget").value);

  const existing = tabungan.find(t => t.nama === nama);
  if (existing) {
    existing.terkumpul += tambah;
    if (existing.target !== target) existing.target = target;
  } else {
    tabungan.push({
      nama,
      target,
      terkumpul: tambah
    });
  }
  simpanData();
  alert("Tabungan berhasil disimpan!");
  this.reset();
  tampilkanProgressTabungan();
  updateDropdownTarget();
});

// --- Tampilkan Progress Tabungan ---
function tampilkanProgressTabungan() {
  const area = document.getElementById("daftarTabungan") || document.querySelector("#tabungan");
  if (!area) return;
  const progressHTML = tabungan.map(t => {
    const persen = Math.min(100, (t.terkumpul / t.target) * 100);
    return `
      <div class="progress-card">
        <p>${t.nama}: Rp ${t.terkumpul.toLocaleString()} / ${t.target.toLocaleString()}</p>
        <div class="progress-bar"><div style="width: ${persen}%"></div></div>
      </div>
    `;
  }).join("");
  area.innerHTML = progressHTML;
}

// --- Ringkasan & Grafik ---
function updateRingkasan(dataMasuk = pemasukan, dataKeluar = pengeluaran) {
  const totalIn = dataMasuk.reduce((sum, p) => sum + p.jumlah, 0);
  const totalOut = dataKeluar.reduce((sum, p) => sum + p.jumlah, 0);
  const saldo = totalIn - totalOut;
  const laporan = document.querySelector("#laporan");
  if (laporan) {
    laporan.innerHTML = `
      <h2>Laporan Keuangan</h2>
      <p>Total Pemasukan: Rp ${totalIn.toLocaleString()}</p>
      <p>Total Pengeluaran: Rp ${totalOut.toLocaleString()}</p>
      <p>Saldo Akhir: Rp ${saldo.toLocaleString()}</p>
      <button onclick="toggleGrafik()">Tampilkan Grafik</button>
      <div id="grafikContainer" style="display:none;">
        <canvas id="grafikKategori" width="300" height="200"></canvas>
      </div>
    `;
  }
}

function toggleGrafik() {
  const container = document.getElementById("grafikContainer");
  if (container.style.display === "none") {
    container.style.display = "block";
    tampilkanGrafikPie(pengeluaran);
  } else {
    container.style.display = "none";
    container.innerHTML = '<canvas id="grafikKategori" width="300" height="200"></canvas>';
  }
}

function tampilkanGrafikPie(dataPengeluaran) {
  const ctx = document.getElementById("grafikKategori")?.getContext("2d");
  if (ctx && dataPengeluaran.length > 0) {
    const kategoriMap = {};
    dataPengeluaran.forEach(p => {
      kategoriMap[p.kategori] = (kategoriMap[p.kategori] || 0) + p.jumlah;
    });

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(kategoriMap),
        datasets: [{
          data: Object.values(kategoriMap),
          backgroundColor: ['#f94144','#f3722c','#f9844a','#90be6d','#577590'],
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Distribusi Pengeluaran per Kategori',
            font: { size: 14 }
          }
        }
      }
    });
  }
}

// --- Logout & Hapus Akun ---
document.querySelector(".logout")?.addEventListener("click", function() {
  alert("Berhasil logout!");
  window.location.href = "index.html";
});

document.querySelector(".hapus-akun")?.addEventListener("click", function() {
  if (confirm("Yakin ingin menghapus semua data dan akun?")) {
    localStorage.clear();
    alert("Data berhasil dihapus!");
    window.location.reload();
  }
});

// --- Saat Halaman Dimuat ---
updateRingkasan();
tampilkanProgressTabungan();
updateDropdownTarget();
