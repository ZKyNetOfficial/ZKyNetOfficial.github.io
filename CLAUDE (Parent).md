# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZKyNet is building a complete, legally compliant privacy suite with zero compromises - addressing the fundamental weaknesses in today's fragmented privacy tools. The core innovation is a hybrid zero-knowledge architecture that strategically combines centralized and decentralized servers, highlighting the strengths of each while reducing their weaknesses.

### Mission & Market Position

**The Problem**: Current privacy tools force trade-offs between security and usability. VPNs centralize traffic, require accounts, and remain vulnerable to subpoenas. Users cobble together different tools inconsistently, often standing out more rather than blending in. There are no real standards, making privacy a "Wild West" for data brokers.

**The Solution**: One complete privacy suite with pre-configured templates that adjust dynamically based on need, all built on a zero-knowledge foundation. This eliminates the patchwork approach while providing individual-level abuse mitigation and privacy-respecting features.

**Market Strategy**: Starting with VPN infrastructure to prove technical credibility, then expanding to sell the underlying zero-knowledge infrastructure as a service to existing VPN companies. The platform's flexibility enables expansion into privacy-respecting ad serving, publisher integrations, and enhanced security features.

### Current Development Status

**MVP Achieved**: Working minimalist VPN app (RiseupVPN-like), landing page, federal incorporation, and production-quality backend systems with privacy-preserving abuse mitigation.

**Technical Foundation**: The repository contains both the current MVP infrastructure and research toward the next-generation zero-knowledge protocol that will differentiate ZKyNet in the market.

## Repository Structure & Architecture

### High-Level Organization

The repository is organized into major functional areas:

```
ZKyNet/
├── VPN-mvp/                     # Production VPN services
├── Email-service/               # Email infrastructure 
├── Server-auto_setup/           # VPS hardening and automation
├── ZKyNet-landingPage/          # Marketing website
├── ZKyNet-tech-stack/           # Next-gen networking research
├── eVPS-containers/             # Container orchestration
└── unactive-projects/           # Legacy/experimental work
```

### Primary Components

