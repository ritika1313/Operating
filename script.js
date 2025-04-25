let memoryChart;

const socket = new WebSocket("ws://127.0.0.1:8000/ws/metrics");

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const cpuUsage = data.cpu_usage;
    const memoryUsage = data.memory_usage;
    const diskUsage = data.disk_usage || 0; // Use 0 or a default if disk is not provided

    // Update progress bars
    document.getElementById("cpuProgress").style.width = cpuUsage + "%";
    document.getElementById("memoryProgress").style.width = memoryUsage + "%";
    document.getElementById("diskProgress").style.width = diskUsage + "%";

    // Update text values
    document.getElementById("cpuUsage").innerText = cpuUsage + "%";
    document.getElementById("memoryUsage").innerText = memoryUsage + "%";
    document.getElementById("diskUsage").innerText = diskUsage + "%";

    // Update process list
    const processTable = document.getElementById("processBody");
    processTable.innerHTML = ""; // Clear old rows

    data.running_processes.forEach((proc, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${proc.name}</td>
            <td>${proc.pid}</td>
            <td>${proc.cpu_percent}%</td>
            <td><button class="kill-btn" onclick="killProcess(${proc.pid})">Kill</button></td>
        `;
        processTable.appendChild(row);
    });

    // Update memory chart
    updateMemoryChart(memoryUsage);
};

socket.onerror = function(error) {
    console.error("WebSocket error:", error);
};

// Optional: You may implement this on the backend too for actual process termination
function killProcess(pid) {
    alert(`Request sent to kill process with PID ${pid}`);
    // You might need to send this to the server if supported:
    // socket.send(JSON.stringify({ action: "kill", pid }));
}

function updateMemoryChart(memoryUsage) {
    if (!memoryChart) {
        const ctx = document.getElementById("memoryChart").getContext("2d");
        memoryChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Used Memory", "Free Memory"],
                datasets: [{
                    data: [memoryUsage, 100 - memoryUsage],
                    backgroundColor: ["limegreen", "#555"]
                }]
            }
        });
    } else {
        memoryChart.data.datasets[0].data = [memoryUsage, 100 - memoryUsage];
        memoryChart.update();
    }
}