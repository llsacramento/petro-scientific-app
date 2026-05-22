# Implementation Plan: Petro Scientific SPA

## Overview

This implementation plan covers the complete development of a full-stack service management system for laboratory and material science instrument repair and maintenance. The system uses Angular 19.2.0 for the frontend, Node.js/Express with TypeScript for the backend, and PostgreSQL for the database.

The implementation follows an incremental approach, building core infrastructure first, then implementing features layer by layer, with testing integrated throughout. Each task references specific requirements from the requirements document and includes property-based tests for the 65 correctness properties defined in the design.

## Technology Stack

- **Frontend**: Angular 19.2.0, TypeScript 5.7.2, RxJS 7.8.0, SCSS
- **Backend**: Node.js 20.x, Express.js 4.x, TypeScript
- **Database**: PostgreSQL 15.x
- **Testing**: Jasmine/Karma (frontend), Jest (backend), fast-check (property-based testing)

## Tasks

### Phase 1: Backend Infrastructure Setup

- [x] 1. Initialize backend project structure
  - Create backend directory with TypeScript configuration
  - Set up Express.js application with TypeScript
  - Configure environment variables and configuration management
  - Set up ESLint and Prettier for code quality
  - Create basic folder structure (config, middleware, routes, controllers, services, repositories, models, utils)
  - _Requirements: Foundation for all backend functionality_

- [x] 2. Set up PostgreSQL database and connection
  - Install PostgreSQL client libraries (pg, pg-pool)
  - Create database configuration with connection pooling
  - Set up database migration tool (node-pg-migrate)
  - Create initial database and test connection
  - _Requirements: Foundation for data persistence_

- [x] 3. Create database schema and migrations
  - [x] 3.1 Create core entity tables (users, customers, instruments)
    - Write migration for users table with role enum and indexes
    - Write migration for customers table with address fields and indexes
    - Write migration for customer_contacts table
    - Write migration for instruments table with status enum and indexes
    - _Requirements: 1.1, 4.1, 7.1_

  - [x] 3.2 Create service request and work order tables
    - Write migration for service_requests table with status/priority enums
    - Write migration for service_request_attachments table
    - Write migration for service_templates and template_checklist_items tables
    - Write migration for work_orders table
    - Write migration for technician_availability table
    - _Requirements: 2.1, 3.1, 5.1, 17.1_

  - [x] 3.3 Create service record and parts tables
    - Write migration for service_records table with computed labor_total
    - Write migration for service_record_attachments table
    - Write migration for service_record_parts table with computed total_cost
    - Write migration for parts table with quantity constraints
    - Write migration for parts_adjustments table
    - _Requirements: 6.3, 8.1_

  - [x] 3.4 Create invoice and notification tables
    - Write migration for invoices table with status enum
    - Write migration for invoice_line_items table with computed line_total
    - Write migration for invoice_payments table
    - Write migration for notifications table with type enum
    - Write migration for notification_preferences table
    - _Requirements: 9.1, 11.1_

  - [x] 3.5 Create audit log table and triggers
    - Write migration for audit_logs table with JSONB field_changes
    - Create audit_trigger_function for automatic audit logging
    - Apply audit triggers to key tables (service_requests, work_orders, invoices)
    - Create update_updated_at_column trigger function
    - Apply updated_at triggers to all tables with updated_at column
    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 3.6 Create parts inventory trigger
    - Create update_parts_inventory trigger function
    - Apply trigger to service_record_parts table for automatic inventory decrement
    - Test trigger with sample data
    - _Requirements: 8.2_

- [x] 4. Checkpoint - Verify database schema
  - Run all migrations successfully
  - Verify all tables created with correct columns and constraints
  - Verify all indexes created
  - Verify all triggers created and functional
  - Ensure all tests pass, ask the user if questions arise.


### Phase 2: Backend Authentication and Authorization

- [x] 5. Implement authentication system
  - [x] 5.1 Create User model and repository
    - Define User TypeScript interface with UserRole enum
    - Implement UserRepository with CRUD operations
    - Implement password hashing with bcrypt
    - _Requirements: 1.1_

  - [x] 5.2 Implement authentication service and JWT
    - Install jsonwebtoken and bcrypt dependencies
    - Create AuthService with login, logout, token generation
    - Implement JWT token generation with user ID, role, expiration
    - Implement token verification logic
    - _Requirements: 1.1, 1.2_

  - [ ]* 5.3 Write property tests for authentication
    - **Property 1: Valid Credentials Authentication**
    - **Validates: Requirements 1.1**

  - [ ]* 5.4 Write property tests for invalid credentials
    - **Property 2: Invalid Credentials Rejection**
    - **Validates: Requirements 1.2**

  - [x] 5.5 Create authentication middleware
    - Implement authenticate middleware to validate JWT tokens
    - Extract user information from token and attach to request
    - Handle token expiration and invalid tokens
    - _Requirements: 1.3_

  - [x] 5.6 Create authorization middleware
    - Implement authorize middleware for role-based access control
    - Define role permission mappings for endpoints
    - Return 403 Forbidden for unauthorized access
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 5.7 Write property tests for authorization
    - **Property 3: Role-Based Access Control**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**

  - [ ]* 5.8 Write property tests for unauthorized access
    - **Property 4: Unauthorized Access Denial**
    - **Validates: Requirements 1.8**

  - [x] 5.9 Create authentication routes and controller
    - Implement POST /api/v1/auth/login endpoint
    - Implement POST /api/v1/auth/logout endpoint
    - Implement GET /api/v1/auth/me endpoint
    - Implement POST /api/v1/auth/refresh endpoint
    - _Requirements: 1.1, 1.2, 1.3_


- [x] 6. Checkpoint - Verify authentication system
  - Test login with valid credentials returns JWT token
  - Test login with invalid credentials returns error
  - Test protected endpoints require valid JWT
  - Test role-based access control works correctly
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: Backend Core Services - Service Requests

- [x] 7. Implement service request management
  - [x] 7.1 Create ServiceRequest model and repository
    - Define ServiceRequest TypeScript interface with enums (ServiceStatus, Priority)
    - Implement ServiceRequestRepository with CRUD operations
    - Implement filtering by status, priority, customer, date range
    - Implement unique request number generation (SR-YYYY-NNNNN format)
    - _Requirements: 2.1, 2.2, 3.1_

  - [ ]* 7.2 Write property tests for service request creation
    - **Property 5: Service Request Creation Completeness**
    - **Validates: Requirements 2.1**

  - [ ]* 7.3 Write property tests for initial state
    - **Property 6: Service Request Initial State**
    - **Validates: Requirements 2.2, 2.6**

  - [ ]* 7.4 Write property tests for validation
    - **Property 7: Service Request Validation**
    - **Validates: Requirements 2.3**

  - [x] 7.5 Create service request routes and controller
    - Implement GET /api/v1/service-requests with filtering and pagination
    - Implement GET /api/v1/service-requests/:id
    - Implement POST /api/v1/service-requests with validation
    - Implement PUT /api/v1/service-requests/:id
    - Implement PATCH /api/v1/service-requests/:id/status
    - Apply authentication and authorization middleware
    - _Requirements: 2.1, 2.3, 3.1, 3.3_

  - [x] 7.6 Implement file attachment handling
    - Install and configure multer for file uploads
    - Create FileStorageService for file operations
    - Implement POST /api/v1/service-requests/:id/attachments
    - Implement GET /api/v1/service-requests/:id/attachments
    - Implement DELETE /api/v1/service-requests/:id/attachments/:attachmentId
    - Validate file types and sizes
    - _Requirements: 2.5_

  - [ ]* 7.7 Write property tests for file attachments
    - **Property 9: File Attachment Association**
    - **Validates: Requirements 2.5, 6.5**

  - [ ]* 7.8 Write property tests for filtering
    - **Property 10: Service Request Filtering**
    - **Validates: Requirements 3.1, 12.4**


### Phase 4: Backend Core Services - Customers and Instruments

