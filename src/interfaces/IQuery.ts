export interface IQuery<T> {
  findAll(limit?: number, offset?: number): Promise<T[]>;
  findBy(criteria: Partial<T>): Promise<T[]>;
  count(criteria?: Partial<T>): Promise<number>;
}