/**
 * @fileoverview Tests for User Service and its decorators
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  UserService,
  CachingUserService,
  createUserService,
} from "@/services/api";
import type { ApiResponse } from "@/entities/user";

/**
 * Creates a mock API response with specified number of results
 * @param {number} numResults - Number of results to include in response
 * @returns {ApiResponse} Mocked API response
 */
const createMockResponse = (numResults: number): ApiResponse => ({
  results: Array(numResults).fill({
    login: { uuid: "123", username: "johndoe" },
    name: { title: "Mr", first: "John", last: "Doe" },
    email: "john@example.com",
    picture: {
      large: "large-url",
      medium: "medium-url",
      thumbnail: "thumb-url",
    },
    location: {
      street: { number: 123, name: "Main St" },
      city: "New York",
      state: "NY",
      postcode: "10001",
      country: "USA",
    },
    phone: "1234567890",
    cell: "0987654321",
    nat: "US",
    dob: { date: "1990-01-01", age: 33 },
    gender: "male",
  }),
  info: {
    page: 1,
    results: numResults,
    seed: "abc",
    version: "1.0",
  },
});

describe("UserService", () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockResponse(10)),
        }) as Promise<Response>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test base UserService
   */
  describe("Base UserService", () => {
    it("should fetch users with default parameters", async () => {
      const service = new UserService();
      await service.fetchUsers();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://randomuser.me/api/?page=1&results=10&seed=abc"
      );
    });

    it("should handle HTTP errors", async () => {
      global.fetch = vi.fn(
        () =>
          Promise.resolve({
            ok: false,
            status: 500,
          }) as Promise<Response>
      );

      const service = new UserService();
      await expect(service.fetchUsers()).rejects.toThrow(
        "HTTP error! status: 500"
      );
    });
  });

  /**
   * Test CachingUserService decorator
   */
  describe("CachingUserService", () => {
    let baseService: UserService;
    let cachingService: CachingUserService;

    beforeEach(() => {
      baseService = new UserService();
      cachingService = new CachingUserService(baseService, 1000); // 1 second TTL
    });

    it("should cache responses", async () => {
      const mockResponse = createMockResponse(10);
      global.fetch = vi.fn(
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse),
          }) as Promise<Response>
      );

      // First request
      const firstResponse = await cachingService.fetchUsers({
        page: 1,
        results: 10,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second request (should use cache)
      const secondResponse = await cachingService.fetchUsers({
        page: 1,
        results: 10,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(secondResponse).toEqual(firstResponse);
    });

    it("should expire cache after TTL", async () => {
      await cachingService.fetchUsers({ page: 1, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      await cachingService.fetchUsers({ page: 1, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should clear cache", async () => {
      await cachingService.fetchUsers({ page: 1, results: 10 });
      cachingService.clearCache();
      await cachingService.fetchUsers({ page: 1, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should invalidate specific page", async () => {
      await cachingService.fetchUsers({ page: 1, results: 10 });
      await cachingService.fetchUsers({ page: 2, results: 10 });

      cachingService.invalidatePage(1, 10);

      await cachingService.fetchUsers({ page: 1, results: 10 }); // Should fetch
      await cachingService.fetchUsers({ page: 2, results: 10 }); // Should use cache

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  /**
   * Test service factory
   */
  describe("createUserService factory", () => {
    it("should create base service without decorators", () => {
      const service = createUserService({
        enableCaching: false,
      });
      expect(service).toBeInstanceOf(UserService);
    });

    it("should create service with cache decorator", () => {
      const service = createUserService({
        enableCaching: true,
      });
      expect(service).toBeInstanceOf(CachingUserService);
    });

    it("should handle multiple requests with cache enabled", async () => {
      const service = createUserService({
        enableCaching: true,
        cacheTTL: 1000,
      });

      // First request
      await service.fetchUsers({ page: 1, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second request should use cache
      await service.fetchUsers({ page: 1, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Different parameters should make new request
      await service.fetchUsers({ page: 2, results: 10 });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
