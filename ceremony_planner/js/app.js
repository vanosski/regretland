document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const goalDropdown = document.getElementById('goalDropdown');
    const totalTasksDropsEl = document.getElementById('totalTasksDrops');
    const missingDropsEl = document.getElementById('missingDrops');
    const dailyMonsterDropsEl = document.getElementById('dailyMonsterDrops');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const daysGrid = document.getElementById('daysGrid');
    const dayDropdown = document.getElementById('dayDropdown');
    const milestonesGrid = document.getElementById('milestonesGrid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const buffContainer = document.getElementById('buffContainer');
    const buff5400 = document.getElementById('buff5400');

    // State
    const state = {
        goal: parseInt(goalDropdown.value),
        selectedItems: new Set() // stores IDs of checked items
    };

    // Initialize UI
    initTabs();
    renderDailyTasks();
    renderMilestones();
    checkBuffVisibility();
    calculateTotals();

    // Event Listeners
    goalDropdown.addEventListener('change', (e) => {
        state.goal = parseInt(e.target.value);
        checkBuffVisibility();
        calculateTotals();
    });
    
    dayDropdown.addEventListener('change', (e) => {
        const selectedDay = e.target.value;
        document.querySelectorAll('.day-card').forEach(card => {
            if (card.dataset.day === selectedDay) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    buff5400.addEventListener('change', () => {
        calculateTotals();
    });

    function initTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab + 'View').classList.add('active');
            });
        });
    }

    function createCheckboxItem(id, desc, drops, isChest = false) {
        const item = document.createElement('label');
        item.className = `task-item ${isChest ? 'chest-item' : ''}`;
        item.dataset.id = id;
        item.dataset.drops = drops;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = id;
        
        // Default check daily tasks
        if (!isChest && id.startsWith('d')) {
            input.checked = true;
            state.selectedItems.add(id);
        }

        const customCheck = document.createElement('div');
        customCheck.className = 'custom-checkbox';

        const content = document.createElement('div');
        content.className = 'task-content';
        
        const descSpan = document.createElement('span');
        descSpan.className = 'task-desc';
        descSpan.innerHTML = desc;

        const dropsSpan = document.createElement('span');
        dropsSpan.className = 'task-drops';
        dropsSpan.textContent = `+${drops} Drops`;

        content.appendChild(descSpan);
        content.appendChild(dropsSpan);

        item.appendChild(input);
        item.appendChild(customCheck);
        item.appendChild(content);

        // Event listener for manual toggle
        input.addEventListener('change', (e) => {
            if (isChest) {
                // Prevent manual toggling of chests if they are auto-unlocked
                e.preventDefault();
                return;
            }
            
            if (e.target.checked) {
                state.selectedItems.add(id);
            } else {
                state.selectedItems.delete(id);
            }
            
            // If it's a daily task, we need to recalculate chest thresholds for that day
            if (id.startsWith('d')) {
                const day = id.split('_')[0].replace('d', '');
                updateChestsForDay(day);
            }
            
            calculateTotals();
        });

        return item;
    }

    function renderDailyTasks() {
        for (let day = 1; day <= 7; day++) {
            const card = document.createElement('div');
            card.className = 'day-card';
            card.dataset.day = day.toString();
            
            // Show only Day 1 initially
            if (day !== 1) {
                card.style.display = 'none';
            }
            
            const header = document.createElement('div');
            header.className = 'day-header';
            header.innerHTML = `
                <h2>Day ${day}</h2>
                <span class="day-total" id="dayTotal_${day}">0 Drops</span>
            `;
            card.appendChild(header);

            const taskList = document.createElement('div');
            taskList.className = 'task-list';

            // Tasks
            const tasks = plannerData.daily_tasks[day] || [];
            tasks.forEach(t => {
                const item = createCheckboxItem(t.id, t.desc, t.drops, false);
                taskList.appendChild(item);
            });

            // Chests
            const chests = plannerData.daily_chests[day] || [];
            if (chests.length > 0) {
                const sep = document.createElement('div');
                sep.className = 'chest-separator';
                sep.textContent = 'Chests';
                taskList.appendChild(sep);

                chests.forEach((c, index) => {
                    const item = createCheckboxItem(c.id, `Chest ${index+1} (Needs ${c.req} tasks)`, c.drops, true);
                    item.dataset.req = c.req;
                    item.dataset.day = day;
                    taskList.appendChild(item);
                });
            }

            card.appendChild(taskList);
            daysGrid.appendChild(card);
            
            // Initial chest calculation
            updateChestsForDay(day);
        }
    }

    function renderMilestones() {
        // Define order
        const priorityOrder = ["Lion Skill Tasks", "Gold Tasks", "Adv Recruitment Tasks"];
        
        // Sort categories based on priority, then alphabetically
        const categories = Object.keys(plannerData.milestone_tasks).sort((a, b) => {
            const indexA = priorityOrder.indexOf(a);
            const indexB = priorityOrder.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        categories.forEach(category => {
            const tasks = plannerData.milestone_tasks[category];
            const card = document.createElement('div');
            card.className = 'category-card';
            
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `<h2>${category}</h2>`;
            card.appendChild(header);

            const taskList = document.createElement('div');
            taskList.className = 'task-list';

            // Check if this category should be selected by default
            const isDefaultSelected = (category === "Glory Badge Tasks" || category === "Resource Tasks");

            tasks.forEach(t => {
                const item = createCheckboxItem(t.id, t.desc, t.drops, false);
                const input = item.querySelector('input');
                
                if (isDefaultSelected) {
                    input.checked = true;
                    state.selectedItems.add(t.id);
                } else {
                    input.checked = false;
                    state.selectedItems.delete(t.id);
                }
                
                taskList.appendChild(item);
            });

            card.appendChild(taskList);
            milestonesGrid.appendChild(card);
        });
    }

    function updateChestsForDay(day) {
        // Count checked regular tasks (not passive) for this day
        let completedTasks = 0;
        const tasks = plannerData.daily_tasks[day] || [];
        tasks.forEach(t => {
            if (!t.is_passive && state.selectedItems.has(t.id)) {
                completedTasks++;
            }
        });

        // Update chests
        const chestItems = document.querySelectorAll(`.chest-item[data-day="${day}"]`);
        chestItems.forEach(item => {
            const req = parseInt(item.dataset.req);
            const input = item.querySelector('input');
            const id = item.dataset.id;
            
            if (completedTasks >= req) {
                input.checked = true;
                item.classList.add('auto-unlocked');
                state.selectedItems.add(id);
                // Prevent clicking
                input.onclick = (e) => e.preventDefault();
            } else {
                input.checked = false;
                item.classList.remove('auto-unlocked');
                state.selectedItems.delete(id);
                input.onclick = (e) => e.preventDefault();
            }
        });
        
        updateDayTotalDisplay(day);
    }
    
    function updateDayTotalDisplay(day) {
        let dayTotal = 0;
        
        const tasks = plannerData.daily_tasks[day] || [];
        tasks.forEach(t => {
            if (state.selectedItems.has(t.id)) dayTotal += t.drops;
        });
        
        const chests = plannerData.daily_chests[day] || [];
        chests.forEach(c => {
            if (state.selectedItems.has(c.id)) dayTotal += c.drops;
        });
        
        const totalEl = document.getElementById(`dayTotal_${day}`);
        if(totalEl) {
            totalEl.textContent = `${dayTotal} Drops`;
        }
    }

    function checkBuffVisibility() {
        if (state.goal >= 6600) {
            buffContainer.style.display = 'block';
        } else {
            buffContainer.style.display = 'none';
        }
    }

    function calculateTotals() {
        let totalTaskDrops = 0;
        
        // Sum all selected items in grids
        document.querySelectorAll('#daysGrid .task-item input:checked, #milestonesGrid .task-item input:checked').forEach(input => {
            const drops = parseInt(input.closest('.task-item').dataset.drops);
            totalTaskDrops += drops;
        });
        
        // Handle buff separately
        let buffDrops = 0;
        if (buffContainer.style.display === 'block' && buff5400.checked) {
            buffDrops = parseInt(buff5400.value);
        }

        const effectiveTotal = totalTaskDrops + buffDrops;
        const missing = Math.max(0, state.goal - effectiveTotal);
        const dailyMonster = Math.ceil(missing / 7);

        // Update UI
        totalTasksDropsEl.textContent = totalTaskDrops.toLocaleString();
        missingDropsEl.textContent = missing.toLocaleString();
        dailyMonsterDropsEl.textContent = dailyMonster.toLocaleString();

        // Progress Bar
        const percent = Math.min(100, (effectiveTotal / state.goal) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${effectiveTotal.toLocaleString()} / ${state.goal.toLocaleString()}`;
        
        if (percent >= 100) {
            progressBar.style.background = 'linear-gradient(90deg, #34d399, #10b981)';
            missingDropsEl.style.color = 'var(--success)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, var(--accent), #818cf8)';
            missingDropsEl.style.color = 'var(--warning)';
        }
    }
});
