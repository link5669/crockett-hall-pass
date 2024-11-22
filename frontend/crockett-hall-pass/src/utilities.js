const inDev = true
function getBackendURL() {
    if (inDev) {
        return "localhost:5001"
    }
}

export { getBackendURL }