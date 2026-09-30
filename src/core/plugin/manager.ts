export type PluginStatus = 'enable'|'disable'
export interface PluginSetting{
    status:PluginStatus,
    list?:number[]
}