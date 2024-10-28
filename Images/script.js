const apiUrl = 'http://localhost:3000/instructors';  // Set API URL

async function fetchInstructors() {
  const response = await fetch(apiUrl);
  const instructors = await response.json();
  const instructorList = document.getElementById('instructor-list');
  instructorList.innerHTML = '';
  instructors.forEach(instr => {
    instructorList.innerHTML += `
      <li>
        ${instr.name} - ${instr.instrument}
        <button onclick="deleteInstructor(${instr.id})">Delete</button>
        <button onclick="editInstructor(${instr.id})">Edit</button>
      </li>
    `;
  });
}

async function addInstructor() {
  const name = document.getElementById('instructor-name').value;
  const instrument = document.getElementById('instrument-name').value;

  if (name && instrument) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, instrument }),
    });
    
    if (response.ok) {
      document.getElementById('instructor-name').value = '';
      document.getElementById('instrument-name').value = '';
      fetchInstructors();
    } else {
      alert("Failed to add instructor.");
    }
  } else {
    alert("Please enter both name and instrument.");
  }
}

async function deleteInstructor(id) {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  if (response.ok) {
    fetchInstructors();
  } else {
    alert("Failed to delete instructor.");
  }
}

async function editInstructor(id) {
  const name = prompt("Enter new name:");
  const instrument = prompt("Enter new instrument:");
  
  if (name && instrument) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, instrument }),
    });
    
    if (response.ok) {
      fetchInstructors();
    } else {
      alert("Failed to update instructor.");
    }
  } else {
    alert("Both fields are required for editing.");
  }
}

document.addEventListener('DOMContentLoaded', fetchInstructors);
