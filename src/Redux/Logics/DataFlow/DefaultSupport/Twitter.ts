import { OAuthVersion } from "../Types/Authorization/OAuthVersion";
import { AuthorizeMethod } from "../Types/Authorization/AuthorizeMethod";
import { SignMethod } from "../Types/Authorization/SignMethod";
import { SignSpace } from "../Types/Authorization/SignSpace";
import { HttpMethods } from "../Types/HttpMethods";
import { ApiParameterMethods } from "../Types/ApiParameterMethods";
import { Protocol } from "../Types/Protocol";
import { ProviderObject } from "../Provider/ProviderControl";
import { DataFormat, DataSetsObject } from "../Data/DataSetControl";

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiSet = {
    requestAuthToken: {
        path: "oauth/request_token",
        protocol: Protocol.rest,
        httpMethod: HttpMethods.POST,
        parameterDef: {
            Authorization: {
                required: true,
                type: ApiParameterMethods.Header,
            },
            oauth_callback: {
                required: true,
                type: ApiParameterMethods.Header,
            },
        },
        returnedDataKey: "oauth_request_token",
    },
    updateStatus: {
        path: "statuses/update",
        protocol: Protocol.rest,
        httpMethod: HttpMethods.POST,
        parameterDef: {
            status: {
                required: true,
                type: ApiParameterMethods.Query,
            },
            in_reply_to_status_id: {
                required: false,
                type: ApiParameterMethods.Query,
            },
        },
        returnedDataKey: "status",
    },
    homeTimeline: {
        path: "statuses/home_timeline",
        protocol: Protocol.rest,
        httpMethod: HttpMethods.GET,
        parameterDef: {},
        returnedDataKey: "statusList",
    },
    mentionsTimeline: {
        path: "statuses/mentions_timeline",
        protocol: Protocol.rest,
        httpMethod: HttpMethods.GET,
        parameterDef: {},
        returnedDataKey: "statusList",
    },
};

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dataSet: DataSetsObject = {
    oauth_request_token: {
        transform: {
            schema: {
                name: "oauth_token",
                idAttribute: "oauth_token",
                transform: {
                    oauth_token: "oauth_token",
                    oauth_token_secret: "oauth_token_secret",
                    oauth_callback_confirmed: "oauth_callback_confirmed",
                },
            },
        },
        dataFormat: DataFormat.qs,
    },
    status: {
        transform: {
            schema: {
                id: "id_str",
                date: "created_at",
                content: {
                    text: "text",
                    entity: "entities",
                },
            },
        },
    },
    statusList: {
        transform: [
            {
                _key: "_root",
                schema: {
                    id_str: "id",
                    created_at: "created_at",
                    text: "text",
                },
            },
        ],
    },
    user: {
        transform: {
            schema: {
                id: "id_str",
            },
        },
    },
};

const serviceKey = "twitter";

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const provider: ProviderObject = {
    serviceKey,
    providerName: "twitter.com",
    providerKey: "twitter",
    baseUrl: "https://api.twitter.com/",
    domain: "twitter.com",
    authorization: {
        apiUrl: "https://api.twitter.com/",
        oauthVersion: OAuthVersion.OAuth1,
        authMethod: AuthorizeMethod.PIN,
        signMethod: SignMethod.hmac,
        signSpace: SignSpace.Header,
        callback: "https://tsuru-twitter-oauth1-v1.origamium.net",
    },
    apiKey: { ApiKey: "teMvsH7tcmvrJSbKNJvOTIKsc" },
};
