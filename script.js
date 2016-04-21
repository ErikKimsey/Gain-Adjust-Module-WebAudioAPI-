/*
** A gain control module, using the Web Audio API.
** by Erik Kimsey
** 04/21/2016
*/


/*
1.Create audio context
2. Inside the context, create sources — such as <audio>, oscillator, stream
3. Create effects nodes, such as reverb, biquad filter, panner, compressor
4. Choose final destination of audio, for example your system speakers
5. Connect the sources up to the effects, and the effects to the destination.
*/

var audioContext = new AudioContext();
var play = document.getElementById("play");
var slide = document.getElementById("slideElem");
var volume,
    volUp = document.getElementById("volUp"),
    volDown = document.getElementById("volDown"),
    display = document.getElementById("volDisplay");
    display.innerHTML = 100,
    check = true;


function getData(){

    source = audioContext.createBufferSource();
    var gainNode = audioContext.createGain();
    var xhrAudio = new XMLHttpRequest();

    xhrAudio.open("GET", "drumMain.mp3", true);
    xhrAudio.responseType = "arraybuffer";

    xhrAudio.onload = function(){
      var audioData = xhrAudio.response;

      audioContext.decodeAudioData(audioData, function(buffer){
          source.buffer = buffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          source.loop = true;
      },

    function(e){"Error decoding audio data" + e.err});

    }

    xhrAudio.send();

// Punches gain up by 10, maxing at 100.
volUp.onclick = function(gain){

    volume = gainNode.gain.value;
    if(volume < 1.0)
    {volume += 0.1;}
    display.innerHTML = Math.round(volume * 100);
    return gainNode.gain.value = volume;

};

// Punches gain down by 10, until value is 0.
volDown.onclick = function(gain){
    volume = gainNode.gain.value;
    if(volume > 0.0)
    {volume -= 0.1;}
    display.innerHTML = Math.round(volume * 100);
     return gainNode.gain.value = volume;
};


}

// Provides the "PLAY" and "STOP" functionality.
play.onclick = function(){

    if(check === true){
        getData();
        source.start(0);
        play.setAttribute("disabled", "disabled");
        play.innerHTML = "Stop";
        return check = false;
    } else {
        source.stop(0);
        play.removeAttribute("disabled");
        play.innerHTML = "Play";
        return check = true;
    }

};

//
window.onload = function(){
  getData();
};
