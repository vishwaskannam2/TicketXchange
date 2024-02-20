// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function log_in() {
    var e_mail = document.getElementById("e_mail");
    var p_word = document.getElementById("p_word");
    var e_mail_value = e_mail.value;
    var p_word_value = p_word.value;
    
    console.log(e_mail_value, p_word_value);

    firebase.auth().signInWithEmailAndPassword(e_mail_value, p_word_value)
    .then((res) => {
        console.log(res);
        window.location.assign('category.html');
        
    })

    .catch(function(error) {
        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);

        // ...
    });
}
