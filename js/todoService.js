class TodoService {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo(title, details = '') {
        const todo = {
            id: Date.now(),
            title,
            details,
            status: 'active',
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.todos.push(todo);
        this.saveTodos();
        return todo;
    }

    updateTodo(id, updates) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            Object.assign(todo, updates);
            this.saveTodos();
            return todo;
        }
        return null;
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            this.saveTodos();
            return true;
        }
        return false;
    }

    toggleStatus(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.status = todo.status === 'active' ? 'completed' : 'active';
            todo.completedAt = todo.status === 'completed' ? new Date().toISOString() : null;
            this.saveTodos();
            return todo;
        }
        return null;
    }

    filterTodos(status = 'all', searchText = '') {
        return this.todos.filter(todo => {
            const matchesStatus = status === 'all' || todo.status === status;
            const matchesSearch = todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
                                todo.details.toLowerCase().includes(searchText.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }

    sortTodos(todos, sortBy = 'createdAt', sortOrder = 'desc') {
        return [...todos].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return sortOrder === 'asc' 
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                case 'createdAt':
                    return sortOrder === 'asc'
                        ? new Date(a.createdAt) - new Date(b.createdAt)
                        : new Date(b.createdAt) - new Date(a.createdAt);
                case 'completedAt':
                    if (!a.completedAt) return sortOrder === 'asc' ? -1 : 1;
                    if (!b.completedAt) return sortOrder === 'asc' ? 1 : -1;
                    return sortOrder === 'asc'
                        ? new Date(a.completedAt) - new Date(b.completedAt)
                        : new Date(b.completedAt) - new Date(a.completedAt);
                default:
                    return 0;
            }
        });
    }
} 