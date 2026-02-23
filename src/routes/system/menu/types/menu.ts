import type {SysMenuInter} from '@/databases/mysql-database/interfaces/sys-menu.interface'

export interface SysMenuTree extends SysMenuInter {
    children?:SysMenuTree[];
}
