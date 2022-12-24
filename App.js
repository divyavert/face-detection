import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from "react-webcam";
import { drawRect } from "./utils";

import "./App.css";
function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [Dat,setData] = useState([]);

  const runcoco = async ()=>{
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);

  }
  const detect = async (net) =>{
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null && webcamRef.current.video.readyState === 4
    ){
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    const obj = await net.detect(video);
   
      setData(obj);
      const ctx = canvasRef.current.getContext("2d")
      drawRect(obj,ctx)
    }

}
 console.log(Dat);
useEffect(()=>{runcoco()},[]);

return (
  <div className="App">
 <h1> object detection using tensorflow  </h1>
    <header className="App-header">
   
      <Webcam
        ref={webcamRef}
        muted={true} 
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: 640,
          height: 480,
        }}
      />
    </header>

 
  {
    Dat.forEach(prediction=>{
      <p>{prediction['class']}</p>
    })
  }

  </div>
)}



export default App;
