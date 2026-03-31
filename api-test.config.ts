import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log('Test environment is:' + env)

const config = {
    apiUrl: 'https://dummyjson.com',
    userEmail: process.env.QA_USERNAME,
    userPassword: process.env.QA_PASSWORD
}

if (env === 'qa') {
    if (!process.env.QA_USERNAME || !process.env.QA_PASSWORD) {
        throw Error('Missing required environment variables')
    }
    config.userEmail = process.env.QA_USERNAME,
    config.userPassword = process.env.QA_PASSWORD
}

export { config }