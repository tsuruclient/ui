import * as React from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { styled } from "../../../Theme";
import Field from "./Field";
import { ThumbnailList } from "../Thumbnail";
import { ComponentButton } from "../IconButton/ReactionButton/ComponentButton";
import { Send as SendIcon, AttachFile as ClipIcon } from "@material-ui/icons";
import { IconButtonStyle } from "../IconButton/IconButton";
import { StatusCard } from "../Card/StatusCard";
import { IStatus } from "../../../datatype/Contents/Article/Status";
import { IUICommonAttribute } from "../../../datatype/UI/UICommonAttribute";

export interface FormProps extends IUICommonAttribute {
    /* accept file type.. */
    accept?: string;
    /* open file upload dialog */
    handleFileUpload?: (Function, file: File[]) => void;
    /* max text length, will occur warn. */
    maxTextLength?: number;
    /* max file amount */
    maxFileLength?: number; // TODO
    /* error message */
    error?: string;
    /* reply source clicked */
    handleClickReply: (object: { account: string; column: string; sourceId: string }) => void;
    /* post it! */
    requestPost: (object: {
        handleClear: Function;
        account: string;
        column: string;
        text: string;
        file?: string[];
    }) => void; // TODO: object type move tsuruclient/data
    /* register reducer. */
    registerColumn: (object: { handleAddReply: Function }) => void;
}

interface FormState {
    text: string;
    replySource?: IStatus;
    file: string[];
    warn?: string;
}

const Styled = {
    Body: styled.div`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    Input: styled.input`
        display: none;
    `,
    Row: styled.div`
        display: flex;
        align-items: flex-end;
        width: 100%;
    `,
    Buttons: styled.div`
        display: flex;
        flex: auto 0 0;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
    `,
};

const ButtonStyle: IconButtonStyle = {
    size: "32px",
    activeColor: "#7D7D7D",
    negativeColor: "#7D7D7D",
};

class Form extends React.PureComponent<FormProps, FormState> {
    public constructor(props: FormProps) {
        super(props);
        this.state = Form.defaultState;
        this.fileInput = React.createRef();
    }

    private readonly fileInput: React.RefObject<HTMLInputElement>;

    public static defaultState: FormState = {
        text: "",
        file: [],
        replySource: undefined,
        warn: undefined,
    };

    public render() {
        const { account, column, accept, error } = this.props;
        const { text, warn, replySource } = this.state;
        return (
            <Dropzone accept={accept} onDrop={this.handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                    <Styled.Body {...getRootProps()}>
                        <Styled.Input {...getInputProps()} ref={this.fileInput} />
                        <Styled.Row>
                            <Field
                                id={column}
                                value={text}
                                warn={warn}
                                error={error}
                                handleChange={this.handleFieldChange}
                            />
                            <Styled.Buttons>
                                <ComponentButton
                                    style={ButtonStyle}
                                    id={column}
                                    handleClick={this.handleAddFileClicked}
                                >
                                    <ClipIcon />
                                </ComponentButton>
                                <ComponentButton style={ButtonStyle} id={column} handleClick={this.handleRequestPost}>
                                    <SendIcon />
                                </ComponentButton>
                            </Styled.Buttons>
                        </Styled.Row>
                        <Styled.Row>
                            <ThumbnailList
                                account={account}
                                column={column}
                                lists={this.state.file}
                                isDeletable={true}
                                handleDelete={this.handleDeleteFile}
                            />
                        </Styled.Row>
                        <Styled.Row>
                            {replySource ? <StatusCard account={account} target={replySource} /> : <div />}
                        </Styled.Row>
                    </Styled.Body>
                )}
            </Dropzone>
        );
    }

    public componentDidMount() {
        this.props.registerColumn({ handleAddReply: this.handleAddReply });
    }

    public handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({ text: event.target.value });
    };

    public handleAddReply = (source: IStatus): void => {
        this.setState({
            replySource: source,
        });
    };

    public handleAddFileClicked = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (this.fileInput && this.fileInput.current) {
            this.fileInput.current.click();
        }
    };

    public handleDeleteReply = (): void => {
        this.setState({
            replySource: undefined,
        });
    };

    public handleFileDrop = (acceptFile: File[], rejectedFile: FileRejection[]): void => {
        if (this.props.handleFileUpload) {
            this.props.handleFileUpload(
                (source: string) => this.setState({ text: this.state.text + source }),
                acceptFile
            );
        } else {
            this.handleAddFile(acceptFile.map((v: File) => URL.createObjectURL(v)));
        }
    };

    public handleAddFile = (file: string[]): void => {
        this.setState({ file: [...this.state.file, ...file] });
    };

    public handleDeleteFile = (index: number): void => {
        const newFileArray = this.state.file.concat();
        newFileArray.splice(index, 1).forEach((v: string) => URL.revokeObjectURL(v));
        this.setState({
            file: newFileArray,
        });
    };

    public handleClear = (): void => {
        this.state.file.forEach((v: string) => URL.revokeObjectURL(v));
        this.setState(Form.defaultState);
    };

    public handleRequestPost = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const { account, column } = this.props;
        const { text, file } = this.state;
        this.props.requestPost({ handleClear: this.handleClear, account, column, text, file });
    };
}

export default Form;
