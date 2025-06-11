# StreamSphere 🌐

A scalable live content distribution platform built with Node.js, Next.js, PostgreSQL, Redis, and Kafka. StreamSphere provides real-time event streaming, low-latency user interactions, and comprehensive analytics for content creators and viewers.

![StreamSphere Architecture](https://via.placeholder.com/800x400/6366f1/ffffff?text=StreamSphere+Architecture)

## 🏗️ Architecture

StreamSphere follows a microservices architecture designed for scalability and performance:

- **Frontend**: Next.js 14 with Server Components and real-time WebSocket integration
- **Backend**: Express.js API services with PostgreSQL and Redis
- **Streaming**: RTMP ingestion with HLS playback
- **Real-time**: WebSocket connections for chat and live updates
- **Analytics**: Event-driven analytics with Kafka and time-series data
- **Infrastructure**: Kubernetes with auto-scaling and monitoring

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL, Redis, Kafka
- **Real-time**: WebSockets, Server-Sent Events
- **Infrastructure**: Docker, Kubernetes, Prometheus, Grafana
- **CI/CD**: GitHub Actions, Google Cloud Platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+
- Kubernetes cluster (for production)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/streamsphere.git
   cd streamsphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   ```env
   # Database
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=streamsphere
   DB_PASSWORD=your_password
   DB_PORT=5432

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Kafka
   KAFKA_BROKERS=localhost:9092

   # Authentication
   JWT_SECRET=your_jwt_secret
   NEXTAUTH_SECRET=your_nextauth_secret

   # Streaming
   RTMP_SERVER_URL=rtmp://localhost:1935
   HLS_SERVER_URL=http://localhost:8080

   # Monitoring
   PROMETHEUS_URL=http://localhost:9090
   GRAFANA_URL=http://localhost:3001
   ```

4. **Start local services**
   ```bash
   # Start PostgreSQL and Redis with Docker Compose
   docker-compose up -d postgres redis

   # Or use local installations
   # Make sure PostgreSQL and Redis are running
   ```

5. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Development)

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Grafana: http://localhost:3001
   - Prometheus: http://localhost:9090

### Using Docker (Production Build)

1. **Build the Docker image**
   ```bash
   docker build -t streamsphere:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DB_HOST=your_db_host \
     -e DB_USER=your_db_user \
     -e DB_PASSWORD=your_db_password \
     -e REDIS_HOST=your_redis_host \
     streamsphere:latest
   ```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, or local)
- kubectl configured
- Helm 3+ (optional, for easier management)

### Quick Deployment

1. **Create namespace and apply manifests**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/
   ```

2. **Verify deployment**
   ```bash
   kubectl get pods -n streamsphere
   kubectl get services -n streamsphere
   ```

### Detailed Kubernetes Setup

1. **Create secrets**
   ```bash
   # Database password
   kubectl create secret generic postgres-secret \
     --from-literal=password=your_secure_password \
     -n streamsphere

   # Application secrets
   kubectl create secret generic app-secrets \
     --from-literal=jwt-secret=your_jwt_secret \
     --from-literal=nextauth-secret=your_nextauth_secret \
     -n streamsphere

   # Grafana admin password
   kubectl create secret generic grafana-secret \
     --from-literal=admin-password=your_grafana_password \
     -n streamsphere
   ```

2. **Deploy infrastructure components**
   ```bash
   # Deploy PostgreSQL
   kubectl apply -f k8s/postgres-deployment.yaml

   # Deploy Redis
   kubectl apply -f k8s/redis-deployment.yaml

   # Deploy Kafka and Zookeeper
   kubectl apply -f k8s/kafka-deployment.yaml
   ```

3. **Deploy the application**
   ```bash
   # Update the image in the deployment
   sed -i 's|IMAGE_NAME|your-registry/streamsphere:latest|g' k8s/streamsphere-deployment.yaml

   # Deploy the application
   kubectl apply -f k8s/streamsphere-deployment.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

4. **Deploy monitoring**
   ```bash
   kubectl apply -f k8s/monitoring.yaml
   ```

5. **Access the application**
   ```bash
   # Get the external IP (if using LoadBalancer)
   kubectl get service streamsphere-service -n streamsphere

   # Or use port forwarding for testing
   kubectl port-forward service/streamsphere-service 3000:80 -n streamsphere
   ```

### Google Kubernetes Engine (GKE) Deployment

1. **Create a GKE cluster**
   ```bash
   gcloud container clusters create streamsphere-cluster \
     --zone=us-central1-a \
     --num-nodes=3 \
     --enable-autoscaling \
     --min-nodes=1 \
     --max-nodes=10 \
     --machine-type=e2-standard-2
   ```

2. **Get cluster credentials**
   ```bash
   gcloud container clusters get-credentials streamsphere-cluster --zone=us-central1-a
   ```

