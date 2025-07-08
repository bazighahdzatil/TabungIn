// Authentication System for TabungIn
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.currentUser = this.getCurrentUser();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Forgot Password
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Logout button (if any)
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.showLoading(submitBtn, true);

        try {
            await this.delay(1000);
            const users = this.getStoredUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) throw new Error("Email atau password salah!");

            this.setCurrentUser(user);
            this.showNotification("Login berhasil!", "success");
            setTimeout(() => window.location.href = "dashboard.html", 1200);
        } catch (err) {
            this.showNotification(err.message, "error");
        } finally {
            this.showLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const telepon = document.getElementById('telepon').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreement = document.getElementById('agreement').checked;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!this.validateRegisterForm(nama, email, telepon, password, confirmPassword, agreement)) {
            return;
        }

        this.showLoading(submitBtn, true);

        try {
            await this.delay(1000);
            const users = this.getStoredUsers();
            if (users.find(u => u.email === email)) {
                throw new Error("Email sudah terdaftar!");
            }

            const newUser = {
                id: Date.now(),
                nama,
                email,
                telepon,
                password,
                createdAt: new Date().toISOString(),
                saldo: 0,
                pemasukan: [],
                pengeluaran: [],
                tabungan: [],
                transfer: []
            };

            users.push(newUser);
            this.setStoredUsers(users);

            this.showNotification("Registrasi berhasil! Silakan login.", "success");
            setTimeout(() => window.location.href = "index.html", 1200);
        } catch (err) {
            this.showNotification(err.message, "error");
        } finally {
            this.showLoading(submitBtn, false);
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email);

        if (user) {
            alert(`Password Anda adalah: ${user.password}`);
        } else {
            alert("Email tidak ditemukan!");
        }
    }

    validateRegisterForm(nama, email, telepon, password, confirmPassword, agreement) {
        if (!nama || !email || !telepon || !password || !confirmPassword) {
            this.showNotification("Semua kolom wajib diisi!", "error");
            return false;
        }
        if (password.length < 6) {
            this.showNotification("Password minimal 6 karakter!", "error");
            return false;
        }
        if (password !== confirmPassword) {
            this.showNotification("Password dan konfirmasi tidak cocok!", "error");
            return false;
        }
        if (!agreement) {
            this.showNotification("Anda harus menyetujui syarat dan ketentuan!", "error");
            return false;
        }
        return true;
    }

    getStoredUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    setStoredUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("currentUser"));
    }

    logout() {
        localStorage.removeItem("currentUser");
        this.currentUser = null;
        this.showNotification("Berhasil logout!", "success");
        setTimeout(() => window.location.href = "index.html", 1000);
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    showLoading(button, loading) {
        const loader = button.querySelector('.btn-loader');
        if (loading) {
            loader.style.display = "inline-block";
            button.disabled = true;
        } else {
            loader.style.display = "none";
            button.disabled = false;
        }
    }

    showNotification(message, type = "info") {
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AuthSystem();
});