import readline from 'readline';

/**
 * Generates a random integer between a lower and an upper bound (inclusive).
 * If only one argument is provided, assumes the lower bound is 0.
 * @param {number} lower The lower bound of the range.
 * @param {number} [upper] The upper bound of the range (optional).
 * @returns {number} A random integer between lower and upper (inclusive).
 */
function randomInteger(lower, upper)
{
    if (upper === undefined)
    {
        upper = lower;
        lower = 0;
    }
    return lower + Math.floor(Math.random() * (upper - lower + 1));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Guessing game with input validation
 *
 * @returns {Promise<void>}
 */
async function guessingGame()
{
    const randomNumber = randomInteger(1,100);

    const guessesRemaining = 5; // This is constant because I do not need it to change for my code.
    const roundPrompts = ["First Round... What is your guess?\u00a0", "Better luck this round...What will it be?\u00a0", "Alright, three more tries...Enter your guess:\u00a0", "C'Mon I believe in you! What are you guessing?\u00a0", "Last chance...Don't mess it up:\u00a0"];
    const winningMessage = "Congratulations! You Guessed Correctly!!";
    const losingMessage = "You're out of guesses, better luck next time :(";
    const didntGuessRightAcknowledgements = ["Not quite....\u00a0", "Hmmm...\u00a0", "You're close...\u00a0", "Almost...\u00a0" ];
    const invalidInput = "Please only enter a number that is between 1 and 100.  Try again:\u00a0"

    for (let i = 0; i < guessesRemaining; i++)
    {
        let input = 0;
        let validInput = false;
        while(!validInput) {
            try {
                input =
                    await new Promise((resolve) => {
                        rl.question(roundPrompts[i], (answer) => {
                            resolve(parseInt(answer));
                        });
                    });
                if(input < 1 || input > 100 || isNaN(input))
                {
                    throw new Error("Invalid Input");
                }
                validInput = true;
            }
            catch (error)
            {
                console.error(error.message)
            }
        }
        //input = user's input
        if (input === randomNumber)
        {
            //They won
            console.log(winningMessage);
            break;
        }
        else if (i === 4)
        {
            //They lost
            console.log(`${losingMessage}\nThe answer was ${randomNumber}`);
        }
        else
        {
            //Tell them they didn't guess correctly
            let stringAddition = (input>randomNumber)?"Lower":"Higher"
            console.log(`${didntGuessRightAcknowledgements[i]}${stringAddition}`);
        }
    }
}

await guessingGame();

rl.close();