- [x] 8. Implement customer management
  - [ ] 8.1 Create Customer model and repository
    - Define Customer and CustomerContact TypeScript interfaces
    - Implement CustomerRepository with CRUD operations
    - Implement methods to retrieve customer instruments and service requests
    - Implement soft delete with dependency checking
    - _Requirements: 7.1, 7.4, 7.5, 7.7_

  - [ ]* 8.2 Write property tests for customer creation
    - **Property 23: Customer Creation Completeness**
    - **Validates: Requirements 7.1**

  - [ ]* 8.3 Write property tests for contact management
    - **Property 24: Customer Contact Management**
    - **Validates: Requirements 7.3**

  - [ ]* 8.4 Write property tests for customer relationships
    - **Property 25: Customer Relationship Retrieval**
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 8.5 Write property tests for contact validation
    - **Property 26: Contact Information Validation**
    - **Validates: Requirements 7.6, 14.5, 14.6**

  - [ ] 8.6 Create customer routes and controller
    - Implement GET /api/v1/customers with pagination
    - Implement GET /api/v1/customers/:id
    - Implement POST /api/v1/customers with validation
    - Implement PUT /api/v1/customers/:id
    - Implement DELETE /api/v1/customers/:id (soft delete with checks)
    - Implement GET /api/v1/customers/:id/instruments
    - Implement GET /api/v1/customers/:id/service-requests
    - Implement POST /api/v1/customers/:id/contacts
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_

- [ ] 9. Implement instrument management
  - [ ] 9.1 Create Instrument model and repository
    - Define Instrument TypeScript interface with InstrumentStatus enum
    - Implement InstrumentRepository with CRUD operations
    - Implement serial number uniqueness check
    - Implement service history retrieval
    - Implement search by serial number
    - _Requirements: 4.1, 4.5, 4.6_

  - [ ]* 9.2 Write property tests for instrument registration
    - **Property 14: Instrument Registration Completeness**
    - **Validates: Requirements 4.1**

  - [ ]* 9.3 Write property tests for serial number uniqueness
    - **Property 15: Serial Number Uniqueness**
    - **Validates: Requirements 4.6**

  - [ ]* 9.4 Write property tests for service history
    - **Property 16: Instrument Service History**
    - **Validates: Requirements 4.5**

  - [ ] 9.5 Create instrument routes and controller
    - Implement GET /api/v1/instruments with filtering
    - Implement GET /api/v1/instruments/:id
    - Implement POST /api/v1/instruments with validation
    - Implement PUT /api/v1/instruments/:id
    - Implement PATCH /api/v1/instruments/:id/status
    - Implement GET /api/v1/instruments/:id/history
    - Implement GET /api/v1/instruments/serial/:serialNumber
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_


- [ ] 10. Checkpoint - Verify core entities
  - Test customer CRUD operations work correctly
  - Test instrument CRUD operations work correctly
  - Test service request CRUD operations work correctly
  - Test file upload and retrieval works
  - Test filtering and pagination work correctly
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Backend Notification System

- [ ] 11. Implement notification system
  - [ ] 11.1 Create Notification model and repository
    - Define Notification and NotificationPreferences TypeScript interfaces
    - Implement NotificationRepository with CRUD operations
    - Implement filtering by user, read status, date range
    - Implement mark as read functionality
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 11.2 Create NotificationService for business logic
    - Implement createNotification method
    - Implement notification routing based on user roles
    - Implement notification preference checking
    - Implement email sending integration (SMTP setup)
    - _Requirements: 11.1, 11.2, 11.3, 11.6_

  - [ ]* 11.3 Write property tests for notification creation
    - **Property 8: Service Request Notification**
    - **Validates: Requirements 2.4, 11.1**

  - [ ]* 11.4 Write property tests for priority change notifications
    - **Property 13: Priority Change Notification**
    - **Validates: Requirements 3.6**

  - [ ] 11.5 Create notification routes and controller
    - Implement GET /api/v1/notifications
    - Implement PATCH /api/v1/notifications/:id/read
    - Implement PATCH /api/v1/notifications/read-all
    - Implement GET /api/v1/notifications/preferences
    - Implement PUT /api/v1/notifications/preferences
    - _Requirements: 11.4, 11.5_

  - [ ] 11.6 Integrate notifications with service request creation
    - Add notification trigger when service request is created
    - Send notifications to all managers
    - _Requirements: 2.4, 11.1_


### Phase 6: Backend Work Orders and Scheduling

- [ ] 12. Implement work order management
  - [ ] 12.1 Create WorkOrder model and repository
    - Define WorkOrder TypeScript interface with status enum
    - Implement WorkOrderRepository with CRUD operations
    - Implement filtering by technician, status, date range
    - Implement unique work order number generation (WO-YYYY-NNNNN format)
    - _Requirements: 3.4, 5.1, 6.1_

  - [ ] 12.2 Create TechnicianAvailability model and repository
    - Define TechnicianAvailability TypeScript interface
    - Implement TechnicianAvailabilityRepository with CRUD operations
    - Implement availability checking for specific dates
    - _Requirements: 5.2, 5.3_

  - [ ] 12.3 Create SchedulingService for business logic
    - Implement work order creation from service request
    - Implement technician availability checking
    - Implement workload calculation for technicians
    - Implement conflict detection for scheduling
    - Update service request status to Scheduled when work order created
    - _Requirements: 3.4, 5.2, 5.3, 5.7_

  - [ ]* 12.4 Write property tests for work order creation
    - **Property 11: Work Order Creation from Assignment**
    - **Validates: Requirements 3.4, 5.5, 11.2**

  - [ ]* 12.5 Write property tests for availability checking
    - **Property 17: Technician Availability Check**
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 12.6 Write property tests for workload calculation
    - **Property 18: Technician Workload Calculation**
    - **Validates: Requirements 5.7**

  - [ ] 12.7 Create work order routes and controller
    - Implement GET /api/v1/work-orders with filtering
    - Implement GET /api/v1/work-orders/:id
    - Implement POST /api/v1/work-orders with scheduling logic
    - Implement PUT /api/v1/work-orders/:id
    - Implement PATCH /api/v1/work-orders/:id/status
    - Implement POST /api/v1/work-orders/:id/complete
    - Implement GET /api/v1/work-orders/technician/:techId
    - _Requirements: 3.4, 5.1, 5.4, 6.1_

  - [ ] 12.8 Create technician routes and controller
    - Implement GET /api/v1/technicians
    - Implement GET /api/v1/technicians/:id
    - Implement GET /api/v1/technicians/:id/availability
    - Implement PUT /api/v1/technicians/:id/availability
    - Implement GET /api/v1/technicians/:id/workload
    - Implement GET /api/v1/technicians/:id/schedule
    - _Requirements: 5.2, 5.3, 5.6, 5.7_

  - [ ] 12.9 Integrate work order notifications
    - Add notification trigger when work order is assigned
    - Send notification to assigned technician
    - _Requirements: 5.5, 11.2_


### Phase 7: Backend Service Records and Parts Inventory

- [ ] 13. Implement service record management
  - [ ] 13.1 Create ServiceRecord model and repository
    - Define ServiceRecord and ServiceRecordParts TypeScript interfaces
    - Implement ServiceRecordRepository with CRUD operations
    - Implement labor total calculation (hours * rate)
    - Implement parts total calculation
    - _Requirements: 6.3, 6.4_

  - [ ]* 13.2 Write property tests for technician isolation
    - **Property 19: Technician Work Order Isolation**
    - **Validates: Requirements 6.1**

  - [ ]* 13.3 Write property tests for status transitions
    - **Property 20: Work Order Status Transitions**
    - **Validates: Requirements 6.2, 6.4**

  - [ ]* 13.4 Write property tests for service record completeness
    - **Property 21: Service Record Completeness**
    - **Validates: Requirements 6.3**

  - [ ]* 13.5 Write property tests for work time tracking
    - **Property 22: Work Time Tracking**
    - **Validates: Requirements 6.7**

  - [ ] 13.6 Implement work order completion logic
    - Update work order status to Completed
    - Create service record with all required fields
    - Record actual start and end times
    - Update instrument status if needed
    - _Requirements: 6.2, 6.3, 6.4, 6.7_

