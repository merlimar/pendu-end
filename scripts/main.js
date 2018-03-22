$('#winning').hide();
$('#losing').hide();

var gameData = {};
gameData.maxTrials=8;
gameData.trials=0;
gameData.remainingTrials=gameData.maxTrials;
gameData.word='';
gameData.lettersCount = 0;
gameData.replacementString='';
gameData.alphabet ='abcdefghijklmnopqrstuvwxyz';
gameData.states= ['playing','winning','losing']
gameData.state = gameData.states[0];
gameData.triedLetters='';

$.get('/pendu/api/index.php', function(word){
	gameData.word=word;
	gameData.lettersCount=word.length;
	//gameData.replacementString=word.replace(/./g,'*');
	gameData.replacementString = gameData.replacementString.padStart(gameData.lettersCount,'*')
	render();
})

$('form').on('submit',function(e){
	e.preventDefault();
	/***le code à exécuter quand on soumet une lettre***/
	let triedLetter = $('#select-letter option:selected').val();
	//Retirer de la liste -> mettre l'alphabet à jour.
	gameData.alphabet = gameData.alphabet.replace(triedLetter,'');
	//Mettre dans les lettres essayées.
	gameData.triedLetters+=triedLetter;
	//Vérifier si elle est dans le mot.
	let replacementString='';
	let letterFound=false;
	for(let i=0;i<gameData.lettersCount;i++){
		if(triedLetter.toUpperCase()===gameData.word.charAt(i)){
			replacementString+=triedLetter;
			letterFound=true;
		}else{
			replacementString+=gameData.replacementString.charAt(i);
		}
	}
	gameData.replacementString=replacementString.toUpperCase();

	if(!letterFound){
		gameData.trials++;
		gameData.remainingTrials=gameData.maxTrials-gameData.trials;
		if(gameData.remainingTrials===0){
			gameData.state=gameData.states[2];
		}
	}else{
		if(gameData.replacementString===gameData.word){
			gameData.state=gameData.states[1];
		}
	}


	render();
})

function render(){
	$('#max-trials').text(gameData.maxTrials);
	$('#letters-count').text(gameData.lettersCount);
	$('#replacement-string').text(gameData.replacementString);
	$('#select-letter').find('option').remove();
	$('#tried-letters').text(gameData.triedLetters);
	$('#remaining-trials').text(gameData.remainingTrials);
	$('#image-file').attr('src',`images/pendu${gameData.trials}.gif`);
	$('.word').text(gameData.word);
	// créer les options (tip:use split alphabet for each)
	gameData.alphabet.split('').forEach(letter=>
		$('#select-letter').append(`<option value="${letter}">${letter}</option>`)
	)
	console.log(gameData.state);
	gameData.states.forEach(function(state){
		if (gameData.state===state) {
			$(`#${state}`).show();
		}else{
			$(`#${state}`).hide();
		}
	})
}