const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')

// Enviroment Data
const dotenv = require('dotenv')
dotenv.config()

const API_TOKEN = process.env.API_TOKEN
const API_URL = process.env.API_URL

const OPTIONS = { headers: {'Content-Type': 'application/json', 'X-API-TOKEN': API_TOKEN} }

const getSurveys = () => {    
    console.log("---> Retrieving all surveys from API TOKEN...")
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/surveys`, OPTIONS).then(response => {
            resolve(response.data.result)
        }).catch(err => {
            reject(err)
        })
    })
}

const saveSurveyJSON = async (survey) => {

    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/surveys/${survey.id}`, OPTIONS).then(response => {
            console.log(`          [${chalk.yellow(response.data.result.id)}] JSON saved`)

            // Save survey json data to disk
            let data_survey = JSON.stringify(response.data.result);
            fs.writeFileSync(__dirname + `/../surveys/survey_${survey.name}.json`, data_survey)
            resolve(true)

        }).catch(err => {
            reject(err)
        })
    })
}

const _sleep = async (ms) => {
    console.log("          ", chalk.blue(`WAIT ${ms} ms`))
    return new Promise( resolve => { setTimeout(resolve, ms) } )
}

const _initExport = async (survey) => {
    const DATA = { "format": "csv" }

    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/surveys/${survey.id}/export-responses`, DATA, OPTIONS).then(response => {
            console.log(`          [${chalk.magenta(response.data.result.progressId)}] <-> Progress ID`)
            console.log(`          [${chalk.cyan(response.data.result.status)}]         <-> Status`)
            resolve(response.data.result.progressId)

        }).catch(err => {
            reject(err)
        })
    })
}

const _retriveFileID = async (survey, progressID) => {
    const URL = `${API_URL}/surveys/${survey.id}/export-responses/${progressID}`

    return new Promise((resolve, reject) => {
        axios.get(URL, OPTIONS).then(response => {
            console.log(`          [${chalk.green(response.data.result.fileId)}] <-> File ID`)
            console.log(`          [${chalk.cyan(response.data.result.status)}]           <-> Status`)
            resolve(response.data.result.fileId)

        }).catch(err => {
            reject(err)
        })
    })
}

const _saveZippedCSVFile = async () => {
    const URL = `${API_URL}/surveys/${survey.id}/export-responses/${progressID}`

    return new Promise((resolve, reject) => {
        axios.get(URL, OPTIONS).then(response => {
            console.log(`          [${chalk.green(response.data.result.fileId)}] <-> File ID`)
            console.log(`          [${chalk.cyan(response.data.result.status)}]           <-> Status`)
            resolve(response.data.result.fileId)

        }).catch(err => {
            reject(err)
        })
    })
}

const saveSurveyEXPORT = async (survey) => {

    // Init survey response export process => returns progressID
    const progressID = await _initExport(survey)    
    _sleep(4000)

    // Wait to export survey response => return fileID
    const fileID = await _retriveFileID(survey, progressID)


    // Download zipped CSV file into surveys folder
    

    // Shuffler
    _sleep(9000)

}

module.exports = {
    getSurveys,
    saveSurveyJSON,
    saveSurveyEXPORT,
    sleep
}