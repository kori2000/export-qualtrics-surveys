const chalk = require('chalk')

const helper = require('./helper.js')

// Enviroment Data
const dotenv = require('dotenv')
dotenv.config()

/**
 * ------------------------------
 * Qualtics Settings
 * ------------------------------
 */
const API_TOKEN = process.env.API_TOKEN
const API_URL = process.env.API_URL

/**
 * ------------------------------
 * Application
 * ------------------------------
 */

const intro = async () => {
    console.clear()
    console.log(chalk.blue("* * * * * * * * * * * * * * *"))
    console.log(chalk.yellow(' Qualtics Survey Downloader'))
    console.log(chalk.blue("* * * * * * * * * * * * * * *"))
    console.log()

    console.log(chalk.green("API TOKEN :"), chalk.red(API_TOKEN))
    console.log(chalk.green("API URL   :"), chalk.red(API_URL))
    console.log()
}

const main_app = async () => {

    // Common Information
    await intro()

    // Get all surveys from API Token
    const surveys = await helper.getSurveys()

    let counter = 0
    let surveys_length  = Object.keys(surveys.elements).length    
    console.log(`Found [${chalk.magenta(surveys_length)}] surveys`)
    console.log("")

    //Loop through surveys and save structure and response data in folder surveys
    for await (const survey of surveys.elements) {
        console.log(`[${++counter}/${surveys_length}] ID [${survey.id}] | ${survey.name}`)

        // Save survey structor as json
        await helper.saveSurveyJSON(survey)

        // Save surves response zipped file as csv
        await helper.saveSurveyEXPORT(survey)
    }
    
    // Done
    console.log("")
    console.log(chalk.green("Done. Bye, bye..."))
    console.log("")
}

// Init Application
main_app()