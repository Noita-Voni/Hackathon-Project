document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const projectGrid = document.getElementById('projects-grid');
    const uploadedProjectsGrid = document.getElementById('uploaded-projects-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const submitForm = document.getElementById('submitProjectForm');
    const uploadedProjectsSection = document.getElementById('uploaded-projects');

    // Project Management Functions
    function loadProjects() {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // Only show the uploaded projects section if there are projects
        if (savedProjects.length > 0) {
            uploadedProjectsSection.style.display = 'block';
            savedProjects.forEach(project => addProjectToGrid(project));
        }
    }

    function saveProject(project) {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        savedProjects.push(project);
        localStorage.setItem('projects', JSON.stringify(savedProjects));
    }

    // Function to create and append a project card
    function addProjectToGrid(project) {
        const newProject = document.createElement('div');
        newProject.classList.add('project-card', 'uploaded-card');
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
        
        // Make sure the uploaded projects section is visible
        uploadedProjectsSection.style.display = 'block';
        
        // Append to uploaded projects grid
        uploadedProjectsGrid.appendChild(newProject);
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

    // Form Submission Handler
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values and validate
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

        // Create and save new project
        const newProject = {
            title,
            level,
            githubLink,
            contributor,
            description,
            likes: 0
        };

        saveProject(newProject);
        addProjectToGrid(newProject);
        refreshFilter();
        submitForm.reset();
    });

    // Filtering Function
    function filterProjects(category) {
        // Handle pre-existing project cards
        const preExistingCards = document.querySelectorAll('#projects-grid .project-card');
        preExistingCards.forEach(card => {
            const shouldDisplay = category === 'all' || card.dataset.category === category;
            card.style.display = shouldDisplay ? 'block' : 'none';
            if (shouldDisplay) card.style.animation = 'fadeIn 0.5s ease';
        });

        // Handle user uploaded project cards differently
        const uploadedCards = document.querySelectorAll('#uploaded-projects-grid .project-card');
        uploadedCards.forEach(card => {
            // For uploaded projects, you might want to:
            // 1. Either show all of them regardless of category
            // card.style.display = 'block';
            
            // 2. Or filter them by category like the pre-existing ones
            const shouldDisplay = category === 'all' || card.dataset.category === category;
            card.style.display = shouldDisplay ? 'block' : 'none';
            if (shouldDisplay) card.style.animation = 'fadeIn 0.5s ease';
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

    // Search Implementation
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allProjectCards = document.querySelectorAll('.project-card');
        
        allProjectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const paragraphs = card.querySelectorAll('p');
            let matches = title.includes(searchTerm);
            
            // Check all paragraphs for search term
            paragraphs.forEach(p => {
                if (p.textContent.toLowerCase().includes(searchTerm)) {
                    matches = true;
                }
            });
            
            card.style.display = matches ? 'block' : 'none';
        });
    });

    // Initial Setup
    loadProjects();
    filterProjects('all'); // Start with showing all projects instead of just beginner
});