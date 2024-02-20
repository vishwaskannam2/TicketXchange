
var db = firebase.firestore();
const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
}



//   var cache = new Array();

// if (localStorage.getItem('uid')) {
//   for (var a = 0; a < catagoriesArray.length; a++) {
//     firebase.firestore().collection('Favorite').doc(localStorage.getItem('uid')).collection(catagoriesArray[a]).get()
//       .then(docs => {
//         docs.forEach(elems => {
//           cache.push(elems.data());
//         })
//       })
//   }
// }

setTimeout(function () {
  var JSONReadyFav = JSON.stringify(cache);
  localStorage.setItem('myFavs', JSONReadyFav);
}, 5000);

var JSONParseFav = JSON.parse(localStorage.getItem('myFavs'));

window.addEventListener('load', function(e) {
    if (navigator.onLine) {
      console.log('You are online!');
    } else {
        alert("You Are Offline" )
    }
  }, false);
  
  window.addEventListener('online', function(e) {
   
    alert("You Are Online" )
  }, false);
  
  window.addEventListener('offline', function(e) {
       alert("You Are Offline" )
  }, false);

function signUp() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log(email, password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (res) {
       
        console.log('res =>', res.user.uid);
        messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
                return messaging.getToken()
            }).then(function(currentToken) {

                var tokenid = currentToken

                db.collection('users').doc(res.user.uid).set({ name, email,token: tokenid })
                
                    localStorage.setItem('currentToken', currentToken);
                    console.log('currentToken', currentToken);
                    alert('Registered Successfully!');
                    //window.location.assign("dashboard.html");

            }).catch(function(err) {
                alert('Please allow notification to continue');
                console.log('Unable to get permission to notify.', err);
            });

            messaging.onMessage((payload) => {
                console.log('payload', payload)
            });
       
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
        // ...
    });
}

function signIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res)
        console.log(firebase.auth().currentUser.uid)
        messaging.requestPermission().then(function() {
                console.log('Notification permission granted.');
                return messaging.getToken()
            }).then(function(currentToken) {

                var tokenid = currentToken

                db.collection('users').doc(res.user.uid).update({ token: tokenid })
                
                    localStorage.setItem('currentToken', currentToken);
                    console.log('currentToken', currentToken);
                    localStorage.setItem('uid', firebase.auth().currentUser.uid);
                    alert("SignIn successfull");
                  //  window.location.assign("dashboard.html");
                    var serviceForm = document.getElementById('service-form');
                    serviceForm.className = "";

            }).catch(function(err) {
                alert('Please allow notification to continue');
                console.log('Unable to get permission to notify.', err);
            });

            messaging.onMessage((payload) => {
                console.log('payload', payload)
            });
        window.location.assign("index.html");
        
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
        // ...
    });
}

function logout() {


    firebase.auth().signOut()
    .then(function() {
        window.location.assign("index.html");
        console.log(userUid);
        alert()
        console.log(firebase.auth().currentUser.uid);
    })
    .catch(function(error) {
      console.log(error)
    });

    
}

//check user is signIn or not
function check(){
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location.assign("dashboard.html")
  } else {
    // No user is signed in.
    window.location.assign("logIn.html");
  }
});
}


