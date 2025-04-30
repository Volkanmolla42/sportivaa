import { supabase } from "@/lib/supabaseClient";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
  search?: {
    column: string;
    query: string;
  };
}

interface QueryResult<T> {
  data: T[];
  count: number;
  error: Error | null;
}

export class QueryBuilder<T> {
  private query: PostgrestFilterBuilder<any, any, any>;
  private readonly options: Required<QueryOptions>;

  constructor(table: string, options: QueryOptions = {}) {
    this.query = supabase.from(table).select();
    this.options = {
      page: options.page || 1,
      limit: options.limit || 10,
      sortBy: options.sortBy || "created_at",
      sortOrder: options.sortOrder || "desc",
      filters: options.filters || {},
      search: options.search || { column: "", query: "" },
    };
  }

  select(columns: string): this {
    this.query = this.query.select(columns);
    return this;
  }

  where(column: string, operator: string, value: unknown): this {
    this.query = this.query.filter(column, operator, value);
    return this;
  }

  whereIn(column: string, values: unknown[]): this {
    this.query = this.query.in(column, values);
    return this;
  }

  whereNotIn(column: string, values: unknown[]): this {
    this.query = this.query.not(column, "in", `(${values.join(",")})`);
    return this;
  }

  whereLike(column: string, pattern: string): this {
    this.query = this.query.ilike(column, `%${pattern}%`);
    return this;
  }

  orderBy(column: string, order: "asc" | "desc" = "asc"): this {
    this.query = this.query.order(column, { ascending: order === "asc" });
    return this;
  }

  limit(limit: number): this {
    this.query = this.query.limit(limit);
    return this;
  }

  offset(offset: number): this {
    this.query = this.query.range(offset, offset + this.options.limit - 1);
    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    try {
      const countQuery = this.query.count().single();
      const dataQuery = this.query;

      const [{ count, error: countError }, { data, error: dataError }] = await Promise.all([
        countQuery,
        dataQuery,
      ]);

      if (countError) throw countError;
      if (dataError) throw dataError;

      return {
        data: (data || []) as T[],
        count: count || 0,
        error: null,
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error : new Error("Query execution failed"),
      };
    }
  }

  async single(): Promise<{ data: T | null; error: Error | null }> {
    try {
      const { data, error } = await this.query.single();

      if (error) throw error;

      return {
        data: data as T,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Query execution failed"),
      };
    }
  }
}
