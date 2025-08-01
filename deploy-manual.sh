#!/bin/bash
# Manual deployment script for MxSmiles Production

set -e

echo "🚀 Starting manual deployment to AWS..."

# Configuration
INSTANCE_ID="i-0e201d9e18fd2bec8"
REGION="us-east-1"
APP_DIR="/Users/seanbangalore/personal/mxsmiles-production"

# Build the application
echo "🔨 Building application..."
cd ${APP_DIR}
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf /tmp/mxsmiles-production.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.github \
  --exclude=.env \
  dist/ server/ shared/ package.json package-lock.json public/

# Upload to S3 bucket
S3_BUCKET="mxsmiles-patient-photos-rbvlffvt"
echo "☁️ Uploading to S3..."
aws s3 cp /tmp/mxsmiles-production.tar.gz s3://${S3_BUCKET}/deployments/

# Create deployment script for EC2
cat > /tmp/ec2-deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Starting EC2 deployment..."

# Stop existing services
sudo systemctl stop mxsmiles-production || true
sudo systemctl stop mxsmiles || true

# Create deployment directory
sudo mkdir -p /opt/mxsmiles-production
cd /opt/mxsmiles-production

# Download and extract
aws s3 cp s3://mxsmiles-patient-photos-rbvlffvt/deployments/mxsmiles-production.tar.gz .
sudo tar -xzf mxsmiles-production.tar.gz
sudo rm mxsmiles-production.tar.gz

# Install dependencies
sudo npm ci --only=production

# Set up environment variables
sudo tee /opt/mxsmiles-production/.env > /dev/null << 'ENVEOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://mxsmiles_admin:Seanbangalore123!@mxsmiles-db.caxsqskqmz42.us-east-1.rds.amazonaws.com:5432/mxsmiles
S3_BUCKET=mxsmiles-patient-photos-rbvlffvt
AWS_REGION=us-east-1
SESSION_SECRET=mxsmiles-aws-production-secret-2025
SKIP_ENV_VALIDATION=true
ENVEOF

# Set permissions
sudo chown -R mxsmiles:mxsmiles /opt/mxsmiles-production

# Create systemd service
sudo tee /etc/systemd/system/mxsmiles-production.service > /dev/null << 'SERVICEEOF'
[Unit]
Description=MxSmiles Production Application
After=network.target

[Service]
Type=simple
User=mxsmiles
WorkingDirectory=/opt/mxsmiles-production
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable mxsmiles-production
sudo systemctl start mxsmiles-production

# Wait and test
sleep 10
sudo systemctl status mxsmiles-production --no-pager
curl -f http://localhost:3000/api/health

echo "✅ Production deployment complete!"
EOF

# Upload deployment script to S3
aws s3 cp /tmp/ec2-deploy.sh s3://${S3_BUCKET}/deployments/

# Execute on EC2 via SSM
echo "🚀 Executing deployment on EC2..."
COMMAND_ID=$(aws ssm send-command \
  --instance-ids ${INSTANCE_ID} \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[
    'aws s3 cp s3://${S3_BUCKET}/deployments/ec2-deploy.sh /tmp/ec2-deploy.sh',
    'chmod +x /tmp/ec2-deploy.sh',
    'sudo /tmp/ec2-deploy.sh'
  ]" \
  --region ${REGION} \
  --query 'Command.CommandId' --output text)

echo "Command ID: ${COMMAND_ID}"
echo "Waiting for deployment to complete..."

# Wait for command to complete
aws ssm wait command-executed \
  --command-id ${COMMAND_ID} \
  --instance-id ${INSTANCE_ID} \
  --region ${REGION}

# Get command result
aws ssm get-command-invocation \
  --command-id ${COMMAND_ID} \
  --instance-id ${INSTANCE_ID} \
  --region ${REGION} \
  --query 'StandardOutputContent' --output text

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Test URL: http://mxsmiles-alb-2098546974.us-east-1.elb.amazonaws.com"

# Clean up
rm -f /tmp/mxsmiles-production.tar.gz /tmp/ec2-deploy.sh
aws s3 rm s3://${S3_BUCKET}/deployments/mxsmiles-production.tar.gz
aws s3 rm s3://${S3_BUCKET}/deployments/ec2-deploy.sh