function addad() {
    var category = document.getElementById('category').value;
    var title = document.getElementById('title').value;
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var city = document.getElementById('city').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    
    if (category == "" || title == "" || name == "" || phone == "" || city == "" || description == "") {
        alert('Please fill all the fields');
    } else {
        db.collection('Ads').add({ 
            category, 
            title, 
            name, 
            phone, 
            city, 
            description, 
            price, 
            uid: firebase.auth().currentUser.uid
        })
        .then(res => {
            console.log('Firestore document ID:', res.id);
            localStorage.setItem('Ad_id', res.id);
            // localStorage.setItem('User_id', id); // Assuming 'id' is another variable you want to set
            alert("Ad uploaded successfully");
            document.getElementById('category').value = "";
            document.getElementById('title').value = "";
            document.getElementById('name').value = "";
            document.getElementById('phone').value = "";
            document.getElementById('city').value = "";
            document.getElementById('description').value = "";
            document.getElementById('price').value = "";
        })
        .catch(function(error){
            console.error('Error adding document: ', error);
            alert('Error in uploading');
        });
    }
}

   
function search() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var ads = document.getElementById('ad');
    var search = document.getElementById('search12').value.toLowerCase();
    ads.innerHTML = "";

    var heading = document.createElement('h1');
    heading.textContent = search + " Ads";
    ads.appendChild(heading);

    var hr1 = document.createElement('hr');
    ads.appendChild(hr1);

    db.collection("Ads")
        .where("category", "==", search)
        .get()
        .then((querySnapshot) => {
            var fragment = document.createDocumentFragment();

            querySnapshot.forEach((doc) => {
                var adData = doc.data();

                var row = document.createElement('div');
                row.classList.add('row');

                var div1 = document.createElement('div');
                div1.classList.add('col-md-3', 'col-sm-4');

                var div2 = document.createElement('div');
                div2.classList.add('col-md-8', 'col-sm-8');
                

                var h11 = document.createElement('h1');
                h11.textContent = "Title: " + adData.title;

                var h12 = document.createElement('h3');
                h12.textContent = 'Name: ' + adData.name;



                var h15 = document.createElement('h5');
                h15.textContent = 'description: ' + adData.description;

                var h16 = document.createElement('h5');
                h16.textContent = 'price:  ' + adData.price;

               

                var button = document.createElement('input');
                button.type = 'button';
                button.value = 'VIEW';
                button.classList.add('chat-btn');
                button.dataset.toggle = 'modal';
                button.dataset.target = '#myModal';
                button.addEventListener('click', function() {
                    DisplayAdd(doc.id);
                });

                fragment.appendChild(row);
                row.appendChild(div1);
                row.appendChild(div2);
                
                div2.appendChild(h11);
                div2.appendChild(h12);
               
                
                div2.appendChild(h15);
                div2.appendChild(h16);
                
                div2.appendChild(button);
            });

            ads.appendChild(fragment);
        })
        .catch((error) => {
            console.error("Error searching ads:", error);
        });
}

function search1() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Movie Tickets";

    db.collection("Ads").where("category", "==", "Movie").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}
function search2() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Flight Tickets";

    db.collection("Ads").where("category", "==", "Flight").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}

function search3() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Train Tickets";

    db.collection("Ads").where("category", "==", "Train").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}


function search4() {

    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Bus";
    db.collection("Ads").where("category","==", "Bus").get().then((res) => {
            res.forEach((doc) => {

            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            

            img.setAttribute('src',doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            img.setAttribute('class', 'img-responsive');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type','button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn'+d);
            button.setAttribute('onclick', "DisplayAdd('"+doc.id+"')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');
   
            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            div1.appendChild(center);
            
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
          //  h14.innerHTML = 'UId: '+doc.data().uid;

            });
    });
}
function search5() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Sports Event Tickets";

    db.collection("Ads").where("category", "==", "Sports").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}function search6() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Event Tickets";

    db.collection("Ads").where("category", "==", "Event").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}

function search7() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Beauty Ads";

    db.collection("Ads").where("category", "==", "beauty").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}
function search8() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "Animals Ads";

    db.collection("Ads").where("category", "==", "animals").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            
            div2.appendChild(h17);
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}

function search9() {
    var cont = document.getElementById('cont');
    cont.style.display = 'none';
    var heading = document.getElementById('heading');
    heading.innerHTML = "All Ads";

    db.collection("Ads").get().then((res) => {
        res.forEach((doc) => {
            var ad = document.getElementById('ad');
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h5');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3 col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8 col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
           
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'VIEW');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            ad.appendChild(row);
            row.appendChild(div1);
            ad.appendChild(hr);
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
           
            div2.appendChild(button);

            h11.innerHTML = " Title: " + doc.data().title;
            d++;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'description: ' + doc.data().description;
            h14.innerHTML = 'price: ' + doc.data().price;
        });
    });
}


// Check if the current page is products.html, then call getServices function
if (window.location.pathname == '/products.html') {
    getServices();
}

