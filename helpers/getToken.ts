import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
import { APILogger } from "../utils/logger";
import { request } from "@playwright/test";

export async function getToken(email: string, password: string) {
    const context = await request.newContext()
    const logger = new APILogger()
    const api = new RequestHandler(context, config.apiUrl, logger)

    try {
        const tokenResponse = await api
            .path('/auth/login')
            .body({ "username": email, "password": password, "expiresInMins": 30 })
            .postRequest(200)
        return 'Bearer ' + tokenResponse.accessToken
    } catch (error: any) {
        Error.captureStackTrace(error, getToken)
        throw error
    } finally {
        context.dispose()
    }
}