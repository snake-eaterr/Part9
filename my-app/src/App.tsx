
const Header = ({ courseName }: { courseName: string }) => {
  return (
    <h1>{courseName}</h1>
  );
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartWithDescription {
  type: "normal";
  
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartWithDescription {
  type: "special";
  requirements: string[];
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart } ) => {
  switch(part.type) {
    case 'normal': {
      return (
        <div>
          <h3> {part.name} {part.exerciseCount}</h3>
          <p> {part.description} </p>
        </div>
        
      );
    };
    case 'groupProject': {
      return (
        <div>
          <h3> {part.name} {part.exerciseCount} </h3>
          <p> Project Exercises {part.groupProjectCount} </p>
        </div>
      );
    };
    case 'submission': {
      return (
        <div>
          <h3> {part.name} {part.exerciseCount} </h3>
          <p> {part.description} </p>
          <p> {part.exerciseSubmissionLink} </p>
        </div>
      );
    };
    case 'special': {
      return (
        <div>
          <h3> {part.name} {part.exerciseCount} </h3>
          <p> {part.description} </p>
          <p>required skills: {part.requirements.map(requiement => <span> {requiement}, </span>)} </p>
        </div>
      )
    }
    default:
      return assertNever(part);
  }
}


const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map(part => {
        return (
          <Part part={part} />
        );
      })}
    </div>
  );
};

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <p>
    Number of exercises{" "}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);



const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the easy course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the hard course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;