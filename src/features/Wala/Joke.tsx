import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Joke(){

    
    const [isLoading, setIsLoading] = useState(false);
    const [joke, setJoke] = useState("");
    const [jokeSet, setJokeSet] = useState(false);

    const reload =() => {

        setIsLoading(false);
        setJokeSet(false);
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
              "content": "You are an AI assistant that tells people jokes."
          },
          {
              "role": "user",
              "content": "Tell me a joke?"
          }
      ]
  }, {headers : headers})
  .then((response) => {setIsLoading(false);console.log(response);setJoke(response.data.choices[0].message.content); setJokeSet(true);console.log(response.data);});

    }

    return(



        <div >
            
            

                  {isLoading && <CircularProgress/>
                    }
        {!isLoading && !jokeSet && <>
        <Button sx= {{m:2}} variant="contained" onClick={getAJoke}>Get a joke</Button>
        </>
        }

        {!isLoading && jokeSet && 
        <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload button</Button>}
        {joke}
        </div>
    
    )


}