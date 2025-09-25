import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Import and use the health data routes
import healthDataRoutes from './controllers/healthDataController';
app.use('/health', healthDataRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

