//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// GLOBAL VARIABLES /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

let currentPhotographerPhotos = [];
let currentLigthboxIndex = -1;
let likesTable = [];
let existingLikes = [];
let modifiedArray = [];
let JsonDATA;
let photoName = [];

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// FETCH ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

    fetch('./../JSON.json')
    .then((response) => response.json())
    .then(JsonData => {
          photographerProfil(JsonData)// function invoked here
          openLightBox(JsonData)      // function invoked here 
          incrementLikesOnClick()     // function invoked here
          JsonDATA = JsonData;
    }).catch(error => console.error)

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// PHOTOGRAPHER'S PROFIL  ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function photographerProfil(JsonData){
  const id = window.location.search.split('id=')[1];  
  const photographers = !id ? JsonData.photographers : JsonData.photographers.filter(photographer => photographer.id == id);
  photographers.forEach(element => {
    const domDiv = document.getElementById('photographer-container');
    const newDiv = document.createElement('div'); 
    const photographerPrice = element.price;
    const profilTemplate = `
      <section aria-label="Photographer Profil" class="profil-container">
        <h2>${element.name}</h2>
        <p>${element.city}, ${element.country}</p>
        <p class="tagline">${element.tagline}</p>
        <p >${element.tags.map(tag => `<a id="cursorAdd" href="accueil.html?id=${tag}" class='tags'>#${tag}</a>`).join(" ")}</p>
        <button id="test">Contactez-moi</button>
        <div class="photoBox">
            <img src="${element.portrait}" alt="photo de ${element.name}">
        </div>
      </section>
    `
    newDiv.innerHTML = profilTemplate;
    domDiv.appendChild(newDiv);
    showModal(element);                            // function invoked here 
    let sum = photographerWork(JsonData.media)     // function invoked here 
    likesAndPrice(sum, photographerPrice);         // function invoked here
    
  }) 
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PHOTOGRAPHER'S WORK  ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


function photographerWork(media){
  let sum = 0;
  homeElt = window.location.search.split('id=')[1];  
    media.forEach(element => {   
    if(homeElt == element.photographerId){
      const domDiv = document.getElementById('photographer-work');
      const newDiv = document.createElement("div");
      sum += element.likes;
      const workTemplate = `         
        <div class="photo-box"> 
            <div class="photo" data-id=${element.id}>
                ${videoOrImage(element.image, element.video, element)}
            </div>   
            <div class="text">
                <p> ${element.photoName}<b>${element.price} €  &nbsp <span class='under-photo-info'>${element.likes}</span> <i class="fas fa-heart heartIcon"></i></b></p>
            </div>
        </div>
        `
      newDiv.innerHTML = workTemplate;
      domDiv.appendChild(newDiv);
      if ( 'image' in element) {currentPhotographerPhotos.push(element.image), photoName.push(element.photoName)}
      likesTable.push(element.likes);
    }})
    handleNextPrevButtons();
    return sum;  
}
//check to see if the data is image or video and display the right one into the box template
function videoOrImage(image, video, element) {
  if ('image' in element){
    return ` <img class="photos" aria-label="photo ${element.photoName}" src="${image}">`
  }
  else if ('video' in element){
    return ` <iframe src="${video}" width="285px" height="255px" controls=0></iframe>`
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// LIKES & PRICE  ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//total likes and price Box
function likesAndPrice(sum, photographerPrice){
  const domDiv = document.getElementById('likes-and-price-box');
  const newDiv = document.createElement("div");
  const likesAndPriceTemplate = `
  <div id='likesBox' class="Likes">${sum}<i class="fas fa-heart"></i></div>
  <div class="Price">${photographerPrice}€ / jour</div>  
  `
    newDiv.classList.add('likesAndPriceContainer')
    newDiv.innerHTML = likesAndPriceTemplate;
    domDiv.appendChild(newDiv)
}

//increment likes on click
function incrementLikesOnClick() {
  const heartIcons = Array.from(document.getElementsByClassName('heartIcon')); // multiple heart icons
  heartIcons.forEach((likeIcon, index) => likeIcon.addEventListener('click', () => {
    
    // if the index of current photo is in the Arrey RETURN the index and stop executin IF NOT run the code block
    if (existingLikes.includes(index)) {return }
    else{
      const individualLikeBox = document.getElementsByClassName('under-photo-info');
      const totalLikesDivBox = document.getElementById("likesBox");
      likeIcon.classList.add('activeRed');
  
      let likesAfterAddition = likesTable[index] + 1;  // add 1 like to the individual current photo
      likesTable.splice(index, 1, likesAfterAddition); // replace the old value from the Array with the new value
  
      let globalNumberOfLikes = likesTable.reduce(function(a, b){return a + b;}); // return the sum of the array
  
      individualLikeBox[index].innerHTML = `<span>${likesAfterAddition}</span>`
      totalLikesDivBox.innerHTML = `<div>${globalNumberOfLikes}<i class="fas fa-heart"></i></div>`
    }
      // add the index of liked item to existingLikes Array everytime we click a photo
      existingLikes.push(index)
  }))
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// TRIER PAR - BUTTON ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

//OPEN DropDown
  document.getElementById('drop-down-btn').addEventListener('click', () => {
    const hidenPart = document.getElementById("myDropdown");
    const chevronUpIcon = document.getElementById("close-up-icon");
    const chevronDownIcon = document.getElementById('drop-down-btn');  
        hidenPart.classList.add("show");//add show class to change display by default which is none
        chevronUpIcon.classList.remove("fa-chevron-up-NO");//remove this class which gives display none by default
        chevronDownIcon.classList.toggle("fa-chevron-up-NO");
  })
// CLOSE DropDown
 document.getElementById("close-up-icon").addEventListener('click', () => {
   const hidenPart = document.getElementById("myDropdown");
   const chevronUpIcon = document.getElementById("close-up-icon");
   const chevronDownIcon = document.getElementById('drop-down-btn');
        hidenPart.classList.remove("show");
        chevronUpIcon.classList.add("fa-chevron-up-NO");
        chevronDownIcon.classList.toggle("fa-chevron-up-NO");
 })

// Trier PAR logic
const trierParButtons = Array.from(document.getElementsByClassName('trierBtn'));
trierParButtons.forEach((btn, index) => btn.addEventListener('click', () => {
  
  if( index == 0) {
    //////////// sort by POPULARITY //////////////   
    modifiedArray = JsonDATA.media.sort((a, b) => {return b.likes - a.likes})
    document.getElementById("photographer-work").innerHTML = "";
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()
            
  }else if (index == 1) {
    /////////// sort by DATE /////////////////////    
    modifiedArray = JsonDATA.media.sort((a, b) => { return new Date(a.date).valueOf() - new Date(b.date).valueOf();}) 
    document.querySelector("#photographer-work").innerHTML = "";;
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()

  }else if ( index == 2) {
    ////////////// sort by ALFABETIC ORDER ///////
    modifiedArray = JsonDATA.media.sort((a, b) => {
    if(a.photoName.toLowerCase() < b.photoName.toLowerCase()) { return -1;}
    else if (a.photoName.toLowerCase() > b.photoName.toLowerCase()) {return 1;}
    })
        document.querySelector("#photographer-work").innerHTML = "";;
        likesTable = [];
        currentPhotographerPhotos = [];
        photographerWork(modifiedArray);
        openLightBox(JsonDATA)
        incrementLikesOnClick()

    }
}));



////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// LIGHTBOX PHOTO ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// open the lightbox
function openLightBox() {
  const getPhotos = Array.from(document.getElementsByClassName('photos'));
    getPhotos.forEach((photo, index) => photo.addEventListener("click", () => {

      const photoPlaceHolder = document.getElementById('photoPlaceHolder');
      const lightBoxcontainer = document.getElementById('lightBoxContainer');
      const photoNaneDom = document.getElementById('photoName');

      const src = currentPhotographerPhotos[index];
      const nameSrc = photoName[index];  
      lightBoxcontainer.style.display = 'block';
      currentLigthboxIndex = index;
    
      photoPlaceHolder.innerHTML = `<img src="${src}"/>`;
      photoNaneDom.innerHTML = `${nameSrc}`     
    }))
}
// change photos NEXT or PREVIOUS
function handleNextPrevButtons() {
  const previousBtn = document.querySelector('.leftIcon');
  const nextBtn = document.querySelector('.rightIcon');
  const photoPlaceHolder = document.getElementById('photoPlaceHolder');
  const photoNaneDom = document.getElementById('photoName');

  previousBtn.addEventListener('click', () => {
    currentLigthboxIndex -= 1;
    if (currentLigthboxIndex < 0) {
      currentLigthboxIndex = currentPhotographerPhotos.length - 1;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`; 

    if (currentLigthboxIndex < 0){
      currentLigthboxIndex = photoName.length - 1;
    }
    const nameSrc = photoName[currentLigthboxIndex]; 
    photoNaneDom.innerHTML = `${nameSrc}`  
  });

  nextBtn.addEventListener('click', () => {
    currentLigthboxIndex += 1;
    if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
      currentLigthboxIndex = 0;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`; 

    if (currentLigthboxIndex > photoName.length - 1){
       currentLigthboxIndex = 0;    
    }
    const nameSrc = photoName[currentLigthboxIndex]; 
    photoNaneDom.innerHTML = `${nameSrc}`
  })
}

// close the lightbox
function closeLightBox(){
  const closeLightBoxBtn = document.querySelector('.closeIcon');
    closeLightBoxBtn.addEventListener('click', () => {
      const lightBoxcontainer = document.getElementById('lightBoxContainer');
      lightBoxcontainer.style.display = 'none';
    })
}
closeLightBox()

/////// lightBox using keyboard
document.addEventListener('keydown', (key) => {

  //ENTER KEY
  if(key.code == "Enter") {

  }

  //Esc KEY
  else if(key.code == "Escape"){
    const lightBoxcontainer = document.getElementById('lightBoxContainer');
    lightBoxcontainer.style.display = 'none';
  }

  //ArrowRight KEY
  else if(key.code == "ArrowRight"){
    const photoNaneDom = document.getElementById('photoName');

    currentLigthboxIndex += 1;
    if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
      currentLigthboxIndex = 0;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`;
    
    if (currentLigthboxIndex > photoName.length - 1){
      currentLigthboxIndex = 0;    
   }
   const nameSrc = photoName[currentLigthboxIndex]; 
   photoNaneDom.innerHTML = `${nameSrc}`
  }

  //ArrowLeft KEY
  else if(key.code == "ArrowLeft"){
    const photoNaneDom = document.getElementById('photoName');

    currentLigthboxIndex -= 1;
    if (currentLigthboxIndex < 0) {
      currentLigthboxIndex = currentPhotographerPhotos.length - 1;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`; 

    if (currentLigthboxIndex < 0){
      currentLigthboxIndex = photoName.length - 1;
    }
    const nameSrc = photoName[currentLigthboxIndex]; 
    photoNaneDom.innerHTML = `${nameSrc}` 
  }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////   CONTACT FORM  //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// open the contact form
function showModal(element){

  document.getElementById("test").addEventListener('click', () => {
    const formModal = document.getElementById('form-container');
    formModal.style.display = "block";
    document.getElementById('test').style.display = "none";
    const nameOfThePhotographe = document.getElementById('nameOfThePhotopgraphe');
    const nameTemplate = `${element.name}`
    nameOfThePhotographe.innerHTML = nameTemplate;
  })
}

const form = document.querySelector('.form-container form');
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const prenom = document.getElementById('prenom');
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const errorPrenom = document.getElementById('error-prenom');
    const errorNom = document.getElementById('error-nom');
    const errorMail = document.getElementById('error-email');
    const errorMessage = document.getElementById('error-message');
    const prenomOK = validateString(prenom ,prenom.value, 2, errorPrenom, "Veuillez entre 2 ou plus de caracteres");
    const nomOk = validateString(nom ,nom.value, 2, errorNom, "Veuillez entre 2 ou plus de caracteres");
    const messageOk = validateString(message, message.value, 10, errorMessage, "Veuillez entre 10 ou plus de caracteres");
    const emailOk = checkEmail(email, email.value, errorMail, "Veuillez entre une adresse mail valid");

    if( prenomOK && nomOk && messageOk && emailOk){
        const formModal = document.getElementById('form-container');
        formModal.style.display = "none";
        alert('Message envoyer!')
        form.reset();
    }
})

// Close the modal on X button
document.getElementById('X-button').addEventListener('click', () => {
    const formModal = document.getElementById('form-container');
    formModal.style.display = "none";
    document.getElementById('test').style.display = "block";
})

// validate the inputes
function validateString(border ,entry, size, errorElt, errorMessage) {
  if ( entry.length < size ) {
    errorElt.innerHTML = errorMessage;
    errorElt.style.color = "white";
    errorElt.style.fontSize = "0.8rem";
    border.style.border = "1px solid red";
    return false;
  }else {
    errorElt.innerHTML = " ";
    border.style.border = "1px solid white";
    return true;
  }
}

////// Validate EMAIL /////// 
function checkEmail(border, emajll, errorElt, errorMessage ) {
    let patern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emajll.toLowerCase().match(patern) || emajll == '') {
        errorElt.innerHTML = errorMessage;
        errorElt.style.color = "white";
        errorElt.style.fontSize = "0.8rem";
        border.style.border = "1px solid red";
        return false;
    }else {
        errorElt.innerHTML = "";
        border.style.border = "1px solid white";
        return true;
    }
}


