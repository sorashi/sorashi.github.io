// Parallel P-Way Merge Sort: Splitters by Rank Visualizer Logic

// Default Subarrays
let S = [
  [2, 5, 8, 12, 16, 20, 24, 28, 33, 37, 40, 45],
  [1, 4, 7, 10, 15, 18, 22, 27, 31, 35, 39, 44],
  [3, 6, 9, 11, 14, 19, 21, 26, 30, 34, 38, 42]
];

const P = 3; // 3 threads / 3 arrays
let N = S.reduce((acc, arr) => acc + arr.length, 0);
let elementsPerSubarray = S[0].length;

// Simulation State
let threads = [];
let currentView = 'all'; // 'all', '0', '1', '2'
let isPlaying = false;
let playInterval = null;
let speedMs = 800;
let globalStepIndex = 0; // Total steps taken in simulation

// DOM Elements
const btnPlay = document.getElementById('btnPlay');
const btnStepBack = document.getElementById('btnStepBack');
const btnStepForward = document.getElementById('btnStepForward');
const btnReset = document.getElementById('btnReset');
const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');
const viewTabs = document.getElementById('viewTabs');
const threadsContainer = document.getElementById('threadsContainer');
const logContainer = document.getElementById('logContainer');
const btnClearLog = document.getElementById('btnClearLog');
const btnRunEpilogue = document.getElementById('btnRunEpilogue');
const epiloguePanel = document.getElementById('epiloguePanel');

// Customizer inputs
const inputS0 = document.getElementById('inputS0');
const inputS1 = document.getElementById('inputS1');
const inputS2 = document.getElementById('inputS2');
const selectBS = document.getElementById('selectBS');
const selectStrategy = document.getElementById('selectStrategy');
const btnApplyData = document.getElementById('btnApplyData');
const btnRandomize = document.getElementById('btnRandomize');

