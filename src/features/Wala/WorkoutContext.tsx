import {Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Radio, RadioGroup, Select,  Typography} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function WorkoutContext() {

    const [workoutFreq, setWorkoutFreq] = useState("1");
    const [workoutLevel, setWorkoutLevel] = useState("beginner");
    const [muscleChecked, setMuscleChecked] = useState(false);
    const [weightChecked, setWeightChecked] = useState(false);
    const [enduranceChecked, setEnduranceChecked] = useState(false)
    const [workout, setWorkout] = useState("");
    const [workoutSet, setWorkoutSet] = useState(false);
    const [error, errorSet] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [days, setDays] = useState<{ day: string; workoutType: string; exercises: string[] }[]>([]);
    const [intro, setIntro] = useState("");

    /* const backgroundStyle = {
        backgroundImage: `url('https://ordinarygeeks.com/images/Workout.png')`, // Replace with your image URL
        backgroundSize: "cover", // Ensures the image covers the entire element
        backgroundPosition: "center", // Centers the image
        width: "100vw", // Full width of the viewport
        height: "100vh", // Full height of the viewport
      }; */
    useEffect (() => {

        if(workoutSet) {

        function parseWorkoutPlan(input: string): { day: string; workoutType: string; exercises: string[] }[] {
            const workoutPlan: { day: string; workoutType: string; exercises: string[] }[] = [];
            
            const dayBlocks = input.split(/Day \d+:/g).filter(block => block.trim() !== ""); // Split by "Day" keyword
            dayBlocks.forEach((block, index) => {
                if(index == 0)
                {
                    setIntro(block);
                }
                if(index  > 0)
                {
              const lines = block.trim().split("\n");
              const workoutType = lines[0].trim(); // First line is the workout type
              const exercises = lines.slice(1).map(line => line.trim()); // Remaining lines are exercises
              
              workoutPlan.push({
                day: `Day ${index }`,
                workoutType,
                exercises,
              });
            }
            });
          
            return workoutPlan;
          }
          
          // Call the function and store workout plan
          const workoutPlan = parseWorkoutPlan(workout);


          
          setDays(workoutPlan);

          if(workoutPlan.length == 0)
            {
             
                errorSet(true);
            }
        }
    }, [workoutSet, workout])

    useEffect(() => {
    if(days.length > 0)
        errorSet(false);
},[days])


    const [currentDayIndex, setCurrentDayIndex] = useState(0); // Track the current day's index

    const handleNext = () => {
      if (currentDayIndex < days.length - 1) {
        setCurrentDayIndex(currentDayIndex + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentDayIndex > 0) {
        setCurrentDayIndex(currentDayIndex - 1);
      }
    };
  
    const currentDay = days[currentDayIndex]; // Get the current day's data
    const reload =() => {

        setIsLoading(false);
        setWorkoutSet(false);
        setCurrentDayIndex(0);
        setIntro("");
    }
    const handleWeight = (event: any) => {
        setWeightChecked(event.target.checked);
    }
    const handleEndurance = (event:any) => {
        setEnduranceChecked(event.target.checked);
    }
    const handleMuscle = (event:any) => {
        setMuscleChecked (event.target.checked);
    }

    let params = "";

    const handleLevelChange = (event:any) => {
        setWorkoutLevel(event.target.value);
      };

    const handleChange = (event: any) => {
       // alert(event.target.value);
        setWorkoutFreq(event.target.value as string);
      };

    let paramsAdd = (paramAndValue:string) => {

        if(params!= "")
            params+="&" + paramAndValue;
        else
            params+="?" + paramAndValue;
    }
      const workoutFromContext = () => {

        console.log(muscleChecked, weightChecked, enduranceChecked, workoutFreq, workoutLevel);

       setIsLoading(true);
        if(muscleChecked)
            paramsAdd("muscle=true");
        if(weightChecked)
            paramsAdd("weight=true");
        if(enduranceChecked)
            paramsAdd("endurance=true");
        paramsAdd("freq="+workoutFreq);
        paramsAdd("level="+workoutLevel);

        let goals = "";

        if(muscleChecked && enduranceChecked && weightChecked)
            goals = "Goals are to gain muscle, endurance, and lose weight";
        else if(muscleChecked && enduranceChecked)
            goals = "Goals are to gain muscle and endurance";
        else if(muscleChecked && weightChecked)
            goals = "Goals are to gain muscle and lose weight";
        else if (weightChecked && enduranceChecked)
            goals= "Goals are to lose weight and gain endurance";
        else if(weightChecked)
            goals = "Goals are to lose weight";
        else if(muscleChecked)
            goals = "Goals are to gain muscle";
        else if(enduranceChecked)
            goals = "Goals are to gain endurance";

        let frequencyString = " by working out " + workoutFreq + " days a week ";

        let levelString = "";

        if(workoutLevel == "Beginner")
            levelString = " at a level suitable for a beginner";
        if(workoutLevel == "Intermediate")
            levelString= " at an intermediate level";
        if(workoutLevel == "Advanced")
            levelString = " at an advanced level";
        if(workoutLevel == "Elite")
            levelString = " at an elite level";

        
        const headers  = {
            'api-key' : "redacted"
          }
          axios.post("https://transformationworkoutassistantopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-10-21",

            {
              "messages": [
                  {
                      "role": "system",
                      "content": "You are an AI assistant that creates a gives weekly workout plans. Break each day's workout down with the name of the exercise, followed by the word Sets and a -, then the number of sets, followed by the word Reps and a -, then the reps.  If the reps have a weight associated with them, precede the weight with the word Weight followed by a -.  "
                  },
                  {
                      "role": "user",
                      "content": goals + frequencyString + levelString
                  }
              ]
            }, {headers : headers})
     
      .then((response) => {setIsLoading(false);console.log(response.data.choices[0].message.content);setWorkout(response.data.choices[0].message.content);setWorkoutSet(true);  }).then(() => console.log(workout));

      }

      
    return(
        <div >

{error && <div>
                <Typography>The response was not in a format we could parse. Please try again</Typography>
                <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>
                </div>}
        {isLoading && <CircularProgress/>}
        {!isLoading && !workoutSet &&
        <>
        <>
        <FormControl fullWidth>
      <Typography id="demo-simple-select-label">How often do you want to workout a week?</Typography>
        <Select
           labelId="select-workout-frequency"
           id="select-workout-frequency"
           value={workoutFreq}
           label="Workout Frequency"
           
           onChange={handleChange}>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="6">6</MenuItem>
        </Select>
        </FormControl>
        <div>What are your workout goals</div>

        <FormGroup  >
        <FormControlLabel  control={<Checkbox checked={weightChecked} onChange={handleWeight}/>} label="Weight Loss" />
        <FormControlLabel  control={<Checkbox checked={muscleChecked} onChange={handleMuscle}/>} label="Muscle Gain" />
        <FormControlLabel  control={<Checkbox checked={enduranceChecked} onChange={handleEndurance}/>} label="Endurance" />
        </FormGroup>

        <FormControl component="fieldset">
        <FormLabel component="legend">What is your current fitness level</FormLabel>  
<RadioGroup
aria-labelledby="fitness-level"
defaultValue="beginner"
value={workoutLevel}
        onChange={handleLevelChange}
name="fitness-level">
<FormControlLabel value="beginner" control={<Radio/>} label="Beginner" />
<FormControlLabel value="intermediate" control={<Radio/>} label="Intermediate" />
<FormControlLabel value="advanced" control={<Radio/>} label="Advanced" />
<FormControlLabel value="elite" control={<Radio/>} label="Elite" />
</RadioGroup>
</FormControl>
</>



      
        
<Button sx= {{m:2}} variant="contained" onClick={workoutFromContext}>create workout</Button>      
     </>   
        
}

{workoutSet && !isLoading && <Button sx= {{m:2}} variant="contained" onClick={reload}>Clear Workout</Button>}
{!isLoading && workoutSet}


{workoutSet && currentDay &&
<div>
    {intro && <div>{intro}</div>
    }
        <h2>{currentDay.day}: {currentDay.workoutType}</h2>
        <div>
          {currentDay.exercises.map((exercise, index) => (
            <div key={index}>{exercise}</div>
          ))}
        </div>
      
      <div>
        <button onClick={handlePrevious} disabled={currentDayIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext}  disabled={currentDayIndex === days.length - 1} >
          Next
        </button>
      </div>
      </div>
}

      
        </div>
    )
}