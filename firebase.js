// functions to fetch datas from firebase firestore
import { getAuth,  signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js";
import { updateScoreboard, drawTeamLogosOnScoreboard } from './scoreboard.js';


class LiveData {
    constructor(gameID, inning, inningHalf, runsGuestTeam, runsHomeTeam, balls, strikes, outs, base1, base2, base3) {
        this.gameID = gameID
		this.inning = inning;
        this.inning_half = inningHalf;
        this.guest = runsGuestTeam;
        this.home = runsHomeTeam;
        this.balls = balls;
        this.strikes = strikes;
        this.outs = outs;
        this.status1stBase = base1;
        this.status2ndBase = base2;
        this.status3rdBase = base3;
    }
    toString() {
        return this.gameID + ',' + this.inning + ', ' + this.inningHalf + ', ' + this.guest + ', ' + this.home + ', ' + this.balls + ', ' + this.strikes + ', ' + this.outs + ', ' + this.status1stBase + ', ' + this.status2ndBase + ', ' + this.status3rdBase;
    }
};

// Firestore data converter
const liveDataConverter = {
    toFirestore: (data) => {
        return {
			gameID: data.gameID,
			inning: data.inning,
			inning_half: data.inningHalf,
			guest: data.guest,
			home: data.home,
			balls: data.balls,
			strikes: data.strikes,
			outs: data.outs,
			status1stBase: data.status1stBase,
			status2ndBase: data.status2ndBase,
			status3rdBase: data.status3rdBase
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new LiveData(data.gameID, data.inning, data.inningHalf, data.guest, data.home, data.balls, data.strikes, data.outs, data.status1stBase, data.status2ndBase, data.status3rdBase);
    }
};

// global vars
var imgGuestTeam = new Image();		// define var for logos of both teams
var imgHomeTeam = new Image();


export async function signInFirebaseAnonymously() {
	const auth = getAuth();
	signInAnonymously(auth)
		.then(() => {
    	
			// Signed in..
			console.log("signInAnonymously did work ... ");
		})
		.catch((error) => {
    		const errorCode = error.code;
    		const errorMessage = error.message;
    		// ...
  		});
}


export async function getLiveGameIDs(db) {
	var listOfGames = [];
	
	const gamesCol = collection(db, 'liveGames') //.withConverter(liveDataConverter);
	const gamesSnapshot = await getDocs(gamesCol);
	
	/*if (gamesSnapshot.exists()) {
		// Convert to City object
		const city = gamesSnapshot.data();
		// Use a City instance method
		console.log(gamesSnapshot.toString());
	} else {
		console.log("No such document!");
	}*/
	gamesSnapshot.forEach((doc) => {
		
		const gameData = doc.data()
		gameData.gameID = doc.id		// add docID to gameData
		listOfGames.push(gameData)
	});
	
	return listOfGames;
};


export async function getLiveGameMetaData(db, gameID) {
	var metaData;
	
	const gameRef = doc(db, 'liveGames', gameID); //.withConverter(liveDataConverter);
	
	const gameSnap = await getDoc(gameRef);
	
	/*if (gamesSnapshot.exists()) {
		// Convert to City object
		const city = gamesSnapshot.data();
		// Use a City instance method
		console.log(gamesSnapshot.toString());
	} else {
		console.log("No such document!");
	}*/
	if (gameSnap.exists()) {
  		console.log("Document data:", gameSnap.data());
		var urlGuestTeamLogo = gameSnap.data().guestTeamLogoUrl;
		console.log(urlGuestTeamLogo);
		var urlHomeTeamLogo = gameSnap.data().homeTeamLogoUrl;
		console.log(urlHomeTeamLogo);
		
		// fetch team logo images from firestore/firestorage once
		//getTeamLogosFromFirestore(db, urlGuestTeamLogo,urlHomeTeamLogo);
		return gameSnap.data();
	} else {
		// doc.data() will be undefined in this case
  		console.log("No such document!");
	}
	
};


export async function getLiveGameDataFromDatabase(db, gameID) {
	var gamedata;
	const docRef = doc(db, "liveGames", gameID);
	
	const unsub = onSnapshot(docRef, (doc) => {
		gamedata = doc.data();
		updateScoreboard("new", gamedata, imgGuestTeam, imgHomeTeam);
	});
}


export function getTeamLogosFromFirestore(storage, url1, url2) {
	const imgRefGuest = ref(storage, url1);
	const imgRefHome = ref(storage, url2);

	// download and draw logo from guest team
	getDownloadURL(imgRefGuest)
		.then((urlGuestTeamLogo) => {
	
			loadImageFromFireBase(urlGuestTeamLogo)
				.then((e) => {
					imgGuestTeam = e;
					imgGuestTeam.src = urlGuestTeamLogo;
				
					// update scoreboard
					drawTeamLogosOnScoreboard(imgGuestTeam, imgHomeTeam);
				})
		})
		.catch((error) => {
			console.log("guest team logo could not get loaded")
			console.error(error);
		});
		//.catch(err => console.error(err)));
	
	// download and draw logo from home team
	getDownloadURL(imgRefHome)
		.then((urlHomeTeamLogo) => {
			loadImageFromFireBase(urlHomeTeamLogo)
				.then((e) => {
					imgHomeTeam = e;
					imgHomeTeam.src = urlHomeTeamLogo;
				
					// update scoreboard
					drawTeamLogosOnScoreboard(imgGuestTeam, imgHomeTeam);
				})
		})
		.catch((error) => {
			console.log("guest team logo could not get loaded")
			console.error(error);
		});	
};


export function loadImageFromFireBase(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
	img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
};

