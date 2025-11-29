# My Side Project

一个简单的黑客风格网页项目。

![Hacker Style](https://img.shields.io/badge/style-hacker-green) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 功能特点

- 🎨 黑客风格 UI 设计（深色背景 + 绿色发光文字）
- 📱 响应式布局，支持移动端
- ✨ 动画效果和交互体验
- 🎯 模块化的工具卡片布局

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 或者使用本地服务器：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js (需要安装 http-server)
   npx http-server
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 文件结构

```
my-side-project/
├── index.html      # 主 HTML 文件
├── style.css       # 样式文件
├── script.js       # JavaScript 交互
└── README.md       # 说明文档
```

## 自定义

- 修改 `index.html` 中的内容来更新工具卡片
- 调整 `style.css` 中的颜色和样式
- 在 `script.js` 中添加更多交互功能

## 部署到 GitHub Pages

1. 在 GitHub 上创建新仓库
2. 将代码推送到 GitHub：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支和 `/ (root)` 目录
5. 访问 `https://你的用户名.github.io/仓库名/`

## 下一步

- [ ] 添加更多工具卡片
- [ ] 实现标签筛选功能
- [ ] 添加路由和页面导航
- [ ] 集成后端 API
- [ ] 添加数据可视化

## License

MIT License

