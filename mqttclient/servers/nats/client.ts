import { connect } from 'nats';

async function clientNats() {
  try {
    const nc = await connect({
      servers: 'localhost:4222',
    });

    console.log('Connected to NATS server');

    nc.closed().then(err => {
      if (err) {
        console.error('NATS connection closed with error:', err);
      } else {
        console.log('NATS connection closed');
      }
    });

    return nc;
  } catch (error) {
    console.error('Failed to connect to NATS:', error);
    throw error;
  }
}

export { clientNats };
