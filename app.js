
 
 const date = new Date();
 
 function getFormattedDate() {
     const today = new Date();
     const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
     return today.toLocaleDateString('en-US', options).replace(/,/g, '').trim();
 }
 async function isRealWord(word) {
     const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
     if (response.ok) {
         const data = await response.json();
         return data && data.length > 0;
     } else {
         return false;
     }
 }
 
 async function fetchCSV(url) {
     try {
         // Append a timestamp to the URL to force the browser to fetch a fresh version
         const cacheBuster = new Date().getTime(); // Unique timestamp
         const response = await fetch(`${url}?_=${cacheBuster}`);
         const data = await response.text();
         return data;
     } catch (error) {
         console.error("Error fetching CSV:", error);
         return null;
     }
 }
 async function processCSV() {
     const doc = await fetchCSV('nothingToSeeHere.csv');
     if (!doc) {
         console.error("CSV data could not be retrieved.");
         return;
     }



     const word = findFirstMatchingItem(doc);
     return word ? word.split('') : [];


 }
 
 async function initGame() {
     letter = await processCSV(); // Wait for processCSV() to finish
 }

 initGame(); // Run it asynchronously
 selectedRow = 1;
 const runLetter = async (letter) => {
     if (letter == "Enter") {
         const fullElements = document.getElementsByClassName("full");

         // Ensure the word is exactly 5 letters long
         if (fullElements.length !== 5) {
             alert("Please fill in all the letters");
             // Stop execution
         } else {
             // Convert HTMLCollection to a string
             const word = Array.from(document.getElementById(`row${selectedRow}`).children).map(el => el.innerHTML).join("");

             // Check if it's a real word
             const isValid = await isRealWord(word);

             if (isValid) {
                 checkSubmission(); // Proceed if it's a valid word
             } else {
                 alert("Not a valid word, try again!");
             }
         }
     } else if (/^[a-zA-Z]$/.test(letter)) {
         document.getElementById(`${selectedRow}current-key`).innerHTML = letter;
 
         if (document.getElementById(`${selectedRow}current-key`) != null) {
             og = document.getElementById(`${selectedRow}current-key`);
             //("Set innerhtml");
             document.getElementById(`${selectedRow}current-key`).innerHTML = letter.toUpperCase();
             //("Set innerhtml");
             document.getElementById(`${selectedRow}current-key`).id = "HELLO";
             //("Changed id");
 
             if (og.nextElementSibling.id != "last") {
                 og.nextElementSibling.id = `${selectedRow}current-key`;
                 //("Set next child");
             } else {
                 og.nextElementSibling.id = `${selectedRow}current-key`;
             }
             document.getElementById("HELLO").className = "full";
             document.getElementById("HELLO").removeAttribute("id");
             //("Removed id");
             //(`Key pressed: ${event.key}`);
 
         }
     } else if (letter == "Backspace") {
 
 
 
         if(document.getElementById(`HELLO`) != null){
         currentActive= document.getElementById(`HELLO`);
         currentActive.innerHTML = "";
         currentActive.id = `${selectedRow}current-key`;
         // currentActive.removeAttribute("id");
         }
         else{
         currentActive = document.getElementById(`${selectedRow}current-key`);
 
         currentActive.previousElementSibling.innerHTML = "";
         currentActive.previousElementSibling.id = `${selectedRow}current-key`;
         currentActive.removeAttribute("id");
         }
 
 
     };
 }
 
 
 document.addEventListener("keydown", async function(event) {
     runLetter(event.key);
     // Convert HTMLCollection to an array and extract text content
 }
 
 );
 
 const checkSubmission = async () => {
     document.getElementById('HELLO').className = "full";
     var els = document.getElementsByClassName('full'),
         i = els.length;
     while (i--) {
         els[i].className = 'COMPLETED';
     }
 
     count = 0;
     var list = document.getElementById(`row${selectedRow}`).children,
         h = list.length;
 
     var hasBeen = [false, false, false, false, false];
 
     for (let i = 0; i < h; i++) {
         let activeChoice = list[i].innerHTML;
 
         let newColor;
         if (!letter.includes(activeChoice)) {
             newColor = "rgba(0, 0, 0, 0.29)"; // WRONG
 
             await sleep(200);
             document.getElementById(activeChoice.toLocaleLowerCase()).className = "key k-wrong"
         } else if (letter[i] == activeChoice) {
             newColor = "rgb(20, 50, 120)"; // CORRECT
             await sleep(200);
             document.getElementById(activeChoice.toLocaleLowerCase()).className = "key k-correct"
             count++;
         } else if (activeChoice != list[letter.indexOf(activeChoice)].innerHTML && !hasBeen[letter.indexOf(activeChoice)]) {
             newColor = "rgba(70, 120, 180, 0.655)"; // CLOSE
             await sleep(200);
             document.getElementById(activeChoice.toLocaleLowerCase()).className = "key k-close"
             hasBeen[letter.indexOf(activeChoice)] = true;
         } else {
             newColor = "rgba(0, 0, 0, 0.29)"; // WRONG
 
         }
 
         // Set CSS variable for background color change
         list[i].style.setProperty("--new-bg", newColor);
 
 
         // Add flip animation
         list[i].classList.add("flip");
 
         await sleep(100); // Wait for the flip to progress before moving to the next tile
     }
 
     document.getElementById("HELLO").id = "";
     selectedRow++;
 
     if (count == 5) {
         win();
     }
 };
 
 function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }
 
 function launchConfetti() {
     const canvas = document.createElement("canvas");
     document.body.appendChild(canvas);
     const ctx = canvas.getContext("2d");
 
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
     canvas.style.position = "fixed";
     canvas.style.top = "0";
     canvas.style.left = "0";
     canvas.style.pointerEvents = "none"; // Prevents interaction issues
 
     let confettiParticles = [];
 
     function createConfettiParticles(count) {
         for (let i = 0; i < count; i++) {
             confettiParticles.push({
                 x: Math.random() * canvas.width,
                 y: Math.random() * canvas.height - canvas.height,
                 size: Math.random() * 8 + 2, // Confetti size between 2px-10px
                 color: `hsl(${Math.random() * 360}, 100%, 70%)`, // Random colors
                 velocityX: (Math.random() - 0.5) * 4, // Horizontal movement
                 velocityY: Math.random() * 5 + 2, // Vertical speed
                 rotation: Math.random() * 360,
                 rotationSpeed: Math.random() * 10,
             });
         }
     }
 
     function updateConfetti() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
 
         confettiParticles.forEach((p, index) => {
             p.x += p.velocityX;
             p.y += p.velocityY;
             p.rotation += p.rotationSpeed;
 
             // Remove confetti that falls off screen
             if (p.y > canvas.height) {
                 confettiParticles.splice(index, 1);
             }
 
             // Draw confetti as rotated rectangles
             ctx.save();
             ctx.translate(p.x, p.y);
             ctx.rotate((p.rotation * Math.PI) / 180);
             ctx.fillStyle = p.color;
             ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
             ctx.restore();
         });
 
         if (confettiParticles.length > 0) {
             requestAnimationFrame(updateConfetti);
         } else {
             setTimeout(() => canvas.remove(), 500); // Remove canvas when done
         }
     }
 
     createConfettiParticles(1000); // Number of confetti particles
     updateConfetti();
 
     // Stop confetti after 3 seconds to prevent performance issues
     setTimeout(() => (confettiParticles = []), 10000);
 }
 async function win() {
     await sleep(50);
     alert("You win!");
     document.getElementById(`${selectedRow}current-key`).id = "NOTHING";
     await sleep(100);
     launchConfetti();
     // alert("You win!");
     
 }