export type Options = {
    localeFilePath: string;
    pathNested: boolean;
    useDiff: boolean;
    file?: string;
    withCache?: boolean;
}

export type I18nTable = {
    key: string;
    value: string;
}