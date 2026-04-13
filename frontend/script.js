const API_URL = 'http://localhost:3000/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const editTaskIdInput = document.getElementById('edit-task-id');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const formError = document.getElementById('form-error');
const taskList = document.getElementById('task-list');
const loadingIndicator = document.getElementById('loading');

// Filter Buttons
const btnFilterAll = document.getElementById('filter-all');
const btnFilterPending = document.getElementById('filter-pending');
const btnFilterDone = document.getElementById('filter-done');
const btnSortDate = document.getElementById('sort-date');

const filterBtns = [btnFilterAll, btnFilterPending, btnFilterDone];

let currentFilter = '';
let currentSort = ''; // Empty = Newest first (custom client reverse), 'createdAt' = Oldest first

// Event Listeners
taskForm.addEventListener('submit', handleFormSubmit);
cancelEditBtn.addEventListener('click', cancelEdit);

btnFilterAll.addEventListener('click', () => applyFilter(''));
btnFilterPending.addEventListener('click', () => applyFilter('pending'));
btnFilterDone.addEventListener('click', () => applyFilter('done'));
btnSortDate.addEventListener('click', toggleSort);

// Expose these nicely for inline handlers
window.markTaskDone = markTaskDone;
window.deleteTask = deleteTask;
window.startEditTask = startEditTask;

// Wait for DOM
document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    showLoading(true);
    try {
        let url = API_URL;
        const params = new URLSearchParams();
        if (currentFilter) params.append('status', currentFilter);
        if (currentSort) params.append('sort', currentSort);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            let fetchedTasks = data.data;
            // The default sort from the backend when 'sort' is empty is insertion order (createdAt oldest).
            // To match a modern Dashboard layout (Newest First) without modifying backend logic, we reverse it here:
            if (!currentSort) {
               fetchedTasks = [...fetchedTasks].reverse();
            }
            renderTasks(fetchedTasks);
        } else {
            showError(data.message || 'Failed to fetch tasks');
        }
    } catch (err) {
        showError('Network error. Is the backend running?');
    } finally {
        showLoading(false);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    hideError();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const id = editTaskIdInput.value;

    if (!title) {
        showError('Title is required');
        return;
    }

    const payload = { title, description };
    showLoading(true);

    try {
        let url = API_URL;
        let method = 'POST';

        if (id) {
            url = `${API_URL}/${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            cancelEdit();
            fetchTasks();
        } else {
            showError(data.message || 'Input error');
        }
    } catch (err) {
        showError('Network error while saving task');
    } finally {
        showLoading(false);
    }
}

async function markTaskDone(id) {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/${id}/done`, {
            method: 'PATCH'
        });
        const data = await response.json();
        if (data.success) {
            fetchTasks();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Network error');
    } finally {
        showLoading(false);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 200 || response.status === 204) {
            fetchTasks();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to delete');
        }
    } catch (err) {
        alert('Network error while deleting task');
    } finally {
        showLoading(false);
    }
}

