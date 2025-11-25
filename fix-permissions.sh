#!/bin/bash

# 这个脚本需要由具有 Owner 或 Project IAM Admin 权限的人执行

PROJECT_ID="pww-aistudio-prd-mg"
PROJECT_NUMBER="616361122463"

echo "正在为 Cloud Build 服务账号添加必要权限..."

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

# 添加 Artifact Registry 写入权限(用于推送 Docker 镜像)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

echo "权限添加完成!"
echo ""
echo "现在可以使用以下命令部署:"
echo "gcloud run deploy hello-world-app --source=. --region=asia-east1 --allow-unauthenticated"
echo ""
echo "或者从 GitHub 构建:"
echo "gcloud builds submit \"https://github.com/RodrickZ/cloudrun_helloworld\" --git-source-revision=main --config=cloudbuild.yaml --region=asia-east1 --substitutions=SHORT_SHA=latest"
