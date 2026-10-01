import { z } from "zod";
const BaseUrl = z.string().regex(/^wss?:\/\/.+/)
export const JsBotConfigSchema = z.object({
    url: BaseUrl,
    token: z.string().min(1),
    role: z.object({
        Superadmin: z.array(z.number()),
        Admin: z.array(z.number()),
    }),
    plugin: z.record(
        z.string(),
        z.object({
            status: z.enum(["enable", "disable"]),
            list: z.array(z.number()).optional(),
        })
    ),
});

export type JsBotConfig = z.infer<typeof JsBotConfigSchema>;