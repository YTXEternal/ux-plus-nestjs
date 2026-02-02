---
alwaysApply: false
description: API接口规范当需要开发接口时采用
---
# 基本规范
- 采用Restful API风格
- 关于接口响应统一使用`@dto/api-response` 来响应

## controller
- 需要使用DTO定义接口的请求参数
- DTO可以放在当前模块的dto目录下
- 需要完善swagger文档对接口的描述、以及对应example、header等参数
- 接口权限在没有明确说明的情况都不是开放的需要做权限限制
- 权限限制可以通过Permissions、Roles来实现，即Permissions通过权限key来判断，Roles则通过拥有的角色进行判断

## service
- 使用DTO或者TS类型来定义Service方法的参数和返回值
- TS类型可以放在相对应的types目录下
- service方法不宜过于臃肿复杂可考虑拆分成多个方法来实现
- 如果service方法代码过于臃肿和复杂并超过三个步骤实现则必须拆分
- 你必须保证Service方法代码的健壮性、边界处理、可维护性、可测试性、完备性、高内聚低耦合


## module
- 在@Global()前一行添加注释说明这个模块的作用，采用JSDoc规范