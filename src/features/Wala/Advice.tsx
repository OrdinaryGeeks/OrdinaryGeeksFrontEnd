import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Advice(){

    
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState("");
    const [adviceSet, setAdviceSet] = useState(false);


    const reload =() => {

        setIsLoading(false);
        setAdviceSet(false);
    }
    const getAdvice=() => {

        setIsLoading(true);

        const headers  = {
            'api-key' : "redacted"
          }
          axios.post("https://transformationworkoutassistantopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-10-21",

            {
              "messages": [
                  {
                      "role": "system",
                      "content": "You are an AI assistant that creates a gives general advice "
                  },
                  {
                      "role": "user",
                      "content": "Give me advice "
                  }
              ]
            }, {headers : headers})
  .then((response) => {setIsLoading(false);setAdvice(response.data.choices[0].message.content); setAdviceSet(true);});

    }

    return(



        <div >
            
            

                  {isLoading && <CircularProgress/>
                    }
        {!isLoading && !adviceSet && <>
        <Button sx= {{m:2}} variant="contained" onClick={getAdvice}>Get Advice</Button>
        </>
        }
        {!isLoading && adviceSet && <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>}
        {advice}
        </div>
    
    )


}