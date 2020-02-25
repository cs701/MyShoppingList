// Google authentication (use google as oAuth provider)
// document.addEventListener("DOMContentLoaded", event => {

//   const app = firebase.app();
//   console.log(app);
// });

// function googleLogin() {
//   const provider = new firebase.auth.GoogleAuthProvider();
  
//   firebase.auth().signInWithPopup(provider)

//     .then(result => {
//       const user = result.user;
//       document.write(`Hello ${user.displayName}`);
//       console.log(user)
//     })
//     .catch(console.log)

// }

// READ: Retrieve and READ the DOCUMENT
// document.addEventListener("DOMContentLoaded", event => {

//   const app = firebase.app();
//   console.log(app);

//   //make a reference to firestore as a variable named db
//   const db = firebase.firestore();

//   //then a reference to the collection, then reference the specific document id with the custome id of firstpost. 
//   const myPost = db.collection('posts').doc('firstpost');

//   myPost.onSnapshot(doc => {
//     const data = doc.data();
//     // document.write( data.title + `<br>`)
//     // document.write( data.views + `<br>` )
//     document.querySelector('#title').innerHTML = data.title;
//   })

//   // myPost.get()
//   // .then(doc => {
//   //   const data = doc.data();
//   //   document.write( data.title + `<br>`)
//   //   document.write( data.views )
//   // })
  
// });

// // UPDATE
// //Set up a function call:
// function updatePost(e) {

//   const db = firebase.firestore()
//   const myPost = db.collection('posts').doc('firstpost');
//   myPost.update({ title: e.target.value })
// }


//Querying multiple documents
// document.addEventListener("DOMContentLoaded", event => {

//   const app = firebase.app();

//   const db = firebase.firestore();
//   //make a reference to the products collection
//   const productsRef = db.collection('products');
//   //get a subset of documents in that collection. We want all the prod's who's price is > $10
//   const query = productsRef.orderBy('price', 'desc'); //No documentation found for .orderBy() alone...
//   //like the document read...
//   query.get()
//     .then(products => {
//       products.forEach(doc => {
//         data = doc.data()
//         document.write(`${data.name} at ${data.price} <br>`);
//       })
//     })

// });

// This simply adds data to the users collection (v simple)
document.addEventListener("DOMContentLoaded", event => {

  const db = firebase.firestore();
  

  //Add a new document in collection "users" - this created a new collection called "cities"
  db.collection("users").doc().set({
    name: "Melissa Wotkins",
    email: "mwotkins@email.com",
    age: 35
  })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch( (error) => {
      console.error("Error writing document: ", error);
    });

});
