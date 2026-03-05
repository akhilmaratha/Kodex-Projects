const passwordInput = document.getElementById("passwordInput");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

passwordInput.addEventListener("input", checkStrength);

function checkStrength(){

const password = passwordInput.value;

let strength = 0;

if(password.length >= 6){
strength++;
}

if(/[A-Z]/.test(password)){
strength++;
}

if(/[0-9]/.test(password)){
strength++;
}

if(/[!@#$%^&*]/.test(password)){
strength++;
}

if(strength === 1){
strengthFill.style.width = "25%";
strengthFill.style.background = "red";
strengthText.textContent = "Strength: Weak";
}

else if(strength === 2){
strengthFill.style.width = "50%";
strengthFill.style.background = "orange";
strengthText.textContent = "Strength: Medium";
}

else if(strength === 3){
strengthFill.style.width = "75%";
strengthFill.style.background = "blue";
strengthText.textContent = "Strength: Good";
}

else if(strength === 4){
strengthFill.style.width = "100%";
strengthFill.style.background = "green";
strengthText.textContent = "Strength: Strong";
}

else{
strengthFill.style.width = "0%";
strengthText.textContent = "Strength: --";
}

}