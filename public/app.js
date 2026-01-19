// =====================================================
// TASK PLANNER - FRONTEND JAVASCRIPT
// Handles form submission, API calls, and updating UI
// =====================================================

// Wait for page to fully load before running code
document.addEventListener('DOMContentLoaded', function() {
  // Load tasks when page loads
  loadTasks();
  loadStats();
  
  // Add event listener to task form
  document.getElementById('taskForm').addEventListener('submit', addTask);
  
  // Add event listeners to filter inputs
  document.getElementById('searchInput').addEventListener('input', loadTasks);
  document.getElementById('categoryFilter').addEventListener('change', loadTasks);
  document.getElementById('priorityFilter').addEventListener('change', loadTasks);
});

// =========== FUNCTION: LOAD TASKS ===========
async function loadTasks() {
  try {
    // Show loading message
    document.getElementById('taskList').innerHTML = '<p class="text-muted">Loading tasks...</p>';
    
    // Get filter values from inputs
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const priority = document.getElementById('priorityFilter').value;
    
    // Build query string for filters
    let query = '';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (category) query += `category=${category}&`;
    if (priority) query += `priority=${priority}&`;
    
    // Fetch tasks from backend API
    const response = await fetch(`/api/tasks?${query}`);
    const tasks = await response.json();
    
    // Display tasks in the UI
    displayTasks(tasks);
    
    // Update stats after loading tasks
    loadStats();
    
  } catch (error) {
    console.error('Error loading tasks:', error);
    document.getElementById('taskList').innerHTML = 
      '<p class="text-danger">Error loading tasks. Please try again.</p>';
  }
}

