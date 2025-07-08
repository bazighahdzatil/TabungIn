function hitungSaldo() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const index = users.findIndex(u => u.email === currentUser?.email);

  if (index !== -1) {
    // Sinkronkan currentUser agar saldonya update
    localStorage.setItem("currentUser", JSON.stringify(users[index]));
  }

  const updatedCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!updatedCurrentUser) {
    console.warn("User belum login.");
    return;
  }

  const saldo = updatedCurrentUser?.saldo || 0;
  const totalPemasukan = updatedCurrentUser?.pemasukan?.reduce((sum, item) => sum + (item.jumlah || 0), 0) || 0;
  const totalPengeluaran = updatedCurrentUser?.pengeluaran?.reduce((sum, item) => sum + (item.jumlah || 0), 0) || 0;
  const totalTabungan = updatedCurrentUser?.tabungan?.reduce((sum, item) => sum + (item.jumlah || 0), 0) || 0;

  document.getElementById("totalSaldo").textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
  document.getElementById("saldoTersedia").textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
  document.getElementById("totalPemasukan").textContent = `Rp ${totalPemasukan.toLocaleString('id-ID')}`;
  document.getElementById("totalPengeluaran").textContent = `Rp ${totalPengeluaran.toLocaleString('id-ID')}`;
  document.getElementById("totalTabungan").textContent = `Rp ${totalTabungan.toLocaleString('id-ID')}`;
}

document.addEventListener("DOMContentLoaded", hitungSaldo);
