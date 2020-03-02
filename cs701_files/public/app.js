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

  function login(event){
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {    
    user = result.user;
        document.write(`Hello ${user.email}`);
        console.log(user)   
  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
    } else {
        console.error(errorMessage);
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
