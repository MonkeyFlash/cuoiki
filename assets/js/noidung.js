const loggedInUser = localStorage.getItem('loggedInUser');
const helloElement = document.querySelector('.hello');
const btnLogout = document.querySelector('.logout');

// Form Thêm Bài Viết
const saveButton = document.querySelector('.save');
const titleInput = document.getElementById('post-title');
const topicInput = document.getElementById('post-topic');
const descriptionInput = document.getElementById('post-description');
const visibilitySelect = document.getElementById('post-visibility');
const contentTextarea = document.getElementById('post-content');
const refreshButton = document.querySelector('.refresh');

// Danh sách Bài Viết
const postsContainer = document.querySelector('.card.right').lastElementChild.parentElement; // Cha của các bài viết
const postTemplate = document.querySelector('.posted'); 
const searchInput = document.querySelector('.search');
const topicSelect = document.querySelector('.topic-select');
const postFormCard = document.querySelector('.card.left'); // Thêm để kiểm soát quyền Admin

// Modal Xem Chi Tiết
const viewOverlay = document.querySelector('.overlay:not(.edit-overlay)');
const viewPopupContent = document.querySelector('.overlay:not(.edit-overlay) .popup-content');
const closeViewPopup = document.querySelector('.overlay:not(.edit-overlay) .close-popup');

// Modal Sửa Bài Viết
const editOverlay = document.querySelector('.edit-overlay');
const editForm = document.getElementById('edit-form');
const editPostIdInput = document.getElementById('edit-post-id');
const editTitleInput = document.getElementById('edit-title');
const editTopicInput = document.getElementById('edit-topic');
const editDescriptionInput = document.getElementById('edit-description');
const editVisibilitySelect = document.getElementById('edit-visibility');
const editContentTextarea = document.getElementById('edit-content');
const closeEditPopup = document.querySelector('.edit-close-popup');
const cancelEditButton = document.querySelector('.cancel-edit');


// === CÁC HÀM KIỂM TRA QUYỀN VÀ VAI TRÒ ===

function getCurrentUserRole() {
    const users = JSON.parse(localStorage.getItem('accounts')) || [];
    const currentUserData = users.find(u => u.username === loggedInUser);
    return currentUserData ? currentUserData.role : 'user'; 
}

function isAdmin() {
    return getCurrentUserRole() === 'admin';
}

// 1. CHỨC NĂNG CƠ BẢN (USER & POSTS)

// Hàm lấy tất cả bài viết đã lưu
const getPosts = () => {
    return JSON.parse(localStorage.getItem('posts')) || [];
};

// Kiểm tra đăng nhập và hiển thị tên người dùng
if (loggedInUser) {
    const role = isAdmin() ? 'Admin' : 'Người dùng';
    helloElement.textContent = `Xin chào, ${loggedInUser}! (Vai trò: ${role})`;

    // Phân quyền Admin: Ẩn Form Thêm/Sửa nội dung cho Admin
    if (isAdmin()) {
        // Admin chỉ có quyền xóa, không có quyền đăng/sửa bài
        postFormCard.style.display = 'none'; 
    } else {
        // Chỉ User mới được dùng Form đăng bài
        postFormCard.style.display = 'block'; 
    }
} else {
    alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
    window.location.href = "/"; 
}

// Xử lý Đăng xuất
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = "/"; 
});

// Xử lý Làm mới form
refreshButton.addEventListener('click', () => {
    titleInput.value = '';
    topicInput.value = '';
    descriptionInput.value = '';
    contentTextarea.value = '';
    visibilitySelect.value = 'Công khai';
});


// Xử lý Thêm Bài Viết
saveButton.addEventListener('click', (e) => {
    e.preventDefault(); 

    // CHẶN: Admin không có quyền đăng bài
    if (isAdmin()) {
        alert("Admin không có quyền đăng bài viết mới.");
        return;
    }
    
    const title = titleInput.value.trim();
    const topic = topicInput.value.trim();
    const description = descriptionInput.value.trim();
    const visibility = visibilitySelect.value;
    const content = contentTextarea.value.trim();
    
    if (!title || !topic || !content) {
        alert("Vui lòng nhập đầy đủ Tiêu đề, Chủ đề và Nội dung chi tiết.");
        return;
    }
    
    const newPost = {
        id: Date.now(), 
        title: title,
        topic: topic,
        description: description,
        visibility: visibility,
        content: content,
        author: loggedInUser, 
        date: new Date().toISOString(), 
        likes: 0,
        comments: []
    };
    
    let posts = getPosts();
    posts.push(newPost);
    
    localStorage.setItem('posts', JSON.stringify(posts));
    alert("Bài viết đã được lưu thành công!");
    
    refreshButton.click(); 
    displayPosts(posts); // Cập nhật danh sách hiển thị
});


