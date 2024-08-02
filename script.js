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
  // Calculate phi(n)
  let phi = (p - 1n) * (q - 1n);

  // Compute modular inverse of e modulo phi
  let { gcd, x } = extendedGCD(e, phi);

  if (gcd !== 1n) {
    throw new Error(
      "The modular inverse does not exist, e and phi(n) must be coprime."
    );
  }

  // Return the positive value of the modular inverse
  return ((x % phi) + phi) % phi;
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
    let m = document.getElementById("plaintext").value.toUpperCase();
    let n = p * q;
    let d = findD(p, q, e);
    let encrypted = [];
    for (var i = 0; i < m.length; i++) {
      let characterAsValue = BigInt(m.charCodeAt(i) - 65);
      if (characterAsValue >= 0n && characterAsValue <= 25n) {
        encrypted.push(modPow(characterAsValue, e, n).toString());
      } else {
        encrypted.push("?");
      }
    }
    resultDisplay.textContent = `Encrypted result: ${encrypted.join(" ")}`;
    privateKeyDisplay.textContent = `Private key (d): ${d}, Modulus (n): ${n}`;
  } else if (mode === "Decrypted") {
    let n = BigInt(document.getElementById("n").value);
    let d = BigInt(document.getElementById("d").value);
    let ciphertext = document.getElementById("ciphertext").value;
    let decrypted = [];

    for (let x of ciphertext.split(" ")) {
      if (x === "?") {
        decrypted.push("?");
      } else {
        let xBigInt = BigInt(x);
        let decryptedValue = modPow(xBigInt, d, n);
        if (decryptedValue >= 0n && decryptedValue <= 25n) {
          decrypted.push(String.fromCharCode(Number(decryptedValue) + 65));
        } else {
          decrypted.push("?");
        }
      }
    }

    resultDisplay.textContent = `Decrypted result: ${decrypted.join("")}`;
  }

  resultContainer.style.display = "block";

  if (!modeToggle.checked) {
    // Encryption mode
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
