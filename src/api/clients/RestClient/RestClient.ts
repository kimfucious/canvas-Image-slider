import { APIResponse } from "../../../types/api/response";
import axios, { AxiosRequestConfig } from "axios";

export default class RestClient {
    private _endpoint: string = "";

    constructor(endpoint: string) {
        if (endpoint) {
            this._endpoint = endpoint;
        }
    }

    private async _get<Data>(
        input: AxiosRequestConfig,
        init?: RequestInit
    ): Promise<APIResponse<Data> | null> {
        return axios(input);
    }

    protected async GET<Data>(path: string): Promise<Data | undefined> {
        try {
            const resp = await this._get<Data>({
                url: `${this._endpoint}/${path}`,
            });
            return resp?.data;
        } catch (error) {
            throw error;
        }
    }
}
