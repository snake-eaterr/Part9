
interface massAndHeight {
  height: number;
  mass: number;
}

const parseArguments = (args: Array<string>): massAndHeight => {
  console.log('got called');
  if (args.length < 4) throw new Error('not enough arguments');
  if (args.length > 4) throw new Error('too many arguments');

  if(!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      mass: Number(args[3]) 
    };
  } else {
    throw new Error('Provded values were not numbers');
  }
};



export const calculateBmi = (height: number, mass: number): string => {
  if (height === 0 || height < 0 || mass < 0) throw new Error('height is zero or is less than zero. mass also cant be less than zero');
  const heightM: number = height / 100; // convert to meter
  const bmi: number = mass / (heightM * heightM);
  if (bmi < 18.5) {
    return 'Underweight (non-healthy weight)';
  }
  if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal (healthy weight)';
  }
  if (bmi >= 24.9 && bmi < 29.9) {
    return 'Overweight (non-healthy weight)';
  }
  return 'Obese (none-healthy weight)';

};

try {
  const { height, mass } = parseArguments(process.argv);
  console.log(calculateBmi(height, mass));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong';
  if(error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}