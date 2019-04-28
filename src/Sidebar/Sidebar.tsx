import React from "react";
import { styled } from "@styled";
import { Paper, IconButton } from "@material-ui/core";
import { AccountList, IAccountProps } from "./AccountList";
import { Add, Settings } from "@material-ui/icons";

export interface ISidebarProps {
    accounts: IAccountProps[];
    addAction: () => void;
    settingAction: () => void;
}

const Styled = {
    Root: styled.div`
        position: relative;
        height: 100%;
        padding: 4px 0;
        & > * {
            margin-left: -4px;
            padding-left: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: -4px;
        }
    `
};

export const Sidebar: React.FC<ISidebarProps> = (props: ISidebarProps) => {
    return (
        <Styled.Root>
            <Paper>
                <div>
                    <IconButton onClick={props.addAction}>
                        <Add />
                    </IconButton>
                </div>
                <div>
                    <AccountList accounts={props.accounts} />
                </div>
                <div>
                    <IconButton onClick={props.settingAction}>
                        <Settings />
                    </IconButton>
                </div>
            </Paper>
        </Styled.Root>
    );
};
