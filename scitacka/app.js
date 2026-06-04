/**
 * PPS (Paralelní binární sčítačka s predikcí přenosu) - Algorithm Visualizer
 * Course Alignment: NI-PDP, FIT CTU in Prague
 * Author: Antigravity
 */

// 1. Translations Dictionary
const TRANSLATIONS = {
  cz: {
    app_title: "Paralelní binární sčítačka s predikcí přenosu (PPS)",
    settings_title: "Konfigurace",
    label_bits: "Počet bitů (n)",
    label_adder: "Typ prefixové sítě",
    inputs_title: "Vstupní čísla",
    label_dec_x: "Decimal X",
    label_dec_y: "Decimal Y",
    controls_title: "Simulace",
    label_speed: "Rychlost:",
    operator_title: "Operátor ⊙",
    operator_desc: "Operátor ⊙ je asociativní. Umožňuje paralelní výpočet přenosů v log n krocích.",
    prefix_tree_title: "Prefixová síť přenosů (Parallel Prefix Network)",
    title_prev: "Krok zpět",
    title_play: "Spustit / Pozastavit",
    title_next: "Krok vpřed",
    title_reset: "Resetovat",
    
    // Step Expanations
    step_0_title: "Krok 0: Inicializace",
    step_0_body: "Zadejte dvě binární čísla X a Y. Můžete klikat přímo na jednotlivé bity v dolním panelu nebo v panelu 'Vstupní čísla' k jejich přepnutí, případně zadat čísla decimálně. Klikněte na <b>Krok vpřed</b> pro zahájení výpočtu.",
    
    step_1_title: "Krok 1: Výpočet počátečních stavů B",
    step_1_body: "Pro každý bit i paralelně určíme počáteční stav přenosu <code>b_i</code>:<br>" +
                 "- <b>g</b> (generate) pokud <code>x_i = y_i = 1</code> (přenos vzniká)<br>" +
                 "- <b>s</b> (stop) pokud <code>x_i = y_i = 0</code> (přenos zaniká)<br>" +
                 "- <b>p</b> (propagate) pokud <code>x_i ≠ y_i</code> (přenos se propaguje)<br>" +
                 "Na pravý konec připojíme počáteční přenos <code>c_0 = 0</code> reprezentovaný stavem <b>s</b> na indexu -1.",
                 
    step_prefix_title: "Krok ${stepNum}: Prefixová síť - Stupeň ${stageNum}",
    step_prefix_body: "V tomto kroku paralelně vyhodnocujeme operaci ⊙ mezi vybranými uzly.<br>" +
                      "Zvýrazněné uzly provádějí operaci <code>L ⊙ R</code>, kde <code>L</code> je hodnota v aktuálním sloupci z předchozího stupně a <code>R</code> je hodnota připojená zprava. Ostatní uzly pouze kopírují své hodnoty z předchozího stupně dolů.",
                      
    step_carry_title: "Krok ${stepNum}: Výpočet přenosů C",
    step_carry_body: "Přenosy <code>c_1 ... c_n</code> získáme přímo z výsledných prefixových součinů <code>B'</code>:<br>" +
                      "- Pokud <code>b'_{i-1} = g</code>, pak <code>c_i = 1</code>.<br>" +
                      "- Jinak <code>c_i = 0</code>.<br>" +
                      "Počáteční přenos <code>c_0</code> je vždy 0 (odpovídá <b>s</b> na indexu -1).",
                      
    step_sum_title: "Krok ${stepNum}: Výpočet výsledné sumy Z",
    step_sum_body: "Výsledné bity sumy <code>z_i</code> spočítáme v paralelním kroku jako:<br>" +
                    "<code>z_i = x_i ⊕ y_i ⊕ c_i = (b_i == p) ⊕ c_i</code>.<br>" +
                    "Výpočet je dokončen! Výsledek <b>Z = X + Y</b> je zobrazen ve spodní řadě a ověřen decimálně.",
                    
    tooltip_copy: "Uzel pouze kopíruje hodnotu z horního stupně: <b>${val}</b>",
    tooltip_combine: "Kombinace uzlů:<br><code>${L_idx} ⊙ ${R_idx}</code><br><code>${L_val} ⊙ ${R_val} = <b>${result}</b></code>"
  },
  en: {
    app_title: "Parallel Binary Carry-Lookahead Adder (PPS)",
    settings_title: "Configuration",
    label_bits: "Number of Bits (n)",
    label_adder: "Prefix Network Type",
    inputs_title: "Input Numbers",
    label_dec_x: "Decimal X",
    label_dec_y: "Decimal Y",
    controls_title: "Simulation",
    label_speed: "Speed:",
    operator_title: "Operator ⊙",
    operator_desc: "The ⊙ operator is associative. It enables parallel carry computation in log n steps.",
    prefix_tree_title: "Parallel Prefix Network",
    title_prev: "Step Backward",
    title_play: "Play / Pause",
    title_next: "Step Forward",
    title_reset: "Reset",
    
    // Step Expanations
    step_0_title: "Step 0: Initialization",
    step_0_body: "Enter two binary numbers X and Y. You can click directly on the bits in the bottom panel or the 'Input Numbers' panel to toggle them, or input decimal values. Click <b>Step Forward</b> to begin the calculation.",
    
    step_1_title: "Step 1: Compute Initial States B",
    step_1_body: "For each bit i, we determine the initial carry state <code>b_i</code> in parallel:<br>" +
                 "- <b>g</b> (generate) if <code>x_i = y_i = 1</code> (carry is generated)<br>" +
                 "- <b>s</b> (stop) if <code>x_i = y_i = 0</code> (carry is stopped/killed)<br>" +
                 "- <b>p</b> (propagate) if <code>x_i ≠ y_i</code> (carry propagates through)<br>" +
                 "We append the initial carry-in <code>c_0 = 0</code> represented by state <b>s</b> at index -1 on the right.",
                 
    step_prefix_title: "Step ${stepNum}: Prefix Network - Stage ${stageNum}",
    step_prefix_body: "In this step, we evaluate the ⊙ operator between selected nodes in parallel.<br>" +
                      "Highlighted nodes compute <code>L ⊙ R</code>, where <code>L</code> is the value in the current column from the previous stage, and <code>R</code> is the value connected from the right. Other nodes just copy their values from the previous stage.",
                      
    step_carry_title: "Step ${stepNum}: Extract Carries C",
    step_carry_body: "Carries <code>c_1 ... c_n</code> are extracted directly from the prefix scan results <code>B'</code>:<br>" +
                      "- If <code>b'_{i-1} = g</code>, then <code>c_i = 1</code>.<br>" +
                      "- Otherwise <code>c_i = 0</code>.<br>" +
                      "The initial carry-in <code>c_0</code> is always 0 (corresponding to <b>s</b> at index -1).",
                      
    step_sum_title: "Step ${stepNum}: Compute Final Sum Z",
    step_sum_body: "The final sum bits <code>z_i</code> are computed in parallel as:<br>" +
                    "<code>z_i = x_i ⊕ y_i ⊕ c_i = (b_i == p) ⊕ c_i</code>.<br>" +
                    "Calculation complete! The result <b>Z = X + Y</b> is shown in the bottom row and verified in decimal.",
                    
    tooltip_copy: "Node copies value from the stage above: <b>${val}</b>",
    tooltip_combine: "Combining nodes:<br><code>${L_idx} ⊙ ${R_idx}</code><br><code>${L_val} ⊙ ${R_val} = <b>${result}</b></code>"
  }
};