// Counter for button IDs
var d = 1;

// Function to retrieve services from Firestore and display them on the page
function getServices() {
    var ads = document.getElementById('ads'); // Assuming 'ads' is the container where you want to display services

    db.collection('Ads').get().then((res) => {
        res.forEach((doc) => {
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var img = document.createElement('img');
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h5');
            var h16 = document.createElement('h5');
            var h17 = document.createElement('h5');
            var hr = document.createElement('hr');
            var button = document.createElement('input');
            var center = document.createElement('center');

            // Set attributes and content for each element
            img.setAttribute('src', doc.data().url);
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('class', 'col-md-3 col-sm-4');
            div2.setAttribute('class', 'col-md-8 col-sm-8');
            h11.setAttribute('id', 'blue');
            h14.setAttribute('id', doc.data().uid);
            h15.setAttribute('id', doc.data().category);
            h16.setAttribute('id', doc.data().city);
            h17.setAttribute('id', doc.data().url);
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Chat');
            button.setAttribute('class', 'chat-btn');
            button.setAttribute('id', 'chat-btn' + d);
            button.setAttribute('onclick', "DisplayAdd('" + doc.id + "')");
            button.setAttribute('data-toggle', 'modal');
            button.setAttribute('data-target', '#myModal');

            // Append elements to the DOM
            ads.appendChild(row);
            row.appendChild(div1);
            row.appendChild(div2);
            div1.appendChild(center);
            center.appendChild(img);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(h16);
            div2.appendChild(h17);
            div2.appendChild(button);

            // Set innerHTML for text elements
            h11.innerHTML = " Title: " + doc.data().title;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Phone: ' + doc.data().phone;
            h14.innerHTML = 'Price: Rs' + doc.data().price;

            // Set attributes for the image element
            img.setAttribute('class', 'img-responsive');
            img.setAttribute('width', '50');

            // Increment the button ID counter
            d++;
        });
    });
}

