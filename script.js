
const GITHUB_USERNAME = 'Jybhavsar12';

async function fetchGitHubProjects() {
    try {
        const starredResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=10`);
        const starred = await starredResponse.json();
        
        const projectsContainer = document.getElementById('projects-container');
        
        starred.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();
    const createdDate = new Date(repo.created_at).toLocaleDateString();
    
    card.innerHTML = `
        <div class="project-header">
            <h3>${repo.name}</h3>
            <span class="starred-badge"><i class="fas fa-star"></i> Starred</span>
        </div>
        <p class="project-description">${repo.description || 'No description available'}</p>
        
        <div class="project-stats">
            <span class="stat"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span class="stat"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            <span class="stat"><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
            ${repo.size ? `<span class="stat"><i class="fas fa-database"></i> ${(repo.size / 1024).toFixed(1)}MB</span>` : ''}
        </div>
        
        <div class="project-tech">
            ${repo.language ? `<span class="tech-tag primary-lang">${repo.language}</span>` : ''}
            ${repo.topics ? repo.topics.slice(0, 3).map(topic => `<span class="tech-tag topic">${topic}</span>`).join('') : ''}
        </div>
        
        <div class="project-meta">
            <small><i class="fas fa-calendar"></i> Created: ${createdDate}</small>
            <small><i class="fas fa-sync"></i> Updated: ${updatedDate}</small>
        </div>
        
        <div class="project-links">
            <a href="${repo.html_url}" target="_blank" title="View Repository">
                <i class="fab fa-github"></i> Repository
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
            <span class="owner-info">by ${repo.owner.login}</span>
        </div>
    `;
    
    return card;
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load projects when page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// EmailJS Configuration
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'JFiFeoR_C3j4rgPx5',
    SERVICE_ID: 'service_fket6cq',
    TEMPLATE_ID: 'template_r6k0qyt'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Notification function
function showNotification(title, message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon} notification-icon"></i>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };
    
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, formData)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showNotification(
            'Message Sent Successfully! 🚀',
            'Thank you for reaching out! I\'ll get back to you within 24 hours.',
            'success'
        );
        document.getElementById('contact-form').reset();
    }, function(error) {
        console.log('FAILED...', error);
        showNotification(
            'Failed to Send Message 😞',
            'Something went wrong. Please try again or contact me directly via email.',
            'error'
        );
    })
    .finally(function() {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});
