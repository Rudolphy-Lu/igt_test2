let currentTrial = 1;
let totalIncome = 2000;
let results = [];

// 牌組獎懲選項定義
const options = {
    A: { reward: 100, penaltyChoices: [0, 150, 250, 350], weights: [0.5, 0.2, 0.1, 0.2] },
    B: { reward: 100, penaltyChoices: [0, 250], weights: [0.5, 0.5] },
    C: { reward: 50, penaltyChoices: [0, 25, 50, 75], weights: [0.5, 0.2, 0.1, 0.2] },
    D: { reward: 50, penaltyChoices: [0, 50], weights: [0.5, 0.5] }
};

function randomWeightedChoice(values, weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const randomNum = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < values.length; i++) {
        cumulativeWeight += weights[i];
        if (randomNum <= cumulativeWeight) {
            return values[i];
        }
    }
}

function updateDisplay(card, reward, penalty, netIncome) {
    document.getElementById("choice").innerText = card;
    document.getElementById("reward").innerText = reward;
    document.getElementById("penalty").innerText = penalty;
    document.getElementById("net-income").innerText = netIncome;
    document.getElementById("total-income").innerText = totalIncome;
    document.getElementById("trial-label").innerHTML = `已選擇 ${currentTrial}/30 次<br>請選擇一個牌組：`;

    // 設定顏色
    document.getElementById("reward").style.color = "blue";
    document.getElementById("penalty").style.color = "red";

    if (currentTrial > 30) {
        document.getElementById("trial-label").innerText = "遊戲結束！";
        disableButtons();
    }
}

function playRound(card) {
    if (currentTrial > 30) {
        alert("遊戲結束！");
        return;
    }

    if (!(card in options)) {
        alert("無效的選擇！");
        return;
    }

    // 使用 options 內的值來計算該次的獎懲
    const { reward, penaltyChoices, weights } = options[card];
    const penalty = randomWeightedChoice(penaltyChoices, weights);
    const netIncome = reward - penalty;
    totalIncome += netIncome;

    results.push({ trial: currentTrial, card, reward, penalty, netIncome });

    updateDisplay(card, reward, penalty, netIncome);
    currentTrial++;
}

function disableButtons() {
    document.querySelectorAll(".card-button").forEach(button => button.disabled = true);
}

function enableButtons() {
    document.querySelectorAll(".card-button").forEach(button => button.disabled = false);
}

function restartGame() {
    if (!confirm("確定要重新開始嗎？此操作將清除所有紀錄！")) return;

    currentTrial = 1;
    totalIncome = 2000;
    results = [];

    document.getElementById("trial-label").innerHTML = `已選擇 ${currentTrial - 1}/30 次<br>請選擇一個牌組：`;
    document.getElementById("choice").innerText = "";
    document.getElementById("reward").innerText = "";
    document.getElementById("penalty").innerText = "";
    document.getElementById("net-income").innerText = "";
    document.getElementById("total-income").innerText = totalIncome;

    enableButtons();
}

function saveResults() {
    const subjectId = document.getElementById("subject-id").value;
    if (!subjectId || isNaN(subjectId) || subjectId.length !== 4) {
        alert("請輸入四碼阿拉伯數字的受試者編號。");
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '_').split('T')[0];
    const filename = `result_${subjectId}_${timestamp}.csv`;

    const csvContent = generateCSV();
    downloadCSV(csvContent, filename);
}

function generateCSV() {
    const subjectId = document.getElementById("subject-id").value || "Unknown";
    const headers = ["Subject ID", "Trial", "Card", "Reward", "Penalty", "Net Income"];
    const rows = results.map(result => [subjectId, result.trial, result.card, result.reward, result.penalty, result.netIncome]);

    return [headers].concat(rows).map(e => e.join(",")).join("\n");
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
