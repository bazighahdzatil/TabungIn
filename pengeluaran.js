// js/pengeluaran.js

document.addEventListener("DOMContentLoaded", () => {
  const pengeluaranForm = document.getElementById("pengeluaranForm");
  const listPengeluaran = document.getElementById("listPengeluaran");

  function tampilkanPengeluaran() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const pengeluaranList = currentUser?.pengeluaran || [];

    listPengeluaran.innerHTML = "";

    pengeluaranList.slice().reverse().forEach(item => {
      const div = document.createElement("div");
      div.className = "transaction-item";
      div.innerHTML = `
        <div><strong>${item.tanggal}</strong> - ${item.kategori}</div>
        <div>Rp ${item.jumlah.toLocaleString('id-ID')}</div>
        <div>${item.deskripsi}</div>
        ${item.catatan ? `<div><em>${item.catatan}</em></div>` : ""}
      `;
      listPengeluaran.appendChild(div);
    });
  }

  pengeluaranForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tanggal = document.getElementById("tanggalPengeluaran").value;
    const kategori = document.getElementById("kategoriPengeluaran").value;
    const deskripsi = document.getElementById("deskripsiPengeluaran").value;

    // Ambil dan bersihkan input jumlah
    const jumlahInput = document.getElementById("jumlahPengeluaran").value;
    onsole.log("Isi input jumlah sebelum proses:", jumlahInput);

    const cleanedJumlah = jumlahInput.replace(/\D/g, '');
    console.log("Isi input jumlah setelah dibersihkan:", cleanedJumlah);

    const jumlah = parseInt(cleanedJumlah, 10);
    console.log("Hasil parseInt jumlah:", jumlah);

    
    const catatan = document.getElementById("catatanPengeluaran").value;

    console.log("Jumlah input mentah:", document.getElementById("jumlahPengeluaran").value);
    console.log("Jumlah setelah pembersihan:", jumlah);

    if (isNaN(jumlah) || jumlah <= 0) {
      alert("Jumlah pengeluaran tidak valid.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const index = users.findIndex(u => u.email === currentUser?.email);

if (index !== -1) {
  const pengeluaranBaru = {
    tanggal,
    kategori,
    deskripsi,
    jumlah,
    catatan
  };

  // Pastikan pengeluaran & saldo ada
  users[index].pengeluaran = users[index].pengeluaran || [];
  users[index].saldo = users[index].saldo || 0;

  // Simpan pengeluaran baru
  users[index].pengeluaran.push(pengeluaranBaru);

  // Kurangi saldo
  users[index].saldo -= jumlah;

  // Simpan ulang ke localStorage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(users[index]));

  // Reset form
  pengeluaranForm.reset();

  // Update dashboard
  hitungSaldo();
  tampilkanPengeluaran();

  alert("Pengeluaran berhasil disimpan.");
} else {
  alert("User tidak ditemukan.");
}

  });

  // Tampilkan pengeluaran saat halaman dibuka
  tampilkanPengeluaran();
});