// 2. Application State
let state = {
  lang: 'cz',
  n: 7,               // bit-width
  X: [1, 1, 0, 1, 0, 1, 0], // LSB (index 0) to MSB (index n-1)
  Y: [1, 0, 0, 1, 1, 1, 0],
  adderType: 'kogge-stone',
  currentStep: 0,
  isPlaying: false,
  speed: 1000,        // duration of auto step in ms
  timerId: null,
  hoveredNode: null   // track for tooltip highlighting
};

// 3. Operator definition
function applyOperator(left, right) {
  if (left === 'g') return 'g';
  if (left === 's') return 's';
  if (left === 'p') return right;
  return 's';
}

// 4. Prefix Tree Geometry Helpers
function getN(n, type) {
  if (n === 3) return 4;
  if (n === 7) return 8;
  if (n === 15) return 16;
  if (n === 8) {
    if (type === 'brent-kung') return 16;
    return 9; // Sklansky and Kogge-Stone work on 9 elements
  }
  return n + 1;
}

// Generate the network tree stages
// Returns an array of stages, where each stage is an array of N nodes.
// Each node: { index, left, right, start, end, isDummy }
function generatePrefixTree(n, type) {
  const N = getN(n, type);
  const stages = [];
  const k = Math.ceil(Math.log2(N));

  // Stage 0: Initial Inputs
  const stage0 = [];
  for (let i = 0; i < N; i++) {
    const isDummy = (n === 8 && type === 'brent-kung' && i >= 9);
    stage0.push({
      index: i,
      left: null,
      right: null,
      start: i,
      end: i,
      isDummy: isDummy
    });
  }
  stages.push(stage0);

  if (type === 'kogge-stone') {
    const S = Math.ceil(Math.log2(N));
    for (let s = 1; s <= S; s++) {
      const prevStage = stages[stages.length - 1];
      const currentStage = [];
      const step = Math.pow(2, s - 1);
      for (let i = 0; i < N; i++) {
        const isDummy = (n === 8 && i >= 9);
        if (i >= step && !isDummy) {
          currentStage.push({
            index: i,
            left: i,
            right: i - step,
            start: prevStage[i - step].start,
            end: i,
            isDummy: isDummy
          });
        } else {
          currentStage.push({
            index: i,
            left: i,
            right: null,
            start: prevStage[i].start,
            end: prevStage[i].end,
            isDummy: isDummy
          });
        }
      }
      stages.push(currentStage);
    }
  } 
  else if (type === 'sklansky') {
    const S = Math.ceil(Math.log2(N));
    for (let s = 1; s <= S; s++) {
      const prevStage = stages[stages.length - 1];
      const currentStage = [];
      const width = Math.pow(2, s);
      const half = Math.pow(2, s - 1);
      for (let i = 0; i < N; i++) {
        const block = Math.floor(i / width);
        const rem = i % width;
        const isDummy = (n === 8 && i >= 9);
        
        if (rem >= half && !isDummy) {
          let j = block * width + half - 1;
          j = Math.min(j, N - 1);
          // If the right target is dummy, don't combine
          if (n === 8 && j >= 9) {
            currentStage.push({
              index: i,
              left: i,
              right: null,
              start: prevStage[i].start,
              end: prevStage[i].end,
              isDummy: isDummy
            });
          } else {
            currentStage.push({
              index: i,
              left: i,
              right: j,
              start: prevStage[j].start,
              end: i,
              isDummy: isDummy
            });
          }
        } else {
          currentStage.push({
            index: i,
            left: i,
            right: null,
            start: prevStage[i].start,
            end: prevStage[i].end,
            isDummy: isDummy
          });
        }
      }
      stages.push(currentStage);
    }
  } 
  else if (type === 'brent-kung') {
    // Down-sweep
    for (let s = 1; s <= k; s++) {
      const prevStage = stages[stages.length - 1];
      const currentStage = [];
      const step = Math.pow(2, s);
      for (let i = 0; i < N; i++) {
        const isDummy = (n === 8 && i >= 9);
        if ((i + 1) % step === 0 && !isDummy) {
          const rightIndex = i - Math.pow(2, s - 1);
          currentStage.push({
            index: i,
            left: i,
            right: rightIndex,
            start: prevStage[rightIndex].start,
            end: i,
            isDummy: isDummy
          });
        } else {
          currentStage.push({
            index: i,
            left: i,
            right: null,
            start: prevStage[i].start,
            end: prevStage[i].end,
            isDummy: isDummy
          });
        }
      }
      stages.push(currentStage);
    }

    // Up-sweep
    for (let s = k + 1; s <= 2 * k - 1; s++) {
      const prevStage = stages[stages.length - 1];
      const currentStage = [];
      const d = 2 * k - s;
      const step = Math.pow(2, d);
      const halfStep = Math.pow(2, d - 1);
      
      // Copy everything from prevStage first
      for (let i = 0; i < N; i++) {
        const isDummy = (n === 8 && i >= 9);
        currentStage.push({
          index: i,
          left: i,
          right: null,
          start: prevStage[i].start,
          end: prevStage[i].end,
          isDummy: isDummy
        });
      }

      // Combine elements
      for (let q = 1; q < N / halfStep; q++) {
        const i = q * step + halfStep - 1;
        const isDummy = (n === 8 && i >= 9);
        if (i < N && !isDummy) {
          const rightIndex = i - halfStep;
          if (rightIndex >= 0 && !(n === 8 && rightIndex >= 9)) {
            currentStage[i].right = rightIndex;
            currentStage[i].start = prevStage[rightIndex].start;
          }
        }
      }
      stages.push(currentStage);
    }
  }

  return stages;
}

