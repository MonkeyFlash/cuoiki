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
//xu ly dang ky
btnRegisterSubmit.addEventListener("click",function(x){
    x.preventDefault();
    let user = document.getElementById("reg--user").value.trim();
    let pass = document.getElementById("reg--pass").value.trim();
    //kiemtra rong
     if (user === "" || pass === "") {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
    }
    //Lay danh sach tai khoan tu localStorage
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    //kiem tra ton tai
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
    //Them tai khoan
    accounts.push({username: user, password: pass});
    //Luu lai vao localStorage
    localStorage.setItem("accounts", JSON.stringify(accounts));
    alert("Đăng ký thành công, hãy đăng nhập");
    formLogin.style.transform = 'translateX(0px)';
    formRegister.style.transform = "translateX(400px)";
})
//xu lu dang nhap
btnLoginSubmit.addEventListener("click", function(x){
    x.preventDefault();
    let user = document.getElementById("log--user").value.trim();
    let pass = document.getElementById("log--pass").value.trim();
    //kiemtra rong
     if (user === "" || pass === "") {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
    }
    //Lay danh sach tai khoan tu localStorage
    let accounts = JSON.parse(localStorage.getItem("accounts"))  || [];
    //kiem tra tai khoan va mat khay co trung khop
    let found = false;
    for (let i = 0; i < accounts.length; i++){
        if (accounts[i].username === user && accounts[i].password === pass){
            found = true;
            break;
        }
    }
    if(found) {
        alert("Đăng nhập thành công!!");
        window.location.href = "noidung.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu!!");
    }
});