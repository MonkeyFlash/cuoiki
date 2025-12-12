// 1. XỬ LÝ MENU RESPONSIVE MOBILE

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
    // Thêm hoặc xóa class 'active' để hiển thị/ẩn menu
    mainNav.classList.toggle('active');
});


// 2. XỬ LÝ QUYỀN VÀ NÚT ĐĂNG NHẬP/ĐĂNG XUẤT

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('loggedInUserRole');
    
    const loginLink = document.querySelector('.login-link');
    const logoutLink = document.querySelector('.logout-link');
    const adminItems = document.querySelectorAll('.admin-only');

    // Quản lý hiển thị nút Đăng nhập/Đăng xuất
    if (loggedInUser) {
        // Đã đăng nhập
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';

        // Quản lý quyền Admin
        if (userRole === 'admin') {
            adminItems.forEach(item => {
                item.style.display = 'block'; // Hiện các nút Admin
            });
        }
        
    } else {
        // Chưa đăng nhập
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        
        // Ẩn tất cả các nút admin
        adminItems.forEach(item => {
             item.style.display = 'none'; 
        });
        
        // Ẩn luôn nút Thống kê cá nhân nếu chưa đăng nhập
        document.querySelector('.user-stat-btn').parentElement.style.display = 'none';
    }

    // Xử lý Đăng xuất
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserRole');
        window.location.href = "/"; 
    });

    // Khởi tạo biến cho theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Hàm áp dụng chế độ theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '🌙'; 
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = '☀️'; 
        }
    };

    //  Tải chế độ theme đã lưu
    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        applyTheme('light'); 
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});