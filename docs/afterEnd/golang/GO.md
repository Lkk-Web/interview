在 Go 里，for \_, v := range ... 是 for-range 循环的一种写法。

```go
for index, value := range someCollection {
    // 使用 index 和 value
}
```

    •	someCollection 可以是数组、切片、字符串、map、channel 等。
    •	index 表示迭代的下标（或者 key，比如 map 时）。
    •	value 表示对应位置的值。

append

    •	Go 里 append 用来给切片加元素,会返回一个新的切片（可能会扩容）。

```go
slice = append(slice, element)
```

把 v 的数据转成一个 Location 结构体，并追加到 result 切片中。

```go
	for _, v := range s.locations.FindAll() {
		result = append(result, Location{
			UNLocode: string(v.UNLocode),
			Name: v.Name,
		})
	}
```

:= 是 短变量声明 + 赋值。

if err := ...; err != nil 是 Go 常见的 错误处理模式

    •	err := ... 在 if 语句里声明并赋值 err
    •	err != nil 表示判断是否出错

举个例子

```go
if err := doSomething(); err != nil {
    fmt.Println("出错了：", err)
    return
}
fmt.Println("成功！")
```

• 如果 doSomething() 出错，err != nil，就进入 if，打印错误并 return。

• 如果没出错，跳过 if，继续执行 "成功！"。

```go
func (h *bookingHandler) loadCargo(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	trackingID := shipping.TrackingID(chi.URLParam(r, "trackingID"))

	c, err := h.s.LoadCargo(trackingID)
	if err != nil {
		encodeError(ctx, err, w)
		return
	}

	var response = struct {
		Cargo booking.Cargo json:"cargo"
	}{
		Cargo: c,
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Log("error", err)
		encodeError(ctx, err, w)
		return
	}
}
```

w http.ResponseWriter

    •	在 Go 的 net/http 里，w 是 http.ResponseWriter，代表 HTTP 响应流。
    •	只要往 w 写东西，客户端（浏览器 / 前端请求）就能收到。
    •	不需要显式 return 数据（不像 Node.js 的 res.send() 或者 Python Flask 的 return jsonify(...)）。

虽然你没看到显式的 return response，但：

    •	在 Go 里，http.ResponseWriter 就是输出管道。
    •	json.NewEncoder(w).Encode(response) 已经把结果写到 HTTP 响应里，前端自然能收到。
    •	这就是 Go 的 net/http 风格：通过 w.Write(...) 写响应，而不是 return。

Go 语言 37 个预声明标识符

| 分类 | 标识符     | 含义/解释                                        |
| ---- | ---------- | ------------------------------------------------ |
| 常量 | true       | 布尔值，逻辑真                                   |
|      | false      | 布尔值，逻辑假                                   |
|      | iota       | 常量计数器，从 0 开始，每行常量声明递增 1        |
|      | nil        | 空值/零值，指针、切片、map、chan、接口等的默认值 |
| 类型 | int        | 整数，位数依赖平台（32/64 位）                   |
|      | int8       | 8 位有符号整数（-128 到 127）                    |
|      | int16      | 16 位有符号整数（-32768 到 32767）               |
|      | int32      | 32 位有符号整数（等价于 rune）                   |
|      | int64      | 64 位有符号整数                                  |
|      | uint       | 无符号整数，位数依赖平台                         |
|      | uint8      | 8 位无符号整数（0 到 255），等价于 byte          |
|      | uint16     | 16 位无符号整数                                  |
|      | uint32     | 32 位无符号整数                                  |
|      | uint64     | 64 位无符号整数                                  |
|      | uintptr    | 用于存储指针的整数类型，多用于底层编程           |
|      | float32    | 32 位浮点数                                      |
|      | float64    | 64 位浮点数（默认浮点类型）                      |
|      | complex64  | 64 位复数（实部和虚部分别是 float32）            |
|      | complex128 | 128 位复数（实部和虚部分别是 float64）           |
|      | bool       | 布尔类型（true/false）                           |
|      | byte       | uint8 的别名，通常用于表示二进制数据             |
|      | rune       | int32 的别名，表示 Unicode 码点                  |
|      | string     | 字符串，UTF-8 编码                               |
|      | error      | 内置接口类型，表示错误                           |
| 函数 | make       | 创建切片、map、channel，并返回引用               |
|      | len        | 返回字符串、数组、切片、map、channel 的长度      |
|      | cap        | 返回切片、数组、channel 的容量                   |
|      | new        | 分配内存，返回指向零值的指针                     |
|      | append     | 向切片追加元素，必要时扩容                       |
|      | copy       | 复制切片的内容                                   |
|      | close      | 关闭 channel，通知不再发送数据                   |
|      | delete     | 删除 map 中的键值对                              |
|      | complex    | 构造复数：complex(real, imag)                    |
|      | real       | 获取复数的实部                                   |
|      | imag       | 获取复数的虚部                                   |
|      | panic      | 抛出运行时错误，终止程序执行                     |
|      | recover    | 捕获 panic，从异常中恢复                         |

Go 语言的变量声明格式为：

    var 变量名 变量类型

变量声明以关键字 var 开头，变量类型放在变量的后面，行尾无需分号。 举个例子：

    var name string
    var age int
    var isOk bool

批量声明

    var (
        a string
        b int
        c bool
        d float32
    )

