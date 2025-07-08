// js/withdraw.js

// Event saat form withdraw disubmit
document.getElementById("withdrawForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const jumlah = parseFloat(document.getElementById("jumlahWithdraw").value);
  const catatan = document.getElementById("catatanWithdraw").value;

  if (isNaN(jumlah) || jumlah <= 0) {
    alert("Jumlah withdraw harus lebih dari 0.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const index = users.findIndex(u => u.email === currentUser.email);

  if (index === -1) {
    alert("Pengguna tidak ditemukan. Silakan login ulang.");
    return;
  }

  if ((users[index].saldo || 0) < jumlah) {
    alert("Saldo tidak mencukupi untuk melakukan withdraw.");
    return;
  }

  const withdrawBaru = {
    tanggal: new Date().toLocaleDateString('id-ID'),
    jumlah,
    catatan
  };

  // Kurangi saldo
  users[index].saldo -= jumlah;

  // Simpan riwayat withdraw
  users[index].withdraw = users[index].withdraw || [];
  users[index].withdraw.push(withdrawBaru);

  // Update ke localStorage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(users[index]));

  alert("Withdraw berhasil. Saldo Anda telah dikurangi.");
  this.reset();

  window.location.href = "dashboard.html";

  tampilkanRiwayatWithdraw();
  hitungSaldo(); // Update tampilan saldo
});

// Fungsi untuk menampilkan riwayat withdraw
function tampilkanRiwayatWithdraw() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const list = currentUser?.withdraw || [];
  const container = document.getElementById("riwayatWithdraw");

  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${item.tanggal}</h4>
        <p>${item.catatan || 'Tanpa catatan'}</p>
      </div>
      <div class="transaction-amount expense">- Rp ${item.jumlah.toLocaleString('id-ID')}</div>
    </div>
  `).join("");
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", tampilkanRiwayatWithdraw);
