// --- GUARDA DE PROTEÇÃO E SETUP INICIAL ---
const loggedInUser = sessionStorage.getItem('loggedInUser');

(function() {
    if (!loggedInUser) {
        window.location.href = 'login.html';
    }
})();

// --- LÓGICA DO TEMA ESCURO (DARK MODE) ---
// Esta função é executada imediatamente para aplicar o tema salvo
(function() {
    const savedTheme = localStorage.getItem(`theme_${loggedInUser}`);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Salva a preferência do tema para o usuário logado
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem(`theme_${loggedInUser}`, 'dark');
    } else {
        localStorage.setItem(`theme_${loggedInUser}`, 'light');
    }
}


// --- FUNÇÃO para pegar as iniciais do nome de usuário ---
function getInitials(name) {
    if (!name) return '';
    return name.substring(0, 1).toUpperCase();
}

// --- LÓGICA DE LOGOUT ---
function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// --- FUNÇÕES DE NAVEGAÇÃO E UI ---
function showSection(sectionId) {
    document.querySelectorAll('.tab-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById('main-menu').style.display = 'none';
    if (sectionId === 'history') {
        document.getElementById("defaultOpenTab").click();
    }
}

function showMenu() {
    document.querySelectorAll('.tab-section').forEach(s => s.style.display = 'none');
    document.getElementById('main-menu').style.display = 'block';
}

function showFeedback(elementId, message) {
    const feedbackEl = document.getElementById(elementId);
    feedbackEl.textContent = message;
    feedbackEl.classList.add('show');
    setTimeout(() => { feedbackEl.classList.remove('show'); }, 2000);
}

// --- LÓGICA DAS ABAS DO HISTÓRICO ---
function openHistoryTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    let tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// --- FUNÇÃO PARA ABRIR/FECHAR O DROPDOWN ---
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// --- FUNÇÕES DE SALVAR DADOS (ESPECÍFICAS DO USUÁRIO) ---
function saveData(type, textareaId, tagInputId, feedbackId, successMessage) {
    const content = document.getElementById(textareaId).value;
    const tagsValue = document.getElementById(tagInputId).value;
    const tags = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (content) {
        const userSpecificKey = `${type}_${loggedInUser}`;
        let items = JSON.parse(localStorage.getItem(userSpecificKey)) || [];
        items.push({
            id: Date.now(),
            text: content,
            date: new Date().toLocaleDateString('pt-BR'),
            tags: tags
        });
        localStorage.setItem(userSpecificKey, JSON.stringify(items));
        showFeedback(feedbackId, successMessage);
        
        const textarea = document.getElementById(textareaId);
        textarea.value = '';
        textarea.style.height = 'auto';
        document.getElementById(textarea.id + '-char-counter').textContent = '0 caracteres';
        document.getElementById(tagInputId).value = '';

        displayHistory();
        createCalendar();
    } else {
        alert("Por favor, escreva algo antes de salvar.");
    }
}

function saveThought() { saveData('thoughts', 'thought', 'thought-tags', 'thought-feedback', 'Pensamento salvo!'); }
function savePendings() { saveData('pendings', 'pendings', 'pendings-tags', 'pendings-feedback', 'Pendência salva!'); }
function saveGratitude() { saveData('gratitude', 'gratitude-text', 'gratitude-tags', 'gratitude-feedback', 'Gratidão salva!'); }


// --- FUNÇÕES DE HISTÓRICO (ESPECÍFICAS DO USUÁRIO) ---
function displayHistory() {
    const createListHTML = (items, type) => {
        if (items.length === 0) return '<li>Nenhum registro encontrado.</li>';
        let htmlString = '';
        items.slice().reverse().forEach(item => {
            const tagsHTML = (item.tags && item.tags.length > 0) ? `<div class="entry-tags">${item.tags.map(tag => `<span class="tag-badge" onclick="filterByTag('${tag}')">${tag}</span>`).join('')}</div>` : '';
            htmlString += `
                <li data-tags="${item.tags ? item.tags.join(',') : ''}">
                    <div class="entry-content">${item.text.replace(/\n/g, '<br>')}</div>
                    ${tagsHTML}
                    <div class="entry-date">Data: ${item.date}</div>
                    <div class="entry-actions">
                        <button onclick="editEntry('${type}', ${item.id})">Editar</button>
                        <button class="danger" onclick="deleteEntry('${type}', ${item.id})">Excluir</button>
                    </div>
                </li>`;
        });
        return htmlString;
    };

    const thoughts = JSON.parse(localStorage.getItem(`thoughts_${loggedInUser}`)) || [];
    const pendings = JSON.parse(localStorage.getItem(`pendings_${loggedInUser}`)) || [];
    const gratitudes = JSON.parse(localStorage.getItem(`gratitude_${loggedInUser}`)) || [];
    
    document.getElementById('thought-list').innerHTML = createListHTML(thoughts, 'thoughts');
    document.getElementById('pendings-list').innerHTML = createListHTML(pendings, 'pendings');
    document.getElementById('gratitude-list').innerHTML = createListHTML(gratitudes, 'gratitude');
}

function filterHistory() {
    const searchTerm = document.getElementById('history-search').value.toLowerCase();
    const allEntries = document.querySelectorAll('#thought-list li, #pendings-list li, #gratitude-list li');
    allEntries.forEach(entry => {
        if (entry.textContent.toLowerCase().includes(searchTerm)) {
            entry.style.display = "block";
        } else {
            entry.style.display = "none";
        }
    });
}

function filterByTag(tag) {
    document.getElementById('history-search').value = tag;
    filterHistory();
}

function editEntry(type, id) {
    const userSpecificKey = `${type}_${loggedInUser}`;
    let items = JSON.parse(localStorage.getItem(userSpecificKey)) || [];
    const itemToEdit = items.find(item => item.id === id);
    if (!itemToEdit) return;
    const newText = prompt("Edite seu registro:", itemToEdit.text);
    if (newText !== null && newText.trim() !== "") {
        itemToEdit.text = newText;
        localStorage.setItem(userSpecificKey, JSON.stringify(items));
        displayHistory();
    }
}

function deleteEntry(type, id) {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
        const userSpecificKey = `${type}_${loggedInUser}`;
        let items = JSON.parse(localStorage.getItem(userSpecificKey)) || [];
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem(userSpecificKey, JSON.stringify(updatedItems));
        displayHistory();
        createCalendar();
    }
}

