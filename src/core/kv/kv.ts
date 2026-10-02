import { KVSqlite } from '@isdk/kvsqlite';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export class KvData {
    db: KVSqlite
    constructor(namespaces: string[]) {
        this.db = new KVSqlite(path.join(__dirname, '../../data/kv.db'), {
            collections: namespaces
        })
    }
    async set(collection: string, key: string, value: any) {
        return this.db.set({ _id: key, value }, { collection })
    }
    async get(collection: string, key: string) {
        return this.db.get(key, { collection })?.值;
    }
}
