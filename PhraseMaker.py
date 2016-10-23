import random, math, string
from operator import itemgetter

# Size of the population.
# Not related to the length of the target string.
popSize = 256

# Chance out of 1 that each letter will be randomised.
mutability = 0.02

genNum = 0 # The number of generations iterated.

finalPhrase = "To be or not to be, that is the question." # Target phrase.
# Moved to bottom to be taken as input, only use this phrase if (no input is happen?) <- How are no input is happen(?)
phraseLen = len(finalPhrase) # Set the length of the string.

alphabetu = string.ascii_uppercase
alphabetl = string.ascii_lowercase
punct = string.punctuation
digits = string.digits
chooseFrom = alphabetu + ' ' + alphabetl + punct + digits# String to choose randomly from.

# Generate a random population of n phrases, each of length phraseLen.
def populate(length):
    temp = []
    for i in range(length):
        creature = ''.join(random.sample(chooseFrom, phraseLen))
        temp.append(creature)
    genNum = 1
    return temp

# Toggle the case of a letter passed.
def toggleCase(l):
    if l.upper() == l:
        return l.lower()
    return l.upper()
# This function is never used, but I could use it to make the correct letter
# in the wrong case worth some fitness, if theis function was enabled for mutation.

# Function to calculate the value of a given phrase and the target phrase.
def evaluate(phrase, goal):
    fitness = 0
    for i in range(len(phrase)):
        if phrase[i] == goal[i]:
            fitness += 1
    fitness = fitness**2
    return fitness

# Function to reproduce given two creatures.
# Uses simple crossover of first half of first creature and second half of second creature.
def reproduce(phrase1, phrase2):
    wordLen = len(phrase1)
    if wordLen != len(phrase2):
        return phrase1
    offspring = str()
    for i in range(wordLen):
        if i < math.ceil(wordLen/2):
            offspring += phrase1[i]
        else:
            offspring += phrase2[i]
    offspring = mutate(offspring, mutability)
    return offspring

# Mutate a word using a passed mutability multiplier.
def mutate(word, chance):
    wordList = list(word)
    mutateList = []
    if chance != 0:
        for i in range(int(math.floor(1/chance))-1):
            mutateList.append(False)
    mutateList.append(True)
    for i in range(len(word)):
        mutateBool = random.choice(mutateList)
        if mutateBool:
            wordList[i] = random.choice(chooseFrom)
    return ''.join(wordList)

# Kill the last half of a population of creatures.
def killWorst(pop):
    killNum = int(math.floor(len(pop)/2))
    survivors = pop
    for i in range(killNum):
        del(survivors[len(pop) - killNum])
    return survivors

# Get a random pair for 'mating'.
def getPair(valpop):
    matingPool = []
    for i in valpop:
        for chance in range(i[0]):
            matingPool.append(i[1])
    pair = random.sample(matingPool, 2)
    return pair

# Load and return the next generation of 'creatures'.
def nextGen(pop):
    valuedPop = [] # TODO: make the previous gen's valuedPop persist so we only have to evaluate half.
    population = pop
    for word in population:
        fitness = evaluate(word, finalPhrase) # Evaluate the fitness of the word.
        valuedPop.append((fitness, word)) # Add the fitness and word to the list.
    valuedPop.sort(key=itemgetter(0), reverse=True) # Sort best to worst.
    print("Best: " + str(valuedPop[0][1]))
    print("Best fitness: " + str(valuedPop[0][0]))
    print("Generation: " + str(genNum + 1))
    del(population)
    population = []
    for i in valuedPop:
        population.append(i[1])
    # If the program has finished.
    if valuedPop[0][1] == finalPhrase:
        return population, True
    population = killWorst(population) # Kill off the weaklings.
    valuedPop = killWorst(valuedPop)
    population2 = []
    # Repopulate the recently 'freed' slots in the population.
    for i in range(int(math.floor(len(population)/2))):
        # Generate an offspring per 2 parents.
        pair = getPair(valuedPop)
        population2.append(reproduce(pair[0], pair[1]))
        pair = getPair(valuedPop)
        # Do it twice to generate 2 offspring per 2 parents.
        # This returns us to the original population size.
        population2.append(reproduce(pair[0], pair[1]))
    for i in population2:
        population.append(i)
    # Mutate everything again.
    for i in range(len(population)):
        population[i] = mutate(population[i], mutability)
    return population, False


# Do stuff here.
finalPhrase = str(raw_input("Phrase to search for: ")) # Target phrase from user input.
phraseLen = len(finalPhrase) # Set the length of the target.
population = populate(popSize) # Make the first generation.
fin = False
while not fin:
    population, fin = nextGen(population) # Iterate to the next generation
    genNum += 1
print("Completed, iterated over " + str(genNum) + " generations.")
