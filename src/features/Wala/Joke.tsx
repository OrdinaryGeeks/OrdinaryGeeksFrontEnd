import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Joke(){

    
    const [isLoading, setIsLoading] = useState(false);
    const [jokes, setJokes] = useState("");
    const [jokeSet, setJokeSet] = useState(false);
    const[jokeArray, setJokeArray] = useState<Joke[]>([]);
    const [error, errorSet] = useState(false);

    /* const backgroundStyle = {
      backgroundImage: `url('https://ordinarygeeks.com/images/Joke.png')`, // Replace with your image URL
      backgroundSize: "cover", // Ensures the image covers the entire element
      backgroundPosition: "center", // Centers the image
      width: "100vw", // Full width of the viewport
      height: "100vh", // Full height of the viewport
    }; */
    type Joke = {
      type: string;
      text: string;
    };
    useEffect(() => {



      if(jokeSet){
   
        const parseInput = (input: string): Joke[] => {
          const jokes: Joke[] = [];
          
          // Split the input into lines, removing any blank lines
          const lines = input.split("\n").filter((line) => line.trim() !== "");
        
          let currentType = ""; // To hold the current joke number/type
          let jokePunchLine : string[]=[];
          for (const line of lines) {
            if (line.includes("Joke ")) { // Detect joke type
              if(jokePunchLine.length > 0)
              {
                jokes.push({ type: currentType, text: jokePunchLine.join(" ") });
                jokePunchLine = [];
              }
              currentType = line.trim();
            } else if (currentType) { // Add text if it's a part of a joke
              if(line.length > 2)
              {
                jokePunchLine.push(line.trim());
              
              //currentType = ""; // Reset for next joke
              }
            }
          }

          if(jokePunchLine.length > 0)
            {
              jokes.push({ type: currentType, text: jokePunchLine.join(" ") });
              jokePunchLine = [];
            }
        
          return jokes;
        };
      let jArray = (parseInput(jokes));
      setJokeArray(jArray);
      if(jArray.length == 0)
      {
       errorSet(true);
      }
    }
    },[jokeSet, jokes])

    useEffect(() => {

      if(jokeArray.length > 0)
        errorSet(false);
    }, [jokeArray])


    const reload =() => {

        setIsLoading(false);
        setJokeSet(false);
        setCurrentIndex(0);
    }
    const getAJoke=() => {

      const headers  = {
        'api-key' : "redacted"
      }
        setIsLoading(true);
  axios.post("https://transformationworkoutassistantopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-10-21",

    {
      "messages": [
          {
              "role": "system",
              "content": "You are an AI assistant that tells people 5 jokes at a time.  The jokes are separated by joke number."
          },
          {
              "role": "user",
              "content": "Tell me some jokes?"
          }
      ]
  }, {headers : headers})
  .then((response) => {setIsLoading(false);setJokes(response.data.choices[0].message.content); setJokeSet(true);});

    }


    const [currentIndex, setCurrentIndex] = useState(0);

  const showNextJoke = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % jokes.length);
  };

  const showPreviousJoke = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + jokes.length) % jokes.length);
  };

 
    return(



        <div >
            
            {error && <div>
                <Typography>The response was not in a format we could parse. Please try again</Typography>
                <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>
                </div>}

                  {isLoading && <CircularProgress/>
                    }
        {!isLoading && !jokeSet && <>
        <Button sx= {{m:2}} variant="contained" onClick={getAJoke}>Get jokes</Button>
        </>
        }

        {!isLoading && jokeSet && jokeArray && jokeArray[currentIndex] && 
        <div>
        <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload button</Button>
           <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{jokeArray[currentIndex].type}</h1>
      <p>{jokeArray[currentIndex].text}</p>
      <button onClick={showPreviousJoke} disabled={currentIndex === 0} style={{ marginRight: "10px" }}>
        Previous
      </button>
      <button onClick={showNextJoke} disabled={currentIndex === jokeArray.length - 1}>Next</button>
    </div>
    </div>
}
        
        </div>
    
    )


}