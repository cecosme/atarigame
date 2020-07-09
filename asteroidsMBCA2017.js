// MBCA 2017 Trabalho Final - Carlos Eduardo C. Ribeiro


// ligando o canvas ao código javascript
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// variaveis Globais
var nave_x = (canvas.width)/2;
var nave_y = (canvas.height)/2;	
var nave_boost = 0;
var nave_heading = 0;
var torpedo = false;
var Total = 0;
var Pontos = 0;
var Colidiu = false;

var a1x = 0;
var a1y = 0;
var a1h = 135;
var a1s = 1;

// criacao do array de torpedos disparados
var Municao = new Array();

// funcao para criacao da nave
function RogueOne(x, y,heading,stroke)
{
    this.stroke = stroke;

    context.save();
    context.translate(x, y);
    context.rotate(heading*Math.PI/180);
    context.translate(-x, -y);       
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x+5, y+15);
    context.lineTo(x-5, y+15);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = this.stroke;
    context.stroke();
    context.fillStyle = "#000000";
    context.fill();
    context.restore();
}

// funcao para criacao do torpedo
var Torpedo = function (x,y,heading,stroke)
{
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.stroke = stroke;

    this.draw = function()
    {       
        context.beginPath();
        context.arc(this.x, this.y, 1, 0, 2 * Math.PI);
        context.stroke();
        context.lineWidth = 3;
        context.strokeStyle = this.stroke;
        context.stroke();
        context.fillStyle = "#000000";
        context.fill();
    }    
}

// funcao para criacao do objeto asteroide classe 1
var Classe1 = function (x1, y1,heading1)
{
    this.x = x1;
    this.y = y1;
    this.heading = heading1;

    this.draw = function()
    {       
        context.beginPath();
        context.moveTo(this.x,this.y);
        context.lineTo(this.x+5,this.y);
        context.lineTo(this.x+10,this.y+5);
        context.lineTo(this.x+5,this.y+10);
        context.lineTo(this.x,this.y+10);
        context.lineTo(this.x-5,this.y+5);
        context.closePath();
        context.lineWidth = 3;
        context.strokeStyle = "#ffffff";
        context.stroke();
        context.fillStyle = "#000000";
        context.fill();
    }		

}

// tratar acoes ao pressionar qquer tecla
var _keyDown = function(e)
{
    switch (e.keyCode)
    {
        case 32: // space key

            break;
        case 37: // left arrow key
            nave_heading += -10;
            if (nave_heading < 0)
            {
                nave_heading = 360 + nave_heading;
            }
            break;
        case 39: // right arrow key
            nave_heading += 10;
            if (nave_heading >= 360)
            {
                nave_heading = 0;
            }
            break;
        case 38: // up arrow key
            nave_boost = 5;
            break;
        case 40: // down arrow key
            nave_boost = -5;
            break;   
        default:
            console.log("keyDown: " + e.keyCode);
            break;
    }
}

// tratar acoes ao liberar qquer tecla
var _keyUp = function(e)
{    
    switch (e.keyCode)
    {
        case 32: // space key
            // disparar torpedo
            Municao.push(new Torpedo(nave_x,nave_y,nave_heading,'#ffffff'));
            break;
        case 37: // left arrow key

            break;
        case 39: // right arrow key

            break;
        case 38: // up arrow key
            nave_boost = 0;
            break;
        case 40: // down arrow key
            nave_boost = 0;
            break;
        case 82: // reinicia o jogo
            location.reload();
            break;
        default:
            // console.log("keyUp: " + e.keyCode);
            break;	
    }				
}

// capturar comandos do jogo
document.addEventListener("keyup",   _keyUp,   true);
document.addEventListener("keydown", _keyDown, true);

// função para escrever no canvas
function drawText(x,y,text)
{
    context.fillStyle = "#ffffff";
    context.font = "20px Arial";
    context.fillText(text, x, y);		
}

