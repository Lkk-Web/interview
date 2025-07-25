---
group:
  # title: '后端'
order: 2
---

# Nestjs

在 NestJS 中，四种主要的 HTTP 请求方法的使用方式如下：

1. GET 请求：使用`@Get()`装饰器，用于获取资源

```ts
@Get(':id')
async findOne(@Param('id') id: string) {
  return await this.service.findOne(id);
}
```

2. POST 请求：使用@Post()装饰器，用于创建新资源

```ts
@Post()
async create(@Body() createDto: CreateDto) {
  return await this.service.create(createDto);
}
```

3. DELETE 请求：使用@Delete()装饰器，用于删除资源,@Delete(':Did')中的 Did 需要和 deleteDto 的 Did 对应上，有相应取参的对应关系。

```ts
@Delete(':Did')
async remove(@Param() param: deleteDto) {
  return await this.service.remove(id);
}

export class deleteDto {
    Did:string;
}
```

4. PUT 请求：使用@Put()装饰器，用于更新资源

```ts
@Put(':id')
async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  return await this.service.update(id, updateDto);
}
```

每个方法在`Controller`中都需要在控制器类中使用相应的装饰器，并且可以通过@Param()获取 URL 参数，通过@Body()获取请求体数据。服务层方法通常返回 Promise，支持异步操作。记得在使用前导入所需的装饰器和类型。

## 守卫（Guard）：控制请求是否进入路由

执行时机，在所有中间件和拦截器之后、在控制器处理前

作用为控制权限（如：是否登录、是否有角色、是否通过 token 验证）

返回值 true 则允许继续执行，false 或抛异常则拦截请求

适合处理的事情 身份验证（token 校验）、权限控制（RBAC）、路由访问控制等。类似于 CanActivate 函数的权限闸门。

## 管道（Pipe）：转换或验证传入数据

## ORM 框架

## sequelize

## typeorm