- [ ] 14. Implement parts inventory management
  - [ ] 14.1 Create Part model and repository
    - Define Part and PartsAdjustment TypeScript interfaces
    - Implement PartRepository with CRUD operations
    - Implement reorder threshold checking
    - Implement usage history retrieval
    - _Requirements: 8.1, 8.3, 8.5_

  - [ ]* 14.2 Write property tests for inventory decrement
    - **Property 27: Parts Inventory Decrement**
    - **Validates: Requirements 8.2**

  - [ ]* 14.3 Write property tests for reorder detection
    - **Property 28: Reorder Threshold Detection**
    - **Validates: Requirements 8.3**

  - [ ]* 14.4 Write property tests for inventory non-negativity
    - **Property 29: Inventory Non-Negativity**
    - **Validates: Requirements 8.6**

  - [ ]* 14.5 Write property tests for usage history
    - **Property 30: Parts Usage History**
    - **Validates: Requirements 8.5**

  - [ ] 14.6 Create parts routes and controller
    - Implement GET /api/v1/parts with filtering
    - Implement GET /api/v1/parts/:id
    - Implement POST /api/v1/parts with validation
    - Implement PUT /api/v1/parts/:id
    - Implement POST /api/v1/parts/:id/adjust for inventory adjustments
    - Implement GET /api/v1/parts/:id/history
    - Implement GET /api/v1/parts/reorder for parts needing reorder
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

- [ ] 15. Checkpoint - Verify work orders and inventory
  - Test work order creation and assignment works
  - Test technician availability checking works
  - Test service record creation on work order completion
  - Test parts inventory decrements correctly
  - Test reorder threshold detection works
  - Ensure all tests pass, ask the user if questions arise.


### Phase 8: Backend Invoicing System

- [ ] 16. Implement invoice management
  - [ ] 16.1 Create Invoice model and repository
    - Define Invoice, InvoiceLineItem, InvoicePayment TypeScript interfaces
    - Implement InvoiceRepository with CRUD operations
    - Implement filtering by customer, status, date range
    - Implement unique invoice number generation (INV-YYYY-NNNNN format)
    - Implement overdue invoice detection
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 16.2 Create InvoiceService for business logic
    - Implement invoice generation from service record
    - Calculate subtotal from labor and parts
    - Calculate tax amount based on tax rate
    - Calculate total amount (subtotal + tax)
    - Create invoice line items for labor and parts
    - _Requirements: 9.1, 9.5_

  - [ ]* 16.3 Write property tests for invoice calculation
    - **Property 31: Invoice Calculation Correctness**
    - **Validates: Requirements 9.5**

  - [ ]* 16.4 Write property tests for invoice status transitions
    - **Property 32: Invoice Status Transitions**
    - **Validates: Requirements 9.6**

  - [ ]* 16.5 Write property tests for payment recording
    - **Property 33: Payment Recording**
    - **Validates: Requirements 9.7**

  - [ ]* 16.6 Write property tests for overdue detection
    - **Property 34: Overdue Invoice Detection**
    - **Validates: Requirements 9.8**

  - [ ] 16.7 Implement PDF generation for invoices
    - Install PDF generation library (pdfkit or puppeteer)
    - Create invoice PDF template
    - Implement PDF generation service
    - _Requirements: 10.1_

  - [ ] 16.8 Create invoice routes and controller
    - Implement GET /api/v1/invoices with filtering
    - Implement GET /api/v1/invoices/:id
    - Implement POST /api/v1/invoices to generate invoice
    - Implement PUT /api/v1/invoices/:id (draft only)
    - Implement PATCH /api/v1/invoices/:id/status
    - Implement POST /api/v1/invoices/:id/send
    - Implement POST /api/v1/invoices/:id/payment to record payment
    - Implement GET /api/v1/invoices/:id/pdf to download PDF
    - Implement GET /api/v1/invoices/overdue
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6, 9.7, 9.8, 10.1_

  - [ ] 16.9 Integrate invoice notifications
    - Add notification trigger when invoice becomes overdue
    - Send notifications to managers and customer users
    - _Requirements: 11.3_


### Phase 9: Backend Service Templates and Search

- [ ] 17. Implement service template management
  - [ ] 17.1 Create ServiceTemplate model and repository
    - Define ServiceTemplate and TemplateChecklistItem TypeScript interfaces
    - Implement ServiceTemplateRepository with CRUD operations
    - Implement filtering by instrument type
    - Implement usage statistics tracking
    - _Requirements: 17.1, 17.2, 17.6_

  - [ ]* 17.2 Write property tests for template creation
    - **Property 54: Template Creation with Checklist**
    - **Validates: Requirements 17.1**

  - [ ]* 17.3 Write property tests for template suggestion
    - **Property 55: Template Suggestion by Instrument Type**
    - **Validates: Requirements 17.3**

  - [ ]* 17.4 Write property tests for usage tracking
    - **Property 56: Template Usage Tracking**
    - **Validates: Requirements 17.6**

  - [ ]* 17.5 Write property tests for version control
    - **Property 57: Template Version Control**
    - **Validates: Requirements 17.7**

  - [ ] 17.6 Create template routes and controller
    - Implement GET /api/v1/templates
    - Implement GET /api/v1/templates/:id
    - Implement POST /api/v1/templates
    - Implement PUT /api/v1/templates/:id with version increment
    - Implement DELETE /api/v1/templates/:id
    - Implement GET /api/v1/templates/instrument-type/:type
    - Implement GET /api/v1/templates/:id/usage-stats
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [ ] 18. Implement search functionality
  - [ ] 18.1 Create SearchService for unified search
    - Implement customer search by name, email, phone
    - Implement instrument search by serial number, model, manufacturer
    - Implement service request search by request number, description
    - Use database full-text search or LIKE queries
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 18.2 Write property tests for search functionality
    - **Property 40: Search Result Relevance**
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [ ] 18.3 Add search endpoints to existing routes
    - Add search parameter to GET /api/v1/customers
    - Add search parameter to GET /api/v1/instruments
    - Add search parameter to GET /api/v1/service-requests
    - _Requirements: 12.1, 12.2, 12.3_


### Phase 10: Backend Audit, Reporting, and Data Operations

- [ ] 19. Implement audit log system
  - [ ] 19.1 Create AuditLog model and repository
    - Define AuditLog TypeScript interface
    - Implement AuditLogRepository with query operations
    - Implement filtering by user, entity, action, date range
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ]* 19.2 Write property tests for audit completeness
    - **Property 44: Audit Log Completeness**
    - **Validates: Requirements 13.1, 13.2, 13.3, 3.2, 4.7, 8.7**

  - [ ]* 19.3 Write property tests for audit filtering
    - **Property 45: Audit Log Filtering**
    - **Validates: Requirements 13.4**

  - [ ]* 19.4 Write property tests for audit immutability
    - **Property 46: Audit Log Immutability**
    - **Validates: Requirements 13.5**

  - [ ]* 19.5 Write property tests for administrator access
    - **Property 47: Administrator Audit Access**
    - **Validates: Requirements 13.6**

  - [ ] 19.6 Create audit routes and controller
    - Implement GET /api/v1/audit (admin only)
    - Implement GET /api/v1/audit/user/:userId
    - Implement GET /api/v1/audit/entity/:entityType/:entityId
    - Prevent modification/deletion of audit logs
    - _Requirements: 13.4, 13.5, 13.6_

