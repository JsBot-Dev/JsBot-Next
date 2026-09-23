import { readFileSync } from 'fs'
import process from 'process';
class JsBotConfig{
    WebSocketBaseUrl:string = ''
    WebSocketToken:string = ''
    constructor(){
        this.readConfig()
    }
    public readConfig(){
        try{
            const rawConfig = readFileSync('./bot.config.json','utf-8')
            const config = JSON.parse(rawConfig)

            this.WebSocketBaseUrl = config?.url
            this.WebSocketToken = config?.token
            
        }catch(error){
            console.error(`Read Config Failed: ${error}`)
            process.exit(0)
        }
    }
}
export default JsBotConfig