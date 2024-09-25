export interface ICrud<T> {
    create(item: Partial<T>): Promise<T>;
    read(id: number | string): Promise<T | null>;
    update(id: number | string, item: Partial<T>): Promise<T>;
    delete(id: number | string): Promise<boolean>;
  }