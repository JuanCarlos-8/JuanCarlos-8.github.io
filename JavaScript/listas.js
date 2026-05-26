// --- ELEMENTOS DEL DOM ---
const weekSelector = document.getElementById('week-selector');
const extendedDate = document.getElementById('extended-date');
const taskForm = document.getElementById('advanced-task-form');
const taskTitleInput = document.getElementById('task-title');
const taskTimeInput = document.getElementById('task-time');

// Columnas
const listPending = document.getElementById('list-pending');
const listExpired = document.getElementById('list-expired');
const listCompleted = document.getElementById('list-completed');

// Contadores de columnas
const countPending = document.getElementById('count-pending');
const countExpired = document.getElementById('count-expired');
const countCompleted = document.getElementById('count-completed');

// Métricas Mensuales
const summaryMonthTitle = document.getElementById('summary-month-title');
const monthCompleted = document.getElementById('month-completed');
const monthExpired = document.getElementById('month-expired');
const monthEfficiencyPct = document.getElementById('month-efficiency-pct');
const efficiencyBar = document.getElementById('efficiency-bar');

// --- ESTADO GLOBAL ---
let tasks = JSON.parse(localStorage.getItem('advanced_tasks')) || [];
let selectedDate = new Date(); // Por defecto, el día de hoy

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// --- INICIALIZADOR ---
function init() {
    renderWeekSelector();
    updateDateDisplay();
    renderDashboard();
    // Revisar periódicamente si las tareas cambian a estado "expirado" con el paso del tiempo
    setInterval(renderDashboard, 30000); 
}

