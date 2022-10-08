// scoreboard


// draw results on Scoreboard canvas
export function updateScoreboard(LED, arg, img1, img2) {
    var canvas = document.getElementById("background");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
		
		// clear canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.strokeStyle = "#96989b";

		// draw lines 
		ctx.lineWidth = 0.5;
		var i = 0;
		var n_width, n_height;
			
		if (LED == "new") {
			n_width = 5
			n_height = 2
		} else {
			n_width = 4
			n_height = 4
		}
		for (i = 0; i <= canvas.height; i += canvas.height/n_height) 
			{
				ctx.moveTo(0, i);
				ctx.lineTo(canvas.width, i);			
				ctx.stroke();
			}
		for (i = 0; i <=canvas.width; i += canvas.width/n_width) 
			{
				ctx.moveTo(i, 0);
				ctx.lineTo(i,canvas.height);
				ctx.stroke();
			}

		var y
		
		if (LED == "new") {
			ctx.font = "70px VitoBold";
			y = 50;
		} else {
			ctx.font = "55px VitoBold";
			y = 40;
		}
		
		ctx.fillStyle = "#18233E";		// IndiansBlue
		ctx.textAlign = "center";
		ctx.textBaseline="middle";

		// # of Inning
		ctx.fillText("Inning", canvas.width/2, y);
		
		ctx.fillStyle = "white";
		if (LED == "new") {
			y = 560;
		} else {
			y = 465;
		}
		
		// place teamlogos on canvas
		drawTeamLogosOnScoreboard(img1, img2)		
		
		// Balls
		ctx.fillText("Ball", canvas.width/4*(11/16), y);
		// Strikes
		ctx.fillText("Strike", canvas.width/2,y);
		// Outs
		ctx.fillText("Out", canvas.width*7/8,y);
		

        /* draw permanent text
        */
		if (LED == "new") {
			ctx.font = "180px FaceOffM54";
		} else {
			ctx.font = "150px FaceOffM54";
		}
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // # of Inning
        ctx.fillText(arg.inning, canvas.width / 2, canvas.height / 4);

        // # of runs
		if (LED == "new") {
			ctx.font = "250px FaceOffM54";
		} else {
			ctx.font = "210px FaceOffM54";
		}
        
        ctx.textBaseline = "center";
        ctx.fillText(arg.runsGuestTeam, canvas.width / 7, canvas.height * 0.55);
        ctx.fillText(arg.runsHomeTeam, canvas.width * 6 / 7, canvas.height * 0.55);
        ctx.restore();

        // draw the triangle for inning half
        DrawFilledTriangle(LED, canvas, arg.inningHalf);

        // draw # of balls
        DrawFilledCircle(LED, canvas, "balls", arg.balls, 3);
        // draw # of strikes
        DrawFilledCircle(LED, canvas, "strikes", arg.strikes, 2);
         // draw # of outs
        DrawFilledCircle(LED, canvas, "outs", arg.outs, 2);

        //draw status of bases
        DrawBases(LED, canvas, arg.base1, arg.base2, arg.base3);
    }
    return;
}


export function drawTeamLogosOnScoreboard(img1, img2) {

	var canvas = document.getElementById("background");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		var imgSizeX = 300
		if (img1.src.includes("logo_indians.png")) {
			var imgSizeY = 250
			var imgSizeYmax = 250
		} else {
			var imgSizeY= 220
			var imgSizeYmax = 220
		}

		if (img1.height > img1.width) {
			imgSizeX = img1.width*imgSizeY/img1.height
		} else {
			imgSizeY = img1.height*imgSizeX/img1.width
			if (imgSizeY > imgSizeYmax) {
				imgSizeY = imgSizeYmax
				imgSizeX = img1.width*imgSizeYmax/img1.height
			}
		}
		
		DrawImageAtPosition(ctx, img1, canvas.width*1/6 - imgSizeX/2, canvas.height*0.2-imgSizeY/2, imgSizeX, imgSizeY);
		
		if (img2.src.includes("logo_indians.png")) {
			var imgSizeY = 250
			var imgSizeYmax = 250
		} else {
			var imgSizeY = 220
			var imgSizeYmax = 220
		}

		if (img2.height > img2.width) {
			imgSizeX = img2.width*imgSizeY/img2.height
		} else {
			imgSizeY = img2.height*imgSizeX/img2.width
			if (imgSizeY > imgSizeYmax) {
				imgSizeY = imgSizeYmax
				imgSizeX = img2.width*imgSizeYmax/img2.height
			}
		}

		DrawImageAtPosition(ctx, img2, canvas.width*5/6 - imgSizeX/2, canvas.height*0.2-imgSizeY/2, imgSizeX, imgSizeY);
	}
}


function DrawImageAtPosition(ctx, img, x, y, width, height) {
	ctx.drawImage(img,x,y,width,height);
}


