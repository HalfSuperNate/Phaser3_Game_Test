export interface Dialogue {
    dialogType: string;
    logID: number;
    title: string;
    message: string;
}

// To use the dialogue get index from line number minus 10
export const dialogues: Dialogue[] = [
    { dialogType: 'info_Sign_1', logID: 0, title: 'Sign Says...', message: 'Hello World' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Sign Says...', message: 'The quick brown fox jumps over the lazy dog!' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Sign Says...', message: 'End' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Other Sign Says...', message: 'Burn?' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Other Sign Says...', message: 'Many will burn, one will win!' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Other Sign Says...', message: 'Got it!' },
    { dialogType: 'info_Sign_1', logID: 0, title: 'Hidden Sign Says...', message: 'Hey you found this sign! Nice!' },
    // Add more dialogues if needed
];