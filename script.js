// Função para mostrar uma seção específica e esconder as outras
function showSection(sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostra a seção clicada
    document.getElementById(sectionId).style.display = 'block';

    // Esconde o menu principal
    document.getElementById('main-menu').style.display = 'none';
}

// Função para mostrar o menu principal e esconder todas as seções
function showMenu() {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostra o menu principal
    document.getElementById('main-menu').style.display = 'block';
}

// Função para salvar pensamento do dia
function saveThought() {
    const thought = document.getElementById('thought').value;
    const date = new Date().toLocaleDateString();
    if (thought) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        thoughts.push({ text: thought, date: date });
        localStorage.setItem('thoughts', JSON.stringify(thoughts));
        alert("Pensamento do dia salvo!");
        document.getElementById('thought').value = ''; // Limpa o campo
        displayHistory(); // Atualiza o histórico
    } else {
        alert("Por favor, escreva seu pensamento.");
    }
}

// Função para salvar pendências emocionais
function savePendings() {
    const pending = document.getElementById('pendings').value;
    const date = new Date().toLocaleDateString();
    if (pending) {
        let pendings = JSON.parse(localStorage.getItem('pendings')) || [];
        pendings.push({ text: pending, date: date });
        localStorage.setItem('pendings', JSON.stringify(pendings));
        alert("Pendências emocionais salvas!");
        document.getElementById('pendings').value = ''; // Limpa o campo
        displayHistory(); // Atualiza o histórico
    } else {
        alert("Por favor, escreva suas pendências.");
    }
}

// Função para exibir pensamentos e pendências anteriores
function displayHistory() {
    // Exibir pensamentos
    const thoughtList = document.getElementById('thought-list');
    thoughtList.innerHTML = ''; // Limpa a lista
    let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
    thoughts.forEach(thought => {
        const li = document.createElement('li');
        li.textContent = `${thought.text} (Data: ${thought.date})`;
        thoughtList.appendChild(li);
        
        // Adiciona uma quebra de linha
        const lineBreak = document.createElement('br');
        thoughtList.appendChild(lineBreak); // Quebra de linha
    });

    // Exibir pendências emocionais
    const pendingsList = document.getElementById('pendings-list');
    pendingsList.innerHTML = ''; // Limpa a lista
    let pendings = JSON.parse(localStorage.getItem('pendings')) || [];
    pendings.forEach(pending => {
        const li = document.createElement('li');
        li.textContent = `${pending.text} (Data: ${pending.date})`;
        pendingsList.appendChild(li);
        
        // Adiciona uma quebra de linha
        const lineBreak = document.createElement('br');
        pendingsList.appendChild(lineBreak); // Quebra de linha
    });
}


// Função para limpar histórico
function clearHistory() {
    if (confirm("Tem certeza que deseja limpar todo o histórico de pensamentos e pendências emocionais?")) {
        localStorage.removeItem('thoughts');
        localStorage.removeItem('pendings');
        localStorage.removeItem('emotionalEntries'); // Limpa as emoções
        displayHistory(); // Atualiza o histórico
        alert("Histórico limpo.");
    }
}

// Função para mostrar uma mensagem motivacional aleatória
function showMotivationalMessage() {
    const messages = [
        "Acredite em si mesmo e em suas capacidades!",
        "Cada pequeno passo é um progresso.",
        "O importante é nunca desistir, mesmo quando for difícil.",
        "A jornada para o bem-estar começa com um pequeno ato de cuidado.",
        "Você é mais forte do que pensa.",
        "Cuidar de si é o primeiro passo para cuidar dos outros.",
        "Hoje é um bom dia para se sentir bem consigo mesmo!",
        "Permita-se crescer e melhorar, um dia de cada vez.",
        "Mesmo nas dificuldades, você está crescendo e aprendendo.",
        "Não tenha medo de começar de novo. É uma nova chance de fazer melhor.",
        "Seja gentil consigo mesmo. Você está fazendo o melhor que pode.",
        "Pequenas vitórias também são conquistas!",
        "Você é digno de amor e cuidado, principalmente de si mesmo.",
        "Às vezes, descansar é a melhor maneira de avançar.",
        "O importante não é a velocidade, mas a direção.",
        "Cada desafio traz uma nova oportunidade de se superar.",
        "Acredite: você já superou muitas batalhas antes, e vai superar esta também.",
        "A jornada é tão importante quanto o destino.",
        "Não compare seu capítulo 1 com o capítulo 20 de outra pessoa.",
        "Respire fundo. Você é capaz de lidar com qualquer coisa.",
        "Seja paciente consigo. Crescer leva tempo.",
        "Mesmo a mais longa caminhada começa com um passo.",
        "Cuide da sua mente, ela é o seu bem mais precioso.",
        "O sol sempre volta a brilhar, mesmo depois de dias nublados.",
        "Tudo bem não estar bem o tempo todo. Permita-se sentir.",
        "Você é mais resiliente do que imagina.",
        "Às vezes, é preciso desacelerar para conseguir enxergar o caminho com clareza.",
        "A cada dia que passa, você está mais perto de alcançar seus objetivos.",
        "Confie no processo e valorize seu próprio ritmo.",
        "Seu bem-estar é prioridade. Cuide-se com carinho.",
        "Um dia de cada vez. Você está no caminho certo."
    ];

    // Seleciona aleatoriamente uma mensagem da lista
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Exibe a mensagem no elemento HTML
    document.getElementById('motivational-message').textContent = randomMessage;
}

