const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/reservas',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', d => { data += d; });
  res.on('end', () => { console.log('Response:', data); });
});

req.on('error', e => {
  console.error('Request failed:', e.message);
});

req.write(JSON.stringify({
  nombre_cliente: 'Test Error',
  telefono: '1234567890',
  fecha: '2026-03-30',
  tipo: 'Evento',
  paquete_id: 'rec12345678', // Un id falso provocara un error en submittion si la columna si existe pero el id no. Pero aqui el error reportado era Unknown field.
  estado: 'Planeada',
  personas: 50,
  precio_estimado: '15000' // record the request format
}));
req.end();
