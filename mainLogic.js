const baseUrl = "https://tarmeezacademy.com/api/v1";
function setupUI() {
   const token = localStorage.getItem("token");

   const loginDiv = document.getElementById("logged-in-div");
   const logoutBtn = document.getElementById("logout-div");

   const addBtn = document.getElementById("add-post-btn");

   if (token == null) { // gust 
      loginDiv.setAttribute('style', 'display:flex !important');
      logoutBtn.setAttribute('style', 'display:none !important');
      if (addBtn != null) {
         addBtn.setAttribute('style', 'visibility: hidden !important');
      }
   }
   else { // For Logged in user
      loginDiv.setAttribute('style', 'display:none !important');
      logoutBtn.setAttribute('style', 'display:flex !important');
      if (addBtn != null) {
         addBtn.setAttribute('style', 'visibility: visible; !important');
      }
      const user = getCurrentUser();
      document.getElementById("nav-username").innerHTML = user.name;
      document.getElementById("nav-user-image").src = user.profile_image;
   }
} setupUI(); // call it directly 'Runnig All Time'


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
         if (typeof er.response == "undefined") {
            showAlert("Check The Internet Connection", "danger");
         }
         else {
            showAlert(er.response.data.message, "danger");
         }
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
