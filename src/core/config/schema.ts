import { z } from "zod";
import { PluginSettingSchema } from "../plugin/manager";
const BaseUrl = z.string().regex(/^wss?:\/\/.+/);

export const JsBotConfigSchema = z.object({
    url: BaseUrl,
    token: z.string().min(1),
    role: z.object({
        Superadmin: z.array(z.number()),
        Admin: z.array(z.number()),
    }),
    plugin: z.record(z.string(), PluginSettingSchema),
})

export type Config = z.infer<typeof JsBotConfigSchema>