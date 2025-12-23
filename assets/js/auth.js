let btnHeader = document.querySelector("header .btn");
let container = document.querySelector(".container");
let close = document.querySelector(".close");
let formLogin = document.querySelector(".form--login");
let formRegister = document.querySelector(".form--res");
const btnLoginSubmit = formLogin.querySelectorAll('.btn--log--res')[0];
const btnToRegister = formLogin.querySelectorAll('.btn--log--res')[1];
const btnToLogin =formRegister.querySelectorAll('.btn--log--res')[0];
const btnRegisterSubmit = formRegister.querySelectorAll('.btn--log--res')[1];

//an form dang nhap
container.style.display = "none";
//hien form dang nhap
btnHeader.addEventListener("click", function(){
    if (container.style.display ==="none" || container.style.display ===""){
        container.style.display ="flex";
    }
    else{
        container.style.display = "none";
        }
})
//tat form 
close.addEventListener("click", function(){
    container.style.display = "none";
})
//chuyen doi giao dien dang nhap va dang ky
btnToRegister.addEventListener("click",function(x){
    x.preventDefault();
    formLogin.style.transform = 'translateX(400px)';
    formRegister.style.transform = "translateX(0px)";
})
btnToLogin.addEventListener("click",function(x){
    x.preventDefault();
    formLogin.style.transform = 'translateX(0px)';
    formRegister.style.transform = "translateX(400px)";
})

btnRegisterSubmit.addEventListener("click",function(x){
    x.preventDefault();
    let user = document.getElementById("reg--user").value.trim();
    let pass = document.getElementById("reg--pass").value.trim();
    
    // Kiểm tra rỗng
     if (user === "" || pass === "") {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
    }
    
    // LOGIC GÁN ROLE
    let role = 'user';
    if (user.toLowerCase() === 'admin') {
        role = 'admin';
    }
    
    // Lấy ngày hiện tại ở định dạng yyyy-mm-dd
    const dateCreated = new Date().toISOString().split('T')[0];

    // Lay danh sach tai khoan tu localStorage
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    
    // Kiem tra ton tai
    let tontai = false;
    for (let i=0; i<accounts.length; i++){
        if(accounts[i].username === user){
            tontai=true;
            break;
        }
    }
    if(tontai){
        alert("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác nhé!");
        return;
    }
    
    // Them tai khoan (Bổ sung role và dateCreated vào object)
    accounts.push({
        username: user, 
        password: pass,
        role: role, 
        dateCreated: dateCreated
    });
    
    // Luu lai vao localStorage
    localStorage.setItem("accounts", JSON.stringify(accounts));
    alert(`Đăng ký thành công với vai trò: ${role}! Ngày tạo: ${dateCreated}. Hãy đăng nhập`);
    formLogin.style.transform = 'translateX(0px)';
    formRegister.style.transform = "translateX(400px)";
})

btnLoginSubmit.addEventListener("click", function(x){
    x.preventDefault();
    let user = document.getElementById("log--user").value.trim();
    let pass = document.getElementById("log--pass").value.trim();
    
    // Kiem tra rong
     if (user === "" || pass === "") {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
    }
    
    // Lay danh sach tai khoan tu localStorage
    let accounts = JSON.parse(localStorage.getItem("accounts"))  || [];
    
    // Kiem tra tai khoan va mat khau co trung khop
    let foundAccount = null;
    for (let i = 0; i < accounts.length; i++){
        if (accounts[i].username === user && accounts[i].password === pass){
            foundAccount = accounts[i];
            break;
        }
    }
    
    if(foundAccount) {
        alert("Đăng nhập thành công!!");
        
        localStorage.setItem('loggedInUser', foundAccount.username); 
        localStorage.setItem('loggedInUserRole', foundAccount.role); 
        
        //neu la adim se toi trang admin, user thi toi trang cua user
        if(foundAccount.role === "admin"){
            window.location.href = "/quanly.html";
        } else {
            window.location.href ="/noidung.html";
        }
    } else {
        alert("Sai tài khoản hoặc mật khẩu!!");
    }
});