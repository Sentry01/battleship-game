(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(a){if(a.ep)return;a.ep=!0;const t=e(a);fetch(a.href,t)}})();class x{constructor(){this.gridSize=10,this.playerGrid=this.createEmptyGrid(),this.aiGrid=this.createEmptyGrid(),this.playerShips=this.initializeShips(),this.aiShips=this.initializeShips(),this.playerAttacks=this.createEmptyGrid(),this.aiAttacks=this.createEmptyGrid(),this.currentPlayer="player",this.gameOver=!1,this.winner=null}createEmptyGrid(){return Array(this.gridSize).fill(null).map(()=>Array(this.gridSize).fill(null))}initializeShips(){return[{name:"Carrier",size:5,hits:0,sunk:!1},{name:"Battleship",size:4,hits:0,sunk:!1},{name:"Cruiser",size:3,hits:0,sunk:!1},{name:"Submarine",size:3,hits:0,sunk:!1},{name:"Destroyer",size:2,hits:0,sunk:!1}]}isValidPlacement(i,e,s,a,t){if(t){if(a+e.size>this.gridSize)return!1;for(let r=0;r<e.size;r++)if(i[s][a+r]!==null)return!1}else{if(s+e.size>this.gridSize)return!1;for(let r=0;r<e.size;r++)if(i[s+r][a]!==null)return!1}return!0}placeShip(i,e,s,a,t){if(!this.isValidPlacement(i,e,s,a,t))return!1;for(let r=0;r<e.size;r++)t?i[s][a+r]=e.name:i[s+r][a]=e.name;return!0}placeAllShipsRandomly(i,e){for(const s of e){let a=!1,t=0;const r=100;for(;!a&&t<r;){const l=Math.floor(Math.random()*this.gridSize),n=Math.floor(Math.random()*this.gridSize),h=Math.random()<.5;this.placeShip(i,s,l,n,h)&&(a=!0),t++}if(!a)return!1}return!0}processAttack(i,e,s,a,t){if(t[i][e]!==null)return{success:!1,message:"Already attacked this position"};const r=a.find(l=>l.name===s[i][e]);return r?(r.hits++,t[i][e]="hit",r.hits>=r.size?(r.sunk=!0,{success:!0,hit:!0,sunk:r.name,message:`Hit! ${r.name} sunk!`}):{success:!0,hit:!0,message:"Hit!"}):(t[i][e]="miss",{success:!0,hit:!1,message:"Miss!"})}checkGameOver(){const i=this.playerShips.every(s=>s.sunk),e=this.aiShips.every(s=>s.sunk);return i?(this.gameOver=!0,this.winner="AI",!0):e?(this.gameOver=!0,this.winner="player",!0):!1}reset(){this.playerGrid=this.createEmptyGrid(),this.aiGrid=this.createEmptyGrid(),this.playerShips=this.initializeShips(),this.aiShips=this.initializeShips(),this.playerAttacks=this.createEmptyGrid(),this.aiAttacks=this.createEmptyGrid(),this.currentPlayer="player",this.gameOver=!1,this.winner=null}}class S{constructor(i="medium"){this.difficulty=i,this.previousHits=[],this.potentialTargets=[],this.shipOrientation={},this.currentTargetShip=null,this.remainingShips=[5,4,3,3,2]}getTarget(i,e){switch(this.difficulty){case"easy":return this.getEasyTarget(e);case"medium":return this.getMediumTarget(i,e);case"hard":return this.getHardTarget(i,e);default:return this.getMediumTarget(i,e)}}getEasyTarget(i){const e=this.getAvailableTargets(i);return e[Math.floor(Math.random()*e.length)]}getMediumTarget(i,e){if(this.potentialTargets.length>0){const a=this.potentialTargets.shift();if(this.isValidTarget(a.row,a.col,e))return a}const s=this.findAdjacentTargets(i,e);return s.length>0?s[Math.floor(Math.random()*s.length)]:this.getProbabilityTarget(e)}getHardTarget(i,e){if(this.potentialTargets.length>0){const a=this.potentialTargets.shift();if(this.isValidTarget(a.row,a.col,e))return a}const s=this.findAdjacentTargets(i,e);return s.length>0?this.getBestAdjacentTarget(s,i,e):this.getAdvancedProbabilityTarget(i,e)}getAvailableTargets(i){const e=[];for(let s=0;s<10;s++)for(let a=0;a<10;a++)i[s][a]===null&&e.push({row:s,col:a});return e}isValidTarget(i,e,s){return i>=0&&i<10&&e>=0&&e<10&&s[i][e]===null}findAdjacentTargets(i,e){const s=[];for(let t=0;t<10;t++)for(let r=0;r<10;r++)if(e[t][r]==="hit"){const l=[{row:t-1,col:r},{row:t+1,col:r},{row:t,col:r-1},{row:t,col:r+1}];for(const n of l)this.isValidTarget(n.row,n.col,e)&&s.push(n)}return s}getProbabilityTarget(i){const s=this.getAvailableTargets(i).map(t=>{let r=1;const l=Math.abs(t.row-4.5)+Math.abs(t.col-4.5);return r+=(9-l)*.5,(t.row+t.col)%2===0&&(r+=1),{...t,weight:r}});s.sort((t,r)=>r.weight-t.weight);const a=s.slice(0,3);return a[Math.floor(Math.random()*a.length)]}getAdvancedProbabilityTarget(i,e){const a=Array(10).fill(null).map(()=>Array(10).fill(0));for(let l=0;l<10;l++)for(let n=0;n<10;n++){if(e[l][n]!==null){a[l][n]=0;continue}for(const h of this.remainingShips){let c=!0;for(let o=0;o<h;o++)if(n+o>=10||e[l][n+o]!==null){c=!1;break}c&&(a[l][n]+=1);let d=!0;for(let o=0;o<h;o++)if(l+o>=10||e[l+o][n]!==null){d=!1;break}d&&(a[l][n]+=1)}}let t=0,r=[];for(let l=0;l<10;l++)for(let n=0;n<10;n++)a[l][n]>t?(t=a[l][n],r=[{row:l,col:n}]):a[l][n]===t&&r.push({row:l,col:n});return r[Math.floor(Math.random()*r.length)]}getBestAdjacentTarget(i,e,s){if(this.currentTargetShip&&this.shipOrientation[this.currentTargetShip]){const r=this.shipOrientation[this.currentTargetShip],l=this.previousHits[this.previousHits.length-1],n=i.filter(h=>r==="horizontal"?h.row===l.row:h.col===l.col);if(n.length>0)return n[Math.floor(Math.random()*n.length)]}const a=i.filter(r=>this.previousHits.filter(n=>n.row===r.row).length>0),t=i.filter(r=>this.previousHits.filter(n=>n.col===r.col).length>0);return a.length>0&&t.length>0?a.length>=t.length?a[Math.floor(Math.random()*a.length)]:t[Math.floor(Math.random()*t.length)]:a.length>0?a[Math.floor(Math.random()*a.length)]:t.length>0?t[Math.floor(Math.random()*t.length)]:i[Math.floor(Math.random()*i.length)]}recordHit(i,e){if(this.previousHits.push({row:i,col:e}),this.previousHits.length>=2){const t=this.previousHits[this.previousHits.length-1],r=this.previousHits[this.previousHits.length-2];t.row===r.row?(this.currentTargetShip||(this.currentTargetShip=`ship_${i}_${e}`),this.shipOrientation[this.currentTargetShip]="horizontal"):t.col===r.col&&(this.currentTargetShip||(this.currentTargetShip=`ship_${i}_${e}`),this.shipOrientation[this.currentTargetShip]="vertical")}const a=[{row:i-1,col:e},{row:i+1,col:e},{row:i,col:e-1},{row:i,col:e+1}].filter(t=>t.row>=0&&t.row<10&&t.col>=0&&t.col<10);this.potentialTargets.push(...a)}recordMiss(i,e){this.potentialTargets=this.potentialTargets.filter(s=>!(s.row===i&&s.col===e))}reset(){this.previousHits=[],this.potentialTargets=[],this.shipOrientation={},this.currentTargetShip=null,this.remainingShips=[5,4,3,3,2]}updateRemainingShips(i){const e=this.remainingShips.indexOf(i);e>-1&&this.remainingShips.splice(e,1),this.currentTargetShip=null}}class b{constructor(){this.gameState=new x,this.aiPlayer=new S("medium"),this.app=document.getElementById("app"),this.currentShipIndex=0,this.isHorizontal=!0,this.placementMode="random",this.init()}init(){this.render()}render(){this.app.innerHTML=`
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-white px-4 py-2 rounded-card">
        Skip to main content
      </a>
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main id="main-content" role="main">
            ${this.renderGameSetup()}
          </main>
        </div>
      </div>
    `,this.attachEventListeners()}renderGameSetup(){return`
      <div class="card p-10 rounded-card animate-slide-in glow-effect" role="region" aria-label="Game setup">
        <h2 class="text-4xl font-bold mb-8 text-gradient" id="setup-title">Game Setup</h2>

        <div class="mb-8">
          <label for="difficulty" class="block text-white font-semibold mb-3 text-lg" id="difficulty-label">AI Difficulty</label>
          <select id="difficulty" class="w-full p-4 rounded-card focus:outline-none transition-all text-lg" aria-labelledby="difficulty-label" aria-describedby="difficulty-description">
            <option value="easy">Easy - Random targeting</option>
            <option value="medium" selected>Medium - Basic strategy</option>
            <option value="hard">Hard - Advanced probability targeting</option>
          </select>
          <p id="difficulty-description" class="text-white/60 text-sm mt-2">Choose how smart the AI opponent should be</p>
        </div>

        <div class="mb-8">
          <span class="block text-white font-semibold mb-3 text-lg" id="placement-label">Ship Placement</span>
          <div class="flex gap-4" role="radiogroup" aria-labelledby="placement-label">
            <button id="randomPlacement" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-semibold text-lg" aria-pressed="false">
              🎲 Random Placement
            </button>
            <button id="manualPlacement" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg" aria-pressed="false">
              🎯 Manual Placement
            </button>
          </div>
        </div>

        <button id="startGame" class="w-full btn-primary text-white py-5 px-6 rounded-card font-bold text-xl" aria-describedby="start-hint">
          🚀 Start Game
        </button>
        <p id="start-hint" class="text-white/60 text-sm mt-2 text-center">Choose placement option first</p>
      </div>
    `}renderGameBoard(){const i=this.gameState.gameOver;return`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" id="gameBoard">
        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🚢 Your Fleet</h2>
          ${this.renderGrid(this.gameState.playerGrid,"player")}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>Your ships: ${this.gameState.playerShips.filter(s=>!s.sunk).length}/5 remaining</p>
          </div>
        </section>

        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🤖 AI Fleet${i?" (Revealed)":""}</h2>
          ${this.renderGrid(this.gameState.playerAttacks,"ai",i)}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>AI ships: ${this.gameState.aiShips.filter(s=>!s.sunk).length}/5 remaining</p>
          </div>
        </section>
      </div>

      <div class="mt-8 status-bar p-6 rounded-card">
        <p id="gameStatus" class="text-center text-xl font-semibold">
          ${this.gameState.gameOver?"Game Over":this.gameState.currentPlayer==="player"?"Your turn - Click on AI grid to attack":"AI is thinking..."}
        </p>
      </div>

      <div class="mt-6 flex gap-4">
        <button id="restartGame" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg">
          🔄 New Game
        </button>
        <button id="backToSetup" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold text-lg">
          ⚙️ Back to Setup
        </button>
      </div>
    `}updateGameBoard(){const i=document.getElementById("gameBoard");if(i){const e=this.gameState.gameOver;i.innerHTML=`
        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🚢 Your Fleet</h2>
          ${this.renderGrid(this.gameState.playerGrid,"player")}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>Your ships: ${this.gameState.playerShips.filter(s=>!s.sunk).length}/5 remaining</p>
          </div>
        </section>

        <section class="card p-6 rounded-card game-board-container">
          <h2 class="text-3xl font-bold mb-4 text-gradient">🤖 AI Fleet${e?" (Revealed)":""}</h2>
          ${this.renderGrid(this.gameState.playerAttacks,"ai",e)}
          <div class="mt-4 text-lg font-medium text-white/90">
            <p>AI ships: ${this.gameState.aiShips.filter(s=>!s.sunk).length}/5 remaining</p>
          </div>
        </section>
      `,this.attachEventListeners()}}renderGrid(i,e,s=!1){const a=e==="player"?this.gameState.aiAttacks:this.gameState.playerAttacks,t=e==="player"?this.gameState.playerShips:this.gameState.aiShips,r=e==="player"?this.gameState.playerGrid:this.gameState.aiGrid;return`<div class="grid grid-cols-10 gap-2 mx-auto" style="max-width: 480px;">${i.map((n,h)=>n.map((c,d)=>{let o="grid-cell w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-sm font-semibold cursor-pointer rounded-md",m="";const y="0";let u=`Cell ${h}, ${d}`;if(e==="player"){if(a[h][d]==="hit")o+=" hit",m="✕",u+=" - Hit by AI";else if(a[h][d]==="miss")o+=" miss",m="○",u+=" - Missed by AI";else if(c){const p=t.find(f=>f.name===c);p&&p.sunk?o+=" ship-sunk":o+=" ship",m=c[0],u+=` - ${c}`}}else if(c==="hit")o+=" hit",m="✕",u+=" - Hit";else if(c==="miss")o+=" miss",m="○",u+=" - Miss";else if(s&&r[h][d]){const p=t.find(f=>f.name===r[h][d]);p&&p.sunk?o+=" ship-sunk":o+=" ship",m=r[h][d][0],u+=` - ${r[h][d]}`}return`<div class="${o}" data-row="${h}" data-col="${d}" data-type="${e==="ai"?"attack":"player"}" tabindex="${y}" role="button" aria-label="${u}">${m}</div>`}).join("")).join("")}</div>`}renderGameOver(){const i=this.gameState.winner;return`
      <div class="card p-10 rounded-card text-center animate-slide-in glow-effect">
        <h2 class="text-5xl font-bold ${i==="player"?"text-gradient":"text-white"} mb-4">${i==="player"?"🎉 You Win!":"💥 AI Wins!"}</h2>
        <p class="text-white/80 text-xl mb-8">Game Over</p>

        <div class="flex gap-4">
          <button id="playAgain" class="flex-1 btn-primary text-white py-4 px-6 rounded-card font-bold text-lg">
            🔄 Play Again
          </button>
          <button id="backToSetupGameOver" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-bold text-lg">
            ⚙️ Back to Setup
          </button>
        </div>
      </div>
    `}attachEventListeners(){const i=document.getElementById("difficulty"),e=document.getElementById("randomPlacement"),s=document.getElementById("manualPlacement"),a=document.getElementById("startGame");i&&i.addEventListener("change",t=>{this.aiPlayer=new S(t.target.value)}),e&&e.addEventListener("click",()=>{this.placementMode="random",e.setAttribute("aria-pressed","true"),s&&s.setAttribute("aria-pressed","false")}),s&&s.addEventListener("click",()=>{this.placementMode="manual",s.setAttribute("aria-pressed","true"),e&&e.setAttribute("aria-pressed","false")}),a&&a.addEventListener("click",()=>{s&&s.getAttribute("aria-pressed")==="true"?this.startManualPlacement():this.startGame()}),document.addEventListener("click",t=>{t.target.classList.contains("grid-cell")&&t.target.dataset.type==="attack"?this.handlePlayerAttack(parseInt(t.target.dataset.row),parseInt(t.target.dataset.col)):t.target.classList.contains("grid-cell")&&t.target.dataset.type==="placement"&&this.handlePlacementClick(parseInt(t.target.dataset.row),parseInt(t.target.dataset.col))}),document.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.target.classList.contains("grid-cell")&&t.target.dataset.type==="attack"?(t.preventDefault(),this.handlePlayerAttack(parseInt(t.target.dataset.row),parseInt(t.target.dataset.col))):t.target.classList.contains("grid-cell")&&t.target.dataset.type==="placement"&&(t.preventDefault(),this.handlePlacementClick(parseInt(t.target.dataset.row),parseInt(t.target.dataset.col))))}),document.addEventListener("click",t=>{if(t.target.id==="restartGame")this.gameState.reset(),this.aiPlayer.reset(),this.setupRandomGame(),this.startGame();else if(t.target.id==="backToSetup"||t.target.id==="backToSetupGameOver"||t.target.id==="backToSetupFromManual")this.gameState.reset(),this.aiPlayer.reset(),this.render();else if(t.target.id==="playAgain")this.gameState.reset(),this.aiPlayer.reset(),this.setupRandomGame(),this.startGame();else if(t.target.id==="rotateShip")this.isHorizontal=!this.isHorizontal,this.app.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-6xl w-full">
              <header class="text-center mb-8">
                <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
                <p class="text-xl text-white/80">Test your strategy against AI</p>
              </header>

              ${this.renderManualPlacement()}
            </div>
          </div>
        `,this.attachEventListeners();else if(t.target.id==="autoPlace"){for(let r=this.currentShipIndex;r<this.gameState.playerShips.length;r++){const l=this.gameState.playerShips[r];let n=!1,h=0;const c=100;for(;!n&&h<c;){const d=Math.floor(Math.random()*10),o=Math.floor(Math.random()*10),m=Math.random()<.5;this.gameState.placeShip(this.gameState.playerGrid,l,d,o,m)&&(n=!0),h++}if(!n){const d=document.querySelector(".card");if(d){const o=document.createElement("div");o.className="mt-4 p-4 bg-error/20 border border-error rounded-card text-error animate-fade-in",o.setAttribute("role","alert"),o.textContent="Failed to auto-place ships. Please try manual placement.",d.appendChild(o),setTimeout(()=>o.remove(),3e3)}return}}this.gameState.placeAllShipsRandomly(this.gameState.aiGrid,this.gameState.aiShips),this.startGame(!0)}})}setupRandomGame(){this.currentShipIndex=0,this.isHorizontal=!0;const i=this.gameState.placeAllShipsRandomly(this.gameState.playerGrid,this.gameState.playerShips),e=this.gameState.placeAllShipsRandomly(this.gameState.aiGrid,this.gameState.aiShips);if(!i||!e){const s=document.querySelector(".card");if(s){const a=document.createElement("div");a.className="mt-4 p-4 bg-error/20 border border-error rounded-card text-error animate-fade-in",a.setAttribute("role","alert"),a.textContent="Failed to place ships randomly. Please try again.",s.appendChild(a),setTimeout(()=>a.remove(),3e3)}return!1}return!0}startGame(i=!1){!i&&!this.setupRandomGame()||(this.gameState.currentPlayer="player",this.app.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderGameBoard()}
          </main>
        </div>
      </div>
    `,this.attachEventListeners())}handlePlayerAttack(i,e){if(this.gameState.currentPlayer!=="player"||this.gameState.gameOver)return;this.updateGameStatus("Processing attack...");const s=this.gameState.processAttack(i,e,this.gameState.aiGrid,this.gameState.aiShips,this.gameState.playerAttacks);if(!s.success){this.updateGameStatus(s.message);return}if(s.hit){if(this.aiPlayer.recordHit(i,e),s.sunk){const a=this.gameState.aiShips.find(t=>t.name===s.sunk);a&&this.aiPlayer.updateRemainingShips(a.size)}}else this.aiPlayer.recordMiss(i,e);if(this.updateGameStatus(s.message),this.updateGameBoard(),this.gameState.checkGameOver()){this.renderGameOverScreen();return}this.gameState.currentPlayer="ai",this.updateGameStatus("AI is thinking..."),setTimeout(()=>{this.handleAITurn()},1e3)}handleAITurn(){if(this.gameState.gameOver)return;const i=this.aiPlayer.getTarget(this.gameState.playerGrid,this.gameState.aiAttacks),e=this.gameState.processAttack(i.row,i.col,this.gameState.playerGrid,this.gameState.playerShips,this.gameState.aiAttacks);if(e.hit?this.aiPlayer.recordHit(i.row,i.col):this.aiPlayer.recordMiss(i.row,i.col),this.updateGameStatus(`AI attacks: ${e.message}`),this.updateGameBoard(),this.gameState.checkGameOver()){this.renderGameOverScreen();return}this.gameState.currentPlayer="player",this.updateGameStatus("Your turn - Click on AI grid to attack")}updateGameStatus(i){const e=document.getElementById("gameStatus");e&&(e.textContent=i)}renderGameOverScreen(){this.app.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderGameOver()}
          </main>
        </div>
      </div>
    `,this.attachEventListeners()}startManualPlacement(){this.currentShipIndex=0,this.isHorizontal=!0,this.gameState.playerGrid=this.gameState.createEmptyGrid(),this.gameState.playerShips=this.gameState.initializeShips(),this.app.innerHTML=`
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="max-w-6xl w-full">
          <header class="text-center mb-8">
            <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
            <p class="text-xl text-white/80">Test your strategy against AI</p>
          </header>

          <main>
            ${this.renderManualPlacement()}
          </main>
        </div>
      </div>
    `,this.attachEventListeners()}renderManualPlacement(){const i=this.gameState.playerShips[this.currentShipIndex],e=this.currentShipIndex,s=this.gameState.playerShips.length;return`
      <div class="card p-8 rounded-card animate-slide-in glow-effect">
        <h2 class="text-4xl font-bold mb-6 text-gradient">Place Your Ships</h2>

        <div class="mb-6 text-center">
          <p class="text-white text-lg mb-2">
            Placing: <span class="font-bold text-gradient">${i.name}</span> (Size: ${i.size})
          </p>
          <p class="text-white/70 text-sm">Progress: ${e}/${s} ships placed</p>
        </div>

        <div class="mb-6 flex justify-center gap-4">
          <button id="rotateShip" class="btn-secondary text-white py-3 px-6 rounded-card font-semibold">
            🔄 Rotate (Current: ${this.isHorizontal?"Horizontal":"Vertical"})
          </button>
          <button id="autoPlace" class="btn-secondary text-white py-3 px-6 rounded-card font-semibold">
            ⚡ Auto-Place Remaining
          </button>
        </div>

        <div class="mb-6">
          ${this.renderPlacementGrid()}
        </div>

        <div class="mt-6 flex gap-4">
          <button id="backToSetupFromManual" class="flex-1 btn-secondary text-white py-4 px-6 rounded-card font-semibold">
            ⚙️ Back to Setup
          </button>
        </div>
      </div>
    `}renderPlacementGrid(){const i=this.gameState.playerShips[this.currentShipIndex];return`<div class="grid grid-cols-10 gap-2 mx-auto" style="max-width: 480px;">${this.gameState.playerGrid.map((s,a)=>s.map((t,r)=>{let l="grid-cell w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-sm font-semibold cursor-pointer rounded-md",n="",h=`Cell ${a}, ${r}`;return t&&(l+=" ship",n=t[0],h+=` - ${t}`),this.canPlaceShipAt(a,r,i,this.isHorizontal).valid&&!t?l+=" bg-green-500/30 border-green-400":t||(l+=" hover:bg-white/10"),`<div class="${l}" data-row="${a}" data-col="${r}" data-type="placement" tabindex="0" role="button" aria-label="${h}">${n}</div>`}).join("")).join("")}</div>`}canPlaceShipAt(i,e,s,a){if(a){if(e+s.size>10)return{valid:!1};for(let t=0;t<s.size;t++)if(this.gameState.playerGrid[i][e+t]!==null)return{valid:!1}}else{if(i+s.size>10)return{valid:!1};for(let t=0;t<s.size;t++)if(this.gameState.playerGrid[i+t][e]!==null)return{valid:!1}}return{valid:!0}}handlePlacementClick(i,e){const s=this.gameState.playerShips[this.currentShipIndex];this.gameState.placeShip(this.gameState.playerGrid,s,i,e,this.isHorizontal)&&(this.currentShipIndex++,this.currentShipIndex>=this.gameState.playerShips.length?(this.gameState.placeAllShipsRandomly(this.gameState.aiGrid,this.gameState.aiShips),this.startGame(!0)):(this.app.innerHTML=`
          <div class="min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-6xl w-full">
              <header class="text-center mb-8">
                <h1 class="text-5xl font-bold mb-3 text-gradient">⚓ Battleship</h1>
                <p class="text-xl text-white/80">Test your strategy against AI</p>
              </header>

              ${this.renderManualPlacement()}
            </div>
          </div>
        `,this.attachEventListeners()))}}document.addEventListener("DOMContentLoaded",()=>{new b});
