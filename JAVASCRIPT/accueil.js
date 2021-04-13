/////////////////////////////////////////// FETCH //////////////////////////////////////////////

function grabTheDataFromJSON(){
  fetch("./../JSON.json")
    .then(response => response.json())
    .then(dataJson => { 
        displayPhotographers(dataJson);                   //function is invoked here 
        displayByDefault(dataJson)                        //function is invoked here 
        filterPhotograpsIndividualTages(dataJson)       //function is invoked here
        redirectAndFilter(dataJson)
    }).catch(error => console.error)
};

grabTheDataFromJSON();

///////////////////////////// DISPLAY PHOTOGRAPHERS BY DEFAULT ///////////////////////////////////

function displayByDefault(dataJson) {

  dataJson.photographers.map(photographe => { 
    const photographersDiv = document.getElementById('container');
    const div = document.createElement("div");
    const photographerTemplate = `
    <div class="photographerContainer">
      <a href="photographers.html?id=${photographe.id}">
        <div class="portraitBox">
          <img src="${photographe.portrait}" alt="photo de ${photographe.name}">
        </div>
        <h1 class="name">${photographe.name}</h1>
      </a>
      <p   class="city">${photographe.city}, ${photographe.country}</p>
      <p class="tagline">${photographe.tagline}</p>
      <p class="price">${photographe.price}€/jour</p>
      <ul class="tags">${photographe.tags.map(tag => `<li id=${tag} class="tag individual-tags">#${tag}</li>`).join(" ")}</ul>  
    </div>
    `  
    photographersDiv.appendChild(div);
    div.innerHTML = photographerTemplate;
  }); 
};

////////////////////////////////// Filter photographs once we are redirected from photographers Page ///////////////////////
const tagName = window.location.search.split('id=')[1];  
function redirectAndFilter(dataJson) {
  if(tagName){
    const photographersDiv = document.getElementById('container');
    photographersDiv.innerHTML = "";  
    filterElements(dataJson, tagName)
  }
}

///////////////////////////// Loop throught each photographer Object //////////////////////////////////
function filterElements(dataJson, tagName){ 
    dataJson.photographers.forEach(photographe => {
      if(photographe.tags.indexOf(tagName.id || tagName) != -1) {
        const photographersDiv = document.getElementById('container');
        const div = document.createElement("div");
        const photographerTemplate = `
        <div class="photographerContainer">
          <a href="photographers.html?id=${photographe.id}">
            <div class="portraitBox">
              <img src="${photographe.portrait}" alt="photo de ${photographe.name}">
            </div>
            <h1 class="name">${photographe.name}</h1>
          </a>
          <p class="city">${photographe.city}, ${photographe.country}</p>
          <p class="tagline">${photographe.tagline}</p>
          <p class="price">${photographe.price}€/jour</p>
          <ul class="tags">${photographe.tags.map(tag => `<li id=${tag} class="tag individual-tags">#${tag}</li>`).join(" ")}</ul> 
        </div>
        `  
        photographersDiv.appendChild(div);
        div.innerHTML = photographerTemplate;
      }
    })
};



/////////////////////// Add the ACTIVE class to the clicked button ////////////////////////////
function addActiveClass() {

  const buttons = document.querySelectorAll(".filters_container li");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    //1-st lopp throughe every button and remove the class ACTIVE
    buttons.forEach(btn => btn.classList.remove('active'));
    // add ACTIVE class to clicked button
    btn.classList.add('active'); 
  }));
}
addActiveClass();

////////////////////// Filter the photographs using navigation tags /////////////////////////////////
function displayPhotographers(dataJson){

  const buttons = document.querySelectorAll(".filters_container li");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    //onClick clear the old HTML of photographersDiv and call the function filterElements to execute his block code!
    const photographersDiv = document.getElementById('container');
    photographersDiv.innerHTML = "";    
    filterElements(dataJson, btn);                      //function was invoked here!                               
  }));
};

////////////////////////// Filter the photographs using individual tags /////////////////////////////////
function filterPhotograpsIndividualTages(dataJson) {
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('individual-tags')) {
      const photographersDiv = document.getElementById('container');
      photographersDiv.innerHTML = "";                                      
      filterElements(dataJson, event.target);                      // function is invoked here
    }
  });
};

////////////////////////// BTN passer au contenue /////////////////////////////////
const btnPasserAuContenue = document.getElementById("passer-au-contenue");

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;

  if( scrollPosition < 20){
    btnPasserAuContenue.style.display = "none";
  }else{
    btnPasserAuContenue.style.display = "block";
  }
})