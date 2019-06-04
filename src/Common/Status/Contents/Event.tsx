import * as React from "react";
import { styled } from "@styled";
import { EventProperties, IEvent, IUICommonAttribuite, UserProperties } from "@tsuruclient/datatype";
import { Typography } from "@material-ui/core";
import { StatusCard } from "../../Card/StatusCard";

interface EventComponentProps {
    uiCommonAttr: IUICommonAttribuite;
    target: IEvent;
    eventContext: string;
}

const Styled = {
    Root: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0.5em;
    `,
    Header: styled.div`
        align-self: flex-start;
    `,
    Body: styled.div`
        padding: 0.2em 0;
    `
};

export const Event: React.FC<EventComponentProps> = (props: EventComponentProps) => {
    const target = props.target[EventProperties.target];

    const headingText: string =
        props.target[EventProperties.sourceUser].reduce(
            (prev, curr, i, source) =>
                prev + (curr[UserProperties.displayName] || "no name") + (source.length - 1 !== i ? ", " : " "),
            ""
        ) + props.eventContext;

    return (
        <Styled.Root>
            <Styled.Header>
                <Typography>{headingText}</Typography>
            </Styled.Header>
            {target && (
                <Styled.Body>
                    <StatusCard account={props.uiCommonAttr.account} target={target} />
                </Styled.Body>
            )}
        </Styled.Root>
    );
};