function DisplayAdd(id){

    var userid = firebase.auth().currentUser.uid;

   db.collection('Ads').doc(id).get().then(function(doc) {
    
    if (doc.exists) {

                if (doc.data().uid == firebase.auth().currentUser.uid) {
                  
                    var modal_title = document.getElementById('modal-title');
                    var modal_body = document.getElementById('modal-body');
                    
                    var modal_send = document.getElementById('modal-send');
                    var fav = document.getElementById('modal-fav');

                    modal_send.setAttribute('onclick', "message('"+doc.id+"')");
                    modal_send.style.display = 'none';
                    fav.style.display = 'none';

                
                                
                    modal_title.innerHTML = doc.data().title;
                    modal_body.innerHTML = "Category: " + doc.data().category + "<br><br>Name: " + doc.data().name + "<br><br>City: " + doc.data().city + "<br><br>Number: " + "<br><br>Price: Rs" + doc.data().price + "<br><br>Description: " + doc.data().description;
                }
                else{
                   
                    var modal_title = document.getElementById('modal-title');
                    var modal_body = document.getElementById('modal-body');
                    
                    var modal_send = document.getElementById('modal-send');
                    var modal_fav = document.getElementById('modal-fav');
                    var fav = document.getElementById('modal-fav');
                    var middle = document.getElementById('middle');
                   
                    modal_send.setAttribute('onclick', "message('"+doc.id+"')");
                    modal_fav.setAttribute('onclick', "addToFavorite(this,'"+doc.id+"')");
                    
                    modal_send.style.display = 'block';
                    fav.style.display = 'block';
                   
                    modal_title.innerHTML = doc.data().title;
                    modal_body.innerHTML = "Category: " + doc.data().category + "<br><br>Name: " + doc.data().name + "<br><br>City: " + doc.data().city + "<br><br>Price: Rs " + doc.data().price + "<br><br>Description: " + doc.data().description;
                }}
     else {
                        console.log("No such document!");
                    }
                    
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
 
    }


function clickResponse(){

    Id = this.id;
    alert(this.id);
    id = document.getElementById(this.id).parentElement.childNodes[3].id;
    var userid = firebase.auth().currentUser.uid;
    if (id == firebase.auth().currentUser.uid) {
        var categories = document.getElementById(this.id).parentElement.childNodes[4].id;
        var city = document.getElementById(this.id).parentElement.childNodes[5].id;
        var pic = document.getElementById(this.id).parentElement.childNodes[6].id;
        var title = document.getElementById(this.id).parentElement.childNodes[0].childNodes[0].data;
        var name = document.getElementById(this.id).parentElement.childNodes[1].childNodes[0].data;
        var phone = document.getElementById(this.id).parentElement.childNodes[2].childNodes[0].data;
                    
        var modal_title = document.getElementById('modal-title');
        var modal_body = document.getElementById('modal-body');
        var modal_image = document.getElementById('modal-image');
        var modal_send = document.getElementById('modal-send');
        modal_send.style.display = 'none';

        modal_image.setAttribute('src', pic); 
                    
        modal_title.innerHTML = title;
        modal_body.innerHTML = "Category: " + categories + "<br><br>" + name + "<br><br>City: " + city + "<br><br>" + phone;
    }
    else{
        var categories = document.getElementById(this.id).parentElement.childNodes[4].id;
        var city = document.getElementById(this.id).parentElement.childNodes[5].id;
        var pic = document.getElementById(this.id).parentElement.childNodes[6].id;
        var title = document.getElementById(this.id).parentElement.childNodes[0].childNodes[0].data;
        var name = document.getElementById(this.id).parentElement.childNodes[1].childNodes[0].data;
        var phone = document.getElementById(this.id).parentElement.childNodes[2].childNodes[0].data;
                    
        var modal_title = document.getElementById('modal-title');
        var modal_body = document.getElementById('modal-body');
        var modal_image = document.getElementById('modal-image');
        var modal_send = document.getElementById('modal-send');
        modal_image.setAttribute('src', pic);
        modal_send.style.display = 'block';

            db.collection('rooms').add({
            
            createdAt: Date.now(),
            Users : [{id:true,userid:true}]
            }).then(res => {
                    
                console.log('res id***', res.id);
                localStorage.setItem('Ad_id', res.id);
                localStorage.setItem('User_id', id)
            });

        modal_title.innerHTML = title;
        modal_body.innerHTML = "Category: " + categories + "<br><br>" + name + "<br><br>City: " + city + "<br><br>" + phone;
    }    

    
}






function myAds() {
   var ads = document.getElementById('ads');
   var cen = document.getElementById('center');
   cen.style.display = 'block';
    var uid = firebase.auth().currentUser.uid;

    ads.innerHTML = "";
    db.collection('Ads').where('uid',"==",uid).get()
    .then((res) => {
        res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var r = doc.id;
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            
            var h11 = document.createElement('h1');
            var h12 = document.createElement('h3');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h3');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');
            
            
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            button.setAttribute('type','button');
            button.setAttribute('value', 'Delete');
            button.setAttribute('class', 'dlt-btn');
            button.setAttribute('onclick', "deleteAdd('"+doc.id+"',this)");

            ads.appendChild(row);
            row.appendChild(div1);
            div1.appendChild(center);
            
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h12);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(button);
            ads.appendChild(hr);

            h11.innerHTML = " Title: " + doc.data().title;
            h12.innerHTML = 'Name: ' + doc.data().name;
            h13.innerHTML = 'Category: '+doc.data().category;
            h14.innerHTML = 'City: '+doc.data().city;
            h15.innerHTML = 'description: '+doc.data().description;

        })
     
        })
     
}

function deleteAdd(id,a){

        var result = confirm("Are you sure to delete this item?");
        if (result) {
            db.collection("Ads").doc(id).delete().then(function() {
                alert("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            
        }



         
        
    }


function check1(){
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.location.assign("account.html");
  } else {
    // No user is signed in.
    window.location.assign("logIn.html");
  }
});
}





/* Add TO FAVORITES Start */

