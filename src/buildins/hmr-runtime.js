var ws = new WebSocket('ws://localhost:{{HMR_PORT}}/');
  ws.onmessage = (e) => {
    if(e.data==='reload'){
        window.location.reload();
    }
  };