// função de atualização de ações
function update()
{
    // atualiza posicionamento da nave
    nave_x += Math.round(1 * nave_boost * (Math.sin(nave_heading*Math.PI/180)));
    nave_y += Math.round(-1 * nave_boost * (Math.cos(nave_heading*Math.PI/180)));


    // atualiza posicionamento dos asteroids do cinturao1
    for (var i in Cinturao1)
    {
        Cinturao1[i].x += Math.round(1 * (Math.sin(Cinturao1[i].heading*Math.PI/180)));
        Cinturao1[i].y += Math.round(-1 * (Math.cos(Cinturao1[i].heading*Math.PI/180)));
        if ((Cinturao1[i].x > canvas.width)||(Cinturao1[i].y > canvas.height))
        {
            Cinturao1[i].x = a1x + (i*(Math.floor(Math.random() * 100)));
            Cinturao1[i].y = a1y + (i*(Math.floor(Math.random() * 50)));
        }

        // detectar colisao entre asteroid e nave
        if ((Math.abs(nave_x - Cinturao1[i].x) < 10)&&(Math.abs(nave_y - Cinturao1[i].y) < 10))
        {
            //console.log('Colidiu');
            Colidiu = true;
        }
    }

    // atualiza trajetoria dos torpedos
    for (var i in Municao)
    {
        // trajetoria continua do torpedo disparado
        Municao[i].x += 2 * (Math.sin(Municao[i].heading*Math.PI/180));
        Municao[i].y += -2 * (Math.cos(Municao[i].heading*Math.PI/180));

        // detectar colisao torpedo e asteroid
        for (var j in Cinturao1)
        {
            if ((Math.abs(Municao[i].x - Cinturao1[j].x) < 10)&&(Math.abs(Municao[i].y - Cinturao1[j].y) < 10))
            {
                //console.log('Acertou');
                Pontos +=1;
                Municao[i].x = 810;
                Municao[i].y = 610;
                Cinturao1[j].x = 810;
                Cinturao1[j].y = 610;

            }            
        }

        // remover torpedo do array municao se saiu do canvas
        if ((Municao[i].x > canvas.width)||(Municao[i].y > canvas.height))
        {
            Municao.splice([i], 1);
        }
    }
        
    // padrao de asteroids atualiza a cada 10 pontos
    if ((Pontos > 0)&&((Pontos) % 10 == 0))
    {
        // alterar heading dos asteroids no cinturao1
        for (var i in Cinturao1)
        {
            Cinturao1[i].heading = 60*(Math.floor(Math.random() * 10));
        }
        Total = Total + Pontos;
        Pontos = 0;
    }
    
}

// criacao do primeiro cinturao de asteroids
var Cinturao1 = new Array();

for (var i = 0; i < 30; i++)
{
    Cinturao1.push(new Classe1(a1x + (i*(Math.floor(Math.random() * 100))),a1y + (i*(Math.floor(Math.random() * 50))),a1h));
}

// função de desenho
function draw()
{
    // função de limpeza de área retangular
    context.clearRect(0, 0, canvas.width, canvas.height);

    // testar flag colisao e posicionar nave
    if (Colidiu)
    {
        drawText(300, 290, "GAME OVER!! Total = "+ (Total+Pontos));
        Nave = RogueOne(canvas.width/2,canvas.height/2,nave_heading,"#000000");

    } else 
    {
        Nave = RogueOne(nave_x,nave_y,nave_heading,"#ffffff");
    }    

    // desenhar primeiro cinturao de asteroids
    for (var i in Cinturao1)
    {
        Cinturao1[i].draw();
    }

    for (var i in Municao)
    {
        Municao[i].draw();
    }

    drawText(5, 20, "Hits: " + (Total+Pontos));
    // para debug
    //drawText(5, 593, "x: " + nave_x);
    //drawText(75, 593, "y: " + nave_y);
    //drawText(150, 593, "boost: " + nave_boost);
    //drawText(250, 593, "heading: " + nave_heading);



}

// ciclo da aplicação
function loop()
{
    update();
    draw();
    setTimeout(loop, 30);
}

loop();