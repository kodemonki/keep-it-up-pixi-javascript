(function (window, document, PIXI) {

    'use strict';

    var footballRadius = 200,
        kickHeight = 200,
        kickDuration = 0.4,
        dropDuration = 0.6,
        shiftMultiflier = 3,
        shiftX,
        shiftRotation,
        renderer,
        stage,
        ballSprite,
        playerScore = 0,
        highScore = 0,
        scoreDiv,
        highScoreDiv,
        formScoreDiv,
        viewLeaderboardBtn,
        leaderboard,
        leaderboard_back,
        leaderboard_results,
        leaderboardSubmitBtn,
        newUsername,
        getSessionUrl = '/projects/keep-it-up/php/get_session.php',
        getScoresUrl = '/projects/keep-it-up/php/get_scores.php',
        setScoresUrl = '/projects/keep-it-up/php/set_scores.php';

    function detectmob() {

        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }

    }

    function resetBall(evt) {

        ballSprite.position.set(renderer.width * 0.5, renderer.height * 0.6);
        playerScore = 0;
        updateScore();

    }

    function dropBall(evt) {

        TweenMax.to(ballSprite.position, dropDuration, {
            ease: "Power1.easeIn",
            y: renderer.height + ballSprite.height,
            onComplete: resetBall
        });
        TweenMax.to(ballSprite, kickDuration, {
            ease: "Power0.easeNone",
            rotation: ballSprite.rotation + (shiftX / -50)
        });
        TweenMax.to(ballSprite.position, kickDuration, {
            ease: "Power0.easeNone",
            x: ballSprite.position.x - shiftX
        });

    }

    function kickBall(eventData) {

        shiftX = (eventData.data.global.x - ballSprite.position.x) * shiftMultiflier;

        TweenMax.to(ballSprite.position, kickDuration, {
            ease: "Power1.easeOut",
            y: ballSprite.position.y - kickHeight,
            onComplete: dropBall
        });

        TweenMax.to(ballSprite, kickDuration, {
            ease: "Power0.easeNone",
            rotation: ballSprite.rotation + (shiftX / -50)
        });

        TweenMax.to(ballSprite.position, kickDuration, {
            ease: "Power0.easeNone",
            x: ballSprite.position.x - shiftX
        });

    }

    function updateScore() {

        if (playerScore > highScore) {
            highScore = playerScore;
        }

        scoreDiv.innerHTML = "SCORE : " + playerScore;
        highScoreDiv.innerHTML = "HIGH SCORE : " + highScore;
        formScoreDiv.innerHTML = highScore;

    }

    function onBallDown(eventData) {

        playerScore = playerScore + 1;
        updateScore();
        kickBall(eventData);

    }

    function animate() {

        requestAnimationFrame(animate);
        renderer.render(stage);

    }

    function onResize(evt) {

        renderer.resize(window.innerWidth, window.innerHeight);

    }

    function addBall() {

        ballSprite = PIXI.Sprite.fromImage('images/football.png');
        ballSprite.position.set(renderer.width * 0.5, renderer.height * 0.6);
        ballSprite.interactive = true;
        ballSprite.buttonMode = true;

        ballSprite.on('mousedown', onBallDown);
        ballSprite.on('touchstart', onBallDown);

        ballSprite.anchor.x = 0.5;
        ballSprite.anchor.y = 0.5;

        ballSprite.width = footballRadius;
        ballSprite.height = footballRadius;

        stage.addChild(ballSprite);

    }

    function showLeaderBoard(evt) {

        if (leaderboard.style.display === 'none') {
            leaderboard.style.display = 'block';
        } else {
            leaderboard.style.display = 'none';
        }

    }

    function submitScore(evt) {

        setHighScore(newUsername.value, highScore);
        newUsername.value = '';

    }

    function findDivs() {

        leaderboard = document.getElementById('leaderboard');
        leaderboard_back = document.getElementById('leaderboard_back');
        leaderboard_results = document.getElementById('leaderboard_results');
        leaderboard_back.addEventListener('click', showLeaderBoard);

        newUsername = document.getElementById('newUsername');

        leaderboardSubmitBtn = document.getElementById('submitBtn');
        leaderboardSubmitBtn.addEventListener('click', submitScore);

        viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
        viewLeaderboardBtn.addEventListener('click', showLeaderBoard);

        scoreDiv = document.getElementById('scoreDiv');
        highScoreDiv = document.getElementById('highScoreDiv');
        formScoreDiv = document.getElementById('formScoreDiv');

    }

    function loadJSON(file, callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };

        xobj.send(null);

    }

    function sendAndLoadJSON(file, data, callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('POST', file, true);
        xobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };

        xobj.send(data);

    }

    function getSessionId() {

        loadJSON(getSessionUrl, function (response) {});

    }

    function getHighScores() {

        loadJSON(getScoresUrl, function (response) {
            var i,
                arr,
                listHtml = '<tr><td class="align-left">SCORE</td><td class="align-left">NAME</td></tr>',
                actual_JSON = JSON.parse(response);

            arr = actual_JSON.results;
            for (i = 0; i < arr.length; i = i + 1) {
                listHtml += '<tr><td class="align-left">' + arr[i].score + '</td><td class="align-left">' + arr[i].username + '</td></tr>';
            }
            leaderboard_results.innerHTML = listHtml;

        });

    }

    function setHighScore(username, score) {

        sendAndLoadJSON(setScoresUrl, 'username=' + username + '&score=' + score, function (response) {
            var i,
                arr,
                listHtml = '',
                actual_JSON = JSON.parse(response);

            getHighScores();

        });

    }

    function init() {

        renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
            'transparent': true
        });

        document.body.appendChild(renderer.view);
        stage = new PIXI.Container();

        getSessionId();
        getHighScores();
        addBall();
        findDivs();
        animate();

        window.addEventListener('resize', onResize, true);

    }

    if (detectmob() === true) {

        footballRadius = 120;
        kickHeight = 150;
        kickDuration = 0.4;
        dropDuration = 0.6;

    } else {

        footballRadius = 200;
        kickHeight = 200;
        kickDuration = 0.4;
        dropDuration = 0.6;

    }

    window.onload = function () {
        init();
    };


}(window, document, PIXI));
