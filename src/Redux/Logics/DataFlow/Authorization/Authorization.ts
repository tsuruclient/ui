import OAuth1 from "./OAuth1";
import OAuth2 from "./OAuth2";
import { AuthInfoType } from "../Types/AuthInfoType";
import { AuthorizationUnitObject } from "../Service/ApiSet/AuthorizationUnitObject";
import { APIKeyType, TokenType } from "../Types/APIKeyType";
import { OAuthVersion } from "../Types/Authorization/OAuthVersion";
import { UnknownAuthorizationMethod } from "../../../Exceptions";
import { APIPayloadType } from "../Types/APIPayloadType";
import { CombinedParameterDataType } from "../Types/CombinedParameterDataType";
import { ApiUnitObject } from "../Service/ApiSet/ApiUnitObject";
import { Exportable } from "../../HelperType/Exportable";

export type AuthorizationDataObject = {
    token: string;
    tokenSecret?: string;
    refreshTokenObject?: RefreshTokenObject;
};

export type RefreshTokenObject = {
    refreshToken: string;
    tokenAcquisitionDate: number; // unix time
    tokenExpireDate: number; // unix time
};

export type AuthorizePaths = {
    requestAuthorizeTokenPath?: string;
    requestAuthorizePagePath: string; // required
    requestAccessTokenPath: string; // required
    requestTokenRefreshPath?: string;
};

export class Authorization implements Exportable<AuthorizationUnitObject> {
    private readonly _info: AuthInfoType;
    private readonly _scopeOriginal?: string[];
    private readonly _authorizePaths: AuthorizePaths;
    public auth: OAuth1 | OAuth2;

    constructor(source: AuthorizationUnitObject, optional: { apiKey: APIKeyType }) {
        this._info = {
            apiKey: optional.apiKey,
            oauthVersion: source.oauthVersion,
            authMethod: source.authMethod,
            signMethod: source.signMethod,
            signSpace: source.signSpace,
            scope: source.scope ? source.scope.reduce((p, c): string => p + " " + c, "") : undefined,
            callback: source.callback,
        };

        this._authorizePaths = {
            requestAuthorizeTokenPath: source.requestAccessTokenPath,
            requestAuthorizePagePath: source.requestAuthorizePagePath,
            requestAccessTokenPath: source.requestAccessTokenPath,
            requestTokenRefreshPath: source.requestTokenRefreshPath,
        };

        switch (this._info.oauthVersion) {
            case OAuthVersion.OAuth1:
                this.auth = new OAuth1();
                break;
            case OAuthVersion.OAuth2:
                this.auth = new OAuth2();
                break;
            default:
                throw UnknownAuthorizationMethod;
        }
    }

    get apiKey(): APIKeyType {
        return this._info.apiKey;
    }

    public getAuthorizationData(
        baseUri: string,
        api: ApiUnitObject,
        token: TokenType,
        payload: APIPayloadType
    ): CombinedParameterDataType {
        return this.auth.getAuthorizationData(baseUri, api, this._info, token, payload);
    }

    export(): AuthorizationUnitObject {
        return {
            apiUrl: this._info.apiUrl,
            oauthVersion: this._info.oauthVersion,
            authMethod: this._info.authMethod,
            signMethod: this._info.signMethod,
            signSpace: this._info.signSpace,
            scope: this._scopeOriginal,
            callback: this._info.callback,
            ...this._authorizePaths,
        };
    }
}