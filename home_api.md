# Home API 文档

## 1. 首页统计数据

获取首页图表统计数据，支持按天数和店铺 ID 筛选。

### 接口信息
- **接口路径**: `GET /api/v1/home/statistics`
- **权限标识**: `home`
- **鉴权方式**: Bearer Token

### 请求参数

| 参数名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| shop_id | Number | 否 | 店铺 ID。如果不传，则返回所有店铺的汇总数据。 | `1001` |
| days | Number | 否 | 统计天数 (7, 14, 30)，默认 7。 | `7` |

### 响应结构

响应数据格式兼容 ECharts Option 配置。

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "xAxis": {
      "type": "category",
      "data": [
        "2023-10-01",
        "2023-10-02"
      ]
    },
    "series": [
      {
        "name": "会员增长人数",
        "type": "line",
        "data": [10, 5]
      },
      {
        "name": "卖票营业额",
        "type": "line",
        "data": [1000.00, 500.00]
      },
      {
        "name": "退款金额",
        "type": "line",
        "data": [0.00, 100.00]
      },
      {
        "name": "退款单数",
        "type": "line",
        "data": [0, 1]
      }
    ]
  }
}
```

### 错误码

| 错误码 | 描述 |
| :--- | :--- |
| 401 | 未授权（Token 无效或过期） |
| 403 | 无权限访问 |

### cURL 示例

```bash
curl -X GET "http://localhost:3000/api/v1/home/statistics?shop_id=1001&days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
