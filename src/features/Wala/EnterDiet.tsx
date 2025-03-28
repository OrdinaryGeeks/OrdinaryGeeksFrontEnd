import { AudioRecorder } from 'react-audio-voice-recorder';

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {  Box, Typography } from "@mui/material";

import {  useState } from 'react';
import axios from 'axios';


export default function EnterDiet(){

    const API_KEY = "redacted";

    const apiKey = "redacted";
    ;

   
    const region = "redacted";
    const[speech, setSpeech] = useState("");
    const[speechSet, setSpeechSet] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
   
    const [calories, setCalories] = useState("");
    const [caloriesSet, setCaloriesSet] = useState(false);

    const updateWav = (event :any) => {
     
     setSelectedFile(event.target.files[0]);

      
    };

    const sendToRecognize = () => {

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
    .then((response) => {console.log(response);setCalories(response.data.choices[0].message.content); setCaloriesSet(true);console.log(response.data);});
  
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
            
            recognizer.close();
          });
        }
    
    
      return (
        <div >

<Typography>
  Click the Microphone to record a file that will be saved as audio(index) if you hit the disk icon while recording.  Use the choose file button to choose an audio.  Only speak the food item you are adding and the amount in succession like, 3 cups of plain rice, 1 pound of sweet potato, and 1 canned coke.
</Typography>
          {!speechSet && 
          
    <Box sx={{width:1, justifyContent:"center", alignItems: "center",
      flexDirection:"row", display: 'flex'}}>
             <AudioRecorder 
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }} 
      downloadOnSavePress={true}
      downloadFileExtension="wav"
    />



<input onChange={updateWav} type="file" id="avatar" name="avatar" accept=".wav" />
<button onClick={sendToRecognize}>Audio To Text</button>
</Box>
   
}
   

{speechSet && <div>
  
  {speech}
  <button onClick={getCaloriesForFood}>Get Calories</button>
  </div>}
  
    {!caloriesSet ? (

<div> no calories set </div>

        )
        :
        (
            <div>
            {calories}
            </div>
        )

    }
        </div>
      );
    };
    



