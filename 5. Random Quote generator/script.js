const quoteText = document.getElementById("quote");
const button = document.getElementById("generateBtn");

const quotes = [

"Success usually comes to those who are too busy to be looking for it.",
"Do something today that your future self will thank you for.",
"Push yourself, because no one else is going to do it for you.",
"Great things never come from comfort zones.",
"Dream it. Wish it. Do it.",
"Stay hungry. Stay foolish.",
"Consistency beats motivation."

];

button.addEventListener("click", generateQuote);

function generateQuote(){

const randomIndex = Math.floor(Math.random() * quotes.length);

quoteText.textContent = quotes[randomIndex];

}