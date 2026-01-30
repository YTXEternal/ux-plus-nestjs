export interface SysOperLogInter {
  oper_id: number;
  title: string;
  business_type: number;
  method: string;
  request_method: string;
  operator_type: number;
  oper_name: string;
  dept_name: string;
  oper_url: string;
  oper_ip: string;
  oper_location: string;
  oper_param: string;
  json_result: string;
  status: number;
  error_msg: string;
  oper_time: Date;
  cost_time: number;
}