// Compute the value grid [stage][column] based on inputs
function getInitialA(n, type, X, Y) {
  const N = getN(n, type);
  const A = new Array(N);

  A[0] = 's'; // c0 on the right
  for (let i = 1; i <= n; i++) {
    const xi = X[i - 1];
    const yi = Y[i - 1];
    if (xi === 1 && yi === 1) A[i] = 'g';
    else if (xi === 0 && yi === 0) A[i] = 's';
    else A[i] = 'p';
  }

  for (let i = n + 1; i < N; i++) {
    A[i] = 's'; // padding columns default to stop
  }

  return A;
}

function computeNodeValues(stages, A) {
  const N = A.length;
  const values = [];
  
  // Stage 0
  values.push([...A]);

  for (let s = 1; s < stages.length; s++) {
    const prevVals = values[values.length - 1];
    const currentVals = new Array(N);
    for (let i = 0; i < N; i++) {
      const node = stages[s][i];
      if (node.right !== null) {
        currentVals[i] = applyOperator(prevVals[i], prevVals[node.right]);
      } else {
        currentVals[i] = prevVals[i];
      }
    }
    values.push(currentVals);
  }
  return values;
}

// 5. Drawing and Rendering
function drawPrefixNetwork() {
  const svg = document.getElementById('prefix-svg');
  svg.innerHTML = ''; // clear

  const type = state.adderType;
  const n = state.n;
  const N = getN(n, type);
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1; // number of stages (excl. inputs)
  
  // Compute initial A and node values
  const A = getInitialA(n, type, state.X, state.Y);
  const values = computeNodeValues(stages, A);

  // SVG Size & Grid Layout Settings
  const marginX = 50;
  const marginY = 40;
  const width = svg.clientWidth || 800;
  const height = svg.clientHeight || 420;

  // Let columns be placed from left (index N-1) to right (index 0)
  const xGap = (width - 2 * marginX) / (N - 1 || 1);
  const yGap = (height - 2 * marginY) / S;

  function getCoords(s, i) {
    return {
      x: width - marginX - i * xGap,
      y: marginY + s * yGap
    };
  }

  // Draw background grid lines (optional, keep it subtle)
  for (let i = 0; i < N; i++) {
    const pStart = getCoords(0, i);
    const pEnd = getCoords(S, i);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', pStart.x);
    line.setAttribute('y1', pStart.y);
    line.setAttribute('x2', pEnd.x);
    line.setAttribute('y2', pEnd.y);
    line.setAttribute('class', 'svg-bg-grid');
    svg.appendChild(line);
  }

  // Draw active stage highlight row rect
  const step = state.currentStep;
  const activePrefixStage = (step >= 2 && step < 2 + S) ? (step - 1) : null;
  if (activePrefixStage !== null) {
    const yCenter = marginY + activePrefixStage * yGap;
    const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    highlight.setAttribute('x', marginX - 15);
    highlight.setAttribute('y', yCenter - 22);
    highlight.setAttribute('width', width - 2 * marginX + 30);
    highlight.setAttribute('height', 44);
    highlight.setAttribute('class', 'stage-highlight-rect');
    svg.appendChild(highlight);
  }

  // Render Wires (connect nodes)
  for (let s = 1; s <= S; s++) {
    for (let i = 0; i < N; i++) {
      const node = stages[s][i];
      
      const target = getCoords(s, i);
      const srcLeft = getCoords(s - 1, i);

      // Vertical wire from left parent (copied value or self)
      const lineLeft = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineLeft.setAttribute('x1', srcLeft.x);
      lineLeft.setAttribute('y1', srcLeft.y);
      lineLeft.setAttribute('x2', target.x);
      lineLeft.setAttribute('y2', target.y);
      
      // Class names for wires
      let wireClass = 'wire-line';
      if (node.isDummy) {
        wireClass += ' dummy';
      } else if (step > 1 && s <= step - 1) {
        wireClass += ' active';
      }
      lineLeft.setAttribute('class', wireClass);
      
      // Store reference metadata for path highlighting
      lineLeft.dataset.stage = s;
      lineLeft.dataset.col = i;
      lineLeft.dataset.type = 'vertical';
      svg.appendChild(lineLeft);

      // Diagonal wire from right parent (combined value)
      if (node.right !== null) {
        const srcRight = getCoords(s - 1, node.right);
        const lineRight = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineRight.setAttribute('x1', srcRight.x);
        lineRight.setAttribute('y1', srcRight.y);
        lineRight.setAttribute('x2', target.x);
        lineRight.setAttribute('y2', target.y);
        
        let diagClass = 'wire-line';
        if (node.isDummy) {
          diagClass += ' dummy';
        } else if (step > 1 && s <= step - 1) {
          diagClass += ' active';
        }
        lineRight.setAttribute('class', diagClass);
        lineRight.dataset.stage = s;
        lineRight.dataset.col = i;
        lineRight.dataset.rightCol = node.right;
        lineRight.dataset.type = 'diagonal';
        svg.appendChild(lineRight);
      }
    }
  }

  // Draw Carry flow lines (Step 2+S)
  if (step === 2 + S) {
    for (let i = 0; i < N; i++) {
      const node = stages[S][i];
      if (node.isDummy) continue;
      
      const bottomCoords = getCoords(S, i);
      // Draw a glowing carry line pointing downwards out of the bottom nodes
      const carryLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      carryLine.setAttribute('x1', bottomCoords.x);
      carryLine.setAttribute('y1', bottomCoords.y);
      carryLine.setAttribute('x2', bottomCoords.x);
      carryLine.setAttribute('y2', bottomCoords.y + 20);
      carryLine.setAttribute('class', 'wire-line carry-flow');
      svg.appendChild(carryLine);
    }
  }

  // Render Nodes
  for (let s = 0; s <= S; s++) {
    for (let i = 0; i < N; i++) {
      const node = stages[s][i];
      const coords = getCoords(s, i);

      // Create SVG group for node
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'svg-node');
      g.dataset.stage = s;
      g.dataset.col = i;

      // Determine node status & display character
      const val = values[s][i];
      const isOp = s > 0 && stages[s][i].right !== null;
      const isDummy = node.isDummy;
      
      // Node styling based on current state step
      let nodeClass = '';
      if (isDummy) {
        nodeClass = 'val-dummy';
      } else if (step === 0) {
        // Step 0: values are not loaded yet
        nodeClass = '';
      } else if (step === 1 && s > 0) {
        // Step 1: initial values computed, prefix not yet computed
        nodeClass = 'dimmed';
      } else if (step > 1 && s > step - 1) {
        // Step in prefix, stages below the current are dimmed
        nodeClass = 'dimmed';
      } else {
        // Value exists and is visible
        nodeClass = `val-${val}`;
      }

      if (isOp) g.classList.add('op');
      if (nodeClass) g.classList.add(nodeClass);

      // Pulse animation for active step
      if (activePrefixStage !== null && s === activePrefixStage && !isDummy && isOp) {
        g.classList.add('pulse');
      }

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', coords.x);
      circle.setAttribute('cy', coords.y);
      circle.setAttribute('r', isOp ? 13 : 11);
      g.appendChild(circle);

      // Text label inside the circle
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', coords.x);
      text.setAttribute('y', coords.y);
      
      let displayText = '';
      if (isDummy) {
        displayText = '-';
      } else if (step === 0) {
        displayText = '?';
      } else {
        displayText = val;
      }
      text.textContent = displayText;
      g.appendChild(text);

      // Interactive hover handlers
      g.addEventListener('mouseenter', (e) => handleNodeHover(e, s, i, stages, values, N, n, type));
      g.addEventListener('mouseleave', handleNodeLeave);

      svg.appendChild(g);
    }
  }

  // Draw Column index labels at the top
  for (let i = 0; i < N; i++) {
    const coords = getCoords(0, i);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', coords.x);
    text.setAttribute('y', coords.y - 25);
    text.setAttribute('font-family', 'var(--font-sans)');
    text.setAttribute('font-size', '9px');
    text.setAttribute('font-weight', '600');
    text.setAttribute('fill', 'var(--text-muted)');
    text.setAttribute('text-anchor', 'middle');
    
    // Column label: LSB is column 0 (which is rightmost, contains s). Columns 1..n contain b_0..b_{n-1}
    if (i === 0) {
      text.textContent = "c0 (-1)";
    } else if (n === 8 && type === 'brent-kung' && i >= 9) {
      text.textContent = `pad`;
    } else {
      text.textContent = `b${i-1}`;
    }
    svg.appendChild(text);
  }

  // Draw Stage labels on the left
  for (let s = 0; s <= S; s++) {
    const coords = getCoords(s, N - 1);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', coords.x - 30);
    text.setAttribute('y', coords.y);
    text.setAttribute('font-family', 'var(--font-sans)');
    text.setAttribute('font-size', '10px');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', 'var(--text-muted)');
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('dominant-baseline', 'central');

    if (s === 0) {
      text.textContent = state.lang === 'cz' ? 'Vstup' : 'Input';
    } else {
      text.textContent = `${state.lang === 'cz' ? 'Stupeň' : 'Stage'} ${s}`;
    }
    svg.appendChild(text);
  }
}

