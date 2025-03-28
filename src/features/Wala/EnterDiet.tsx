import { AudioRecorder } from 'react-audio-voice-recorder';
import { Button, CircularProgress, Input } from "@mui/material";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {  Box, Typography } from "@mui/material";

import {  useState } from 'react';
import axios from 'axios';


export default function EnterDiet(){

    const API_KEY = "redacted"; //API Key to Azure AI Services

    const apiKey ="redacted"; //API Key to Azure AI Speech
    ;

    const [isLoading, setIsLoading] = useState(false);
    const region = "eastus2";
    const [showTutorial, setShowTutorial] = useState(false);
    const[speech, setSpeech] = useState("");
    const[speechSet, setSpeechSet] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
   
    const [calories, setCalories] = useState("");
    const [caloriesSet, setCaloriesSet] = useState(false);
    //const [error, errorSet] = useState(false);

    const updateWav = (event :any) => {
     
     setSelectedFile(event.target.files[0]);

      
    };

    const reload =() => {

      setIsLoading(false);
      setSpeechSet(false);
      setCaloriesSet(false);
  }
  

    const sendToRecognize = () => {

      setIsLoading(true);

      recognizeFromMic(selectedFile);
    }
    
/*     const backgroundStyle = {
      backgroundImage: `url('https://ordinarygeeks.com/images/Diet.png')`, // Replace with your image URL
      backgroundSize: "cover", // Ensures the image covers the entire element
      backgroundPosition: "center", // Centers the image
      width: "100vw", // Full width of the viewport
      height: "100vh", // Full height of the viewport
    }; */
    const getCaloriesForFood=() => {

      setIsLoading(true);
        const headers  = {
          'api-key' : apiKey
        }
          
    axios.post("https://transformationworkoutassistantopenai.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-10-21",
        {
        "messages": [
            {
                "role": "system",
                "content": "You are an AI assistant that tells people the amount of calories in their meal.  Return a list of items consumed followed by their calories each on a separate line followed by the total calories."
            },
            {
                "role": "user",
                "content": "My diet consisted of " + speech
            } ]
    }, {headers : headers})
    .then((response) => {setIsLoading(false);console.log(response);setCalories(response.data.choices[0].message.content); setCaloriesSet(true);console.log(response.data);});
  
      }
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      API_KEY,
      region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

       const addAudioElement = (blob :any) => {
        const url = URL.createObjectURL(blob);
        const wala = document.createElement("audio");
        wala.src = url;
        wala.controls = true;
      }; 


     
      const recognizeFromMic= (file : any) => {
        /** Writing WAV Headers into the buffer received. */
       

       
         
          /** On finish, read the WAV stream using configuration the SDK provides. */
          let audioConfig = sdk.AudioConfig.fromWavFileInput(file);
          let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
          recognizer.recognizeOnceAsync((result) => {
            console.log(result);
            setSpeech(result.text);
            setSpeechSet(true);
            setIsLoading(false);
            recognizer.close();
          });
        }
    
    
      return (
        <div >


{isLoading && <CircularProgress/>
        }

{!isLoading && <div>
{showTutorial ? 
<div>
<Typography>
  The audio context for this prompt is a short list of what you ate at the meal like 3 lbs of baked Salmon, 1 cup of sliced peaches in heavy syrup, 3 oz peanuts salted.  If you have a wav file you can hit the choose file button to choose it. If not, you can record one from the website then choose it.  When you hit the "Audio to text" button after loading a wav file the speech API will parse the audio. Once that text shows up hit the get calories button to get a caloric estimate.
</Typography>


<Button onClick={()=>{setShowTutorial(!showTutorial)}}>Hide Tutorial</Button>
</div> :
<Button onClick={()=>{setShowTutorial(!showTutorial)}}>Show Tutorial</Button>
}

          {!speechSet && 
          
    <Box sx={{width:1, justifyContent:"center", alignItems: "center",
      flexDirection:"column", display: 'flex'}}>
             <AudioRecorder 
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }} 
      downloadOnSavePress={true}
      downloadFileExtension="wav"
    />



<Input onChange={updateWav} type="file" id="avatar" name="avatar" inputProps={{ accept:".wav"}} />
<Button onClick={sendToRecognize} disabled={!selectedFile}>Audio To Text</Button>
</Box>
   
}
   

{speechSet && <div>
  
  {speech}
  <Button onClick={getCaloriesForFood}>Get Calories</Button>
  </div>}
  
    {caloriesSet &&
      
            <div>
            {calories}
            </div>
        

    }

      {!isLoading && speechSet && 
    
    <>
            <Button sx= {{m:2}} variant="contained" onClick={reload}>Reload</Button>
    
               
            </>
    }
    </div>
}
        </div>

        
      );
    };
    



