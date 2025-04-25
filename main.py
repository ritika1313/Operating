from fastapi import FastAPI, WebSocket
import psutil
import asyncio

app = FastAPI()

async def send_metrics(websocket: WebSocket):
    await websocket.accept()
    while True:
        metrics = {
            "cpu_usage": psutil.cpu_percent(interval=1),
            "memory_usage": psutil.virtual_memory().percent,
            "running_processes": [
                proc.info for proc in psutil.process_iter(['pid', 'name', 'cpu_percent'])
            ]
        }
        await websocket.send_json(metrics)
        await asyncio.sleep(1) 

@app.websocket("/ws/metrics")
async def metrics_websocket(websocket: WebSocket):
    await send_metrics(websocket)