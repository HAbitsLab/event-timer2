let events = [];
let timer = null;
let currentTimerIndex = 0;


document.addEventListener('DOMContentLoaded', (event) => {
    function updateEventsList() {
        const eventsTableBody = document.getElementById('eventsUl');
        eventsTableBody.innerHTML = ''; 
    
        events.forEach(event => {
            const row = document.createElement('tr');
    
            const nameCell = document.createElement('td');
            nameCell.textContent = event.name;
            row.appendChild(nameCell); 
    
            const durationCell = document.createElement('td');
            durationCell.textContent = `${event.duration} seconds`;
            row.appendChild(durationCell); 

            eventsTableBody.appendChild(row);
        });
    }
    
    function updateStartButton() {
        document.getElementById('startTimer').disabled = events.length === 0;
    }

    function updateTimerDisplay(seconds, eventName = '') {
        const formatted = new Date(seconds * 1000).toISOString().substr(11, 8);
        document.getElementById('timer').textContent = formatted;
        document.getElementById('currentEventName').textContent = eventName || 'Waiting for next event...';
    }
    
    function startEventTimer() {
        if (currentTimerIndex >= events.length) {
            currentTimerIndex = 0; 
            return; 
        }
    
        const event = events[currentTimerIndex];
        if (!event.start) event.start = Date.now();

        const eventName = events[currentTimerIndex].name; 
        updateTimerDisplay(event.duration, eventName);
    
        timer = setInterval(() => {
            if (event.duration <= 0) {
                clearInterval(timer);
                event.end = Date.now();
                appendToTable(event);
                currentTimerIndex++; 
    
                if (currentTimerIndex < events.length) {
                    startEventTimer();
                } else {
                    currentTimerIndex = 0;
                }
            } else {
                event.duration--;
                const eventName = events[currentTimerIndex].name;
                updateTimerDisplay(event.duration, eventName);
            }
        }, 1000);
    }
    
    function appendToTable(event) {
        const tableBody = document.getElementById('eventTable').getElementsByTagName('tbody')[0];
        const row = tableBody.insertRow();
        const nameCell = row.insertCell(0);
        const startCell = row.insertCell(1);
        const endCell = row.insertCell(2);
        nameCell.textContent = event.name;
        startCell.textContent = new Date(event.start).toLocaleString();
        endCell.textContent = new Date(event.end).toLocaleString();
    }

    document.getElementById('addEvent').addEventListener('click', () => {
        console.log("hello, from event adder");
        const name = document.getElementById('eventName').value.trim();
        const duration = parseInt(document.getElementById('eventDuration').value.trim(), 10);
        if (name && duration > 0) {
            events.push({ name, duration, start: null, end: null });
            document.getElementById('eventName').value = '';
            document.getElementById('eventDuration').value = '';
            updateStartButton();
        }

        updateEventsList();

        const exportableEvents = events.map(({name, duration}) => ({name, duration}));
        document.getElementById('importJsonText').value = JSON.stringify(exportableEvents, null, 2);

        console.log('events', events);
    });

    document.getElementById('exportCsv').addEventListener('click', () => {
        console.log("events", events);
        
        const headers = "Name,Start,End\n";

        const csvRows = events.map(e => {
            const start = e.start ? e.start : ''; 
            const end = e.end ? e.end : ''; 
            return `${e.name},${start},${end}`;
        });
      
        const csvContent = headers + csvRows.join("\n");
      
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = 'events.csv';
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
    });

    document.getElementById('importJson').addEventListener('click', () => {
        const input = document.getElementById('importJsonText').value;
        try {
            const importedEvents = JSON.parse(input);
            if (Array.isArray(importedEvents)) {
                events = importedEvents;
                updateEventsList(); 
                updateStartButton(); 
            } else {
                alert('Invalid JSON: Expected an array of events.');
            }
        } catch (e) {
            alert('Invalid JSON format.');
        }
    });

    document.getElementById('startTimer').addEventListener('click', () => {        
        if (events.length > 0) {
            startEventTimer();
        }
    });

    updateStartButton();
});