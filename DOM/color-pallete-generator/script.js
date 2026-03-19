const format = document.getElementById("format");
const tone = document.getElementById("tone");
const pallete = document.getElementById("pallete");
const generateBtn = document.getElementById("generate");
const palleteContainer = document.querySelector(".pallete");


function randomRGB(tone) {
    let min = 0;
    let max = 255;

    if (tone === "light") {
        min = 150;
        max = 255;
    }

    if (tone === "dark") {
        min = 0;
        max = 0;
    }

    const r = Math.floor(Math.random() * (max - min + 1) + min);
    const g = Math.floor(Math.random() * (max - min + 1) + min);
    const b = Math.floor(Math.random() * (max - min + 1) + min);

    return { r, g, b };

}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("copy to clipboard");
}


function generatePallete() {

    palleteContainer.innerHTML = "";

    for (let i = 0; i < 15; i++) {
        const { r, g, b } = randomRGB(tone.value);
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        colorBox.innerHTML = `<span>${rgbToHex(r, g, b)}</span>`;
        colorBox.addEventListener("click", function () {
            // palleteContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            copyToClipboard(rgbToHex(r, g, b));
        });
        palleteContainer.appendChild(colorBox);
    }

}



generateBtn.addEventListener("click", generatePallete);

generatePallete()