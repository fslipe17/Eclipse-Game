const $ = (tag) => document.querySelector(tag);//cria uma tag no caso "$" para chama document sem precisa  digitar toda a vez
const cnv = $('canvas');//cria uma variavel "cnv" que recebe a tag "$" que chama o elemento canvas no html

cnv.width = innerWidth
cnv.height = innerHeight//O innerWidth e innerHeight são propriedades
// do objeto window que retornam a largura e a altura da janela do navegador, respectivamente.

const ctx = cnv.getContext('2d');//cria um contexto 2D para ser usado na hora de desenhar os elementos no canvas

const player = new Player(cnv.width/2, cnv.height/2, 30, '#48FCFF');

const shootingSpeed = 4;

let projectiles = [];
var enemys = [];
var intervalID = 0;

function spawEnemy(){
    intervalID = setInterval(()=>{
        const radius = Math.floor(Math.random() * 25) + 5;

        var posX, posY = 0;
        if(Math.random() < 0.5){
            posX = Math.random() < .5 ? 0 > - radius : cnv.width + radius;
            posY = Math.random() * cnv.height;
        } else {
            posX = Math.random() * cnv.width;
            posY = Math.random() < .5 ? 0 > - radius : cnv.height + radius;
        }

        const angle = Math.atan2(player.y - posY, player.x - posX)
        const velocit = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        const color = 'hsl('+ Math.random() * 360 +',50%,50%)'

        enemys.push(new Enemy(posX, posY, radius, color, velocit));
    },1500)
}


cnv.addEventListener('click', (e)=>{
    e.preventDefault();
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    const velocit = {
        x: Math.cos(angle) * shootingSpeed,
        y: Math.sin(angle) * shootingSpeed
    }
    projectiles.push(new projectile(player.x, player.y, 3, '#48FCFF', velocit))
    
    console.log(projectiles.length);
})

function loop(){
    requestAnimationFrame(loop,cnv);
    update()
}

function update(){
    ctx.fillStyle = 'rgba(0,0,0,.1)'; //cor preta com opacidade de 0.1
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    checkEnemys();
    checkProjectiles();
    player.update();
}

function checkEnemys(){
    enemys.forEach((enemy)=>{
        enemy.update();;
    })
}

function checkProjectiles(){
    for(var i = projectiles.length -1; i >= 0; i--){
        const p = projectiles[i];
        p.update();
        checkOffScreen(p,i)
    }
}

function checkOffScreen(projectile, index){
    if(projectile.x + projectile.radius < 0 ||
       projectile.x - projectile.radius > cnv.width ||
       projectile.y + projectile.radius < 0 ||
       projectile.y - projectile.radius > cnv.height)
       {
        projectiles.splice(index,1);
        console.log(projectiles.length);
       }
}


loop()
spawEnemy()