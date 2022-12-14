const axios = require('axios')
const chalk = require('chalk')

const fs = require('fs')
const https = require('https');

// Enviroment Data
const dotenv = require('dotenv')
dotenv.config()

const API_TOKEN = process.env.API_TOKEN
const API_URL = process.env.API_URL
const DOWNLOAD_TIMER_MS = process.env.DOWNLOAD_TIMER_MS

const OPTIONS = { headers: {'Content-Type': 'application/json', 'X-API-TOKEN': API_TOKEN} }

const getSurveys = async (offset) => {

    // API Info: https://api.qualtrics.com/2c55b7ff8b0c7-list-surveys

    console.log("Retrieve surveys | ", offset)
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/surveys?${offset}`, OPTIONS).then(response => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

const getAllSurveys = async (offset) => {
    let surveysDataStructure = await getSurveys(offset)
    let surveysData = surveysDataStructure.result.elements
    let offset_url = ''
    try {
        //console.log("OFFSET : ", surveysDataStructure.result.nextPage)
        offset_url = surveysDataStructure.result.nextPage.split("?")[1]
    } catch (error) {}

    if (offset_url != "" ) {
        //console.log("RECALL : ", offset_url)
        return surveysData.concat( await getAllSurveys(offset_url) )
    } else {        
        return surveysData
    }
}

const saveSurveyJSON = async (survey) => {

    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/surveys/${survey.id}`, OPTIONS).then(response => {
            console.log(`          [${chalk.yellow(response.data.result.id)}] <-> Survey ID`)

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
    console.log("         ", chalk.blue(`WAIT ${ms} ms`))
    return new Promise( resolve => { setTimeout(resolve, ms) } )
}

const _initExport = async (survey) => {
    const DATA = { "format": "tsv", "useLabels": "true" }

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

const _saveZippedCSVFile = async (survey, fileID) => {
    const URL = `${API_URL}/surveys/${survey.id}/export-responses/${fileID}/file`

    return new Promise((resolve, reject) => {

        const zipFile = fs.createWriteStream(__dirname + `/../surveys/survey_${survey.name}.zip`)
        const request = https.get(URL, OPTIONS, (response) => {            
            response.pipe(zipFile)

            zipFile.on("finish", () => {
                zipFile.close()
                console.log(`          ${chalk.green("DONE.")}`)
                console.log("")
                resolve(true)
            })
        })

        request.on("error", err => {
            reject(err)
        })

        request.end()
    })
}

const saveSurveyEXPORT = async (survey) => {

    // API Info: https://api.qualtrics.com/41296b6f2e828-get-response-export-file

    // Init survey response export process => returns progressID
    const progressID = await _initExport(survey)    
    
    // Wait until file export finished
    await _sleep(DOWNLOAD_TIMER_MS)

    // Wait to export survey response => return fileID
    const fileID = await _retriveFileID(survey, progressID)

    // Download zipped CSV file into surveys folder
    await _saveZippedCSVFile(survey, fileID)

    // Shuffler
    //await _sleep(10000)

}

module.exports = {
    getAllSurveys,
    saveSurveyJSON,
    saveSurveyEXPORT,
    _sleep
}