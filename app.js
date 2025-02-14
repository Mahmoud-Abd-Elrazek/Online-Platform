const baseUrl = "https://tarmeezacademy.com/api/v1";

function getPosts() {
   var requestOptions = {
      method: 'GET',
      redirect: 'follow'
   };

   fetch(`${baseUrl}/posts?limit=10`, requestOptions)
      .then(response => response.json())
      .then(posts => {
         document.getElementById("posts").innerHTML = "";
         for (const post of posts.data) {
            // todo: Add Tags here
            document.getElementById("posts").innerHTML += createPost(post);
         }
      })
      .catch(error => console.log('error', error));
} getPosts();

// Function To Create Post and Push into the page
function createPost(post) {
   let postImage = post.image;
   let userImage = post.author.profile_image;
   if (typeof post.image === "object")
      postImage = "./placeholders/2.jpg";

   if (typeof post.author.profile_image === "object")
      userImage = "./profile-pics/user-4.png";

   return `
      <div class="card shadow-sm">
         <div class="card-header">
            <img src='${userImage}' style="width: 40px; height: 40px;" alt="profile picture"
               class="rounded-circle border-3">
            <b>@${post.author.username}</b>
         </div>

         <div class="card-body">
            <img src='${postImage}' alt="post img" class="img-fluid">
            <h6 class="mt-1" style="color: rgb(58, 56, 56);">${post.created_at}</h6>
            <h5>${post.title || "Empty"}</h5>
            <p>${post.body}</p>

            <hr>
            <div>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-pen" viewBox="0 0 16 16">
                  <path
                     d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
               </svg>
               <span>
                  ( ${post.comments_count} )Comments
                  <span>
                     <button class = "btn btn-sm rounded-5" style="background:gray; color:#fff"> tag </button>
                  </span>   
               </span>
            </div>
         </div>
      </div>
   `
}

function loginBtnClicked() {
   const username = document.getElementById("username-input").value;
   const password = document.getElementById("password-input").value;

   const params = {
      "username": username,
      "password": password
   }
   const url = "https://tarmeezacademy.com/api/v1/login";
   axios.post(url, params)
      .then((response) => {
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("user", JSON.stringify(response.data.user));

         const modal = document.getElementById("login-modal");
         const modalInstance = bootstrap.Modal.getInstance(modal);
         modalInstance.hide();
         setupUI();
         showAlert("Logged in successfully", "success");
      })
      .catch((er) => {
         showAlert(er.response.data.message, "danger");
      });
}

function registerBtnClicked() {

   const name = document.getElementById("register-name-input").value;
   const username = document.getElementById("register-username-input").value;
   const password = document.getElementById("register-password-input").value;
   const image = document.getElementById("register-image-input").files[0];

   // Form Data
   let formData = new FormData();

   //formData.append(Key Value); 
   formData.append("name", name);
   formData.append("username", username);
   formData.append("password", password);
   formData.append("image", image);


   const headers = {
      "Content-Type": "multipart/form-data", // perfom with form data
   }

   const url = `${baseUrl}/register`;
   axios.post(url, formData, { headers: headers })
      .then((response) => {
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("user", JSON.stringify(response.data.user));

         const modal = document.getElementById("register-modal");
         const modalInstance = bootstrap.Modal.getInstance(modal);
         modalInstance.hide();

         showAlert("New User Register successfully", "success");
         setupUI();
      })
      .catch((er) => {
         showAlert(er.response.data.message, "danger");
      });
}

function logout() {
   localStorage.removeItem("user");
   localStorage.removeItem("token");

   setupUI();
   showAlert("Logged out successfully", "success");
}

function setupUI() {
   const token = localStorage.getItem("token");

   const loginDiv = document.getElementById("logged-in-div");
   const logoutBtn = document.getElementById("logout-div");

   const addBtn = document.getElementById("add-post-btn");

   if (token == null) { // gust 
      loginDiv.setAttribute('style', 'display:flex !important');
      logoutBtn.setAttribute('style', 'display:none !important');
      addBtn.setAttribute('style', 'visibility: hidden !important');
   }
   else { // For Logged in user
      loginDiv.setAttribute('style', 'display:none !important');
      logoutBtn.setAttribute('style', 'display:flex !important');
      addBtn.setAttribute('style', 'visibility: visible; !important');

      const user = getCurrentUser();
      document.getElementById("nav-username").innerHTML = user.name;
      document.getElementById("nav-user-image").src = user.profile_image;
   }
} setupUI(); // call it directly 'Runnig All Time'

function getCurrentUser() {
   let user = localStorage.getItem("user");
   if (user != null) {
      user = JSON.parse(user); // convert it to JSON
   }
   return user;
}

function showAlert(alertMessage, type = 'success') {
   const alertPlaceholder = document.getElementById("success-alert");
   // Create the div element

   let temp = null; // this is a pointer to point the alret div to hide from the DOM without delete the original node
   const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
         `<div class="alert alert-${type} alert-dismissible" role="alert">`,
         `   <div>${message}</div>`,
         '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
         '</div>'
      ].join('')

      alertPlaceholder.append(wrapper)
      temp = wrapper; // save the alret element
   }
   appendAlert(alertMessage, type);

   // todo: hide the alert
   setTimeout(() => {
      temp.setAttribute('style', 'display:none !important'); // after 2 hide the alret without removing 
   }, 2000);

}

function createNewPostClicked() {
   const title = document.getElementById("post-title-input").value;
   const body = document.getElementById("post-body-input").value;

   const image = document.getElementById("post-imgae-input").files[0];

   // Form Data
   let formData = new FormData();
   //formData.append(Key Value); 
   formData.append("body", body);
   formData.append("title", title);
   formData.append("image", image);


   const url = `${baseUrl}/posts`;
   const token = localStorage.getItem("token");
   const headers = {
      "authorization": `Bearer ${token}`
   }
   axios.post(url, formData, {
      "Content-Type": "multipart/form-data", // perfom with form data
      headers: headers
   })
      .then((response) => {
         // Hide The Model After 
         const modal = document.getElementById("create-post-modal");
         const modalInstance = bootstrap.Modal.getInstance(modal);
         modalInstance.hide();
         showAlert("New post has been created susscessfully", "success");
         getPosts();
      })
      .catch((er) => {
         showAlert(er.response.data.message, "danger");
      });
}

