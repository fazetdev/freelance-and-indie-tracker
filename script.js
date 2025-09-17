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

    // --- Progress Bar & Countdown Logic ---
    const milestones = {
        "odin": { endDate: new Date("2025-09-09T00:00:00") },
        "fso": { endDate: new Date("2025-10-20T00:00:00") },   // updated
        "arabic-uiux": { endDate: new Date("2025-12-15T00:00:00") },
        "typescript-next": { endDate: new Date("2026-01-12T00:00:00") }, // 4 weeks
        "portfolio": { endDate: null },
        "ai": { endDate: null },
        "english": { endDate: new Date("2026-01-12T00:00:00") }, // aligned
        "arabic": { endDate: null },
        "market-research": { endDate: null },
        "networking": { endDate: null },
        "business-skills": { endDate: null },
        "financial": { endDate: null },
        "legal": { endDate: null },
        "client-handling": { endDate: null }
    };
    
    
    const updateProgress = (groupName) => {
        const groupElement = document.querySelector(`[data-task-group="${groupName}"]`);
        if (!groupElement) return;

        const checkboxes = groupElement.querySelectorAll(".task-list input[type='checkbox']");
        const totalTasks = checkboxes.length;
        if (totalTasks === 0) return;

        const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
        const progressPercentage = (completedTasks / totalTasks) * 100;

        const progressBar = groupElement.querySelector("[data-progress-bar]");
        const progressText = groupElement.querySelector("[data-progress-text]");

        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }
    };

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
        const overallCountdownElement = document.getElementById("overall-countdown");
        const targetDate = new Date("2026-09-01T00:00:00");
        const overallTimeRemaining = targetDate.getTime() - now.getTime();
        const overallDays = Math.ceil(overallTimeRemaining / (1000 * 60 * 60 * 24));
        if (overallCountdownElement) {
            if (overallDays > 0) {
                overallCountdownElement.textContent = `Target: ${overallDays} days left`;
            } else {
                overallCountdownElement.textContent = `Target: September 2026 (Past)`;
            }
        }
    };

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

    const initialUpdate = () => {
        for (const groupName in milestones) {
            updateProgress(groupName);
        }
        updateOverallProgress();
        updateCountdowns();
    };

    initialUpdate();
    setInterval(updateCountdowns, 60000);
});