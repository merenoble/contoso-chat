class NotificationService {
    constructor() {
        this.notification = document.getElementById('notification');
    }

    show(message, duration = 3000) {
        this.notification.textContent = message;
        this.notification.style.display = 'block';

        setTimeout(() => {
            this.notification.style.display = 'none';
        }, duration);
    }
} 