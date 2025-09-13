#!/bin/bash

# AI Revenue Automation Platform - Production Deployment Script
# This script deploys the platform to production with zero downtime

set -e

echo "🚀 Starting AI Revenue Automation Platform deployment..."

# Configuration
DOMAIN="${DOMAIN:-your-domain.com}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@your-domain.com}"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    local missing_tools=()
    
    if ! command -v docker &> /dev/null; then
        missing_tools+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_tools+=("docker-compose")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

# Validate environment variables
validate_environment() {
    print_status "Validating environment variables..."
    
    local required_vars=(
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_KEY"
        "OPENAI_API_KEY"
        "STRIPE_SECRET_KEY"
        "ENCRYPTION_KEY"
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        print_warning "Please set these variables in your .env file or environment"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Create backup of current deployment
create_backup() {
    print_status "Creating backup of current deployment..."
    
    if [ -d ".next" ] || [ -d "node_modules" ]; then
        mkdir -p "$BACKUP_DIR"
        
        # Backup important files
        if [ -f "docker-compose.yml" ]; then
            cp docker-compose.yml "$BACKUP_DIR/"
        fi
        
        if [ -f ".env.production" ]; then
            cp .env.production "$BACKUP_DIR/"
        fi
        
        # Backup database (if using local database)
        if docker ps | grep -q postgres; then
            print_status "Backing up database..."
            docker exec postgres pg_dump -U postgres airevenue > "$BACKUP_DIR/database_backup.sql"
        fi
        
        print_success "Backup created at $BACKUP_DIR"
    else
        print_status "No existing deployment found, skipping backup"
    fi
}

# Build and deploy the application
build_and_deploy() {
    print_status "Building and deploying application..."
    
    # Pull latest changes if in git repository
    if [ -d ".git" ]; then
        print_status "Pulling latest changes from repository..."
        git pull origin main
    fi
    
    # Install dependencies and build
    print_status "Installing dependencies..."
    npm ci --production
    
    print_status "Building application..."
    npm run build
    
    # Build Docker images
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_success "Build completed successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if [ -f "supabase/migrations" ]; then
        # Run Supabase migrations
        npx supabase db push
        print_success "Database migrations completed"
    else
        print_warning "No migrations found, skipping"
    fi
}

# Deploy with zero downtime
zero_downtime_deploy() {
    print_status "Performing zero-downtime deployment..."
    
    # Start new containers
    docker-compose up -d --remove-orphans
    
    # Wait for health check to pass
    print_status "Waiting for health check to pass..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            print_success "Health check passed"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Health check failed after $max_attempts attempts"
            exit 1
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting..."
        sleep 10
        ((attempt++))
    done
    
    print_success "Zero-downtime deployment completed"
}

# Setup monitoring and logging
setup_monitoring() {
    print_status "Setting up monitoring and logging..."
    
    # Create monitoring directories
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p logs
    
    # Generate monitoring configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'airevenue-platform'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s
    
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'traefik'
    static_configs:
      - targets: ['traefik:8080']
EOF

    cat > monitoring/loki.yml << EOF
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093
EOF

    cat > monitoring/promtail.yml << EOF
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/log/app/*.log
EOF

    print_success "Monitoring configuration created"
}

# Setup SSL certificates
setup_ssl() {
    if [ "$DOMAIN" != "localhost" ] && [ -n "$LETSENCRYPT_EMAIL" ]; then
        print_status "Setting up SSL certificates with Let's Encrypt..."
        
        # Ensure Traefik can access certificate storage
        mkdir -p letsencrypt
        chmod 600 letsencrypt
        
        print_success "SSL setup completed - certificates will be generated automatically"
    else
        print_warning "SSL setup skipped - using localhost or missing email"
    fi
}

# Post-deployment verification
verify_deployment() {
    print_status "Verifying deployment..."
    
    local checks_passed=0
    local total_checks=5
    
    # Check if application is responding
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "✓ Application health check passed"
        ((checks_passed++))
    else
        print_error "✗ Application health check failed"
    fi
    
    # Check Redis connection
    if docker exec redis redis-cli ping | grep -q PONG; then
        print_success "✓ Redis connection verified"
        ((checks_passed++))
    else
        print_error "✗ Redis connection failed"
    fi
    
    # Check database connection (Supabase)
    if curl -f "${SUPABASE_URL}/rest/v1/" -H "apikey: ${SUPABASE_ANON_KEY}" > /dev/null 2>&1; then
        print_success "✓ Database connection verified"
        ((checks_passed++))
    else
        print_error "✗ Database connection failed"
    fi
    
    # Check monitoring services
    if curl -f http://localhost:9090 > /dev/null 2>&1; then
        print_success "✓ Monitoring services running"
        ((checks_passed++))
    else
        print_warning "✗ Monitoring services not accessible"
    fi
    
    # Check logs are being generated
    if [ -f "logs/app.log" ]; then
        print_success "✓ Application logging working"
        ((checks_passed++))
    else
        print_warning "✗ Application logs not found"
    fi
    
    print_status "Verification completed: $checks_passed/$total_checks checks passed"
    
    if [ $checks_passed -lt 3 ]; then
        print_error "Deployment verification failed - too many critical checks failed"
        exit 1
    elif [ $checks_passed -lt $total_checks ]; then
        print_warning "Deployment completed with warnings - some non-critical checks failed"
    else
        print_success "All deployment checks passed!"
    fi
}

# Cleanup old Docker resources
cleanup() {
    print_status "Cleaning up old Docker resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with data)
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Display deployment summary
show_summary() {
    print_success "🎉 AI Revenue Automation Platform deployment completed!"
    echo
    echo "📊 Deployment Summary:"
    echo "  • Application: http://localhost:3000"
    echo "  • Health Check: http://localhost:3000/api/health"
    echo "  • Monitoring: http://localhost:3001 (Grafana)"
    echo "  • Metrics: http://localhost:9090 (Prometheus)"
    echo "  • Load Balancer: http://localhost:8080 (Traefik)"
    
    if [ "$DOMAIN" != "localhost" ]; then
        echo "  • Production URL: https://$DOMAIN"
        echo "  • SSL: Automatic via Let's Encrypt"
    fi
    
    echo
    echo "🔐 Default Credentials:"
    echo "  • Grafana: admin / ${GRAFANA_PASSWORD:-admin123}"
    echo
    echo "📁 Important Paths:"
    echo "  • Logs: ./logs/"
    echo "  • Backups: ./backups/"
    echo "  • SSL Certificates: ./letsencrypt/"
    echo
    echo "🚀 Next Steps:"
    echo "  1. Update DNS records to point to this server"
    echo "  2. Configure monitoring alerts"
    echo "  3. Set up automated backups"
    echo "  4. Review security settings"
    echo
    print_success "Deployment guide: https://docs.your-domain.com/deployment"
}

# Main deployment flow
main() {
    print_status "AI Revenue Automation Platform - Production Deployment"
    echo "Domain: $DOMAIN"
    echo "Timestamp: $(date)"
    echo

    check_requirements
    validate_environment
    create_backup
    build_and_deploy
    run_migrations
    setup_monitoring
    setup_ssl
    zero_downtime_deploy
    verify_deployment
    cleanup
    show_summary
}

# Handle script interruption
trap 'echo -e "\n${RED}Deployment interrupted!${NC}"; exit 1' INT TERM

# Run main function
main "$@"