// --- CONFIGURACIÓN DE FECHAS Y SEMANA ---
function updateDateDisplay() {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    extendedDate.innerText = selectedDate.toLocaleDateString('es-ES', options);
    
    const monthName = new Date().toLocaleDateString('es-ES', { month: 'long' });
    summaryMonthTitle.innerText = `Rendimiento de ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
}

function renderWeekSelector() {
    weekSelector.innerHTML = '';
    const current = new Date();
    
    // Obtenemos el lunes de la semana actual
    const dayOfWeek = current.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(current.setDate(current.getDate() + distanceToMonday));

    // Generamos los 7 días (Lunes a Domingo)
    for (let i = 0; i < 7; i++) {
        const loopDay = new Date(monday);
        loopDay.setDate(monday.getDate() + i);

        const btn = document.createElement('button');
        btn.className = "flex flex-col items-center p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-100 transition-all day-btn";
        
        // Atributo único para identificar el día
        const dateString = loopDay.toISOString().split('T')[0];
        btn.dataset.date = dateString;

        btn.innerHTML = `
            <span class="text-xs text-gray-400 font-medium">${dayNames[loopDay.getDay()]}</span>
            <span class="text-sm font-bold text-gray-800 mt-1">${loopDay.getDate()}</span>
        `;

        // Marcar activo si coincide con el seleccionado
        if (dateString === selectedDate.toISOString().split('T')[0]) {
            btn.classList.add('day-btn-active');
        }

        btn.addEventListener('click', () => {
            selectedDate = new Date(dateString);
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('day-btn-active'));
            btn.classList.add('day-btn-active');
            updateDateDisplay();
            renderDashboard();
        });

        weekSelector.appendChild(btn);
    }
}

// --- GESTIÓN DE RENDERIZADO Y LÓGICA DE ESTADOS ---
function renderDashboard() {
    // Limpiar listas anteriores
    listPending.innerHTML = '';
    listExpired.innerHTML = '';
    listCompleted.innerHTML = '';

    const selectedString = selectedDate.toISOString().split('T')[0];
    const now = new Date();

    let pCount = 0, eCount = 0, cCount = 0;

    // Filtrar tareas pertenecientes exclusivamente al día seleccionado
    const dayTasks = tasks.filter(t => t.assignedDate === selectedString);

    dayTasks.forEach(task => {
        // Encontrar el índice real global de la tarea
        const realIndex = tasks.findIndex(t => t.id === task.id);

        // Crear elemento HTML (Card)
        const li = document.createElement('li');
        li.className = "task-card bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between gap-3";

        // Determinar si la tarea expiró de tiempo (Atrasada)
        const taskDeadline = new Date(`${task.assignedDate}T${task.deadline}`);
        const isExpired = now > taskDeadline && !task.completed;

        if (task.completed) {
            cCount++;
            li.innerHTML = `
                <div class="flex items-start gap-3">
                    <input type="checkbox" checked onchange="toggleTaskStatus(${realIndex})" class="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer">
                    <div class="flex-1">
                        <p class="text-sm font-medium task-completed-text">${task.title}</p>
                        <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">Completada</span>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <span>Limite: ${task.deadline}</span>
                    <button onclick="deleteTask(${realIndex})" class="text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
                </div>
            `;
            listCompleted.appendChild(li);
        } else if (isExpired) {
            eCount++;
            li.innerHTML = `
                <div class="flex items-start gap-3">
                    <input type="checkbox" onchange="toggleTaskStatus(${realIndex})" class="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer">
                    <div class="flex-1">
                        <p class="text-sm font-semibold text-red-900">${task.title}</p>
                        <span class="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">Fuera de tiempo</span>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <span class="text-red-500 font-medium">Expiró a las: ${task.deadline}</span>
                    <button onclick="deleteTask(${realIndex})" class="text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
                </div>
            `;
            listExpired.appendChild(li);
        } else {
            pCount++;
            li.innerHTML = `
                <div class="flex items-start gap-3">
                    <input type="checkbox" onchange="toggleTaskStatus(${realIndex})" class="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800">${task.title}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <span class="text-gray-500 font-medium">Límite: ${task.deadline} hrs</span>
                    <button onclick="deleteTask(${realIndex})" class="text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
                </div>
            `;
            listPending.appendChild(li);
        }
    });

    // Actualizar marcadores numéricos de las columnas
    countPending.innerText = pCount;
    countExpired.innerText = eCount;
    countCompleted.innerText = cCount;

    calculateMonthlyMetrics();
}

// --- CREAR TAREA ---
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = taskTitleInput.value.trim();
    const deadline = taskTimeInput.value;
    const assignedString = selectedDate.toISOString().split('T')[0];

    if (!title || !deadline) return;

    const newTask = {
        id: 'task_' + Date.now(),
        title: title,
        deadline: deadline,
        assignedDate: assignedString,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskTitleInput.value = '';
    taskTimeInput.value = '';
    
    saveAndSync();
});

// Cambiar estado
window.toggleTaskStatus = function(globalIndex) {
    tasks[globalIndex].completed = !tasks[globalIndex].completed;
    saveAndSync();
};

// Eliminar Tarea
window.deleteTask = function(globalIndex) {
    tasks.splice(globalIndex, 1);
    saveAndSync();
};

function saveAndSync() {
    localStorage.setItem('advanced_tasks', JSON.stringify(tasks));
    renderDashboard();
}

// --- CÁLCULO ESTADÍSTICO MENSUAL ---
function calculateMonthlyMetrics() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtramos todas las tareas que pertenecen al mes en curso
    const monthTasks = tasks.filter(t => {
        const tDate = new Date(`${t.assignedDate}T00:00:00`);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    let completedCount = 0;
    let expiredCount = 0;

    monthTasks.forEach(t => {
        if (t.completed) {
            completedCount++;
        } else {
            const deadlineDate = new Date(`${t.assignedDate}T${t.deadline}`);
            if (now > deadlineDate) {
                expiredCount++;
            }
        }
    });

    // Cálculos de interfaz
    monthCompleted.innerText = completedCount;
    monthExpired.innerText = expiredCount;

    const totalCalculables = completedCount + expiredCount;
    let efficiencyRate = 0;

    if (totalCalculables > 0) {
        efficiencyRate = Math.round((completedCount / totalCalculables) * 100);
    }

    monthEfficiencyPct.innerText = `${efficiencyRate}%`;
    efficiencyBar.style.width = `${efficiencyRate}%`;
}

// --- GOOGLE CALENDAR LINK ---
document.getElementById('btn-calendar').addEventListener('click', () => {
    alert("Módulo API Google Calendar\\n\\nEstructura lista para producción. En el entorno real, aquí se ejecuta la petición OAuth2 enviando el array JSON con las propiedades 'title' y 'deadline' mapeadas como eventos.");
});

// Lanzar sistema
init();