function DrawFilledTriangle(LED, canvas, inning_half) {
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
		if (LED == "new") {
			var triWidth = 75;
			var triHeight = 100;
			var xStart = canvas.width*4/10-triWidth;
			var yStart = canvas.height*2.5/10+triHeight/2;
		} else {
			var triWidth = 60;
			var triHeight = 90;
			var xStart = canvas.width*2.80/8-triWidth/2;
			var yStart = 190;
		}
		
        ctx.strokeStyle = "#96989b";
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 5;
		
		

        if (inning_half == "top") {
            // clear filled arrow "inning half bottom"
           // ctx.clearRect(canvas.width*5.20/8-triWidth/2-ctx.lineWidth,yStart-triHeight-ctx.lineWidth,triWidth+2*ctx.lineWidth,triHeight+2*ctx.lineWidth);
			var gradient = ctx.createLinearGradient(xStart, 0, xStart + triWidth, 0);
        	gradient.addColorStop("0", "white");
        	gradient.addColorStop("1.0", "#96989b");
            // define path of arrow "top"
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xStart+triWidth, yStart);
            ctx.lineTo(xStart+triWidth/2,yStart-triHeight);
            ctx.closePath(); 
            ctx.fill();
			ctx.strokeStyle = gradient;
            ctx.stroke(); // Draw it
        } else {
            // clear filled arrow "inning half top"
            //ctx.clearRect(xStart-ctx.lineWidth,yStart-triHeight-ctx.lineWidth,triWidth+2*ctx.lineWidth,triHeight+2*ctx.lineWidth);
            
            var xStart = canvas.width*6/10;
			var gradient = ctx.createLinearGradient(xStart, 0, xStart + triWidth, 0);
			gradient.addColorStop("0", "white");
        	gradient.addColorStop("1.0", "#96989b");
            //define path of arrow "bottom"
            ctx.beginPath();
            ctx.moveTo(xStart+triWidth/2, yStart);
            ctx.lineTo(xStart+triWidth, yStart-triHeight);
            ctx.lineTo(xStart,yStart-triHeight);
            ctx.closePath();
            ctx.fill();
			ctx.strokeStyle = gradient;
            ctx.stroke(); // Draw it
        }
    }
}


function DrawFilledCircle(LED, canvas, type ,num, numMax) {
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var radius;
        var deltaX;
        var deltaY = 0;
        var xStart = 70;
        var yStart;
		
		if (LED == "new") {
			yStart = 640;
			radius = 37.5;
			deltaX = 100;
		} else {
			yStart = 580;
			radius = 27.5;
			deltaX = 85;
		}
        var n = 2;  // max number of circles to be drawn at once
        ctx.strokeStyle = "#96989b";
        ctx.lineWidth = 5;

        if (type == "balls") {
            n = 3;
            ctx.fillStyle = "#00AF43";
        } else if (type == "strikes") {
            xStart = canvas.width/2-deltaX/2;
            ctx.fillStyle = "#C21632";
        } else if (type == "outs") {
            xStart = canvas.width*7/8-deltaX/2;
            ctx.fillStyle = "#FFD200";
        } else return;

        for (let i = 0; i < numMax; i++) {
            // Create gradient
            var gradient = ctx.createLinearGradient(xStart + i * deltaX - radius, 0, xStart + i * deltaX + radius, 0);
            gradient.addColorStop("0", "white");
            gradient.addColorStop("1.0", "#96989b");
            ctx.beginPath();
            ctx.arc(xStart + i * deltaX, yStart + i * deltaY, radius, 0, 2 * Math.PI);
            if (num>i) {ctx.fill();}
            ctx.lineWidth = 6;
            ctx.strokeStyle = gradient;
            ctx.stroke();
        }
    }
}

function DrawBases(LED, canvas, base1, base2, base3) {
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var xStart = canvas.width/2;
        var yStart;
        var xOffset = 15;
        var yOffset = 10;
        var b;
        var h;
		
		if (LED == "new") {
			b = 200;
			h = 105;
			yStart= canvas.height * 4 / 5-90
		} else {
			b = 160;
			h = 85;
			yStart= canvas.height * 4 / 5-70
		}

        ctx.fillStyle="yellow";

        // draw base 1
		var gradient = ctx.createLinearGradient(xStart + xOffset, 0, xStart + b + xOffset, 0);
        gradient.addColorStop("0", "white");
        gradient.addColorStop("1.0", "#96989b");
        ctx.beginPath();
        ctx.moveTo(xStart+b/2+xOffset, yStart);
        ctx.lineTo(xStart+b+xOffset, yStart-h/2);
        ctx.lineTo(xStart+b/2+xOffset, yStart-h);
        ctx.lineTo(xStart+xOffset, yStart-h/2);
        ctx.closePath();
        if (base1 == true) {ctx.fill()}
		ctx.strokeStyle = gradient;
        ctx.stroke(); // Draw 1st base

        // draw base 2
		gradient = ctx.createLinearGradient(xStart - b/2, 0, xStart + b/2, 0);
        gradient.addColorStop("0", "white");
        gradient.addColorStop("1.0", "#96989b");
        ctx.beginPath();
        ctx.moveTo(xStart, yStart-h/2-yOffset);
        ctx.lineTo(xStart+b/2, yStart-h-yOffset);
        ctx.lineTo(xStart, yStart-h*3/2-yOffset);
        ctx.lineTo(xStart-b/2, yStart-h-yOffset);
        ctx.closePath();
        if (base2 == true) {ctx.fill()}
		ctx.strokeStyle = gradient;
        ctx.stroke(); // Draw 2nd base

        // draw base 3
        ctx.beginPath();
		gradient = ctx.createLinearGradient(xStart - b - xOffset, 0, xStart - xOffset, 0);
        gradient.addColorStop("0", "white");
        gradient.addColorStop("1.0", "#96989b");
        ctx.moveTo(xStart-b/2-xOffset, yStart);
        ctx.lineTo(xStart-b-xOffset, yStart-h/2);
        ctx.lineTo(xStart-b/2-xOffset, yStart-h);
        ctx.lineTo(xStart-xOffset, yStart-h/2);
        ctx.closePath();
        if (base3 == true) {ctx.fill()}
		ctx.strokeStyle = gradient;
        ctx.stroke(); // Draw 2nd base
    }

}
