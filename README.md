# Funeral Expenses Application

## 💡 Overview

A fully functional MERN-based application to submit funeral expenses forms, authenticate, pause/resume, and download completed forms as JSON from S3. Uses DynamoDB for persistent storage. Styled using GOV.UK guidelines.

---

## 🚀 Features

- User registration and login (JWT-based)
- Dynamic multi-step form with conditional questions
- Save progress and resume later
- Upload final form to S3 and generate signed download URL
- Frontend styled like GOV.UK
- Dockerized, deployable via GitHub Actions and Terraform

---

## ⚙️ Setup

1. Copy `.env.example` to `.env` and set your AWS keys, bucket, and table name.
2. Install dependencies in `backend` and `frontend`.
3. Start locally using:

```bash
docker-compose up


# Temp change to trigger deploy again
