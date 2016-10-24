# WordEvolution
A Python (and now JS) project to evolve random strings towards a target word/phrase.
When run it will request a string to use as the target.
Theoretically the target string could be the source code for the program.

It will then generate a population of random strings of equal length to the target.
Based on their similarity to the target the strings 'reproduce', after the worst half are removed, to refill the population.
This will happen repeatedly until the target phrase is achieved.

Supported characters are: all lowercase letters, uppercase letters, digits, punctuation, and the space character.

This project doesn't require any additional libraries for python to be installed.

The idea for this project was stolen from Daniel Shiffman's "The Nature of Code", but all the code was written by myself.

This project is entirely useless apart from to show how we can use variation, heredity, and 'natural' selection to iterate towards an ideal goal.
