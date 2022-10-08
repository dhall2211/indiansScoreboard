import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";


//import { getAuth,  signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js'; //
import { getFirestore, collection, where, doc, setDoc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js";
import { signInFirebaseAnonymously, getTeamLogosFromFirestore, getLiveGameIDs, getLiveGameMetaData, getLiveGameDataFromDatabase} from './firebase.js';
import { updateScoreboard } from "./scoreboard.js";


const firebaseConfig = {
  apiKey: "AIzaSyC5Uwsn-qh3cbrfDedtLrx0HlGNcs1cI0c",
  authDomain: "my-scoreboard-app.firebaseapp.com",
  projectId: "my-scoreboard-app",
  storageBucket: "my-scoreboard-app.appspot.com",
  messagingSenderId: "343820639542",
  appId: "1:343820639542:web:96ef7568166a397fe42797"
};

// define global vars

var gameID;									// gameID
var showScoreboard = true;
var updateScoreboardContent = false;		// if false, scoreboard canvas will not be updated
var listWithLiveGames = [];

var urls = [];
var urlGuestTeamLogo = "";					// default download urls for team logos
var urlHomeTeamLogo = "";


// Initialize Firebase and initialize reference to Firestore Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// get a reference to the storage service
const storage = getStorage();


// STEP 0: sign in firebase anonymously
//signInFirebaseAnonymously()

// STEP 1: get all active life games from firebase and populate option menu
//populateDropDownMenuWithLiveGames()

// STEP 3: fetch data for selected live game and display it at the scoreboard
/*if (showScoreboard == true) {
	
		urlGuestTeamLogo = listWithLiveGames[0].guestTeamLogoUrl
		urlHomeTeamLogo = listWithLiveGames[0].homeTeamLogoUrl

		// fetch team logo images from firestore/firestorage once
		getTeamLogosFromFirestore(storage, urlGuestTeamLogo,urlHomeTeamLogo);

		// STEP 3: fetch data for selected live game and display it at the scoreboard
		getLiveGameDataFromDatabase(db, gameID)
	
}*/

export function populateDropDownMenuWithLiveGames() {
	getLiveGameIDs(db)
	.then(liveGames => {	
		console.log(liveGames.length)
		if (liveGames.length == 0) {							// no game live -> show a 'no game in progress' screen
			console.log("there is no game live")
			
		// TODO: show empty scoreboard
		} else if (liveGames.length == 1) {						// just one game live -> get gameID directly
			console.log("there is only one game live")
			listWithLiveGames = liveGames
			console.log(listWithLiveGames);
			gameID = liveGames[0].gameID
			
			document.getElementById("gameList").innerHTML += "<a href='"+"javascript:Scoreboard(\""+gameID+"\");'>" + liveGames[0].homeTeam + " vs. " + liveGames[0].guestTeam + "</a>";
			
			getLiveGameMetaData(db,gameID)
			.then(metaData => {
				urlGuestTeamLogo = metaData.guestTeamLogoUrl;
				urlHomeTeamLogo = metaData.homeTeamLogoUrl;
				
				// fetch team logo images from firestore/firestorage once
				getTeamLogosFromFirestore(storage, urlGuestTeamLogo,urlHomeTeamLogo);
			});
			
			Scoreboard(gameID);

		} else {
			// STEP 2: if there is more than one game in progress, let user select the game
			console.log("there are more than one game live")	// let the user choose which game should be shown
			
			// TODO: show list with active games
			// - user has to select which game he wants to see
			//gameID = ...
			updateScoreboardContent = false
		}
		console.log(liveGames);
 });
}

export function Scoreboard(gameID) {
	getLiveGameDataFromDatabase(db, gameID)

		//var urlGuestTeamLogo = liveGame.guestTeamLogoUrl
		//var urlHomeTeamLogo = liveGame.homeTeamLogoUrl

		


	
	// STEP 3: fetch data for selected live game and display it at the scoreboard
	 //updateScoreboard("new", gamedata, imgGuestTeam, imgHomeTeam);
}

/* make module functions global accessable
	see: https://stackoverflow.com/questions/53630310/use-functions-defined-in-es6-module-directly-in-html
*/

//global vars and functions
window.showScoreboard = showScoreboard;
window.listWithLiveGames = listWithLiveGames;

window.signInFirebaseAnonymously = signInFirebaseAnonymously;
window.populateDropDownMenuWithLiveGames = populateDropDownMenuWithLiveGames;
window.getLiveGameMetaData = getLiveGameMetaData;
window.Scoreboard = Scoreboard;









/*if (updateScoreboardContent == true) {
	// fetch team logo images from firestore/firestorage once
	getTeamLogosFromFirestore(urlGuestTeamLogo,urlHomeTeamLogo);
	
	getLiveGameDataFromDatabase(gameID)
}*/