import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();


app.use(express.json());



app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  if('height' in req.query && 'weight' in req.query) {
    if(!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
      const bmi: string = calculateBmi(Number(req.query.height), Number(req.query.weight));
      return res.json({
        height: req.query.height,
        weight: req.query.weight,
        bmi
      });
    }
  }
  return res.json({
    error: 'malformatted input'
  });
  
}); 

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dailyExercises = req.body.daily_exercises;
  console.log(typeof dailyExercises);
  const target = req.body.target;
  if (!dailyExercises || !target) {
    return res.sendStatus(400).json({ error: "parameters missing" });
  }
  if (isNaN(Number(target)) && dailyExercises.some(isNaN)) {
    return res.sendStatus(400).json({ error: "malformatted parameters" });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return res.json(calculateExercises(dailyExercises, target));
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`server running s on port ${PORT}`);
});