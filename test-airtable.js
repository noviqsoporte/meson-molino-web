require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const tablaReservas = base(process.env.AIRTABLE_TABLE_RESERVAS);

async function test() {
  try {
    const fields = {
      Nombre_Cliente: 'Test',
      Telefono: '123',
      Fecha: '2026-03-30',
      Hora: '13:00',
      Personas: 50,
      Tipo: 'Evento',
      Estado: 'Planeada',
      Paquete: ['recXXXXXXXX'], // dummy record ID
      Precio_Estimado: '15000'
    };
    await tablaReservas.create(fields);
  } catch (error) {
    console.error("ERROR FROM AIRTABLE:")
    console.error(error.message);
  }
}
test();
