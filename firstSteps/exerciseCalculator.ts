export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Arguments {
  target: number;
  daysArray: Array<number>;

}

export const parseArguments2 = (args: Array<string>): Arguments => {
  if (args.length < 3) throw new Error('not enough arguments');

  const slicedArgs = [...args.slice(2)]; // we slice the arguments from process.arg and spread into an array so its not a reference
  
  // make sure all are numbers
  slicedArgs.forEach(arg => {
    if (isNaN(Number(arg))) throw new Error('some of the arguemnts arent numbers');
  });

  const daysArray: Array<number> = slicedArgs.slice(1).map(day => Number(day));

  return {
    target: Number(slicedArgs[0]),
    daysArray
  };
};

export const calculateExercises = (periods: Array<number>, target: number): Result => {

  const total: number = periods.reduce((total, next) => total + next);
  const average: number = total / periods.length;

  const trainingDays: number = periods.filter(period => period !== 0).length;
  const success: boolean = average >= target;
  const metRate: number = (average / target) * 100;
  let rating = 1;
  if (metRate >= 100) {
    rating = 3;
  } else if (metRate >= 50 && metRate < 1000) {
    rating = 2;
  } else if(metRate < 50) {
    rating = 1;
  }
  
  const description = (calculatedRating: number): string => {
    switch(calculatedRating) {
      case 1:
        return 'you should get serious';
      case 2:
        return 'not too bad but could be better';
      case 3:
        return 'You\'re doing great. Keep it up';
    }
    return 'fix';
  };

  return {
    periodLength: periods.length,
    trainingDays,
    success,
    rating,
    target,
    average,
    ratingDescription: description(rating)
  };
  
  
};





  try {
    const { target, daysArray } = parseArguments2(process.argv);
    console.log(calculateExercises(daysArray, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if(error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }