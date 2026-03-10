# AWS Deployment Guide for ArtLancer

This guide covers the actual deployment process followed for the ArtLancer project.

## 1. Backend Deployment (App Runner + ECR)

The backend is deployed as a containerized service to **AWS App Runner**, pulling images from **Amazon ECR**.

### Steps (Via AWS CloudShell):
1. **Clone & Setup**:
   ```bash
   git clone https://github.com/akashh7892/Artlancerr
   cd Artlancerr/backend
   ```
2. **Push to ECR**:
   - Authenticate Docker to ECR.
   - Build the image using the `Dockerfile` (Node.js 18-slim).
   - Tag and push to the private ECR repository: `359835242293.dkr.ecr.ap-south-1.amazonaws.com/artlancer-backend`.
3. **App Runner Service**:
   - Create a service pointing to the ECR image URI.
   - **Port**: 5000.
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: (Atlas Connection String)
     - `JWT_SECRET`: `hfyewvvyhewvfwen`
     - `FRONTEND_URL`: `https://dqbi6srkzrwad.cloudfront.net` (CloudFront URL)
     - `SUPABASE_URL` / `SUPABASE_KEY`
     - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
     - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (Optional)

---

## 2. Frontend Deployment (S3 + CloudFront)

The React frontend is built for production and served via **CloudFront** for global performance and security.

### Steps (Via AWS CloudShell):
1. **Build**:
   - Use `npm run build` with `.env.production` pointing to the App Runner URL.
2. **Deploy to S3**:
   - Sync the `dist/` folder to the private S3 bucket: `s3://artlancer-frontend-prod`.
3. **CloudFront Configuration**:
   - **Origin Access Control (OAC)**: Configured to allow CloudFront to access the private S3 bucket securely.
   - **Default Root Object**: `index.html`.
   - **SPA Routing (Crucial)**: Custom Error Responses for **403** and **404** redirect to `/index.html` with status `200`. This allows React Router to handle deep links.

---

## 3. Automated Deployment (GitHub Actions)

We have set up workflows to automatically deploy your changes whenever you push to the `main` branch.

### Prerequisites (GitHub Secrets):
To enable this, you must add the following secrets to your GitHub repository (**Settings** -> **Secrets and variables** -> **Actions**):

1.  `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
2.  `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Access Key.

### How it works:
- **Backend**: Pushing changes to the `backend/` folder triggers the `deploy-backend.yml` workflow. It builds the Docker image and pushes it to ECR.
- **Frontend**: Pushing changes to the `frontend/` folder triggers the `deploy-frontend.yml` workflow. It builds the React app and syncs it to S3, then invalidates the CloudFront cache.

---

## 4. Server Technologies Used

- **Runtime**: Node.js 18 (Slim Docker Image)
- **Framework**: Express.js
- **Real-time**: Socket.io (with WebSockets)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs
- **Communications**: Nodemailer (SMTP via Brevo)
- **Object Storage**: Supabase (via @supabase/supabase-js)
- **Payments**: Razorpay (Integration ready, optional)
- **Security**: CORS (Whitelist based), express-mongo-sanitize, express-rate-limit

---

## Post-Deployment Maintenance

- **CORS**: If the CloudFront URL changes, update `FRONTEND_URL` in App Runner.
- **Logs**: Monitor application health via **CloudWatch Logs** under `/aws/apprunner/artlancer-backend/.../application`.