// 2. HIỂN THỊ DANH SÁCH BÀI VIẾT (VÀ GẮN SỰ KIỆN)

function displayPosts(postsToShow) {
    // 1. Xóa các bài viết cũ (giữ lại template)
    let currentPosts = document.querySelectorAll('.card.right .posted');
    currentPosts.forEach(post => {
        if (post !== postTemplate) {
            post.remove();
        }
    });
    
    if (postsToShow.length === 0) {
        const noPostMessage = document.createElement('p');
        noPostMessage.textContent = "Chưa có bài viết nào phù hợp.";
        postsContainer.appendChild(noPostMessage);
        return;
    }

    // Lọc theo Quyền riêng tư (Chỉ hiển thị bài riêng tư cho chính tác giả)
    const visiblePosts = postsToShow.filter(post => {
        // Nếu là 'Công khai', hiển thị cho tất cả
        if (post.visibility === 'Công khai') {
            return true;
        }
        // Nếu là 'Riêng tư', chỉ hiển thị cho chính tác giả và admin
        if (post.visibility === 'Riêng tư' && (post.author === loggedInUser || isAdmin())) {
            return true;
        }
        // Nếu là 'Riêng tư' và không phải tác giả, ẩn
        return false;
    });

    // 2. Duyệt qua từng bài viết mới
    visiblePosts.forEach(post => {
        const postElement = postTemplate.cloneNode(true); 
        
        postElement.querySelector('h1').textContent = post.title;
        postElement.querySelector('h3').textContent = post.topic;
        
        const dateObj = new Date(post.date);
        const formattedDate = dateObj.toLocaleDateString('vi-VN') + ' vào lúc ' + dateObj.toLocaleTimeString('vi-VN');
        
        postElement.querySelector('.info .tt').textContent = `Ngày đăng: ${formattedDate}`;
        postElement.querySelector('.info span:nth-of-type(3)').textContent = `❤️ Lượt thích: ${post.likes}`;
        postElement.querySelector('.info span:nth-of-type(4)').textContent = `💬 Bình luận: ${post.comments.length}`;
        postElement.querySelector('.info .trangthai').textContent = `Đây là bài viết ${post.visibility.toLowerCase()} bởi ${post.author}`;
        
        // Gán sự kiện và ID cho các nút
        const viewBtn = postElement.querySelector('.chitiet');
        const editBtn = postElement.querySelector('.sua');
        const deleteBtn = postElement.querySelector('.xoa');
        
        viewBtn.addEventListener('click', () => showPostDetails(post.id));
        editBtn.addEventListener('click', () => prepareEdit(post.id));
        deleteBtn.addEventListener('click', () => deletePost(post.id));

        // Ẩn/Hiện nút Sửa/Xóa dựa trên vai trò và quyền sở hữu
        
        // Nút Sửa: Chỉ hiện nếu là tác giả
        if (post.author !== loggedInUser) {
            editBtn.style.display = 'none';
        } else {
            editBtn.style.display = 'inline-block';
        }
        
        // Nút Xóa: Hiện nếu là tác giả HOẶC là Admin
        if (post.author !== loggedInUser && !isAdmin()) {
            deleteBtn.style.display = 'none';
        } else {
            deleteBtn.style.display = 'inline-block';
        }
        
        // Quan trọng: Admin chỉ được XÓA, không được SỬA bài của người khác
        if (isAdmin() && post.author !== loggedInUser) {
             editBtn.style.display = 'none';
        }
        
        postElement.style.display = 'block'; 
        postsContainer.appendChild(postElement);
    });
}


// 3. LỌC & TÌM KIẾM

function filterAndSearchPosts() {
    let posts = getPosts();
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedTopic = topicSelect.value.trim();
    
    // 1. Lọc theo Tiêu đề (Tìm kiếm)
    let filteredPosts = posts.filter(post => {
        return post.title.toLowerCase().includes(searchTerm);
    });

    // 2. Lọc theo Chủ đề (Select Box)
    if (selectedTopic !== 'Tất cả chủ đề') {
        filteredPosts = filteredPosts.filter(post => {
            return post.topic === selectedTopic;
        });
    }

    // 3. Hiển thị kết quả (Hàm displayPosts sẽ xử lý lọc quyền riêng tư)
    displayPosts(filteredPosts);
    updateTopicOptions(posts); 
}

