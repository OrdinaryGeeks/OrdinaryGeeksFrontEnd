import {Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Radio, RadioGroup, Select,  Typography} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

export default function WorkoutContext() {

    const [workoutFreq, setWorkoutFreq] = useState("1");
    const [workoutLevel, setWorkoutLevel] = useState("beginner");
    const [muscleChecked, setMuscleChecked] = useState(false);
    const [weightChecked, setWeightChecked] = useState(false);
    const [enduranceChecked, setEnduranceChecked] = useState(false)
    const [workout, setWorkout] = useState("");
    const [workoutSet, setWorkoutSet] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

    const reload =() => {

        setIsLoading(false);
        setWorkoutSet(false);
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
                      "content": "You are an AI assistant that creates a gives weekly workout plans "
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
        <>
        {isLoading && <CircularProgress/>}
        {!isLoading && !workoutSet &&
        <>
        <>
        <FormControl fullWidth>
      <Typography id="demo-simple-select-label">How often do you want to workout a week 3,4,5</Typography>
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
{workout}
        
        </>
    )
}