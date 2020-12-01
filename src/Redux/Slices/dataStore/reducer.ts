import { PageControl } from "../../Logics/DataFlow/UI/PageControl";
import { TabControl } from "../../Logics/DataFlow/UI/TabControl";
import { ColumnControl } from "../../Logics/DataFlow/UI/ColumnControl";
import { MuteControl } from "../../Logics/DataFlow/UI/MuteControl";
import { dataStoreActions, dataStoreActionsIdentifier } from "./index";
import { AccountControl } from "../../Logics/DataFlow/Account/AccountControl";
import { ServiceControl } from "../../Logics/DataFlow/Service/ServiceControl";
import { ProviderControl } from "../../Logics/DataFlow/Provider/ProviderControl";
import { DataPoolControl } from "../../Logics/DataFlow/Contents/DataPoolControl";
import { accountActionIdentifier } from "./addAccount";
import { requestActionIdentifier } from "../requests";

export type DataStoreType = {
    page: PageControl;
    tabs: TabControl[];
    columns: ColumnControl[];
    content: DataPoolControl;
    mutes: MuteControl;
    account: AccountControl;
    service: ServiceControl;
    provider: ProviderControl;
};

export const dataStoreReducer = (
    state: DataStoreType | null = null,
    action: dataStoreActions
): DataStoreType | null => {
    switch (action.type) {
        case dataStoreActionsIdentifier.FINISH_RESTORE:
            return action.payload.dataStore;
        case accountActionIdentifier.ADD_ACCOUNT:
            if (state) {
                const newAccountControl = state.account.addAccount({
                    service: action.payload.service,
                    provider: action.payload.provider,
                    authData: action.payload.authorizations,
                });
                return {
                    ...state,
                    account: newAccountControl,
                };
            }
            return state;
        case requestActionIdentifier.SUCCESS_REST:
            if (state) {
                const { targetContentKey, data } = action.payload;
                return { ...state, content: state.content.updateContent(targetContentKey, data) };
            }
            return state;
        default:
            return state;
    }
};
