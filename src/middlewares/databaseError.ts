export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DatabaseError';
    }
  }
  // src/services/serviceService.ts
  import { ILogger } from '../interfaces/ILogger';
  import { ITracer } from '../interfaces/ITracer';
  import { Service } from '../models/serviceModel';
  import { ICRUD, IQuery } from '../interfaces/database';
  import { DatabaseError } from '../errors/DatabaseError';
  export class ServiceService {
    private serviceRepository: ICRUD<Service> & IQuery<Service>;
    constructor(
      private database: Database,
      private logger: ILogger,
      private tracer: ITracer
    ) {
      this.serviceRepository = database.getRepository(Service);
    }
    public async getServiceData(limit?: number, offset?: number) {
      const span = this.tracer.startSpan('ServiceService.getServiceData');
      try {
        return await this.serviceRepository.findAll(limit, offset);
      } catch (error) {
        if (error instanceof DatabaseError) {
          this.logger.error('Database error in getServiceData', error);
          throw error;
        }
        this.logger.error('Unexpected error in getServiceData', error);
        throw new Error('An unexpected error occurred');
      } finally {
        span.end();
      }
    }
    public async createServiceData(data: Partial<Service>) {
      const span = this.tracer.startSpan('ServiceService.createServiceData');
      try {
        // Validate data here before passing to create
        return await this.serviceRepository.create(data);
      } catch (error) {
        if (error instanceof DatabaseError) {
          this.logger.error('Database error in createServiceData', error);
          throw error;
        }
        this.logger.error('Unexpected error in createServiceData', error);
        throw new Error('An unexpected error occurred');
      } finally {
        span.end();
      }
    }
  }