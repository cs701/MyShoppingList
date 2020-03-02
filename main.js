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
loadList();

function loadList() {
    var table = document.getElementById("userItemList");

    db.collection("userlists").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var product = doc.data();
            var proId = doc.id;
            var proP = product.Priority;
            var proPriority = checkPirority(proP);

            var proName = product.Product;
            var proQ = product.Quantity;
            var proPurchased = product.Purchased;

            var row = table.insertRow(-1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "cb_"+proId;
            checkbox.id = "cb_"+proId;

            cell1.appendChild(checkbox);
            cell2.appendChild(document.createTextNode(proName));
            cell3.appendChild(document.createTextNode(proQ));
            cell4.appendChild(document.createTextNode(proPriority));


            console.log("Read: " + proId+ " " + proName + " " + proQ + " " + proP + " " + proPurchased);


        });
    });


}

function checkPirority(i) {
    if (i == 0) {
       return "Low";
    } else if (i == 1) {
        return "Medium";
    } else {
        return "High";
    }
}

function addNewItem() {
    var pr = document.getElementById("newItemPrioritySelect").value;
    var pn = document.getElementById("itemName").value;
    var po = document.getElementById("itemNumber").value;

    if(!pn) {
        window.alert("Item name cannot be empty!")
    }
    if(!isNaN(po) || po == null) {
        po = 1;
    }

    var newAddID;

    db.collection("userlists").add({
        Priority: parseInt(pr),
        Product: pn,
        Purchased: false,
        Quantity: parseInt(po)

    }).then(function(docRef) {
        newAddID = docRef.id;
    }).catch(function(error) {
            window.error("Error adding document: ", error);
        });

    document.getElementById("newItem_form").reset();

    var table = document.getElementById("userItemList");

    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "cb_newAddID";
    checkbox.id = "cb_ID";

    cell1.appendChild(checkbox);
    cell2.appendChild(document.createTextNode(pn));
    cell3.appendChild(document.createTextNode(po));
    cell4.appendChild(document.createTextNode(checkPirority(pr)));



}

$(function () {
    $('#addItem').popover({
        container: 'body'
    })
})