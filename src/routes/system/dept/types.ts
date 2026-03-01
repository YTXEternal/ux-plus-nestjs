import { SysDept } from '@/databases/mysql-database/model/sys-dept.model';

export type SysDeptTree = SysDept & { children?: SysDeptTree[] };