- [ ] 20. Implement reporting system
  - [ ] 20.1 Create ReportService for business intelligence
    - Implement service volume report (requests by date range)
    - Implement technician productivity report (completed work orders)
    - Implement revenue report (invoices by date range)
    - Implement average completion time calculation
    - Implement dashboard KPI calculations
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 20.2 Write property tests for report calculations
    - **Property 41: Report Calculation Accuracy**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4**

  - [ ] 20.3 Create report routes and controller
    - Implement GET /api/v1/reports/service-volume
    - Implement GET /api/v1/reports/technician-productivity
    - Implement GET /api/v1/reports/revenue
    - Implement GET /api/v1/reports/completion-time
    - Implement GET /api/v1/reports/dashboard-metrics
    - Implement POST /api/v1/reports/export for PDF/CSV export
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 21. Implement data export and import
  - [ ] 21.1 Create ExportService for CSV generation
    - Implement customer export to CSV
    - Implement instrument export to CSV
    - Implement service record export to CSV
    - Include all visible columns and respect filters
    - _Requirements: 16.1, 16.2, 16.3, 16.7_

  - [ ]* 21.2 Write property tests for CSV export
    - **Property 52: CSV Export Completeness**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.7**

  - [ ] 21.3 Create ImportService for CSV parsing
    - Implement customer import from CSV
    - Implement instrument import from CSV
    - Validate each row and collect errors
    - Support bulk insert with transaction
    - _Requirements: 16.4, 16.5, 16.6_

  - [ ]* 21.4 Write property tests for CSV import
    - **Property 53: CSV Import Validation**
    - **Validates: Requirements 16.4, 16.5, 16.6**

  - [ ] 21.5 Add export/import endpoints
    - Add export endpoints to customer, instrument, service record routes
    - Add import endpoints to customer and instrument routes
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_


### Phase 11: Backend Validation, Error Handling, and Performance

- [ ] 22. Implement comprehensive validation
  - [ ] 22.1 Create ValidationService with reusable validators
    - Implement email format validation (RFC 5322)
    - Implement phone number format validation
    - Implement date validation (valid dates, reasonable ranges)
    - Implement required field validation
    - Implement string length validation
    - Implement numeric range validation
    - _Requirements: 14.1, 14.2, 14.5, 14.6, 14.7_

  - [ ]* 22.2 Write property tests for validation
    - **Property 48: Required Field Validation**
    - **Validates: Requirements 14.1**

  - [ ]* 22.3 Write property tests for format validation
    - **Property 49: Format Validation with Examples**
    - **Validates: Requirements 14.2**

  - [ ]* 22.4 Write property tests for date validation
    - **Property 51: Date Validation**
    - **Validates: Requirements 14.7**

  - [ ] 22.5 Create validation middleware
    - Implement request validation middleware using validation service
    - Return detailed validation errors with field names and examples
    - Apply to all POST and PUT endpoints
    - _Requirements: 14.1, 14.2_

- [ ] 23. Implement error handling and logging
  - [ ] 23.1 Create error handling infrastructure
    - Create custom error classes (ValidationError, AuthenticationError, etc.)
    - Implement global error handler middleware
    - Implement structured logging with Winston or Pino
    - Log errors with context (user, request ID, stack trace)
    - Return user-friendly error messages without internal details
    - _Requirements: 14.3, 14.4_

  - [ ]* 23.2 Write property tests for error handling
    - **Property 50: Error Logging and User-Friendly Messages**
    - **Validates: Requirements 14.3**

  - [ ] 23.3 Implement rate limiting
    - Install and configure express-rate-limit
    - Apply rate limiting to authentication endpoints
    - Apply rate limiting to public endpoints
    - _Requirements: 19.6_

- [ ] 24. Implement performance optimizations
  - [ ] 24.1 Add pagination to all list endpoints
    - Implement pagination helper function
    - Add pagination to all GET endpoints returning lists
    - Return pagination metadata (page, pageSize, totalItems, totalPages)
    - Default page size of 20, max 100
    - _Requirements: 19.4_

  - [ ]* 24.2 Write property tests for pagination
    - **Property 60: Pagination for Large Lists**
    - **Validates: Requirements 19.4**

  - [ ] 24.3 Implement response compression
    - Install and configure compression middleware
    - Enable gzip compression for responses > 1KB
    - _Requirements: 19.7_

  - [ ]* 24.4 Write property tests for compression
    - **Property 61: Response Compression**
    - **Validates: Requirements 19.7**

  - [ ] 24.5 Add database query optimization
    - Review and optimize database indexes
    - Implement connection pooling configuration
    - Add query result caching where appropriate
    - _Requirements: 19.1, 19.2, 19.3_


### Phase 12: Backend User Management and Customer Portal

- [ ] 25. Implement user management
  - [ ] 25.1 Create user management routes and controller
    - Implement GET /api/v1/users (admin only)
    - Implement GET /api/v1/users/:id
    - Implement POST /api/v1/users (admin only)
    - Implement PUT /api/v1/users/:id
    - Implement DELETE /api/v1/users/:id (admin only)
    - Implement PATCH /api/v1/users/:id/password
    - Validate user role and customer association
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

  - [ ]* 25.2 Write property tests for referential integrity
    - **Property 12: Referential Integrity Protection**
    - **Validates: Requirements 3.5, 7.7**

- [ ] 26. Implement customer portal data isolation
  - [ ] 26.1 Add customer data filtering to repositories
    - Add customer ID filtering to ServiceRequestRepository
    - Add customer ID filtering to InstrumentRepository
    - Add customer ID filtering to InvoiceRepository
    - Reject access attempts to other customers' data
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ]* 26.2 Write property tests for customer isolation
    - **Property 58: Customer Data Isolation**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 1.7**

  - [ ]* 26.3 Write property tests for self-service updates
    - **Property 59: Customer Self-Service Updates**
    - **Validates: Requirements 18.7**

  - [ ] 26.4 Implement customer self-service endpoints
    - Allow Customer_User to update their contact information
    - Allow Customer_User to view their service requests
    - Allow Customer_User to view their instruments
    - Allow Customer_User to view their invoices
    - _Requirements: 18.7_

- [ ] 27. Checkpoint - Verify backend completeness
  - Test all CRUD operations work correctly
  - Test all property-based tests pass
  - Test authentication and authorization work correctly
  - Test notifications are sent correctly
  - Test audit logging captures all operations
  - Test data isolation for customer users works
  - Ensure all tests pass, ask the user if questions arise.


### Phase 13: Frontend Infrastructure Setup

- [x] 28. Set up Angular project structure and dependencies
  - [x] 28.1 Install required dependencies
    - Install Angular Material or PrimeNG for UI components
    - Install fast-check for property-based testing
    - Install date-fns or moment for date handling
    - Install chart.js or ngx-charts for reporting visualizations
    - _Requirements: Foundation for frontend_

  - [x] 28.2 Create core folder structure
    - Create src/app/core directory with auth, api, notification, state subdirectories
    - Create src/app/shared directory with components, directives, pipes, models subdirectories
    - Create src/app/features directory for feature modules
    - _Requirements: Foundation for frontend_

  - [x] 28.3 Create shared TypeScript models
    - Create user.model.ts with User interface and UserRole enum
    - Create service-request.model.ts with ServiceRequest, ServiceStatus, Priority enums
    - Create instrument.model.ts with Instrument and InstrumentStatus enum
    - Create work-order.model.ts with WorkOrder interface
    - Create customer.model.ts with Customer and CustomerContact interfaces
    - Create invoice.model.ts with Invoice, InvoiceLineItem, InvoicePayment, InvoiceStatus enum
    - Create parts.model.ts with Part and PartsAdjustment interfaces
    - Create notification.model.ts with Notification and NotificationPreferences interfaces
    - Create template.model.ts with ServiceTemplate and TemplateChecklistItem interfaces
    - _Requirements: Type safety across frontend_

  - [x] 28.4 Configure global styles and theme
    - Set up SCSS variables for colors, spacing, typography
    - Configure UI component library theme
    - Add responsive breakpoints
    - _Requirements: Consistent UI/UX_


### Phase 14: Frontend Core Services

