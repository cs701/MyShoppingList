var uid = sessionStorage.getItem('uId');
var checkedList = [];
var sortKey = 'id';
var items = [];
var listType = 'not';
document.getElementById("deleteButton").style.visibility = "hidden";
document.getElementById("logoutButton").style.visibility = "hidden";


if (!uid) {
    window.location.href = "index.html";

}

loadUserInfo(uid);
loadAllList(listType);


//object Item
class Item {
    constructor(product, quantity, prioirty, purchased, deleted, uid) {
        this.product = product;
        this.quantity = quantity;
        this.priority = prioirty;
        this.purchased = purchased;
        this.deleted = deleted;
        this.uid = uid;
    }

    toString () {
        return this.product + ', ' + this.quantity + ', ' + this.priority + ', ' + this.purchased + ', ' + this.deleted;
    }

    markPurchased () {
        this.purchased = true;
    }

    markDeleted () {
        this.deleted = true;
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
            deleted: item.deleted,
            uid: item.uid
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Item(data.product, data.quantity, data.priority, data.purchased, data.deleted, data.uid)
    }
};

function loadUserInfo(id) {

    db.collection("User").doc(id).get().then(function (doc) {
        if (doc.exists) {
            var currentUser = doc.data();
            console.log("Current User: " + id + " -- fName:" + currentUser.fName);
            $("#userFirstName").text(currentUser.fName + "'s Shopping List");
            document.getElementById("logoutButton").style.visibility = "visible";
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

}


function addMoreButton () {

    var table = document.getElementById("userItemList");
    document.getElementById("addMoreButton").style.visibility = "hidden";


    var row = table.insertRow(-1);

    row.id = "newItemRow";

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);


    var cancelNewItemButton = document.createElement('button');
    cancelNewItemButton.type = 'button';
    cancelNewItemButton.id = 'cancelNewItemButton';
    cancelNewItemButton.className = 'btn btn-sm btn-outline-danger';
    cancelNewItemButton.innerHTML = "x";


    var newItemNameInput = document.createElement('input');

    newItemNameInput.type = 'input';
    newItemNameInput.className = 'form-control';
    newItemNameInput.placeholder = 'Item Name';
    newItemNameInput.name = "newItemNameInput";
    newItemNameInput.id = "newItemNameInput";


    var newItemNumberInput = document.createElement('input');

    newItemNumberInput.type = 'input';
    newItemNumberInput.className = 'form-control';
    newItemNumberInput.placeholder = 'Quantity';
    newItemNumberInput.name = "newItemNumberInput";
    newItemNumberInput.id = "newItemNumberInput";

    var newItemPrioritySelect = document.createElement('select');

    newItemPrioritySelect.type = 'input';
    newItemPrioritySelect.className = 'form-control custom-select';
    newItemPrioritySelect.name = "newItemPrioritySelect";
    newItemPrioritySelect.id = "newItemPrioritySelect";

    var prOption1 = document.createElement('option');
    prOption1.value = "2";
    prOption1.appendChild(document.createTextNode("Priority"));


    var prOption2 = document.createElement('option');
    prOption2.value = "0";
    prOption2.appendChild(document.createTextNode("Low"));

    var prOption3 = document.createElement('option');
    prOption3.value = "1";
    prOption3.appendChild(document.createTextNode("Medium"));
    var prOption4 = document.createElement('option');
    prOption4.value = "2";
    prOption4.appendChild(document.createTextNode("High"));


    newItemPrioritySelect.appendChild(prOption1);
    newItemPrioritySelect.appendChild(prOption2);
    newItemPrioritySelect.appendChild(prOption3);
    newItemPrioritySelect.appendChild(prOption4);


    var addNewButton = document.createElement('button');

    addNewButton.type = "button";
    addNewButton.className = 'btn btn-primary btn-secondary';
    addNewButton.innerHTML = "+";
    addNewButton.id = "addNewButton";

    cell1.appendChild(cancelNewItemButton);
    cell2.appendChild(newItemNameInput);
    cell3.appendChild(newItemNumberInput);
    cell4.appendChild(newItemPrioritySelect);
    cell5.appendChild(addNewButton);


    document.getElementById("addNewButton").addEventListener("click", function () {
        addNewItem();
    });
    document.getElementById("cancelNewItemButton").addEventListener("click", function () {
        var table = document.getElementById("userItemList");
        var tableRowCount = table.rows.length;
        table.deleteRow(tableRowCount - 1);
        document.getElementById("addMoreButton").style.visibility = "visible";

    });


}




function addNewItem () {


    var pr = document.getElementById("newItemPrioritySelect").value;
    var pn = document.getElementById("newItemNameInput").value.toLowerCase();
    var po = document.getElementById("newItemNumberInput").value;

    if (!pn) {
        window.alert("Item name cannot be empty!");
        return
    }
    if (isNaN(po) || po == '' || po == null) {
        po = 1;
    }


    var newAddID;
    db.collection("Item").where('uid', '==', uid).where('product', '==', pn).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            db.collection("Item").withConverter(itemConverter)
                .add(new Item(pn, parseInt(po), parseInt(pr), false, false, uid))
                .then(function (docRef) {
                newAddID = docRef.id;

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
                //purchasedButton.innerHTML = '<i class="material-icons md-24">done</i>';
                purchasedButton.innerHTML = "&#x2713";

                    var temp = document.createElement('html');
                    temp.className = 'capitalize';
                    temp.innerHTML = pn;

                cell1.appendChild(checkbox);
                    cell2.appendChild(temp);
                cell3.appendChild(document.createTextNode(po));
                cell4.appendChild(document.createTextNode(checkPirority(pr)));
                cell5.appendChild(purchasedButton);

                cell2.id = "cell_" + newAddID;

                document.getElementById("button_" + newAddID).addEventListener("click", function () {
                    clickPurchaseButton(newAddID);
                });

                checkbox.addEventListener("click", function () {
                    if (checkbox.checked) {
                        addToList(newAddID, checkedList);
                    } else {
                        removefromListByItem(newAddID, checkedList);
                    }
                    if (isEmptyList(checkedList)) {
                        document.getElementById("deleteButton").style.visibility = "hidden";
                    } else {
                        document.getElementById("deleteButton").style.visibility = "visible";
                    }

                });
                //delete the adding new Item row
                document.getElementById("addMoreButton").style.visibility = "visible";
                var table = document.getElementById("userItemList");
                var tableRowCount = table.rows.length;
                table.deleteRow(tableRowCount - 2);


            }).catch(function (error) {
                console.log("Error adding document: ", error);
            });
        } else {
            var itemId = querySnapshot.docs[0].id;
            var item = querySnapshot.docs[0].data();

            if (item.deleted || item.purchased) {
                item.deleted = false;
                item.purchased = false;
                item.quantity = parseInt(po);
                item.priority = parseInt(pr);
            } else {
                item.quantity += parseInt(po);
                item.priority = parseInt(pr);
            }

            db.collection("Item").doc(itemId)
                .withConverter(itemConverter)
                .set(item)
                .then(function () {
                    clearList();
                })
                .then(function () {
                    loadAllList(listType);
                    document.getElementById("addMoreButton").style.visibility = "visible"
                });


        }

    })



}


