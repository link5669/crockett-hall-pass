import "dotenv/config.js";

function getBackendURL() {
    if (process.env.PRODUCTION == 'false') {
        return "http://localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

export { getBackendURL }