import imageDownloader from "image-downloader"
import axios from "axios"

import IEnlargeConfig from "./interfaces/enlarge-config"
import { sleep } from "./utils"

const baseUrl = "https://bigjpg.com/api"

class BigjpgError extends Error {}

class BigjpgImage {
    private imageUrl: string

    constructor(imageUrl: string) {
        this.imageUrl = imageUrl
    }

    getUrl(): string {
        return this.imageUrl
    }

    async download(dest: string) {
        await imageDownloader.image({
            url: this.imageUrl,
            dest: dest,
            agent: true,
            auth: null,
            headers: undefined,
            maxHeaderSize: undefined,
            timeout: 0
        })
    }
}

class BigjpgTask {
    private url: string
    private taskId: string

    constructor(url: string, taskId: string) {
        this.url = url
        this.taskId = taskId
    }

    async fetchUntilAchieveTheResult() {
        while (true) {
            const response = await axios.get(this.url)
            const dataResponse = response.data

            const data = dataResponse[this.taskId]

            const status = data.status

            if (status === "success") {
                return data 
            } else if (status === "error") {
                throw new BigjpgError("Error processing the image!")
            }

            await sleep(.5)
        }
    }
}

class Bigjpg {
    private apiToken: string

    constructor(apiToken: string) {
        this.apiToken = apiToken
    }

    async enlarge(
        style: string,
        noise: string,
        enlargeValue: string,
        imageUrl: string
    ): Promise<BigjpgImage> {
        const url = `${baseUrl}/task/`
        const config: IEnlargeConfig = {
            style: style,
            noise: noise,
            x2: enlargeValue,
            input: imageUrl
        }

        const headers = { "X-API-KEY": this.apiToken }
        const data = { "conf": JSON.stringify(config) }

        const response = await axios.post(url, data, { headers })
        const dataResponse = response.data

        if (Object.keys(dataResponse).includes("status")) {
            const status = dataResponse.status

            if (status === "valid_api_key_required") {
                throw new BigjpgError("Invalid API token, get your API token on the website by registering 'https://bigjpg.com/' and going to the 'API' section and copying your token that is present in the example code")
            } else if (status === "param_error") {
                throw new BigjpgError("Some invalid parameter, check parameters and features available in your account and try again")
            }
        }

        const remainingApiCalls = dataResponse.remaining_api_calls

        console.log(`> [Bigjpg-info] Remaining API calls: ${remainingApiCalls}`)

        const taskId = dataResponse.tid
        const taskUrl = `${baseUrl}/task/${taskId}`
        const task = new BigjpgTask(taskUrl, taskId)
        const taskResult = await task.fetchUntilAchieveTheResult()

        const enlargedImageUrl = taskResult.url
        const enlargedImage = new BigjpgImage(enlargedImageUrl)
        
        return enlargedImage
    }
}

export default Bigjpg