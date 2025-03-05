document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const projectGrid = document.getElementById('projects-grid');
    const uploadedProjectsGrid = document.getElementById('uploaded-projects-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const submitForm = document.getElementById('submitProjectForm');

    // Load projects from localStorage
    function loadProjects() {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        savedProjects.forEach(project => addProjectToGrid(project));
    }

    // Save projects to localStorage
    function saveProject(project) {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        savedProjects.push(project);
        localStorage.setItem('projects', JSON.stringify(savedProjects));
    }

    // Function to create and append a project card
    function addProjectToGrid(project) {
        const newProject = document.createElement('div');
        newProject.classList.add('project-card');
        newProject.setAttribute('data-category', project.level);

        newProject.innerHTML = `
            <h3>${project.title}</h3>
            <p><strong>By:</strong> ${project.contributor}</p>
            <p>${project.description}</p>
            <a href="${project.githubLink}" target="_blank">GitHub Repo</a>
            <button class="like-btn">❤️ <span class="like-count">${project.likes || 0}</span></button>
        `;

        // Handle like button
        const likeButton = newProject.querySelector('.like-btn');
        likeButton.addEventListener('click', function () {
            project.likes = (project.likes || 0) + 1;
            likeButton.querySelector('.like-count').textContent = project.likes;
            updateLikesInStorage(project);
        });

        // Add animation class
        newProject.style.animation = 'fadeIn 0.5s ease forwards';
        
        // Append to uploaded projects grid
        uploadedProjectsGrid.appendChild(newProject);
        
        // Make sure the uploaded projects section is visible
        document.getElementById('uploaded-projects').style.display = 'block';
    }

    // Update likes in localStorage
    function updateLikesInStorage(updatedProject) {
        let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        savedProjects = savedProjects.map(project =>
            project.title === updatedProject.title ? updatedProject : project
        );
        localStorage.setItem('projects', JSON.stringify(savedProjects));
    }

    // Refresh the current filter to update display of new projects
    function refreshFilter() {
        const activeButton = document.querySelector('.category-btn.active');
        const currentCategory = activeButton ? activeButton.dataset.category : 'all';
        filterProjects(currentCategory);
    }

    // Handle form submission
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values
        const title = document.getElementById('projectTitle').value;
        const level = document.getElementById('projectLevel').value;
        const githubLink = document.getElementById('projectLink').value;
        const contributor = document.getElementById('contributorName').value;
        const description = document.getElementById('projectDescription').value;

        // Validate form inputs
        if (!title || !level || !githubLink || !contributor || !description) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        // Create project object
        const newProject = {
            title,
            level,
            githubLink,
            contributor,
            description,
            likes: 0
        };

        // Save to localStorage
        saveProject(newProject);

        // Add to UI
        addProjectToGrid(newProject);

        // Refresh filter so the new project is displayed if it matches the current category
        refreshFilter();

        // Reset form
        submitForm.reset();
    });

    // Filter projects by category
    function filterProjects(category) {
        const allProjectCards = document.querySelectorAll('.project-card');
        allProjectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Add animation
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Update active button state
        categoryButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Add click event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterProjects(category);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allProjectCards = document.querySelectorAll('.project-card');
        
        allProjectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            
            card.style.display = isVisible ? 'block' : 'none';
        });
    });

    // Initial load
    loadProjects();

    // Show projects of a default category (e.g., beginner) initially
    filterProjects('beginner');
});