import { Dept } from '@/databases/mysql-database/model/dept.model';

export type SysDeptTree = Dept & { children?: SysDeptTree[] };
