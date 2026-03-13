const searchInput = document.getElementById("searchInput");
const names = document.querySelectorAll("#nameList li");

searchInput.addEventListener("input", function(){

const searchValue = searchInput.value.toLowerCase();

names.forEach(function(name){

const text = name.textContent.toLowerCase();

if(text.includes(searchValue)){
name.style.display = "block";
}
else{
name.style.display = "none";
}

});

});