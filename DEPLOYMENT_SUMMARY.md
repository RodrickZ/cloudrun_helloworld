# Cloud Run 部署问题总结和解决方案

## 🔴 当前问题

部署失败,错误信息:
```
Error 403: 616361122463-compute@developer.gserviceaccount.com does not have 
storage.objects.get access to the Google Cloud Storage object.
```

## 📋 问题原因

1. **权限不足**: Cloud Build 使用的服务账号缺少访问 Cloud Storage 的权限
2. **无法修改权限**: 你的账号虽然有 `roles/editor` 角色,但无法修改 IAM 策略(可能是组织策略限制)
3. **所有构建方式都需要 Cloud Storage**: 
   - `gcloud run deploy --source=.` 需要上传源代码到 GCS
   - `gcloud builds submit` 需要上传源代码到 GCS
   - 从 GitHub 构建也需要 Cloud Build 服务账号有相应权限

## ✅ 解决方案(按推荐顺序)

### 方案 1: 请管理员修复权限 ⭐️ 推荐

**需要的人**: 具有 `roles/owner` 或 `roles/resourcemanager.projectIamAdmin` 权限的项目管理员

**操作**: 运行 `fix-permissions.sh` 脚本

```bash
./fix-permissions.sh
```

或手动执行以下命令:

```bash
PROJECT_ID="pww-aistudio-prd-mg"
PROJECT_NUMBER="616361122463"

# 为 Compute Engine 默认服务账号添加权限
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectCreator"

# 为 Cloud Build 服务账号添加权限
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/storage.admin"
```

**完成后,你就可以使用**:
```bash
gcloud run deploy hello-world-app --source=. --region=asia-east1 --allow-unauthenticated
```

---

### 方案 2: 使用本地 Docker 构建

**前提**: 需要安装 Docker Desktop

**步骤**:

1. 安装 Docker Desktop for Mac:
   https://www.docker.com/products/docker-desktop/

2. 运行本地构建脚本:
   ```bash
   ./local-build-deploy.sh
   ```

**优点**: 
- 不需要 Cloud Build 权限
- 完全在本地控制构建过程

**缺点**:
- 需要安装 Docker
- 本地构建可能较慢
- 仍需要推送镜像到 Container Registry 的权限

---

### 方案 3: 使用 GitHub + Cloud Build 触发器

**步骤**:

1. 将代码推送到 GitHub:
   ```bash
   # 在 GitHub 上创建仓库后
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. 在 GCP Console 中设置触发器:
   - 访问: https://console.cloud.google.com/cloud-build/triggers?project=pww-aistudio-prd-mg
   - 创建触发器,连接 GitHub 仓库
   - 使用 `cloudbuild.yaml` 配置

3. 仍然需要管理员授予 Cloud Build 权限(同方案 1)

**优点**:
- 自动化 CI/CD
- 每次推送自动部署

**缺点**:
- 仍然需要修复权限问题
- 需要 GitHub 账号

---

### 方案 4: 使用其他 GCP 项目

如果你有其他 GCP 项目,且在该项目中有完全权限:

```bash
# 切换到其他项目
gcloud config set project YOUR_OTHER_PROJECT_ID

# 部署
gcloud run deploy hello-world-app --source=. --region=asia-east1 --allow-unauthenticated
```

---

## 📊 项目代码本身的状态

✅ **代码没有问题**:
- Dockerfile 配置正确
- 服务器代码正确
- 端口配置符合 Cloud Run 要求
- 已添加 cloudbuild.yaml
- 已添加 .dockerignore

❌ **唯一的问题是 GCP 项目权限配置**

---

## 🎯 推荐行动

1. **最快的解决方案**: 联系项目管理员,请他们运行 `fix-permissions.sh`
2. **备选方案**: 安装 Docker,使用 `local-build-deploy.sh`
3. **长期方案**: 设置 GitHub + Cloud Build 自动化部署

---

## 📞 需要提供给管理员的信息

如果你需要联系管理员,可以发送以下信息:

**主题**: 请求为 Cloud Build 添加权限以部署到 Cloud Run

**内容**:
```
你好,

我需要将应用部署到 Cloud Run,但遇到权限问题。请帮忙为以下服务账号添加权限:

项目: pww-aistudio-prd-mg
项目编号: 616361122463

需要添加的权限:
1. 616361122463-compute@developer.gserviceaccount.com
   - roles/storage.objectViewer
   - roles/storage.objectCreator

2. 616361122463@cloudbuild.gserviceaccount.com
   - roles/cloudbuild.builds.builder
   - roles/run.admin
   - roles/iam.serviceAccountUser
   - roles/storage.admin

我已经准备了一个脚本 fix-permissions.sh 可以直接运行。

谢谢!
```

---

## 🔍 验证部署成功

权限修复后,运行:

```bash
gcloud run deploy hello-world-app \
  --source=. \
  --region=asia-east1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1
```

成功后会显示服务 URL,类似:
```
Service URL: https://hello-world-app-xxxxxxxxx-de.a.run.app
```
