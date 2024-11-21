'use server';

import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

export async function uploadImageToDrive(file: File): Promise<UploadResult> {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            error: 'File size exceeds the maximum limit of 10MB',
        };
    }

    try {
        const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
        if (!credentialsString) {
            return {
                success: false,
                error: 'Google Service Account credentials are not set',
            };
        }

        let credentials: Record<string, any>;
        try {
            credentials = JSON.parse(credentialsString);
        } catch (parseError) {
            console.error('Error parsing credentials:', parseError);
            return {
                success: false,
                error: 'Invalid service account credentials format',
            };
        }

        const requiredFields = ['client_email', 'private_key'];
        for (const field of requiredFields) {
            if (!credentials[field]) {
                return {
                    success: false,
                    error: `Missing required field in credentials: ${field}`,
                };
            }
        }

        const jwtClient = new google.auth.JWT(
            credentials.client_email,
            undefined,
            credentials.private_key.replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/drive.file']
        );
        await jwtClient.authorize();
        const drive = google.drive({ version: 'v3', auth: jwtClient });

        const uniqueFileName = `${uuidv4()}_${file.name}`;
        const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!parentFolderId) {
            return {
                success: false,
                error: 'Google Drive folder ID is not configured',
            };
        }

        const fileMetadata = {
            name: uniqueFileName,
            parents: [parentFolderId],
        };

        // Create a readable stream from the file
        const fileStream = Readable.from(Buffer.from(await file.arrayBuffer()));

        const media = {
            mimeType: file.type, // Ensure the correct MIME type is used
            body: fileStream,
        };

        // Upload file to Google Drive
        const uploadResponse = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name',
        });

        if (!uploadResponse.data.id) {
            return {
                success: false,
                error: 'Failed to upload the file to Google Drive',
            };
        }

        // Set the permissions to make the file public
        await drive.permissions.create({
            fileId: uploadResponse.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Create a shareable link
        const shareableLink = `https://drive.google.com/uc?id=${uploadResponse.data.id}`;

        return {
            success: true,
            url: shareableLink,
        };
    } catch (error) {
        console.error('Error during image upload:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unexpected error occurred',
        };
    }
}