// Hover highlights & Tooltip computation
function handleNodeHover(event, s, i, stages, values, N, n, type) {
  const node = stages[s][i];
  if (node.isDummy || state.currentStep === 0) return;
  if (state.currentStep > 0 && s > state.currentStep - 1) return; // don't hover uncomputed nodes

  const svg = document.getElementById('prefix-svg');
  const tooltip = document.getElementById('tooltip');
  
  // Highlight inputs
  const allNodes = svg.querySelectorAll('.svg-node');
  const allWires = svg.querySelectorAll('.wire-line');

  // Highlight active node paths recursively from stage s back to stage 0
  const pathNodes = new Set();
  const pathWires = new Set();

  function tracePath(currStage, currCol) {
    const key = `${currStage},${currCol}`;
    if (pathNodes.has(key)) return;
    pathNodes.add(key);

    if (currStage === 0) return;

    const nd = stages[currStage][currCol];
    // vertical parent
    tracePath(currStage - 1, currCol);
    pathWires.add(`${currStage},${currCol},vertical`);

    // diagonal parent
    if (nd.right !== null) {
      tracePath(currStage - 1, nd.right);
      pathWires.add(`${currStage},${currCol},diagonal`);
    }
  }

  tracePath(s, i);

  // Dim everything else, highlight path
  allNodes.forEach(gn => {
    const stage = parseInt(gn.dataset.stage);
    const col = parseInt(gn.dataset.col);
    const key = `${stage},${col}`;
    if (!pathNodes.has(key)) {
      gn.classList.add('dimmed');
    }
  });

  allWires.forEach(w => {
    const stage = parseInt(w.dataset.stage);
    const col = parseInt(w.dataset.col);
    const isDiag = w.dataset.rightCol !== undefined;
    const wireKey = `${stage},${col},${isDiag ? 'diagonal' : 'vertical'}`;
    
    if (pathWires.has(wireKey)) {
      w.classList.add('highlight');
    } else {
      w.classList.add('dimmed');
    }
  });

  // Highlight bottom cells in slide panel
  highlightSlideCellsForColumn(i, n);

  // Populate Tooltip
  let html = '';
  const val = values[s][i];

  if (s === 0) {
    if (i === 0) {
      html = `c₀ = s (stop)`;
    } else {
      const idx = i - 1;
      html = `b${idx} = ${val.toUpperCase()} (${state.lang === 'cz' ? 'vstup' : 'input'})`;
    }
  } else if (node.right === null) {
    const label = i === 0 ? 'c₀' : `b${i-1}`;
    html = TRANSLATIONS[state.lang].tooltip_copy
      .replace('${val}', val.toUpperCase());
  } else {
    // Combination node L ⊙ R
    const L_label = i === 0 ? 'c₀' : `b${i-1}`;
    const R_label = node.right === 0 ? 'c₀' : `b${node.right-1}`;
    const L_val = values[s - 1][i].toUpperCase();
    const R_val = values[s - 1][node.right].toUpperCase();
    
    html = TRANSLATIONS[state.lang].tooltip_combine
      .replace('${L_idx}', L_label)
      .replace('${R_idx}', R_label)
      .replace('${L_val}', L_val)
      .replace('${R_val}', R_val)
      .replace('${result}', val.toUpperCase());
  }

  tooltip.innerHTML = html;
  
  // Position tooltip near cursor inside canvas
  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left + 15;
  const y = event.clientY - rect.top + 15;
  
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add('visible');
}

