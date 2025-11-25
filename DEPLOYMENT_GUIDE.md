# 从 GitHub 部署到 Cloud Run 指南

## 方案 1: 使用 Cloud Build 触发器 (推荐)

### 步骤 1: 推送代码到 GitHub

1. 在 GitHub 上创建新仓库
2. 推送代码:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 步骤 2: 在 GCP Console 中设置 Cloud Build 触发器

1. 访问 Cloud Build 触发器页面:
   https://console.cloud.google.com/cloud-build/triggers?project=pww-aistudio-prd-mg

2. 点击 "创建触发器"

3. 配置触发器:
   - **名称**: hello-world-deploy
   - **区域**: asia-east1
   - **事件**: 推送到分支
   - **来源**: 连接新的代码库 → 选择 GitHub
   - **代码库**: 选择你的仓库
   - **分支**: ^main$
   - **配置**: Cloud Build 配置文件
   - **位置**: /cloudbuild.yaml

4. 点击 "创建"

### 步骤 3: 授予 Cloud Build 权限

在触发器创建后,需要授予 Cloud Build 服务账号权限:

```bash
# 获取项目编号
PROJECT_NUMBER=$(gcloud projects describe pww-aistudio-prd-mg --format="value(projectNumber)")

# 授予 Cloud Run Admin 权限
gcloud projects add-iam-policy-binding pww-aistudio-prd-mg \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# 授予 Service Account User 权限
gcloud projects add-iam-policy-binding pww-aistudio-prd-mg \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### 步骤 4: 触发部署

推送代码到 main 分支即可自动触发部署:

```bash
git push origin main
```

---

## 方案 2: 手动从 GitHub 构建

如果你已经将代码推送到 GitHub,可以手动触发构建:

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=COMMIT_SHA=latest \
  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

---

## 方案 3: 使用 Cloud Build 直接构建 (不需要 GitHub)

如果 Cloud Build 服务账号有足够的权限,可以直接提交构建:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## 添加 Gemini API Key (可选)

如果你的应用需要 Gemini API Key:

### 方法 1: 使用 Secret Manager

1. 创建 Secret:
```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini_api_key --data-file=-
```

2. 更新 cloudbuild.yaml,在 deploy 步骤添加:
```yaml
- '--update-secrets=GEMINI_API_KEY=gemini_api_key:latest'
```

### 方法 2: 使用环境变量

在 cloudbuild.yaml 的 deploy 步骤添加:
```yaml
- '--set-env-vars=GEMINI_API_KEY=YOUR_API_KEY'
```

---

## 故障排查

### 权限问题

如果遇到权限错误,确保 Cloud Build 服务账号有以下权限:
- `roles/run.admin` - 部署到 Cloud Run
- `roles/iam.serviceAccountUser` - 使用服务账号
- `roles/storage.admin` - 访问 Container Registry

### 查看构建日志

```bash
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### 查看 Cloud Run 日志

```bash
gcloud run services logs read hello-world-app --region=asia-east1
```
