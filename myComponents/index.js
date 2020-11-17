
import './lib/webaudio-controls.js';

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

const template = document.createElement("template");
template.innerHTML = `
  <style>

  table, th, td {
    border: 1px solid black;
  }

  #reload{
    cursor: pointer;

  }

  #playPause{
    cursor: pointer;
    margin-right:20%;
    

  }

  #command{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  
    

  }

  #knobVolume1{
     padding-right: 33%;
  }

  .sw1div .tooltiptext{
   
    visibility: hidden;
  

    color: #fff;
    text-align: center;
    border-radius: 6px;
 
  
    /* Position the tooltip */
  
    z-index: 1;
 }

 .sw1div:hover .tooltiptext {
  visibility: visible;
}

 #reload1{
  padding-left: 39%;
}

.reloadimg .reloadimgtext{
   
  visibility: hidden;


  color: #fff;
  text-align: center;
  border-radius: 6px;


  /* Position the tooltip */

  z-index: 1;
}

.reloadimg:hover .reloadimgtext {
visibility: visible;
}
 

#table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#table td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#table tr{background-color: #f2f2f2;}

#table tr:hover {background-color: #ddd;}

#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: gray;
  color: white;
}


    .lecteur {
      
      margin-right:10%;
      float: right;
         width:40%;
           
    }

    #prop {

      margin-top:3%;
      
       width:33%;
       
        
 }
  </style>
  
 
    <br>
<div class="lecteur">
<video class="videoClass" id="myPlayerVid" width="720" height="480"  controls>
  <source src="myComponents/assets/videos/vid01.mp4" type="video/mp4">
  <source src="myComponents/assets/videos/vid01.mp4" type="video/ogg">
  Your browser does not support the video tag.
</video>

<br> <br>


 

    <webaudio-slider id="slider" src="./assets/imgs/hsliderbody.png"  tracking="abs"
    value="0" min="0" max="24" width="720" height="40"> 
  </webaudio-slider>
  <webaudio-param id="sliderParam" link="slider" ></webaudio-param>

  <br>

  <div id="command">

  <webaudio-knob id="knobVolume" tooltip="Volume:%s" src="./assets/imgs/LittlePhatty.png" sprites="100" value=1 min="0" max="1" step=0.01>
  Volume</webaudio-knob>

  <div class="sw1div">
  <webaudio-switch id="sw1"  midilearn="1"  src="./assets/imgs/switch_toggle.png" value="0" height="56" width="56" ></webaudio-switch>
  <span class="tooltiptext">Loop</span>
  </div>

 
  <img id="playPause" height="70" width="70"  src="./assets/imgs/play.png"> 


  <div class="reloadimg">
  <img id="reload" height="70" width="70"  src="./assets/imgs/reload.png">
  <span class="reloadimgtext">Reload</span>

  </div>
</div>
 
       

        


        <br>
        <br>


</div>

<div id="prop">

<table id="table" style="width:100%">
<tr>
  <th>Propreties</th>
</tr>

<tr>
  <td>Current time : <label id="ctime"></label> 
</tr>
<tr>
  <td>autoplay :  <label id="autoplayLabel"></label> </td>
 
</tr>

<tr>
<td>loop : <label id="loopLabel"></label></td>

</tr>

<tr>
<td>duration : <label id="durationLabel"> </td>

</tr>

<tr>
<td>Volume : <label id="volumeLabel"></td>

</tr>

<tr>
<td>Play count : <label id="playCount"></td>

</tr>

<tr>
<td>Pause count : <label id="pauseCount"></td>

</tr>

<tr>
<td>Reload count : <label id="reloadCount"></td>

</tr>
</table>
</div>

    





       
        `;

class MyAudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.volume = 1;
    this.attachShadow({ mode: "open" });
    //this.shadowRoot.innerHTML = template;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.basePath = getBaseURL(); // url absolu du composant
    // Fix relative path in WebAudio Controls elements
    this.fixRelativeImagePaths();
    
    
  }

  connectedCallback() {

    this.counterPlay=0;
    this.counterPause=0;
    this.counterReload=0;

    this.playPauseBtn= this.shadowRoot.querySelector("#playPause");

    this.ctime= this.shadowRoot.querySelector("#ctime");
    this.slider = this.shadowRoot.querySelector("#slider");
    this.autoplaLabel = this.shadowRoot.querySelector("#autoplayLabel");
    this.durationLabel = this.shadowRoot.querySelector("#durationLabel");
    this.loopLabel = this.shadowRoot.querySelector("#loopLabel");
    this.volumeLabel = this.shadowRoot.querySelector("#volumeLabel");
    this.switch1 = this.shadowRoot.querySelector("#sw1");
    this.playCount = this.shadowRoot.querySelector("#playCount");
    this.pauseCount = this.shadowRoot.querySelector("#pauseCount");
    this.reloadCount = this.shadowRoot.querySelector("#reloadCount");


    this.player = this.shadowRoot.querySelector("#myPlayerVid");
    this.sliderParam = this.shadowRoot.querySelector("#sliderParam");
   this.player.loop = true;
   this.player.autoplay=false;

    this.declareListeners();
  }

  fixRelativeImagePaths() {
		// change webaudiocontrols relative paths for spritesheets to absolute
		let webaudioControls = this.shadowRoot.querySelectorAll(
			'webaudio-knob, webaudio-slider, webaudio-switch, img'
		);
		webaudioControls.forEach((e) => {
			let currentImagePath = e.getAttribute('src');
			if (currentImagePath !== undefined) {
				//console.log("Got wc src as " + e.getAttribute("src"));
				let imagePath = e.getAttribute('src');
        //e.setAttribute('src', this.basePath  + "/" + imagePath);
        e.src = this.basePath  + "/" + imagePath;
        //console.log("After fix : wc src as " + e.getAttribute("src"));

        
			}
		});
  }
  
  declareListeners() {
 

    this.shadowRoot.querySelector("#sw1").addEventListener("click", (event) => {
      
      this.loop();
      this.isLoop();
    });

    this.shadowRoot.querySelector("#reload").addEventListener("click", (event) => {
      
      this.retourZero();
    });

    this.shadowRoot.querySelector("#playPause").addEventListener("click", (event) => {
      console.log("playpause")
      this.playPause();
    });

    

    this.shadowRoot
      .querySelector("#knobVolume")
      .addEventListener("input", (event) => {
        this.setVolume(event.target.value);
      });


    this.shadowRoot
    .querySelector("#slider")
    .addEventListener("input", (event) => {
      this.setTime(event.target.value)
      
    });



    this.shadowRoot
    .querySelector("#myPlayerVid")
    .addEventListener("timeupdate", (event) => {
    this.setSliderVal(event.target.currentTime)

    this.autoplayVid();
    this. isLoop();
    this.duration();
    this.currentVolume();
    
    //slider=0
    });




  }

  // API
  setVolume(val) {

  
    this.player.volume = val;
  }

  play() {
    this.player.play();
    this.countPlay();
  }
  
  pause() {
    this.player.pause();
    this.countPause();
  }

  retourZero() {
    this.player.currentTime = 0;
    this.counterReload++
    this.reloadCount.innerHTML=this.counterReload;
  }

  setTime(val) {

    this.player.currentTime = val;
  }

  setSliderVal(val) {
  
    this.ctime.innerHTML=val;
    
    this.slider.value= val;
    this.sliderParam.value=val;
    //this.player.currentTime=val
  }

  autoplayVid() {


    this.autoplaLabel.innerHTML=this.player.autoplay;
  }

  isLoop() {

    this.loopLabel.innerHTML=this.player.loop;
  }

  duration() {

    this.durationLabel.innerHTML=this.player.duration;
  }

  currentVolume() {

    this.volumeLabel.innerHTML=this.player.volume*100;
  }
  
  switchValue() {

   var value= this.playPauseBtn.getAttribute("value");
   if (value=="0"){ this.playPauseBtn.setAttribute("value","1"); }
    else { this.playPauseBtn.setAttribute("value","0"); }

    return this.playPauseBtn.getAttribute("value");
  }



  playPause(){

  var val=  this.switchValue();
  
  if(val=="0")  this.pause();
  else  this.play();

  }
  

  countPlay(){
this.counterPlay++;

this.playCount.innerHTML=this.counterPlay;

  }

  countPause(){
    this.counterPause++;
    this.pauseCount.innerHTML=this.counterPause;
      }
    



      loop(){
       if (this.player.loop == true) {this.player.loop=false}
       else this.player.loop=true;
       
          }










}

customElements.define("my-audioplayer", MyAudioPlayer);