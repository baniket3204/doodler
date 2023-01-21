document.addEventListener("DOMContentLoaded" , () =>
{
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerbottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId
  let rightTimerId
  let score = 0

  function createDoodler(){
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerbottomSpace + 'px';
  }
  
  class Platform {
   constructor(newPlatBottom){
    this.bottom = newPlatBottom
    this.left = Math.random() * 315  // generates number from 1 to 315 doing because our platform width is 85 And GRID WIDTH IS 400 SO 400 - 85 
    this.visual = document.createElement("div")
    
    
    const visual = this.visual
    visual.classList.add('platform')
    visual.style.left =  this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
   }
  }
 

  function createPlatforms(){
   for(let i=0 ;i<5; i++)
   {
     let platGap = 600 / platformCount;
     let newPlatBottom = 100 + (i * platGap);
     let newPlatform = new Platform(newPlatBottom);
     platforms.push(newPlatform); 
   }
  }

  function moveplatforms(){
   if(doodlerbottomSpace > 200){
    platforms.forEach(platform => {
        platform.bottom = platform.bottom - 4;
        let visual = platform.visual
        visual.style.bottom = platform.bottom + 'px'

       if(platform.bottom < 10)
       {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove('platform');
        platforms.shift();
        score++;
        let newPlatform = new Platform(600);
        platforms.push(newPlatform)
       }

    })
   }
  }

  function jump(){
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval( function(){
    doodlerbottomSpace = doodlerbottomSpace + 20;
    doodler.style.bottom = doodlerbottomSpace + 'px';
    if(doodlerbottomSpace > startPoint + 200)
    {
      fall();
    }
    } , 30)
  }

  function fall(){
    clearInterval(upTimerId);
    isJumping = false
    downTimerId = setInterval( function(){
      doodlerbottomSpace = doodlerbottomSpace - 5;
      doodler.style.bottom = doodlerbottomSpace + 'px';
      if(doodlerbottomSpace <= 0 )
      {
        gameOver()
      }
      platforms.forEach(platform => {
       if(
         (doodlerbottomSpace >= platform.bottom) &&
         (doodlerbottomSpace <= platform.bottom + 15) &&
         (doodlerLeftSpace + 60 >= platform.left) &&
         (doodlerLeftSpace <= platform.left + 85) &&
         !isJumping
       )
       {
        doodlerbottomSpace = startPoint
        console.log("landed")
        jump()
       }
       

      })

    } , 30)
  }

  function gameOver(){
    console.log("game over")
    isGameOver = true;
    while(grid.firstChild){
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score
    clearInterval(downTimerId)
    clearInterval(upTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }
 
  function control(e){
    if(e.key === "ArrowLeft") {moveLeft()}
    else if(e.key === "ArrowRight") { moveRight()}
    else if(e.key === "ArrowUp") { moveUp()}
  }

   function moveLeft(){
    if(isGoingRight)
    {
      clearInterval(rightTimerId)
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval( function() {
       if(doodlerLeftSpace >= 0)
       {
        doodlerLeftSpace = doodlerLeftSpace - 5
        doodler.style.left = doodlerLeftSpace + 'px'
       }
       else { moveRight()}
  },30 )
  }

  function moveRight(){
    if(isGoingLeft)
    {
      clearInterval(leftTimerId)
      isGoingLeft = false  

    }
    isGoingRight = true;
    rightTimerId = setInterval( function() {
     if(doodlerLeftSpace <= 340)
     {
       doodlerLeftSpace = doodlerLeftSpace + 5;
       doodler.style.left = doodlerLeftSpace + "px";
     } else moveLeft();

    } , 30)
  }

  function moveUp(){
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }
  
  function start()
  {
    if(!isGameOver)
    {
        createPlatforms();
        createDoodler();
        setInterval(moveplatforms , 30);
        jump();
        document.addEventListener("keyup" , control)
    }

  }
  
  start()
})