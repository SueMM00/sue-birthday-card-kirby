# sue-birthday-card-kirby

一个可单独部署的互动生日贺卡静态项目，当前默认寿星名字是 `SUE`，留言头像会从 `kirby/` 目录随机选图。

## 项目位置

`/Users/sue/Documents/agent/sue-birthday-card-kirby`

## 后续最常改的地方

### 1. 改寿星名字

打开：

`/Users/sue/Documents/agent/sue-birthday-card-kirby/index.html`

修改脚本最上面的 `cardConfig`：

```js
const cardConfig = {
  celebrantNames: ["SUE"],
  birthdayLine: "Happy Birthday",
  greetingLine: "HAPPY ANNIVERSARY",
  localWishStorageKey: "sue-birthday-wishes",
  avatarFolder: "kirby",
  avatarFiles: [ ... ],
};
```

如果你想显示成多个人名，比如：

```js
celebrantNames: ["RONALDO", "MESSI", "NEYMAR"]
```

页面顶部和中间标题会自动同步更新。

### 2. 改留言头像图片来源

还是在 `index.html` 里的 `cardConfig`：

- `avatarFolder` 控制图片目录名
- `avatarFiles` 控制可随机使用的图片文件名

当前已经设置成：

```js
avatarFolder: "kirby"
```

### 3. 改本地缓存 key

如果你想让不同生日卡互不干扰，本地缓存 key 可以继续单独命名：

```js
localWishStorageKey: "sue-birthday-wishes"
```

### 4. 改 Netlify 后端存储名称

打开：

`/Users/sue/Documents/agent/sue-birthday-card-kirby/netlify/functions/wishes.mjs`

修改：

```js
const storeName = "sue-birthday-card";
```

这样不同站点的祝福数据不会混在一起。

## 部署

这是一个已经整理好的静态部署包，直接把整个文件夹作为一个新项目上传到你要部署的平台即可。

如果是 Netlify：

- Publish directory: `.`
- Functions directory: `netlify/functions`

## 已包含内容

- 蛋糕 ↔ 星海 3D 粒子交互
- 留言写入星海
- 点击留言卡可展开
- 背景音乐
- `kirby/` 随机头像
- 独立的本地缓存 key
- 独立的 Netlify Blobs store 名称
