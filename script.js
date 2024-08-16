const modeToggle = document.getElementById("mode-toggle");
const encryptFields = document.getElementById("encrypt-fields");
const decryptFields = document.getElementById("decrypt-fields");
const processButton = document.getElementById("process");
const resultContainer = document.getElementById("result-container");
const resultDisplay = document.getElementById("result");
const privateKeyContainer = document.getElementById("private-key-container");
const revealDAndNButton = document.getElementById("reveal-d");
const privateKeyDisplay = document.getElementById("private-key");
const modulusDisplay = document.getElementById("modulus");

function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % modulus;
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

function extendedGCD(a, b) {
  if (b === 0n) {
    return { gcd: a, x: 1n, y: 0n };
  }
  let { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);
  let x = y1;
  let y = x1 - (a / b) * y1;
  return { gcd, x, y };
}

function findD(p, q, e) {
  let phi = (p - 1n) * (q - 1n);
  let { gcd, x } = extendedGCD(e, phi);
  if (gcd !== 1n) {
    throw new Error(
      "The modular inverse does not exist, e and phi(n) must be coprime."
    );
  }
  return ((x % phi) + phi) % phi;
}

function convertToNumericString(text) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => String(char.charCodeAt(0) - 65).padStart(2, "0"))
    .join("");
}

function convertFromNumericString(numericString) {
  let text = "";
  for (let i = 0; i < numericString.length; i += 2) {
    let charCode = parseInt(numericString.substr(i, 2)) + 65;
    text += String.fromCharCode(charCode);
  }
  return text;
}

function chunkString(str, chunkSize) {
  let chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.substring(i, i + chunkSize));
  }
  return chunks;
}

function getBlockSize(n) {
  let bitLength = n.toString(2).length;
  return Math.floor((bitLength - 1) / 8) * 2;
}

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
    let p = BigInt(document.getElementById("p").value);
    let q = BigInt(document.getElementById("q").value);
    let e = BigInt(document.getElementById("e").value);
    let plaintext = document.getElementById("plaintext").value;
    let n = p * q;
    let d = findD(p, q, e);
    console.log(`p: ${p}, q: ${q}, e: ${e}, n: ${n}, d: ${d}`);

    let numericString = convertToNumericString(plaintext);
    console.log(`Plaintext: ${plaintext}, Numeric String: ${numericString}`);

    let blockSize = getBlockSize(n);
    let chunks = chunkString(numericString, blockSize);
    console.log(`Chunks: ${chunks}`);

    let encrypted = chunks.map((chunk) => {
      let encryptedChunk = modPow(BigInt(chunk), e, n).toString();
      console.log(`Original Chunk: ${chunk}`);
      console.log(
        `Encrypted Chunk: ${encryptedChunk.padStart(blockSize + 2, "0")}`
      );
      return encryptedChunk.padStart(blockSize + 2, "0");
    });
    resultDisplay.textContent = `Encrypted result: ${encrypted.join("")}`;
    privateKeyDisplay.textContent = `Private key (d): ${d}, Modulus (n): ${n}`;
  } else if (mode === "Decrypted") {
    let n = BigInt(document.getElementById("n").value);
    let d = BigInt(document.getElementById("d").value);
    let ciphertext = chunkString(
      document.getElementById("ciphertext").value,
      getBlockSize(n) + 2
    );

    console.log(`n: ${n}, d: ${d}`);
    console.log(`Ciphertext Chunks: ${ciphertext}`);

    let decryptedChunks = ciphertext
      .map((chunk) => {
        let decryptedChunk = modPow(BigInt(chunk), d, n)
          .toString()
          .padStart(getBlockSize(n), "0");
        console.log(`Ciphertext Chunk: ${chunk}`);
        console.log(`Decrypted Chunk: ${decryptedChunk}`);
        return decryptedChunk;
      })
      .join("");

    let plaintext = convertFromNumericString(decryptedChunks);
    resultDisplay.textContent = `Decrypted result: ${plaintext}`;
  }

  resultContainer.style.display = "block";

  if (!modeToggle.checked) {
    privateKeyContainer.style.display = "block";
    privateKeyDisplay.style.display = "none";
    revealDAndNButton.textContent = "Reveal Private Key (d) and Modulus (n)";
  } else {
    privateKeyContainer.style.display = "none";
  }
});

revealDAndNButton.addEventListener("click", function () {
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