// Cập nhật Chủ đề trong ô chọn (Select Box)
function updateTopicOptions(allPosts) {
    const topics = new Set(allPosts.map(post => post.topic).filter(Boolean)); // Lấy chủ đề độc nhất
    
    // Xóa hết các option cũ, giữ lại "Tất cả chủ đề"
    topicSelect.innerHTML = '<option selected>Tất cả chủ đề </option>';
    
    // Thêm các chủ đề mới vào
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.textContent = topic;
        topicSelect.appendChild(option);
    });
}

// Gắn sự kiện tìm kiếm và lọc
searchInput.addEventListener('input', filterAndSearchPosts);
topicSelect.addEventListener('change', filterAndSearchPosts);


// 4. XỬ LÝ XEM CHI TIẾT (MODAL)

function showPostDetails(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return;

    // KIỂM TRA QUYỀN RIÊNG TƯ: Nếu là Riêng tư VÀ không phải tác giả, không cho xem
    if (post.visibility === 'Riêng tư' && post.author !== loggedInUser) {
         alert("Bạn không có quyền xem bài viết riêng tư này.");
         return; 
    }

    const likedByArray = post.likedBy || [];
    
    const dateObj = new Date(post.date);
    const formattedDate = dateObj.toLocaleDateString('vi-VN') + ' vào lúc ' + dateObj.toLocaleTimeString('vi-VN');

    // Kiểm tra trạng thái thích của người dùng hiện tại
    const isLiked = likedByArray.includes(loggedInUser); 
    const likeButtonText = isLiked ? "❤️ Đã thích (Hủy)" : "❤️ Thích";
    const likeButtonClass = isLiked ? "like-btn liked a" : "like-btn a";

    // Tạo HTML cho danh sách bình luận (Giữ nguyên)
    const commentsHtml = post.comments.length > 0 ? 
        post.comments.map(cmt => 
            `<p><strong>${cmt.author}</strong> (${new Date(cmt.date).toLocaleDateString()}): ${cmt.text}</p>`
        ).join('') :
        '<p>Chưa có bình luận nào.</p>';

    // Cập nhật nội dung modal
    viewPopupContent.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Ngày đăng:</strong> ${formattedDate} bởi ${post.author}</p>
        <p><strong>Chủ đề:</strong> ${post.topic}</p>
        <p><strong>Mô tả ngắn:</strong> ${post.description || 'Không có'}</p>
        <hr>
        <div style="white-space: pre-wrap; margin-bottom: 15px;">${post.content}</div>
        <hr>
        <div class ="like">
            <button class ="${likeButtonClass}" data-post-id="${postId}">${likeButtonText}</button>
            <span class ="like-count a">${post.likes || 0} Lượt thích</span>
        </div>
        <h3>Bình luận (${post.comments.length})</h3>
        <div class="comments-list">${commentsHtml}</div>
        
        <div class ="cmt">
            <textarea placeholder ="Viết bình luận..." rows="4" id="comment-textarea"></textarea>
            <button class ="cmt-btn a" data-post-id="${postId}">Gửi bình luận</button>
        </div>
    `;

    // GẮN SỰ KIỆN CHO NÚT THÍCH và BÌNH LUẬN 
    const likeButton = viewPopupContent.querySelector('.like-btn');
    likeButton.addEventListener('click', () => handleLike(postId));

    const commentButton = viewPopupContent.querySelector('.cmt-btn');
    const commentTextarea = viewPopupContent.querySelector('#comment-textarea');
    
    commentButton.addEventListener('click', () => {
        handleAddComment(postId, commentTextarea.value);
    });

    viewOverlay.classList.add("show");
}

closeViewPopup.addEventListener("click", function() {
    viewOverlay.classList.remove("show");
});


// 5. XỬ LÝ SỬA BÀI VIẾT (MODAL)

function prepareEdit(postId) {
    const posts = getPosts();
    // Chuyển postId về số
    const post = posts.find(p => p.id === postId); 

    if (!post) return;

    // KIỂM TRA QUYỀN SỬA: Chỉ cho phép tác giả sửa bài viết của mình
    if (post.author !== loggedInUser) {
        alert("Bạn chỉ có thể sửa bài viết của chính mình.");
        return;
    }

    // Đổ dữ liệu vào Form Sửa
    editPostIdInput.value = post.id;
    editTitleInput.value = post.title;
    editTopicInput.value = post.topic;
    editDescriptionInput.value = post.description;
    editVisibilitySelect.value = post.visibility;
    editContentTextarea.value = post.content;
    
    editOverlay.classList.add("show");
}

// Xử lý Lưu thay đổi
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const postIdToEdit = Number(editPostIdInput.value);
    
    let posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postIdToEdit);
    const post = posts[postIndex];
    
    // Kiểm tra quyền lại một lần nữa
    if (postIndex === -1 || post.author !== loggedInUser) {
        alert("Không tìm thấy bài viết hoặc bạn không có quyền sửa.");
        return;
    }
    
    // Cập nhật thông tin bài viết
    posts[postIndex].title = editTitleInput.value.trim();
    posts[postIndex].topic = editTopicInput.value.trim();
    posts[postIndex].description = editDescriptionInput.value.trim();
    posts[postIndex].visibility = editVisibilitySelect.value;
    posts[postIndex].content = editContentTextarea.value.trim();
    
    localStorage.setItem('posts', JSON.stringify(posts));
    alert("Cập nhật bài viết thành công!");
    
    // Đóng modal và hiển thị lại danh sách
    editOverlay.classList.remove("show");
    displayPosts(posts);
});

// Xử lý Đóng modal Sửa
closeEditPopup.addEventListener("click", () => editOverlay.classList.remove("show"));
cancelEditButton.addEventListener("click", () => editOverlay.classList.remove("show"));


// 6. XỬ LÝ XÓA BÀI VIẾT

function deletePost(postId) {
    let posts = getPosts();
    const postToDelete = posts.find(p => p.id === postId);

    if (!postToDelete) return;

    // KIỂM TRA QUYỀN XÓA: Hoặc là tác giả, hoặc là Admin
    if (postToDelete.author !== loggedInUser && !isAdmin()) {
        alert("Bạn không có quyền xóa bài viết này.");
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        return;
    }

    // Lọc ra các bài viết KHÔNG có ID cần xóa
    const updatedPosts = posts.filter(p => p.id !== postId);

    // Lưu lại mảng mới vào localStorage
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    alert("Bài viết đã được xóa thành công!");

    // Hiển thị lại danh sách
    displayPosts(updatedPosts);
}


// 7. XỬ LÝ THÍCH VÀ BÌNH LUẬN

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function handleLike(postId) {
    let posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId); 

    if (postIndex !== -1) {
        const post = posts[postIndex];

        if (!post.likedBy) {
            post.likedBy = [];
        }
        
        const userIndex = post.likedBy.indexOf(loggedInUser); 

        if (userIndex === -1) {
            // Trường hợp 1: CHƯA THÍCH -> Thực hiện THÍCH (LIKE)
            post.likedBy.push(loggedInUser); // Thêm tên người dùng vào danh sách
            post.likes = post.likedBy.length; // Cập nhật số lượt thích
            alert("Bạn đã thích bài viết này!");
        } else {
            // Trường hợp 2: ĐÃ THÍCH -> Thực hiện HỦY THÍCH (UNLIKE)
            post.likedBy.splice(userIndex, 1); // Xóa tên người dùng khỏi danh sách
            post.likes = post.likedBy.length; // Cập nhật số lượt thích
            alert("Bạn đã hủy thích bài viết này.");
        }
        
        savePosts(posts); // Lưu lại
        
        // Cập nhật giao diện
        viewOverlay.classList.remove("show"); 
        displayPosts(posts); // Cập nhật danh sách bên ngoài
        showPostDetails(postId); // Mở lại modal với trạng thái mới
    }
}

function handleAddComment(postId, commentText) {
    if (commentText.trim() === '') {
        alert("Vui lòng nhập nội dung bình luận.");
        return;
    }

    let posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        const newComment = {
            author: loggedInUser,
            text: commentText.trim(),
            date: new Date().toISOString()
        };
        posts[postIndex].comments.push(newComment);
        savePosts(posts); 

        viewOverlay.classList.remove("show"); 
        displayPosts(posts); 
        showPostDetails(postId); 
    }
}

filterAndSearchPosts();