function handleNodeLeave() {
  const svg = document.getElementById('prefix-svg');
  const tooltip = document.getElementById('tooltip');
  
  // Remove dimming & highlights
  svg.querySelectorAll('.svg-node').forEach(gn => gn.classList.remove('dimmed'));
  svg.querySelectorAll('.wire-line').forEach(w => {
    w.classList.remove('dimmed');
    w.classList.remove('highlight');
  });

  // Remove slide cells highlighting
  removeSlideHighlight();

  tooltip.classList.remove('visible');
}

// Highlight slide cells corresponding to hovered SVG column
function highlightSlideCellsForColumn(colIdx, n) {
  removeSlideHighlight();
  
  // colIdx maps to slide cell indices
  // For X, Y, Z: colIdx 1 maps to index 0, colIdx n maps to index n-1. colIdx 0 is spacer.
  if (colIdx >= 1 && colIdx <= n) {
    const bitIdx = colIdx - 1;
    document.querySelectorAll(`.slide-row.x-y .slide-cell[data-idx="${bitIdx}"]`).forEach(c => c.classList.add('active-bit'));
  }
}

function removeSlideHighlight() {
  document.querySelectorAll('.slide-cell').forEach(c => c.classList.remove('active-bit'));
}

// 6. Update Slide Display (Bottom Panel)
function updateSlideDisplay() {
  const n = state.n;
  const step = state.currentStep;
  const type = state.adderType;
  
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1;
  const A = getInitialA(n, type, state.X, state.Y);
  const values = computeNodeValues(stages, A);

  const containerX = document.getElementById('slide-cells-x');
  const containerY = document.getElementById('slide-cells-y');
  const containerB = document.getElementById('slide-cells-b');
  const containerBPrime = document.getElementById('slide-cells-bprime');
  const containerC = document.getElementById('slide-cells-c');
  const containerZ = document.getElementById('slide-cells-z');

  // Clear all
  containerX.innerHTML = '';
  containerY.innerHTML = '';
  containerB.innerHTML = '';
  containerBPrime.innerHTML = '';
  containerC.innerHTML = '';
  containerZ.innerHTML = '';

  // Render rows from MSB (n-1) down to LSB (0)
  for (let i = n - 1; i >= 0; i--) {
    // X cells
    const cellX = document.createElement('div');
    cellX.className = `slide-cell ${state.X[i] === 1 ? 'val-1' : 'val-0'}`;
    cellX.dataset.idx = i;
    cellX.innerHTML = `<span class="cell-val">${state.X[i]}</span><span class="cell-idx">x${i}</span>`;
    cellX.addEventListener('click', () => toggleBit('X', i));
    containerX.appendChild(cellX);

    // Y cells
    const cellY = document.createElement('div');
    cellY.className = `slide-cell ${state.Y[i] === 1 ? 'val-1' : 'val-0'}`;
    cellY.dataset.idx = i;
    cellY.innerHTML = `<span class="cell-val">${state.Y[i]}</span><span class="cell-idx">y${i}</span>`;
    cellY.addEventListener('click', () => toggleBit('Y', i));
    containerY.appendChild(cellY);
  }

  // Row spacers on the right (for column index -1, which is initial carry)
  const spacerX = document.createElement('div');
  spacerX.className = 'slide-cell spacer';
  spacerX.style.opacity = '0';
  containerX.appendChild(spacerX);

  const spacerY = document.createElement('div');
  spacerY.className = 'slide-cell spacer';
  spacerY.style.opacity = '0';
  containerY.appendChild(spacerY);

  // Compute values for B (stage 0), B' (final prefix stage), C (carries), Z (sums)
  // B elements (size n+1): columns 1..n are b_0..b_{n-1}, column 0 is s
  const bVals = values[0];
  const bPrimeVals = values[S];

  // Render B row
  if (step >= 1) {
    for (let i = n; i >= 1; i--) {
      const val = bVals[i];
      const cellB = document.createElement('div');
      cellB.className = `slide-cell val-${val}`;
      cellB.innerHTML = `<span class="cell-val">${val}</span><span class="cell-idx">b${i-1}</span>`;
      containerB.appendChild(cellB);
    }
    // Extra s on the right
    const cellBExtra = document.createElement('div');
    cellBExtra.className = 'slide-cell val-s';
    cellBExtra.innerHTML = `<span class="cell-val">s</span><span class="cell-idx">c₀</span>`;
    containerB.appendChild(cellBExtra);
  } else {
    // Fill with empty placeholders
    fillPlaceholders(containerB, n + 1, 'b');
  }

  // Render B' row
  if (step >= 2) {
    const finalStageIdx = (step < 2 + S) ? (step - 1) : S;
    const currentPrefixVals = values[finalStageIdx];
    
    for (let i = n; i >= 1; i--) {
      const val = currentPrefixVals[i];
      const cellBP = document.createElement('div');
      cellBP.className = `slide-cell val-${val}`;
      cellBP.innerHTML = `<span class="cell-val">${val}</span><span class="cell-idx">b'${i-1}</span>`;
      containerBPrime.appendChild(cellBP);
    }
    // Extra element spacer/s on the right
    const cellBPExtra = document.createElement('div');
    cellBPExtra.className = `slide-cell val-${currentPrefixVals[0]}`;
    cellBPExtra.innerHTML = `<span class="cell-val">${currentPrefixVals[0]}</span><span class="cell-idx">b'₋₁</span>`;
    containerBPrime.appendChild(cellBPExtra);
  } else {
    fillPlaceholders(containerBPrime, n + 1, "b'");
  }

  // Render C row
  // C has n+1 elements: c_n down to c_0. c_0 = 0.
  // c_i = 1 if b'_{i-1} == g else 0
  const carries = new Array(n + 1);
  carries[0] = 0; // c_0
  for (let i = 1; i <= n; i++) {
    carries[i] = bPrimeVals[i] === 'g' ? 1 : 0;
  }

  if (step >= 2 + S) {
    for (let i = n; i >= 1; i--) {
      const val = carries[i];
      const cellC = document.createElement('div');
      cellC.className = `slide-cell val-${val}`;
      cellC.innerHTML = `<span class="cell-val">${val}</span><span class="cell-idx">c${i}</span>`;
      containerC.appendChild(cellC);
    }
    // diagonal separator slash + c_0
    const slash = document.createElement('div');
    slash.className = 'extra-s-slash';
    slash.textContent = '╱';
    containerC.appendChild(slash);

    const cellCExtra = document.createElement('div');
    cellCExtra.className = 'slide-cell val-0';
    cellCExtra.innerHTML = `<span class="cell-val">0</span><span class="cell-idx">c₀</span>`;
    containerC.appendChild(cellCExtra);
  } else {
    fillPlaceholders(containerC, n, 'c');
    const slash = document.createElement('div');
    slash.className = 'extra-s-slash';
    slash.textContent = '╱';
    containerC.appendChild(slash);
    const cellCExtraPlaceholder = document.createElement('div');
    cellCExtraPlaceholder.className = 'slide-cell spacer';
    cellCExtraPlaceholder.innerHTML = '<span class="cell-val">?</span>';
    containerC.appendChild(cellCExtraPlaceholder);
  }

  // Render Z row
  // z_i = x_i ^ y_i ^ c_i
  const sum = new Array(n);
  for (let i = 0; i < n; i++) {
    sum[i] = state.X[i] ^ state.Y[i] ^ carries[i];
  }

  if (step >= 3 + S) {
    for (let i = n - 1; i >= 0; i--) {
      const val = sum[i];
      const cellZ = document.createElement('div');
      cellZ.className = `slide-cell val-${val}`;
      cellZ.innerHTML = `<span class="cell-val">${val}</span><span class="cell-idx">z${i}</span>`;
      containerZ.appendChild(cellZ);
    }
  } else {
    fillPlaceholders(containerZ, n, 'z');
  }

  // Spacer for Z row on the right
  const spacerZ = document.createElement('div');
  spacerZ.className = 'slide-cell spacer';
  spacerZ.style.opacity = '0';
  containerZ.appendChild(spacerZ);
}