function addOffline(adId) {
  showLoader("Adding Offline");
  var adDetailsArr = [];
  if (localStorage.getItem("ads")) {
    adDetailsArr = JSON.parse(localStorage.getItem("ads"));
  }
  db.collection("ads")
    .doc(adId)
    .get()
    .then(data => {
      adDetailsArr.push(data.data());
      localStorage.setItem("ads", JSON.stringify(adDetailsArr));
      var req = new Request(data.data().url, { mode: "no-cors" });
      fetch(req).then(res => {
        caches.open("adsCache").then(cache => {
          console.log("Stored");

          return cache.put(req, res).then(() => {
            hideLoader();
            showMessage("Added Offline");
          });
        });
      });
    });
}

function addToFavorite(x,id) {

var FavId=firebase.auth().currentUser.uid;

        if (x.hasAttribute("fav")) {       
            x.removeAttribute("fav")
 
            console.log("Added To Favorite"+id)

            alert('Added To Favorite!' )
 
            db.collection("Ads").doc(id).get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data");


                    /* Adding Data To Favorite */
             db.collection("Favorite").add({
                AdTitle:doc.data().title,
                Name:doc.data().name,
                Category:doc.data().category,
                City:doc.data().city,
                price:doc.data().price,
                Phone:doc.data().phone,
                // img:doc.data().img,
                FavPersonID:FavId,
                // price:doc.data().price,
                AdId:id,
                uid:doc.data().uid
             })
             .then(function(docRef) {
                 console.log("Document written with ID: ", docRef.id);

             })
             .catch(function(error) {
                 console.error("Error adding document: ", error);
            });

                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });         

            
        }
    
        else
        {
            x.setAttribute("fav", "no");

            db.collection('Favorite').where('AdId','==',id).get()
            .then(function(querySnapshot) {
                    
                var batch = db.batch();
                querySnapshot.forEach(function(doc) {
                batch.delete(doc.ref);
                        });

                return batch.commit();
                }).then(function() {
                    alert("Removed From Favorite!" )
                    }); 

        }

    }


function DisplayFavorite(){

    var fav = document.getElementById('favo');
    var favorite = document.getElementById('favorite');
    favorite.style.display = 'block';
    var uid = firebase.auth().currentUser.uid;

            fav.innerHTML = "";
    db.collection('Favorite').where('FavPersonID',"==",uid).get()
    .then((res) => {
        res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var r = doc.id;
            var row = document.createElement('div');
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var div3 = document.createElement('div');
            
            var h11 = document.createElement('h1');
            var h13 = document.createElement('h3');
            var h14 = document.createElement('h3');
            var h15 = document.createElement('h3');
            var hr = document.createElement('hr');
            var button = document.createElement('input'); 
            var center = document.createElement('center');

            
            row.setAttribute('class', 'row');
            row.setAttribute('id', 'img-product');
            div1.setAttribute('id', 'a');
            div1.setAttribute('class', 'col-md-3');
            div1.setAttribute('class', 'col-sm-4');
            div2.setAttribute('id', 'a');
            div2.setAttribute('class', 'col-md-8');
            div2.setAttribute('class', 'col-sm-8');
            h11.setAttribute('id', 'blue');
            button.setAttribute('type','button');
            button.setAttribute('value', 'Remove');
            button.setAttribute('class', 'dlt-btn');
            button.setAttribute('onclick', "removeFavorite('"+doc.id+"')");

            fav.appendChild(row);
            row.appendChild(div1);
            div1.appendChild(center);
           
            row.appendChild(div2);
            div2.appendChild(h11);
            div2.appendChild(h13);
            div2.appendChild(h14);
            div2.appendChild(h15);
            div2.appendChild(button);
            fav.appendChild(hr);

            h11.innerHTML = " Title: " + doc.data().AdTitle;
            h13.innerHTML = 'Category: '+doc.data().Category;
            h14.innerHTML = 'City: '+doc.data().City;
            h15.innerHTML = 'description: '+doc.data().description;
        })
        })
}
function  removeFavorite(id){

    console.log(id)
     var fav = document.getElementById('fav');
    db.collection("Favorite").doc(id).delete().then(function() {
     alert("Successfully deleted!");              
     fav.innerHT
  }).catch(function(error) {
     console.error("Error removing document: ", error);
 });

}