// Binary Search Algorithms
function binarySearchStrict(v, arr) {
  let l = 0;
  let r = arr.length;
  while (l < r) {
    let mid = Math.floor((l + r) / 2);
    if (arr[mid] < v) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return l;
}

function binarySearchUpperBound(v, arr) {
  let l = 0;
  let r = arr.length;
  while (l < r) {
    let mid = Math.floor((l + r) / 2);
    if (arr[mid] <= v) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return l;
}

// Log message to the console panel
function logMessage(text, type = 'system') {
  const timestamp = new Date().toTimeString().split(' ')[0];
  const entry = document.createElement('div');
  entry.className = `log-entry`;
  
  const timeSpan = document.createElement('span');
  timeSpan.className = 'log-entry-time';
  timeSpan.innerText = `[${timestamp}]`;
  entry.appendChild(timeSpan);
  
  const contentSpan = document.createElement('span');
  contentSpan.className = `log-entry-${type}`;
  contentSpan.innerText = text;
  entry.appendChild(contentSpan);
  
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Clear console log
btnClearLog.addEventListener('click', () => {
  logContainer.innerHTML = '';
  logMessage('Log cleared.', 'system');
});

// Initialize Threads Data Structure
function initThreads() {
  threads = [];
  const targetRanks = [0, Math.floor(N / 3), Math.floor((2 * N) / 3)];
  
  for (let t = 0; t < P; t++) {
    threads.push({
      id: t,
      targetRank: targetRanks[t],
      L: new Array(P).fill(0),
      R: new Array(P).fill(elementsPerSubarray - 1),
      m: new Array(P).fill(0),
      sumM: 0,
      pivot: null, // { val, arrayIdx, cellIdx }
      finished: false,
      phase: 'loop_check', // 'loop_check', 'pivot_select', 'binary_search', 'compare_rank', 'update_bounds', 'done'
      currentLine: 1,
      history: [], // stores clones of historical states for step back
      explanation: 'Initializing search bounds.'
    });
  }
  
  globalStepIndex = 0;
  isPlaying = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
  btnPlay.querySelector('.text').innerText = 'Play';
  btnPlay.querySelector('.icon').innerText = '▶';
  
  btnStepBack.disabled = true;
  btnStepForward.disabled = false;
  btnRunEpilogue.style.display = 'none';
  epiloguePanel.style.display = 'none';
  
  logMessage(`Initialized 3 threads. Ranks to find: ${targetRanks.join(', ')}`, 'system');
  
  renderAll();
}

// Render dynamic subarray grid for a thread
function renderThreadSubarrays(thread) {
  const wrapper = document.getElementById(`subarraysWrapper-${thread.id}`);
  wrapper.innerHTML = ''; // Clear previous
  
  const bsType = selectBS.value;
  
  for (let sIdx = 0; sIdx < P; sIdx++) {
    const row = document.createElement('div');
    row.className = 'subarray-row';
    
    const label = document.createElement('div');
    label.className = 'subarray-label';
    label.innerText = `S${sIdx}`;
    row.appendChild(label);
    
    const cellsGrid = document.createElement('div');
    cellsGrid.className = 'array-cells';
    cellsGrid.style.gridTemplateColumns = `repeat(${elementsPerSubarray}, 1fr)`;
    
    for (let cIdx = 0; cIdx < elementsPerSubarray; cIdx++) {
      const cell = document.createElement('div');
      cell.className = 'array-cell';
      
      const val = S[sIdx][cIdx];
      cell.innerHTML = `
        <span class="cell-index">${cIdx}</span>
        <span class="cell-value">${val}</span>
      `;
      
      // Determine active range and boundaries
      const lVal = thread.L[sIdx];
      const rVal = thread.R[sIdx];
      
      if (thread.finished) {
        // Highlight resolved splitters in green
        // Splitters represent starting index of each thread's partition
        const splitterIdx = thread.L[sIdx];
        if (cIdx === splitterIdx) {
          cell.classList.add('splitter-resolved');
          cell.classList.add('splitter-pointer-green');
        } else if (cIdx < splitterIdx) {
          cell.classList.add('dimmed');
        }
      } else {
        // Normal bounds highlighting
        if (cIdx < lVal || cIdx > rVal) {
          cell.classList.add('dimmed');
        } else {
          cell.classList.add('active-range');
          if (lVal === rVal) {
            cell.classList.add('single-bound');
          } else {
            if (cIdx === lVal) cell.classList.add('left-bound');
            if (cIdx === rVal) cell.classList.add('right-bound');
          }
        }
        
        // Highlight selected pivot
        if (thread.pivot && thread.pivot.arrayIdx === sIdx && thread.pivot.cellIdx === cIdx) {
          if (thread.phase === 'binary_search' || thread.phase === 'compare_rank' || thread.phase === 'update_bounds') {
            cell.classList.add('pivot-chosen');
          }
        }
        
        // Show splitter pointer m[sIdx] when computed
        if (thread.phase === 'compare_rank' || thread.phase === 'update_bounds') {
          const mVal = thread.m[sIdx];
          if (cIdx === mVal) {
            cell.classList.add('splitter-pointer');
          }
        }
      }
      
      cellsGrid.appendChild(cell);
    }
    
    row.appendChild(cellsGrid);
    wrapper.appendChild(row);
  }
}

// Render code highlighting, thread cards, pill info
function renderAll() {
  const bsType = selectBS.value;
  const strategy = selectStrategy.value;
  
  // Highlight active tab view
  viewTabs.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-view') === currentView) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Show/Hide thread cards based on current view tab
  for (let t = 0; t < P; t++) {
    const card = document.getElementById(`threadCard-${t}`);
    
    if (currentView === 'all' || currentView === String(t)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
    
    // Update thread card styling classes
    card.classList.remove('active-thread', 'thread-finished');
    if (threads[t].finished) {
      card.classList.add('thread-finished');
    } else if (currentView !== 'all' || !isPlaying) {
      // In single view or paused, highlight the card
      card.classList.add('active-thread');
    }
    
    // Update badge status
    const badge = document.getElementById(`threadBadge-${t}`);
    if (threads[t].finished) {
      badge.innerText = 'Finished';
      badge.className = 'thread-badge finished';
    } else if (isPlaying) {
      badge.innerText = 'Active';
      badge.className = 'thread-badge active';
    } else {
      badge.innerText = 'Paused';
      badge.className = 'thread-badge idle';
    }
    
    // Update info pills
    document.getElementById(`threadBounds-${t}`).innerText = 
      `L[${threads[t].L.join(', ')}], R[${threads[t].R.join(', ')}]`;
    
    document.getElementById(`threadPivot-${t}`).innerText = 
      threads[t].pivot ? `${threads[t].pivot.val} (S${threads[t].pivot.arrayIdx}[${threads[t].pivot.cellIdx}])` : '-';
    
    const rankSumText = threads[t].phase !== 'loop_check' && threads[t].phase !== 'pivot_select' 
      ? `m[${threads[t].m.join(', ')}] = ${threads[t].sumM}`
      : 'm[-, -, -] = -';
    document.getElementById(`threadRanks-${t}`).innerText = rankSumText;
    
    // Render subarray grid
    renderThreadSubarrays(threads[t]);
  }
  
  // Highlight active lines in code view
  // If we are looking at a single thread, use its active line. If 'all', highlight based on active threads.
  const activeCodeLines = new Set();
  let activeThreadAccent = 'var(--color-accent)';
  let activeThreadGlow = 'var(--color-accent-glow)';
  
  if (currentView === 'all') {
    threads.forEach(t => {
      if (!t.finished) activeCodeLines.add(t.currentLine);
    });
  } else {
    const focusedThread = threads[Number(currentView)];
    activeCodeLines.add(focusedThread.currentLine);
    activeThreadAccent = `var(--color-thread-${focusedThread.id})`;
    activeThreadGlow = `var(--color-thread-${focusedThread.id}-glow)`;
  }
  
  // Apply line styling to pseudocode container
  const codeLines = document.getElementById('codeContainer').children;
  for (let i = 0; i < codeLines.length; i++) {
    const lineElement = codeLines[i];
    const lineNum = i + 1;
    
    if (activeCodeLines.has(lineNum)) {
      lineElement.classList.add('highlighted-line');
      lineElement.style.setProperty('--thread-accent', activeThreadAccent);
      lineElement.style.setProperty('--thread-accent-glow', activeThreadGlow);
    } else {
      lineElement.classList.remove('highlighted-line');
      lineElement.style.removeProperty('--thread-accent');
      lineElement.style.removeProperty('--thread-accent-glow');
    }
  }
}

// Deep clone a thread state to save in history
function cloneThreadState(thread) {
  return {
    L: [...thread.L],
    R: [...thread.R],
    m: [...thread.m],
    sumM: thread.sumM,
    pivot: thread.pivot ? { ...thread.pivot } : null,
    finished: thread.finished,
    phase: thread.phase,
    currentLine: thread.currentLine,
    explanation: thread.explanation
  };
}

// Single step execution for a specific thread
function stepThread(thread) {
  if (thread.finished) return;
  
  // Save current state to history before changing
  thread.history.push(cloneThreadState(thread));
  
  const bsType = selectBS.value;
  const strategy = selectStrategy.value;
  const bs = bsType === 'strict' ? binarySearchStrict : binarySearchUpperBound;
  
  switch (thread.phase) {
    
    case 'loop_check':
      // 1. Early check: Has bounds sum matched the target rank?
      const sumL = thread.L.reduce((acc, val) => acc + val, 0);
      const sumR = thread.R.reduce((acc, val) => acc + val, 0);
      
      if (sumL === thread.targetRank) {
        thread.R = [...thread.L];
        thread.finished = true;
        thread.phase = 'done';
        thread.currentLine = 13; // return L;
        thread.explanation = `Early match: sum(L) = ${sumL} matches target rank ${thread.targetRank}. Bounds collapsed.`;
        logMessage(`Thread ${thread.id}: Found splitters early (sum L matches rank ${thread.targetRank}) [${thread.L.join(', ')}]`, `thread-${thread.id}`);
        break;
      }
      
      if (sumR === thread.targetRank) {
        thread.L = [...thread.R];
        thread.finished = true;
        thread.phase = 'done';
        thread.currentLine = 13; // return L;
        thread.explanation = `Early match: sum(R) = ${sumR} matches target rank ${thread.targetRank}. Bounds collapsed.`;
        logMessage(`Thread ${thread.id}: Found splitters early (sum R matches rank ${thread.targetRank}) [${thread.L.join(', ')}]`, `thread-${thread.id}`);
        break;
      }
      
      // 2. Standard loop check: exists i such that L[i] < R[i]
      let existsActive = false;
      for (let i = 0; i < P; i++) {
        if (thread.L[i] < thread.R[i]) {
          existsActive = true;
          break;
        }
      }
      
      if (existsActive) {
        thread.phase = 'pivot_select';
        thread.currentLine = 5; // v = Pickup_Random_Pivot(...)
        thread.explanation = `Condition L[i] < R[i] met. Selecting a random pivot from active bounds.`;
      } else {
        thread.finished = true;
        thread.phase = 'done';
        thread.currentLine = 13; // return L;
        thread.explanation = `No index i has L[i] < R[i]. Search terminated. Return L.`;
        logMessage(`Thread ${thread.id}: Splitters resolved to [${thread.L.join(', ')}]`, `thread-${thread.id}`);
      }
      break;
      
    case 'pivot_select':
      // Pool all candidates in active bounds (only where L[i] <= R[i] and we check activeIndices)
      let activeIndices = [];
      for (let i = 0; i < P; i++) {
        if (thread.L[i] < thread.R[i]) activeIndices.push(i);
      }
      
      // Fallback in case active bounds is empty (should not happen based on loop check)
      if (activeIndices.length === 0) {
        for (let i = 0; i < P; i++) {
          if (thread.L[i] <= thread.R[i]) activeIndices.push(i);
        }
      }
      
      let candidates = [];
      for (let i of activeIndices) {
        for (let j = thread.L[i]; j <= thread.R[i]; j++) {
          candidates.push({ val: S[i][j], arrayIdx: i, cellIdx: j });
        }
      }
      
      if (candidates.length === 0) {
        thread.finished = true;
        thread.phase = 'done';
        thread.currentLine = 13;
        thread.explanation = 'No pivot candidates in bounds. Terminated.';
        break;
      }
      
      // Choose pivot randomly
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      thread.pivot = chosen;
      
      thread.phase = 'binary_search';
      thread.currentLine = 6; // for (i = 0; i < p; i++)
      thread.explanation = `Chosen pivot v = ${chosen.val} from S${chosen.arrayIdx}[${chosen.cellIdx}]. Performing binary search across all subarrays.`;
      logMessage(`Thread ${thread.id}: Selected pivot v = ${chosen.val} from S${chosen.arrayIdx}[${chosen.cellIdx}]`, `thread-${thread.id}`);
      break;
      
    case 'binary_search':
      // Calculate ranks
      let sumM = 0;
      for (let i = 0; i < P; i++) {
        thread.m[i] = bs(thread.pivot.val, S[i]);
        sumM += thread.m[i];
      }
      thread.sumM = sumM;
      
      thread.phase = 'compare_rank';
      thread.currentLine = 8; // if (m[0] + .. + m[p-1] >= rank)
      thread.explanation = `Computed ranks: m = [${thread.m.join(', ')}]. Global rank sum of pivot = ${sumM}. Comparing with target rank ${thread.targetRank}.`;
      logMessage(`Thread ${thread.id}: Binary search results m = [${thread.m.join(', ')}], global sum = ${sumM}`, `thread-${thread.id}`);
      break;
      
    case 'compare_rank':
      // Transition to bound update
      if (thread.sumM >= thread.targetRank) {
        thread.phase = 'update_bounds';
        thread.currentLine = 9; // R = m
        thread.explanation = `Global rank sum (${thread.sumM}) >= target rank (${thread.targetRank}). Narrowing bounds from the RIGHT (R = m).`;
      } else {
        thread.phase = 'update_bounds';
        thread.currentLine = 11; // L = m
        thread.explanation = `Global rank sum (${thread.sumM}) < target rank (${thread.targetRank}). Narrowing bounds from the LEFT (L = m).`;
      }
      break;
      
    case 'update_bounds':
      // Update bounds using strategy
      if (thread.sumM === thread.targetRank) {
        // Optimize: Exact match collapses bounds immediately
        thread.L = [...thread.m];
        thread.R = [...thread.m];
        thread.explanation = `Exact match found! sum(m) = ${thread.sumM} equals target rank ${thread.targetRank}. Collapsing bounds.`;
        logMessage(`Thread ${thread.id}: Pivot rank matches target rank. Collapsing bounds to [${thread.L.join(', ')}]`, `thread-${thread.id}`);
      } else if (thread.sumM > thread.targetRank) {
        // R = m
        if (strategy === 'min_max') {
          for (let i = 0; i < P; i++) {
            thread.R[i] = Math.min(thread.R[i], thread.m[i]);
          }
          thread.explanation = `Updated R = min(R, m) -> R = [${thread.R.join(', ')}].`;
        } else {
          for (let i = 0; i < P; i++) {
            thread.R[i] = thread.m[i];
          }
          thread.explanation = `Updated R = m -> R = [${thread.R.join(', ')}].`;
        }
        logMessage(`Thread ${thread.id}: Narrowed R to [${thread.R.join(', ')}]`, `thread-${thread.id}`);
      } else {
        // L = m
        if (strategy === 'min_max') {
          for (let i = 0; i < P; i++) {
            thread.L[i] = Math.max(thread.L[i], thread.m[i]);
          }
          thread.explanation = `Updated L = max(L, m) -> L = [${thread.L.join(', ')}].`;
        } else {
          for (let i = 0; i < P; i++) {
            thread.L[i] = thread.m[i];
          }
          thread.explanation = `Updated L = m -> L = [${thread.L.join(', ')}].`;
        }
        logMessage(`Thread ${thread.id}: Narrowed L to [${thread.L.join(', ')}]`, `thread-${thread.id}`);
      }
      
      thread.phase = 'loop_check';
      thread.currentLine = 4; // back to while
      break;
      
    case 'done':
      thread.finished = true;
      break;
  }
}

// Rollback a thread state by popping its history
function stepBackThread(thread) {
  if (thread.history.length === 0) return;
  
  const prevState = thread.history.pop();
  thread.L = prevState.L;
  thread.R = prevState.R;
  thread.m = prevState.m;
  thread.sumM = prevState.sumM;
  thread.pivot = prevState.pivot;
  thread.finished = prevState.finished;
  thread.phase = prevState.phase;
  thread.currentLine = prevState.currentLine;
  thread.explanation = prevState.explanation;
}

// Progress all threads concurrently by 1 step
function stepAll() {
  let anyStepped = false;
  
  threads.forEach(t => {
    if (!t.finished) {
      stepThread(t);
      anyStepped = true;
    }
  });
  
  if (anyStepped) {
    globalStepIndex++;
    btnStepBack.disabled = false;
    renderAll();
  } else {
    // All threads finished!
    isPlaying = false;
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
    btnPlay.querySelector('.text').innerText = 'Play';
    btnPlay.querySelector('.icon').innerText = '▶';
    btnStepForward.disabled = true;
    
    logMessage('All threads successfully resolved their splitters!', 'system');
    
    // Show Epilogue Button
    btnRunEpilogue.style.display = 'inline-flex';
  }
}

// Rollback all threads concurrently by 1 step
function stepBackAll() {
  let anyRollback = false;
  
  threads.forEach(t => {
    if (t.history.length > 0) {
      stepBackThread(t);
      anyRollback = true;
    }
  });
  
  if (anyRollback) {
    globalStepIndex--;
    btnStepForward.disabled = false;
    btnRunEpilogue.style.display = 'none';
    epiloguePanel.style.display = 'none';
    
    if (globalStepIndex === 0) {
      btnStepBack.disabled = true;
    }
    
    logMessage(`Stepped back to step ${globalStepIndex}`, 'system');
    renderAll();
  }
}

// Play/Pause toggle
function togglePlay() {
  if (isPlaying) {
    isPlaying = false;
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
    btnPlay.querySelector('.text').innerText = 'Play';
    btnPlay.querySelector('.icon').innerText = '▶';
    logMessage('Simulation paused.', 'system');
    renderAll();
  } else {
    // Verify at least one thread is not finished
    let activeExists = threads.some(t => !t.finished);
    if (!activeExists) {
      logMessage('All threads are already finished. Click Reset to start again.', 'warning');
      return;
    }
    
    isPlaying = true;
    btnPlay.querySelector('.text').innerText = 'Pause';
    btnPlay.querySelector('.icon').innerText = '⏸';
    logMessage('Simulation running...', 'system');
    
    runLoop();
  }
}

// Simulation loop throttle
function runLoop() {
  if (!isPlaying) return;
  stepAll();
  
  if (isPlaying) {
    playInterval = setTimeout(runLoop, speedMs);
  }
}

// Adjust Speed
speedSlider.addEventListener('input', (e) => {
  speedMs = Number(e.target.value);
  speedVal.innerText = `${(speedMs / 1000).toFixed(1)}s`;
  if (isPlaying) {
    // Re-trigger timer
    clearTimeout(playInterval);
    playInterval = setTimeout(runLoop, speedMs);
  }
});

// Event Listeners for controls
btnPlay.addEventListener('click', togglePlay);
btnStepForward.addEventListener('click', stepAll);
btnStepBack.addEventListener('click', stepBackAll);
btnReset.addEventListener('click', initThreads);

// Tab controls
viewTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-btn')) {
    currentView = e.target.getAttribute('data-view');
    renderAll();
  }
});

// Apply Custom Data input
btnApplyData.addEventListener('click', () => {
  try {
    const parseArray = (str) => {
      const arr = str.split(',').map(s => {
        const val = parseInt(s.trim(), 10);
        if (isNaN(val)) throw new Error('Invalid number');
        return val;
      });
      // Verify sorted
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) throw new Error('Array must be sorted!');
      }
      return arr;
    };
    
    const s0 = parseArray(inputS0.value);
    const s1 = parseArray(inputS1.value);
    const s2 = parseArray(inputS2.value);
    
    // Check sizes
    if (s0.length !== s1.length || s1.length !== s2.length) {
      throw new Error('All subarrays must be the same length (n/p) for this visualization!');
    }
    
    S = [s0, s1, s2];
    elementsPerSubarray = s0.length;
    N = S.reduce((acc, arr) => acc + arr.length, 0);
    
    logMessage('Custom data loaded successfully.', 'system');
    initThreads();
    
  } catch (err) {
    alert(`Data error: ${err.message}`);
    logMessage(`Error loading custom data: ${err.message}`, 'warning');
  }
});

