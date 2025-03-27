async function fetchProcesses() {
    try {
        const response = await fetch('../backend/processes.json'); // Adjust path if needed
        if (!response.ok) throw new Error("Failed to fetch data");

        const processes = await response.json();
        const tableBody = document.getElementById("processTable");
        tableBody.innerHTML = "";

        processes.forEach(process => {
            const row = `<tr>
                <td>${process["Image Name"]}</td>
                <td>${process["PID"]}</td>
                <td>${process["Mem Usage"]}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching process data:", error);
    }
}

// Auto-refresh data every 5 seconds
setInterval(fetchProcesses, 5000);


