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
var currentPageListItems;
loadAllList();


//object Item
class Item {
    constructor(product, quantity, prioirty, purchased, deleted) {
        this.product = product;
        this.quantity = quantity;
        this.priority = prioirty;
        this.purchased = purchased;
        this.deleted = deleted;
    }

    toString() {
        return this.product + ', ' + this.quantity + ', ' + this.priority + ', ' + this.purchased + ', ' + this.deleted;
    }

    markPurchased() {
        this.purchased = true;
    }
}

// Firestore data converter
const itemConverter = {
    toFirestore: function (item) {
        return {
            product: item.product,
            quantity: item.quantity,
            priority: item.priority,
            purchased: item.purchased,
            deleted: item.deleted
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Item(data.product, data.quantity, data.priority, data.purchased, data.deleted)
    }
}





function addNewItem() {
    var pr = document.getElementById("newItemPrioritySelect").value;
    var pn = document.getElementById("itemName").value;
    var po = document.getElementById("itemNumber").value;

    if (!pn) {
        window.alert("Item name cannot be empty!")
        return
    }
    if (isNaN(po) || po == '' || po == null) {
        po = 1;
    }


    var newAddID;


    db.collection("Item").add({
        product: pn,
        quantity: parseInt(po),
        priority: parseInt(pr),
        purchased: false,
        deleted: false
    }).then(function (docRef) {
        newAddID = docRef.id;

        document.getElementById("newItem_form").reset();

        var table = document.getElementById("userItemList");

        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "cb_newAddID";
        checkbox.id = "cb_newAddID";

        var purchasedButton = document.createElement('button');

        purchasedButton.type = "button";
        purchasedButton.className = 'btn btn-success btn-sm';
        purchasedButton.name = "button_" + newAddID;
        purchasedButton.id = "button_" + newAddID;
        purchasedButton.innerHTML = '<i class="material-icons md-24">done</i>';


        cell1.appendChild(checkbox);
        cell2.appendChild(document.createTextNode(pn));
        cell3.appendChild(document.createTextNode(po));
        cell4.appendChild(document.createTextNode(checkPirority(pr)));
        cell5.appendChild(purchasedButton);

        cell2.id = "cell_" + newAddID;

        document.getElementById("button_" + newAddID).addEventListener("click", function () {
            clickPurchaseButton(newAddID);
        });

    }).catch(function (error) {
        window.error("Error adding document: ", error);
    });





}

function loadAllList() {
    var table = document.getElementById("userItemList");

    db.collection("Item").get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                var product = doc.data();
                var proId = doc.id;

                var proP = product.priority;
                var proPriority = checkPirority(proP);
                var proName = product.product;
                var proQ = product.quantity;
                var proPurchased = product.purchased;
                var proDelete = product.deleted;

                var row = table.insertRow(-1);

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);

                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = "cb_" + proId;
                checkbox.id = "cb_" + proId;

                var purchasedButton = document.createElement('button');

                purchasedButton.type = "button";
                purchasedButton.className = 'btn btn-success btn-sm';
                purchasedButton.name = "button_" + proId;
                purchasedButton.id = "button_" + proId;
                purchasedButton.innerHTML = '<i class="material-icons md-24">done</i>';


                cell1.appendChild(checkbox);
                cell3.appendChild(document.createTextNode(proQ));
                cell4.appendChild(document.createTextNode(proPriority));
                cell2.id = "cell_" + proId;


                if (proPurchased) {
                    var temp = document.createElement("html");
                    temp.innerHTML = proName.strike();
                    cell2.appendChild(temp);
                } else {
                    cell2.appendChild(document.createTextNode(proName));
                    cell5.appendChild(purchasedButton);
                    document.getElementById("button_" + proId).addEventListener("click", function () {
                        clickPurchaseButton(proId);
                    });
                }


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


function clickPurchaseButton(id) {

    var content = document.getElementById("cell_" + id);
    content.innerHTML = content.textContent.strike();

    document.getElementById("button_" + id).remove();

    var item;

    db.collection("Item").doc(id)
        .withConverter(itemConverter)
        .get().then(function (doc) {
        if (doc.exists) {
            item = doc.data();
            item.markPurchased();
            db.collection("Item").doc(id)
                .withConverter(itemConverter)
                .set(item);

        } else {
            console.log("No such document!")
        }
    }).catch(function (error) {
        console.log("Error getting document:", error)
    });


}


$(function () {
    $('#addItem').popover({
        container: 'body'
    })
})