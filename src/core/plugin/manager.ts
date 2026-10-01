import { z } from "zod";

export const PluginSettingSchema = z.object({
  status: z.enum(["enable", "disable"]),
  list: z.array(z.number()).optional(),
});

export type PluginStatus = z.infer<typeof PluginSettingSchema>["status"];
export type PluginSetting = z.infer<typeof PluginSettingSchema>;