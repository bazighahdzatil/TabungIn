// js/pemasukan.js

document.getElementById("pemasukanTransferForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggalPemasukan").value;
  const kategori = document.getElementById("kategoriPemasukan").value;
  const deskripsi = document.getElementById("deskripsiPemasukan").value;
  const jumlah = parseFloat(document.getElementById("jumlahNominal").value);
  const bank = document.getElementById("bankTujuanTransfer").value;
  const norek = document.getElementById("nomorRekeningTransfer").value;
  const nama = document.getElementById("namaPenerima").value;
  const buktiFile = document.getElementById("buktiTransfer").files?.[0];

  if (!tanggal || !kategori || !deskripsi || isNaN(jumlah) || jumlah <= 0 || !bank || !norek || !nama || !buktiFile) {
    alert("Mohon lengkapi semua data pemasukan dan upload bukti transfer.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const index = users.findIndex(u => u.email === currentUser.email);

  if (index === -1) {
    alert("Data pengguna tidak ditemukan.");
    return;
  }

  const pemasukanBaru = {
    tanggal,
    kategori,
    deskripsi,
    jumlah,
    tipePemasukan: "transfer",
    bankSumber: bank,
    norekSumber: norek,
    namaPengirim: nama,
    buktiTransferFileName: buktiFile.name
  };

  users[index].pemasukan = users[index].pemasukan || [];
  users[index].pemasukan.push(pemasukanBaru);
  users[index].saldo = (users[index].saldo || 0) + jumlah;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(users[index]));

  alert("Pemasukan berhasil dicatat. Saldo Anda telah bertambah.");
  this.reset();

  window.location.href = "dashboard.html";
});

// Tampilkan daftar pemasukan di dashboard
function tampilkanDataPemasukan() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const list = currentUser?.pemasukan || [];
  const container = document.getElementById("listPemasukan");

  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${item.kategori}</h4>
        <p>${item.tanggal} - ${item.deskripsi}</p>
        <small>${item.tipePemasukan === "transfer" ? "Via Transfer" : "Tunai"}</small>
      </div>
      <div class="transaction-amount income">
        + Rp ${item.jumlah.toLocaleString('id-ID')}
        <br><small>Bukti: ${item.buktiTransferFileName || "Tidak ada"}</small>
      </div>
    </div>
  `).join("");
}

// Jalankan saat halaman dashboard dimuat
document.addEventListener("DOMContentLoaded", function () {
  tampilkanDataPemasukan();
  if (typeof hitungSaldo === "function") hitungSaldo();
});
