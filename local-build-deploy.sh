#!/bin/bash

# 本地构建并推送到 Container Registry 的脚本

PROJECT_ID="pww-aistudio-prd-mg"
IMAGE_NAME="hello-world-app"
REGION="asia-east1"

echo "步骤 1: 配置 Docker 认证..."
gcloud auth configure-docker

echo "步骤 2: 本地构建 Docker 镜像..."
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .

echo "步骤 3: 推送镜像到 Container Registry..."
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest

echo "步骤 4: 部署到 Cloud Run..."
gcloud run deploy $IMAGE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1

echo "部署完成!"