function fillPlaceholders(container, count, label) {
  for (let i = 0; i < count; i++) {
    const ph = document.createElement('div');
    ph.className = 'slide-cell spacer';
    ph.innerHTML = `<span class="cell-val">?</span>`;
    container.appendChild(ph);
  }
}

// 7. Update Text Explanations
function updateExplanation() {
  const n = state.n;
  const step = state.currentStep;
  const type = state.adderType;
  
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1;
  
  const titleEl = document.getElementById('explanation-title');
  const bodyEl = document.getElementById('explanation-body');
  
  const trans = TRANSLATIONS[state.lang];

  if (step === 0) {
    titleEl.textContent = trans.step_0_title;
    bodyEl.innerHTML = trans.step_0_body;
  } else if (step === 1) {
    titleEl.textContent = trans.step_1_title;
    bodyEl.innerHTML = trans.step_1_body;
  } else if (step >= 2 && step < 2 + S) {
    const stageNum = step - 1;
    titleEl.textContent = trans.step_prefix_title
      .replace('${stepNum}', step)
      .replace('${stageNum}', stageNum);
    bodyEl.innerHTML = trans.step_prefix_body
      .replace('${stepNum}', step)
      .replace('${stageNum}', stageNum);
  } else if (step === 2 + S) {
    titleEl.textContent = trans.step_carry_title.replace('${stepNum}', step);
    bodyEl.innerHTML = trans.step_carry_body.replace('${stepNum}', step);
  } else if (step === 3 + S) {
    titleEl.textContent = trans.step_sum_title.replace('${stepNum}', step);
    bodyEl.innerHTML = trans.step_sum_body.replace('${stepNum}', step);
  }
}