- [x] 29. Implement authentication services
  - [x] 29.1 Create AuthService
    - Implement login method calling POST /api/v1/auth/login
    - Implement logout method
    - Implement token storage in memory (not localStorage)
    - Implement getCurrentUser method
    - Implement isAuthenticated method
    - Use RxJS BehaviorSubject for current user state
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 29.2 Create AuthInterceptor
    - Implement HTTP interceptor to inject JWT token in Authorization header
    - Handle token refresh on 401 responses
    - _Requirements: 1.3_

  - [x] 29.3 Create ErrorInterceptor
    - Implement HTTP interceptor for global error handling
    - Display user-friendly error messages
    - Log errors to console in development
    - _Requirements: 14.3, 14.4_

  - [x] 29.4 Create AuthGuard
    - Implement canActivate guard to protect routes
    - Redirect to login if not authenticated
    - _Requirements: 1.3_

  - [x] 29.5 Create RoleGuard
    - Implement canActivate guard for role-based route protection
    - Check user role against required roles
    - Show 403 error if unauthorized
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [x] 30. Implement API service layer
  - [x] 30.1 Create base ApiService
    - Implement generic HTTP methods (get, post, put, patch, delete)
    - Handle request/response transformation
    - Implement error handling
    - _Requirements: Foundation for all API calls_

  - [x] 30.2 Create ServiceRequestService
    - Implement methods for all service request endpoints
    - Implement file upload for attachments
    - Implement filtering and pagination
    - _Requirements: 2.1, 2.5, 3.1_

  - [x] 30.3 Create InstrumentService
    - Implement methods for all instrument endpoints
    - Implement search by serial number
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 30.4 Create CustomerService
    - Implement methods for all customer endpoints
    - Implement contact management methods
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 30.5 Create WorkOrderService
    - Implement methods for all work order endpoints
    - Implement technician-specific queries
    - _Requirements: 5.1, 5.4, 6.1_

  - [x] 30.6 Create InvoiceService
    - Implement methods for all invoice endpoints
    - Implement PDF download
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1_

  - [x] 30.7 Create PartService
    - Implement methods for all parts endpoints
    - Implement reorder list retrieval
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

  - [x] 30.8 Create NotificationService
    - Implement methods for notification endpoints
    - Implement real-time notification updates (polling or WebSocket)
    - Implement mark as read functionality
    - _Requirements: 11.4, 11.5_

  - [x] 30.9 Create TemplateService
    - Implement methods for template endpoints
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [x] 30.10 Create ReportService
    - Implement methods for report endpoints
    - Implement export functionality
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_


### Phase 15: Frontend Shared Component Library

- [ ] 31. Create reusable shared components
  - [x] 31.1 Create DataTableComponent
    - Implement generic table with column configuration
    - Add sorting functionality
    - Add filtering functionality
    - Add pagination controls
    - Add row selection
    - Add export to CSV button
    - Make responsive with mobile view
    - _Requirements: 12.4, 16.7, 19.4_

  - [x] 31.2 Create FormFieldComponent
    - Implement consistent form input wrapper
    - Display validation errors
    - Support text, number, date, select, textarea types
    - Add accessibility attributes
    - _Requirements: 14.1, 14.2_

  - [x] 31.3 Create FileUploadComponent
    - Implement drag-and-drop interface
    - Validate file type and size
    - Show upload progress
    - Support multiple files
    - Show preview for images
    - _Requirements: 2.5, 6.5_

  - [x] 31.4 Create StatusBadgeComponent
    - Implement color-coded status indicators
    - Support all status enums (ServiceStatus, InvoiceStatus, InstrumentStatus)
    - _Requirements: Visual consistency_

  - [x] 31.5 Create ModalComponent
    - Implement reusable modal dialog wrapper
    - Support custom content projection
    - Handle keyboard navigation (ESC to close)
    - _Requirements: UX consistency_

  - [x] 31.6 Create ConfirmationDialogComponent
    - Implement confirmation prompt for destructive actions
    - Return boolean result via Observable
    - _Requirements: UX safety_

  - [x] 31.7 Create LoadingSpinnerComponent
    - Implement loading indicator
    - Support inline and overlay modes
    - _Requirements: UX feedback_

  - [x] 31.8 Create SearchBarComponent
    - Implement search input with debounce
    - Emit search term changes
    - Show clear button when has value
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 31.9 Create PaginationComponent
    - Implement pagination controls
    - Show page numbers and navigation buttons
    - Emit page change events
    - _Requirements: 19.4_

  - [x] 31.10 Create DatePickerComponent
    - Implement date selection component
    - Validate date ranges
    - Support min/max dates
    - _Requirements: Date input consistency_


- [ ] 32. Create shared directives and pipes
  - [x] 32.1 Create HasRoleDirective
    - Implement structural directive for conditional rendering by role
    - Hide elements if user doesn't have required role
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

  - [x] 32.2 Create AutoFocusDirective
    - Implement directive to auto-focus inputs
    - _Requirements: UX enhancement_

  - [x] 32.3 Create DateFormatPipe
    - Implement pipe for consistent date formatting
    - Support multiple format options
    - _Requirements: Consistent date display_

  - [x] 32.4 Create CurrencyFormatPipe
    - Implement pipe for currency formatting
    - _Requirements: Consistent currency display_

  - [x] 32.5 Create StatusLabelPipe
    - Implement pipe to convert status enums to display labels
    - _Requirements: Consistent status display_

- [ ] 33. Checkpoint - Verify shared components
  - Test all shared components render correctly
  - Test form validation displays errors
  - Test file upload works
  - Test data table sorting and filtering work
  - Ensure all tests pass, ask the user if questions arise.


### Phase 16: Frontend Authentication and Dashboard

- [ ] 34. Implement authentication feature
  - [x] 34.1 Create LoginComponent
    - Create login form with email and password fields
    - Implement form validation
    - Call AuthService.login on submit
    - Redirect to dashboard on success
    - Display error messages on failure
    - _Requirements: 1.1, 1.2_

  - [x] 34.2 Configure authentication routes
    - Add /login route
    - Configure route guards for protected routes
    - _Requirements: 1.3_

  - [ ]* 34.3 Write unit tests for LoginComponent
    - Test form validation
    - Test successful login flow
    - Test error handling
    - _Requirements: 1.1, 1.2_

- [x] 35. Implement dashboard feature
  - [x] 35.1 Create DashboardComponent
    - Create role-specific dashboard layout
    - Show different widgets based on user role
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

  - [x] 35.2 Create PendingRequestsWidgetComponent
    - Display count and list of pending service requests
    - Show for Manager and Administrator roles
    - Link to service request detail
    - _Requirements: 3.1_

  - [x] 35.3 Create ActiveWorkOrdersWidgetComponent
    - Display count and list of active work orders
    - Show for Technician role (their work orders)
    - Show for Manager role (all work orders)
    - _Requirements: 6.1_

  - [x] 35.4 Create OverdueInvoicesWidgetComponent
    - Display count and list of overdue invoices
    - Show for Manager and Administrator roles
    - _Requirements: 9.8_

  - [x] 35.5 Create TechnicianScheduleWidgetComponent
    - Display technician's schedule for current week
    - Show for Technician role
    - _Requirements: 5.6_

  - [x] 35.6 Configure dashboard routes
    - Add /dashboard route with AuthGuard
    - Set as default route after login
    - _Requirements: 1.3_


### Phase 17: Frontend Service Request Management

- [ ] 36. Implement service request feature
  - [x] 36.1 Create ServiceRequestListComponent
    - Display service requests in data table
    - Implement filtering by status, priority, customer, date range
    - Implement search functionality
    - Implement pagination
    - Add "Create New" button (Manager/Admin only)
    - Add row actions (view, edit, delete)
    - Apply role-based visibility
    - _Requirements: 3.1, 12.4, 19.4_

  - [x] 36.2 Create ServiceRequestDetailComponent
    - Display full service request details
    - Show associated instrument information
    - Show customer information
    - Display attachments with download links
    - Show work order if exists
    - Add "Assign Technician" button (Manager only)
    - Add "Update Status" button
    - Add "Change Priority" button
    - _Requirements: 2.1, 3.3, 3.4_

  - [x] 36.3 Create ServiceRequestFormComponent
    - Create form for new service request
    - Include instrument selection (dropdown or search)
    - Include problem description textarea
    - Include priority selection
    - Include preferred service date picker
    - Implement file upload for attachments
    - Implement form validation
    - Call ServiceRequestService on submit
    - _Requirements: 2.1, 2.3, 2.5_

  - [x] 36.4 Configure service request routes
    - Add /service-requests route with AuthGuard
    - Add /service-requests/new route with RoleGuard (Manager/Admin)
    - Add /service-requests/:id route
    - Add /service-requests/:id/edit route
    - _Requirements: 1.4, 1.5_

  - [ ]* 36.5 Write unit tests for service request components
    - Test list component displays data correctly
    - Test filtering works
    - Test form validation
    - Test file upload
    - _Requirements: 2.1, 2.3, 2.5, 3.1_


