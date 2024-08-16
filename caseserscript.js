const modeToggle = document.getElementById("mode-toggle");
const encryptFields = document.getElementById("encrypt-fields");
const decryptFields = document.getElementById("decrypt-fields");
const processButton = document.getElementById("process");
const resultContainer = document.getElementById("result-container");
const resultDisplay = document.getElementById("result");
const privateKeyContainer = document.getElementById("private-key-container");
const revealShiftKey = document.getElementById("reveal-shift-key");
const privateKeyDisplay = document.getElementById("private-key");

modeToggle.addEventListener("change", function () {
  if (this.checked) {
    encryptFields.style.display = "none";
    decryptFields.style.display = "block";
    processButton.textContent = "Decrypt";
    privateKeyContainer.style.display = "none";
  } else {
    encryptFields.style.display = "block";
    decryptFields.style.display = "none";
    processButton.textContent = "Encrypt";
  }
});

processButton.addEventListener("click", function () {
  const mode = modeToggle.checked ? "Decrypted" : "Encrypted";
  if (mode === "Encrypted") {
    let shift = parseInt(document.getElementById("shiftEncrypt").value);
    let plaintext = document.getElementById("plaintext").value.toUpperCase();
    let x = [];

    for (let i = 0; i < plaintext.length; i++) {
      if (plaintext[i] === " ") {
        x.push(" ");
      } else {
        let ascii = plaintext[i].charCodeAt(0) - 65;
        let shiftedAscii = (ascii + shift) % 26;
        x.push(String.fromCharCode(shiftedAscii + 65));
      }
    }
    resultDisplay.textContent = `Encrypted result: ${x.join("")}`;
    privateKeyDisplay.textContent = `Private key (d): ${shift}`;
  } else if (mode === "Decrypted") {
    let shift = parseInt(document.getElementById("shiftDecrypt").value);
    let ciphertext = document.getElementById("ciphertext").value.toUpperCase();
    let x = [];

    for (let i = 0; i < ciphertext.length; i++) {
      if (ciphertext[i] === " ") {
        x.push(" ");
      } else {
        let ascii = ciphertext[i].charCodeAt(0) - 65;
        let shiftedAscii = (ascii - shift + 26) % 26;
        x.push(String.fromCharCode(shiftedAscii + 65));
      }
    }

    resultDisplay.textContent = `Decrypted result: ${x.join("")}`;
  }

  resultContainer.style.display = "block";

  if (!modeToggle.checked) {
    // Encryption mode
    privateKeyContainer.style.display = "block";
    privateKeyDisplay.style.display = "none";
    revealShiftKey.textContent = "Reveal Private Key";
  } else {
    privateKeyContainer.style.display = "none";
  }
});

revealShiftKey.addEventListener("click", function () {
  if (privateKeyDisplay.style.display === "none") {
    privateKeyDisplay.style.display = "block";
    this.textContent = "Hide Private Key And Modulus";
  } else {
    privateKeyDisplay.style.display = "none";
    this.textContent = "Reveal Private Key (d) and Modulus (n)";
  }
});

document.getElementById("reset").addEventListener("click", function () {
  document.querySelectorAll("input, textarea").forEach((el) => (el.value = ""));
  resultContainer.style.display = "none";
  privateKeyContainer.style.display = "none";
});