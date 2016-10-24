var popSize = 512; // How many creatures in the population.
var mutability = 0.02; // Probability that any letter of 'DNA' will mutate at a time.
var genNum = 0; // Used to keep track of the generation number.
var finalPhrase = "To be or not to be, that is the question."; // Shouldn't be used at all.

var phraseLen = finalPhrase.length; // Length of the target.

var chooseFrom = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

// Function to generate a random string of length len.
function randomString(len) {
    var randomString = '';
    for (var p = 0; p < len; p++) {
    	var randomPoz = Math.floor(Math.random() * chooseFrom.length);
    	randomString += chooseFrom.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

// Function to populate the first generation with n creatures.
function populate(length) {
  var temp = [];
  for (var i = 0; i < length; i++) {
    var creature = randomString(phraseLen);
    temp[i] = creature;
  }
  return temp;
}

// Function to evaluate the fitness of a passed creature.
function evaluate(phrase, goal) {
  var fitness = 0;
  for (var a = 0; a < phrase.length; a++) {
    if (phrase[a] == goal[a]) {
      fitness++;
    }
  }
  fitness = fitness * fitness;
  return fitness;
}

// Function to mutate a word using a passed mutability multiplier.
function mutate(word, chance) {
  var wordList = [];
  var newWord = "";
  for (var a = 0; a < word.length; a++) {
    wordList.push(word[a]);
    // D&D-style chance calculation here. Lifted from Dan Shiffman's code.
    if (Math.random() < chance) {
      wordList[a] = randomString(1);
    }
    newWord += wordList[a]
  }
  return newWord;
}

// Function to reproduce given two parents.
// Uses the first half of the first parent and the second half of the second parent.
function reproduce(parent1, parent2) {
  var wordLen = parent1.length;
  if (wordLen > parent2.length) {
    return parent1;
  } else if (wordLen < parent2.length) {
    return parent2;
  }
  var offspring = "";
  for (var z = 0; z < wordLen; z++) {
    if (z < Math.ceil(wordLen/2)) {
      offspring += parent1[z];
    } else {
      offspring += parent2[z];
    }
  }
  offspring = mutate(offspring, mutability);
  return offspring;
}

// Function to delete the latter half of a passed list.
function killWorst(pop) {
  var killNum = Math.floor(pop.length/2);
  var survivors = pop;
  survivors.splice(pop.length - killNum, killNum);
  return survivors;
}

// Function to return a mating pool.
function makePool(vals, pop) {
  var matingPool = [];
  for (var a = 0; a < vals.length; a++) {
    for (var b = 0; b < vals[a]; b++) {
      matingPool.push(pop[b]);
    }
  }
  return matingPool;
}

// Function to return a random pair for mating.
function getPair(pool) {
  // This caused a problem for short target strings where none of the first generation
  // had a fitness greater than 0, so the matingPool was left empty.
  if (pool.length < 2) {
    pool.push(randomString(phraseLen));
    pool.push(randomString(phraseLen));
  }
  var mate1 = false;
  var mate2 = false;
  while ((!(mate1)) || (!(mate2))) {
    mate1 = pool[Math.floor(Math.random() * pool.length)];
    mate2 = pool[Math.floor(Math.random() * pool.length)];
  }
  pair = [];
  pair.push(mate1);
  pair.push(mate2);
  return pair;
}

// Function to update the elements on the page.
function draw(pop, vals) {
  document.getElementById("outputarea1").innerHTML = "Best: " + pop[0];
  document.getElementById("outputarea2").innerHTML = "Best fitness: " + vals[0];
  document.getElementById("outputarea3").innerHTML = "Generation: " + (genNum + 1);
}

// Function to iterate to the next generation given the current generation.
function nextGen(pop) {
  valuedPop = []; // TODO: make this persist though generations so we don't evaluate the same creature multiple times.
  for (var i = 0; i < pop.length; i++) {
    fitness = evaluate(pop[i], finalPhrase);
    valuedPop.push([fitness, pop[i]]);
  }
  delete i;
  valuedPop.sort(function(a, b){return b[0]-a[0]});
  delete pop;
  pop = []
  vals = []
  for (var i = 0; i < valuedPop.length; i++) {
    vals.push(valuedPop[i][0]);
    pop.push(valuedPop[i][1]);
  }
  delete i;
  delete valuedPop;
  setTimeout(draw(pop, vals), 100);
  //draw(pop, vals);
  console.log("Best: " + pop[0]);
  console.log("Best fitness: " + vals[0]);
  console.log("Generation: " + (genNum + 1));
  // If we are done.
  if (pop[0] == finalPhrase) {
    return [pop, false];
  }
  pop = killWorst(pop);
  vals = killWorst(vals);
  pop2 = [];
  // Only generate the pool once to reduce runtime.
  matingPool = makePool(vals, pop);
  for (var x = pop.length; x > 0; x--) {
    pair = getPair(matingPool);
    pop.push(reproduce(pair[0], pair[1]));
  }
  delete matingPool;
  for (var i = 0; i < pop.length; i++) {
    pop[i] = mutate(pop[i], mutability);
  }
  return [pop, true];
}

function nextIteration() {
  returned = nextGen(population);
  delete population;
  population = returned[0];
  cont = returned[1];
  delete returned;
  genNum++;
  if (cont) {
    setTimeout(nextIteration, 10);
  } else {
    alert("Completed!");
  }
}


// Do stuff here.

// Get the final phrase from the user.
var finalPhrase = prompt("Please enter a phrase\nto evolve towards.", "To be or not to be.");
var phraseLen = finalPhrase.length;
population = populate(popSize); // Make the first generation.
var cont = true;

setTimeout(nextIteration, 10);
//alert("Completed!");
