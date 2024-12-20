import * as ImapClient from 'imap-simple';
import { simpleParser } from 'mailparser';

// Define Connection type based on what imap-simple returns
type Connection = ReturnType<typeof ImapClient.connect> extends Promise<infer T> ? T : never;

interface EmailConfig {
    imap: {
        user: string;
        password: string;
        host: string;
        port: number;
        tls: boolean;
        tlsOptions: { rejectUnauthorized: boolean };
        authTimeout: number;
    };
}

export default class SapoEmailClient {
    private readonly config: EmailConfig;
    private static readonly TRASH_FOLDER = 'Lixo';
    private static readonly CHECK_INTERVAL = 3000;
    private static readonly EMAIL_AGE_THRESHOLD = 20000;

    constructor(email: string, password: string) {
        this.config = {
            imap: {
                user: email,
                password: password,
                host: 'imap.sapo.pt',
                port: 993,
                tls: true,
                tlsOptions: { rejectUnauthorized: false },
                authTimeout: 3000
            }
        };
    }

    private async getConnection(): Promise<Connection> {
        try {
            return await ImapClient.connect(this.config);
        } catch (error) {
            throw new Error(`Failed to connect to IMAP server: ${error.message}`);
        }
    }

    private async moveToTrash(connection: Connection, uid: number): Promise<void> {
        try {
            await connection.moveMessage(uid, SapoEmailClient.TRASH_FOLDER);
            console.log(`Successfully moved message ${uid} to trash`);
        } catch (error) {
            console.error(`Failed to move message ${uid} to trash:`, error);
            // Attempt to copy and then delete as a fallback
            try {
                // await connection.copy(uid, SapoEmailClient.TRASH_FOLDER);
                await connection.addFlags(uid, '\\Deleted');
                await connection.deleteMessage(uid);
                console.log(`Successfully copied and deleted message ${uid} as fallback`);
            } catch (fallbackError) {
                throw new Error(`Failed to move message to trash (both methods): ${fallbackError.message}`);
            }
        }
    }

    private async processMessage(message: any): Promise<string | null> {
        const body = message.parts.find(part => part.which === '');
        if (!body) return null;

        const parsed = await simpleParser(body.body);
        const messageDate = parsed.date || new Date();

        if (messageDate > new Date(Date.now() - SapoEmailClient.EMAIL_AGE_THRESHOLD)) {
            return parsed.subject?.match(/\d{6}/)?.[0] || null;
        }
        return null;
    }

    async waitForEmail(timeout: number = 40000): Promise<string> {
        const startTime = Date.now();
        console.log('Waiting for verification email...');
        const connection = await this.getConnection();
        try {
            let i = 0
            while (Date.now() - startTime < timeout) {

                await connection.openBox('INBOX');
                console.log('Checking for new messages...', i++);
                try {
                    const messages = await connection.search(['UNSEEN'], {
                        bodies: ['HEADER', ''],
                        markSeen: true
                    });

                    for (const message of messages.reverse()) {
                        const pin = await this.processMessage(message);

                        if (pin) {
                            await connection.addFlags(message.attributes.uid, '\\Seen');
                            await this.moveToTrash(connection, message.attributes.uid);
                            return pin;
                        } else {
                            // Move old messages to trash
                            await this.moveToTrash(connection, message.attributes.uid);
                        }
                    }

                    await new Promise(resolve => setTimeout(resolve, SapoEmailClient.CHECK_INTERVAL));
                } catch (error) {
                    console.error('Error processing messages:', error);
                    await new Promise(resolve => setTimeout(resolve, SapoEmailClient.CHECK_INTERVAL));
                }
            }

            throw new Error(`No verification code found within ${timeout}ms`);
        } finally {
            await connection.end();
        }
    }

    async getPin(): Promise<string> {
        const pin = await this.waitForEmail();
        if (!pin) {
            throw new Error('No verification code found in email');
        }
        console.log(`Found verification code: ${pin}`);
        return pin;
    }
}