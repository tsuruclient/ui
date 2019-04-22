import React from "react";
import { storiesOf } from "@storybook/react";
import centered from "@storybook/addon-centered";
import { AccountIcon } from "./AccountIcon";
import * as origamiIcon from "../__testdata__/icon/origami.png";
import { IUser, UIAction } from "@tsuruclient/datatype";
import { action } from "@storybook/addon-actions";

const User1: IUser = {
    id: "123456",
    screenName: "arclisp",
    displayName: "東武鉄道遅延伝説2019",
    providerDomain: "twitter.com",
    avatarImage: origamiIcon,
    headerImage: undefined,
    introduction: undefined,
    location: undefined,
    userWebPageUrl: undefined,
    pinnedObject: undefined
};

const AccountActions: UIAction[] = [
    {
        id: "1234",
        name: "Start Streaming",
        action: action("Start Streaming")
    },
    {
        id: "5678",
        name: "Sign Out",
        action: action("Sign Out")
    }
];

const StoryPrefix = "Sidebar|";

storiesOf(StoryPrefix + "AccountIcon", module)
    .addDecorator(centered)
    .add("no actions", () => <AccountIcon {...User1} actions={[]} />)
    .add("Actions", () => <AccountIcon {...User1} actions={AccountActions} />);