function startEditTask(id, title, description) {
    titleInput.value = title;
    descInput.value = description;
    editTaskIdInput.value = id;
    submitBtn.textContent = 'Update Task';
    cancelEditBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    taskForm.reset();
    editTaskIdInput.value = '';
    submitBtn.textContent = 'Add Task';
    cancelEditBtn.classList.add('hidden');
    hideError();
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="text-center py-12 bg-white/80 rounded-2xl border border-gray-100 shadow-sm animate-fade-in backdrop-blur-sm">
                <div class="text-gray-300 mb-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                <h3 class="text-lg font-bold text-gray-800">No tasks found</h3>
                <p class="text-gray-500 mt-1 max-w-sm mx-auto">Get started by creating a new task, or adjust your current filters.</p>
            </div>
        `;
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const isDone = task.status === 'done';
        
        // Build base class for li
        li.className = `group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-4 animate-slide-up transform hover:-translate-y-1 ${isDone ? 'opacity-60 hover:opacity-100 bg-gray-50/80 saturate-50' : ''}`;
        
        // Stagger animation timing slightly for visual polish
        li.style.animationDelay = `${index * 0.05}s`;
        
        const dateStr = new Date(task.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        
        const safeTitle = escapeHTML(task.title);
        const safeDesc = escapeHTML(task.description);

        const statusBadge = isDone 
            ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow-sm border border-green-200 uppercase tracking-widest">Done</span>'
            : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 shadow-sm border border-amber-200 uppercase tracking-widest">Pending</span>';

        li.innerHTML = `
            <div class="flex-1 w-full min-w-0 pr-4">
                <div class="flex items-center gap-3 mb-2">
                    ${statusBadge}
                    <span class="text-xs text-gray-400 font-semibold tracking-wide uppercase">${dateStr}</span>
                </div>
                <h3 class="text-xl font-extrabold text-gray-900 mt-1 mb-1 truncate ${isDone ? 'line-through text-gray-500' : ''}">${safeTitle}</h3>
                ${safeDesc ? `<p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap ${isDone ? 'line-through text-gray-400' : ''}">${safeDesc}</p>` : ''}
            </div>
            
            <div class="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end flex-shrink-0">
                ${!isDone ? `<button onclick="markTaskDone('${task.id}')" class="flex-1 sm:flex-none flex justify-center items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow border border-green-200 hover:border-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    Mark Done
                </button>` : ''}
                
                <div class="flex gap-2 flex-1 sm:flex-none">
                    <button onclick="startEditTask('${task.id}', '${safeTitle.replace(/'/g, "\\'")}', '${safeDesc.replace(/'/g, "\\'")}')" class="flex-1 sm:flex-none flex justify-center items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow border border-blue-200 hover:border-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                    </button>
                    <button onclick="deleteTask('${task.id}')" class="flex-1 sm:flex-none flex justify-center items-center gap-1 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white px-3 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow border border-red-200 hover:border-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function applyFilter(status) {
    currentFilter = status;
    
    // Reset all styling explicitly
    filterBtns.forEach(btn => {
        btn.className = "filter-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all bg-white text-gray-600 hover:text-gray-900 border border-gray-200 shadow-sm hover:shadow active:scale-95";
    });
    
    // Determine active
    let activeBtn = btnFilterAll;
    if (status === 'pending') activeBtn = btnFilterPending;
    else if (status === 'done') activeBtn = btnFilterDone;
    
    // Update active class
    activeBtn.className = "filter-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all bg-blue-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active-filter";
    
    fetchTasks();
}

function toggleSort() {
    if (currentSort === 'createdAt') {
        currentSort = ''; // Empty defaults to Newest first due to our custom array reverse
        btnSortDate.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            Sort: Newest
        `;
        btnSortDate.className = "sort-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all bg-white text-gray-600 hover:text-gray-900 border border-gray-200 shadow-sm flex items-center gap-1.5 hover:shadow active:scale-95";
    } else {
        currentSort = 'createdAt'; // Oldest first
        btnSortDate.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            Sort: Oldest
        `;
        btnSortDate.className = "sort-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all bg-blue-50 text-blue-700 border border-blue-300 shadow-sm flex items-center gap-1.5 active:scale-95";
    }
    fetchTasks();
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        taskList.classList.add('opacity-30', 'pointer-events-none', 'scale-95', 'transition-all', 'duration-300');
    } else {
        loadingIndicator.classList.add('hidden');
        taskList.classList.remove('opacity-30', 'pointer-events-none', 'scale-95');
    }
}

function showError(msg) {
    formError.textContent = msg;
    formError.classList.remove('hidden');
    formError.classList.add('animate-fade-in');
}

function hideError() {
    formError.textContent = '';
    formError.classList.add('hidden');
    formError.classList.remove('animate-fade-in');
}

function escapeHTML(str) {
    if (!str) return '';
    const span = document.createElement('span');
    span.textContent = str;
    return span.innerHTML;
}
