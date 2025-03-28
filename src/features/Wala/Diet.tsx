import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Diet()
{

const [isLoading, setIsLoading] = useState(false);
const [dietSet, setDietSet]=useState(false);
const [dietString, setDietString] = useState("");
const [days2, setDays] = useState<{ day: string; breakfast: string; lunch: string; dinner: string}[]>([]);
const [error, setError] = useState(false);
useEffect(() => {
    if(dietSet)
    {
        function parseMeals(input: string): { day: string; breakfast: string; lunch: string; dinner: string }[] {
            const days: { day: string; breakfast: string; lunch: string; dinner: string }[] = [];
        
            const dayBlocks = input.split(/Day \d+/g).filter(block => block.trim() !== ""); // Split by "Day" keyword
            console.log(dayBlocks);
            dayBlocks.forEach((block, index) => {
              const [breakfast, lunch, dinner] = block.trim().split("\n").map(line => line.split(": ")[1]);
              console.log(breakfast, lunch, dinner);
              days.push({
                day: `Day ${index + 1}`,
                breakfast,
                lunch,
                dinner
              });
            });
        
            return days;
          }
        
        
        
          let whatsthis = parseMeals(dietString);
         
          setDays(whatsthis);

          if(whatsthis.length == 0)
            {
             setError(true);
            }
    }
}, [dietSet, dietString]);

useEffect(() => {
    if(days2.length > 0)
        setError(false);
}, [days2]);

/* const backgroundStyle = {
    backgroundImage: `url(${dietPic})`, // Replace with your image URL
   backgroundSize: "200px 200px", // Stretch image to fit the container
    backgroundPosition: "center", // Center the image
    backgroundRepeat: "no-repeat", // Prevent image repetition
    width: "100vw", // Full width of the viewport or container
    height: "200px", // Full height of the viewport or container
    
    
  }; */
const [currentDayIndex, setCurrentDayIndex] = useState(0); // Track the current day's index

const handleNext = () => {
  if (currentDayIndex < days2.length - 1) {
    setCurrentDayIndex(currentDayIndex + 1);
  }
};

const handlePrevious = () => {
  if (currentDayIndex > 0) {
    setCurrentDayIndex(currentDayIndex - 1);
  }
};

const currentDay = days2[currentDayIndex]; // Get the current day's data
const reload =() => {

    setIsLoading(false);
    setDietSet(false);
    setCurrentDayIndex(0);
}



 function createDiet2(dietType: string) {
    const headers  = {
 'api-key' : "redacted"
      }
    const params = new URLSearchParams();
params.append('diet', dietType);
    

setIsLoading(true);
  
  axios.post("https://transformationworkoutassistantopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-10-21",

    {
      "messages": [
          {
              "role": "system",
              "content": "You are an AI assistant that creates a 7 day breakfast/lunch/dinner meal plans according to a particular diet.  When you return the diet, return each day separated by the word Day and the day of the diet it is.  For each day, return the breakfast, lunch, and dinner separated by a -."
          },
          {
              "role": "user",
              "content": "Give me a meal plan for " + dietType
          }
      ]
    }, {headers : headers})
  .then((response) => {setIsLoading(false); setDietSet(true); setDietString(response.data.choices[0].message.content);})




}
    return(

     

        <div >
              {error && <div>
                <Typography>The response was not in a format we could parse. Please try again</Typography>
                <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>
                </div>}
        {isLoading && <CircularProgress/>
        }

        {!isLoading && !dietSet && <><div>
        <Button sx= {{m:2}} variant="contained" onClick={() =>createDiet2("Keto")}>Keto Diet</Button>
        
        <Button sx= {{m:2}} variant="contained" onClick={() => createDiet2("Vegan")}>Vegan Diet</Button>
        <Button sx= {{m:2}} variant="contained" onClick={() =>createDiet2("Atkins")}>Atkins Diet</Button>
        <Button sx= {{m:2}} variant="contained" onClick={() => createDiet2("Mediterranean")}>Mediterranean Diet</Button>

        
        </div>
        
        </>

        }
        {!isLoading && dietSet && 

<>
        <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Options</Button>

           
        </>
}
       
<div>{dietSet && currentDay 

&& <div>

<div>
<h2>{currentDay.day}</h2>
<div>
  <div><strong>Breakfast:</strong> {currentDay.breakfast}</div>
  <div><strong>Lunch:</strong> {currentDay.lunch}</div>
  <div><strong>Dinner:</strong> {currentDay.dinner}</div>
</div>
</div>
<div>
<button onClick={handlePrevious} disabled={currentDayIndex === 0}>
  Previous
</button>
<button onClick={handleNext} disabled={currentDayIndex === days2.length - 1}>
  Next
</button>
</div>
</div>
    
}

</div>
</div>)
}
