// js/tabungan.js

// Event saat form tabungan disubmit
document.getElementById("tabunganForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const namaTarget = document.getElementById("namaTarget").value.trim();
  const nominalTarget = parseFloat(document.getElementById("nominalTarget").value);
  const jumlahNabung = parseFloat(document.getElementById("jumlahNabung").value);
  const metode = document.getElementById("metodeTabungan").value;
  const bankTujuan = document.getElementById("bankTujuan")?.value;
  const nomorRekening = document.getElementById("nomorRekening")?.value;
  const buktiFile = document.getElementById("buktiTransferTabungan")?.files?.[0];

  if (!namaTarget || isNaN(nominalTarget) || nominalTarget <= 0 || isNaN(jumlahNabung) || jumlahNabung <= 0 || !metode) {
    alert("Mohon lengkapi semua data tabungan.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const index = users.findIndex(u => u.email === currentUser.email);

  if (index === -1) {
    alert("Pengguna tidak ditemukan.");
    return;
  }

  if ((users[index].saldo || 0) < jumlahNabung) {
    alert("Saldo tidak mencukupi untuk menabung.");
    return;
  }

  const tabunganBaru = {
    namaTarget,
    nominalTarget,
    jumlah: jumlahNabung,
    metode,
    tanggal: new Date().toLocaleDateString('id-ID'),
    bankTujuan: metode === "transfer" ? bankTujuan : null,
    nomorRekening: metode === "transfer" ? nomorRekening : null,
    buktiTransferFileName: metode === "transfer" && buktiFile ? buktiFile.name : null
  };

  // Kurangi saldo
  users[index].saldo -= jumlahNabung;

  // Simpan ke array tabungan
  users[index].tabungan = users[index].tabungan || [];
  users[index].tabungan.push(tabunganBaru);

  // Simpan kembali ke localStorage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(users[index]));

  alert("Tabungan berhasil ditambahkan.");
  this.reset();

  tampilkanDaftarTabungan();
  hitungSaldo();
});

// Tampilkan daftar target tabungan
function tampilkanDaftarTabungan() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const list = currentUser?.tabungan || [];
  const container = document.getElementById("daftarTabungan");
  const totalDisplay = document.getElementById("totalTabunganDisplay");

  if (!container) return;

  const total = list.reduce((sum, t) => sum + (t.jumlah || 0), 0);
  if (totalDisplay) totalDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;

  container.innerHTML = list.map(item => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${item.namaTarget}</h4>
        <p>${item.tanggal} - Nabung: Rp ${item.jumlah.toLocaleString('id-ID')}</p>
        <small>Target: Rp ${item.nominalTarget.toLocaleString('id-ID')} | Metode: ${item.metode}</small>
        ${item.buktiTransferFileName ? `<br><small>Bukti: ${item.buktiTransferFileName}</small>` : ""}
      </div>
    </div>
  `).join("");
}

// Tampilkan daftar target ke dropdown
function isiDropdownTarget() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const list = currentUser?.tabungan || [];
  const dropdown = document.getElementById("pilihTarget");

  if (!dropdown) return;

  const uniqueTargets = [...new Set(list.map(t => t.namaTarget))];
  dropdown.innerHTML = `<option value="">-- Buat Target Baru --</option>` + 
    uniqueTargets.map(t => `<option value="${t}">${t}</option>`).join("");
}

// Tampilkan/hidden field transfer sesuai metode
document.getElementById("metodeTabungan")?.addEventListener("change", function () {
  const transferSection = document.getElementById("transferSection");
  transferSection.style.display = this.value === "transfer" ? "block" : "none";
});

// Jalankan saat halaman/tabungan dimuat
document.addEventListener("DOMContentLoaded", function () {
  tampilkanDaftarTabungan();
  isiDropdownTarget();
});
