function registerUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        alert("Este nome de usuário já está em uso.");
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Usuário cadastrado com sucesso!");
    window.location.href = 'login.html';
}

function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = 'index.html';
    } else {
        alert("Nome de usuário ou senha inválidos.");
    }
}
