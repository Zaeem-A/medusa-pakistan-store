import { join } from "path"
import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const redisUrl = process.env.REDIS_URL

/**
 * Registered only when REDIS_URL is set. Without it Medusa falls back to its
 * in-memory modules, which work on a single process but are not suitable for
 * production. CACHE_REDIS_URL and LOCKING_REDIS_URL are optional overrides for
 * running those on a separate Redis instance.
 */
const redisModules = redisUrl
  ? [
      {
        resolve: "@medusajs/medusa/caching",
        options: {
          providers: [
            {
              resolve: "@medusajs/caching-redis",
              id: "caching-redis",
              is_default: true,
              options: {
                redisUrl: process.env.CACHE_REDIS_URL || redisUrl,
              },
            },
          ],
        },
      },
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: {
          redisUrl,
        },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: {
          redis: {
            redisUrl,
          },
        },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/locking-redis",
              id: "locking-redis",
              is_default: true,
              options: {
                redisUrl: process.env.LOCKING_REDIS_URL || redisUrl,
              },
            },
          ],
        },
      },
    ]
  : []

/**
 * File storage. Private files include order exports, which hold customer
 * names, phone numbers and addresses.
 *
 * - With S3_BUCKET set, files go to S3 and private files get presigned links
 *   that expire (one hour by default).
 * - Without it, Medusa's local provider keeps private files in the public
 *   static folder, where anyone who learns the link can read them. That is
 *   tolerable on a developer machine only. In production private files go to
 *   uploads/private instead, which is not served: export downloads then fail
 *   until S3 is set up, rather than leak.
 */
const s3Bucket = process.env.S3_BUCKET
const isProduction = process.env.NODE_ENV === "production"

if (isProduction && !s3Bucket) {
  console.warn(
    "S3_BUCKET is not set: private files such as order exports are kept off " +
      "the public static folder, so their download links will not work."
  )
}

const fileModules = s3Bucket
  ? [
      {
        resolve: "@medusajs/medusa/file",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/file-s3",
              id: "s3",
              options: {
                file_url: process.env.S3_FILE_URL,
                access_key_id: process.env.S3_ACCESS_KEY_ID,
                secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                bucket: s3Bucket,
                endpoint: process.env.S3_ENDPOINT,
              },
            },
          ],
        },
      },
    ]
  : isProduction
    ? [
        {
          resolve: "@medusajs/medusa/file",
          options: {
            providers: [
              {
                resolve: "@medusajs/medusa/file-local",
                id: "local",
                options: {
                  private_upload_dir: join(process.cwd(), "uploads", "private"),
                  backend_url: process.env.MEDUSA_BACKEND_URL
                    ? `${process.env.MEDUSA_BACKEND_URL}/static`
                    : undefined,
                },
              },
            ],
          },
        },
      ]
    : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server"
      | undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    ...redisModules,

    ...fileModules,

    // Notification placeholder. Uncomment one provider and set its variables
    // from .env.example. Until then notifications are only logged.
    // {
    //   resolve: "@medusajs/medusa/notification",
    //   options: {
    //     providers: [
    //       // SendGrid is built in.
    //       {
    //         resolve: "@medusajs/medusa/notification-sendgrid",
    //         id: "sendgrid",
    //         options: {
    //           channels: ["email"],
    //           api_key: process.env.SENDGRID_API_KEY,
    //           from: process.env.SENDGRID_FROM,
    //         },
    //       },
    //       // Resend is not built in. This entry also needs the custom provider
    //       // from https://docs.medusajs.com/resources/integrations/guides/resend
    //       {
    //         resolve: "./src/modules/resend",
    //         id: "resend",
    //         options: {
    //           channels: ["email"],
    //           api_key: process.env.RESEND_API_KEY,
    //           from: process.env.RESEND_FROM_EMAIL,
    //         },
    //       },
    //     ],
    //   },
    // },
  ],
})
