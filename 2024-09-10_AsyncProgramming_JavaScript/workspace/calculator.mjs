import readline from "readline";

const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const ONE_SECOND = 1000;
const INITIAL_PROMPT = "Please enter a numerical equation in the form of \u001b[3mX+Y\u001b[23m:\u00a0";

await start();



/**
 * Creates an ellipses with a 1-second delay between characters.
 *
 * @returns {Promise<void>}
 */
async function generateEllipsis()
{
    const ellipsesCount = 3;

    for(let i = 0; i<ellipsesCount; i++)
    {
        process.stdout.write('.');
        await SLEEP(ONE_SECOND);
    }
}

/**
 * Manual Parser.parse(formula)
 *
 * @param x - The left side of the equation
 * @param y - The right side of the equation
 * @param operator - The mathematical operator between x and y
 * @returns {number} - The result of the mathematical equation.
 */
async function calculator(x, y, operator)
{
    process.stdout.write("Generating the result");
    await generateEllipsis();
    console.log('');

    x = parseFloat(x);
    y = parseFloat(y);

    switch(operator)
    {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        default:
            return x / y;
    }
}

/**
 * Creates the interface for readline
 * Prompts the user
 * Closes the interface
 * Returns the user's response.
 *
 * @param prompt - Whatever we want to say to the user.
 * @returns {Promise<unknown>} - User's input
 */
async function getInput(prompt)
{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let input =
        await new Promise((resolve) =>
        {
            rl.question(prompt, (answer) =>
            {
                resolve(answer);
            });
        });
    rl.close();
    return input;

}

/**
 * Parses a user's input as an equation containing two numbers and one operator.
 * Provides error detection against bad inputs, re-requiring upon failure.
 *
 * @param prompt
 * @returns {Promise<void>}
 */
async function start(prompt = "\nYou suck, use the designated format for your equation:\u00a0")
{
    const validOperators = ['+', '-', '*', '/'];
    let counter = 0;
    let solutionFound = false;

    while (!solutionFound)
    {
        let userInput = (counter > 0) ? await getInput(prompt) : await getInput(INITIAL_PROMPT);
        let stringLength = userInput.length;

        let x = '', y = '', operator = '';
        let encounteredX = false, encounteredAnOperand = false, encounteredY = false;
        solutionFound = false;

        try
        {
            for (let i = 0; i < stringLength; i++)
            {
                let char = userInput[i];
                let isCharANumber = !isNaN(char / 2);

                if(!isCharANumber && !validOperators.includes(char))
                {
                    throw new Error('Invalid Equation');
                }
                else if (isCharANumber)
                {
                    switch (encounteredAnOperand) {
                        case true:
                            y = y.concat(char);
                            encounteredY = true;
                            break;
                        default:
                            x = x.concat(char);
                            encounteredX = true;
                            break;
                    }
                }
                else if (validOperators.includes(char) && encounteredX && !encounteredAnOperand)
                {
                    operator = char;
                    encounteredAnOperand = true;
                }
                else if ((i === (stringLength-1)) && !encounteredY)
                {
                    throw new Error('Invalid Equation');
                }
            }
        }
        catch (error)
        {
            console.error(error.message)
        }
        if (encounteredY)
        {
            solutionFound = true;

            process.stdout.write(`${userInput} =\u00a0` + await calculator(x, y, operator));
            await SLEEP(ONE_SECOND);
            console.log('');
        }
        counter++;
    }
}