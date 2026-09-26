import JsBotConfig from "../core/config";
import { PermissionType } from "../core/decorator/decorator";

export default function getRole(config:JsBotConfig,user:number):PermissionType{
    const { Admin,Superadmin } = config.Role
    if(Superadmin.includes(user))return 'Superadmin'
    if(Admin.includes(user))return 'Admin'
    return 'User'
}