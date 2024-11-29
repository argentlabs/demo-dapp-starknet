import * as ImapClient from 'imap-simple';
import { simpleParser } from 'mailparser';

export default class SapoEmailClient {
    private config: any;

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

    private async getConnection() {
        return await ImapClient.connect(this.config);
    }

    private async moveToTrash(connection: any, messageId: number) {
        await connection.moveMessage(messageId, 'Lixo');
    }

    async waitForEmail(timeout: number = 30000): Promise<string> {
        const startTime = Date.now();
        console.log('Waiting for verification email...');

        while (Date.now() - startTime < timeout) {
            try {
                const connection = await this.getConnection();
                await connection.openBox('INBOX');

                const messages = await connection.search(['UNSEEN'], {
                    bodies: ['HEADER', ''], // Include headers for date checking
                    markSeen: true
                });

                if (messages.length > 0) {
                    // Filter messages by received date
                    for (let i = messages.length - 1; i >= 0; i--) {
                        const message = messages[i];
                        const body = message.parts.find(part => part.which === '');

                        if (body) {
                            const parsed = await simpleParser(body.body);
                            const messageDate = parsed.date || new Date();

                            // Check if message is less than 10 seconds old
                            if (messageDate > new Date(Date.now() - 10000)) {
                                const pin = parsed.subject?.match(/\d{6}/)?.[0];
                                if (pin) {
                                    await this.moveToTrash(connection, message.attributes.uid);
                                    await connection.end();
                                    return pin;
                                }
                            }
                        }
                    }
                }

                await connection.end();
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error('Error checking email:', error);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        throw new Error(`No verification code found within ${timeout}ms`);
    }

    async getPin(): Promise<string> {
        const pin = await this.waitForEmail();
        if (!pin) {
            throw new Error('No verification code found in email');
        }
        return pin;
    }
}