3. **Deploy using the provided manifests**
   ```bash
   kubectl apply -f k8s/
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `DB_HOST` | PostgreSQL host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | No |
| `DB_USER` | PostgreSQL username | `postgres` | Yes |
| `DB_PASSWORD` | PostgreSQL password | - | Yes |
| `DB_NAME` | PostgreSQL database name | `streamsphere` | Yes |
| `REDIS_HOST` | Redis host | `localhost` | Yes |
| `REDIS_PORT` | Redis port | `6379` | No |
| `KAFKA_BROKERS` | Kafka broker URLs | `localhost:9092` | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | - | Yes |
| `RTMP_SERVER_URL` | RTMP server URL | - | Yes |
| `HLS_SERVER_URL` | HLS server URL | - | Yes |

### Database Setup

The application includes scripts to set up and seed the database:

```bash
# Set up database schema
node scripts/setup-database.js

# Seed with sample data
node scripts/seed-analytics.js
```

### Monitoring Setup

StreamSphere includes comprehensive monitoring with Prometheus and Grafana:

1. **Access Grafana**
   - URL: http://localhost:3001 (local) or your ingress URL
   - Username: admin
   - Password: Set in `grafana-secret`

2. **Import dashboards**
   - StreamSphere comes with pre-configured dashboards
   - Import additional dashboards from `monitoring/dashboards/`

3. **Configure alerts**
   - Set up alerts for high CPU usage, memory consumption, and error rates
   - Configure notification channels (Slack, email, etc.)

## 🚀 CI/CD Pipeline

StreamSphere includes a complete CI/CD pipeline using GitHub Actions:

### Setup

1. **Configure GitHub secrets**
   ```
   GCP_PROJECT_ID: your-gcp-project-id
   GCP_SA_KEY: your-service-account-key-json
   ```

2. **Push to main branch**
   ```bash
   git push origin main
   ```

### Pipeline Stages

1. **Test**: Linting, type checking, unit tests, integration tests
2. **Security Scan**: Vulnerability scanning with Trivy
3. **Build**: Docker image build and push to registry
4. **Deploy**: Automated deployment to Kubernetes

### Manual Deployment

```bash
# Build and push image
docker build -t gcr.io/your-project/streamsphere:latest .
docker push gcr.io/your-project/streamsphere:latest

# Deploy to Kubernetes
kubectl set image deployment/streamsphere-app \
  streamsphere-app=gcr.io/your-project/streamsphere:latest \
  -n streamsphere
```

## 📊 Monitoring and Observability

### Metrics

StreamSphere exposes the following metrics:

- **Application Metrics**: Request rate, response time, error rate
- **Business Metrics**: Active streams, concurrent viewers, chat messages
- **Infrastructure Metrics**: CPU, memory, disk usage, network I/O

### Logs

Structured logging is implemented throughout the application:

```bash
# View application logs
kubectl logs -f deployment/streamsphere-app -n streamsphere

# View specific service logs
kubectl logs -f deployment/postgres -n streamsphere
```

### Health Checks

- **Liveness Probe**: `/api/health`
- **Readiness Probe**: `/api/ready`

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/docs/getting-started/installation/

# Run load tests
k6 run tests/load/stream-load-test.js
```

## 🔒 Security

### Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: API rate limiting and DDoS protection
- **Input Validation**: Comprehensive input validation and sanitization
- **HTTPS**: TLS encryption for all communications
- **Secrets Management**: Kubernetes secrets for sensitive data

### Security Scanning

The CI/CD pipeline includes automated security scanning:

- **Container Scanning**: Trivy for vulnerability detection
- **Dependency Scanning**: npm audit for package vulnerabilities
- **Code Scanning**: ESLint security rules

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   kubectl exec -it deployment/postgres -n streamsphere -- psql -U streamsphere -d streamsphere -c "SELECT 1;"
   ```

2. **Redis Connection Issues**
   ```bash
   # Check Redis connectivity
   kubectl exec -it deployment/redis -n streamsphere -- redis-cli ping
   ```

3. **Pod Startup Issues**
   ```bash
   # Check pod status and logs
   kubectl get pods -n streamsphere
   kubectl describe pod <pod-name> -n streamsphere
   kubectl logs <pod-name> -n streamsphere
   ```

4. **Performance Issues**
   ```bash
   # Check resource usage
   kubectl top pods -n streamsphere
   kubectl top nodes
   ```

### Debug Mode

Enable debug logging:

```bash
export DEBUG=streamsphere:*
npm run dev
```

## 📈 Scaling

### Horizontal Scaling

StreamSphere supports automatic horizontal scaling:

```yaml
# HPA configuration
minReplicas: 3
maxReplicas: 20
targetCPUUtilizationPercentage: 70
```

### Vertical Scaling

Adjust resource requests and limits:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Database Scaling

- **Read Replicas**: Configure PostgreSQL read replicas
- **Connection Pooling**: Use PgBouncer for connection pooling
- **Partitioning**: Implement table partitioning for large datasets

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new streaming feature
fix: resolve database connection issue
docs: update deployment instructions
test: add integration tests for chat
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Kubernetes](https://kubernetes.io/) for container orchestration
- [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) for monitoring

## 📞 Support

- **Documentation**: [docs.streamsphere.com](https://docs.streamsphere.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/streamsphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/streamsphere/discussions)
- **Email**: support@streamsphere.com

---

**StreamSphere** - Scaling live content distribution to the next level 🚀
```

This comprehensive README provides detailed deployment instructions for all environments (local, Docker, Kubernetes), configuration options, monitoring setup, troubleshooting guides, and contribution guidelines. It covers everything needed to successfully deploy and maintain the StreamSphere platform.