import expres from 'express';
import router from './routes/router';
import cors from 'cors';

const app = expres();
app.use(cors());
app.use(expres.json());

app.use('/api', router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
})