// Randomize arrays button
btnRandomize.addEventListener('click', () => {
  const size = 12; // keep size 12
  let allVals = [];
  // Generate random distinct numbers
  while (allVals.length < size * P) {
    let rVal = Math.floor(Math.random() * 98) + 1; // 1 to 99
    if (!allVals.includes(rVal)) allVals.push(rVal);
  }
  
  // Sort and distribute to create 3 sorted subarrays
  allVals.sort((a, b) => a - b);
  
  let s0 = [];
  let s1 = [];
  let s2 = [];
  
  // To make the sorting interesting, we can interleave them or just random partition
  // Standard way: distribute randomly but keep sorted locally
  for (let i = 0; i < size * P; i++) {
    if (i % 3 === 0) s0.push(allVals[i]);
    else if (i % 3 === 1) s1.push(allVals[i]);
    else s2.push(allVals[i]);
  }
  
  s0.sort((a,b)=>a-b);
  s1.sort((a,b)=>a-b);
  s2.sort((a,b)=>a-b);
  
  inputS0.value = s0.join(', ');
  inputS1.value = s1.join(', ');
  inputS2.value = s2.join(', ');
  
  S = [s0, s1, s2];
  elementsPerSubarray = size;
  N = size * P;
  
  logMessage('Generated random sorted subarrays.', 'system');
  initThreads();
});

