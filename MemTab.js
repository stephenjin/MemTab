//Global object for data storage
var Data = (function() {
    var term = {word: "bateau", def: "boat, ship"};
	var term2 = {word: "sac", def: "bag, sack"};
	var term3 = {word: "voyage", def: "trip, journey"};

	var frenchList = [term, term2, term3];

	var current = frenchList[0];
    var index = 0;
    var progress = 0;
    var timer = 20;
    var finished = false;

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
           if(index < frenchList.length-1){
            index = index+1;
            current = frenchList[index];
            progress = ++progress;
           }
           else if(index == frenchList.length-1){ //last term in the list
            progress = ++progress;
            $('#finished-alert').show();
            $("#inputText").attr("readonly", "");
            finished = true;
           }
        },
        getProgress: function(){
            if (frenchList.length > 0){
            var percent = (progress/frenchList.length)*100;
            return percent;
            }
            
        },
        restart: function(){
            index = 0;
            current = frenchList[index];
            progress = 0;
        }
       
    };

})();

//main driver function
(function(){
	var curr = Data.getCurrent();
document.getElementById("termDef").innerHTML = curr.def;

$("#success-alert").hide();
$("#wrong-alert").hide();
})();



//toggles play and pause button
var counter;
var count = Data.getTimer();
$('#play-toggle').click( function(){
    $(this).find('i').toggleClass("glyphicon-play").toggleClass("glyphicon-pause");


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

    //start timer if play button has been pressed
    if($("#play-toggle").find('i').hasClass("glyphicon-pause")){
    resetTimer();
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