Go 语言在声明变量的时候，会自动对变量对应的内存区域进行初始化操作。每个变量会被初始化成其类型的默认值，例如： 整型和浮点型变量的默认值为 0。 字符串变量的默认值为空字符串。 布尔型变量默认为 false。 切片、函数、指针变量的默认为 nil

类型推导

有时候我们会将变量的类型省略，这个时候编译器会根据等号右边的值来推导变量的类型完成初始化。

    var name = "pprof.cn"
    var sex = 1

### 短变量声明

在函数内部，可以使用更简略的 := 方式声明并初始化变量。

```go
package main

import (
    "fmt"
)
// 全局变量m
var m = 100

func main() {
    n := 10
    m := 200 // 此处声明局部变量m
    fmt.Println(m, n)
}
```

    函数外的每个语句都必须以关键字开始（var、const、func等）

    :=不能使用在函数外。

    _多用于占位，表示忽略值。

iota 是 go 语言的常量计数器，只能在常量的表达式中使用。 iota 在 const 关键字出现时将被重置为 0。const 中每新增一行常量声明将使 iota 计数一次(iota 可理解为 const 语句块中的行索引)。 使用 iota 能简化定义，在定义*枚举*时很有用

```go
    const (
            n1 = iota //0
            n2 = 100  //100
            n3 = iota //2
            n4        //3
        )
    const n5 = iota //0
```

空指针值 nil，而非 C/C++ NULL。

字符串的常用操作

| 方法                                | 介绍           |
| ----------------------------------- | -------------- |
| len(str)                            | 求长度         |
| +或 fmt.Sprintf                     | 拼接字符串     |
| strings.Split                       | 分割           |
| strings.Contains                    | 判断是否包含   |
| strings.HasPrefix,strings.HasSuffix | 前缀/后缀判断  |
| strings.Index(),strings.LastIndex() | 子串出现的位置 |
| strings.Join(a[]string, sep string) | join 操作      |

Go 语言的字符有以下两种：

    uint8类型，或者叫 byte 型，代表了ASCII码的一个字符。

    rune类型，代表一个 UTF-8字符。

当需要处理中文、日文或者其他复合字符时，则需要用到 rune 类型。rune 类型实际是一个 int32。 Go 使用了特殊的 rune 类型来处理 Unicode，让基于 Unicode 的文本处理更为方便，也可以使用 byte 型进行默认字符串处理，性能和扩展性都有照顾

fmt.Printf()

Go 规定：

    •	for _, r := range s 这种写法，会把字符串 按 UTF-8 解码成 Unicode 码点。
    •	每个 Unicode 码点用 rune 表示，本质就是 int32。
    •	这样可以正确处理中文、emoji、特殊符号等多字节字符。

1.1.10. 修改字符串

要修改字符串，需要先将其转换成[]rune 或[]byte，完成后再转换为 string。无论哪种转换，都会重新分配内存，并复制字节数组

```go
   func changeString() {
        s1 := "hello"
        // 强制类型转换
        byteS1 := []byte(s1)
        byteS1[0] = 'H'
        fmt.Println(string(byteS1))

        s2 := "博客"
        runeS2 := []rune(s2)
        runeS2[0] = '狗'
        fmt.Println(string(runeS2))
    }
```

fmt.Printf 是什么

    •	fmt.Printf → 格式化输出，Print f(ormat)。
    •	第一个参数是格式化字符串，后面依次是填充的变量。
    •	格式化字符串里面包含占位符（% 开头），用来指定打印的形式。

| 占位符 | 说明 | 示例 | 输出 |
| --- | --- | --- | --- |
| `%d` | 十进制整数 | `fmt.Printf("%d", 10)` | `10` |
| `%x` | 十六进制整数（小写） | `fmt.Printf("%x", 255)` | `ff` |
| `%X` | 十六进制整数（大写） | `fmt.Printf("%X", 255)` | `FF` |
| `%f` | 小数（浮点数，默认 6 位小数） | `fmt.Printf("%f", 3.14)` | `3.140000` |
| `%.2f` | 小数，保留两位 | `fmt.Printf("%.2f", 3.14159)` | `3.14` |
| `%s` | 字符串 | `fmt.Printf("%s", "go")` | `go` |
| `%q` | 带引号的字符串/字符 | `fmt.Printf("%q", "go")` | `"go"` |
| `%c` | 单个字符（rune/byte） | `fmt.Printf("%c", 65)` | `A` |
| `%t` | 布尔值 | `fmt.Printf("%t", true)` | `true` |
| `%v` | 自动选择合适格式 | `fmt.Printf("%v", []int{1,2})` | `[1 2]` |
| `%+v` | 打印结构体时包含字段名 | `fmt.Printf("%+v", struct{Name string}{"Tom"})` | `{Name:Tom}` |
| `%#v` | Go 语法表示（更详细） | `fmt.Printf("%#v", []int{1,2})` | `[]int{1, 2}` |
| `%T` | 打印变量的类型 | `fmt.Printf("%T", 10)` | `int` |
| `%p` | 指针地址（十六进制） | `fmt.Printf("%p", &a)` | `0xc00001a078` |
| `%%` | 字面上的 `%` 符号 | `fmt.Printf("100%%")` | `100%` |

1.1.7. new 与 make 的区别

    1.二者都是用来做内存分配的。
    2.make只用于slice、map以及channel的初始化，返回的还是这三个引用类型本身；
    3.而new用于类型的内存分配，并且内存对应的值为类型零值，返回的是指向类型的指针。