// Epilogue Animation trigger
btnRunEpilogue.addEventListener('click', animateMergeEpilogue);

function animateMergeEpilogue() {
  epiloguePanel.style.display = 'block';
  epiloguePanel.scrollIntoView({ behavior: 'smooth' });
  
  const t0_splitters = threads[0].L; // [0,0,0]
  const t1_splitters = threads[1].L; // e.g. [4,4,4]
  const t2_splitters = threads[2].L; // e.g. [8,8,8]
  const end_splitters = [elementsPerSubarray, elementsPerSubarray, elementsPerSubarray];
  
  // Fill split text
  document.getElementById('epiSplit-0').innerText = `[${t1_splitters.join(', ')}]`;
  document.getElementById('epiSplit-1').innerText = `[${t1_splitters.join(', ')}]`;
  document.getElementById('epiSplit-2').innerText = `[${t2_splitters.join(', ')}]`;
  document.getElementById('epiSplit-3').innerText = `[${t2_splitters.join(', ')}]`;
  document.getElementById('epiSplit-4').innerText = `[${end_splitters.join(', ')}]`;
  
  // Compute partition sizes
  const size0 = (t1_splitters[0] - t0_splitters[0]) + (t1_splitters[1] - t0_splitters[1]) + (t1_splitters[2] - t0_splitters[2]);
  const size1 = (t2_splitters[0] - t1_splitters[0]) + (t2_splitters[1] - t1_splitters[1]) + (t2_splitters[2] - t1_splitters[2]);
  const size2 = (end_splitters[0] - t2_splitters[0]) + (end_splitters[1] - t2_splitters[1]) + (end_splitters[2] - t2_splitters[2]);
  
  const partitionBar = document.getElementById('partitionBar');
  partitionBar.innerHTML = `
    <div class="partition-segment t0" style="width: ${(size0/N*100).toFixed(1)}%;">Thread 0 (${size0} items)</div>
    <div class="partition-segment t1" style="width: ${(size1/N*100).toFixed(1)}%;">Thread 1 (${size1} items)</div>
    <div class="partition-segment t2" style="width: ${(size2/N*100).toFixed(1)}%;">Thread 2 (${size2} items)</div>
  `;
  
  // Extract elements for each thread
  const t0_elements = [];
  const t1_elements = [];
  const t2_elements = [];
  
  for (let i = 0; i < P; i++) {
    // S0, S1, S2
    for (let c = 0; c < elementsPerSubarray; c++) {
      const val = S[i][c];
      if (c >= t0_splitters[i] && c < t1_splitters[i]) {
        t0_elements.push({ val, origin: i });
      } else if (c >= t1_splitters[i] && c < t2_splitters[i]) {
        t1_elements.push({ val, origin: i });
      } else {
        t2_elements.push({ val, origin: i });
      }
    }
  }
  
  // Fill merging columns with unsorted partitioned chunks
  const fillColumn = (columnId, elements, threadClass) => {
    const container = document.getElementById(columnId);
    container.innerHTML = '';
    elements.forEach(el => {
      const cell = document.createElement('div');
      cell.className = `mini-cell ${threadClass}`;
      cell.innerText = el.val;
      container.appendChild(cell);
    });
  };
  
  fillColumn('mergingCells-0', t0_elements, 't0');
  fillColumn('mergingCells-1', t1_elements, 't1');
  fillColumn('mergingCells-2', t2_elements, 't2');
  
  // Sort elements in each zone locally
  t0_elements.sort((a,b) => a.val - b.val);
  t1_elements.sort((a,b) => a.val - b.val);
  t2_elements.sort((a,b) => a.val - b.val);
  
  // Animate combining to final sorted array after a delay
  const finalContainer = document.getElementById('finalArrayCells');
  finalContainer.innerHTML = '';
  
  const allSorted = [...t0_elements, ...t1_elements, ...t2_elements];
  
  // Animate adding cells step-by-step
  let curIndex = 0;
  function addNextSortedCell() {
    if (curIndex >= allSorted.length) {
      logMessage('Concatenated all merged chunks. Parallel P-Way Merge Sort Complete!', 'system');
      return;
    }
    
    const el = allSorted[curIndex];
    let threadClass = 't0';
    if (curIndex >= size0 && curIndex < size0 + size1) threadClass = 't1';
    else if (curIndex >= size0 + size1) threadClass = 't2';
    
    const cell = document.createElement('div');
    cell.className = `mini-cell ${threadClass}`;
    cell.style.width = '32px';
    cell.style.height = '32px';
    cell.style.fontSize = '0.9rem';
    cell.style.opacity = '0';
    cell.style.transform = 'translateY(15px)';
    cell.style.transition = 'all 0.4s ease-out';
    cell.innerText = el.val;
    
    finalContainer.appendChild(cell);
    
    // Trigger transition
    setTimeout(() => {
      cell.style.opacity = '1';
      cell.style.transform = 'translateY(0)';
    }, 50);
    
    curIndex++;
    setTimeout(addNextSortedCell, 40); // animate fast
  }
  
  setTimeout(addNextSortedCell, 1000);
}

// Initialise on load
initThreads();
logMessage('Welcome! Click Play or Step Forward to start splitter selection.', 'system');