function loadAllList(argu) {
    items = [];
    listType = argu;

    if (listType === 'all') {

        db.collection("Item").where("uid", "==", uid).where("deleted", "==", false)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    items.push(Object.assign({}, doc.data(), {id: doc.id}));
                });
            })
            .then(function () {
                clearList();
                document.getElementById("buttonWaitingList").className = "btn btn-sm btn-outline-secondary";
                document.getElementById("buttonAll").className = "btn btn-sm btn-secondary";
            })
            .then(function () {
                renderList();
            });

    } else {
        db.collection("Item").where("uid", "==", uid).where("deleted", "==", false).where("purchased", "==", false)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    items.push(Object.assign({}, doc.data(), {id: doc.id}));
                });
            })
            .then(function () {
                clearList();
                document.getElementById("buttonAll").className = "btn btn-sm btn-outline-secondary";
                document.getElementById("buttonWaitingList").className = "btn btn-sm btn-secondary";
            })
            .then(function () {
                renderList();
            });
    }


}

function clearList() {

    var table = document.getElementById("userItemList");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }


}


function renderList() {
    var table = document.getElementById("userItemList");

    items.sort((a, b) => {
        if (a[sortKey] > b[sortKey]) {
            return -1;
        } else if (a[sortKey] < b[sortKey]) {
            return 1
        }
        return 0;
    });

    items.forEach(function (product) {

        var proId = product.id;

        var proP = product.priority;
        var proPriority = checkPirority(proP);
        var proName = product.product;
        var proQ = product.quantity;
        var proPurchased = product.purchased;

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
        purchasedButton.className = 'btn btn-success btn-sm btnPurchaseLine';
        purchasedButton.name = "button_" + proId;
        purchasedButton.id = "button_" + proId;
        purchasedButton.innerHTML = "&#x2713";

        cell1.appendChild(checkbox);
        cell3.appendChild(document.createTextNode(proQ));
        cell4.appendChild(document.createTextNode(proPriority));
        cell2.id = "cell_" + proId;

        var temp = document.createElement("html");
        temp.className = 'capitalize';

        if (proPurchased) {
            temp.innerHTML = proName.strike();
            cell2.appendChild(temp);
        } else {
            temp.innerHTML = proName;
            cell2.appendChild(temp);
            purchasedButton.addEventListener("click", function () {
                clickPurchaseButton(proId);
            });
            cell5.appendChild(purchasedButton);
        }

        checkbox.addEventListener("click", function () {
            if (checkbox.checked) {
                addToList(proId, checkedList);
            } else {
                removefromListByItem(proId, checkedList);
            }
            if (isEmptyList(checkedList)) {
                document.getElementById("deleteButton").style.visibility = "hidden";
            } else {
                document.getElementById("deleteButton").style.visibility = "visible";
            }
        });

    });


}

function checkPirority (i) {
    if (i == 0) {
        return "Low";
    } else if (i == 1) {
        return "Medium";
    } else {
        return "High";
    }
}

function addToList (item, list) {
    list.push(item);

}

function removefromListByItem (item, list) {
    list.splice(list.indexOf(item), 1);
}

function isEmptyList (list) {
    if (list.length == 0) {
        return true;
    } else {
        return false;
    }
}


function clickPurchaseButton (id) {

    var content = document.getElementById("cell_" + id);
    content.innerHTML = content.textContent.strike();
    content.className = 'capitalize';

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


function deleteChecked () {
    checkedList.forEach(markDeleteFormDB);

}

function markDeleteFormDB (id) {
    console.log(id);
    db.collection("Item").doc(id)
        .withConverter(itemConverter)
        .get().then(function (doc) {
        if (doc.exists) {
            item = doc.data();
            item.markDeleted();
            db.collection("Item").doc(id)
                .withConverter(itemConverter)
                .set(item)
                .then(function () {
                loadAllList(listType);
            });

        } else {
            console.log("No such document!")
        }
    }).catch(function (error) {
        console.log("Error getting document:", error)
    });


}

function sortBy (key) {
    sortKey = key;
    loadAllList(listType);

}


$(function () {
    $('#addItem').popover({
        container: 'body'
    })
});
