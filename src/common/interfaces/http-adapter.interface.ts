export interface httpAdapter {
  get<T>(url: string): Promise<T>;
}
