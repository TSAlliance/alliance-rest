import fs from "fs";
import path from "path";
import nodemailer, { Transporter } from "nodemailer";

import { Attachment } from "nodemailer/lib/mailer";
import { HashMap } from "./hashMap";

export interface MailSMPTOptions {
    host: string;
    port: number;
    user: string;
    password: string;
}

export interface MailSenderOptions {
    smtpOptions: MailSMPTOptions;

    /**
     * Title that should be set as name in email sender
     */
    applicationTitle?: string;
}

export interface MailOptions {
    subject: string;
    recipient: string;
    from?: string;
    context?: HashMap<string>;
    attachments?: Attachment[];
}

export interface MailResponse {
    isError: boolean;
    info?: any;
    error?: Error;
}

export class MailSender {
    private static _instance: MailSender = undefined;
    private _transporter: Transporter;
    private _mailSenderOptions: MailSenderOptions;

    constructor(options: MailSenderOptions) {
        this._mailSenderOptions = options;
        this._transporter = nodemailer.createTransport({
            pool: true,
            host: options.smtpOptions.host,
            port: options.smtpOptions.port,
            auth: {
                user: options.smtpOptions.user,
                pass: options.smtpOptions.password,
            },
        });
    }

    public sendMail(templateFilePath: string, options: MailOptions): Promise<MailResponse> {
        return new Promise((resolve) => {
            let appRootDir: string = require.main.path;
            templateFilePath = appRootDir + path.sep + templateFilePath;

            let htmlTemplate = fs.readFileSync(templateFilePath).toString("utf-8");

            if (options.context) {
                for (let key in options.context) {
                    htmlTemplate = htmlTemplate.replace("%" + key + "%", options.context[key]);
                }
            }

            if (options.attachments) {
                options.attachments.map((attachment) => {
                    if (attachment.path) {
                        attachment.path = appRootDir + path.sep + attachment.path;
                    }
                    return attachment;
                });
            }

            this._transporter.sendMail(
                {
                    to: options.recipient,
                    from: options.from
                        ? options.from + " <" + this._mailSenderOptions.smtpOptions.user + ">"
                        : (this._mailSenderOptions.applicationTitle || "TSAlliance") +
                          " <" +
                          this._mailSenderOptions.smtpOptions.user +
                          ">",
                    subject: options.subject,
                    html: htmlTemplate,
                    attachments: options.attachments || [],
                },
                (err, info) => {
                    if (err) {
                        resolve({
                            isError: true,
                            error: err,
                        });
                    }

                    if (info) {
                        resolve({
                            isError: false,
                            info,
                        });
                    }
                },
            );
        });
    }

    /**
     * Check if client can connect to smtp server
     * @returns Promise of type boolean
     */
    public async canConnect(): Promise<Boolean> {
        return new Promise<Boolean>((resolve) => {
            this._transporter.verify((error, success) => {
                if (error) {
                    console.error(error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Create an instance of MailSender
     * @param options MailSMPTOptions
     * @returns MailSender instance
     */
    public static createInstance(options: MailSenderOptions): MailSender {
        this._instance = new MailSender(options);
        return this._instance;
    }

    /**
     * Get instance of MailSender
     */
    public static getInstance(): MailSender {
        return this._instance;
    }
}
