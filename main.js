document.getElementById('cipher-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let message = document.getElementById('message').value.trim();
    let key = document.getElementById('key').value.trim();
    let mode = document.getElementById('list').value;

    let matrix = generatePlayfairMatrix(key);
    displayMatrix(matrix);

    let { pairs, stepsBefore } = prepareMessage(message, mode);
    let { finalResult, stepsExecution } = processPlayfair(pairs, matrix, mode);

    displayResults(finalResult, stepsBefore + stepsExecution);
});

function generatePlayfairMatrix(key) {
    let cleanKey = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let uniqueChars = [];
    
    for (let char of (cleanKey + alphabet)) {
        if (!uniqueChars.includes(char)) {
            uniqueChars.push(char);
        }
    }

    let matrix = [];
    for (let i = 0; i < 25; i += 5) {
        matrix.push(uniqueChars.slice(i, i + 5));
    }
    return matrix;
}

function displayMatrix(matrix) {
    let flatMatrix = matrix.flat();
    let cells = document.querySelectorAll('.grid .cell');
    cells.forEach((cell, index) => {
        cell.textContent = flatMatrix[index];
        cell.classList.add('active');
    });
}

function prepareMessage(message, mode) {
    let cleanMsg = message.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let steps = `[1] Prepared Input: ${cleanMsg}\n`;
    let pairs = [];

    if (mode === "encryption") {
        let i = 0;
        while (i < cleanMsg.length) {
            let char1 = cleanMsg[i];
            let char2 = cleanMsg[i + 1];

            if (!char2) {
                pairs.push(char1 + 'X');
                steps += `-> Lone char fixed: ${char1} -> ${char1}X\n`;
                i++;
            } else if (char1 === char2) {
                pairs.push(char1 + 'X');
                steps += `-> Duplicate fixed: ${char1}${char2} -> ${char1}X\n`;
                i++;
            } else {
                pairs.push(char1 + char2);
                i += 2;
            }
        }
    } else {
        for (let i = 0; i < cleanMsg.length; i += 2) {
            pairs.push(cleanMsg[i] + (cleanMsg[i + 1] || 'X'));
        }
    }

    steps += `[2] Split Digraphs: ${pairs.join(' ')}\n\n`;
    return { pairs, stepsBefore: steps };
}

function findPosition(char, matrix) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) return { row, col };
        }
    }
    return null;
}

function processPlayfair(pairs, matrix, mode) {
    let finalResult = "";
    let steps = `[3] Cipher Execution Rules:\n`;
    let shift = (mode === "encryption") ? 1 : 4;

    pairs.forEach(pair => {
        let p1 = findPosition(pair[0], matrix);
        let p2 = findPosition(pair[1], matrix);
        let c1, c2;

        if (p1.row === p2.row) {
            c1 = matrix[p1.row][(p1.col + shift) % 5];
            c2 = matrix[p2.row][(p2.col + shift) % 5];
            steps += `-> ${pair} (Row Match) => ${c1}${c2}\n`;
        } else if (p1.col === p2.col) {
            c1 = matrix[(p1.row + shift) % 5][p1.col];
            c2 = matrix[(p2.row + shift) % 5][p2.col];
            steps += `-> ${pair} (Col Match) => ${c1}${c2}\n`;
        } else {
            c1 = matrix[p1.row][p2.col];
            c2 = matrix[p2.row][p1.col];
            steps += `-> ${pair} (Box Match) => ${c1}${c2}\n`;
        }
        finalResult += c1 + c2;
    });

    return { finalResult, stepsExecution: steps };
}

function displayResults(result, stepsText) {
    document.getElementById('result-box').style.display = 'block';
    document.getElementById('final-result').textContent = result.toLowerCase();
    document.getElementById('steps-log').textContent = stepsText;
}