**VPN Infrastructure** (`VPN-mvp/`):
- WireGuard-based VPN server with REST API
- Flask backend with SSL automation (Let's Encrypt)
- Abuse mitigation sidecar with rate limiting and PoW challenges
- Android client app (customized WG Tunnel fork)
- Token-based authentication system
- Production deployment at `france-lauterbourg.vpn.zkynet.org`

**Email Services** (`Email-service/`):
- FastAPI-based email collection service
- DNS validation with MX record checking  
- JSON storage with thread-safe operations
- Rate limiting and CORS support
- Optional nginx integration for SSL

**Server Automation** (`Server-auto_setup/`):
- Two-phase Ansible hardening system
- SSH bootstrap → full security hardening
- Docker testing environment
- Service framework (Docker, Nginx, PostgreSQL, monitoring)
- VPS snapshot automation ("golden images")

**Landing Page** (`ZKyNet-landingPage/`):
- Static marketing site with TailwindCSS
- Node.js development environment
- Comprehensive quality assurance (ESLint, Webhint, Prettier)
- Docker testing environment
- API integration with production services

**Next-Gen Networking** (`ZKyNet-tech-stack/`):
- Pure Rust implementation of the hybrid zero-knowledge architecture
- Config-driven resource assembly system for flexible deployment
- Dynamic hop management with zero-knowledge authentication
- Foundation for the platform that will differentiate ZKyNet and enable B2B infrastructure sales

## Development Commands

### VPN Server Development
```bash
cd VPN-mvp/Backend/Backend-server-template/

# Docker operations
docker compose up -d --build      # Start services
docker compose logs -f            # View logs
docker compose down               # Stop services

# API testing
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-domain.com/api/peer/user-device/config -o user-device.conf

# Run comprehensive tests
python3 testing/token-management/run_token_tests.py    # 100% pass rate
python3 testing/security/run_security_tests.py        # 95+ tests
```

### Email Service Development
```bash
cd Email-service/email-storage/

# Docker deployment
docker-compose up -d              # Start email service
docker-compose logs -f            # View logs

# API testing
curl -X POST http://localhost:8080/api/support \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Server Automation
```bash
cd Server-auto_setup/Ansible/

# Production deployment (two-phase)
./run-bootstrap.sh inventory/production    # Phase A: SSH keys
./run-hardening.sh inventory/production    # Phase B: Full hardening

# Docker testing
cd testing/scripts/
./test-docker.sh                          # Full integration test
```

### Landing Page Development
```bash
cd ZKyNet-landingPage/

# Install dependencies
npm install

# Development with hot reload
npm run dev

# Production build
npm run build

# Quality assurance
npm run lint && npm run format
npx hint .                        # Web quality checks
```

### Next-Gen Zero-Knowledge Architecture
```bash
cd ZKyNet-tech-stack/ZKyNet-src/

# Build with specific configuration
./build.sh --config configs/guard_prod.toml --target production

# Resource-specific testing
cargo test --package crypto-resource ring_based
cargo bench --package networking-resource async_tokio

# Configuration validation
toml-cli validate configs/guard_dev.toml
```

## Key Architecture Patterns

### Multi-Service Orchestration
- **Docker Compose Networks**: Services communicate via bridge networks (`wireguard-network`, `zkynet-services`)
- **Service Discovery**: Container name-based DNS resolution
- **Health Monitoring**: Comprehensive health checks with restart policies
- **Volume Management**: Persistent storage for configurations, SSL certificates, and data

### Security Architecture
- **Two-Phase Hardening**: SSH key establishment followed by full security lockdown
- **Defense in Depth**: Multiple security layers (firewall, fail2ban, SSH hardening, abuse mitigation)
- **Token-Based Authentication**: Multi-token system with auto-generation and backups
- **SSL Automation**: Let's Encrypt integration with certificate management
- **Privacy Preservation**: Individual-level abuse mitigation without compromising anonymity
- **Zero-Knowledge Foundation**: Hybrid centralized/decentralized architecture for next-gen protocol

### Configuration Management
- **Environment-Based**: Extensive use of environment variables for deployment flexibility  
- **Template Systems**: Jinja2 templates for Ansible, TOML for Rust resource assembly
- **Docker Profiles**: Optional service components (nginx, monitoring, etc.)
- **Build-Time Assembly**: Resource selection and compilation for next-gen networking

## Production Deployment Information

### Active Services
- **VPN Server**: `france-lauterbourg.vpn.zkynet.org:51820` (WireGuard), `:443` (API)
- **Email Collection**: Integrated with landing page newsletter signup
- **Landing Page**: Static hosting with API integration
- **VPS Infrastructure**: Root access via `root@207.180.202.219 -p 6226`

### Service Integration
- Landing page newsletter forms connect to production email service
- VPN server provides peer management API for client applications
- Email service validates addresses with DNS MX record checking
- All services implement comprehensive error handling and logging

## Storage & Data Management

### Persistent Data Locations
- **VPN Server**: `/config/server/` (tokens, keys), `/ssl/` (certificates), `/data/` (database)
- **Email Service**: `/app/data/` (JSON email storage)
- **Ansible**: Local SSH keys, automated backups with timestamped versions
- **Landing Page**: Static assets compiled to `dist/` for production

### Backup Strategies
- **Automated Backups**: Token management with automatic backup retention (10 versions)
- **Version Control Integration**: All configurations tracked in git
- **Snapshot Support**: VPS golden image creation for rapid deployment
- **Database Migrations**: SQL migration scripts for schema updates

## Quality Assurance & Testing

### Comprehensive Testing Suites
- **VPN Server**: 100% pass rate for token management, 95+ security tests
- **Email Service**: API endpoint validation, concurrent operations testing  
- **Landing Page**: ESLint, Prettier, Webhint for web standards compliance
- **Server Automation**: Docker-based integration testing, multi-server scenarios

### Code Quality Standards
- **Rust**: Comprehensive clippy linting, interface-first development
- **Python**: Type hints, Pydantic validation, async/await patterns
- **JavaScript**: ESLint with strict rules, Prettier formatting
- **Infrastructure**: Ansible best practices, idempotent operations

## Development Environment Setup

### Required Tools
- **Docker & Docker Compose**: Container orchestration
- **Node.js & npm**: Frontend development and build tools
- **Python 3.8+**: Backend services with async support
- **Ansible**: Infrastructure automation
- **curl**: API testing and validation

### IDE Recommendations
- **VS Code Extensions**: rust-analyzer, Python, ESLint, Docker, Ansible
- **Configuration**: Language servers enabled for comprehensive AI assistance
- **Debug Integration**: Built-in debuggers for all major components

## Security Considerations

### Production Security
- SSH key management with ed25519 keys
- Multi-factor authentication for critical services
- Regular security updates via automated systems
- Comprehensive audit logging without sensitive data exposure

### Development Security
- Secrets management via environment variables
- No hardcoded credentials in source code
- Docker network isolation for testing
- Comprehensive input validation across all services

## Business Context & Future Vision

### Current Focus Areas
- **MVP Maintenance**: Maintaining production VPN infrastructure while developing next-gen protocol
- **Beta Testing**: Seeking beta testers and node operators for current infrastructure
- **Technical Credibility**: Proving ability to build secure, production-quality backend systems
- **B2B Infrastructure**: Preparing zero-knowledge foundation for sale as service to VPN companies

### Expansion Opportunities
- **Privacy-Respecting Ad Serving**: Higher efficiency and value through zero-knowledge architecture
- **Publisher Integrations**: Optional privacy-friendly ad injection capabilities
- **Enhanced Security Features**: Eliminate root certificate attacks and rogue CA vulnerabilities
- **Platform Services**: Foundation for entirely new privacy-driven service categories

This ecosystem represents both a complete privacy infrastructure platform with production-ready components and the foundation for a differentiated B2B infrastructure business that can transform the privacy industry.