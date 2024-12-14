document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    alert(result.ticketNumber ? `Registration Successful: ${result.ticketNumber}` : `Error: ${result.error}`);
});

// Handle view page buttons
async function handleButtonClick(action, value) {
    const endpointMap = {
        view_all: '/api/registrations',
        by_name: `/api/registrations/byname/${value}`,
        by_event: `/api/registrations/event/${value}`,
        delete_ticket: `/api/registrations/cancel/${value}`
    };

    try {
        const response = await fetch(endpointMap[action]);
        const data = await response.json();
        displayData(data); // This will now work
    } catch (err) {
        console.error('Error fetching data:', err);
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
    }
}


function displayData(data) {
    const outputDiv = document.getElementById('output'); // Ensure this matches the div ID in view.html
    outputDiv.innerHTML = ''; // Clear previous content

    if (!data || data.length === 0) {
        outputDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.border = '1';

    // Add table header
    const headerRow = document.createElement('tr');
    ['Ticket Number', 'Name', 'Email', 'Date', 'Event Name'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add table rows for each result
    data.forEach(registration => {
        const row = document.createElement('tr');
        ['ticketNumber', 'name', 'email', 'date', 'eventName'].forEach(key => {
            const td = document.createElement('td');
            td.textContent = registration[key];
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    outputDiv.appendChild(table);
}

