var $ = (tag) => document.querySelector(tag);

var canvas = $('canvas'); 
canvas.width = innerWidth;
canvas.height = innerHeight;

var context = canvas.getContext('2d');

var txtscore = $('#txtscore');
var score = 0;

var player = new Player(canvas.width/2, canvas.height/2, 30, '#48fcff');

var projetil = [];

var shootingSpeed = 4;

var enemies = [];

var particles = [];

var intervalID = '';

function spawEnemies(){
    intervalID = setInterval(() => {
        var radius = Math.floor(Math.random() * 26) + 5;

        var posiX, posiY;

        if(Math.random() < 0.5){
            posiX = Math.random() < .5 ? 0 - radius : canvas.width + radius;
            posiY = Math.random() * canvas.height;
        }else {
            posiX = Math.random() * canvas.width;
            posiY = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        }

        var angle = Math.atan2(player.y - posiY, player.x - posiX);

        var velocity = {
            x: Math.cos(angle), 
            y: Math.sin(angle)
        }

        var color = 'hsl('+ Math.random() * 360 +', 80%, 50%)';

        enemies.push(new Enemy(posiX, posiY, radius, color, velocity));
    }, 1500)
}

canvas.addEventListener('click', (e) => {
    e.preventDefault();

    var angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);

    var velocity = {
        x: Math.cos(angle) * shootingSpeed,
        y: Math.sin(angle) * shootingSpeed
    }

    projetil.push(new Projectile(player.x, player.y, 4, '#48fcff', velocity));

    console.log(projetil.length);
})


function loop(){
    requestAnimationFrame(loop, canvas);
    update();
}

function update(){
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height); 

    checkParticles();
    checkEnemies();
    checkProjectiles();
    player.update();
}

function checkEnemies(){
    enemies.forEach((enemy) => {
        enemy.update();

        var distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if(distance < player.radius + enemy.radius){
            alert('Game Over');
        }
    })
}

function checkProjectiles(){
    for(var i = projetil.length -1; i >= 0; i--){
        var p = projetil[i];
        p.update();
        checkOffScreen(p, i);

        for(var eIndex = enemies.length -1; eIndex >= 0; eIndex--){
            var enemy = enemies[eIndex];

            var distance = Math.hypot(p.x - enemy.x, p.y - enemy.y);

            //Colisão do projetil com o Inimigo.
            if(distance < p.radius + enemy.radius){
                if(enemy.radius > 15){
                    enemy.newRadius = enemy.radius -10;
                }else {
                    enemies.splice(eIndex, 1);
                }

                score += 50 - Math.floor(enemy.radius);
                txtscore.innerText = 'Score: ' + score;

                // enemies.splice(eIndex, 1);
                projetil.splice(i, 1);
                createParticles(enemy, p);
            }
        }
    }
}

function checkOffScreen(projectile, index){
    if( projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height)

        {

            score -= 100;
            if(score < 0){
                score = 0;
            }

            txtscore.innerText = 'Score: ' + score

            projetil.splice(index, 1);
            console.log(projetil.length);
        }
}

function createParticles(enemy, projectile){
    for(var i = 0; i < enemy.radius * 2; i++){
        var velocity = {
            x: (Math.random() - 0.5) * (Math.random() * 10),
            y: (Math.random() - 0.5) * (Math.random() * 10)
        }

        particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, velocity));
    }
}

function checkParticles(){
    for(var i = particles.length -1; i >= 0; i--){
        var p = particles[i];
        p.update();
        if(p.alpha <= 0){
            particles.splice(i, 1);
        }
    } 
}

loop();
spawEnemies();