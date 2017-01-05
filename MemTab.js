//Global object for data storage
var Data = (function() {
    var term = {word:"bateau", def:"boat, ship"};
	var term2 = {word:"sac", def:"bag, sack"};
	var term3 = {word:"voyage", def:"trip, journey"};

	var frenchList = [term, term2, term3];

	var current = frenchList[0];


    return {
        getCurrent: function() {
            return current;
        },
        b_func: function() {
            alert(my_var); // this function can also access my_var
        }
    };

})();

//driver function
(function(){
	var curr = Data.getCurrent();
document.getElementById("termDef").innerHTML = curr.def;

$("#success-alert").hide();
$("#wrong-alert").hide();
})();



//toggles play and pause button
$('#play-toggle').click( function(){
    $(this).find('i').toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
});


//if text box is focused, detects if the "enter" key is pressed
//if "enter" is pressed, the input is submitted
$("#inputText").focus(function(){
	$(document).keypress(function (e) {
    if (e.which == 13) {
        checkSubmission();
    }
	});
});

function checkSubmission(){
	var sub = document.getElementById('inputText').value;
	
	if (sub == Data.getCurrent().word){
		document.getElementById('formGroup').classList.add("has-success");
		showAlert("success-alert");
	}
	else{
		document.getElementById('formGroup').classList.add("has-error");
		showAlert("wrong-alert");
	}

}

function showAlert(type) {
                $("#"+type).alert();
                $("#"+type).fadeTo(2000, 500).slideUp(500, function(){
                $("#"+type).slideUp(500);
                });   
            };