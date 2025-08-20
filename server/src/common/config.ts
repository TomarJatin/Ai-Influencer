import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '10d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  },
  mail: {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
      },
    },
    defaults: {
      from: process.env.SMTP_FROM!,
      fromName: process.env.SMTP_FROM_NAME ?? 'Heizen',
    },
  },
  llm: {
    geminiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    openaiApiKey: process.env.OPENAI_API_KEY!,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  },
  gcp: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    serviceAccountKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    s3: {
      bucket: process.env.S3_BUCKET!,
      region: process.env.S3_REGION!,
    },
  },
};
