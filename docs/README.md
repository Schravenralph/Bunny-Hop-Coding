# Bunny Hop Coding Adventure - Documentation

## Overview

This directory contains comprehensive documentation for the Bunny Hop Coding Adventure, an educational coding game that teaches Python programming to kids through a fun, interactive bunny-hopping game.

## Documents

### 1. [Architecture](./01-architecture/architecture.md)
**Client-Side Game Architecture**

Detailed documentation of the system architecture, including:
- System diagram and component breakdown
- Technology stack
- Data flow patterns
- Design patterns used
- Component responsibilities
- Python execution model

**Key Characteristics**:
- Single-page application (SPA)
- Client-side only (no server required)
- Pyodide for Python execution in browser
- Canvas-based game engine
- Progressive level system

---

## Quick Reference

### System Metrics
- **Target Audience**: Kids learning to code (ages 8-14)
- **Levels**: 15 progressive levels
- **Technology**: HTML5 Canvas, JavaScript, Pyodide
- **Dependencies**: None (runs entirely in browser)
- **File Size**: ~200KB (excluding Pyodide CDN)

### Core Features
- Python code execution in browser
- Real-time game rendering
- Level progression system
- Hint system
- Code editor with syntax highlighting
- Game statistics tracking

---

## Documentation Structure

### Architecture & Design
- **[Architecture](./01-architecture/architecture.md)** ⭐ - Complete system architecture documentation
- **[Component Design](./01-architecture/components.md)** - Detailed component breakdown

### Development
- **[Development Guide](./02-development/README.md)** - Setup and development instructions

### Testing
- **[Testing Documentation](./03-testing/)** - Testing strategies and procedures

### Policies
- **[Code Policies](./04-policies/)** - Development policies and guidelines

### Product & Game Design
- **[Level Design](./05-product/levels.md)** - Level structure and progression
- **[Game Mechanics](./05-product/mechanics.md)** - Game physics and rules

### Architecture Decision Records
- **[ADRs](./06-adr/)** - Architecture decision records

### Analysis
- **[Analysis Documents](./07-analysis/)** - System analysis and evaluations

### API Reference
- **[Python API](./08-api/python-api.md)** - Available Python functions

### Research
- **[Pyodide vs Alternatives](./09-research/pyodide-vs-alternatives.md)** ⭐ - Technology comparison research

### Setup
- **[Setup Guide](./24-setup/)** - Installation and setup instructions

### Feature Management
- **[Feature Backlog](./80-feature-backlog/)** - Planned features
- **[Features In Progress](./81-feature-in-progress/)** - Active development
- **[Features In Review](./82-feature-in-review/)** - Awaiting review
- **[Features Done](./83-feature-done/)** - Completed features
- **[Features Blocked](./84-feature-blocked/)** - Blocked items
- **[Features Cancelled](./85-feature-cancelled/)** - Cancelled items

---

## Maintenance

**Review Frequency**: Every 3 months

**Triggers for Reassessment**:
- New level requirements
- Performance issues
- Browser compatibility issues
- Educational feedback
- Feature requests

**Next Review**: 2025-04-30

---

*Last Updated*: 2025-01-30  
*Maintainer*: Ralph Schraven

