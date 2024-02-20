// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function sign_up() {
    var u_name = document.getElementById('u_name').value;
    var e_mail = document.getElementById('e_mail').value;
    var p_word = document.getElementById('p_word').value;

    console.log(e_mail, p_word);

    firebase.auth().createUserWithEmailAndPassword(e_mail, p_word)
    .then((res) => {
        alert("Registration Successfull");
        console.log('res =>', res.user.uid);

        db.collection("users").doc(res.user.uid).set({u_name,e_mail})
        .then(() => {
            console.log("added in db[database]");
        })

        .catch((e) => {
            console.log('error adding in db[database]');
        })
    })

    .catch(function(error) {
        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

        // ...
      });
}

