window.onload = () => {
  let pianoContainer = document.getElementsByClassName("container")[0];
  const base = "./audio/";
  const keyMap = {
    'KeyA': 11, 'KeyW': 1, 'KeyS': 12, 'KeyE': 2, 'KeyD': 13,
    'KeyF': 14, 'KeyT': 3, 'KeyG': 15, 'KeyY': 4, 'KeyH': 16,
    'KeyU': 5, 'KeyJ': 17, 'KeyK': 18, 'KeyO': 6, 'KeyL': 19,
    'KeyP': 7, 'Semicolon': 20, 'Quote': 21, 'BracketRight': 8
     
  };

  const sustainButton = document.createElement("button");
  sustainButton.textContent = "Sustain Off";
  sustainButton.style.position = "fixed";
  sustainButton.style.top = "10px";
  sustainButton.style.right = "10px";
  document.body.appendChild(sustainButton);

  let sustainEnabled = false;
  sustainButton.onclick = () => {
    sustainEnabled = !sustainEnabled;
    sustainButton.textContent = sustainEnabled ? "Sustain On" : "Sustain Off";
  };

  const keysCurrentlyPressed = {};

  for (let index = 1; index <= 24; index++) {
    let div = document.createElement("div");
    div.classList.add("key", index <= 10 ? "black-key" : "white-key");
    const number = index <= 9 ? "0" + index : index;
    div.dataset.note = `key${number}.mp3`;

    div.addEventListener("mousedown", () => {
      playSound(index);
      div.classList.add("hover-effect");
    });

    div.addEventListener("mouseup", () => {
      div.classList.remove("hover-effect");
    });

    div.addEventListener("mouseleave", () => {
      div.classList.remove("hover-effect");
    });

    pianoContainer.appendChild(div);
  }

  function playSound(index) {
    const note = pianoContainer.children[index - 1].dataset.note;
    const audio = new Audio(`${base}${note}`);
    audio.playbackRate = sustainEnabled ? 1 : 7;
    audio.play();
  }

  document.addEventListener('keydown', (event) => {
    const keyIndex = keyMap[event.code];
    if (keyIndex && !keysCurrentlyPressed[keyIndex]) {
      keysCurrentlyPressed[keyIndex] = true;
      playSound(keyIndex);
      pianoContainer.children[keyIndex - 1].classList.add("hover-effect");
    }
  });

  document.addEventListener('keyup', (event) => {
    const keyIndex = keyMap[event.code];
    if (keyIndex) {
      keysCurrentlyPressed[keyIndex] = false;
      pianoContainer.children[keyIndex - 1].classList.remove("hover-effect");
    }
  });
};
