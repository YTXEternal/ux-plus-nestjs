export interface SysDeptInter {
  dept_id: number;
  parent_id: number;
  ancestors: string;
  dept_name: string;
  order_num: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  del_flag: string;
  create_by: string;
  update_by: string;
}
