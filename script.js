document.addEventListener("DOMContentLoaded", () => {
    // --- Collapsible Logic ---
    const toggleButtons = document.querySelectorAll(".toggle-button");
    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const targetElement = document.querySelector(`[data-collapsible="${targetId}"]`);

            if (targetElement) {
                targetElement.classList.toggle("expanded");
                button.classList.toggle("collapsed");
            }
        });
    });

    // --- Milestones ---
    const milestones = {
        "odin": { endDate: new Date("2025-11-02T00:00:00") },
        "fso": { endDate: new Date("2025-12-17T00:00:00") },
        "arabic-uiux": { endDate: new Date("2026-02-01T00:00:00") },
        "typescript-next": { endDate: new Date("2026-03-04T00:00:00") },
        "portfolio": { endDate: new Date("2026-04-19T00:00:00") },

        // previously null → set to one week before portfolio
        "ai": { endDate: new Date("2026-03-01T00:00:00") },
        "english": { endDate: new Date("2026-01-12T00:00:00") },
        "arabic": { endDate: new Date("2026-03-01T00:00:00") },
        "market-research": { endDate: new Date("2026-03-01T00:00:00") },
        "networking": { endDate: new Date("2026-03-01T00:00:00") },
        "business-skills": { endDate: new Date("2026-03-01T00:00:00") },
        "financial": { endDate: new Date("2026-03-01T00:00:00") },
        "legal": { endDate: new Date("2026-03-01T00:00:00") },
        "client-handling": { endDate: new Date("2026-03-01T00:00:00") }
    };

    // --- Update Individual Progress ---
    const updateProgress = (groupName) => {
        const groupElement = document.querySelector(`[data-task-group="${groupName}"]`);
        if (!groupElement) return;

        const checkboxes = groupElement.querySelectorAll(".task-list input[type='checkbox']");
        const totalTasks = checkboxes.length;
        if (totalTasks === 0) return;

        const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
        const progressPercentage = (completedTasks / totalTasks) * 100;

        const progressBar = groupElement.querySelector(`[data-progress-bar="${groupName}"]`);
        const progressText = groupElement.querySelector(`[data-progress-text="${groupName}"]`);

        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }
    };

    // --- Update Overall Progress ---
    const updateOverallProgress = () => {
        const overallProgressBar = document.getElementById("overall-progress-bar");
        const overallProgressText = document.getElementById("overall-progress-text");
        
        let totalProgress = 0;
        let totalGroups = 0;

        for (const groupName in milestones) {
            const groupElement = document.querySelector(`[data-task-group="${groupName}"]`);
            if (groupElement) {
                const checkboxes = groupElement.querySelectorAll(".task-list input[type='checkbox']");
                const totalTasks = checkboxes.length;
                if (totalTasks > 0) {
                    const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
                    totalProgress += (completedTasks / totalTasks);
                    totalGroups++;
                }
            }
        }

        if (totalGroups > 0) {
            const overallPercentage = (totalProgress / totalGroups) * 100;
            if (overallProgressBar) {
                overallProgressBar.style.width = `${overallPercentage}%`;
            }
            if (overallProgressText) {
                overallProgressText.textContent = `${Math.round(overallPercentage)}% Complete`;
            }
        }
    };

    // --- Update Countdowns ---
    const updateCountdowns = () => {
        const now = new Date();
        for (const groupName in milestones) {
            const milestone = milestones[groupName];
            if (milestone.endDate) {
                const countdownElement = document.getElementById(`${groupName}-countdown`);
                if (countdownElement) {
                    const timeRemaining = milestone.endDate.getTime() - now.getTime();
                    const days = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
                    if (days > 0) {
                        countdownElement.textContent = `Days remaining: ${days}`;
                    } else if (days === 0) {
                        countdownElement.textContent = `Target: Today!`;
                    } else {
                        countdownElement.textContent = `Target passed`;
                    }
                }
            }
        }

        // --- Overall Countdown (Portfolio) ---
        const overallCountdownElement = document.getElementById("overall-countdown");
        const targetDate = milestones["portfolio"].endDate; // dynamically use Portfolio
        const overallTimeRemaining = targetDate.getTime() - now.getTime();
        const overallDays = Math.ceil(overallTimeRemaining / (1000 * 60 * 60 * 24));
        if (overallCountdownElement) {
            if (overallDays > 0) {
                overallCountdownElement.textContent = `Target: ${overallDays} days left`;
            } else {
                overallCountdownElement.textContent = `Target: Completed 🎉`;
            }
        }
    };

    // --- Checkbox Event Listeners ---
    const allCheckboxes = document.querySelectorAll(".task-list input[type='checkbox']");
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (event) => {
            const card = event.target.closest(".card");
            if (card) {
                const groupName = card.dataset.taskGroup;
                updateProgress(groupName);
                updateOverallProgress();
            }
        });
    });

    // --- Initial Load ---
    const initialUpdate = () => {
        for (const groupName in milestones) {
            updateProgress(groupName);
        }
        updateOverallProgress();
        updateCountdowns();
    };

    initialUpdate();
    setInterval(updateCountdowns, 60000); // refresh countdowns every minute
});
