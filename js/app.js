class App {
    constructor() {
        this.todoService = new TodoService();
        this.notificationService = new NotificationService();
        
        // DOM 요소
        this.todoForm = document.getElementById('todoForm');
        this.todoList = document.getElementById('todoList');
        this.statusFilter = document.getElementById('statusFilter');
        this.searchInput = document.getElementById('searchInput');
        this.sortBy = document.getElementById('sortBy');
        this.sortOrder = document.getElementById('sortOrder');
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.currentEditingId = null;
        
        this.initializeEventListeners();
        this.renderTodos();
    }

    initializeEventListeners() {
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('todoTitle').value;
            const details = document.getElementById('todoDetails').value;
            
            const todo = this.todoService.addTodo(title, details);
            this.notificationService.show('할 일이 추가되었습니다.');
            this.renderTodos();
            this.todoForm.reset();
        });

        this.statusFilter.addEventListener('change', () => this.renderTodos());
        this.searchInput.addEventListener('input', () => this.renderTodos());
        this.sortBy.addEventListener('change', () => this.renderTodos());
        this.sortOrder.addEventListener('change', () => this.renderTodos());
        
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });
    }

    renderTodos() {
        const status = this.statusFilter.value;
        const searchText = this.searchInput.value;
        const sortBy = this.sortBy.value;
        const sortOrder = this.sortOrder.value;
        
        let todos = this.todoService.filterTodos(status, searchText);
        todos = this.todoService.sortTodos(todos, sortBy, sortOrder);

        this.todoList.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.status === 'completed' ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" 
                       ${todo.status === 'completed' ? 'checked' : ''}
                       onchange="app.toggleTodo(${todo.id})">
                <div class="todo-content">
                    <h3>${todo.title}</h3>
                    <p>${todo.details}</p>
                    <small>생성: ${new Date(todo.createdAt).toLocaleString()}</small>
                    ${todo.completedAt ? `<br><small>완료: ${new Date(todo.completedAt).toLocaleString()}</small>` : ''}
                </div>
                <div class="todo-actions">
                    <button class="btn btn-edit" onclick="app.openEditModal(${todo.id})">수정</button>
                    <button class="btn btn-delete" onclick="app.deleteTodo(${todo.id})">삭제</button>
                </div>
            </li>
        `).join('');
    }

    toggleTodo(id) {
        const todo = this.todoService.toggleStatus(id);
        if (todo) {
            this.notificationService.show(
                `할 일이 ${todo.status === 'completed' ? '완료' : '미완료'}로 변경되었습니다.`
            );
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        if (this.todoService.deleteTodo(id)) {
            this.notificationService.show('할 일이 삭제되었습니다.');
            this.renderTodos();
        }
    }

    openEditModal(id) {
        const todo = this.todoService.todos.find(todo => todo.id === id);
        if (!todo) return;

        this.currentEditingId = id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editDetails').value = todo.details;
        this.editModal.style.display = 'block';
    }

    closeEditModal() {
        this.editModal.style.display = 'none';
        this.currentEditingId = null;
        this.editForm.reset();
    }

    saveEdit() {
        if (!this.currentEditingId) return;

        const updates = {
            title: document.getElementById('editTitle').value,
            details: document.getElementById('editDetails').value
        };

        const updated = this.todoService.updateTodo(this.currentEditingId, updates);
        if (updated) {
            this.notificationService.show('할 일이 수정되었습니다.');
            this.renderTodos();
            this.closeEditModal();
        }
    }
}

const app = new App(); 