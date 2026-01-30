**把项目（clone）下载到本地**


## 开始

```cmd
git checkout -b develop
git pull origin develop
```


## master
- 不要直接在这个分支进行修改，也不要直接推送这个master分支
- 当你需要修改BUG的时候可以基于这个分支创建新的HOTFIX/*分支进行BUG的修改



## 分支说明
- develop 用来进行开发新功能，基于master
- feature/* 用来进行开发新功能，基于develop
- hotfix/* 用来修改bug，基于master
- release/* 用来发布新的版本，基于master
- chore/* 用来做一些杂务相关修改和新增，基于develop
- ci/* 用来做一些持续集成相关的修改，基于develop