### Phase 18: Frontend Instrument Management

- [ ] 37. Implement instrument feature
  - [x] 37.1 Create InstrumentListComponent
    - Display instruments in data table
    - Implement filtering by customer, status, type
    - Implement search by serial number, model, manufacturer
    - Implement pagination
    - Add "Register New" button (Manager/Admin only)
    - Add row actions (view, edit)
    - _Requirements: 4.2, 12.2, 19.4_

  - [x] 37.2 Create InstrumentDetailComponent
    - Display full instrument details
    - Show customer information
    - Display current status
    - Add "View Service History" button
    - Add "Update Status" button
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 37.3 Create InstrumentFormComponent
    - Create form for instrument registration
    - Include customer selection dropdown
    - Include manufacturer, model, serial number inputs
    - Include instrument type and location inputs
    - Implement form validation
    - Validate serial number uniqueness
    - Call InstrumentService on submit
    - _Requirements: 4.1, 4.6_

  - [x] 37.4 Create InstrumentHistoryComponent
    - Display service history in chronological order
    - Show service date, technician, work performed
    - Show parts used and labor hours
    - Link to full service record
    - _Requirements: 4.5_

  - [x] 37.5 Configure instrument routes
    - Add /instruments route with AuthGuard
    - Add /instruments/new route with RoleGuard (Manager/Admin)
    - Add /instruments/:id route
    - Add /instruments/:id/edit route
    - Add /instruments/:id/history route
    - _Requirements: 1.4, 1.5_

  - [ ]* 37.6 Write unit tests for instrument components
    - Test list component displays data correctly
    - Test search functionality
    - Test form validation
    - Test serial number uniqueness check
    - _Requirements: 4.1, 4.2, 4.6, 12.2_


### Phase 19: Frontend Customer Management

- [ ] 38. Implement customer feature
  - [x] 38.1 Create CustomerListComponent
    - Display customers in data table
    - Implement search by name, email, phone
    - Implement pagination
    - Add "Create New" button (Manager/Admin only)
    - Add row actions (view, edit, delete)
    - Add export to CSV button
    - _Requirements: 7.2, 12.1, 16.1, 19.4_

  - [x] 38.2 Create CustomerDetailComponent
    - Display full customer details
    - Show billing and service addresses
    - Display contact persons list
    - Add "Add Contact" button
    - Show customer's instruments
    - Show customer's service requests
    - Add "Edit" and "Delete" buttons (Manager/Admin only)
    - _Requirements: 7.3, 7.4, 7.5_

  - [x] 38.3 Create CustomerFormComponent
    - Create form for customer creation/editing
    - Include organization name and primary contact fields
    - Include billing address fields
    - Include service address fields (optional)
    - Implement email and phone validation
    - Call CustomerService on submit
    - _Requirements: 7.1, 7.6_

  - [x] 38.4 Create ContactFormComponent
    - Create form for adding contact person
    - Include name, title, phone, email fields
    - Include "is primary" checkbox
    - Implement validation
    - _Requirements: 7.3_

  - [x] 38.5 Configure customer routes
    - Add /customers route with AuthGuard
    - Add /customers/new route with RoleGuard (Manager/Admin)
    - Add /customers/:id route
    - Add /customers/:id/edit route
    - _Requirements: 1.4, 1.5_

  - [ ]* 38.6 Write unit tests for customer components
    - Test list component displays data correctly
    - Test search functionality
    - Test form validation
    - Test contact management
    - _Requirements: 7.1, 7.2, 7.3, 12.1_


### Phase 20: Frontend Work Order and Scheduling

- [ ] 39. Implement work order feature
  - [x] 39.1 Create WorkOrderListComponent
    - Display work orders in data table
    - Implement filtering by status, technician, date range
    - Implement pagination
    - Add "Create New" button (Manager only)
    - Add row actions (view, start, complete)
    - Show only assigned work orders for Technician role
    - _Requirements: 5.1, 6.1, 19.4_

  - [x] 39.2 Create WorkOrderDetailComponent
    - Display full work order details
    - Show service request information
    - Show instrument information
    - Show assigned technician
    - Show scheduled date and time
    - Display template checklist if applicable
    - Add "Start Work" button (Technician only, if status is Scheduled)
    - Add "Complete Work" button (Technician only, if status is In_Progress)
    - _Requirements: 6.2, 6.4, 17.3_

  - [x] 39.3 Create WorkOrderFormComponent
    - Create form for work order creation
    - Include service request selection
    - Include technician selection with availability check
    - Include scheduled date picker
    - Include scheduled time inputs
    - Show availability conflicts
    - Include template selection (optional)
    - Call WorkOrderService on submit
    - _Requirements: 3.4, 5.2, 5.3_

  - [x] 39.4 Create WorkOrderExecutionComponent
    - Create interface for technicians to complete work
    - Display template checklist if applicable
    - Include work performed textarea
    - Include findings textarea
    - Include labor hours input
    - Include labor rate input (auto-filled)
    - Include parts used section (add/remove parts)
    - Include file upload for photos/documents
    - Call WorkOrderService.complete on submit
    - _Requirements: 6.3, 6.5, 6.6_

  - [x] 39.5 Configure work order routes
    - Add /work-orders route with AuthGuard
    - Add /work-orders/new route with RoleGuard (Manager)
    - Add /work-orders/:id route
    - Add /work-orders/:id/execute route with RoleGuard (Technician)
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 40. Implement scheduling feature
  - [x] 40.1 Create CalendarViewComponent
    - Display work orders in calendar view
    - Show technician schedules
    - Color-code by status
    - Allow drag-and-drop rescheduling (Manager only)
    - _Requirements: 5.6_

  - [-] 40.2 Create TechnicianAvailabilityComponent
    - Display technician availability calendar
    - Allow technicians to set availability
    - Show workload metrics
    - _Requirements: 5.2, 5.3, 5.7_

  - [~] 40.3 Configure scheduling routes
    - Add /scheduling route with AuthGuard
    - Add /scheduling/availability route with RoleGuard (Technician)
    - _Requirements: 1.4, 1.6_

  - [ ]* 40.4 Write unit tests for work order components
    - Test list filtering works
    - Test technician isolation for Technician role
    - Test availability checking
    - Test work order completion form
    - _Requirements: 5.2, 5.3, 6.1, 6.3_


### Phase 21: Frontend Parts Inventory

- [ ] 41. Implement parts inventory feature
  - [ ] 41.1 Create PartsListComponent
    - Display parts in data table
    - Implement filtering by manufacturer, status
    - Implement search by part number, description
    - Highlight parts needing reorder
    - Implement pagination
    - Add "Create New" button (Manager/Admin only)
    - Add row actions (view, edit, adjust inventory)
    - _Requirements: 8.1, 8.3, 19.4_

  - [ ] 41.2 Create PartsDetailComponent
    - Display full part details
    - Show current quantity on hand
    - Show reorder threshold
    - Display usage history
    - Add "Adjust Inventory" button
    - Add "Edit" button (Manager/Admin only)
    - _Requirements: 8.4, 8.5_

  - [ ] 41.3 Create PartsFormComponent
    - Create form for part creation/editing
    - Include part number, description, manufacturer inputs
    - Include unit cost, quantity on hand, reorder threshold inputs
    - Implement form validation
    - Call PartService on submit
    - _Requirements: 8.1_

  - [ ] 41.4 Create PartsAdjustmentComponent
    - Create form for inventory adjustment
    - Include adjustment type selection (Received, Damaged, Lost, Correction)
    - Include quantity change input
    - Include reason textarea
    - Call PartService.adjust on submit
    - _Requirements: 8.4_

  - [ ] 41.5 Configure parts routes
    - Add /parts route with AuthGuard
    - Add /parts/new route with RoleGuard (Manager/Admin)
    - Add /parts/:id route
    - Add /parts/:id/edit route with RoleGuard (Manager/Admin)
    - Add /parts/:id/adjust route with RoleGuard (Manager/Admin)
    - _Requirements: 1.4, 1.5_

  - [ ]* 41.6 Write unit tests for parts components
    - Test list component displays data correctly
    - Test reorder highlighting
    - Test adjustment form validation
    - _Requirements: 8.1, 8.3, 8.4_


