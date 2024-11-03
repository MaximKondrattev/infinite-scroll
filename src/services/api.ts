import { ApiResponse, User } from "@/entities/user";

/**
 * Options for fetching users from the API
 */
export interface FetchUsersOptions {
  /** Page number to fetch */
  page?: number;
  /** Number of results per page */
  results?: number;
}

/**
 * Abstract base class for user fetching service
 * @abstract
 */
abstract class BaseUserService {
  /**
   * Abstract method for fetching users
   * @param {FetchUsersOptions} options - Options for fetching users
   * @returns {Promise<ApiResponse>} Promise resolving to API response
   */
  abstract fetchUsers(
    options?: FetchUsersOptions
  ): Promise<ApiResponse | undefined>;
}

/**
 * Concrete implementation of user fetching service
 * @implements {BaseUserService}
 */
export class UserService extends BaseUserService {
  /**
   * Fetches users from the randomuser.me API
   * @param {FetchUsersOptions} options - Options for the API request
   * @returns {Promise<ApiResponse>} Promise resolving to the API response
   * @throws {Error} When the API request fails
   */
  async fetchUsers({ page = 1, results = 10 }: FetchUsersOptions = {}): Promise<
    ApiResponse | undefined
  > {
    try {
      const response = await fetch(
        `https://randomuser.me/api/?page=${page}&results=${results}&seed=abc`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as ApiResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching users:", error.message);
        throw error;
      }
    }
  }
}

/**
 * Base decorator class for user service
 * @abstract
 */
abstract class UserServiceDecorator extends BaseUserService {
  /**
   * Protected service instance
   */
  protected service: BaseUserService;

  /**
   * @param {BaseUserService} service - Service to decorate
   */
  constructor(service: BaseUserService) {
    super();
    this.service = service;
  }

  /**
   * Pass through method to decorated service
   */
  async fetchUsers(
    options?: FetchUsersOptions
  ): Promise<ApiResponse | undefined> {
    return this.service.fetchUsers(options);
  }
}

/**
 * Caching decorator for user service
 * @extends {UserServiceDecorator}
 */
export class CachingUserService extends UserServiceDecorator {
  /**
   * Cache for storing API responses
   */
  private cache = new Map<string, User[]>();

  /**
   * Cache TTL in milliseconds
   */
  private cacheTTL: number;

  /**
   * @param {BaseUserService} service - Service to decorate
   * @param {number} cacheTTL - Cache time to live in milliseconds
   */
  constructor(service: BaseUserService, cacheTTL: number = 5 * 60 * 1000) {
    super(service);
    this.cacheTTL = cacheTTL;
  }

  /**
   * Fetches users with caching
   */
  async fetchUsers({ page = 1, results = 10 }: FetchUsersOptions = {}): Promise<
    ApiResponse | undefined
  > {
    const cacheKey = this.getCacheKey(page, results);

    if (this.cache.has(cacheKey)) {
      return {
        results: this.cache.get(cacheKey) as User[],
        info: {
          page,
          results,
          seed: "abc",
          version: "1.0",
        },
      };
    }

    const response = await super.fetchUsers({ page, results });

    if (response) {
      this.cache.set(cacheKey, response.results);
      this.setupCacheExpiration(cacheKey);
    }

    return response;
  }

  /**
   * Generates cache key from parameters
   * @private
   */
  private getCacheKey(page: number, results: number): string {
    return `page_${page}_${results}`;
  }

  /**
   * Sets up cache expiration for a key
   * @private
   */
  private setupCacheExpiration(key: string): void {
    setTimeout(() => {
      this.cache.delete(key);
    }, this.cacheTTL);
  }

  /**
   * Clears the entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalidates specific page in cache
   * @param {number} page - Page number to invalidate
   * @param {number} results - Results per page
   */
  invalidatePage(page: number, results: number): void {
    const key = this.getCacheKey(page, results);
    this.cache.delete(key);
  }
}

/**
 * Logging decorator for user service
 * @extends {UserServiceDecorator}
 */

/**
 * Factory function to create decorated user service
 * @param {Object} options - Options for service creation
 * @returns {BaseUserService} Decorated user service
 */
export function createUserService({
  enableCaching = true,
  cacheTTL = 5 * 60 * 1000,
} = {}): BaseUserService {
  let service: BaseUserService = new UserService();

  if (enableCaching) {
    service = new CachingUserService(service, cacheTTL);
  }

  return service;
}
