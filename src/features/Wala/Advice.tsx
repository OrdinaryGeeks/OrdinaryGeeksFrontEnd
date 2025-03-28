import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Advice(){

    
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState("");
    const [adviceSet, setAdviceSet] = useState(false);
    const [adviceArray, setAdviceArray] = useState<Advice[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, errorSet] = useState(false);
    const showNextAdvice = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % advice.length); // Loop to the start
    };
  

    const showPreviousAdvice = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + advice.length) % advice.length); // Loop to the end
      };

    type Advice = {
        type: string; // The advice number (e.g., "Advice 1")
        text: string; // The actual advice content
      };

      useEffect(() => {
      if(adviceSet){
      const parseInput = (input: string): Advice[] => {
        const advices: Advice[] = [];
      
        // Split the input into lines, removing any blank lines
        const lines = input.split("\n").filter((line) => line.trim() !== "");
      
        for (const line of lines) {
          const match = line.match(/^Advice (\d+): (.+)$/); // Match the format "Advice <number>: <text>"
          if (match) {
            const type = `Advice ${match[1].trim()}`; // Extract the advice number
            const text = match[2].trim(); // Extract the advice text
            advices.push({ type, text });
          }
        }
      
        return advices;

    }

    let parsedInput = parseInput(advice);
    setAdviceArray(parseInput(advice));

    if(parsedInput.length == 0)
        {
         errorSet(true);
         
        }
}
      },[adviceSet, advice]

    )

    useEffect(() => {
        if(adviceArray.length > 0)
            errorSet(false);
    },[adviceArray]
);
    const reload =() => {

        setIsLoading(false);
        setAdviceSet(false);
        setCurrentIndex(0);
    }
/*     const backgroundStyle = {
        backgroundImage: `url('https://ordinarygeeks.com/images/Counseling.png')`, // Replace with your image URL
        backgroundSize: "cover", // Ensures the image covers the entire element
        backgroundPosition: "center", // Centers the image
        width: "100vw", // Full width of the viewport
        height: "100vh", // Full height of the viewport
      }; */
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
                      "content": "You are an AI assistant that  gives 5 pieces of advice to people who ask. The advice is separated by Advice and an index. "
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
            
            {error && <div>
                <Typography>The response was not in a format we could parse. Please try again</Typography>
                <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>
                </div>}
                

                  {isLoading && <CircularProgress/>
                    }
        {!isLoading && !adviceSet &&<>
        <Button sx= {{m:2}} variant="contained" onClick={getAdvice}>Get Advice</Button>
        </>
        }
        {!isLoading && adviceSet && <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload Button</Button>}
        
        {!isLoading && adviceSet && adviceArray  && adviceArray[currentIndex] &&
        <div>
        <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>{adviceArray[currentIndex].type}</h1>
      <p>{adviceArray[currentIndex].text}</p>
      <button onClick={showPreviousAdvice} disabled={currentIndex === 0} style={{ marginRight: "10px" }}>
        Previous
      </button>
      <button onClick={showNextAdvice} disabled={currentIndex === adviceArray.length - 1}>Next</button>
      </div>
    </div>

    }
        </div>
    
    )


}