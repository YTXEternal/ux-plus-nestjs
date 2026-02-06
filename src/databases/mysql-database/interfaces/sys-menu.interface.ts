export interface SysMenuInter {
  menu_id: number;
  menu_name: string;
  parent_id: number;
  order_num: number;
  path: string;
  component: string;
  query: string;
  route_name: string;
  is_frame: number;
  is_cache: number;
  menu_type: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  create_by: string;
  update_by: string;
  remark: string;
  constant: boolean;
}
