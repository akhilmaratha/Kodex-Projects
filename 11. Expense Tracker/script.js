const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const text = document.getElementById("text");
const amount = document.getElementById("amount");

const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");

let transactions = [];

function updateValues(){

const amounts = transactions.map(t => t.amount);

const total = amounts.reduce((acc,item)=>acc+item,0);

const inc = amounts
.filter(item => item > 0)
.reduce((acc,item)=>acc+item,0);

const exp = amounts
.filter(item => item < 0)
.reduce((acc,item)=>acc+item,0);

balance.innerText = "₹" + total;

income.innerText = "₹" + inc;

expense.innerText = "₹" + Math.abs(exp);

}

function addTransactionDOM(transaction){

const li = document.createElement("li");

li.innerHTML = `
${transaction.text} ₹${transaction.amount}
<span class="delete" onclick="removeTransaction(${transaction.id})">X</span>
`;

list.appendChild(li);

}

function addTransaction(){

if(text.value === "" || amount.value === ""){
alert("Please enter details");
return;
}

const transaction = {

id: Date.now(),
text: text.value,
amount: +amount.value

};

transactions.push(transaction);

addTransactionDOM(transaction);

updateValues();

text.value = "";
amount.value = "";

}

function removeTransaction(id){

transactions = transactions.filter(t => t.id !== id);

list.innerHTML = "";

transactions.forEach(addTransactionDOM);

updateValues();

}

addBtn.addEventListener("click", addTransaction);