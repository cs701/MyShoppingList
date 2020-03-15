var firebaseConfig = {
    apiKey: "AIzaSyAcrEE3uznG_G3GTBvn52i_3wVOanj1C38",
    authDomain: "my-shopping-list-71329.firebaseapp.com",
    databaseURL: "https://my-shopping-list-71329.firebaseio.com",
    projectId: "my-shopping-list-71329",
    storageBucket: "my-shopping-list-71329.appspot.com",
    messagingSenderId: "841683599724",
    appId: "1:841683599724:web:6057e99e03992449ae7349",
    measurementId: "G-Y3R7LVYJZL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


var db = firebase.firestore();
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

function login(event) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
                user = result.user;
                sessionStorage.setItem("uId", user.uid);
                window.location.href = "main.html";
                var user = firebase.auth().currentUser;

                if (user) {
                    window.alert(user.uid)
                } else {
                    window.alert("user not login")
                }

            }, function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    console.error(errorMessage);
                }
            });

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });


}

function signup(event) {
    event.preventDefault();
    var email = document.getElementById("emailId").value;
    var password = document.getElementById("pwd").value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (result) {
        user = result.user;
        //document.write(`Hello ${user.email}`);
        sessionStorage.setItem("uId", user.uid);
        window.location.href = "main.html";
    }, function (error) {
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

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}

// document.addEventListener("DOMContentLoaded", event => {
//
//     const app = firebase.app();
//     console.log(app);
//
//     const db = firebase.firestore();
//
//     const myPost = db.collection('posts').doc('firstpost');
//
//     myPost.onSnapshot(doc => {
//         const data = doc.data();
//         console.log(data);
//     });
//
//
//     myPost.get()
//         .then(doc => {
//             const data = doc.data();
//             console.log(data);
//         })
//
// });
