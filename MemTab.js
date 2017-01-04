var term = {word:"Fiat", def:"500"};

document.getElementById("termDef").innerHTML = term.def;

$('#play-toggle').click( function(){
    $(this).find('i').toggleClass('glyphicon-play').toggleClass('glyphicon-pause');
});