### Phase 22: Frontend Invoicing

- [ ] 42. Implement invoice feature
  - [ ] 42.1 Create InvoiceListComponent
    - Display invoices in data table
    - Implement filtering by customer, status, date range
    - Highlight overdue invoices
    - Implement pagination
    - Add "Generate Invoice" button (Manager/Admin only)
    - Add row actions (view, send, record payment, download PDF)
    - _Requirements: 9.2, 9.8, 19.4_

  - [ ] 42.2 Create InvoiceDetailComponent
    - Display full invoice details
    - Show customer information
    - Display line items table
    - Show subtotal, tax, and total calculations
    - Display payment history
    - Add "Send Invoice" button
    - Add "Record Payment" button
    - Add "Download PDF" button
    - Add "Edit" button (draft only)
    - _Requirements: 9.3, 9.4, 9.5, 9.7, 10.1_

  - [ ] 42.3 Create InvoiceGeneratorComponent
    - Create form for invoice generation
    - Include service record selection
    - Auto-populate line items from service record (labor and parts)
    - Include tax rate input
    - Show calculated subtotal, tax amount, and total
    - Include payment terms input
    - Include notes textarea
    - Call InvoiceService.generate on submit
    - _Requirements: 9.1, 9.5_

  - [ ] 42.4 Create PaymentRecordComponent
    - Create form for recording payment
    - Include payment date picker
    - Include amount input
    - Include payment method selection
    - Include reference number input
    - Include notes textarea
    - Call InvoiceService.recordPayment on submit
    - _Requirements: 9.7_

  - [ ] 42.5 Configure invoice routes
    - Add /invoices route with AuthGuard
    - Add /invoices/generate route with RoleGuard (Manager/Admin)
    - Add /invoices/:id route
    - Add /invoices/:id/edit route with RoleGuard (Manager/Admin, draft only)
    - _Requirements: 1.4, 1.5_

  - [ ]* 42.6 Write unit tests for invoice components
    - Test list component displays data correctly
    - Test overdue highlighting
    - Test calculation correctness
    - Test payment recording
    - _Requirements: 9.2, 9.5, 9.7, 9.8_


### Phase 23: Frontend Reporting and Templates

- [ ] 43. Implement reporting feature
  - [ ] 43.1 Create ReportDashboardComponent
    - Display report selection menu
    - Show quick stats (total requests, active work orders, revenue)
    - Provide links to detailed reports
    - _Requirements: 15.5_

  - [ ] 43.2 Create ServiceVolumeReportComponent
    - Display service volume chart by date range
    - Include date range picker
    - Show breakdown by status
    - Add export button
    - _Requirements: 15.1, 15.6_

  - [ ] 43.3 Create TechnicianProductivityReportComponent
    - Display productivity metrics per technician
    - Show completed work orders count
    - Show total labor hours
    - Include date range picker
    - Add export button
    - _Requirements: 15.2, 15.6_

  - [ ] 43.4 Create RevenueReportComponent
    - Display revenue chart by date range
    - Show breakdown by customer
    - Show paid vs outstanding amounts
    - Include date range picker
    - Add export button
    - _Requirements: 15.3, 15.6_

  - [ ] 43.5 Configure report routes
    - Add /reports route with AuthGuard and RoleGuard (Manager/Admin)
    - Add /reports/service-volume route
    - Add /reports/technician-productivity route
    - Add /reports/revenue route
    - _Requirements: 1.4, 1.5, 15.1, 15.2, 15.3_

- [ ] 44. Implement service template feature
  - [ ] 44.1 Create TemplateListComponent
    - Display templates in data table
    - Implement filtering by instrument type
    - Add "Create New" button (Manager/Admin only)
    - Add row actions (view, edit, delete)
    - Show usage statistics
    - _Requirements: 17.2, 17.6_

  - [ ] 44.2 Create TemplateEditorComponent
    - Create form for template creation/editing
    - Include name and description inputs
    - Include instrument type selection
    - Include checklist items editor (add/remove/reorder)
    - Mark required items
    - Increment version on update
    - Call TemplateService on submit
    - _Requirements: 17.1, 17.4, 17.5, 17.7_

  - [ ] 44.3 Configure template routes
    - Add /templates route with AuthGuard
    - Add /templates/new route with RoleGuard (Manager/Admin)
    - Add /templates/:id route
    - Add /templates/:id/edit route with RoleGuard (Manager/Admin)
    - _Requirements: 1.4, 1.5_

  - [ ]* 44.4 Write unit tests for template components
    - Test list component displays data correctly
    - Test checklist editor functionality
    - Test version increment on update
    - _Requirements: 17.1, 17.4, 17.7_


### Phase 24: Frontend Notifications and Admin

- [ ] 45. Implement notification feature
  - [ ] 45.1 Create NotificationCenterComponent
    - Display notifications list
    - Show unread count badge
    - Implement mark as read functionality
    - Implement mark all as read button
    - Link to related entities
    - Auto-refresh with polling or WebSocket
    - _Requirements: 11.4_

  - [ ] 45.2 Create NotificationPreferencesComponent
    - Display notification preferences form
    - Include toggles for email and in-app notifications
    - Include toggles for each notification type
    - Call NotificationService on submit
    - _Requirements: 11.5_

  - [ ] 45.3 Add notification bell to app header
    - Show notification icon with unread count
    - Open dropdown with recent notifications
    - Link to notification center
    - _Requirements: 11.4_

  - [ ] 45.4 Configure notification routes
    - Add /notifications route with AuthGuard
    - Add /notifications/preferences route with AuthGuard
    - _Requirements: 11.4, 11.5_

- [ ] 46. Implement admin feature
  - [ ] 46.1 Create UserManagementComponent
    - Display users in data table
    - Implement filtering by role
    - Add "Create User" button (Admin only)
    - Add row actions (view, edit, delete, reset password)
    - _Requirements: 1.4_

  - [ ] 46.2 Create UserFormComponent
    - Create form for user creation/editing
    - Include email, first name, last name inputs
    - Include role selection
    - Include customer selection (for Customer_User role)
    - Include password input (creation only)
    - Implement form validation
    - _Requirements: 1.4, 1.7_

  - [ ] 46.3 Create AuditLogComponent
    - Display audit logs in data table
    - Implement filtering by user, entity, action, date range
    - Show before/after values for updates
    - Prevent modification/deletion
    - _Requirements: 13.4, 13.5, 13.6_

  - [ ] 46.4 Create SystemSettingsComponent
    - Display system configuration options
    - Include backup settings
    - Include notification settings
    - Include general settings
    - _Requirements: 20.1, 20.2_

  - [ ] 46.5 Configure admin routes
    - Add /admin route with RoleGuard (Admin only)
    - Add /admin/users route
    - Add /admin/audit-log route
    - Add /admin/settings route
    - _Requirements: 1.4, 13.6_

  - [ ]* 46.6 Write unit tests for admin components
    - Test user management CRUD operations
    - Test audit log filtering
    - Test role-based access
    - _Requirements: 1.4, 13.4, 13.6_


### Phase 25: Frontend Customer Portal and Final Integration