function clearHistory() {
    if (confirm("Tem certeza que deseja apagar TODO o histórico? Esta ação não pode ser desfeita.")) {
        localStorage.removeItem(`thoughts_${loggedInUser}`);
        localStorage.removeItem(`pendings_${loggedInUser}`);
        localStorage.removeItem(`gratitude_${loggedInUser}`);
        localStorage.removeItem(`emotionalEntries_${loggedInUser}`);
        displayHistory();
        createCalendar();
        alert("Histórico limpo.");
    }
}

// --- CALENDÁRIO E MODAL (ESPECÍFICOS DO USUÁRIO) ---
function createCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    document.getElementById('calendar-title').textContent = `${now.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-header';
        dayElement.textContent = day;
        calendarContainer.appendChild(dayElement);
    });
    for (let i = 0; i < firstDay; i++) { calendarContainer.appendChild(document.createElement('div')); }

    const thoughts = JSON.parse(localStorage.getItem(`thoughts_${loggedInUser}`)) || [];
    const pendings = JSON.parse(localStorage.getItem(`pendings_${loggedInUser}`)) || [];
    const gratitudes = JSON.parse(localStorage.getItem(`gratitude_${loggedInUser}`)) || [];
    const emotionalEntries = JSON.parse(localStorage.getItem(`emotionalEntries_${loggedInUser}`)) || {};

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        const currentDateStr = new Date(year, month, day).toLocaleDateString('pt-BR');
        let dayContent = day;
        if (emotionalEntries[currentDateStr]) { dayContent += ` ${emotionalEntries[currentDateStr]}`; }
        dayElement.innerHTML = dayContent;
        if (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) { dayElement.classList.add('today'); }
        const hasNotes = thoughts.some(t => t.date === currentDateStr) || pendings.some(p => p.date === currentDateStr) || gratitudes.some(g => g.date === currentDateStr);
        if (hasNotes) { dayElement.classList.add('has-notes'); }
        dayElement.addEventListener('click', () => openDayModal(currentDateStr));
        calendarContainer.appendChild(dayElement);
    }
}

function openDayModal(dateStr) {
    const modal = document.getElementById('day-modal');
    const modalBody = document.getElementById('modal-body');
    const emotionButtonsContainer = document.getElementById('modal-emotion-buttons');
    document.getElementById('modal-date').textContent = `Registros do dia ${dateStr}`;
    modalBody.innerHTML = '';
    emotionButtonsContainer.innerHTML = '';

    const thoughts = (JSON.parse(localStorage.getItem(`thoughts_${loggedInUser}`)) || []).filter(item => item.date === dateStr);
    const pendings = (JSON.parse(localStorage.getItem(`pendings_${loggedInUser}`)) || []).filter(item => item.date === dateStr);
    const gratitudes = (JSON.parse(localStorage.getItem(`gratitude_${loggedInUser}`)) || []).filter(item => item.date === dateStr);

    if (thoughts.length === 0 && pendings.length === 0 && gratitudes.length === 0) {
        modalBody.innerHTML = '<p>Nenhum registro de texto para este dia.</p>';
    } else {
        if (thoughts.length > 0) modalBody.innerHTML += '<h4>Pensamentos</h4>' + thoughts.map(t => `<p>${t.text.replace(/\n/g, '<br>')}</p>`).join('');
        if (pendings.length > 0) modalBody.innerHTML += '<h4>Pendências Emocionais</h4>' + pendings.map(p => `<p>${p.text.replace(/\n/g, '<br>')}</p>`).join('');
        if (gratitudes.length > 0) modalBody.innerHTML += '<h4>Gratidão</h4>' + gratitudes.map(g => `<p>${g.text.replace(/\n/g, '<br>')}</p>`).join('');
    }
    
    const emotions = { feliz: '😊', triste: '😢', raiva: '😡', ansioso: '😰', animado: '😄', relaxado: '😌' };
    for (const [emotion, emoji] of Object.entries(emotions)) {
        const button = document.createElement('button');
        button.textContent = emoji;
        button.onclick = () => {
            const emotionalEntriesKey = `emotionalEntries_${loggedInUser}`;
            let emotionalEntries = JSON.parse(localStorage.getItem(emotionalEntriesKey)) || {};
            emotionalEntries[dateStr] = emoji;
            localStorage.setItem(emotionalEntriesKey, JSON.stringify(emotionalEntries));
            closeModal();
            createCalendar(); 
        };
        emotionButtonsContainer.appendChild(button);
    }
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('day-modal').style.display = 'none';
}

// --- INICIALIZAÇÃO E FUNÇÕES FINAIS ---
function showMotivationalMessage() {
    const messages = ["Acredite em si mesmo!", "Cada passo é um progresso.", "Você é mais forte do que pensa."];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('motivational-message').textContent = randomMessage;
}

window.onload = function() {
    if (loggedInUser) {
        const userIcon = document.getElementById('user-icon');
        userIcon.textContent = getInitials(loggedInUser);

        // MODIFICADO: Não precisa mais alterar o texto do botão de tema dinamicamente
        
        showMotivationalMessage();
        createCalendar();
        displayHistory();
        document.getElementById("defaultOpenTab").click();
        
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const counter = document.getElementById(textarea.id + '-char-counter');
            const adjustTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = (textarea.scrollHeight) + 'px';
                if (counter) { counter.textContent = textarea.value.length + ' caracteres'; }
            };
            textarea.addEventListener('input', adjustTextarea);
            adjustTextarea();
        });
    }
};

window.onclick = function(event) {
    const modal = document.getElementById('day-modal');
    if (event.target == modal) {
        closeModal();
    }

    if (!event.target.matches('.user-icon')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// --- FUNÇÃO DE EXPORTAÇÃO DE DADOS ---
function exportData() {
    if (!loggedInUser) return;

    const thoughts = JSON.parse(localStorage.getItem(`thoughts_${loggedInUser}`)) || [];
    const pendings = JSON.parse(localStorage.getItem(`pendings_${loggedInUser}`)) || [];
    const gratitudes = JSON.parse(localStorage.getItem(`gratitude_${loggedInUser}`)) || [];
    const emotionalEntries = JSON.parse(localStorage.getItem(`emotionalEntries_${loggedInUser}`)) || {};

    const userData = {
        username: loggedInUser,
        exportDate: new Date().toISOString(),
        data: {
            thoughts: thoughts,
            pendings: pendings,
            gratitude: gratitudes,
            emotionalEntries: emotionalEntries
        }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `diario_backup_${loggedInUser}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