// =========== FUNCTION: DISPLAY TASKS ===========
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  
  // If no tasks, show message
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="text-muted">No tasks found. Add your first task!</p>';
    return;
  }
  
  // Clear task list
  taskList.innerHTML = '';
  
  // Loop through each task and create HTML
  tasks.forEach(task => {
    // Determine priority class for styling
    let priorityClass = 'low-priority';
    if (task.priority >= 4) priorityClass = 'high-priority';
    else if (task.priority >= 2) priorityClass = 'medium-priority';
    
    // Format date nicely if it exists
    let deadlineText = 'No deadline';
    if (task.deadline) {
      deadlineText = new Date(task.deadline).toLocaleDateString();
    }
    
    // Create task card HTML
    const taskHTML = `
      <div class="task-card ${priorityClass}">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">${task.title || 'Untitled Task'}</h6>
            <p class="mb-1 text-muted">${task.description || 'No description'}</p>
            <small class="text-muted">
              Category: ${task.category || 'None'} | 
              Priority: ${task.priority || '1'} | 
              Project: ${task.project || 'None'} | 
              Deadline: ${deadlineText}
            </small>
          </div>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task._id}')">
              Edit
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add task to the list
    taskList.innerHTML += taskHTML;
  });
}

// =========== FUNCTION: ADD NEW TASK ===========
async function addTask(event) {
  // Prevent page refresh on form submit
  event.preventDefault();
  
  try {
    // Get values from form inputs
    const title = document.getElementById('title').value.trim();
    
    // Validate that title is not empty
    if (!title) {
      alert(' Please enter a task title');
      return;
    }
    
    const newTask = {
      title: title,
      priority: parseInt(document.getElementById('priority').value),
      category: document.getElementById('category').value.trim(),
      deadline: document.getElementById('deadline').value || null,
      project: document.getElementById('project').value.trim(),
      description: document.getElementById('description').value.trim()
    };
    
    console.log('Sending task data:', newTask); // Debug log
    
    // Send POST request to backend API
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    });
    
    console.log('Response status:', response.status); // Debug log
    
    // Check if request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add task: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Task created:', result); // Debug log
    
    // Clear form after successful submission
    document.getElementById('taskForm').reset();
    
    // Show success message (simple alert for now)
    alert('✅ Task added successfully!');
    
    // Reload tasks to show new task
    loadTasks();
    
  } catch (error) {
    console.error('Error adding task:', error);
    alert(` Error adding task: ${error.message}`);
  }
}

// =========== FUNCTION: EDIT TASK ===========
async function editTask(taskId) {
  // Find the task data from current tasks
  const tasks = await loadTasksForEdit();
  const task = tasks.find(t => t._id === taskId);
  
  if (!task) {
    alert('Task not found');
    return;
  }
  
  // Populate form with task data
  document.getElementById('title').value = task.title || '';
  document.getElementById('description').value = task.description || '';
  document.getElementById('priority').value = task.priority || 2;
  document.getElementById('category').value = task.category || '';
  document.getElementById('project').value = task.project || '';
  document.getElementById('deadline').value = task.deadline ? task.deadline.split('T')[0] : '';
  
  // Change form submit behavior to update
  const form = document.getElementById('taskForm');
  form.removeEventListener('submit', addTask);
  form.addEventListener('submit', (e) => updateTask(e, taskId));
  
  // Change button text
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Update Task';
  submitBtn.className = 'btn btn-warning';
  
  // Add cancel button
  if (!document.getElementById('cancelBtn')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancelBtn';
    cancelBtn.className = 'btn btn-secondary ms-2';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = resetForm;
    submitBtn.parentElement.appendChild(cancelBtn);
  }
}

// =========== FUNCTION: UPDATE TASK ===========
async function updateTask(event, taskId) {
  event.preventDefault();
  
  try {
    const updatedTask = {
      title: document.getElementById('title').value.trim(),
      priority: parseInt(document.getElementById('priority').value),
      category: document.getElementById('category').value.trim(),
      deadline: document.getElementById('deadline').value || null,
      project: document.getElementById('project').value.trim(),
      description: document.getElementById('description').value.trim()
    };
    
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    alert('✅ Task updated successfully!');
    resetForm();
    loadTasks();
    
  } catch (error) {
    console.error('Error updating task:', error);
    alert(' Error updating task. Please try again.');
  }
}

// =========== FUNCTION: RESET FORM ===========
function resetForm() {
  document.getElementById('taskForm').reset();
  const form = document.getElementById('taskForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Reset form submit behavior
  form.removeEventListener('submit', updateTask);
  form.addEventListener('submit', addTask);
  
  // Reset button
  submitBtn.textContent = 'Add Task';
  submitBtn.className = 'btn btn-primary';
  
  // Remove cancel button
  if (cancelBtn) {
    cancelBtn.remove();
  }
}

// =========== FUNCTION: LOAD TASKS FOR EDIT ===========
async function loadTasksForEdit() {
  try {
    const response = await fetch('/api/tasks');
    return await response.json();
  } catch (error) {
    console.error('Error loading tasks for edit:', error);
    return [];
  }
}
async function deleteTask(taskId) {
  // Ask for confirmation before deleting
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    // Send DELETE request to backend
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    // Check if deletion was successful
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    
    // Show success message
    alert('🗑️ Task deleted!');
    
    // Reload tasks to update the list
    loadTasks();
    
  } catch (error) {
    console.error('Error deleting task:', error);
    alert(' Error deleting task. Please try again.');
  }
}

// =========== FUNCTION: LOAD STATISTICS ===========
async function loadStats() {
  try {
    // Fetch statistics from backend
    const response = await fetch('/api/stats');
    const stats = await response.json();
    
    // Update statistics cards
    document.getElementById('totalTasks').textContent = stats.totalTasks;
    document.getElementById('avgPriority').textContent = stats.avgPriority;
    document.getElementById('highPriorityCount').textContent = stats.highPriorityCount;
    
    // Update category statistics
    let categoryHTML = '';
    for (const [category, count] of Object.entries(stats.categoryStats)) {
      categoryHTML += `
        <div class="mb-2">
          <strong>${category}:</strong> ${count} tasks
          <div class="progress" style="height: 10px;">
            <div class="progress-bar" style="width: ${(count / stats.totalTasks) * 100}%"></div>
          </div>
        </div>
      `;
    }
    
    document.getElementById('categoryStats').innerHTML = categoryHTML || 'No categories yet';
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}