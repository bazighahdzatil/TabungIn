// Navigasi antar menu dashboard
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main > section");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Ambil target id dari href (misalnya #saldo)
            const targetId = this.getAttribute("href").replace("#", "");

            // Update class aktif pada menu
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Sembunyikan semua section dan tampilkan yang sesuai
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.add("section-active");
                } else {
                    sec.classList.remove("section-active");
                }
            });

            // Scroll ke atas section jika diperlukan
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Buka sesuai hash URL jika ada (#saldo, #pengeluaran, dsb)
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
        const targetLink = document.querySelector(`.nav-link[href="#${initialHash}"]`);
        if (targetLink) targetLink.click();
    } else {
        navLinks[0]?.click(); // default ke pertama
    }
});