// Update simulation control buttons status and step dots
function updateControlButtons() {
  const n = state.n;
  const type = state.adderType;
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1;
  const totalSteps = 4 + S;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnPlay = document.getElementById('btn-play');

  btnPrev.disabled = state.currentStep === 0;
  btnNext.disabled = state.currentStep === totalSteps - 1;

  if (state.isPlaying) {
    btnPlay.textContent = '⏸';
  } else {
    btnPlay.textContent = '▶';
  }

  // Draw progress dots
  const dotsContainer = document.getElementById('stage-dots-container');
  dotsContainer.innerHTML = '';

  for (let i = 0; i < totalSteps; i++) {
    const dot = document.createElement('div');
    dot.className = 'stage-dot';
    if (i === state.currentStep) dot.classList.add('active');
    else if (i < state.currentStep) dot.classList.add('completed');
    
    // Add tooltip text to dots
    let label = '';
    if (i === 0) label = state.lang === 'cz' ? 'Vstup' : 'Input';
    else if (i === 1) label = 'B';
    else if (i >= 2 && i < 2 + S) label = `${state.lang === 'cz' ? 'Stupeň' : 'Stage'} ${i-1}`;
    else if (i === 2 + S) label = 'Carries C';
    else label = 'Sum Z';
    
    dot.title = label;
    dot.addEventListener('click', () => {
      pauseSim();
      goToStep(i);
    });
    dotsContainer.appendChild(dot);
  }
}

// 8. State modification operations
function toggleBit(arrayName, index) {
  const arr = state[arrayName];
  arr[index] = arr[index] === 1 ? 0 : 1;
  
  // update inputs decimal value
  updateDecimalsFromBinary();
  
  // Reset simulation step to 0 to force recalculation on modified inputs
  state.currentStep = 0;
  
  renderAll();
}

function updateDecimalsFromBinary() {
  let valX = 0;
  let valY = 0;
  for (let i = 0; i < state.n; i++) {
    if (state.X[i] === 1) valX += Math.pow(2, i);
    if (state.Y[i] === 1) valY += Math.pow(2, i);
  }

  document.getElementById('dec-val-x').textContent = `X = ${valX}`;
  document.getElementById('dec-val-y').textContent = `Y = ${valY}`;
  document.getElementById('dec-input-x').value = valX;
  document.getElementById('dec-input-y').value = valY;
}

function updateBinaryFromDecimals() {
  let valX = parseInt(document.getElementById('dec-input-x').value) || 0;
  let valY = parseInt(document.getElementById('dec-input-y').value) || 0;

  // clamp to max value
  const maxVal = Math.pow(2, state.n) - 1;
  if (valX < 0) valX = 0;
  if (valX > maxVal) valX = maxVal;
  if (valY < 0) valY = 0;
  if (valY > maxVal) valY = maxVal;

  document.getElementById('dec-input-x').value = valX;
  document.getElementById('dec-input-y').value = valY;

  state.X = [];
  state.Y = [];
  for (let i = 0; i < state.n; i++) {
    state.X.push((valX >> i) & 1);
    state.Y.push((valY >> i) & 1);
  }

  document.getElementById('dec-val-x').textContent = `X = ${valX}`;
  document.getElementById('dec-val-y').textContent = `Y = ${valY}`;

  state.currentStep = 0;
  renderAll();
}

