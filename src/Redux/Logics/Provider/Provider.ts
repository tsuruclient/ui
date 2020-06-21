import { APIKeyType } from "../Types/API/APIKeyType";
import { ServiceObject } from "../Types/StoredObject/Service/ServiceObject";
import { ProviderObject } from "../Types/StoredObject/Provider/ProviderObject";
import Authorization from "../API/Authorization";

export default class Provider {
    private readonly _name: string;
    private readonly _baseUrl: string; // https://slack.com/api/, https://api.twitter.com/, https://mstdn.jp/api/v1/ ...
    private readonly _domain: string; // mstdn.jp, pawoo.net...
    private readonly _apiKey: APIKeyType;
    private readonly _auth: Authorization;

    constructor(serviceSource: ServiceObject, providerSource: ProviderObject) {
        this._name = providerSource.providerName;
        this._baseUrl = providerSource.baseUrl;
        this._domain = providerSource.domain;
        this._apiKey = {
            ApiKey: providerSource.apiKey,
            ApiSecretKey: providerSource.apiSecret,
        };

        this._auth = new Authorization(serviceSource.apiSet.authorization, this._apiKey);
    }
}
