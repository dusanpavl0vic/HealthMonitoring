import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import swaggerUi from "swagger-ui-express";
import healthDataRoutes from './controllers/healthDataController';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;


const swaggerDocument = require("../openapi.json");
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use('/health', healthDataRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

