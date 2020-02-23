// Google authentication
document.addEventListener("DOMContentLoaded", event => {

  const app = firebase.app();
  console.log(app);
});

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)

    .then(result => {
      const user = result.user;
      document.write(`Hello ${user.displayName}`);
      console.log(user)
    })
    .catch(console.log)

}

function login(){
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
// firebase.auth().signInWithEmailAndPassword(email, password) 
// .then(function(firebaseUser) {
//   // Success 
//   console.log("inisde success..");
// })
// .catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
//   alert(errorCode);
// });

firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
  // [END createwithemail]
  // callSomeFunction(); Optional
  // var user = firebase.auth().currentUser;
  user.updateProfile({
      displayName: username
  }).then(function() {
      // Update successful.
  }, function(error) {
      // An error happened.
  });        
}, function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // [START_EXCLUDE]
  if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
  } else {
      console.error(error);
  }
  // [END_EXCLUDE]
});

}

function signOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}


document.addEventListener("DOMContentLoaded", event => {

  const app = firebase.app();
  console.log(app);

  const db = firebase.firestore();

  const myPost = db.collection('posts').doc('firstpost');

  myPost.onSnapshot(doc => {
    const data = doc.data();
    console.log(data);
  })


  myPost.get()
  .then(doc => {
    const data = doc.data();
    console.log(data);
  })
  
});
