let items = [
  { title: "Banner", weight: 1, shown: 0, repeatingPenalty: 5 },
  { title: "Video", weight: 2, shown: 0, repeatingPenalty: 3 },
  { title: "Affiliate", weight: 3, shown: 0, repeatingPenalty: 2 },
  { title: "Category", weight: 4, shown: 0, repeatingPenalty: 1 },
  { title: "Product", weight: 5, shown: 0, repeatingPenalty: 1 },
];

/**
 * Weighted random pick
 */
function pickRandom(items, n = 3) {
  const arr = [...items];
  const selected = [];

  for (let i = 0; i < n && arr.length > 0; i++) {
    // calculate weighted score
    const totalWeight = arr.reduce((sum, it) => sum + (it.weight / (1 + it.shown * it.repeatingPenalty)), 0);
    let r = Math.random() * totalWeight;
    
    for (let j = 0; j < arr.length; j++) {
      const w = arr[j].weight / (1 + arr[j].shown * arr[j].repeatingPenalty);
      r -= w;
      if (r <= 0) {
        selected.push(arr[j]);
        arr.splice(j, 1); // remove from list
        break;
      }
    }
  }

  // increment shown
  selected.forEach(it => it.shown++);

  return selected;
}

/**
 * Live feed simulation
 */
let round = 1;
function simulateFeed() {
  console.log(`\n--- Round ${round} ---`);
  const rec = pickRandom(items, 3);
  console.table(rec.map(it => ({
    title: it.title,
    shown: it.shown
  })));

  // converge after some rounds (keep top 3 weights only)
  if (round === 10) {
    items = items.filter(it => it.weight >= 3);
  }

  round++;
  setTimeout(simulateFeed, 2000);
}

simulateFeed();