- [ ] 47. Implement customer portal
  - [ ] 47.1 Create CustomerPortalDashboardComponent
    - Display customer-specific dashboard
    - Show customer's service requests
    - Show customer's instruments
    - Show customer's invoices
    - Restrict to Customer_User role
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 47.2 Create CustomerProfileComponent
    - Display customer contact information
    - Allow editing of contact information
    - Implement form validation
    - Call CustomerService on submit
    - _Requirements: 18.7_

  - [ ] 47.3 Configure customer portal routes
    - Add /portal route with RoleGuard (Customer_User only)
    - Add /portal/profile route
    - Add /portal/service-requests route
    - Add /portal/instruments route
    - Add /portal/invoices route
    - _Requirements: 18.1, 18.7_

  - [ ]* 47.4 Write unit tests for customer portal
    - Test data isolation works correctly
    - Test customer can only see their own data
    - Test profile update functionality
    - _Requirements: 18.1, 18.6, 18.7_

- [ ] 48. Implement app layout and navigation
  - [ ] 48.1 Create AppLayoutComponent
    - Create main layout with header, sidebar, content area
    - Include navigation menu
    - Include user profile dropdown
    - Include notification bell
    - Make responsive for mobile
    - _Requirements: UX consistency_

  - [ ] 48.2 Create NavigationMenuComponent
    - Display role-based navigation menu
    - Show different menu items based on user role
    - Highlight active route
    - Collapse on mobile
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

  - [ ] 48.3 Update app routing configuration
    - Configure all feature routes
    - Set up route guards
    - Configure lazy loading for feature modules
    - Set default routes by role
    - _Requirements: All routing requirements_

- [ ] 49. Checkpoint - Verify frontend completeness
  - Test all components render correctly
  - Test all forms validate correctly
  - Test all API calls work correctly
  - Test role-based access control works
  - Test navigation works correctly
  - Test responsive design on mobile
  - Ensure all tests pass, ask the user if questions arise.


### Phase 26: Integration, Testing, and Deployment

- [ ] 50. Implement end-to-end integration
  - [ ] 50.1 Connect frontend to backend API
    - Configure API base URL in environment files
    - Test all API endpoints from frontend
    - Verify authentication flow works end-to-end
    - Verify file uploads work correctly
    - _Requirements: All API integration_

  - [ ] 50.2 Implement error handling and user feedback
    - Test error scenarios and verify user-friendly messages
    - Implement toast notifications for success/error messages
    - Implement loading states for async operations
    - _Requirements: 14.3, 14.4_

  - [ ] 50.3 Implement data export/import UI
    - Add CSV export buttons to list components
    - Create CSV import dialog components
    - Test export functionality
    - Test import with validation errors
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 51. Comprehensive testing
  - [ ]* 51.1 Run all property-based tests
    - Execute all 65 property tests on backend
    - Verify all properties pass with 100+ iterations
    - Fix any failing properties
    - _Requirements: All correctness properties_

  - [ ]* 51.2 Run all unit tests
    - Execute frontend unit tests with Karma
    - Execute backend unit tests with Jest
    - Achieve 80%+ code coverage
    - Fix any failing tests
    - _Requirements: Code quality_

  - [ ]* 51.3 Perform integration testing
    - Test complete user workflows end-to-end
    - Test service request creation to invoice generation flow
    - Test work order assignment to completion flow
    - Test customer portal data isolation
    - _Requirements: All workflows_

  - [ ]* 51.4 Perform accessibility testing
    - Test keyboard navigation
    - Test screen reader compatibility
    - Verify ARIA attributes
    - Test color contrast ratios
    - _Requirements: Accessibility compliance_

  - [ ]* 51.5 Perform performance testing
    - Test page load times
    - Test API response times
    - Test with large datasets (1000+ records)
    - Verify pagination works correctly
    - _Requirements: 19.1, 19.2, 19.3, 19.4_


- [ ] 52. Deployment preparation
  - [ ] 52.1 Set up Docker containers
    - Create Dockerfile for backend Node.js application
    - Create Dockerfile for frontend Angular application
    - Create Dockerfile for PostgreSQL database
    - Create docker-compose.yml for local development
    - _Requirements: Infrastructure_

  - [ ] 52.2 Configure environment variables
    - Set up production environment configuration
    - Configure database connection strings
    - Configure JWT secrets
    - Configure SMTP settings for email
    - Configure file storage paths
    - _Requirements: Configuration management_

  - [ ] 52.3 Set up database backup system
    - Implement automated daily backup script
    - Configure backup retention policy
    - Test backup and restore procedures
    - Set up backup failure notifications
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ]* 52.4 Write property tests for backup system
    - **Property 62: Backup Integrity Verification**
    - **Validates: Requirements 20.3**

  - [ ]* 52.5 Write property tests for backup alerting
    - **Property 63: Backup Failure Alerting**
    - **Validates: Requirements 20.4**

  - [ ]* 52.6 Write property tests for backup logging
    - **Property 64: Backup and Recovery Logging**
    - **Validates: Requirements 20.6**

  - [ ]* 52.7 Write property tests for database recovery
    - **Property 65: Database Recovery Correctness**
    - **Validates: Requirements 20.5**

  - [ ] 52.8 Configure Nginx reverse proxy
    - Set up Nginx configuration
    - Configure SSL/TLS certificates
    - Configure static file serving
    - Configure API proxy to backend
    - _Requirements: Infrastructure_

  - [ ] 52.9 Set up PM2 for Node.js process management
    - Configure PM2 for backend application
    - Set up auto-restart on failure
    - Configure logging
    - _Requirements: Infrastructure_

  - [ ] 52.10 Create deployment documentation
    - Document deployment steps
    - Document environment configuration
    - Document backup/restore procedures
    - Document troubleshooting guide
    - _Requirements: Operations_

- [ ] 53. Final checkpoint - Production readiness
  - Verify all features work correctly in production environment
  - Verify all tests pass (unit, property-based, integration)
  - Verify database migrations run successfully
  - Verify backup system works correctly
  - Verify monitoring and logging work correctly
  - Verify security configurations are correct
  - Ensure all tests pass, ask the user if questions arise.


## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate the 65 correctness properties defined in the design document
- Checkpoints ensure incremental validation at key milestones
- The implementation follows an incremental approach: backend infrastructure → backend features → frontend infrastructure → frontend features → integration → deployment
- All property tests should run with minimum 100 iterations using fast-check library
- Code coverage target is 80% for both frontend and backend
- The system uses TypeScript throughout for type safety
- Authentication uses JWT tokens stored in memory (not localStorage) for security
- All API responses follow consistent format with success/error structure
- Database triggers handle automatic audit logging and inventory management
- Role-based access control is enforced at both frontend (route guards) and backend (middleware) layers

## Implementation Strategy

The tasks are organized into 26 phases that build upon each other:

1. **Phases 1-2**: Backend infrastructure and authentication foundation
2. **Phases 3-7**: Core backend services (service requests, customers, instruments, notifications, work orders)
3. **Phases 8-10**: Backend business logic (service records, parts, invoicing, templates, search, audit, reporting)
4. **Phases 11-12**: Backend validation, error handling, performance, user management, customer portal
5. **Phases 13-15**: Frontend infrastructure and shared component library
6. **Phases 16-24**: Frontend features matching backend capabilities
7. **Phase 25**: Customer portal and final frontend integration
8. **Phase 26**: End-to-end integration, comprehensive testing, and deployment

This approach ensures that:
- Backend APIs are available before frontend components need them
- Shared components are built before feature-specific components
- Testing is integrated throughout, not left to the end
- Each phase has clear deliverables and checkpoints
- The system can be incrementally validated at each checkpoint

## Getting Started

To begin implementation:

1. Start with Phase 1, Task 1: Initialize backend project structure
2. Complete each task in sequence within a phase
3. Run checkpoint tasks to verify progress before moving to the next phase
4. Mark tasks as complete using the checkbox syntax
5. Optional tasks (marked with `*`) can be skipped initially and added later

The complete implementation will result in a production-ready service management system with comprehensive testing, security, and operational capabilities.
