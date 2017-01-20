//Global object for data storage
var Data = (function() {
    var term = {word: "bateau", def: "boat, ship"};
	var term2 = {word: "sac", def: "bag, sack"};
	var term3 = {word: "voyage", def: "trip, journey"};

	var termList = [term, term2, term3];
    getTerms(termCallBack);
     

	var current;
    var index = 0;
    var progress = 0;
    var timer = 20;
    var finished = false;

    function termCallBack(termVal, indexVal, progressVal, timerVal){
 
        termList = termVal;
        index = indexVal;
        current = termList[index];
        progress = progressVal;
        timer = timerVal;

        //update element visuals
        document.getElementById("termDef").innerHTML = current.def;
        count = timer;
        document.getElementById("timer").innerHTML=count;
        updateProgress();
    }

    function getTerms(callback){
        chrome.storage.sync.get(null, function(data){
            callback(data.userTerms, data.currIndex, data.progress, data.timer);
        });

    }

    return {
        getCurrent: function() {
            return current;
        },
        getTimer: function(){
            return timer;
        },
        getFinished: function(){
            return finished;
        },
        nextTerm: function() {
           if(index < termList.length-1){
            index = index+1;
            current = termList[index];
            progress = ++progress;
           }
           else if(index == termList.length-1){ //last term in the list
            progress = ++progress;
            $('#finished-alert').show();
            $("#inputText").attr("readonly", "");
            finished = true;
           }
        },
        getProgress: function(){
            if (termList.length > 0){
            var percent = (progress/termList.length)*100;
            return percent;
            }
            
        },
        restart: function(){
            index = 0;
            current = termList[index];
            progress = 0;
        },
        setTimer: function(time){
            timer = time;
        },
        addTerm: function(term){
            termList.push(term);
        },
        clearTerms: function(){
            termList.length = 0;
        },
        setTerms: function(){
            chrome.storage.sync.set({'userTerms': termList}, function(){
            });
        },
        updateData: function(){
            chrome.storage.sync.set({'currIndex': index, 'progress': progress, 'timer': timer}, function(){
            });
        }

        
    };

})();

//main driver function
(function(){
	//var curr = Data.getCurrent();
//document.getElementById("termDef").innerHTML = curr.def;

$("#success-alert").hide();
$("#wrong-alert").hide();

})();


//toggles play and pause button
var counter;
var count = Data.getTimer();
$('#play-toggle').click( function(){
    $(this).find('i').toggleClass("glyphicon-pause").toggleClass("glyphicon-play");


    if($(this).find('i').hasClass("glyphicon-pause")){
        if(!Data.getFinished()){
        $("#inputText").removeAttr("readonly");
        counter=setInterval(timer, 1000); 
        }
    }
    else{
        clearInterval(counter);
        $("#inputText").attr("readonly", "");
    }


});

//countdown timer
 function timer(){    
     count=count-1;
    if (count <= -1)
     {
     clearInterval(counter);
     //counter ended, show hint
     var term = Data.getCurrent().word;
     $("#termDef").append("<br>Term: "+term);

     return;
    }

    //Update timer on the page
     document.getElementById("timer").innerHTML=count;
    }

function resetTimer(){
    clearInterval(counter);
    count = Data.getTimer();
    document.getElementById("timer").innerHTML=count;
    counter=setInterval(timer, 1000); 
}


$('#restart').click(function(e){
    $('#finished-alert').hide();
    Data.restart();
    var curr = Data.getCurrent();
    document.getElementById("termDef").innerHTML = curr.def;
    updateProgress();
    Data.updateData();

    //reset play/pause button and timer
    $("#play-toggle").find('i').removeClass("glyphicon-play").addClass("glyphicon-pause");
    $('#play-toggle').click();
    count = Data.getTimer();
    document.getElementById("timer").innerHTML=count;
    document.getElementById("inputText").value = "";
    
});

//dropdown menu
 $(document).ready(function () {
        $('.dropdown-toggle').dropdown();
    });

$(".dropdown-menu a").click(function() {
    $(this).closest(".dropdown-menu").prev().dropdown("toggle");
});

//trigger file upload from the options dropdown menu
 $("#upload").on('click', function(e){
        e.preventDefault();
        alert("Select a text file with each term on a new line in the following format:\n\nterm: definition\n\ne.g.\nboat: a small vessel propelled on water by oars, sails, or an engine");
        $("#file:hidden").trigger('click');
    });

//prompt the user to enter a timer value
$("#setTimer").on('click', function(){
    var value = prompt("Enter a value in seconds");

    //if the value is a positive integer, update the timer
    if(isInt(value) && value > 0){
        Data.setTimer(value);
        Data.updateData();
        count = Data.getTimer();
        document.getElementById("timer").innerHTML=count;
    }


  //check if value is an integer
  function isInt(value) {
  if (isNaN(value)) {
    return false;}
  var x = parseFloat(value);
  return (x | 0) === x;
    }
});



//if text box is focused, detects if the "enter" key is pressed
//if "enter" is pressed, the input is submitted
$("#inputText").focus(function(){
	$(document).off().keypress(function (e) {
    if (e.which == 13) {
        document.getElementById("inputText").focus();
        resetForm();
        checkSubmission();
    }
	});
});

$('#submitButton').click(function(e){
    e.stopPropagation();
    document.getElementById("inputText").focus();
    resetForm();
    checkSubmission();
});

//Go on to the next word
function refreshTerm(){
    Data.nextTerm();
    var finished = Data.getFinished();
    var curr = Data.getCurrent();
    $("#termDef").fadeOut();
    $("#termDef").fadeIn();

    setTimeout(function() {
    document.getElementById("termDef").innerHTML = curr.def;
    updateProgress();
    Data.updateData();
    resetForm();
    document.getElementById("inputText").value = "";

    //reset timer except on the last term
    if (finished != true){
    resetTimer(); 
    }
    
    }, 2400);
    

}

//reset form state on document click
document.body.addEventListener("click", resetForm);

function resetForm(){
    $('#formGroup').removeClass("has-error has-success");

}

//checks the user input and creates a "right" or "wrong" alert based on correctness
function checkSubmission(){
	var sub = document.getElementById('inputText').value;
	
    //case insensitive comparison
	if (sub.toUpperCase() == Data.getCurrent().word.toUpperCase()){
		document.getElementById('formGroup').classList.add("has-success");
        $("#wrong-alert").hide();
		showAlert("success-alert");
        clearInterval(counter);
        refreshTerm();

	}
	else{
		document.getElementById('formGroup').classList.add("has-error");
        $("#success-alert").hide();
		showAlert("wrong-alert");

	}
}

function showAlert(type) {
                $("#"+type).alert();
                $("#"+type).fadeTo(2000, 500).slideUp(500, function(){
                $("#"+type).slideUp(500);
                });
            }

//updates progress bar visuals
function updateProgress(){
    var value = Data.getProgress();
    $('.progress-bar').css('width', value+'%').attr('aria-valuenow', value);  

}

//reads in a text file of terms and loads the terms onto the page
document.getElementById('file').onchange = function(){

  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function(progressEvent){

    //Read line by line
    var lines = this.result.split('\n');
    Data.clearTerms();
    for(var line = 0; line < lines.length; line++){
       var str = lines[line].split(/: |:/); 
      console.log(str[0]);
      console.log(str[1]);
      var term = {word: str[0], def: str[1]};
      Data.addTerm(term);
    }

    Data.setTerms();
    
    //reset list to beginning on file load
    $('#restart').click();
    Data.updateData();
    window.location.reload();
  };

  reader.readAsText(file);
};




