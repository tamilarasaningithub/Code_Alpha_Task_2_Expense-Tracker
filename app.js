document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expenseForm');
  const expenseList = document.getElementById('expenseList');
  const totalExpense = document.getElementById('totalExpense');
  const filterCategory = document.getElementById('filterCategory');

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  function renderExpenses() {
    const filteredExpenses = expenses.filter(expense => {
      const selectedCategory = filterCategory.value;
      return selectedCategory ? expense.category === selectedCategory : true;
    });

    expenseList.innerHTML = '';
    filteredExpenses.forEach((expense, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${expense.description} - $${expense.amount} (${expense.category})</span>
                      <button onclick="editExpense(${index})">Edit</button>
                      <button onclick="deleteExpense(${index})">Delete</button>`;
      expenseList.appendChild(li);
    });

    const total = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalExpense.textContent = `Total Expense: $${total.toFixed(2)}`;
    updateLocalStorage();
  }

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (description && amount && category) {
      expenses.push({ description, amount, category });
      renderExpenses();
      expenseForm.reset();
    }
  });

  filterCategory.addEventListener('change', renderExpenses);

  window.editExpense = (index) => {
    const newDescription = prompt('Enter new description:');
    const newAmount = parseFloat(prompt('Enter new amount:'));
    const newCategory = prompt('Enter new category:');

    if (newDescription && newAmount && newCategory) {
      expenses[index].description = newDescription;
      expenses[index].amount = newAmount;
      expenses[index].category = newCategory;
      renderExpenses();
    }
  };

  window.deleteExpense = (index) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      expenses.splice(index, 1);
      renderExpenses();
    }
  };

  function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  renderExpenses();
});