// Função para criar e exibir o calendário
function createCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = ''; // Limpa o conteúdo anterior

    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const today = date.getDate(); // Armazena o dia atual

    // Atualiza o título do mês e do ano
    document.getElementById('calendar-title').textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    // Criando a grade do calendário
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Adiciona os dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-header';
        dayElement.textContent = day;
        calendarContainer.appendChild(dayElement);
    });

    // Preenchendo os dias em branco
    for (let i = 0; i < firstDay; i++) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'calendar-day empty';
        calendarContainer.appendChild(emptyElement);
    }

    // Preenchendo os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Verifica se há pensamentos ou pendências salvos nesta data
        const thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        const pendings = JSON.parse(localStorage.getItem('pendings')) || [];
        const currentDate = new Date(year, month, day).toLocaleDateString();

        if (thoughts.some(th => th.date === currentDate) || pendings.some(p => p.date === currentDate)) {
            dayElement.classList.add('has-notes');
            dayElement.title = 'Você tem anotações nesta data!';
        }

        // Adiciona um evento de clique para mostrar os botões de seleção de emoção somente se for o dia atual
        if (day === today) {
            dayElement.addEventListener('click', () => showEmotionButtons(dayElement));
        }

        calendarContainer.appendChild(dayElement);
    }
}


// Função para criar e exibir o calendário
function createCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = ''; // Limpa o conteúdo anterior

    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const today = date.getDate(); // Armazena o dia atual

    // Atualiza o título do mês e do ano
    document.getElementById('calendar-title').textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    // Criando a grade do calendário
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Adiciona os dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-header';
        dayElement.textContent = day;
        calendarContainer.appendChild(dayElement);
    });

    // Preenchendo os dias em branco
    for (let i = 0; i < firstDay; i++) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'calendar-day empty';
        calendarContainer.appendChild(emptyElement);
    }

    // Preenchendo os dias do mês
    const emotionalEntries = JSON.parse(localStorage.getItem('emotionalEntries')) || {};
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const currentDate = new Date(year, month, day).toLocaleDateString();

        // Se houver emoção salva, exibe o emoji sobre o dia
        if (emotionalEntries[currentDate]) {
            dayElement.innerHTML = `${day} ${emotionalEntries[currentDate]}`;
        }

        // Adiciona um evento de clique para mostrar os botões de seleção de emoção
        if (day === today) {
            dayElement.addEventListener('click', () => showEmotionButtons(dayElement));
        }

        calendarContainer.appendChild(dayElement);
    }
}

// Função para mostrar botões de seleção de emoções
function showEmotionButtons(dayElement) {
    // Limpa os botões existentes
    const existingButtons = document.querySelectorAll('.emotion-button');
    existingButtons.forEach(button => button.remove());

    // Emoções disponíveis
    const emotions = {
        feliz: '😊',
        triste: '😢',
        raiva: '😡',
        ciúmes: '😒',
        ansioso: '😰',
        animado: '😄',
        relaxado: '😌'
    };

    // Verifica se já existe uma emoção salva para o dia selecionado
    const date = new Date();
    const currentDate = new Date(date.getFullYear(), date.getMonth(), dayElement.textContent).toLocaleDateString();
    const emotionalEntries = JSON.parse(localStorage.getItem('emotionalEntries')) || {};

    // Se já houver uma emoção para o dia, não exibe os botões
    if (emotionalEntries[currentDate]) {
        alert('Você já selecionou uma emoção para este dia.');
        return;
    }

    // Cria e adiciona botões de emoção ao container
    const emotionButtonsContainer = document.getElementById('emotion-buttons-container');
    for (const [emotion, emoji] of Object.entries(emotions)) {
        const button = document.createElement('button');
        button.className = 'emotion-button';
        button.textContent = emoji; // Emoji representando a emoção
        button.onclick = () => addEmotionToDay(dayElement, emotion, emoji);
        emotionButtonsContainer.appendChild(button); // Adiciona ao container
    }
}

// Função para adicionar a emoção ao dia
function addEmotionToDay(dayElement, emotion, emoji) {
    const date = new Date();
    const currentDate = new Date(date.getFullYear(), date.getMonth(), dayElement.textContent).toLocaleDateString();

    // Armazena a emoção no Local Storage
    let emotionalEntries = JSON.parse(localStorage.getItem('emotionalEntries')) || {};
    
    // Verifica se já existe uma emoção salva para o dia
    if (emotionalEntries[currentDate]) {
        alert("Você já selecionou uma emoção para este dia.");
        return;
    }

    // Salva a emoção selecionada para o dia
    emotionalEntries[currentDate] = emoji; // Usa a data como chave
    localStorage.setItem('emotionalEntries', JSON.stringify(emotionalEntries));

    // Atualiza o elemento do dia com o emoji
    dayElement.innerHTML = `${dayElement.textContent} ${emoji}`; // Adiciona o emoji ao dia
    alert(`Emoção '${emotion}' adicionada ao dia ${dayElement.textContent}.`);

    // Remove os botões de emoção após a escolha
    const existingButtons = document.querySelectorAll('.emotion-button');
    existingButtons.forEach(button => button.remove());
}

// Cria o calendário ao carregar a página
window.onload = function() {
    showMotivationalMessage();
    createCalendar();
    displayHistory();
};