function handleDecimalKeyPress(e) {
  if (e.key === 'Enter') {
    updateBinaryFromDecimals();
  }
}

// 9. Simulation flow controls
function goToStep(step) {
  const n = state.n;
  const type = state.adderType;
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1;
  const totalSteps = 4 + S;

  if (step < 0) step = 0;
  if (step >= totalSteps) {
    step = totalSteps - 1;
    pauseSim();
  }

  state.currentStep = step;
  renderAll();
}

function stepForward() {
  goToStep(state.currentStep + 1);
}

function stepBackward() {
  goToStep(state.currentStep - 1);
}

function resetSim() {
  pauseSim();
  goToStep(0);
}

function playSim() {
  if (state.isPlaying) {
    pauseSim();
  } else {
    state.isPlaying = true;
    updateControlButtons();
    runAutoPlay();
  }
}

function pauseSim() {
  state.isPlaying = false;
  if (state.timerId) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
  updateControlButtons();
}

function runAutoPlay() {
  if (!state.isPlaying) return;
  
  const n = state.n;
  const type = state.adderType;
  const stages = generatePrefixTree(n, type);
  const S = stages.length - 1;
  const totalSteps = 4 + S;

  if (state.currentStep >= totalSteps - 1) {
    pauseSim();
    return;
  }

  state.timerId = setTimeout(() => {
    stepForward();
    runAutoPlay();
  }, state.speed);
}

function handleSpeedChange(e) {
  const rawSpeed = parseInt(e.target.value);
  // Invert because slider left (min 200ms) means fast, right (max 2500ms) means slow.
  // Wait, slider has min=200, max=2500. We want slider values directly mapped, but speed label corrected.
  state.speed = rawSpeed;
  document.getElementById('speed-display').textContent = `${(rawSpeed / 1000).toFixed(1)}s`;
}

function handleAdderTypeChange(e) {
  state.adderType = e.target.value;
  state.currentStep = 0;
  
  // Set subtitle based on adder type
  const labelText = e.target.options[e.target.selectedIndex].text;
  document.getElementById('viz-card-subtitle').textContent = labelText;
  
  // Re-adjust array sizes if necessary (e.g. Brent-Kung padding)
  adjustInputsForN();
  renderAll();
}

function handleBitsChange(e) {
  state.n = parseInt(e.target.value);
  state.currentStep = 0;
  adjustInputsForN();
  renderAll();
}

function adjustInputsForN() {
  // Re-initialize arrays for new bit-width
  const maxVal = Math.pow(2, state.n) - 1;
  
  // Convert current dec to new boundaries
  let valX = 0;
  let valY = 0;
  for (let i = 0; i < Math.min(state.X.length, state.n); i++) {
    if (state.X[i] === 1) valX += Math.pow(2, i);
  }
  for (let i = 0; i < Math.min(state.Y.length, state.n); i++) {
    if (state.Y[i] === 1) valY += Math.pow(2, i);
  }

  valX = Math.min(valX, maxVal);
  valY = Math.min(valY, maxVal);

  state.X = [];
  state.Y = [];
  for (let i = 0; i < state.n; i++) {
    state.X.push((valX >> i) & 1);
    state.Y.push((valY >> i) & 1);
  }

  updateDecimalsFromBinary();
}

// 10. Translation and Localization
function switchLanguage(lang) {
  state.lang = lang;
  
  // Update class active
  document.getElementById('btn-cz').classList.toggle('active', lang === 'cz');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  
  // Translate HTML elements
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.dataset.translate;
    if (TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // Translate titles/tooltips
  document.querySelectorAll('[data-translate-title]').forEach(el => {
    const key = el.dataset.translateTitle;
    if (TRANSLATIONS[lang][key]) {
      el.title = TRANSLATIONS[lang][key];
    }
  });

  // Reset visualizer labels & subtitles
  const adderSelect = document.getElementById('select-adder');
  const labelText = adderSelect.options[adderSelect.selectedIndex].text;
  document.getElementById('viz-card-subtitle').textContent = labelText;

  renderAll();
}

// Render everything
function renderAll() {
  drawPrefixNetwork();
  updateSlideDisplay();
  updateExplanation();
  updateControlButtons();
}

// 11. Initializer
function init() {
  // Bind actions
  document.getElementById('btn-cz').addEventListener('click', () => switchLanguage('cz'));
  document.getElementById('btn-en').addEventListener('click', () => switchLanguage('en'));

  document.getElementById('select-bits').addEventListener('change', handleBitsChange);
  document.getElementById('select-adder').addEventListener('change', handleAdderTypeChange);

  document.getElementById('dec-input-x').addEventListener('blur', updateBinaryFromDecimals);
  document.getElementById('dec-input-x').addEventListener('keypress', handleDecimalKeyPress);
  document.getElementById('dec-input-y').addEventListener('blur', updateBinaryFromDecimals);
  document.getElementById('dec-input-y').addEventListener('keypress', handleDecimalKeyPress);

  document.getElementById('btn-prev').addEventListener('click', stepBackward);
  document.getElementById('btn-next').addEventListener('click', stepForward);
  document.getElementById('btn-play').addEventListener('click', playSim);
  document.getElementById('btn-reset').addEventListener('click', resetSim);

  document.getElementById('slider-speed').addEventListener('input', handleSpeedChange);

  // Initialize values
  updateDecimalsFromBinary();
  renderAll();
  
  // Set default language strings
  switchLanguage('cz');
}

// Run init on DOM load
window.addEventListener('DOMContentLoaded', init);
