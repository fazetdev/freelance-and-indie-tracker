document.addEventListener("DOMContentLoaded", () => {
    // Data for milestones and their end dates
    const milestones = [
        { id: "odin", endDate: new Date("2025-09-09") },
        { id: "fso", endDate: new Date("2025-10-27") },
        { id: "uiux", endDate: new Date("2025-12-15") },
        { id: "ts-next", endDate: new Date("2026-01-12") },
        { id: "english", endDate: new Date("2026-01-12") },
    ];

    // Helper function to update a single progress bar and text on the current page
    function updateProgress(taskGroup) {
        const checkboxes = document.querySelectorAll(
            `[data-task-group="${taskGroup}"] input[type="checkbox"]`
        );
        const total = checkboxes.length;
        if (total === 0) return;

        const completed = Array.from(checkboxes).filter((cb) => cb.checked).length;
        const percentage = (completed / total) * 100;

        const progressBar = document.querySelector(
            `[data-progress-bar="${taskGroup}"]`
        );
        const progressText = document.querySelector(
            `[data-progress-text="${taskGroup}"]`
        );

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${percentage.toFixed(0)}% Complete`;
        }
    }

    // Function to calculate and update overall progress on the index page
    function updateOverallProgress() {
        // Retrieve all tasks from local storage
        const allTasks = JSON.parse(localStorage.getItem("trackerState")) || {};
        const totalTasks = Object.keys(allTasks).length;
        if (totalTasks === 0) return;

        const completedTasks = Object.values(allTasks).filter(isCompleted => isCompleted).length;
        const overallPercentage = (completedTasks / totalTasks) * 100;

        // Update elements on the index page
        const overallProgressBar = document.getElementById("overall-progress-bar");
        const overallProgressText = document.getElementById("overall-progress-text");

        if (overallProgressBar) {
            overallProgressBar.style.width = `${overallPercentage}%`;
        }
        if (overallProgressText) {
            overallProgressText.textContent = `${overallPercentage.toFixed(0)}% Complete`;
        }
    }

    // Helper function to update a single countdown
    function updateCountdown(milestone) {
        const now = new Date();
        const difference = milestone.endDate.getTime() - now.getTime();
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        const countdownElement = document.getElementById(`${milestone.id}-countdown`);

        if (countdownElement) {
            if (days > 0) {
                countdownElement.textContent = `${days} days remaining`;
            } else {
                countdownElement.textContent = "Milestone passed!";
                countdownElement.style.color = "#e74c3c";
            }
        }
    }

    // Load state from local storage on page load
    function loadState() {
        const state = JSON.parse(localStorage.getItem("trackerState")) || {};
        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((cb) => {
            if (state[cb.id] !== undefined) {
                cb.checked = state[cb.id];
            }
        });
    }

    // Save state to local storage whenever a checkbox is changed
    function saveState(checkboxId, isChecked) {
        const state = JSON.parse(localStorage.getItem("trackerState")) || {};
        state[checkboxId] = isChecked;
        localStorage.setItem("trackerState", JSON.stringify(state));
    }

    // Initialize the page
    function init() {
        loadState();

        milestones.forEach(updateCountdown);

        const allTaskGroupsOnPage = new Set(
            Array.from(document.querySelectorAll("[data-task-group]")).map(
                (el) => el.dataset.taskGroup
            )
        );
        allTaskGroupsOnPage.forEach(updateProgress);

        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.addEventListener("change", (event) => {
                saveState(event.target.id, event.target.checked);
                const taskGroup = event.target.closest("[data-task-group]").dataset.taskGroup;
                updateProgress(taskGroup);
                updateOverallProgress();
            });
        });

        // NEW: Event listeners for the toggle buttons
        document.querySelectorAll(".toggle-button").forEach(button => {
            button.addEventListener("click", () => {
                const targetId = button.dataset.target;
                const content = document.querySelector(`[data-collapsible="${targetId}"]`);
                if (content && button) {
                    content.classList.toggle("collapsed");
                    button.classList.toggle("collapsed");
                }
            });
        });

        // Initial call to set overall progress on the index page
        if (document.getElementById("overall-progress-bar")) {
            updateOverallProgress();
        }
    }

    init();
});
